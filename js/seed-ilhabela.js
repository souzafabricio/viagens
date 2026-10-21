// Roteiro de Ilhabela (jan/2026) — semente importável pela aba Guia.
// Os campos de texto (fork, s, n, d, nota e itens de 'warns') aceitam HTML simples.

export const SEED_ILHABELA = {
  versao: 1,
  nota: 'Todas as distâncias foram medidas no Google Maps a partir do endereço real da hospedagem — <b>Zaya Beach House, R. José Trindade de Souza, 100, Santa Tereza, Ilhabela (−23,7690578, −45,3498571)</b> — e não a partir da praia. Horários e preços foram levantados em agosto de 2026: confirme por WhatsApp na semana da viagem.',
  dias: [
    { id:'d1', dnum:'Dia 1', titulo:'Sexta, 8 de janeiro — chegada', tag:'Viagem', cor:'',
      fork:'<b>Sexta de janeiro é o pior dia da semana para pegar a balsa.</b> A tarifa continua sendo a de dia útil (R$ 19), mas é justamente quando São Paulo inteira desce para a ilha. Se puder escolher, <b>atravesse antes das 11h ou depois das 20h</b>. Saindo de São João da Boa Vista às 4h vocês garantem essa janela com folga.',
      itens:[
        {h:'4h', b:'Saída de São João da Boa Vista', s:'<b>378 km, cerca de 5h16 de estrada</b> até São Sebastião. Saindo às 4h, a chegada é por volta das 9h15 — dá tempo de abastecer com calma e ainda atravessar bem antes das 11h.'},
        {h:'9h15', b:'Encher o tanque em São Sebastião', s:'Combustível na ilha é mais caro e são poucos postos. O mais perto da Zaya fica a 15 min de carro, no Perequê.'},
        {h:'—', b:'Balsa São Sebastião → Ilhabela', s:'Sexta é dia útil: R$ 19 o carro. Agende no Hora Marcada. Travessia 24 h, saídas a cada ~30 min das 5h30 às 23h30. <b>Da balsa até a Zaya são mais 29 min de carro</b> — a pousada fica ao norte da Vila, não ao lado do terminal.'},
        {h:'10h30', b:'Compras no Bom Preço', s:'R. Santa Tereza, 20 — <b>1,5 km da Zaya: 5 min de carro ou 20 min a pé</b>. Abre até 22h. Ao lado: Cachaçarilha e a Arrabal Conveniência. Como o check-in só é às 15h, dá pra já fazer a compra da viagem inteira com calma.'},
        {h:'12h', b:'Almoço no Quiosque do Miro', s:'Av. Leonardo Reale — Pedra do Sino/Garapocaia · <b>6 min de carro</b> · seg a sex 9h–18h. Endereço diverge entre fontes — confirme por (12) 3896-2270 ou @quiosque_do_miro.'},
        {h:'15h', b:'Check-in na Zaya', s:'Self check-in por teclado numérico. Suíte 25 m², ar-condicionado, hidro, mini cozinha.'},
        {h:'17h', b:'Praia de Santa Teresa', s:'400 m, 6 min a pé. Um mergulho tranquilo, já com a bagagem entregue.'},
        {h:'18h30', b:'Pôr do sol no mirante', s:'300 m da porta, 5 min a pé e praticamente plano. O Mirante da Praia dos Barreiros entra nas listas de "onde ir à noite" da ilha.'},
        {h:'20h', b:'Centrinho e jantar na Vila', s:'<b>1,6 km, 21 min a pé</b> (ou 6 min de carro). Centro Histórico à noite: igreja, casario colonial e a <b>Rua do Meio</b>. Jantar no <b>Manjericão</b> (Av. FEB, 20 · R$ 60–160) ou <b>Pimenta de Cheiro</b> (Av. São João, 86 · R$ 40–140). Drink depois: Estaleiro Bar abre 21h30.'}
      ]},
    { id:'d2', dnum:'Dia 2', titulo:'Sábado, 9 de janeiro — Sea Club', tag:'Sea Club', cor:'hl-carol',
      fork:'<b>Confirme a agenda do dia 9 antes de contar com esse plano.</b> O Sea Club alterna <b>Sunset Party</b> (14h–22h, com ingresso), <b>Day Club</b> (10h–19h, só consumação) e dias <b>fechados para evento particular</b>. O roteiro assume Sunset Party.',
      itens:[
        {h:'Manhã', b:'Sem despertador', s:'Café da manhã, piscina, rede. Hoje começa devagar de propósito — a festa é longa e começa cedo.'},
        {h:'11h', b:'Praia de Santa Teresa outra vez', s:'400 m a pé, sem carro, sem logística. Volta com tempo para almoçar leve e trocar de roupa.'},
        {h:'13h30', b:'Sair para o Saco da Capela', s:'<b>2,6 km, 8 min de carro.</b> Vocês vão beber: deixem o app combinado ou definam quem dirige antes de sair.'},
        {h:'14h', b:'Sea Club — Sunset Party', hi:true, s:'Av. Pedro de Paula Moraes, 616 · <b>14h às 22h</b> · 4,3 de 105 avaliações. Piscina, bangalôs, bar e DJ de frente pro mar. <b>R$ 98</b> sem consumação ou <b>R$ 198</b> com R$ 130 de consumação; camarotes (11) 92072-1411. <b>Compre antes</b> — dá sold out.'},
        {h:'Durante', b:'Jantar é lá mesmo', s:'A casa tem cozinha e bar. Com o ingresso de consumação, os R$ 130 cobrem comida e drinks — não precisa reservar restaurante hoje.'},
        {h:'22h', b:'Volta', s:'8 min de carro e vocês estão em casa antes das 22h30, inteiros.'}
      ]},
    { id:'d3', dnum:'Dia 3', titulo:'Domingo, 10 de janeiro — praia, SUP e Makai', tag:'Makai', cor:'hl-sand',
      fork:'<b>Domingo é a única noite boa para o Makai nesta viagem.</b> A casa <b>fecha justamente na terça</b>, que é o dia da volta, e na segunda vocês chegam de Castelhanos destruídos e em cima do horário.',
      itens:[
        {h:'9h', b:'Café da manhã na Zaya', s:'Está incluso — é o item mais elogiado do lugar, citado em 94 avaliações.'},
        {h:'10h', b:'Praia da Pedra do Sino (Garapocaia)', s:'6 minutos de carro. Mar calmo, quiosques, estacionamento e a passarela até as pedras que soam como sino.'},
        {h:'14h', b:'Stand-up paddle', s:'Blue Wave: R$ 50/pessoa por 30 min. Caiçara: R$ 40 a hora. <b>DK SUP</b> (Praia da Ilha das Cabras, 25 min): SUP R$ 60/30 min ou R$ 100 com máscara e snorkel; combo completo R$ 300.'},
        {h:'17h', b:'Volta, banho e hidromassagem', s:'Piscina, espreguiçadeira e a rede do andar de cima.'},
        {h:'19h30', b:'Jantar no Makai', hi:true, s:'Píer da Vila (Praça das Bandeiras, 1) · <b>1,6 km, 21 min a pé</b> · <b>domingo 12h–22h</b> (fecha uma hora mais cedo que sex/sáb) · 4,5 de 1.778 · R$ 60–180 por pessoa. <b>Reserve antes</b> — GetIn no site ou WhatsApp (12) 99110-4254.'},
        {h:'22h', b:'Dormir cedo', s:'Amanhã é o dia mais longo da viagem e o carro sai antes das 9h30.'}
      ]},
    { id:'d4', dnum:'Dia 4', titulo:'Segunda, 11 de janeiro — Castelhanos, o dia inteiro', tag:'Castelhanos', cor:'hl-sea',
      itens:[
        {h:'8h', b:'Café da manhã cedo', s:'Hoje o café é combustível. Leve: repelente <b>em creme</b>, protetor solar, chinelo, toalha, blusa leve, <b>dinheiro em espécie</b> e máscara de snorkel.'},
        {h:'9h30', b:'Sair da Zaya rumo ao Perequê', s:'<b>5 km, 14 min de carro</b> até a Av. Princesa Isabel, 171. As agências pedem chegada 20 min antes.'},
        {h:'10h', b:'Castelhanos "Terra e Mar" — 4x4 na ida, barco na volta', hi:true, s:'<b>10h às 17h30, R$ 290 por pessoa</b> (Dagami). Alternativa jipe/jipe pela Trilhabela: <b>R$ 150 por pessoa</b>. Na ida, 17 km de estrada de terra no Parque Estadual, com paradas em cachoeira com piscina natural, no Mirante de Castelhanos e na Cachoeira do Chuveirinho.'},
        {h:'12h', b:'Praia de Castelhanos', s:'2 km de areia aberta para a Baía de Castelhanos. Almoço nos quiosques — <b>não há internet nem Pix</b>, leve dinheiro. <b>Dia da GoPro.</b>'},
        {h:'15h', b:'Volta de flexboat pelo norte', s:'Duas paradas de ~15 min: <b>Saco do Eustáquio</b> e <b>Praia da Fome</b> (mergulho livre — o snorkel é seu, a agência não fornece).'},
        {h:'17h30', b:'Fim do passeio', s:'Confirme <b>onde</b> o barco desembarca antes de escolher onde deixar o carro.'},
        {h:'20h', b:'Última noite — jantar sem esforço e malas', s:'<b>O Makai não é opção hoje</b> — segunda ele só abre 16h–22h. <b>Deixem as malas prontas antes de dormir.</b>'}
      ]},
    { id:'d5', dnum:'Dia 5', titulo:'Terça, 12 de janeiro — volta', tag:'Viagem', cor:'',
      itens:[
        {h:'9h', b:'Último café da manhã', s:'E a última caminhada de 400 m até a praia.'},
        {h:'11h', b:'Tanque cheio antes de embarcar', s:'Posto Ipiranga, Av. Princesa Isabel 383 — fica no caminho da balsa.'},
        {h:'12h', b:'Checkout', s:'Meio-dia — uma hora mais generoso que a média.'},
        {h:'—', b:'Balsa de volta', s:'Terça é dia útil e fora do fluxo de fim de semana: <b>R$ 19 e a fila mais curta da viagem</b>. Conte <b>29 min de carro</b> da Zaya até o terminal. Saindo ao meio-dia, mire uma travessia a partir das 13h.'}
      ]}
  ],
  secoes: [
    { id:'guia-reservas', titulo:'Reservar antes de viajar', tipo:'warns', itens:[
      '<b>1. Balsa — Hora Marcada.</b> Suas datas caem em <b>sexta (ida) e terça (volta)</b>, dois dias úteis: <b>R$ 19</b> por carro em vez de R$ 28,50. Mas <b>a sexta da ida é o pior gargalo da semana em janeiro</b>. A terça da volta é o oposto. Agende os dois sentidos.',
      '<b>2. Makai — só cabe no domingo.</b> A casa <b>fecha na terça</b>, que é o dia da volta, e na segunda vocês chegam de Castelhanos em cima da hora. Domingo fecha às 22h. GetIn pelo site ou WhatsApp <b>(12) 99110-4254</b>.',
      '<b>3. Sea Club — confira a agenda de janeiro.</b> Alterna Sunset Party, Day Club e dias fechados para evento particular. Em janeiro trazem nome grande e <b>dá sold out</b>. Veja <b>seaclub.com.br/agenda</b> e compre antes. Camarotes (11) 92072-1411; casa (12) 3896-3570.',
      '<b>4. Castelhanos — reserve com antecedência.</b> Depende de <b>número mínimo de participantes e de condição de mar e estrada</b>. Reserve duas semanas antes e reconfirme na véspera.<br>· <b>Dagami Tour</b> — Terra e Mar, R$ 290/pessoa, (11) 94791-1621.<br>· <b>Trilhabela</b> — jipe/jipe, ~6h, R$ 150/pessoa.<br>· <b>Terra &amp; Mar Ilhabela</b> — Av. Princesa Isabel, 171.',
      '<b>5. Repelente antes da fila da balsa.</b> A pior picada de borrachudo acontece esperando embarcar, do lado de São Sebastião.',
      '<b>6. Plano de chuva.</b> Dezembro a março é a estação chuvosa. Se um dia virar, troque a praia pela cachoeira ou pela hidromassagem.'
    ]},
    { id:'guia-dist', titulo:'Distâncias a partir da Zaya', tipo:'box', grupos:[
      { h4:'A pé', linhas:[
        {d:'300 m · 5 min', n:'Mirante da Praia dos Barreiros', s:'Pôr do sol · caminho plano'},
        {d:'400 m · 6 min', n:'Praia de Santa Teresa'},
        {d:'1,4 km · 19 min', n:'Farmácia Nova Roma', s:'R. da Padroeira, 155 · até 22h20'},
        {d:'1,5 km · 20 min', n:'Bom Preço + Vila', s:'R. Santa Tereza, 20 · até 22h · 5 min de carro'},
        {d:'1,6 km · 21 min', n:'Makai · Píer da Vila · Estaleiro Bar', s:'6 min de carro'},
        {d:'2,6 km · 35 min', n:'Sea Club — Saco da Capela', s:'8 min de carro'}
      ]},
      { h4:'De carro', linhas:[
        {d:'5 min', n:'Bom Preço · Vila · Makai', s:'Estacionamento na Vila é o gargalo em janeiro'},
        {d:'6 min', n:'Praia da Pedra do Sino', s:'Quiosques, mar calmo, passarela das pedras'},
        {d:'8 min', n:'Sea Club', s:'Av. Pedro de Paula Moraes, 616'},
        {d:'14 min', n:'Perequê — saída de Castelhanos', s:'Av. Princesa Isabel, 171 · chegue 20 min antes'},
        {d:'15 min', n:'Posto Ipiranga', s:'Av. Princesa Isabel, 383 — o posto mais perto'},
        {d:'15 min', n:'Pimenta de Cheiro', s:'Av. São João, 86 — Perequê'},
        {d:'19–20 min', n:'Supermercado do Frade + farmácias', s:'Drogaria São Paulo é <b>24 h</b>'},
        {d:'25 min', n:'Pedras Miúdas / Ilha das Cabras', s:'Santuário Ecológico Submarino · DK SUP no local'},
        {d:'29 min', n:'Balsa / Terminal de São Sebastião', s:'Some a fila de janeiro por cima disso'},
        {d:'33 min', n:'Praia do Curral', s:'Beach clubs'},
        {d:'51 min', n:'All Mirante', s:'Extremo sul — 23,6 km · qui a ter 14h–21h'}
      ]}
    ]},
    { id:'guia-enderecos', titulo:'Endereços e contatos', tipo:'box', grupos:[
      { h4:'Comer e beber', linhas:[
        {d:'Makai', n:'Píer da Vila — Praça das Bandeiras, 1', s:'Seg, qua e qui 16h–22h · sex e sáb 12h–22h30 · dom 12h–22h · <b>ter fechado</b> · R$ 60–180 · (12) 99110-4254'},
        {d:'Manjericão', n:'Av. Força Expedicionária Brasileira, 20', s:'Sex a ter 11h30–22h30 · <b>qua e qui fechado</b> · R$ 60–160 · 4,6 (5.192) · (12) 99744-1753'},
        {d:'Pimenta de Cheiro', n:'Av. São João, 86 — Perequê', s:'Todos os dias 11h30–22h · R$ 40–140 · 4,6 (14.438) · (12) 3896-3783'},
        {d:'All Mirante', n:'Av. Gov. Mário Covas Jr., 16600 — Borrifos', s:'Qui a ter 14h–21h · <b>qua fechado</b> · 4,7 (1.624) · (12) 3894-1735'},
        {d:'Quiosque do Miro', n:'Av. Leonardo Reale — Pedra do Sino', s:'Seg a sex 9h–18h · (12) 3896-2270'},
        {d:'Sea Club', n:'Av. Pedro de Paula Moraes, 616 — Saco da Capela', s:'Sunset 14h–22h · Day Club 10h–19h · (12) 3896-3570 · camarotes (11) 92072-1411'},
        {d:'Estaleiro Bar', n:'R. Dr. Carvalho, 186 — Centro', s:'Quinta a sábado, 21h30'},
        {d:'Cachaçarilha', n:'R. Santa Tereza, 36', s:'Empório · 4,9 (174) · (12) 99101-4242'}
      ]},
      { h4:'Serviços', linhas:[
        {d:'Mercado', n:'Bom Preço — R. Santa Tereza, 20', s:'1,5 km · até 22h · 4,3 (206)'},
        {d:'Mercado', n:'Supermercado do Frade — Av. Princesa Isabel, 1126', s:'Compra grande · 4,4 (9.766) · (12) 3896-1134'},
        {d:'Farmácia', n:'Nova Roma — R. da Padroeira, 155', s:'A pé · até 22h20 · (12) 3896-3151'},
        {d:'Farmácia', n:'Droga Raia — Av. Princesa Isabel, 1128', s:'Até 23h · 19 min de carro'},
        {d:'Farmácia', n:'Drogaria São Paulo — Av. Princesa Isabel, 1418', s:'<b>24 horas</b> · (12) 3895-9090'},
        {d:'Posto', n:'Ipiranga — Av. Princesa Isabel, 383', s:'15 min de carro · (12) 3896-3092'},
        {d:'Castelhanos', n:'Saída no Perequê — Av. Princesa Isabel, 171', s:'Dagami (11) 94791-1621 · R$ 290/pessoa (Terra e Mar) ou R$ 150 (jipe/jipe, Trilhabela)'},
        {d:'Balsa', n:'Travessia São Sebastião–Ilhabela', s:'24 h · a cada ~30 min · R$ 19 dia útil / R$ 28,50 fim de semana'}
      ]},
      { h4:'Passeios', linhas:[
        {d:'SUP', n:'DK SUP — Praia da Ilha das Cabras', s:'SUP R$ 60/30 min · R$ 80/1 h · R$ 100 com snorkel · <b>combo completo R$ 300</b> · bote + mergulho R$ 120 · lancha R$ 150/h'},
        {d:'SUP', n:'Blue Wave', s:'SUP R$ 50/pessoa por 30 min · caiaque R$ 25/pessoa por 40 min'},
        {d:'SUP', n:'Caiçara Beach', s:'SUP R$ 40 a hora · caiaque R$ 20 individual / R$ 40 duplo'},
        {d:'Barco', n:'Pôr do sol', s:'Viva Ilhabela: coletivo R$ 250/pessoa (mín. 5) ou privativo casal R$ 1.200 · Kairós R$ 500/3 h'},
        {d:'Cachoeira', n:'Cachoeira da Toca', s:'Fontes divergem: R$ 40 a R$ 90 · confirme em cachoeiradatoca.com'}
      ]}
    ], links:[
      {t:'Agendar a balsa', u:'https://horamarcada.dh.sp.gov.br'},
      {t:'Makai', u:'https://www.makaiilhabela.com.br'},
      {t:'DK SUP', u:'https://taplink.cc/dksup'},
      {t:'Castelhanos Terra e Mar', u:'https://dagamitour.com.br/roteiro-terra-e-mar-4x4-flexboat/'},
      {t:'Agenda do Sea Club', u:'https://seaclub.com.br/agenda/'}
    ]},
    { id:'guia-trocas', titulo:'Trocas possíveis', tipo:'box', grupos:[
      { h4:'Se o mar virar e cancelarem o barco', linhas:[
        {d:'Faça', n:'A versão <b>jipe/jipe</b> no mesmo dia', s:'Sai 10h30 e volta 15h45. Mais curta e mais barata (R$ 150/pessoa); vocês só repetem a estrada de terra na volta.'},
        {d:'Ou', n:'Empurre Castelhanos para o <b>domingo</b> e mova o Makai para a segunda', s:'O Makai abre segunda 16h–22h. Só não dá para empurrar para a terça: é o dia da balsa.'}
      ]},
      { h4:'Se o Sea Club estiver fechado no dia 9', linhas:[
        {d:'Plano B', n:'Noite na <b>Vila</b>: jantar + Rua do Meio', s:'Manjericão ou Pimenta de Cheiro, depois a Rua do Meio. Estaleiro Bar abre 21h30.'},
        {d:'Plano C', n:'Troque a festa por um <b>passeio de barco ao pôr do sol</b>', s:'Coletivo R$ 250/pessoa (mín. 5) ou privativo para casal R$ 1.200.'},
        {d:'Ou', n:'Troque o sábado do Sea Club pelo <b>domingo do Makai</b>', s:'Makai no sábado (12h–22h30) e Sea Club no domingo. Funciona igual.'}
      ]},
      { h4:'Se sobrar tempo ou vontade', linhas:[
        {d:'Snorkel', n:'Pedras Miúdas / Ilha das Cabras', s:'25 min de carro. A DK SUP fica no local e fornece máscara e snorkel — resolve o equipamento que Castelhanos não empresta.'},
        {d:'Cachoeira', n:'Cachoeira da Toca', s:'Tobogã natural de pedra. Valores divergem entre fontes — faça cadastro antes, cai quase pela metade.'},
        {d:'Jantar', n:'All Mirante — penhasco no extremo sul', s:'4,7 de 1.624, mas 51 min de carro e fecha às 21h. Melhor como almoço tardio.'},
        {d:'Barco', n:'Praia do Bonete', s:'Só de barco ou trilha de 12 km. É dia inteiro.'}
      ]},
      { h4:'Se der praia ruim ou chuva forte', linhas:[
        {d:'Troque', n:'Praia por cachoeira, ou desça até a Praia Grande', s:'Calçadão, quadra, quiosques e mar tranquilo — o melhor trecho da ilha para SUP num dia de mar mexido.'}
      ]}
    ]}
  ]
};
