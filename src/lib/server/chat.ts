import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { requireApproved } from "@/lib/server/profile";
import { runArena } from "@/lib/server/orchestrate";
import type { Chat, Message, Project } from "@/lib/types";

export const listMyChats = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<Chat>`
      select id, user_id, project_id, title, created_at, updated_at
      from chats where user_id = ${context.userId}
      order by updated_at desc
    `;
  });

export const listMyProjects = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<Project>`
      select id, user_id, name, instructions, created_at
      from projects where user_id = ${context.userId}
      order by created_at desc
    `;
  });

export const createProject = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { name: string; instructions: string }) => input)
  .handler(async ({ context, data }) => {
    await requireApproved(context.userId);
    const sql = await getSql();
    const rows = await sql<Project>`
      insert into projects (user_id, name, instructions)
      values (${context.userId}, ${data.name.trim() || "Untitled desk"}, ${data.instructions.trim()})
      returning id, user_id, name, instructions, created_at
    `;
    return rows[0];
  });

export const getChat = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const chats = await sql<Chat>`
      select id, user_id, project_id, title, created_at, updated_at
      from chats where id = ${id} and user_id = ${context.userId}
    `;
    const chat = chats[0];
    if (!chat) return null;
    const messages = await sql<Message>`
      select id, chat_id, user_id, role, content, task_id, created_at
      from messages where chat_id = ${id} order by id
    `;
    return { chat, messages };
  });

export const sendChat = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: { prompt: string; chatId?: number; projectId?: number; preference?: "quality" | "cost" }) =>
      input,
  )
  .handler(async ({ context, data }) => {
    await requireApproved(context.userId);
    const sql = await getSql();
    let chatId = data.chatId;
    const title = data.prompt.trim().slice(0, 72) || "New bearing";

    if (!chatId) {
      const created = await sql<Chat>`
        insert into chats (user_id, project_id, title)
        values (${context.userId}, ${data.projectId ?? null}, ${title})
        returning id, user_id, project_id, title, created_at, updated_at
      `;
      chatId = created[0].id;
    } else {
      const owned = await sql<{ id: number }>`
        select id from chats where id = ${chatId} and user_id = ${context.userId}
      `;
      if (!owned[0]) throw new Error("Chat not found.");
    }

    let prompt = data.prompt.trim();
    if (data.projectId) {
      const proj = await sql<Project>`
        select id, user_id, name, instructions, created_at
        from projects where id = ${data.projectId} and user_id = ${context.userId}
      `;
      if (proj[0]?.instructions) {
        prompt = `Standing instructions for this project (${proj[0].name}):\n${proj[0].instructions}\n\nTask:\n${prompt}`;
      }
    }

    await sql`
      insert into messages (chat_id, user_id, role, content)
      values (${chatId}, ${context.userId}, 'user', ${data.prompt.trim()})
    `;

    const arena = await runArena(context.userId, {
      prompt,
      source: "chat",
      chatId,
      preference: data.preference ?? "quality",
    });

    const answer = arena.task.consensus_answer ?? "The arena could not settle.";
    await sql`
      insert into messages (chat_id, user_id, role, content, task_id)
      values (${chatId}, ${context.userId}, 'assistant', ${answer}, ${arena.task.id})
    `;
    await sql`
      update chats set updated_at = now(), title = case when title = 'New bearing' then ${title} else title end
      where id = ${chatId} and user_id = ${context.userId}
    `;

    const messages = await sql<Message>`
      select id, chat_id, user_id, role, content, task_id, created_at
      from messages where chat_id = ${chatId} order by id
    `;
    const chats = await sql<Chat>`
      select id, user_id, project_id, title, created_at, updated_at
      from chats where id = ${chatId}
    `;
    return { chat: chats[0], messages, arena };
  });
