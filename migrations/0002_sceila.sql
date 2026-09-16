create table if not exists profiles (
  id serial primary key,
  user_id text not null unique,
  display_name text,
  waitlist_status text not null default 'pending',
  waitlist_intent text,
  waitlist_note text,
  wallet_address text,
  plan text not null default 'free',
  credits numeric(18,2) not null default 25,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists profiles_user_id_idx on profiles (user_id);

create table if not exists agents (
  id serial primary key,
  owner_user_id text,
  token_id integer not null,
  tba_address text not null,
  slug text not null unique,
  name text not null,
  description text not null,
  kind text not null default 'hosted',
  endpoint text,
  skills jsonb not null default '[]',
  capabilities jsonb not null default '[]',
  tools jsonb not null default '[]',
  models jsonb not null default '[]',
  template text,
  stake_usdc numeric(18,2) not null default 0,
  reputation numeric(6,2) not null default 50,
  tasks_completed integer not null default 0,
  accuracy numeric(6,4) not null default 0.9000,
  status text not null default 'active',
  hire_price_usdc numeric(18,2) not null default 2.00,
  created_at timestamptz not null default now()
);
create index if not exists agents_owner_idx on agents (owner_user_id);
create index if not exists agents_slug_idx on agents (slug);

create table if not exists miniapps (
  id serial primary key,
  slug text not null unique,
  name text not null,
  tagline text not null,
  description text not null,
  category text not null,
  publisher text not null,
  price_model text not null default 'free',
  status text not null default 'published',
  prompt_hint text not null,
  consensus_method text not null default 'evidence',
  submitter_user_id text,
  created_at timestamptz not null default now()
);

create table if not exists projects (
  id serial primary key,
  user_id text not null,
  name text not null,
  instructions text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists projects_user_id_idx on projects (user_id);

create table if not exists chats (
  id serial primary key,
  user_id text not null,
  project_id integer references projects(id) on delete set null,
  title text not null default 'New bearing',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists chats_user_id_idx on chats (user_id);

create table if not exists tasks (
  id serial primary key,
  user_id text not null,
  source text not null default 'chat',
  miniapp_slug text,
  chat_id integer,
  prompt text not null,
  classification text,
  consensus_method text,
  status text not null default 'settled',
  consensus_answer text,
  confidence numeric(6,4),
  agreement numeric(6,4),
  reward_usdc numeric(18,2) not null default 1.00,
  created_at timestamptz not null default now()
);
create index if not exists tasks_user_id_idx on tasks (user_id);

create table if not exists messages (
  id serial primary key,
  chat_id integer not null references chats(id) on delete cascade,
  user_id text not null,
  role text not null,
  content text not null,
  task_id integer references tasks(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists messages_chat_id_idx on messages (chat_id);

create table if not exists submissions (
  id serial primary key,
  task_id integer not null references tasks(id) on delete cascade,
  agent_id integer not null references agents(id),
  role text not null default 'worker',
  answer text,
  evidence jsonb not null default '[]',
  confidence numeric(6,4),
  score_accuracy numeric(6,4),
  score_evidence numeric(6,4),
  score_reliability numeric(6,4),
  reward_usdc numeric(18,2) not null default 0,
  slashed_usdc numeric(18,2) not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists submissions_task_id_idx on submissions (task_id);

create table if not exists listings (
  id serial primary key,
  seller_user_id text,
  agent_id integer not null references agents(id),
  kind text not null,
  price_usdc numeric(18,2) not null,
  period text,
  status text not null default 'open',
  buyer_user_id text,
  created_at timestamptz not null default now()
);

create table if not exists lessons (
  id serial primary key,
  slug text not null unique,
  title text not null,
  summary text not null,
  body text not null,
  sort_order integer not null default 0,
  published boolean not null default true
);

create table if not exists news (
  id serial primary key,
  slug text not null unique,
  title text not null,
  kicker text not null,
  body text not null,
  published_at timestamptz not null default now()
);

create table if not exists proposals (
  id serial primary key,
  title text not null,
  body text not null,
  status text not null default 'active',
  votes_for integer not null default 0,
  votes_against integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists votes (
  id serial primary key,
  proposal_id integer not null references proposals(id),
  user_id text not null,
  choice text not null,
  unique (proposal_id, user_id)
);

create table if not exists ledger (
  id serial primary key,
  user_id text not null,
  kind text not null,
  amount_usdc numeric(18,2) not null,
  note text,
  created_at timestamptz not null default now()
);
create index if not exists ledger_user_id_idx on ledger (user_id);

create table if not exists api_keys (
  id serial primary key,
  user_id text not null,
  label text not null,
  prefix text not null,
  created_at timestamptz not null default now()
);

insert into agents (
  owner_user_id, token_id, tba_address, slug, name, description, kind, endpoint,
  skills, capabilities, tools, models, stake_usdc, reputation, tasks_completed, accuracy, hire_price_usdc
) values
(
  null, 8004, '0x65518004000a1b2c3d4e5f678901north', 'northstar', 'Northstar',
  'Research agent that will not make a claim without a source. Built for evidence arenas and long briefings.',
  'hosted', 'https://agents.sceila.net/northstar',
  '["research","citations","synthesis"]'::jsonb,
  '["briefings","source maps","claim checks"]'::jsonb,
  '["web","rag"]'::jsonb, '["grok-4.5"]'::jsonb,
  42000, 94.2, 18440, 0.9610, 3.50
),
(
  null, 8005, '0x65518005000a1b2c3d4e5f678901reef0', 'reef', 'Reef',
  'Referee agent. Scores evidence, flags hallucinations, and posts bonds on contested arenas.',
  'hosted', 'https://agents.sceila.net/reef',
  '["review","citations","security"]'::jsonb,
  '["refereeing","challenge bonds","hallucination flags"]'::jsonb,
  '["web","rag","a2a"]'::jsonb, '["grok-4.5"]'::jsonb,
  88000, 97.1, 22110, 0.9810, 4.00
),
(
  null, 8006, '0x65518006000a1b2c3d4e5f678901keel0', 'keelwright', 'Keelwright',
  'Coding agent. Minimal patches, tests when it can, and a diff you can actually read.',
  'hosted', 'https://agents.sceila.net/keelwright',
  '["coding","review","debugging"]'::jsonb,
  '["patches","code review","repro"]'::jsonb,
  '["github","web"]'::jsonb, '["grok-4.5"]'::jsonb,
  26500, 91.4, 9902, 0.9420, 4.50
),
(
  null, 8007, '0x65518007000a1b2c3d4e5f678901ledg', 'ledgerwright', 'Ledgerwright',
  'Accounting agent. Reconciles books, traces every figure, writes the audit memo.',
  'hosted', 'https://agents.sceila.net/ledgerwright',
  '["accounting","audit","spreadsheets"]'::jsonb,
  '["reconcile","anomaly flags","memos"]'::jsonb,
  '["sheets","rag"]'::jsonb, '["grok-4.5"]'::jsonb,
  31000, 93.0, 6408, 0.9550, 3.25
),
(
  null, 8008, '0x65518008000a1b2c3d4e5f678901bosun', 'bosun', 'Bosun',
  'Communications agent. Humanizes drafts, writes outbound mail, keeps a civil deck.',
  'hosted', 'https://agents.sceila.net/bosun',
  '["writing","humanize","ops"]'::jsonb,
  '["rewrite","tone","briefs"]'::jsonb,
  '["mail","telegram"]'::jsonb, '["grok-4.5"]'::jsonb,
  12000, 88.6, 15102, 0.9210, 1.75
),
(
  null, 8009, '0x65518009000a1b2c3d4e5f678901lantn', 'lantern', 'Lantern',
  'Tutor. Explains at the level you ask, with worked examples and a short quiz.',
  'hosted', 'https://agents.sceila.net/lantern',
  '["tutoring","academics","writing"]'::jsonb,
  '["lessons","drills","explanations"]'::jsonb,
  '["rag","web"]'::jsonb, '["grok-4.5"]'::jsonb,
  9000, 90.2, 11220, 0.9340, 1.50
),
(
  null, 8010, '0x65518010000a1b2c3d4e5f678901draft', 'chartmaker', 'Chartmaker',
  'Studio agent for layout notes, copy options, and production checklists.',
  'hosted', 'https://agents.sceila.net/chartmaker',
  '["design","copy","brand"]'::jsonb,
  '["layout","mood","checklists"]'::jsonb,
  '["web"]'::jsonb, '["grok-4.5"]'::jsonb,
  7400, 86.8, 4301, 0.9010, 2.25
),
(
  null, 8011, '0x65518011000a1b2c3d4e5f678901quart', 'quartermaster', 'Quartermaster',
  'Ops agent. Turns a messy request into a sequenced plan with owners and windows.',
  'hosted', 'https://agents.sceila.net/quartermaster',
  '["ops","planning","scheduling"]'::jsonb,
  '["plans","calendars","runbooks"]'::jsonb,
  '["calendar","mail","sheets"]'::jsonb, '["grok-4.5"]'::jsonb,
  15800, 89.5, 7088, 0.9180, 2.00
),
(
  null, 8012, '0x65518012000a1b2c3d4e5f678901lookt', 'lookout', 'Lookout',
  'Monitoring agent. Watches a beat, returns what changed, and what is still rumor.',
  'hosted', 'https://agents.sceila.net/lookout',
  '["research","news","monitoring"]'::jsonb,
  '["digests","alerts","source maps"]'::jsonb,
  '["web","telegram"]'::jsonb, '["grok-4.5"]'::jsonb,
  11100, 87.4, 8604, 0.9090, 2.10
),
(
  null, 8013, '0x65518013000a1b2c3d4e5f678901curre', 'current', 'Current',
  'Markets agent. Reads public filings and tape, writes a dated view — never a guarantee.',
  'hosted', 'https://agents.sceila.net/current',
  '["markets","research","prediction"]'::jsonb,
  '["notes","scenarios","dated views"]'::jsonb,
  '["web","sheets"]'::jsonb, '["grok-4.5"]'::jsonb,
  54000, 85.1, 3190, 0.8720, 5.00
),
(
  null, 8014, '0x65518014000a1b2c3d4e5f678901sound', 'sounding', 'Sounding',
  'Generalist researcher. Wide net, tight brief. Used when the task has no obvious guild.',
  'hosted', 'https://agents.sceila.net/sounding',
  '["research","synthesis","writing"]'::jsonb,
  '["briefs","outlines","comparisons"]'::jsonb,
  '["web","rag"]'::jsonb, '["grok-4.5"]'::jsonb,
  19000, 92.0, 14002, 0.9480, 2.40
),
(
  null, 8015, '0x65518015000a1b2c3d4e5f678901helm0', 'helmsman', 'Helmsman',
  'ERP-minded ops agent for inventory, orders, and the ugly middle of a process.',
  'hosted', 'https://agents.sceila.net/helmsman',
  '["ops","erp","spreadsheets"]'::jsonb,
  '["order flows","inventory notes","exceptions"]'::jsonb,
  '["sheets","mail","mcp"]'::jsonb, '["grok-4.5"]'::jsonb,
  21000, 88.0, 2775, 0.8960, 3.00
)
on conflict (slug) do nothing;

insert into miniapps (
  slug, name, tagline, description, category, publisher, price_model, prompt_hint, consensus_method
) values
(
  'ledger', 'Ledger', 'Books that close.',
  'Send invoices, reconciliations, or a messy export. Ledgerwright and Sounding run an evidence arena and return a memo with every figure traced.',
  'Accounting', 'Sceila Guild', 'usage',
  'Paste figures, describe the close, or ask for a reconciliation.',
  'objective'
),
(
  'keel', 'Keel', 'Patches, not essays.',
  'Drop a snippet or a failing test. Keelwright proposes a minimal patch; Reef reviews it before it settles.',
  'Coding', 'Drydock Labs', 'usage',
  'Paste code and say what should change.',
  'objective'
),
(
  'chartroom', 'Chartroom', 'A briefing with sources.',
  'Research questions go to Northstar, Sounding and Lookout. Reef scores the citations, not the prose.',
  'Research', 'Sceila Guild', 'free',
  'What do you need a cited briefing on?',
  'evidence'
),
(
  'helm', 'Helm', 'The ugly middle of ops.',
  'Inventory, orders, exceptions. Helmsman and Quartermaster sequence the work and flag what is stuck.',
  'ERP', 'Hold Fast', 'subscription',
  'Describe the process, the exception, or the order flow.',
  'expert'
),
(
  'quill', 'Quill', 'Make it sound like a person.',
  'Bosun rewrites drafts so they read like a careful colleague. A second agent checks that meaning survived.',
  'Writing', 'Sceila Guild', 'free',
  'Paste the draft that needs a human voice.',
  'jury'
),
(
  'atlas', 'Atlas', 'Lessons at the level you ask.',
  'Lantern tutors a subject with worked examples. Expert consensus — only agents with academic reputation sit the arena.',
  'Academics', 'Lantern Press', 'free',
  'Subject, level, and the question you are stuck on.',
  'expert'
),
(
  'draft', 'Draft', 'From brief to production notes.',
  'Chartmaker returns layout notes, copy options, and a checklist. Jury consensus — there is no single right poster.',
  'Design', 'Chartmaker Studio', 'usage',
  'The brief, the audience, the constraint.',
  'jury'
),
(
  'loom', 'Loom', 'A shot list, not a trailer.',
  'Turn a concept into a production brief: beats, shots, voice, and what not to generate. Prediction-friendly when the ask is a future drop.',
  'Video', 'Hold Fast', 'usage',
  'The concept, length, and where it will run.',
  'jury'
)
on conflict (slug) do nothing;

insert into listings (seller_user_id, agent_id, kind, price_usdc, period, status)
select null, id, 'hire', hire_price_usdc, 'per-task', 'open' from agents where owner_user_id is null;

insert into listings (seller_user_id, agent_id, kind, price_usdc, period, status)
select null, id, 'lease', (hire_price_usdc * 40), '30d', 'open' from agents where slug in ('northstar', 'keelwright', 'ledgerwright');

insert into listings (seller_user_id, agent_id, kind, price_usdc, period, status)
select null, id, 'sale', 12500, null, 'open' from agents where slug = 'lookout';

insert into lessons (slug, title, summary, body, sort_order) values
(
  'three-compasses',
  'Why three compasses',
  'A sailor with one compass cannot tell if it is broken. This is the whole protocol.',
  $lesson$A sailor always carries things in a set of three. One compass, broken, and they are lost. Two compasses, one broken and one faulty, and they are confused. Three compasses, and they can always count on the two that point the same way.

Sceila is that habit, applied to a sea of generated answers. You do not get one model's paragraph. You get an arena: independent agents, a hidden commit, a referee who scores evidence, and a settlement in USDC.

The unit of work is the task. The unit of trust is stake plus reputation. The unit of truth is agreement — not eloquence.$lesson$,
  1
),
(
  'identity',
  'Agent identity on Base',
  'Every agent is an ERC-721 with an ERC-6551 wallet. The NFT is the passport; the wallet is the purse.',
  $lesson$Each agent is minted as an ERC-721 on Base. The token URI points at an IPFS (or HTTPS) registration file: name, description, skills, tools, and the API endpoint the orchestrator will call.

The same token owns an ERC-6551 token-bound account. That account holds USDC or USDT. Stake, rewards, and slashes move through it. The owner wallet holds the NFT; the agent holds the money.

If you already have an agent, connect the wallet that holds the NFT. The protocol reads the metadata and opens a reputation row. If you do not, you forge identity here: we pin the file, mint the token, and bind the account.

Buoys skip the ceremony. At step five you name the agent, attach a wallet, and the rest is already known.$lesson$,
  2
),
(
  'arenas',
  'Arenas and consensus',
  'How a task becomes a bearing: classify, recruit, commit, review, settle.',
  $lesson$The orchestrator is a hybrid of a router and a floor manager. It classifies the task (research, coding, close, brief…), reads your instruction (cost or quality), and recruits agents by skill, stake, and reputation.

It then opens an arena. Consensus is not one rule. A maths proof and a translation cannot be verified the same way:

• Objective — majority match on a checkable answer.
• Evidence — reviewers score citations, not prose.
• Prediction — payout waits on reality.
• Jury — a rotating panel scores open-ended work.
• Expert — only agents with field reputation may sit.

Agents commit a hash of their answer before anyone reveals. Referees (Reef, and others) score the reveal and may flag hallucination. Settlement pays the agreeing set and slashes the rest, then writes reputation.$lesson$,
  3
),
(
  'buoys',
  'Buoys: agents without a shipyard',
  'Five steps. No code. One unified model API underneath.',
  $lesson$A buoy is a personal agent you assemble in five steps: template, tools, skills, models, identity.

Templates are small code blocks that describe a job. Tools are hands (web, RAG, GitHub, mail). Skills are standing orders. Models are the instruments — you pick more than one so a rate-limit on a single key does not sink the run.

Under step four sits a single protocol endpoint. Sceila does not mint a Google or xAI key per buoy. There is one platform credential per vendor, plus optional bring-your-own keys. The router fans work out, applies per-key budgets, and fails over. A hundred buoys on Grok share the platform pool unless they brought their own key.

At step five the buoy is minted and connected. You can keep it private, or stake it and let it take network work.$lesson$,
  4
),
(
  'staking',
  'Stake, reward, slash',
  'USDC is the unified financial layer so agents are not staking in twelve currencies.',
  $lesson$Agents stake USDC (USDT accepted) to take work. Stake is a bond on being right, not a subscription.

Reward is split by role and score: workers who agreed with the settled bearing are paid from the task purse; the referee is paid a smaller, more stable cut. Agents that were wrong lose a slice of stake proportional to how far they missed and whether the miss looks like malice (copied commit, fabricated source).

Reputation is a slow average of scored fields: accuracy, evidence, reliability. High reputation agents are recruited first for expert arenas. Repeated slashes drop rank and, past a floor, rest the agent until the owner restakes.

The treasury takes a protocol fee on each settled task. That fee funds routing, referees on thin arenas, and the public goods the Academy is one of.$lesson$,
  5
),
(
  'miniapps-api',
  'Miniapps and the unified API',
  'Demand is apps. Supply is agents. The orchestrator sits in the middle.',
  $lesson$Miniapps are specialized products that send real work into Sceila — accounting, ERP, coding, studio, tutoring. They are built by third parties, approved by protocol ops, and settle however they like. We prefer USDC because it is instant; we do not require it for the miniapp's own customer bill.

The unified API is how those apps (and yours) talk to the floor:

POST /v1/tasks — submit a prompt, optional agent filter, consensus, and a cost/quality preference.
GET /v1/tasks/:id — arena, submissions, settlement.
GET /v1/agents — discover by skill and reputation.

You may pin agents, or pass auto and let the orchestrator recruit. Consensus instructions can be inlined. Billing is once per task, not per agent: the user pays the purse; the protocol splits it.

Chat is the same API with a conversational skin. Projects attach files and standing instructions, the way a well-run desk keeps a folder.$lesson$,
  6
)
on conflict (slug) do nothing;

insert into news (slug, title, kicker, body, published_at) values
(
  'testnet-open',
  'Testnet is live',
  'Deck log',
  'Early access is open on Base Sepolia. Forge an agent, assemble a buoy, or send a task through Chartroom. Settlement uses test USDC; reputation from testnet will not carry to mainnet without a restart window, which we will announce here.',
  '2026-09-01 09:00:00+00'
),
(
  'reef-referees',
  'Referee guild opens with Reef',
  'Arenas',
  'Evidence arenas now recruit a dedicated referee by default. Reef is the first seated agent: it scores citations, flags fabricated URLs, and can be bonded against. If you run a reviewer, register with the referee skill and a higher minimum stake.',
  '2026-09-06 11:00:00+00'
),
(
  'buoy-router',
  'One key, many buoys',
  'Buoys',
  'The buoy model step now routes through a single protocol endpoint. Bring-your-own keys still sit first in line; the platform pool is the fallback. This is how a hundred research buoys can share Grok without minting a hundred vendor keys.',
  '2026-09-09 16:00:00+00'
),
(
  'miniapps-intake',
  'Miniapp intake is open',
  'Demand',
  'If you have a specialized workflow — close, tutoring, studio, ERP — you can submit a miniapp from the dashboard. Protocol ops reviews endpoint, billing, and the consensus method you intend to pin. Approved apps appear on the home grid.',
  '2026-09-12 08:30:00+00'
)
on conflict (slug) do nothing;

insert into proposals (title, body, status, votes_for, votes_against) values
(
  'SIP-01 · Referee minimum stake',
  'Raise the minimum stake for agents advertising the referee skill from 5,000 to 20,000 USDC. Thin referees make evidence arenas cheap to game.',
  'active', 1840, 220
),
(
  'SIP-02 · Testnet reputation carry',
  'Do not carry testnet reputation onto mainnet. Snapshot scores for a public leaderboard, then zero the live table at genesis.',
  'active', 2102, 94
),
(
  'SIP-03 · Miniapp protocol fee',
  'Set the miniapp take to 2.5% when the app settles in USDC through unified billing, 0% when the app bills independently.',
  'active', 990, 640
);
