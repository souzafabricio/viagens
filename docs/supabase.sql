-- ============================================================================
-- Viagem dos Tobs — migrações do Supabase
-- Rode uma vez no SQL Editor. Todas são idempotentes (if not exists).
-- ============================================================================

-- 1) Roteiro por viagem (o guia é dado, não HTML fixo)
create table if not exists viagem_roteiro (
  viagem_id  uuid primary key references viagens(id) on delete cascade,
  conteudo   jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- 2) Diário de bordo
create table if not exists viagem_diario (
  id         uuid primary key default gen_random_uuid(),
  viagem_id  uuid references viagens(id) on delete cascade,
  dia        date,
  texto      text,
  foto       text,
  created_by text,
  created_at timestamptz default now()
);

-- 3) Colunas novas
alter table viagem_itens add column if not exists foto text;
alter table viagem_itens add column if not exists assigned_to text;
alter table viagens      add column if not exists lat double precision;
alter table viagens      add column if not exists lon double precision;

-- 4) Cascata — sem isto, excluir viagem falha por foreign key nas tabelas antigas
alter table checklist_marks drop constraint if exists checklist_marks_viagem_id_fkey;
alter table checklist_marks add  constraint checklist_marks_viagem_id_fkey
  foreign key (viagem_id) references viagens(id) on delete cascade;
alter table checklist_items drop constraint if exists checklist_items_viagem_id_fkey;
alter table checklist_items add  constraint checklist_items_viagem_id_fkey
  foreign key (viagem_id) references viagens(id) on delete cascade;

-- 5) Realtime
alter publication supabase_realtime add table viagem_roteiro;
alter publication supabase_realtime add table viagem_diario;

-- 6) Toast "Carol marcou: ..." — precisa do valor ANTIGO da linha no realtime.
--    Sem isto o app simplesmente não mostra o aviso (antes mostrava avisos falsos).
alter table viagem_itens replica identity full;

-- ============================================================================
-- SEGURANÇA
-- A chave em js/config.js é "publishable": vai para o navegador de qualquer
-- visitante. Sem RLS, quem descobrir a URL lê e escreve tudo — inclusive o
-- endereço da hospedagem. O mínimo aceitável:
--
--   alter table viagens         enable row level security;
--   alter table viagem_topicos  enable row level security;
--   alter table viagem_itens    enable row level security;
--   alter table viagem_roteiro  enable row level security;
--   alter table viagem_diario   enable row level security;
--
--   create policy "somente autenticados" on viagens
--     for all using (auth.role() = 'authenticated')
--     with check (auth.role() = 'authenticated');
--   -- repita para as outras quatro tabelas.
--
-- Depois disso é preciso plugar um login de verdade (magic link por e-mail é o
-- mais simples). Os botões "Fabrício / Carol" são só uma preferência de cor
-- guardada no localStorage — não são autenticação.
-- ============================================================================
