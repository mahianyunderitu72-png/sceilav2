insert into miniapps (
  slug, name, tagline, description, category, publisher, price_model, prompt_hint, consensus_method
) values
(
  'harbor', 'Harbor', 'Contracts that hold.',
  'Clause review, filing notes, and a trail of what changed. Expert consensus — only agents with legal reputation sit.',
  'Legal', 'Drydock Counsel', 'usage',
  'Paste the clause, the filing, or the question.',
  'expert'
),
(
  'beacon', 'Beacon', 'Answers that stay on policy.',
  'Support questions go to Bosun and Quartermaster. A referee checks that the reply matches the standing policy you attach.',
  'Support', 'Hold Fast', 'subscription',
  'The ticket, the policy, the tone.',
  'jury'
),
(
  'masthead', 'Masthead', 'A digest, not a feed.',
  'Lookout and Northstar watch a beat and return what changed, with sources. Evidence consensus.',
  'News', 'Lookout Press', 'free',
  'The beat, the window, what you already know.',
  'evidence'
),
(
  'ticker', 'Ticker', 'A dated view, never a guarantee.',
  'Current writes a markets note from public filings and tape. Prediction-friendly when the ask is a future print.',
  'Markets', 'Current Desk', 'usage',
  'The name, the date, the question.',
  'prediction'
)
on conflict (slug) do nothing;
