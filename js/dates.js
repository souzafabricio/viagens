// Datas — sempre no fuso local, nunca via new Date('YYYY-MM-DD') (que é UTC).

export const MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
export const DIAS_SEMANA = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
export const UM_DIA = 24 * 60 * 60 * 1000;

export function parseData(str) {
  if (!str) return null;
  const [a, m, d] = String(str).split('-').map(Number);
  return new Date(a, m - 1, d);
}
export function isoDe(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
export function hoje() { const h = new Date(); h.setHours(0, 0, 0, 0); return h; }
export const diasEntre = (a, b) => Math.round((b - a) / UM_DIA);

export function periodoCurto(inicio, fim) {
  const fmt = (d) => { if (!d) return ''; const p = d.split('-'); return p[2] + '/' + p[1]; };
  if (!inicio && !fim) return '';
  if (inicio && fim && inicio !== fim) return fmt(inicio) + ' a ' + fmt(fim);
  return fmt(inicio || fim);
}

export function periodoExtenso(inicio, fim) {
  const i = parseData(inicio), f = parseData(fim);
  if (!i) return '';
  if (!f || i.getTime() === f.getTime()) return `${i.getDate()} de ${MESES[i.getMonth()]} de ${i.getFullYear()}`;
  if (i.getMonth() === f.getMonth() && i.getFullYear() === f.getFullYear())
    return `${i.getDate()} a ${f.getDate()} de ${MESES[i.getMonth()]} de ${i.getFullYear()}`;
  return `${i.getDate()} de ${MESES[i.getMonth()]} a ${f.getDate()} de ${MESES[f.getMonth()]} de ${f.getFullYear()}`;
}

export function noites(trip) {
  const i = parseData(trip && trip.data_inicio), f = parseData(trip && trip.data_fim);
  return i && f ? diasEntre(i, f) : null;
}

// { fase: 'antes' | 'durante' | 'depois' | null, dias, indice }
export function faseDaViagem(trip) {
  if (!trip || !trip.data_inicio) return { fase: null };
  const i = parseData(trip.data_inicio);
  const f = parseData(trip.data_fim) || i;
  const h = hoje();
  if (h < i) return { fase: 'antes', dias: diasEntre(h, i) };
  if (h > f) return { fase: 'depois', dias: diasEntre(f, h) };
  return { fase: 'durante', indice: diasEntre(i, h) };
}

// Índice do dia da viagem em que estamos (0 = primeiro). null se fora.
export function indiceDiaHoje(trip) {
  const s = faseDaViagem(trip);
  return s.fase === 'durante' ? s.indice : null;
}

export function datasDaViagem(trip) {
  if (!trip || !trip.data_inicio) return [];
  const i = parseData(trip.data_inicio);
  const f = parseData(trip.data_fim) || i;
  const out = [];
  for (const d = new Date(i); d <= f; d.setDate(d.getDate() + 1)) out.push(new Date(d));
  return out;
}

export function textoContagem(trip) {
  const s = faseDaViagem(trip);
  if (s.fase === 'antes') return s.dias === 1 ? 'Falta 1 dia' : `Faltam ${s.dias} dias`;
  if (s.fase === 'durante') return 'Estamos na viagem';
  if (s.fase === 'depois') return 'Viagem concluída';
  return '';
}

// "Sexta, 8 de janeiro — chegada" → "chegada"
export function tituloCurto(titulo) {
  const partes = String(titulo || '').split('—');
  return partes.slice(1).join('—').trim() || String(titulo || '');
}
