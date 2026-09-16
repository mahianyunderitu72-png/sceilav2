export type Profile = {
  id: number;
  user_id: string;
  display_name: string | null;
  waitlist_status: "pending" | "approved";
  waitlist_intent: string | null;
  waitlist_note: string | null;
  wallet_address: string | null;
  plan: string;
  credits: string;
  is_admin: boolean;
  created_at: string;
};

export type Agent = {
  id: number;
  owner_user_id: string | null;
  token_id: number;
  tba_address: string;
  slug: string;
  name: string;
  description: string;
  kind: string;
  endpoint: string | null;
  skills: string[];
  capabilities: string[];
  tools: string[];
  models: string[];
  template: string | null;
  stake_usdc: string;
  reputation: string;
  tasks_completed: number;
  accuracy: string;
  status: string;
  hire_price_usdc: string;
  created_at: string;
};

export type Miniapp = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  publisher: string;
  price_model: string;
  status: string;
  prompt_hint: string;
  consensus_method: string;
  submitter_user_id: string | null;
};

export type Listing = {
  id: number;
  seller_user_id: string | null;
  agent_id: number;
  kind: string;
  price_usdc: string;
  period: string | null;
  status: string;
  buyer_user_id: string | null;
  created_at: string;
  agent_name?: string;
  agent_slug?: string;
  agent_description?: string;
  reputation?: string;
};

export type Chat = {
  id: number;
  user_id: string;
  project_id: number | null;
  title: string;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: number;
  user_id: string;
  name: string;
  instructions: string;
  created_at: string;
};

export type Message = {
  id: number;
  chat_id: number;
  user_id: string;
  role: string;
  content: string;
  task_id: number | null;
  created_at: string;
};

export type Task = {
  id: number;
  user_id: string;
  source: string;
  miniapp_slug: string | null;
  chat_id: number | null;
  prompt: string;
  classification: string | null;
  consensus_method: string | null;
  status: string;
  consensus_answer: string | null;
  confidence: string | null;
  agreement: string | null;
  reward_usdc: string;
  created_at: string;
};

export type Submission = {
  id: number;
  task_id: number;
  agent_id: number;
  role: string;
  answer: string | null;
  evidence: string[];
  confidence: string | null;
  score_accuracy: string | null;
  score_evidence: string | null;
  score_reliability: string | null;
  reward_usdc: string;
  slashed_usdc: string;
  agent_name?: string;
  agent_slug?: string;
};

export type Lesson = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  body: string;
  sort_order: number;
};

export type NewsPost = {
  id: number;
  slug: string;
  title: string;
  kicker: string;
  body: string;
  published_at: string;
};

export type Proposal = {
  id: number;
  title: string;
  body: string;
  status: string;
  votes_for: number;
  votes_against: number;
  created_at: string;
  my_vote?: string | null;
};

export type LedgerRow = {
  id: number;
  user_id: string;
  kind: string;
  amount_usdc: string;
  note: string | null;
  created_at: string;
};

export type ArenaResult = {
  task: Task;
  submissions: Submission[];
};
