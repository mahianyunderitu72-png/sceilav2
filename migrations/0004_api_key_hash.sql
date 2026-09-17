alter table api_keys add column if not exists key_hash text;
create unique index if not exists api_keys_key_hash_idx on api_keys (key_hash) where key_hash is not null;
