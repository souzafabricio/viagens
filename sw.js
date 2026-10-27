// Service worker — app shell offline + bibliotecas do CDN em cache.
// Ao mudar qualquer arquivo do app, suba a versão abaixo.
const VERSION = 'v9';
const SHELL = 'viagem-tobs-shell-' + VERSION;
const LIBS = 'viagem-tobs-libs-' + VERSION;

const APP_SHELL = [
  './', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png',
  'css/tokens.css', 'css/base.css', 'css/components.css', 'css/layout.css', 'css/features.css',
  'js/main.js', 'js/config.js', 'js/state.js', 'js/utils.js', 'js/dates.js', 'js/db.js', 'js/ui.js',
  'js/icons.js', 'js/photos.js', 'js/lists.js', 'js/import-json.js', 'js/market.js', 'js/guide.js',
  'js/seed-ilhabela.js', 'js/seed-ubatuba.js', 'js/weather.js', 'js/today.js', 'js/diary.js', 'js/realtime.js',
  'js/trips.js', 'js/places.js', 'js/address-search.js',
];

// Bibliotecas e fontes: versão fixa na URL, então podem ficar em cache.
// Dados (Supabase, Nominatim, Photon, ViaCEP, Overpass, Open-Meteo, tiles) passam direto pela rede.
const LIB_HOSTS = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL).then((c) => c.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== SHELL && k !== LIBS).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Bibliotecas: cache primeiro, atualiza em segundo plano.
  if (LIB_HOSTS.includes(url.hostname)) {
    event.respondWith(caches.open(LIBS).then(async (cache) => {
      const cached = await cache.match(req);
      const rede = fetch(req).then((res) => { if (res.ok || res.type === 'opaque') cache.put(req, res.clone()); return res; }).catch(() => cached);
      return cached || rede;
    }));
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Arquivos do app: rede primeiro (sempre a versão nova quando online), cache se offline.
  event.respondWith(
    fetch(req).then((res) => {
      if (res.ok) { const copia = res.clone(); caches.open(SHELL).then((c) => c.put(req, copia)); }
      return res;
    }).catch(() => caches.match(req).then((r) => r || (req.mode === 'navigate' ? caches.match('index.html') : undefined)))
  );
});
