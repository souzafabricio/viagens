// Utilitários puros, sem dependência de estado.

export const $ = (id) => document.getElementById(id);

export function uid() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// Seguro para texto e para valores de atributo.
export function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function lsGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
export function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch (e) { console.warn('localStorage cheio', e); }
}
export function lsRaw(key, value) {
  try {
    if (value === undefined) return localStorage.getItem(key);
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch { return null; }
}

export const clone = (o) => JSON.parse(JSON.stringify(o));

export function plural(n, um, varios) { return n + ' ' + (n === 1 ? um : varios); }

export function mapsUrl(query) {
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
}
