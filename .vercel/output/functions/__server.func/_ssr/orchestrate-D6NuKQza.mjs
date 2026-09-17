import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-D3KIes5h.mjs";
import { t as authMiddleware } from "./middleware-CSFU6hIZ.mjs";
import { n as createSsrRpc, o as requireApproved } from "./profile-DT1N3liZ.mjs";
import { t as asStringArray } from "./parse-DmEVgOz0.mjs";
import { d as mapAgent } from "./catalog-fns-CPd_Am5k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orchestrate-D6NuKQza.js
var CLASS_SKILLS = {
	research: [
		"research",
		"citations",
		"news",
		"synthesis"
	],
	coding: [
		"coding",
		"review",
		"debugging"
	],
	accounting: [
		"accounting",
		"audit",
		"spreadsheets"
	],
	design: [
		"design",
		"copy",
		"brand"
	],
	academics: [
		"tutoring",
		"academics",
		"writing"
	],
	ops: [
		"ops",
		"planning",
		"scheduling",
		"erp"
	],
	writing: ["writing", "humanize"],
	markets: ["markets", "prediction"],
	general: [
		"research",
		"synthesis",
		"writing"
	]
};
function classify(prompt, hint) {
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
function defaultConsensus(classification, pinned) {
	if (pinned) return pinned;
	if (classification === "coding" || classification === "accounting") return "objective";
	if (classification === "markets") return "prediction";
	if (classification === "design" || classification === "writing") return "jury";
	if (classification === "academics" || classification === "ops") return "expert";
	return "evidence";
}
function scoreAgent(agent, skills) {
	const overlap = agent.skills.filter((s) => skills.includes(s)).length;
	const rep = Number(agent.reputation) || 50;
	const stake = Math.sqrt(Number(agent.stake_usdc) || 1);
	return overlap * 12 + rep * .5 + Math.min(stake, 250) * .04;
}
function extractJson(text) {
	const raw = text.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1] ?? text;
	const start = raw.indexOf("{");
	const end = raw.lastIndexOf("}");
	if (start < 0 || end <= start) return null;
	try {
		return JSON.parse(raw.slice(start, end + 1));
	} catch {
		return null;
	}
}
async function callOrchestratorModel(input) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) throw new Error("AI is not available in this environment");
	const roster = [...input.workers, input.referee].map((a) => `- ${a.slug} (${a.name}): ${a.description} skills=${a.skills.join(",")}`).join("\n");
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .35,
			max_tokens: 1600,
			messages: [{
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
- Preference from requester: ${input.preference}.`
			}, {
				role: "user",
				content: `Task:\n${input.prompt}\n\nWorkers:\n${roster}`
			}]
		})
	});
	if (!res.ok) throw new Error(`xAI API error ${res.status}`);
	const text = (await res.json()).choices[0]?.message.content ?? "";
	const parsed = extractJson(text);
	if (!parsed) return {
		classification: input.classification,
		consensus_method: input.consensus,
		submissions: input.workers.map((w) => ({
			agent_slug: w.slug,
			answer: text.slice(0, 800) || "No structured submission.",
			evidence: [],
			confidence: .5
		})),
		referee: {
			agent_slug: input.referee.slug,
			verdict: "Unstructured model output.",
			scores: []
		},
		consensus: {
			answer: text || "The arena could not settle.",
			confidence: .4,
			agreement: .4
		}
	};
	return parsed;
}
async function runArena(userId, data) {
	const profile = await requireApproved(userId);
	const prompt = data.prompt.trim();
	if (!prompt) throw new Error("Write a task first.");
	if (Number(profile.credits) < 1) throw new Error("No credits left on this plan.");
	const sql = await getSql();
	const agents = (await sql`
    select id, owner_user_id, token_id, tba_address, slug, name, description, kind, endpoint,
           skills, capabilities, tools, models, template, stake_usdc, reputation, tasks_completed,
           accuracy, status, hire_price_usdc, created_at
    from agents where status = 'active'
  `).map(mapAgent);
	const classification = classify(prompt, data.classificationHint);
	const consensus = defaultConsensus(classification, data.consensus);
	const wanted = CLASS_SKILLS[classification] ?? CLASS_SKILLS.general;
	const preference = data.preference ?? "quality";
	const ranked = [...agents].sort((a, b) => {
		const sa = scoreAgent(a, wanted);
		const sb = scoreAgent(b, wanted);
		if (preference === "cost") return Number(a.hire_price_usdc) - sa / 20 - (Number(b.hire_price_usdc) - sb / 20);
		return sb - sa;
	});
	const referee = ranked.find((a) => a.slug === "reef" || a.skills.includes("review")) ?? ranked[0];
	const workers = ranked.filter((a) => a.id !== referee.id).slice(0, 3);
	if (workers.length < 3) throw new Error("Not enough agents on the floor.");
	const model = await callOrchestratorModel({
		prompt,
		classification,
		consensus,
		workers,
		referee,
		preference
	});
	const purse = preference === "cost" ? 1.5 : 3;
	const task = (await sql`
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
      ${model.consensus?.confidence ?? .7},
      ${model.consensus?.agreement ?? .7},
      ${purse}
    )
    returning id, user_id, source, miniapp_slug, chat_id, prompt, classification, consensus_method,
              status, consensus_answer, confidence, agreement, reward_usdc, created_at
  `)[0];
	const submissionsOut = [];
	const scoreMap = new Map((model.referee?.scores ?? []).map((s) => [s.agent_slug, s]));
	for (const worker of workers) {
		const sub = model.submissions?.find((s) => s.agent_slug === worker.slug);
		const scores = scoreMap.get(worker.slug);
		const accuracy = scores?.accuracy ?? sub?.confidence ?? .7;
		const evidence = scores?.evidence ?? .7;
		const reliability = scores?.reliability ?? .7;
		const blended = (accuracy + evidence + reliability) / 3;
		const good = blended >= .62;
		const reward = good ? +(purse * .22).toFixed(2) : 0;
		const slash = good ? 0 : +(Number(worker.stake_usdc) * .004).toFixed(2);
		const row = await sql`
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
			agent_slug: worker.slug
		});
		await sql`
      update agents set
        reputation = ${Math.max(10, Math.min(99.9, Number(worker.reputation) + (good ? .12 : -.35)))},
        tasks_completed = tasks_completed + 1,
        accuracy = (accuracy * 0.92 + ${accuracy} * 0.08),
        stake_usdc = greatest(0, stake_usdc - ${slash} + ${reward})
      where id = ${worker.id}
    `;
	}
	const refRow = await sql`
    insert into submissions (
      task_id, agent_id, role, answer, evidence, confidence,
      score_accuracy, score_evidence, score_reliability, reward_usdc, slashed_usdc
    ) values (
      ${task.id}, ${referee.id}, 'referee',
      ${model.referee?.verdict ?? "Scored the arena."},
      ${JSON.stringify(model.referee?.hallucination_flags ?? [])}::jsonb,
      ${.9}, ${.9}, ${.9}, ${.9}, ${+(purse * .12).toFixed(2)}, ${0}
    )
    returning id, task_id, agent_id, role, answer, evidence, confidence,
              score_accuracy, score_evidence, score_reliability, reward_usdc, slashed_usdc
  `;
	submissionsOut.push({
		...refRow[0],
		evidence: asStringArray(refRow[0].evidence),
		agent_name: referee.name,
		agent_slug: referee.slug
	});
	await sql`
    update agents set
      reputation = least(99.9, reputation + 0.04),
      tasks_completed = tasks_completed + 1,
      stake_usdc = stake_usdc + ${+(purse * .12).toFixed(2)}
    where id = ${referee.id}
  `;
	await sql`update profiles set credits = credits - 1 where user_id = ${userId}`;
	await sql`
    insert into ledger (user_id, kind, amount_usdc, note)
    values (${userId}, 'debit', ${purse}, ${"Task #" + task.id})
  `;
	return {
		task,
		submissions: submissionsOut
	};
}
var orchestrateTask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("e1a932d2fa8a3c8300deb2c83fc5393c638c25c7337aff134d2ef4f60b94df9c"));
var getTaskArena = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((taskId) => taskId).handler(createSsrRpc("928273679f33d8f12cdec18b9de2d5a69544865724ac16652672a221ea353ab2"));
//#endregion
export { orchestrateTask as n, runArena as r, getTaskArena as t };
