import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-CuzAb3Pn.mjs";
import { t as authMiddleware } from "./middleware-BOQMsh2Y.mjs";
import { a as requireApproved } from "./profile-BZGV6Lgo.mjs";
import { r as runArena } from "./orchestrate-DMSuP9Tw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-BsRUzXzx.js
var listMyChats_createServerFn_handler = createServerRpc({
	id: "5042f39b5629ff773cecb8b6f3b43d8bb675081a8d5240cd924acea7c9b3149d",
	name: "listMyChats",
	filename: "src/lib/server/chat.ts"
}, (opts) => listMyChats.__executeServer(opts));
var listMyChats = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyChats_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select id, user_id, project_id, title, created_at, updated_at
      from chats where user_id = ${context.userId}
      order by updated_at desc
    `;
});
var listMyProjects_createServerFn_handler = createServerRpc({
	id: "04b0840b5370f6d769378449ad9d0f09c68ea7f238a7d18adfe94b5795ecb649",
	name: "listMyProjects",
	filename: "src/lib/server/chat.ts"
}, (opts) => listMyProjects.__executeServer(opts));
var listMyProjects = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyProjects_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select id, user_id, name, instructions, created_at
      from projects where user_id = ${context.userId}
      order by created_at desc
    `;
});
var createProject_createServerFn_handler = createServerRpc({
	id: "fe2ae5d7c5d915cf54b21a076cb8ec0485e3137b18cc45fc0546ce1580f488b4",
	name: "createProject",
	filename: "src/lib/server/chat.ts"
}, (opts) => createProject.__executeServer(opts));
var createProject = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createProject_createServerFn_handler, async ({ context, data }) => {
	await requireApproved(context.userId);
	return (await (await getSql())`
      insert into projects (user_id, name, instructions)
      values (${context.userId}, ${data.name.trim() || "Untitled desk"}, ${data.instructions.trim()})
      returning id, user_id, name, instructions, created_at
    `)[0];
});
var getChat_createServerFn_handler = createServerRpc({
	id: "bf74cdd61e85d83c19ca7baed79153c72e64d4b82d2fdbc3ecc4be5430faa77d",
	name: "getChat",
	filename: "src/lib/server/chat.ts"
}, (opts) => getChat.__executeServer(opts));
var getChat = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getChat_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await getSql();
	const chat = (await sql`
      select id, user_id, project_id, title, created_at, updated_at
      from chats where id = ${id} and user_id = ${context.userId}
    `)[0];
	if (!chat) return null;
	return {
		chat,
		messages: await sql`
      select id, chat_id, user_id, role, content, task_id, created_at
      from messages where chat_id = ${id} order by id
    `
	};
});
var sendChat_createServerFn_handler = createServerRpc({
	id: "be06624c81eaeafe76136977c66a04f038ec524ef265864bfa343551226403d4",
	name: "sendChat",
	filename: "src/lib/server/chat.ts"
}, (opts) => sendChat.__executeServer(opts));
var sendChat = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(sendChat_createServerFn_handler, async ({ context, data }) => {
	await requireApproved(context.userId);
	const sql = await getSql();
	let chatId = data.chatId;
	const title = data.prompt.trim().slice(0, 72) || "New bearing";
	if (!chatId) chatId = (await sql`
        insert into chats (user_id, project_id, title)
        values (${context.userId}, ${data.projectId ?? null}, ${title})
        returning id, user_id, project_id, title, created_at, updated_at
      `)[0].id;
	else if (!(await sql`
        select id from chats where id = ${chatId} and user_id = ${context.userId}
      `)[0]) throw new Error("Chat not found.");
	let prompt = data.prompt.trim();
	if (data.projectId) {
		const proj = await sql`
        select id, user_id, name, instructions, created_at
        from projects where id = ${data.projectId} and user_id = ${context.userId}
      `;
		if (proj[0]?.instructions) prompt = `Standing instructions for this project (${proj[0].name}):\n${proj[0].instructions}\n\nTask:\n${prompt}`;
	}
	await sql`
      insert into messages (chat_id, user_id, role, content)
      values (${chatId}, ${context.userId}, 'user', ${data.prompt.trim()})
    `;
	const arena = await runArena(context.userId, {
		prompt,
		source: "chat",
		chatId,
		preference: data.preference ?? "quality"
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
	const messages = await sql`
      select id, chat_id, user_id, role, content, task_id, created_at
      from messages where chat_id = ${chatId} order by id
    `;
	return {
		chat: (await sql`
      select id, user_id, project_id, title, created_at, updated_at
      from chats where id = ${chatId}
    `)[0],
		messages,
		arena
	};
});
//#endregion
export { createProject_createServerFn_handler, getChat_createServerFn_handler, listMyChats_createServerFn_handler, listMyProjects_createServerFn_handler, sendChat_createServerFn_handler };
