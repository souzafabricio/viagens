// Roteiro de Ubatuba (5 a 13 de janeiro de 2027) — semente importável pela aba Guia.
// Os campos de texto (fork, s, n, d, nota e itens de 'warns') aceitam HTML simples.

export const SEED_UBATUBA = {
  versao: 7,
  nota: 'Base da viagem: <b>apartamento da família — R. João Ramalho, 90, Itaguá, Condomínio Village Côte d\'Azur (−23,4449473, −45,0734722)</b>. As distâncias são <b>estimativas</b> calculadas a partir desse endereço: confirme no Maps antes de sair, principalmente em janeiro, quando a Rio-Santos engarrafa. Horários e preços foram levantados em outubro de 2026 — reconfirme por telefone ou WhatsApp na semana da viagem.',
  dias: [
    { id:'d1', dnum:'Dia 1', titulo:'Terça, 5 de janeiro — viagem e chegada', tag:'Viagem', cor:'',
      itens:[
        {h:'4h', b:'Saída de São João da Boa Vista', s:'<b>Cerca de 400 km e 5h50 de estrada</b>, sem contar paradas: SP-344 e SP-340 até Campinas, <b>Dom Pedro I</b> (SP-065) até Jacareí, <b>Carvalho Pinto</b> (SP-070) até São José dos Campos e <b>Tamoios</b> (SP-099) até o litoral. Separe tag ou dinheiro para os pedágios.'},
        {h:'6h30', b:'Parada para café', s:'Qualquer posto da Dom Pedro. Depois da Carvalho Pinto, as paradas boas ficam escassas.'},
        {h:'7h30', b:'São José dos Campos — último abastecimento barato', s:'Combustível no litoral é mais caro. Encha o tanque antes de pegar a Tamoios e desça com o carro cheio.'},
        {h:'8h', b:'Tamoios no planalto — Jambeiro e Paraibuna', s:'<b>Cerca de 60 km de pista dupla</b> até o alto da serra, passando por Jambeiro e pela represa de Paraibuna.'},
        {h:'8h45', b:'Serra da Tamoios', s:'Descida até Caraguatatuba. Pode ter neblina mesmo cedo; respeite os radares, a fiscalização é constante.'},
        {h:'9h15', b:'Contorno de Caraguatatuba e Rio-Santos', s:'O Contorno evita o centro de Caraguatatuba e cai na <b>Rio-Santos (BR-101)</b>. Daqui até Itaguá são <b>~40 km, cerca de 50 min</b>. Saindo às 4h vocês passam por aqui bem antes do engarrafamento que começa no fim da manhã.'},
        {h:'10h15', b:'Curva da Felicidade — parada de foto', hi:true, s:'Mirante na <b>Rod. Dr. Manoel Hipólito do Rêgo, em Toninhas</b> (−23,4801462, −45,0710801), a <b>~10 min do apartamento</b> e no caminho de quem vem de Caraguatatuba. A vista abre a baía inteira — é a foto do carro. O mirante é encostado na pista: entre e saia com cuidado e deixe o carro totalmente fora da faixa de rolamento.'},
        {h:'10h45', b:'Chegada em Itaguá', s:'O apartamento fica a <b>1,5 km do centro</b>. Estacionamento é do condomínio — uma vantagem enorme em janeiro, quando a Zona Azul do centro vive lotada.'},
        {h:'12h30', b:'Almoço na Rua Guarani', s:'<b>9 min a pé.</b> <b>Peixe com Banana</b> (Guarani, 315 · R$ 50–140) é o prato que dá nome à cidade. Alternativa ao lado: <b>Braseiro Caiçara</b> (Guarani, 359).'},
        {h:'14h30', b:'Compras da viagem', s:'<b>Conde Supermercado</b> (R. Cap. Felipe, 558 · ~6 min de carro · até 22h) para a compra grande, ou <b>TopStop</b> (Cap. Felipe, 476 · até 22h30) para o básico. O apartamento tem cozinha: comprar café da manhã da semana inteira economiza bastante.'},
        {h:'16h30', b:'Praia Grande para esticar as pernas', s:'<b>~4,5 km, 9 min de carro.</b> Faixa longa de areia, quiosques, calçadão e estacionamento — a praia urbana mais fácil de Ubatuba.'},
        {h:'19h30', b:'Primeira noite sem esforço', s:'<b>Fritz Cervejaria</b> (Guarani, 345 · 9 min a pé · fecha quarta) ou <b>Quintal da Villa</b> (Guarani, 663 · até 23h). Tudo no mesmo quarteirão do apartamento.'}
      ]},
    { id:'d2', dnum:'Dia 2', titulo:'Quarta, 6 de janeiro — praias do sul', tag:'Sul', cor:'hl-sand',
      fork:'<b>O sul é o lado calmo da cidade.</b> Enseada, Santa Rita, Lázaro e Domingas Dias ficam em baías protegidas: mar parado, bom para boiar e para stand-up. É o contrário do norte, que é mar aberto.',
      itens:[
        {h:'9h', b:'Café sem pressa', s:'Primeiro dia inteiro na cidade, e o trajeto todo é curto. Sem horário apertado.'},
        {h:'10h', b:'Praia Santa Rita', s:'<b>~8 km, 10 min.</b> Baía fechada, água rasa e transparente, com a <b>piscina natural</b> no canto esquerdo. A melhor praia do sul para quem quer só entrar na água e ficar. Tem barraca que aluga stand-up, caiaque, cadeira e guarda-sol.'},
        {h:'12h30', b:'Almoço no Lázaro', s:'<b>~11,8 km, 15 min.</b> Quiosques e restaurantes de frente para a Baía da Fortaleza, com estrutura bem melhor que a do norte.'},
        {h:'14h30', b:'Domingas Dias', hi:true, s:'<b>~12,1 km, 15 min.</b> Acesso por dentro do condomínio, a pé — não dá para encostar o carro na areia, e é justamente por isso que a praia é tão bonita. <b>Estacione cedo</b>: as vagas na rua de acesso são poucas e acabam depois do almoço.'},
        {h:'17h', b:'Fechar os dois passeios de barco', hi:true, s:'Volta pelo <b>Saco da Ribeira</b> (~10,9 km) e feche <b>a escuna de segunda</b> pessoalmente — mais barato e mais seguro que por telefone. Aproveite para confirmar a travessia da <b>Ilha das Couves</b> de terça, que sai de Picinguaba.'},
        {h:'19h30', b:'Jantar no centro', s:'<b>Doca 390</b> (R. Dr. Esteves da Silva, 390 · ~4 min de carro · ter a sáb a partir das 17h). Cerveja artesanal e hambúrguer. A Fritz fecha quarta.'}
      ]},
    { id:'d3', dnum:'Dia 3', titulo:'Quinta, 7 de janeiro — Jundu e Prumirim, o dia todo', tag:'Jundu', cor:'hl-sea',
      fork:'<b>Hoje é um lugar só, o dia inteiro.</b> O Jundu abre às 9h e fecha às 18h, e a ideia é ficar: manhã na praia, almoço na mesa de frente para o mar e tarde sem relógio. <b>Chegue antes das 10h</b> — o estacionamento do Prumirim é pequeno e em janeiro enche cedo.',
      itens:[
        {h:'8h30', b:'Saída para o Prumirim', s:'<b>~17,8 km, 22 min</b> pela Rio-Santos. Leve repelente <b>em creme</b>, protetor, dinheiro em espécie e máscara de snorkel.'},
        {h:'9h30', b:'Manhã na Praia do Prumirim', s:'Mar calmo e praia tranquila, bem menos movimentada que as do centro. A ilha do Prumirim fica logo em frente.'},
        {h:'12h30', b:'Almoço no Jundu Praia Bar', hi:true, s:'Vereda Dez, 159 · <b>9h–18h todos os dias</b> · (12) 3845-3027. O melhor bar pé na areia do norte: cozinha caprichada, drinks bem feitos e banheiro limpo. Peça com calma, a casa é para ficar.'},
        {h:'15h', b:'Tarde na mesa', s:'Sem pressa — petisco, cerveja e sombra. É o dia da viagem em que não existe próximo compromisso.'},
        {h:'17h', b:'Último mergulho', s:'A praia fica na porta do Jundu. Fim de tarde é quando ela fica mais vazia.'},
        {h:'18h', b:'Volta para Itaguá', s:'O Jundu fecha às 18h. 22 min de volta, com o sol ainda alto.'},
        {h:'20h', b:'Jantar em Itaguá', s:'<b>Raízes</b> (Av. Leovigildo Dias Vieira, 1280 · ~5 min de carro · até 23h30) — peixe, massa e pizza, música ao vivo. Reserve ou chegue antes das 20h.'}
      ]},
    { id:'d4', dnum:'Dia 4', titulo:'Sexta, 8 de janeiro — praias do norte', tag:'Norte', cor:'hl-sea',
      fork:'<b>Saia cedo ou não saia.</b> As praias do norte ficam todas na Rio-Santos e o estacionamento é o limite real: Itamambuca e Félix lotam antes das 10h em janeiro. Com o carro posicionado até 9h, o dia inteiro fica fácil.',
      itens:[
        {h:'8h', b:'Café em casa e saída', s:'Leve: repelente <b>em creme</b>, protetor solar, dinheiro em espécie, máscara de snorkel e guarda-sol se tiverem. Os quiosques do norte são simples.'},
        {h:'8h40', b:'Itamambuca', s:'<b>~10,6 km, 13 min.</b> Praia longa de surfista, com rio no canto e muita sombra de árvore. Boa para começar o dia antes do sol forte.'},
        {h:'11h', b:'Praia do Félix', s:'<b>~15,5 km, 19 min.</b> Estaciona no fim da estrada de terra e caminha ~300 m.'},
        {h:'13h', b:'Almoço de quiosque', s:'Os quiosques do Félix têm peixe frito, pastel e cerveja. Sem Pix garantido: <b>leve dinheiro</b>.'},
        {h:'15h', b:'Praia do Português e Conchinha', hi:true, s:'Trilhas curtas, de uns 10 min, saindo dos cantos do Félix. São duas prainhas quase sempre vazias, com água mais calma que a do Félix. <b>Calçado fechado ajuda</b>.'},
        {h:'17h30', b:'Volta sem pressa', s:'A Rio-Santos no sentido Ubatuba no fim da tarde costuma estar tranquila.'},
        {h:'20h', b:'Jantar a pé', s:'<b>Quintal da Villa</b> (Guarani, 663 · até 23h) ou <b>Braseiro Caiçara</b> (Guarani, 359). Os dois a 9 min de casa — deixe o carro parado.'}
      ]},
    { id:'d5', dnum:'Dia 5', titulo:'Sábado, 9 de janeiro — P9 Beach Club', tag:'Beach club', cor:'hl-carol',
      fork:'<b>Sábado é dia de ficar parado.</b> O P9 abre às 9h e fecha às 18h, e o plano é usar o dia quase inteiro lá: almoço, espreguiçadeira e drink de frente para Toninhas. Fica a 12 min de casa, então nada disso depende de pegar estrada.',
      itens:[
        {h:'9h30', b:'Praia do Tenório', s:'<b>~4 km, 8 min.</b> Mar bom para banho e quiosque com cadeira. <b>Chegue antes das 10h</b>: o estacionamento é pequeno e some cedo no sábado.'},
        {h:'12h', b:'P9 Beach Club — Toninhas', hi:true, s:'Rod. Gov. Mário Covas, 753 · <b>~6 km, 12 min</b> · <b>9h–18h todos os dias</b> · (12) 99193-6446. Beach club com restaurante japonês e vista. Cheguem para o almoço e fiquem: espreguiçadeira, drink e mar a tarde toda.'},
        {h:'15h', b:'Tarde no P9', s:'Sem próximo compromisso. O lugar é para esticar — e o sol de janeiro em Toninhas vale a espreguiçadeira até o fim da tarde.'},
        {h:'18h', b:'Fim do dia no P9', s:'A casa fecha às 18h. Volta curta, 12 min, com tempo de banho antes do jantar.'},
        {h:'19h30', b:'Jantar no centro', s:'<b>Doca 390</b> (R. Dr. Esteves da Silva, 390 · até 1h no sábado) — sábado costuma ter música ao vivo. Se quiserem algo mais perto, a <b>Fritz</b> abre ao meio-dia no fim de semana.'}
      ]},
    { id:'d6', dnum:'Dia 6', titulo:'Domingo, 10 de janeiro — dia curto, perto de casa', tag:'Centro', cor:'',
      fork:'<b>Domingo é o pior dia para pegar a Rio-Santos.</b> É quando São Paulo inteira sobe e desce a serra. O dia foi montado para vocês não precisarem do carro por mais de 10 minutos seguidos — e para descansar antes dos dois dias de barco.',
      itens:[
        {h:'9h30', b:'Perequê-Açu e os quiosques da orla', s:'<b>~10 min de carro</b>, com vaga ao longo da praia. É praia de morador, não de cartão-postal, e por isso continua tranquila quando o resto da cidade lota. <b>Quiosque Girassol</b> (Av. Gov. Abreu Sodré, 668) tem muita mesa na areia; o <b>Parada 14</b>, ao lado, é menor e mais calmo.'},
        {h:'13h', b:'Almoço e descanso em casa', s:'Aproveitem a cozinha. Domingo de janeiro é fila em restaurante o dia inteiro.'},
        {h:'16h30', b:'Centro histórico a pé', s:'<b>1,5 km, 20 min a pé</b> até o calçadão e a Praia do Cruzeiro. Boa de caminhar e de olhar o movimento — não de banho.'},
        {h:'18h', b:'Pôr do sol no Píer Comodoro Magalhães', s:'<b>~6 min de carro</b> ou a caminhada do centro. O píer do centro, com a baía inteira na frente, aberto até as 18h.'},
        {h:'20h', b:'Jantar a pé', s:'<b>Quintal da Villa</b> ou <b>Braseiro Caiçara</b>, os dois a 9 min de casa. O Doca 390 fecha domingo.'},
        {h:'22h', b:'Dormir cedo', s:'Amanhã o carro sai às 8h30 e o barco não espera.'}
      ]},
    { id:'d7', dnum:'Dia 7', titulo:'Segunda, 11 de janeiro — Ilha Anchieta, o dia inteiro', tag:'Escuna', cor:'hl-carol',
      fork:'<b>Segunda é o melhor dia da viagem para o barco.</b> Menos gente que no fim de semana, mar historicamente mais calmo de manhã e preço de dia útil. Se o passeio cair por mar ruim, o plano B está na seção <i>Trocas possíveis</i>.',
      itens:[
        {h:'7h30', b:'Café reforçado', s:'Hoje o café é combustível. Leve: <b>dinheiro em espécie</b>, protetor, boné, blusa leve para o vento e a GoPro.'},
        {h:'8h30', b:'Sair para o Saco da Ribeira', s:'<b>~10,9 km, 14 min.</b> As escunas pedem chegada com 30 min de antecedência e o estacionamento da marina enche.'},
        {h:'9h30', b:'Escuna para a Ilha Anchieta', hi:true, s:'Saída do <b>Saco da Ribeira</b>, dia inteiro (cerca de 9h30 às 16h30). A ilha é <b>Parque Estadual</b>: praias de água transparente, ruínas do antigo presídio e trilhas curtas. Costuma sair por <b>R$ 90 a R$ 150 por pessoa</b>, fora a taxa do parque — confirme ao reservar.'},
        {h:'12h', b:'Almoço na ilha', s:'Há quiosque na Praia do Presídio, mas é caro e limitado. <b>Levar lanche e água resolve o dia</b> — e muita escuna libera cooler a bordo.'},
        {h:'14h', b:'Ruínas do presídio e trilha curta', s:'A trilha até as ruínas sai da praia principal e leva uns 20 min. Sombra, história e uma vista boa da baía.'},
        {h:'16h30', b:'Volta à marina', s:'Confirme no embarque <b>onde</b> e <b>a que horas</b> o barco desembarca, para não ficar esperando com o carro do outro lado.'},
        {h:'19h', b:'Jantar leve', s:'Dia de sol e sal cansa mais do que parece. <b>Feito em Casa</b> fecha às 18h, então sobra a Rua Guarani — ou a própria cozinha.'}
      ]},
    { id:'d8', dnum:'Dia 8', titulo:'Terça, 12 de janeiro — Picinguaba e Ilha das Couves', tag:'Couves', cor:'hl-sea',
      fork:'<b>É o passeio mais bonito da região e o mais longe.</b> Picinguaba fica a 40 min pela Rio-Santos, já na divisa com o Rio. A travessia sai da praia, dura 10 min e costuma rodar mesmo quando o mar está ruim lá fora — por isso ele também é o plano B da escuna.',
      itens:[
        {h:'7h30', b:'Saída cedo de Itaguá', s:'<b>~33 km, 41 min</b> pela Rio-Santos. O estacionamento de Picinguaba é pequeno: chegando às 8h30 vocês pegam vaga, às 10h não.'},
        {h:'9h', b:'Travessia para a Ilha das Couves', hi:true, s:'Lanchas da comunidade local saem da Praia de Picinguaba. <b>~R$ 60 por pessoa</b>, ida e volta, com horário de retorno combinado na hora. <b>Leve água e comida</b> — a ilha tem um quiosque só, caro, e não tem banheiro.'},
        {h:'9h30', b:'Praia de Fora', s:'A praia principal da ilha, de água transparente. <b>Melhor snorkel da viagem.</b> Fique no canto direito, onde a pedra junta mais peixe.'},
        {h:'13h', b:'Volta para Picinguaba', s:'Combinem o retorno para as 13h: depois disso a ilha enche e a fila da lancha de volta cresce.'},
        {h:'14h', b:'Almoço na Praia da Fazenda', s:'Vila caiçara dentro do <b>Parque Estadual da Serra do Mar</b>, com restaurantes simples de peixe e o centro de visitantes. 5 min de Picinguaba.'},
        {h:'17h', b:'Volta sem pressa', s:'Parada opcional no <b>Prumirim</b> se ninguém estiver cansado — e uma última no Jundu, que fecha às 18h.'},
        {h:'20h', b:'Última noite', s:'Jantar na Rua Guarani, a pé. <b>Deixem as malas prontas antes de dormir.</b>'}
      ]},
    { id:'d9', dnum:'Dia 9', titulo:'Quarta, 13 de janeiro — volta', tag:'Viagem', cor:'',
      fork:'<b>Quarta é o melhor dia para a estrada.</b> Dia útil, sem o fluxo de volta do fim de semana. Saindo até o meio-dia vocês passam por Caraguatatuba antes do pico da tarde e pegam a serra da Tamoios com luz.',
      itens:[
        {h:'9h', b:'Última manhã na Praia Grande', s:'<b>9 min de carro</b>, com as malas já no porta-malas. Banho rápido, café no quiosque e pronto.'},
        {h:'11h', b:'Última volta pela Rua Guarani', s:'Café, lembrancinha e o que faltou. Tudo no mesmo quarteirão.'},
        {h:'11h30', b:'Fechar o apartamento', s:'Lixo fora, geladeira esvaziada, chave onde combinaram.'},
        {h:'12h', b:'Abastecer antes de pegar a estrada', s:'<b>Posto Sete Estrelas</b> (Av. Leovigildo Dias Vieira, 590 · 3 min · <b>24 h</b>). Rio-Santos parada e serra da Tamoios com pouco combustível é o tipo de aperto que não vale a economia.'},
        {h:'12h30', b:'Estrada de volta', s:'<b>~6h até São João da Boa Vista</b> pelo mesmo caminho: Rio-Santos até Caraguatatuba, Tamoios, Carvalho Pinto e Dom Pedro. Chegada por volta das 18h30.'}
      ]}
  ],
  secoes: [
    { id:'guia-rota', titulo:'Rota de carro', tipo:'mapa',
      pontos:[
        {n:'Casa — São João da Boa Vista', s:'R. Ida Gabriela da Silva Marcondes, Recanto do Lago', lat:-21.9692982, lon:-46.7576281},
        {n:'Rodovia dos Tamoios — Jambeiro', s:'Ponto de passagem: a descida é pela Tamoios', lat:-23.3145716, lon:-45.7553369},
        {n:'Curva da Felicidade — Toninhas', s:'Mirante na Rio-Santos, parada de foto antes de chegar', lat:-23.4801462, lon:-45.0710801},
        {n:'Apartamento — Itaguá, Ubatuba', s:'R. João Ramalho, 90', lat:-23.4449395, lon:-45.0734749}
      ],
      links:[
        {t:'Abrir no Waze', u:'https://waze.com/ul?ll=-23.4449395,-45.0734749&navigate=yes'}
      ]},
    { id:'guia-reservas', titulo:'Reservar antes de viajar', tipo:'warns', itens:[
      '<b>1. Escuna da Ilha Anchieta — reserve com antecedência e reconfirme na véspera.</b> Em janeiro os barcos saem cheios e o passeio depende de condição de mar. Fechar pessoalmente no <b>Saco da Ribeira</b> na quarta costuma sair mais barato que por telefone.<br>· <b>Mykonos Turismo</b> — R. Flamenguinho, 17 · (12) 99603-1985 · <b>fecha quarta</b>.<br>· <b>Escuna Copacabana</b> — Av. da Ribeira, 400 · (12) 99763-8690.<br>· <b>Passeios de Escuna Ubatuba</b> — Av. Leovigildo Dias Vieira, 446 (Itaguá) · (12) 99184-7933 · 8h–20h todos os dias.',
      '<b>2. Ilha das Couves — não precisa reservar, mas precisa chegar cedo.</b> A travessia sai de Picinguaba por ordem de chegada, ~R$ 60 por pessoa. Até 9h tem vaga de estacionamento e lancha; depois das 10h vira fila. A ilha <b>não tem banheiro</b> e tem um quiosque só.',
      '<b>3. O trecho crítico é a Rio-Santos, nos dois sentidos.</b> Entre Caraguatatuba e Ubatuba ela é pista simples e trava em janeiro. Saindo de casa às 4h vocês passam por Caraguatatuba antes das 9h30, que é o que faz a ida valer a pena. Na volta, saia de Ubatuba até o começo da tarde. <b>E evite a Rio-Santos no domingo</b> — foi por isso que o dia 10 ficou perto de casa.',
      '<b>4. Dinheiro em espécie.</b> Quiosque de praia do norte, lancha de Picinguaba e a ilha costumam não ter sinal para Pix nem maquininha confiável. Leve notas pequenas.',
      '<b>5. Repelente em creme, não spray.</b> Borrachudo em Ubatuba é pior nas praias com rio — Itamambuca e Prumirim entram nessa lista.',
      '<b>6. Plano de chuva.</b> Janeiro é o mês mais chuvoso do litoral norte: espere pancada de fim de tarde quase todo dia. Praia de manhã, programa coberto à tarde.'
    ]},
    { id:'guia-dist', titulo:'Distâncias a partir do apartamento', tipo:'box', grupos:[
      { h4:'A pé', linhas:[
        {d:'700 m · 9 min', n:'Rua Guarani', s:'Quintal da Villa · Braseiro Caiçara · Fritz Cervejaria'},
        {d:'1,5 km · 20 min', n:'Praia do Cruzeiro e centro', s:'Calçadão e píer · praia boa para caminhar, não para banho'},
        {d:'1,9 km · 25 min', n:'Drogaria São Paulo', s:'R. Dona Maria Alves, 468 · <b>24 h</b>'}
      ]},
      { h4:'De carro', linhas:[
        {d:'3 min', n:'Posto Sete Estrelas', s:'Av. Leovigildo Dias Vieira, 590 · <b>24 h</b>'},
        {d:'6 min', n:'Conde Supermercado · TopStop', s:'R. Cap. Felipe · compra grande · até 22h / 22h30'},
        {d:'6 min', n:'Píer Comodoro Magalhães', s:'Pôr do sol · aberto até as 18h'},
        {d:'8 min', n:'Praia do Tenório', s:'Mar bom para banho · quiosques · estacionamento pequeno'},
        {d:'9 min', n:'Praia Grande', s:'A praia urbana mais fácil · calçadão e estrutura'},
        {d:'10 min', n:'Perequê-Açu', s:'Quiosques com mesa na areia · vaga ao longo da orla'},
        {d:'10 min', n:'Praia Santa Rita', s:'Baía fechada · piscina natural no canto'},
        {d:'10 min', n:'Curva da Felicidade — Toninhas', s:'Mirante na Rio-Santos · parada de foto'},
        {d:'12 min', n:'P9 Beach Club — Toninhas', s:'Rod. Gov. Mário Covas, 753 · 9h–18h todos os dias'},
        {d:'13 min', n:'Itamambuca', s:'Praia longa de surf · rio e sombra'},
        {d:'14 min', n:'Saco da Ribeira', s:'Marina · saída das escunas · chegue 30 min antes'},
        {d:'15 min', n:'Lázaro · Domingas Dias', s:'Mar calmo · Domingas Dias só a pé por dentro do condomínio'},
        {d:'15 min', n:'Trilha das Sete Fontes', s:'Três praias numa caminhada curta'},
        {d:'19 min', n:'Praia do Félix', s:'+300 m a pé · trilhas para Português e Conchinha'},
        {d:'22 min', n:'Prumirim e Jundu', s:'Praia tranquila · Jundu 9h–18h todos os dias'},
        {d:'41 min', n:'Picinguaba e Praia da Fazenda', s:'Saída das lanchas para a Ilha das Couves'}
      ]}
    ]},
    { id:'guia-enderecos', titulo:'Endereços e contatos', tipo:'box', grupos:[
      { h4:'Comer e beber', linhas:[
        {d:'Peixe com Banana', n:'Rua Guarani, 315 — Centro', s:'Seg e qua a dom 12h–22h (sex e sáb até 23h) · <b>terça fechado</b> · R$ 50–140 · (12) 3833-9683'},
        {d:'Braseiro Caiçara', n:'Rua Guarani, 359 — Itaguá', s:'Todos os dias 11h30–23h · (12) 3208-3369'},
        {d:'Quintal da Villa', n:'Rua Guarani, 663 — Itaguá', s:'Todos os dias 11h30–23h · porções grandes · (12) 3833-4338'},
        {d:'Raízes', n:'Av. Leovigildo Dias Vieira, 1280 — Itaguá', s:'Todos os dias 11h30–23h30 · música ao vivo · (12) 3832-3377'},
        {d:'Feito em Casa', n:'Av. Leovigildo Dias Vieira, 1180 — Itaguá', s:'Café e almoço, fecha 18h · <b>quinta fechado</b> · (11) 99147-8240'},
        {d:'Fritz Cervejaria', n:'Rua Guarani, 345 — Itaguá', s:'A partir das 15h30 · sáb e dom a partir do meio-dia · <b>quarta fechado</b>'},
        {d:'Doca 390', n:'R. Dr. Esteves da Silva, 390 — Centro', s:'Ter a sáb 17h–00h (sex e sáb até 1h) · <b>dom e seg fechado</b>'},
        {d:'Jundu Praia Bar', n:'Vereda Dez, 159 — Prumirim', s:'Bar pé na areia · <b>9h–18h todos os dias</b> · 22 min de carro · (12) 3845-3027'},
        {d:'P9 Beach Club', n:'Rod. Gov. Mário Covas, 753 — Toninhas', s:'Beach club e japonês · <b>9h–18h todos os dias</b> · 12 min de carro · (12) 99193-6446'},
        {d:'Quiosque Girassol', n:'Av. Gov. Abreu Sodré, 668 — Perequê-Açu', s:'Mesa na areia · 9h–18h · (12) 98814-6129'}
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
        {d:'Escuna', n:'Mykonos Turismo — R. Flamenguinho, 17', s:'Saco da Ribeira · 8h–17h · <b>quarta fechado</b> · (12) 99603-1985'},
        {d:'Escuna', n:'Escuna Copacabana — Av. da Ribeira, 400', s:'Saco da Ribeira · 8h–17h · (12) 99763-8690'},
        {d:'Escuna', n:'Passeios de Escuna Ubatuba — Av. Leovigildo Dias Vieira, 446', s:'Itaguá · 8h–20h todos os dias · Couves, Prumirim e Anchieta · (12) 99184-7933'},
        {d:'Lancha', n:'Ilha das Couves — saída de Picinguaba', s:'Comunidade local · ~R$ 60 por pessoa ida e volta · por ordem de chegada · (12) 99761-7872'},
        {d:'Stand-up', n:'Aloha — Praia de Santa Rita', s:'SUP, caiaque, cadeira e guarda-sol na areia · <b>quarta fechado</b> · (12) 99202-9557'}
      ]}
    ], links:[
      {t:'Curva da Felicidade', u:'https://www.google.com/maps/place/Mirante/@-23.4801462,-45.0710801,17z/data=!3m1!4b1!4m6!3m5!1s0x94cd53febc213513:0xba3c4305f54cbf84!8m2!3d-23.4801462!4d-45.0710801'},
      {t:'Rota: apartamento → Itamambuca', u:'https://www.google.com/maps/dir/R.+Jo%C3%A3o+Ramalho,+90+-+Itagu%C3%A1,+Ubatuba+-+SP,+11680-000/Praia+do+Itamambuca,+Ubatuba+-+SP,+11680-000/@-23.4196738,-45.0663946,14z/data=!4m14!4m13!1m5!1m1!1s0x94cd518082f8adad:0x56a8144d446e8f5d!2m2!1d-45.0734749!2d-23.4449395!1m5!1m1!1s0x94cd52b165e4b043:0xc424c3a059f878e3!2m2!1d-45.0038751!2d-23.3968886!3e0'}
    ]},
    { id:'guia-trocas', titulo:'Trocas possíveis', tipo:'box', grupos:[
      { h4:'Se o mar virar e cancelarem a escuna na segunda', linhas:[
        {d:'Faça', n:'Antecipe a <b>Ilha das Couves</b> para a segunda', s:'A travessia de Picinguaba é mar de dentro e costuma rodar com o mar ruim lá fora. Aí a terça vira o dia de sobra.'},
        {d:'Ou', n:'Troque o barco pela <b>trilha das Sete Fontes</b>', s:'15 min de carro. Caminhada curta que liga três praias, com quiosque nas duas últimas. Dia inteiro sem depender de mar.'},
        {d:'Ou', n:'Empurre a escuna para a <b>terça</b>', s:'E leve as Couves para outro dia. A quarta é da volta — não conte com ela.'}
      ]},
      { h4:'Se chover o dia inteiro', linhas:[
        {d:'Plano A', n:'Almoço longo na <b>Rua Guarani</b> + <b>Fritz Cervejaria</b>', s:'Tudo no mesmo quarteirão de casa, sem pegar o carro. A Fritz fecha quarta.'},
        {d:'Plano B', n:'<b>Jundu</b> ou <b>P9</b> assim mesmo', s:'Os dois têm área coberta e vista. Chuva de janeiro no litoral costuma passar em uma hora — e os dois ficam bem mais vazios.'},
        {d:'Plano C', n:'Dia de cozinha em casa', s:'O apartamento tem cozinha e a compra já está feita. Chuva forte é justamente quando a Rio-Santos fica pior.'}
      ]},
      { h4:'Se sobrar tempo ou vontade', linhas:[
        {d:'Beach club', n:'HOU e Red Beach Club — Vermelha do Norte', s:'20 min de carro, lado a lado. O Red fica aberto até as 20h, o melhor pôr do sol da cidade. O HOU fecha quarta.'},
        {d:'Praia', n:'Praia Vermelha do Centro', s:'9 min de carro. Areia avermelhada e nascer do sol bonito — mar de tombo, cuidado no banho.'},
        {d:'Trilha', n:'Sete Fontes', s:'15 min de carro. Três praias numa caminhada de meio período.'},
        {d:'Stand-up', n:'Santa Rita ou Domingas Dias', s:'As duas baías mais paradas da cidade — é onde se aluga prancha em janeiro.'}
      ]},
      { h4:'Se a praia estiver impraticável de gente', linhas:[
        {d:'Troque', n:'Centro e Tenório pelas praias do <b>norte</b>', s:'Félix, Prumirim e as prainhas de trilha absorvem muito melhor o movimento de janeiro que as praias urbanas.'}
      ]}
    ]}
  ]
};
