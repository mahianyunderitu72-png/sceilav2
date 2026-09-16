import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { asStringArray } from "@/lib/server/parse";
import { requireApproved } from "@/lib/server/profile";
import type { Agent, ArenaResult, Submission, Task } from "@/lib/types";
import { mapAgent } from "@/lib/server/catalog-fns";

type AgentRow = Parameters<typeof mapAgent>[0];

const CLASS_SKILLS: Record<string, string[]> = {
  research: ["research", "citations", "news", "synthesis"],
  coding: ["coding", "review", "debugging"],
  accounting: ["accounting", "audit", "spreadsheets"],
  design: ["design", "copy", "brand"],
  academics: ["tutoring", "academics", "writing"],
  ops: ["ops", "planning", "scheduling", "erp"],
  writing: ["writing", "humanize"],
  markets: ["markets", "prediction"],
  general: ["research", "synthesis", "writing"],
};

function classify(prompt: string, hint?: string | null): string {
  if (hint && CLASS_SKILLS[hint]) return hint;
  const p = prompt.toLowerCase();
  if (/\b(code|function|patch|bug|typescript|python|repo|stack trace)\b/.test(p)) return "coding";
  if (/\b(invoice|ledger|reconcile|gaap|vat|books|pnl|balance sheet)\b/.test(p)) return "accounting";
  if (/\b(design|layout|poster|brand|moodboard|typeface)\b/.test(p)) return "design";
  if (/\b(homework|explain|tutor|quiz|lesson|student)\b/.test(p)) return "academics";
  if (/\b(inventory|order|erp|runbook|schedule|ops)\b/.test(p)) return "ops";
  if (/\b(rewrite|humanize|tone|email draft)\b/.test(p)) return "writing";
  if (/\b(price|forecast|market|ticker|prediction)\b/.test(p)) return "markets";
  if (/\b(research|cite|source|brief|what is|why)\b/.test(p)) return "research";
  return "general";
}

function defaultConsensus(classification: string, pinned?: string | null): string {
  if (pinned) return pinned;
  if (classification === "coding" || classification === "accounting") return "objective";
  if (classification === "markets") return "prediction";
  if (classification === "design" || classification === "writing") return "jury";
  if (classification === "academics" || classification === "ops") return "expert";
  return "evidence";
}

function scoreAgent(agent: Agent, skills: string[]): number {
  const overlap = agent.skills.filter((s) => skills.includes(s)).length;
  const rep = Number(agent.reputation) || 50;
  const stake = Math.sqrt(Number(agent.stake_usdc) || 1);
  return overlap * 12 + rep * 0.5 + Math.min(stake, 250) * 0.04;
}

type ModelJson = {
  classification?: string;
  consensus_method?: string;
  submissions?: Array<{
    agent_slug: string;
    answer: string;
    evidence?: string[];
    confidence?: number;
  }>;
  referee?: {
    agent_slug?: string;
    verdict?: string;
    scores?: Array<{
      agent_slug: string;
      accuracy?: number;
      evidence?: number;
      reliability?: number;
    }>;
    hallucination_flags?: string[];
  };
  consensus?: {
    answer?: string;
    confidence?: number;
    agreement?: number;
  };
};

function extractJson(text: string): ModelJson | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced?.[1] ?? text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1)) as ModelJson;
  } catch {
    return null;
  }
}

async function callOrchestratorModel(input: {
  prompt: string;
  classification: string;
  consensus: string;
  workers: Agent[];
  referee: Agent;
  preference: string;
}): Promise<ModelJson> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error("AI is not available in this environment");

  const roster = [...input.workers, input.referee]
    .map((a) => `- ${a.slug} (${a.name}): ${a.description} skills=${a.skills.join(",")}`)
    .join("\n");

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      temperature: 0.35,
      max_tokens: 1600,
      messages: [
        {
          role: "system",
          content: `You are Sceila's orchestrator. A sailor never trusts one compass.
Simulate an arena of independent AI agents. Each worker answers ALONE. The referee scores evidence and flags hallucination. Then you settle a consensus.
Return ONLY JSON with this shape:
{
  "classification": "${input.classification}",
  "consensus_method": "${input.consensus}",
  "submissions": [
    { "agent_slug": "slug", "answer": "the agent's independent answer", "evidence": ["short source or reason"], "confidence": 0.0 }
  ],
  "referee": {
    "agent_slug": "${input.referee.slug}",
    "verdict": "short note",
    "scores": [{ "agent_slug": "slug", "accuracy": 0.0, "evidence": 0.0, "reliability": 0.0 }],
    "hallucination_flags": []
  },
  "consensus": { "answer": "the settled answer shown to the user", "confidence": 0.0, "agreement": 0.0 }
}
Rules:
- Exactly one submissions[] item per worker listed. Use their slugs.
- Answers must disagree where a careful independent reading would. Do not copy-paste.
- Evidence arenas: every claim needs a source or an explicit uncertainty.
- Objective arenas: prefer a precise, checkable answer.
- Keep each worker answer under 180 words. Consensus answer may be longer, still under 320 words.
- Preference from requester: ${input.preference}.`,
        },
        {
          role: "user",
          content: `Task:\n${input.prompt}\n\nWorkers:\n${roster}`,
        },
      ],
    }),
  });

  if (!res.ok) throw new Error(`xAI API error ${res.status}`);
  const body = (await res.json()) as { choices: { message: { content: string } }[] };
  const text = body.choices[0]?.message.content ?? "";
  const parsed = extractJson(text);
  if (!parsed) {
    return {
      classification: input.classification,
      consensus_method: input.consensus,
      submissions: input.workers.map((w) => ({
        agent_slug: w.slug,
        answer: text.slice(0, 800) || "No structured submission.",
        evidence: [],
        confidence: 0.5,
      })),
      referee: { agent_slug: input.referee.slug, verdict: "Unstructured model output.", scores: [] },
      consensus: { answer: text || "The arena could not settle.", confidence: 0.4, agreement: 0.4 },
    };
  }
  return parsed;
}

export type OrchestrateInput = {
  prompt: string;
  source?: string;
  miniappSlug?: string;
  chatId?: number;
  consensus?: string;
  classificationHint?: string;
  preference?: "quality" | "cost";
};

export async function runArena(userId: string, data: OrchestrateInput): Promise<ArenaResult> {
  const profile = await requireApproved(userId);
  const prompt = data.prompt.trim();
  if (!prompt) throw new Error("Write a task first.");
  if (Number(profile.credits) < 1) throw new Error("No credits left on this plan.");

  const sql = await getSql();
  const rows = await sql<AgentRow>`
    select id, owner_user_id, token_id, tba_address, slug, name, description, kind, endpoint,
           skills, capabilities, tools, models, template, stake_usdc, reputation, tasks_completed,
           accuracy, status, hire_price_usdc, created_at
    from agents where status = 'active'
  `;
  const agents = rows.map(mapAgent);
  const classification = classify(prompt, data.classificationHint);
  const consensus = defaultConsensus(classification, data.consensus);
  const wanted = CLASS_SKILLS[classification] ?? CLASS_SKILLS.general;
  const preference = data.preference ?? "quality";

  const ranked = [...agents].sort((a, b) => {
    const sa = scoreAgent(a, wanted);
    const sb = scoreAgent(b, wanted);
    if (preference === "cost") {
      return Number(a.hire_price_usdc) - sa / 20 - (Number(b.hire_price_usdc) - sb / 20);
    }
    return sb - sa;
  });

  const referee =
    ranked.find((a) => a.slug === "reef" || a.skills.includes("review")) ?? ranked[0];
  const workers = ranked.filter((a) => a.id !== referee.id).slice(0, 3);
  if (workers.length < 3) throw new Error("Not enough agents on the floor.");

  const model = await callOrchestratorModel({
    prompt,
    classification,
    consensus,
    workers,
    referee,
    preference,
  });

  const purse = preference === "cost" ? 1.5 : 3;
  const inserted = await sql<Task>`
    insert into tasks (
      user_id, source, miniapp_slug, chat_id, prompt, classification, consensus_method,
      status, consensus_answer, confidence, agreement, reward_usdc
    ) values (
      ${userId},
      ${data.source ?? "chat"},
      ${data.miniappSlug ?? null},
      ${data.chatId ?? null},
      ${prompt},
      ${model.classification ?? classification},
      ${model.consensus_method ?? consensus},
      'settled',
      ${model.consensus?.answer ?? ""},
      ${model.consensus?.confidence ?? 0.7},
      ${model.consensus?.agreement ?? 0.7},
      ${purse}
    )
    returning id, user_id, source, miniapp_slug, chat_id, prompt, classification, consensus_method,
              status, consensus_answer, confidence, agreement, reward_usdc, created_at
  `;
  const task = inserted[0];

  const submissionsOut: Submission[] = [];
  const scoreMap = new Map((model.referee?.scores ?? []).map((s) => [s.agent_slug, s]));

  for (const worker of workers) {
    const sub = model.submissions?.find((s) => s.agent_slug === worker.slug);
    const scores = scoreMap.get(worker.slug);
    const accuracy = scores?.accuracy ?? sub?.confidence ?? 0.7;
    const evidence = scores?.evidence ?? 0.7;
    const reliability = scores?.reliability ?? 0.7;
    const blended = (accuracy + evidence + reliability) / 3;
    const good = blended >= 0.62;
    const reward = good ? +(purse * 0.22).toFixed(2) : 0;
    const slash = good ? 0 : +(Number(worker.stake_usdc) * 0.004).toFixed(2);

    const row = await sql<Submission>`
      insert into submissions (
        task_id, agent_id, role, answer, evidence, confidence,
        score_accuracy, score_evidence, score_reliability, reward_usdc, slashed_usdc
      ) values (
        ${task.id}, ${worker.id}, 'worker',
        ${sub?.answer ?? "No submission."},
        ${JSON.stringify(sub?.evidence ?? [])}::jsonb,
        ${sub?.confidence ?? blended},
        ${accuracy}, ${evidence}, ${reliability},
        ${reward}, ${slash}
      )
      returning id, task_id, agent_id, role, answer, evidence, confidence,
                score_accuracy, score_evidence, score_reliability, reward_usdc, slashed_usdc
    `;
    submissionsOut.push({
      ...row[0],
      evidence: asStringArray(row[0].evidence),
      agent_name: worker.name,
      agent_slug: worker.slug,
    });

    const nextRep = Math.max(10, Math.min(99.9, Number(worker.reputation) + (good ? 0.12 : -0.35)));
    await sql`
      update agents set
        reputation = ${nextRep},
        tasks_completed = tasks_completed + 1,
        accuracy = (accuracy * 0.92 + ${accuracy} * 0.08),
        stake_usdc = greatest(0, stake_usdc - ${slash} + ${reward})
      where id = ${worker.id}
    `;
  }

  const refRow = await sql<Submission>`
    insert into submissions (
      task_id, agent_id, role, answer, evidence, confidence,
      score_accuracy, score_evidence, score_reliability, reward_usdc, slashed_usdc
    ) values (
      ${task.id}, ${referee.id}, 'referee',
      ${model.referee?.verdict ?? "Scored the arena."},
      ${JSON.stringify(model.referee?.hallucination_flags ?? [])}::jsonb,
      ${0.9}, ${0.9}, ${0.9}, ${0.9}, ${+(purse * 0.12).toFixed(2)}, ${0}
    )
    returning id, task_id, agent_id, role, answer, evidence, confidence,
              score_accuracy, score_evidence, score_reliability, reward_usdc, slashed_usdc
  `;
  submissionsOut.push({
    ...refRow[0],
    evidence: asStringArray(refRow[0].evidence),
    agent_name: referee.name,
    agent_slug: referee.slug,
  });
  await sql`
    update agents set
      reputation = least(99.9, reputation + 0.04),
      tasks_completed = tasks_completed + 1,
      stake_usdc = stake_usdc + ${+(purse * 0.12).toFixed(2)}
    where id = ${referee.id}
  `;

  await sql`update profiles set credits = credits - 1 where user_id = ${userId}`;
  await sql`
    insert into ledger (user_id, kind, amount_usdc, note)
    values (${userId}, 'debit', ${purse}, ${"Task #" + task.id})
  `;

  return { task, submissions: submissionsOut };
}

export const orchestrateTask = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: OrchestrateInput) => input)
  .handler(async ({ context, data }): Promise<ArenaResult> => {
    return runArena(context.userId, data);
  });

export const getTaskArena = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((taskId: number) => taskId)
  .handler(async ({ context, data: taskId }): Promise<ArenaResult | null> => {
    const sql = await getSql();
    const tasks = await sql<Task>`
      select id, user_id, source, miniapp_slug, chat_id, prompt, classification, consensus_method,
             status, consensus_answer, confidence, agreement, reward_usdc, created_at
      from tasks where id = ${taskId} and user_id = ${context.userId}
    `;
    const task = tasks[0];
    if (!task) return null;
    const subs = await sql<Submission & { agent_name: string; agent_slug: string; evidence: unknown }>`
      select s.id, s.task_id, s.agent_id, s.role, s.answer, s.evidence, s.confidence,
             s.score_accuracy, s.score_evidence, s.score_reliability, s.reward_usdc, s.slashed_usdc,
             a.name as agent_name, a.slug as agent_slug
      from submissions s
      join agents a on a.id = s.agent_id
      where s.task_id = ${taskId}
      order by s.id
    `;
    return {
      task,
      submissions: subs.map((s) => ({
        ...s,
        evidence: asStringArray(s.evidence),
      })),
    };
  });
