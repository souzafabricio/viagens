// Configuração central do app. Tudo que muda entre ambientes fica aqui.

export const APP_NAME = 'Viagem dos Tobs';

export const SUPABASE_URL = 'https://qvebeglkbngmiiycebgl.supabase.co';
export const SUPABASE_KEY = 'sb_publishable_pPmgoCcBN8fIIH70OigGzw_dRcWMjWw';

export const TABLES = {
  viagens: 'viagens',
  roteiro: 'viagem_roteiro',
  topicos: 'viagem_topicos',
  itens:   'viagem_itens',
  diario:  'viagem_diario',
};

export const PEOPLE = { fabricio: 'Fabrício', carol: 'Carol' };

export const TABS = ['hoje', 'guia', 'conjunta', 'pessoal', 'diario'];

// Tempo entre "excluir" e o DELETE de fato ir para o banco (janela do Desfazer).
export const UNDO_MS = 6000;

// Chaves do localStorage
export const LS = {
  user:   'travelUser',
  tab:    'travelTab',
  trip:   'travelTripId',
  theme:  'travelTheme',
  outbox: 'app.outbox.v2',
  trips:  'app.viagens',
  cache:  (id) => 'app.cache.v2.' + id,
  clima:  (id) => 'app.clima.' + id,
};
