-- Feria Bíblica · Fase 1 (carrera de obstáculos)
-- Ejecutar en el SQL editor de Supabase del proyecto.

create extension if not exists "pgcrypto";

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  status text not null default 'lobby' check (status in ('lobby', 'racing', 'finished')),
  created_at timestamptz not null default now()
);

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  name text not null,
  avatar text not null default '🏃‍♂️',
  total_score int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists heats (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  heat_number int not null,
  status text not null default 'waiting' check (status in ('waiting', 'running', 'finished')),
  is_final boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists heat_players (
  id uuid primary key default gen_random_uuid(),
  heat_id uuid not null references heats(id) on delete cascade,
  player_id uuid not null references players(id) on delete cascade,
  lane int not null,
  distance_pct numeric not null default 0,
  obstacle_index int not null default 0,
  state text not null default 'running' check (state in ('running', 'question', 'finished')),
  current_question_id text,
  wrong_attempts int not null default 0,
  finish_rank int,
  finish_ms int,
  points int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (heat_id, player_id),
  unique (heat_id, lane)
);

create index if not exists idx_players_session on players(session_id);
create index if not exists idx_heats_session on heats(session_id);
create index if not exists idx_heat_players_heat on heat_players(heat_id);

-- updated_at automático
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_heat_players_updated_at on heat_players;
create trigger trg_heat_players_updated_at
  before update on heat_players
  for each row execute function set_updated_at();

-- Realtime
alter publication supabase_realtime add table sessions;
alter publication supabase_realtime add table players;
alter publication supabase_realtime add table heats;
alter publication supabase_realtime add table heat_players;

-- RLS: evento local de confianza, sin autenticación de usuarios.
-- Se abre lectura/escritura a rol anon. Si esto se expone públicamente más
-- adelante, conviene restringir por sesión (p.ej. con una función que valide
-- el código de sesión) en vez de esta política abierta.
alter table sessions enable row level security;
alter table players enable row level security;
alter table heats enable row level security;
alter table heat_players enable row level security;

create policy "anon full access" on sessions for all using (true) with check (true);
create policy "anon full access" on players for all using (true) with check (true);
create policy "anon full access" on heats for all using (true) with check (true);
create policy "anon full access" on heat_players for all using (true) with check (true);
