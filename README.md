# Viagem dos Tobs

PWA de listas, roteiro e diário de viagem para duas pessoas, com sincronização em tempo real (Supabase) e funcionamento offline. Sem build: é só servir a pasta como site estático.

## Estrutura

```
index.html            marcação das telas e modais (sem JS/CSS inline)
manifest.json, sw.js  PWA — o service worker guarda o app e as bibliotecas do CDN
css/
  tokens.css          cores, tipografia, raios, sombras (tema claro e escuro)
  base.css            reset e tipografia
  components.css      botões, chips, campos, cartões, modais, toasts
  layout.css          telas, hero, barra fixa, abas (inferior no celular, topo no desktop)
  features.css        listas, Hoje, Guia, Diário, viagens
js/
  main.js             boot, eventos globais, o que re-renderizar quando o estado muda
  config.js           Supabase, tabelas, pessoas, chaves do localStorage
  state.js            estado global + barramento de eventos (on/emit)
  db.js               cliente Supabase, fila offline (outbox), cache por viagem
  realtime.js         carga da viagem e inscrições realtime
  ui.js               toasts, modais (Esc/fundo), confirmar/perguntar, telas, abas, tema
  lists.js            tópicos e itens (Conjunta/Pessoal)
  guide.js            aba Guia (+ seed-ubatuba.js, seed-ilhabela.js)
  today.js, weather.js  aba Hoje e previsão (Open-Meteo)
  diary.js            aba Diário
  trips.js            lista, criação/edição/cópia/exclusão de viagens
  places.js           mapa (Leaflet/Nominatim) e "Onde Comprar" (Overpass)
  photos.js           compressão de fotos e visualizador
  import-json.js      importação de listas via JSON
  dates.js, utils.js, icons.js
docs/supabase.sql     migrações e notas de segurança (RLS)
```

## Rodar localmente

```
python3 -m http.server 8000
```

Abra http://localhost:8000. Módulos ES não funcionam via `file://`.

## Publicar uma mudança

Suba `VERSION` em `sw.js` para os celulares pegarem os arquivos novos.
