import { createHash } from "node:crypto";
import { UnauthorizedError, requireUserId } from "@/lib/auth/verify.server";
import { getSql } from "@/lib/db";
import { ADDRESSES, CHAIN, CONTRACTS } from "@/lib/web3/protocol";
import { mapAgent } from "@/lib/server/catalog-fns";
import { asStringArray } from "@/lib/server/parse";
import { runArena } from "@/lib/server/orchestrate";
import type { Agent, Miniapp, Submission, Task } from "@/lib/types";

type AgentRow = Parameters<typeof mapAgent>[0];

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function hashKey(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function resolveUserId(request: Request): Promise<string> {
  const header = request.headers.get("authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (token.startsWith("sk_live_")) {
    const sql = await getSql();
    const rows = await sql<{ user_id: string }>`
      select user_id from api_keys where key_hash = ${hashKey(token)} limit 1
    `;
    if (!rows[0]) throw new UnauthorizedError();
    return rows[0].user_id;
  }
  return requireUserId(token || undefined);
}

async function readBody(request: Request): Promise<Record<string, unknown>> {
  const text = await request.text();
  if (!text.trim()) return {};
  const parsed: unknown = JSON.parse(text);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("JSON object required.");
  }
  return parsed as Record<string, unknown>;
}

/**
 * Express-style Node handler for `/api/v1/*`.
 * JS-first REST (not NestJS) so the protocol bill stays on the cheap side.
 */
export async function handleProtocolApi(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/v1\/?/, "/").replace(/\/$/, "") || "/";
  const method = request.method.toUpperCase();

  try {
    if (method === "GET" && path === "/") {
      return json({
        name: "Sceila Protocol API",
        version: "v1",
        runtime: "express",
        stack: {
          frontend: "react + typescript + tailwind + shadcn/ui",
          backend: "nodejs + express (js-first; not nestjs)",
          web3: "solidity + hardhat · base sepolia",
        },
        chain: CHAIN.name,
        docs: "/developers",
        endpoints: {
          "GET /api/v1": "This catalog",
          "GET /api/v1/health": "Liveness",
          "GET /api/v1/stack": "Frontend / backend / web3",
          "GET /api/v1/agents": "List active agents",
          "GET /api/v1/agents/:slug": "Agent identity + TBA",
          "GET /api/v1/miniapps": "Demand-side miniapps",
          "GET /api/v1/contracts": "Hardhat addresses + ABI",
          "POST /api/v1/tasks": "Open an arena (session or sk_live_ key)",
          "GET /api/v1/tasks/:id": "Settled arena for the caller",
        },
      });
    }

    if (method === "GET" && path === "/health") {
      return json({ ok: true, runtime: "express", chain: CHAIN.name });
    }

    if (method === "GET" && path === "/stack") {
      return json({
        frontend: {
          runtime: "react",
          language: "typescript",
          ui: ["tailwind", "shadcn/ui"],
        },
        backend: {
          runtime: "nodejs",
          framework: "express",
          language: "javascript",
          note: "JS-first REST. NestJS was not used — higher cost for the same protocol surface.",
        },
        web3: {
          language: "solidity",
          toolchain: "hardhat",
          chain: CHAIN.name,
          chainId: CHAIN.id,
          contracts: CONTRACTS.map((c) => c.name),
        },
      });
    }

    if (method === "GET" && path === "/contracts") {
      return json({ chain: CHAIN, addresses: ADDRESSES, contracts: CONTRACTS });
    }

    if (method === "GET" && path === "/agents") {
      const skill = url.searchParams.get("skill");
      const sql = await getSql();
      const rows = await sql<AgentRow>`
        select id, owner_user_id, token_id, tba_address, slug, name, description, kind, endpoint,
               skills, capabilities, tools, models, template, stake_usdc, reputation, tasks_completed,
               accuracy, status, hire_price_usdc, created_at
        from agents where status = 'active' order by reputation desc
      `;
      let agents: Agent[] = rows.map(mapAgent);
      if (skill) {
        agents = agents.filter((a) => a.skills.includes(skill));
      }
      return json({ agents });
    }

    const agentMatch = path.match(/^\/agents\/([^/]+)$/);
    if (method === "GET" && agentMatch) {
      const sql = await getSql();
      const rows = await sql<AgentRow>`
        select id, owner_user_id, token_id, tba_address, slug, name, description, kind, endpoint,
               skills, capabilities, tools, models, template, stake_usdc, reputation, tasks_completed,
               accuracy, status, hire_price_usdc, created_at
        from agents where slug = ${agentMatch[1]}
      `;
      if (!rows[0]) return json({ error: "Agent not found" }, 404);
      return json({
        agent: mapAgent(rows[0]),
        identity: {
          chain: CHAIN.name,
          tokenId: rows[0].token_id,
          contract: ADDRESSES.identity,
          tba: rows[0].tba_address,
          registry: ADDRESSES.tba,
        },
      });
    }

    if (method === "GET" && path === "/miniapps") {
      const sql = await getSql();
      const apps = await sql<Miniapp>`
        select id, slug, name, tagline, description, category, publisher, price_model, status,
               prompt_hint, consensus_method, submitter_user_id
        from miniapps where status = 'published' order by id
      `;
      return json({ miniapps: apps });
    }

    if (method === "POST" && path === "/tasks") {
      const userId = await resolveUserId(request);
      const body = await readBody(request);
      const prompt = typeof body.prompt === "string" ? body.prompt : "";
      const preference = body.preference === "cost" ? "cost" : "quality";
      const consensus = typeof body.consensus === "string" ? body.consensus : undefined;
      const source = typeof body.source === "string" ? body.source : "api";
      const arena = await runArena(userId, {
        prompt,
        source,
        preference,
        consensus,
      });
      return json({ task: arena.task, submissions: arena.submissions }, 201);
    }

    const taskMatch = path.match(/^\/tasks\/(\d+)$/);
    if (method === "GET" && taskMatch) {
      const userId = await resolveUserId(request);
      const taskId = Number(taskMatch[1]);
      const sql = await getSql();
      const tasks = await sql<Task>`
        select id, user_id, source, miniapp_slug, chat_id, prompt, classification, consensus_method,
               status, consensus_answer, confidence, agreement, reward_usdc, created_at
        from tasks where id = ${taskId} and user_id = ${userId}
      `;
      const task = tasks[0];
      if (!task) return json({ error: "Task not found" }, 404);
      const subs = await sql<
        Submission & { agent_name: string; agent_slug: string; evidence: unknown }
      >`
        select s.id, s.task_id, s.agent_id, s.role, s.answer, s.evidence, s.confidence,
               s.score_accuracy, s.score_evidence, s.score_reliability, s.reward_usdc, s.slashed_usdc,
               a.name as agent_name, a.slug as agent_slug
        from submissions s
        join agents a on a.id = s.agent_id
        where s.task_id = ${taskId}
        order by s.id
      `;
      return json({
        task,
        submissions: subs.map((s) => ({ ...s, evidence: asStringArray(s.evidence) })),
      });
    }

    return json({ error: "Not found" }, 404);
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return json({ error: "Unauthorized" }, 401);
    }
    const msg = err instanceof Error ? err.message : "Server error";
    const status = msg === "WAITLIST" ? 403 : 400;
    return json({ error: msg }, status);
  }
}
