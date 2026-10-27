// Roteiro de Ubatuba (jan/2027) — semente importável pela aba Guia.
// Os campos de texto (fork, s, n, d, nota e itens de 'warns') aceitam HTML simples.

export const SEED_UBATUBA = {
  versao: 1,
  nota: 'Base da viagem: <b>apartamento da família — R. João Ramalho, 90, Itaguá, Condomínio Village Côte d\'Azur (−23,4449473, −45,0734722)</b>. As distâncias são <b>estimativas</b> calculadas a partir desse endereço: confirme no Maps antes de sair, principalmente em janeiro, quando a Rio-Santos engarrafa. Horários e preços foram levantados em outubro de 2026 — reconfirme por telefone ou WhatsApp na semana da viagem.',
  dias: [
    { id:'d1', dnum:'Dia 1', titulo:'Sexta, 8 de janeiro — chegada', tag:'Viagem', cor:'',
      fork:'<b>O gargalo da viagem é a serra, não a cidade.</b> A SP-125 (Oswaldo Cruz) desce de Taubaté para Ubatuba em 28 km de curva fechada, com neblina frequente no fim da tarde e fila atrás de caminhão. <b>Chegue à serra antes das 15h</b> — saindo de São João da Boa Vista às 5h sobra folga até para parar duas vezes.',
      itens:[
        {h:'5h', b:'Saída de São João da Boa Vista', s:'<b>Cerca de 415 km e 6h de estrada</b> pelo caminho natural: SP-344 até Campinas, Dom Pedro I (SP-065) até Taubaté e SP-125 até Ubatuba. Abasteça antes de pegar a Dom Pedro.'},
        {h:'8h30', b:'Parada para café', s:'Qualquer posto da Dom Pedro. A partir de Taubaté não há mais trecho bom para parar com calma.'},
        {h:'10h30', b:'Taubaté — último abastecimento barato', s:'Combustível no litoral é mais caro. Encha o tanque aqui e desça a serra com o carro cheio.'},
        {h:'11h', b:'Serra da Oswaldo Cruz', s:'<b>28 km de descida, cerca de 50 min.</b> Pista simples, sem acostamento, com mirantes no caminho. Não tente ultrapassar: em janeiro a fila anda devagar e volta a andar sozinha.'},
        {h:'12h', b:'Chegada em Itaguá', s:'O apartamento fica a <b>1,5 km do centro</b> e a 800 m do Aquário. Estacionamento é do condomínio — uma vantagem enorme em janeiro, quando a Zona Azul do centro vive lotada.'},
        {h:'13h', b:'Almoço na Rua Guarani', s:'<b>9 min a pé.</b> <b>Peixe com Banana</b> (Guarani, 315 · R$ 50–140) é o prato que dá nome à cidade. Alternativa ao lado: <b>Braseiro Caiçara</b> (Guarani, 359).'},
        {h:'15h', b:'Compras da viagem', s:'<b>Conde Supermercado</b> (R. Cap. Felipe, 558 · ~6 min de carro · até 22h) para a compra grande, ou <b>TopStop</b> (Cap. Felipe, 476 · até 22h30) para o básico. O apartamento tem cozinha: comprar café da manhã da semana economiza bastante.'},
        {h:'17h', b:'Praia Grande para esticar as pernas', s:'<b>~4,5 km, 9 min de carro.</b> Faixa longa de areia, quiosques, calçadão e estacionamento — a praia urbana mais fácil de Ubatuba.'},
        {h:'19h30', b:'Primeira noite sem esforço', s:'<b>Fritz Cervejaria</b> (Guarani, 345 · 9 min a pé · fecha quarta) ou <b>Quintal da Villa</b> (Guarani, 663 · até 23h). Tudo no mesmo quarteirão do apartamento.'}
      ]},
    { id:'d2', dnum:'Dia 2', titulo:'Sábado, 9 de janeiro — praias do norte', tag:'Norte', cor:'hl-sea',
      fork:'<b>Saia cedo ou não saia.</b> As praias do norte ficam todas na Rio-Santos e o estacionamento é o limite real: Félix e Prumirim lotam antes das 10h em janeiro. Com o carro posicionado até 9h, o dia inteiro fica fácil.',
      itens:[
        {h:'8h', b:'Café em casa e saída', s:'Leve: repelente <b>em creme</b>, protetor solar, dinheiro em espécie, máscara de snorkel e guarda-sol se tiverem. Os quiosques do norte são simples.'},
        {h:'8h40', b:'Itamambuca', s:'<b>~10,6 km, 13 min.</b> Praia longa de surfista, com rio no canto e muita sombra de árvore. Boa para começar o dia antes do sol forte.'},
        {h:'11h', b:'Praia do Félix', s:'<b>~15,5 km, 19 min.</b> Estaciona no fim da estrada de terra e caminha ~300 m. Dos cantos saem trilhas curtas para a <b>Praia do Português</b> e a <b>Praia da Conchinha</b> — vazias e com água mais calma.'},
        {h:'13h', b:'Almoço de quiosque', s:'Os quiosques do Félix têm peixe frito, pastel e cerveja. Sem Pix garantido: <b>leve dinheiro</b>.'},
        {h:'15h', b:'Cachoeira do Prumirim', hi:true, s:'<b>~17,6 km, 22 min</b> — entrada sinalizada na Rio-Santos, no km 25. Poço grande e queda forte, 5 min de caminhada do estacionamento. <b>Estacionamento cobrado (~R$ 25).</b> Pedra muito escorregadia: chinelo não serve.'},
        {h:'17h', b:'Praia do Prumirim no fim da tarde', s:'Logo abaixo da cachoeira. Mar calmo e quase sem gente depois das 17h.'},
        {h:'20h', b:'Jantar em Itaguá', s:'<b>Raízes</b> (Av. Leovigildo Dias Vieira, 1280 · ~5 min de carro · até 23h30) — peixe, massa e pizza, música ao vivo. Reserve ou chegue antes das 20h.'}
      ]},
    { id:'d3', dnum:'Dia 3', titulo:'Domingo, 10 de janeiro — praias do sul', tag:'Sul', cor:'hl-sand',
      fork:'<b>O sul é o lado calmo da cidade.</b> Enseada, Santa Rita, Lázaro e Domingas Dias ficam em baías protegidas: mar parado, bom para boiar e para stand-up. É o contrário do norte, que é mar aberto.',
      itens:[
        {h:'9h', b:'Café sem pressa', s:'Hoje não tem horário. O trajeto todo é curto.'},
        {h:'10h', b:'Praia Santa Rita', s:'<b>~8 km, 10 min.</b> Baía fechada, água rasa e transparente, com a <b>piscina natural</b> no canto esquerdo. A melhor praia do sul para quem quer só entrar na água e ficar.'},
        {h:'12h30', b:'Almoço no Lázaro', s:'<b>~11,8 km, 15 min.</b> Quiosques e restaurantes de frente para a Baía da Fortaleza, com estrutura bem melhor que a do norte.'},
        {h:'14h30', b:'Domingas Dias', hi:true, s:'<b>~12,1 km, 15 min.</b> Acesso por dentro do condomínio, a pé — não dá para encostar o carro na areia, e é justamente por isso que a praia é tão bonita. <b>Estacione cedo</b>: as vagas na rua de acesso são poucas e acabam depois do almoço.'},
        {h:'17h', b:'Volta pelo Saco da Ribeira', s:'<b>~10,9 km.</b> Passe na marina para <b>fechar a escuna de amanhã pessoalmente</b> — é mais barato e mais seguro que fechar por telefone, e vocês já veem onde o barco sai.'},
        {h:'19h30', b:'Jantar no centro', s:'<b>Doca 390</b> (R. Dr. Esteves da Silva, 390 · ~4 min de carro · ter a sáb a partir das 17h). Se for domingo fechado, <b>Quintal da Villa</b> resolve a 9 min a pé de casa.'}
      ]},
    { id:'d4', dnum:'Dia 4', titulo:'Segunda, 11 de janeiro — escuna, o dia inteiro', tag:'Escuna', cor:'hl-carol',
      fork:'<b>Segunda é o melhor dia da viagem para o barco.</b> Menos gente que no fim de semana, mar historicamente mais calmo de manhã e preço de dia útil. Se o passeio cair por mar ruim, o plano B está na seção <i>Trocas possíveis</i>.',
      itens:[
        {h:'7h30', b:'Café reforçado', s:'Hoje o café é combustível. Leve: <b>dinheiro em espécie</b>, protetor, boné, blusa leve para o vento, máscara de snorkel e a GoPro.'},
        {h:'8h30', b:'Sair para o Saco da Ribeira', s:'<b>~10,9 km, 14 min.</b> As escunas pedem chegada com 30 min de antecedência e o estacionamento da marina enche.'},
        {h:'9h30', b:'Escuna para a Ilha Anchieta', hi:true, s:'Saída do <b>Saco da Ribeira</b>, dia inteiro (cerca de 9h30 às 16h30). A ilha é <b>Parque Estadual</b>: praias de água transparente, ruínas do antigo presídio e trilhas curtas. Costuma sair por <b>R$ 90 a R$ 150 por pessoa</b>, fora a taxa do parque — confirme na hora de reservar.'},
        {h:'12h', b:'Almoço na ilha', s:'Há quiosque na Praia do Presídio, mas é caro e limitado. <b>Levar lanche e água resolve o dia</b> — e muita escuna libera cooler a bordo.'},
        {h:'14h', b:'Snorkel na Praia do Engenho', s:'Água parada e peixe à vista. <b>A máscara é sua</b>: a maioria das escunas não fornece.'},
        {h:'16h30', b:'Volta à marina', s:'Confirme no embarque <b>onde</b> e <b>a que horas</b> o barco desembarca, para não ficar esperando com o carro do outro lado.'},
        {h:'19h', b:'Última noite', s:'Jantar perto de casa — <b>Braseiro Caiçara</b> ou <b>Peixe com Banana</b>, os dois a 9 min a pé. <b>Deixem as malas prontas antes de dormir.</b>'}
      ]},
    { id:'d5', dnum:'Dia 5', titulo:'Terça, 12 de janeiro — Aquário e volta', tag:'Viagem', cor:'',
      fork:'<b>A manhã de terça é a melhor da viagem para o Aquário.</b> Dia útil e fora do fim de semana: fila curta. E dá para ir a pé, deixando o carro já carregado.',
      itens:[
        {h:'9h', b:'Aquário de Ubatuba', hi:true, s:'R. Guarani, 859 · <b>800 m, 11 min a pé</b> · todos os dias 9h–22h · <b>inteira R$ 70, meia R$ 35</b>; pacote família a partir de R$ 150. Compre online com horário marcado e pule a fila.'},
        {h:'10h30', b:'Projeto Tamar (opcional)', s:'R. Antônio Atanázio, 273 · <b>1,3 km, 17 min a pé</b> · 9h–17h. Visita curta, 40 min a 1h. Só vale se o Aquário for rápido.'},
        {h:'11h30', b:'Fechar o apartamento', s:'Lixo fora, geladeira esvaziada, chave onde combinaram.'},
        {h:'12h', b:'Abastecer antes de subir a serra', s:'<b>Posto Sete Estrelas</b> (Av. Leovigildo Dias Vieira, 590 · 3 min · <b>24 h</b>). Subir a Oswaldo Cruz com pouco combustível é o tipo de aperto que não vale a economia.'},
        {h:'12h30', b:'Estrada de volta', s:'<b>~6h até São João da Boa Vista.</b> Saindo ao meio-dia e meia vocês pegam a serra antes do fluxo da tarde e chegam por volta das 18h30.'}
      ]}
  ],
  secoes: [
    { id:'guia-reservas', titulo:'Reservar antes de viajar', tipo:'warns', itens:[
      '<b>1. Escuna — reserve com antecedência e reconfirme na véspera.</b> Em janeiro os barcos saem cheios e o passeio depende de condição de mar. Fechar pessoalmente no <b>Saco da Ribeira</b> no domingo costuma sair mais barato que por telefone.<br>· <b>Mykonos Turismo</b> — R. Flamenguinho, 17 · (12) 99603-1985 · <b>fecha quarta</b>.<br>· <b>Escuna Copacabana</b> — Av. da Ribeira, 400 · (12) 99763-8690.<br>· <b>Passeios de Escuna Ubatuba</b> — Av. Leovigildo Dias Vieira, 446 (Itaguá) · (12) 99184-7933 · 8h–20h todos os dias.',
      '<b>2. Aquário — compre online com horário marcado.</b> Inteira R$ 70, meia R$ 35, pacote família de R$ 150 a R$ 220. Aberto <b>todos os dias das 9h às 22h</b> — em dia de chuva ele é o plano B da cidade inteira e a fila dobra.',
      '<b>3. A serra é o trecho crítico, nos dois sentidos.</b> A SP-125 tem pista simples, neblina de fim de tarde e nenhuma alternativa boa. Programe a descida antes das 15h e a subida antes das 16h.',
      '<b>4. Dinheiro em espécie.</b> Quiosque de praia do norte, cachoeira e ilha costumam não ter sinal para Pix nem maquininha confiável. Leve notas pequenas.',
      '<b>5. Repelente em creme, não spray.</b> Borrachudo em Ubatuba é pior nas cachoeiras e nas praias com rio — Itamambuca e Prumirim entram nessa lista.',
      '<b>6. Plano de chuva.</b> Janeiro é o mês mais chuvoso do litoral norte: espere pancada de fim de tarde quase todo dia. Praia de manhã, programa coberto à tarde.'
    ]},
    { id:'guia-dist', titulo:'Distâncias a partir do apartamento', tipo:'box', grupos:[
      { h4:'A pé', linhas:[
        {d:'700 m · 9 min', n:'Rua Guarani', s:'Quintal da Villa · Braseiro Caiçara · Fritz Cervejaria'},
        {d:'800 m · 11 min', n:'Aquário de Ubatuba', s:'R. Guarani, 859 · 9h–22h todos os dias'},
        {d:'1,3 km · 17 min', n:'Projeto Tamar', s:'R. Antônio Atanázio, 273 · 9h–17h'},
        {d:'1,5 km · 20 min', n:'Praia do Cruzeiro e centro', s:'Calçadão e píer · praia boa para caminhar, não para banho'},
        {d:'1,9 km · 25 min', n:'Drogaria São Paulo', s:'R. Dona Maria Alves, 468 · <b>24 h</b>'}
      ]},
      { h4:'De carro', linhas:[
        {d:'3 min', n:'Posto Sete Estrelas', s:'Av. Leovigildo Dias Vieira, 590 · <b>24 h</b>'},
        {d:'6 min', n:'Conde Supermercado · TopStop', s:'R. Cap. Felipe · compra grande · até 22h / 22h30'},
        {d:'8 min', n:'Praia do Tenório', s:'Mar bom para banho · quiosques · estacionamento difícil'},
        {d:'9 min', n:'Praia Grande', s:'A praia urbana mais fácil · calçadão e estrutura'},
        {d:'9 min', n:'Praia Vermelha do Centro', s:'Mar de tombo · bonita, pouca infraestrutura'},
        {d:'10 min', n:'Praia Santa Rita', s:'Baía fechada · piscina natural no canto'},
        {d:'13 min', n:'Itamambuca', s:'Praia longa de surf · rio e sombra'},
        {d:'14 min', n:'Saco da Ribeira', s:'Marina · saída das escunas · chegue 30 min antes'},
        {d:'15 min', n:'Lázaro · Domingas Dias', s:'Mar calmo · Domingas Dias só a pé por dentro do condomínio'},
        {d:'15 min', n:'Trilha das Sete Fontes', s:'Três praias numa caminhada curta'},
        {d:'19 min', n:'Praia do Félix', s:'+300 m a pé · trilhas para Português e Conchinha'},
        {d:'22 min', n:'Prumirim — praia e cachoeira', s:'Estacionamento da cachoeira ~R$ 25'},
        {d:'41 min', n:'Picinguaba', s:'Saída das lanchas para a Ilha das Couves'}
      ]}
    ]},
    { id:'guia-enderecos', titulo:'Endereços e contatos', tipo:'box', grupos:[
      { h4:'Comer e beber', linhas:[
        {d:'Peixe com Banana', n:'Rua Guarani, 315 — Centro', s:'Seg e qua a dom 12h–22h (sex e sáb até 23h) · <b>terça fechado</b> · R$ 50–140 · 4,5 (1.302) · (12) 3833-9683'},
        {d:'Braseiro Caiçara', n:'Rua Guarani, 359 — Itaguá', s:'Todos os dias 11h30–23h · 4,8 (3.048) · (12) 3208-3369'},
        {d:'Quintal da Villa', n:'Rua Guarani, 663 — Itaguá', s:'Todos os dias 11h30–23h · porções grandes · 4,8 (2.483) · (12) 3833-4338'},
        {d:'Raízes', n:'Av. Leovigildo Dias Vieira, 1280 — Itaguá', s:'Todos os dias 11h30–23h30 · música ao vivo · 4,7 (5.966) · (12) 3832-3377'},
        {d:'Feito em Casa', n:'Av. Leovigildo Dias Vieira, 1180 — Itaguá', s:'Café e almoço · <b>quinta fechado</b> · 4,9 (94) · (11) 99147-8240'},
        {d:'Fritz Cervejaria', n:'Rua Guarani, 345 — Itaguá', s:'A partir das 15h30 · sáb e dom a partir do meio-dia · <b>quarta fechado</b> · 4,9 (1.123)'},
        {d:'Doca 390', n:'R. Dr. Esteves da Silva, 390 — Centro', s:'Ter a sáb 17h–00h (sex e sáb até 1h) · <b>dom e seg fechado</b> · 4,6 (812)'}
      ]},
      { h4:'Serviços', linhas:[
        {d:'Mercado', n:'Conde Supermercado — R. Cap. Felipe, 558', s:'Compra grande · 7h–22h todos os dias · (12) 3835-3143'},
        {d:'Mercado', n:'TopStop — R. Cap. Felipe, 476', s:'7h–22h30 · bom para o que falta'},
        {d:'Mercado', n:'Uba Supermarket — R. Taubaté, 802', s:'8h–20h · o mais perto do apartamento'},
        {d:'Farmácia', n:'Drogaria São Paulo — R. Dona Maria Alves, 468', s:'<b>24 horas</b> · (12) 3832-2997'},
        {d:'Farmácia', n:'Droga Raia — R. Hans Staden, 443', s:'Praticamente 24 h · (12) 99683-4181'},
        {d:'Posto', n:'Sete Estrelas — Av. Leovigildo Dias Vieira, 590', s:'<b>24 h</b> · 3 min de carro · (12) 3942-5595'},
        {d:'Posto', n:'Shell — R. Cap. Felipe, 387', s:'6h–22h · conveniência'}
      ]},
      { h4:'Passeios', linhas:[
        {d:'Escuna', n:'Mykonos Turismo — R. Flamenguinho, 17', s:'Saco da Ribeira · 8h–17h · <b>quarta fechado</b> · 4,7 (384) · (12) 99603-1985'},
        {d:'Escuna', n:'Escuna Copacabana — Av. da Ribeira, 400', s:'Saco da Ribeira · 8h–17h · 5,0 (85) · (12) 99763-8690'},
        {d:'Escuna', n:'Passeios de Escuna Ubatuba — Av. Leovigildo Dias Vieira, 446', s:'Itaguá · 8h–20h todos os dias · Couves, Prumirim e Anchieta · (12) 99184-7933'},
        {d:'Aquário', n:'Aquário de Ubatuba — R. Guarani, 859', s:'9h–22h · inteira R$ 70 · meia R$ 35 · família R$ 150–220 · (12) 3834-1382'},
        {d:'Tartarugas', n:'Projeto Tamar — R. Antônio Atanázio, 273', s:'9h–17h todos os dias · 4,8 (17.409) · (12) 3832-6202'},
        {d:'Cachoeira', n:'Cachoeira do Prumirim — Rio-Santos, km 25', s:'Acesso livre · estacionamento ~R$ 25 · pedra escorregadia'}
      ]}
    ], links:[
      {t:'Aquário — ingressos', u:'https://www.aquariodeubatuba.com.br/valores/'},
      {t:'Projeto Tamar', u:'https://www.tamar.org.br'},
      {t:'Rota pela Oswaldo Cruz', u:'https://www.google.com/maps/dir/S%C3%A3o+Jo%C3%A3o+da+Boa+Vista+-+SP/Itagu%C3%A1,+Ubatuba+-+SP'}
    ]},
    { id:'guia-trocas', titulo:'Trocas possíveis', tipo:'box', grupos:[
      { h4:'Se o mar virar e cancelarem a escuna', linhas:[
        {d:'Faça', n:'<b>Ilha das Couves</b> saindo de Picinguaba', s:'41 min de carro + 10 min de lancha. Mar de dentro, costuma rodar mesmo com o mar ruim lá fora. Travessia ~R$ 60 por pessoa, 2h na ilha.'},
        {d:'Ou', n:'Troque o barco pela <b>trilha das Sete Fontes</b>', s:'15 min de carro. Caminhada curta que liga três praias, com quiosque nas duas últimas. Dia inteiro sem depender de mar.'},
        {d:'Ou', n:'Empurre a escuna para a <b>terça de manhã</b>', s:'Só funciona se estiverem dispostos a sair de Ubatuba no fim da tarde — e aí a serra fica no escuro. Prefira as duas opções acima.'}
      ]},
      { h4:'Se chover o dia inteiro', linhas:[
        {d:'Plano A', n:'<b>Aquário</b> de manhã e <b>Tamar</b> à tarde', s:'Os dois a pé do apartamento. O Aquário é coberto e abre até as 22h.'},
        {d:'Plano B', n:'Almoço longo + <b>Fritz Cervejaria</b>', s:'Tudo no mesmo quarteirão de casa, sem pegar o carro.'},
        {d:'Plano C', n:'<b>Cachoeira do Prumirim</b> — se a chuva for fraca', s:'Chuva fraca deixa a cachoeira cheia e vazia de gente. Chuva forte, não: a pedra fica perigosa e o poço vira correnteza.'}
      ]},
      { h4:'Se sobrar tempo ou vontade', linhas:[
        {d:'Praia', n:'Praia do Português e Conchinha', s:'Trilhas de 10 min saindo dos cantos do Félix. Quase sempre vazias.'},
        {d:'Praia', n:'Praia Vermelha do Centro', s:'9 min de carro. Areia avermelhada e nascer do sol bonito — mar de tombo, cuidado no banho.'},
        {d:'Pôr do sol', n:'Píer Comodoro Magalhães', s:'6 min de carro. O píer do centro, aberto até as 18h.'},
        {d:'Stand-up', n:'Santa Rita ou Domingas Dias', s:'As duas baías mais paradas da cidade — é onde se aluga prancha em janeiro.'}
      ]},
      { h4:'Se a praia estiver impraticável de gente', linhas:[
        {d:'Troque', n:'Centro e Tenório pelas praias do <b>norte</b>', s:'Félix, Prumirim e as prainhas de trilha absorvem muito melhor o movimento de janeiro que as praias urbanas.'}
      ]}
    ]}
  ]
};
