window.MATRIX_DATA = {
  "metadata": {
    "projectTitle": "Comparação de Design Systems Editoriais",
    "context": "Investigação de mestrado em Design Gráfico — media digitais",
    "language": "pt-PT",
    "normativeFramework": [
      "WCAG 2.1 / 2.2 (AA e AAA)",
      "European Accessibility Act (Diretiva UE 2019/882)",
      "Decreto-Lei n.º 82/2022 (Portugal)",
      "W3C Design Tokens Community Group Format"
    ],
    "aestheticDirection": {
      "style": "International Typographic Style (Swiss Grid)",
      "grid": "1px solid #1A1A1A exposed hairline",
      "palette": {
        "canvas": "#F4F3EF",
        "surfaceSelected": "#EAE8E1",
        "surfaceActive": "#FFFFFF",
        "inkPrimary": "#111111",
        "accentSwissRed": "#E62E25"
      },
      "typography": {
        "display": "'Helvetica Neue', 'Neue Haas Grotesk Display Pro', 'Inter', sans-serif",
        "body": "'Inter', 'Helvetica Neue', sans-serif",
        "mono": "'JetBrains Mono', monospace"
      }
    }
  },
  "columns": [
    {
      "id": "N1",
      "order": 1,
      "phase": "Antes do digital",
      "name": "Origens no papel",
      "subtitle": "Contexto histórico"
    },
    {
      "id": "N2",
      "order": 2,
      "phase": "Antes do digital",
      "name": "Sistema impresso",
      "subtitle": "Grelhas, tipografia e manuais"
    },
    {
      "id": "N3",
      "order": 3,
      "phase": "Design system digital",
      "name": "O design system",
      "subtitle": "Origem e gestão"
    },
    {
      "id": "N4",
      "order": 4,
      "phase": "Design system digital",
      "name": "Contexto económico",
      "subtitle": "Política, financiamento e modelo de negócio"
    },
    {
      "id": "N5",
      "order": 5,
      "phase": "Design system digital",
      "name": "Sociedade e leis",
      "subtitle": "Leitura, privacidade (RGPD) e acessibilidade (WCAG)"
    },
    {
      "id": "N6",
      "order": 6,
      "phase": "Design system digital",
      "name": "Aspeto técnico",
      "subtitle": "Código, Atomic Design e design tokens"
    },
    {
      "id": "N7",
      "order": 7,
      "phase": "Design system digital",
      "name": "Resultado visual",
      "subtitle": "Análise do componente-testemunha"
    }
  ],
  "rows": [
    {
      "rowId": "L0",
      "order": 0,
      "entity": "A teoria de base",
      "systemName": "Escola Suíça",
      "country": "Suíça / Internacional",
      "period": "1950–1970",
      "archetype": "A grelha como regra",
      "nodes": {
        "N1": {
          "coord": "L0.N1",
          "title": "Pós-guerra e informação em massa",
          "tags": [
            "História do design",
            "Suíça",
            "Anos 1950"
          ],
          "content": "Nos anos 1950 e 1960, a imprensa, a edição técnica e a comunicação internacional cresceram depressa. Era preciso organizar muita informação com método. Na Suíça, o Estilo Tipográfico Internacional deixou de lado o ornamento e passou a dar prioridade à clareza. O designer deixava de ser visto como artista e passava a organizar a informação para o leitor."
        },
        "N2": {
          "coord": "L0.N2",
          "title": "Grelhas modulares e design como programa",
          "tags": [
            "Müller-Brockmann",
            "Karl Gerstner",
            "Grelha modular"
          ],
          "content": "Josef Müller-Brockmann publicou 'Grid Systems in Graphic Design' em 1961 e definiu a grelha modular como uma estrutura matemática para as hierarquias tipográficas e as proporções. Em 1964, Karl Gerstner apresentou em 'Designing Programmes' a ideia de desenhar sistemas de regras em vez de soluções isoladas. Esta ideia está na origem dos design systems."
        },
        "N3": {
          "coord": "L0.N3",
          "title": "Da regra impressa ao digital",
          "tags": [
            "Genealogia",
            "Sistematização",
            "Regras visuais"
          ],
          "content": "Nos anos 60 ainda não havia produtos digitais, mas a teoria de Gerstner já separava a estrutura da aparência visual. O manual de identidade impresso deixou de ser um catálogo de exemplos fixos e passou a ser um conjunto de regras que outros designers podiam aplicar sem perder a coerência."
        },
        "N4": {
          "coord": "L0.N4",
          "title": "Vários idiomas, um só layout",
          "tags": [
            "Europa",
            "Comunicação internacional",
            "Flexibilidade"
          ],
          "content": "Na Suíça e nas instituições europeias do pós-guerra comunicava-se em três ou quatro línguas (alemão, francês, italiano e inglês). Os layouts tinham de ser flexíveis: a página precisava de aguentar diferenças de cerca de 30% no comprimento do texto entre idiomas sem perder o equilíbrio."
        },
        "N5": {
          "coord": "L0.N5",
          "title": "Leitura para todos e sinalética pública",
          "tags": [
            "Objetividade",
            "Legibilidade",
            "Neo-grotescas"
          ],
          "content": "A clareza tipográfica era vista como um dever cívico. Abandonaram-se as letras góticas e decorativas e passaram a usar-se tipos sem serifa neo-grotescos, como a Akzidenz-Grotesk, a Univers (de Adrian Frutiger) e a Helvetica (de Max Miedinger). O objetivo era uma leitura imediata e neutra, ao alcance de qualquer pessoa no espaço público."
        },
        "N6": {
          "coord": "L0.N6",
          "title": "Univers e a numeração das fontes",
          "tags": [
            "Univers",
            "Adrian Frutiger",
            "Numeração"
          ],
          "content": "Em 1957, Adrian Frutiger desenhou a Univers e trocou os nomes confusos dos estilos (negrito, condensado) por números: Univers 55 para o peso normal, 65 para o negrito e 57 para o condensado. É o antepassado dos pesos numéricos do CSS (font-weight: 400, 500, 700) e das fontes variáveis."
        },
        "N7": {
          "coord": "L0.N7",
          "title": "A grelha como base visual",
          "tags": [
            "Proporção",
            "Módulos",
            "Antepassado do CSS Grid"
          ],
          "content": "A página dividida em módulos, com intervalos constantes (gutters) entre eles, cria um ritmo em que texto, fotografia e legendas ficam alinhados. Esta lógica está na base do CSS Grid, usado hoje nos navegadores.",
          "witnessComponent": {
            "type": "swiss-modular-grid",
            "interactiveFeatures": [
              "Toggle Grid Lines",
              "Switch Module Ratios (3x4 vs 4x6)"
            ],
            "wcagNotes": "Contraste máximo tipográfico (#111111 sobre #F4F3EF = 16.4:1 AAA)."
          }
        }
      }
    },
    {
      "rowId": "L1",
      "order": 1,
      "entity": "The Guardian",
      "systemName": "Source Design System",
      "country": "Reino Unido",
      "period": "2005 (Print) / 2019–Presente (Source)",
      "archetype": "Do papel ao open source",
      "nodes": {
        "N1": {
          "coord": "L1.N1",
          "title": "Crise do formato broadsheet (2003–2005)",
          "tags": [
            "Imprensa britânica",
            "Mobilidade urbana",
            "Broadsheet"
          ],
          "content": "No início dos anos 2000, os jornais de referência britânicos perdiam leitores, sobretudo entre quem viajava de metro e de comboio e achava o formato broadsheet, muito grande, difícil de manusear. O The Times optou pelo formato tabloide, com o risco de ser associado à imprensa sensacionalista. O The Guardian procurou uma terceira via, inspirada na tradição europeia."
        },
        "N2": {
          "coord": "L1.N2",
          "title": "O redesenho Berliner (2005)",
          "tags": [
            "Mark Porter",
            "Christian Schwartz",
            "Guardian Egyptian"
          ],
          "content": "Em setembro de 2005, sob a direção criativa de Mark Porter, o jornal passou para o formato Berliner, intermédio entre o broadsheet e o tabloide. A tipografia foi desenhada por Christian Schwartz e Paul Barnes. O projeto trouxe uma grelha modular rigorosa, uma família tipográfica própria (Guardian Egyptian), que serve desde as manchetes às legendas mais pequenas, e uma cor para cada secção do jornal."
        },
        "N3": {
          "coord": "L1.N3",
          "title": "Source: o sistema digital (2019–presente)",
          "tags": [
            "Open source",
            "React",
            "Figma"
          ],
          "content": "O Source é o design system digital do The Guardian. Foi criado para juntar o trabalho das equipas de produto, design e engenharia. Traduz a linguagem visual do jornal impresso para uma biblioteca de componentes reutilizáveis, que garante consistência entre o site e as aplicações móveis."
        },
        "N4": {
          "coord": "L1.N4",
          "title": "Financiado pelos leitores",
          "tags": [
            "Scott Trust",
            "Receita dos leitores",
            "Sem paywall"
          ],
          "content": "O jornal é gerido pelo Scott Trust e recusou ter uma paywall tradicional. Defende o acesso aberto a informação verificada, numa altura marcada pelo Brexit e pela desinformação. Para se financiar, o Source teve de aperfeiçoar os componentes que pedem contribuições voluntárias (epics e banners de apoio), sem prejudicar a leitura nem a credibilidade."
        },
        "N5": {
          "coord": "L1.N5",
          "title": "Acessibilidade, RGPD e WCAG 2.1 AA",
          "tags": [
            "WCAG 2.1 AA",
            "RGPD",
            "Contraste"
          ],
          "content": "O jornalismo aberto não pode ter barreiras para quem tem limitações visuais, motoras ou cognitivas. O Source cumpre de raiz os critérios WCAG 2.1 AA. Por isso foi preciso ajustar as cores históricas do papel, que muitas vezes não passavam nos testes de contraste em ecrãs retroiluminados."
        },
        "N6": {
          "coord": "L1.N6",
          "title": "Design tokens e os cinco pilares",
          "tags": [
            "Atomic Design",
            "Temas",
            "Cinco pilares"
          ],
          "content": "Para gerir dezenas de variações de layout sem duplicar folhas de estilo, a equipa transformou as cores de secção do papel em design tokens. O sistema tem cinco pilares editoriais (News, Opinion, Sport, Culture, Lifestyle). O mesmo componente muda sozinho a cor do filete, do título e do fundo consoante a secção onde está."
        },
        "N7": {
          "coord": "L1.N7",
          "title": "Cartões modulares e Guardian Headline",
          "tags": [
            "Article Card",
            "Hierarquia",
            "Tokens de pilar"
          ],
          "content": "O sistema usa uma grelha fluida e as tipografias Guardian Headline e Guardian Text Egyptian. Nos cartões de notícia (Article Cards), distingue-se logo um facto de uma opinião: os artigos de opinião têm fundo em tom pastel, a assinatura do colunista em destaque e umas aspas grandes na cor do pilar.",
          "witnessComponent": {
            "type": "guardian-pillar-card",
            "interactiveFeatures": [
              "Pillar Switcher: News (#C70000), Opinion (#E05E00), Sport (#0084C6), Culture (#A1845C), Lifestyle (#BB3B80)"
            ],
            "wcagNotes": "Kicker e Headline com rácio > 7.2:1 (AAA) sobre superfície clara; filete superior de 2px identifica o pilar sem depender apenas da cor do texto."
          }
        }
      }
    },
    {
      "rowId": "L2",
      "order": 2,
      "entity": "BBC",
      "systemName": "BBC GEL (Global Experience Language)",
      "country": "Reino Unido",
      "period": "1997 (Print/TV) / 2010–Presente (GEL)",
      "archetype": "Serviço público e acessibilidade",
      "nodes": {
        "N1": {
          "coord": "L2.N1",
          "title": "Uma identidade para vários canais (1960–1997)",
          "tags": [
            "Serviço público",
            "Radio Times",
            "Lambie-Nairn"
          ],
          "content": "A BBC é sobretudo audiovisual, mas também publicou revistas como a Radio Times. Durante décadas teve de unir vários canais de televisão, estações de rádio e serviços internacionais sob uma só imagem pública. Os manuais de identidade de Abram Games e a revisão de Martin Lambie-Nairn, em 1997, reforçaram o rigor visual antes da passagem ao digital."
        },
        "N2": {
          "coord": "L2.N2",
          "title": "Manuais impressos e Gill Sans",
          "tags": [
            "Gill Sans",
            "Sinalética",
            "Web fragmentada"
          ],
          "content": "Os manuais da BBC fixavam regras estritas para a tipografia humanista Gill Sans, a papelaria e os grafismos de ecrã. Mas com o crescimento da BBC Online, a partir do fim dos anos 90, cada departamento fez as suas páginas por conta própria. O resultado foram dezenas de interfaces incompatíveis."
        },
        "N3": {
          "coord": "L2.N3",
          "title": "BBC GEL: um dos primeiros (2010–presente)",
          "tags": [
            "Ben Gammon",
            "Pioneiro",
            "2010"
          ],
          "content": "O Global Experience Language (GEL) foi lançado em 2010, com direção de design de Ben Gammon. Foi um dos primeiros design systems digitais documentados à escala global, vários anos antes do Material Design da Google. Criou grelhas partilhadas e padrões de interação para unir serviços tão diferentes como o BBC News, o BBC Sport, o iPlayer e as plataformas educativas."
        },
        "N4": {
          "coord": "L2.N4",
          "title": "Financiada pela taxa pública",
          "tags": [
            "Licence fee",
            "Imparcialidade",
            "Sem dark patterns"
          ],
          "content": "A BBC é financiada pelos cidadãos britânicos e regulada por uma Royal Charter, que impõe imparcialidade e serviço universal. Não compete por cliques como os media privados. Por isso não pode usar dark patterns para reter utilizadores, e o GEL tem de ser sóbrio e reutilizar bem os recursos técnicos públicos."
        },
        "N5": {
          "coord": "L2.N5",
          "title": "Referência em acessibilidade (Equality Act 2010)",
          "tags": [
            "WCAG AAA/AA",
            "Equality Act",
            "Inclusão"
          ],
          "content": "Um serviço pago por todos tem de ser utilizável por todos. Seguindo este princípio, o GEL escreveu normas de acessibilidade que se tornaram referência mundial. Todos os componentes são pensados desde o início para leitores de ecrã, navegação só com teclado e pessoas com dislexia, daltonismo ou limitações motoras graves. A acessibilidade é o ponto de partida."
        },
        "N6": {
          "coord": "L2.N6",
          "title": "Grelha de 8px/16px e BBC Reith",
          "tags": [
            "BBC Reith",
            "Dalton Maag",
            "Desempenho"
          ],
          "content": "Para servir desde ecrãs 4K em Londres até telemóveis baratos com redes 2G, através do BBC World Service, o sistema usa uma grelha leve baseada em múltiplos de 8px e 16px. Em 2017, a BBC deixou a Gill Sans e a Arial e passou a usar a BBC Reith, desenhada pela Dalton Maag. É uma fonte própria, pensada para leitura rápida em ecrãs pequenos e para vários alfabetos."
        },
        "N7": {
          "coord": "L2.N7",
          "title": "Escala tipográfica e áreas de toque",
          "tags": [
            "Canon & Trafalgar",
            "Área de toque 44px",
            "Semântica"
          ],
          "content": "Os níveis da escala tipográfica do GEL têm nomes da tipografia clássica inglesa (Canon, Trafalgar, Paragon, Double Pica, Great Primer, Body Copy, Brevier) e os tamanhos ajustam-se ao dispositivo. No BBC News, as notícias distinguem-se pelo espaçamento generoso, pela falta de decoração e por áreas de toque de, pelo menos, 44×44px.",
          "witnessComponent": {
            "type": "bbc-gel-anatomy",
            "interactiveFeatures": [
              "Inspect Type Scale (Trafalgar / Great Primer / Body Copy / Brevier)",
              "Toggle 44x44px Touch Target Overlay"
            ],
            "wcagNotes": "Cumprimento estrito do Critério 2.5.5 (Target Size) e hierarquia de cabeçalhos semântica para leitores de ecrã."
          }
        }
      }
    },
    {
      "rowId": "L3",
      "order": 3,
      "entity": "Financial Times",
      "systemName": "Origami / FT Design System",
      "country": "Reino Unido / Global",
      "period": "1893 (FT Pink) / 2013–Presente (Origami)",
      "archetype": "Módulos e jornalismo de dados",
      "nodes": {
        "N1": {
          "coord": "L3.N1",
          "title": "O papel salmão do FT (1888–1893)",
          "tags": [
            "FT Pink",
            "1893",
            "Diferenciação"
          ],
          "content": "O Financial Times foi fundado em 1888. Em 1893 passou a imprimir em papel cor de salmão (FT Pink). Foi uma forma de reduzir os custos de branqueamento do papel e de distinguir o jornal do rival Financial News nas bancas de Londres. A cor tornou-se o símbolo do jornalismo económico."
        },
        "N2": {
          "coord": "L3.N2",
          "title": "Tabelas e muita informação por página",
          "tags": [
            "Cotações",
            "Tipografia condensada",
            "Filetes finos"
          ],
          "content": "O FT tinha de organizar páginas inteiras de cotações da bolsa, tabelas com números pequenos e gráficos financeiros ao lado de artigos de fundo. Para isso aperfeiçoou grelhas de colunas estreitas, filetes finos (hairlines) e tipos condensados fáceis de ler em números."
        },
        "N3": {
          "coord": "L3.N3",
          "title": "Origami e FT Design System (2013–presente)",
          "tags": [
            "Origami",
            "Módulos",
            "GitHub"
          ],
          "content": "O Origami foi criado por volta de 2013 pela equipa de engenharia e design do jornal. Foi um dos primeiros design systems verdadeiramente modulares da imprensa. É uma coleção de componentes independentes e versionados, usados no site de notícias, nas ferramentas de análise de mercados e nas aplicações internas da redação."
        },
        "N4": {
          "coord": "L3.N4",
          "title": "Paywall pioneira e rutura com a Apple",
          "tags": [
            "Subscrição B2B",
            "Web App HTML5",
            "Paywall medida"
          ],
          "content": "O FT foi pioneiro na subscrição digital medida por consumo (metered paywall, 2007). Em 2011 retirou a sua aplicação da App Store da Apple para não ceder 30% das receitas nem os dados dos leitores, e apostou numa Web App em HTML5. Isso exigiu um sistema de componentes rápido e consistente no navegador."
        },
        "N5": {
          "coord": "L3.N5",
          "title": "Leitura prolongada e WCAG",
          "tags": [
            "Cansaço visual",
            "#FFF1E5",
            "Contraste"
          ],
          "content": "Os subscritores do FT (analistas, decisores políticos, gestores) leem relatórios longos e tabelas densas durante horas. Ao passar o salmão do papel para o fundo digital (#FFF1E5), o FT ganhou conforto: encandeia menos do que o branco puro (#FFFFFF). Para cumprir a WCAG 2.1 AA/AAA sobre um fundo colorido, toda a paleta de texto e gráficos foi calculada para ter contraste suficiente."
        },
        "N6": {
          "coord": "L3.N6",
          "title": "Pacotes independentes e Visual Vocabulary",
          "tags": [
            "Micro-frontends",
            "Visual Vocabulary",
            "Core Web Vitals"
          ],
          "content": "Num produto de subscrição caro, a rapidez de carregamento ajuda a manter assinantes. O Origami permite carregar só o código necessário em cada página. A equipa de dados criou também o FT Visual Vocabulary, que define regras visuais e de código para mais de 70 tipos de gráficos estatísticos."
        },
        "N7": {
          "coord": "L3.N7",
          "title": "Financier, Metric e infografia",
          "tags": [
            "Kris Sowersby",
            "Financier Display",
            "Infografia"
          ],
          "content": "A identidade junta a autoridade da serifada Financier Display (de Kris Sowersby) com a precisão da Metric, usada em dados, tabelas e navegação. Destacam-se o fundo Paper (#FFF1E5), os botões para seguir tópicos (myFT) e a grelha rigorosa dos gráficos financeiros.",
          "witnessComponent": {
            "type": "ft-origami-card",
            "interactiveFeatures": [
              "Inspect Contrast Ratios on #FFF1E5 Paper Surface",
              "Toggle Data Chart Vocabulary View"
            ],
            "wcagNotes": "Superfície #FFF1E5 com texto #33302E garante rácio de 11.2:1 (AAA); acento Claret (#990F3D) garante 6.8:1 (AA)."
          }
        }
      }
    },
    {
      "rowId": "L4",
      "order": 4,
      "entity": "The New York Times",
      "systemName": "Ink Design System",
      "country": "Estados Unidos",
      "period": "Século XX (Print) / 2018–Presente (Ink)",
      "archetype": "Sistema e direção de arte à medida",
      "nodes": {
        "N1": {
          "coord": "L4.N1",
          "title": "A 'Gray Lady' no século XX",
          "tags": [
            "Jornal de referência",
            "Cheltenham",
            "Sobriedade"
          ],
          "content": "Durante grande parte do século XX, o The New York Times afirmou-se como jornal de referência com uma primeira página sóbria, densa e quase só de texto. Por isso ganhou o apelido The Gray Lady. Até ao fim dos anos 1970 resistiu à cor e às grandes fotografias, e deixou a hierarquia das notícias ao contraste entre as famílias Cheltenham, Bookman e Imperial."
        },
        "N2": {
          "coord": "L4.N2",
          "title": "Louis Silverstein e os cadernos temáticos",
          "tags": [
            "Louis Silverstein",
            "Tom Bodkin",
            "Matthew Carter"
          ],
          "content": "Nos anos 1970, o diretor de arte Louis Silverstein criou cadernos temáticos diários (Science Times, Living) e mostrou que uma grelha clássica de seis colunas aguentava direção de arte ousada e ilustração. Em 2003, com Tom Bodkin na direção, o tipógrafo Matthew Carter redesenhou a NYT Cheltenham, o que deu mais coesão tipográfica ao jornal impresso."
        },
        "N3": {
          "coord": "L4.N3",
          "title": "Ink: sistema e criatividade (2018–presente)",
          "tags": [
            "Sistema Ink",
            "À medida vs. padrão",
            "Escala global"
          ],
          "content": "Durante anos o NYT hesitou em impor um sistema de design único, com medo de que a padronização matasse a criatividade das grandes reportagens multimédia, como o Snow Fall de 2012. O Ink resolve esta tensão: controla a leitura diária, a navegação e a conta de utilizador, mas deixa espaço para peças de direção de arte feitas à medida."
        },
        "N4": {
          "coord": "L4.N4",
          "title": "O bundle e os 10 milhões de assinantes",
          "tags": [
            "NYT Bundle",
            "Games e Cooking",
            "Hábito diário"
          ],
          "content": "Com a crise da publicidade programática, o NYT passou a apostar nas subscrições e ultrapassou os 10 milhões de assinantes. O modelo assenta num pacote (bundle) que junta o jornalismo diário a produtos de hábito, como o NYT Games (Wordle, Crossword), o NYT Cooking, o The Athletic e o Wirecutter. O Ink garante que o leitor reconhece a marca do Times em todos eles."
        },
        "N5": {
          "coord": "L4.N5",
          "title": "Leitura noturna, modo escuro e ADA",
          "tags": [
            "Conformidade ADA",
            "Modo escuro",
            "Leitura noturna"
          ],
          "content": "A lei norte-americana de acessibilidade (Americans with Disabilities Act, ADA) aplica-se aos canais digitais, e cada vez mais pessoas leem de noite no telemóvel. Isto moldou o sistema. O Ink tem tokens de cor semânticos que suportam o modo escuro de forma nativa. Inverte a relação clássica de tinta preta em papel branco, sem perder legibilidade nem contraste."
        },
        "N6": {
          "coord": "L4.N6",
          "title": "Tokens sincronizados entre web, iOS e Android",
          "tags": [
            "Multiplataforma",
            "Swift / Kotlin / React",
            "Fonte única"
          ],
          "content": "Ao contrário de jornais focados só na web, o NYT depende muito das aplicações nativas iOS e Android. O grande desafio técnico do Ink foi ligar as bibliotecas do Figma a um pipeline de design tokens em JSON, que compila automaticamente cores, espaçamentos e escalas tipográficas para React (web), Swift (iOS) e Kotlin (Android)."
        },
        "N7": {
          "coord": "L4.N7",
          "title": "Cheltenham, Imperial, Franklin e Karnak",
          "tags": [
            "Quatro famílias",
            "Audio Player",
            "Hierarquia clássica"
          ],
          "content": "A identidade usa quatro famílias tipográficas: NYT Cheltenham (manchetes), NYT Imperial (texto corrido), NYT Franklin (interface, legendas e infografia) e NYT Karnak (títulos de impacto e sub-marcas). Nos componentes de artigo destacam-se os players de áudio para ouvir a notícia e os módulos de transição entre informação e estilo de vida.",
          "witnessComponent": {
            "type": "nyt-ink-card",
            "interactiveFeatures": [
              "Toggle Light / Dark Mode Token Inversion",
              "Inspect Typography Pairing (Cheltenham + Imperial + Franklin)"
            ],
            "wcagNotes": "Mapeamento semântico de tokens (color.content.primary / color.background.primary) preserva rácio > 10:1 tanto em Light como em Dark Mode."
          }
        }
      }
    },
    {
      "rowId": "L5",
      "order": 5,
      "entity": "News UK",
      "systemName": "NewsKit Design System",
      "country": "Reino Unido",
      "period": "1785 & 1964 (Print) / 2020–Presente (NewsKit)",
      "archetype": "Uma base para várias marcas",
      "nodes": {
        "N1": {
          "coord": "L5.N1",
          "title": "Broadsheet contra tabloide",
          "tags": [
            "The Times 1785",
            "The Sun 1964",
            "Stanley Morison"
          ],
          "content": "No papel, os títulos do grupo News UK ocupavam polos opostos da cultura britânica. De um lado, o The Times (1785), onde nasceu a Times New Roman, criada por Stanley Morison em 1931, e símbolo de sobriedade. Do outro, o The Sun (1964), tabloide popular de manchetes enormes em maiúsculas e fundos vermelhos vivos."
        },
        "N2": {
          "coord": "L5.N2",
          "title": "Silos e sistemas incompatíveis",
          "tags": [
            "Silos técnicos",
            "Estéticas opostas",
            "Antes da unificação"
          ],
          "content": "Durante a era analógica e as duas primeiras décadas da internet, a distância estética, editorial e de público entre estes jornais fazia com que cada um trabalhasse isolado. Não havia grelhas, regras de paginação ou ferramentas partilhadas entre a redação clássica do Sunday Times e a do The Sun."
        },
        "N3": {
          "coord": "L5.N3",
          "title": "NewsKit: uma base para várias marcas (2020–presente)",
          "tags": [
            "Multimarca",
            "White-label",
            "Documentação aberta"
          ],
          "content": "O NewsKit foi desenvolvido pela equipa central da News UK e é dos exemplos mais completos de design system multimarca para um grupo de media. A ideia foi criar uma só biblioteca de componentes funcionais e acessíveis (galerias, players de áudio e vídeo, cartões de artigos, formulários de subscrição), sem estilo próprio, pronta a ser 'vestida' por qualquer jornal ou rádio do grupo."
        },
        "N4": {
          "coord": "L5.N4",
          "title": "Menos custos com a consolidação do grupo",
          "tags": [
            "Economia de escala",
            "Menos silos",
            "Rádio e imprensa"
          ],
          "content": "Num grande grupo de media, manter cinco equipas de engenharia a programar cinco players de vídeo ou cinco fluxos de pagamento iguais deixou de compensar. O NewsKit segue uma lógica económica de grupo: cada componente é desenvolvido e testado uma só vez e distribuído por dez marcas."
        },
        "N5": {
          "coord": "L5.N5",
          "title": "Acessibilidade e conformidade legal centralizadas",
          "tags": [
            "EAA",
            "WCAG 2.2",
            "Gestão de risco"
          ],
          "content": "Com regras europeias e britânicas mais apertadas sobre privacidade e acessibilidade, atualizar dezenas de sites antigos ao mesmo tempo era um risco jurídico elevado. No NewsKit, a navegação por teclado, os atributos ARIA e os estados de foco visíveis estão no código do próprio componente. Corrigir um critério de acessibilidade no núcleo atualiza todas as publicações do grupo."
        },
        "N6": {
          "coord": "L5.N6",
          "title": "Design tokens em três camadas",
          "tags": [
            "Foundations",
            "Tokens semânticos",
            "Tokens de componente"
          ],
          "content": "O NewsKit é feito em React e sincronizado com o Figma. Separa a estrutura da aparência através de um sistema de temas. Os design tokens estão organizados em camadas (globais, semânticos e de componente). Assim, entre uma marca sóbria e uma de entretenimento, mudam a cor e a tipografia, mas também a densidade do espaço, os cantos arredondados (border-radius) e a espessura dos filetes."
        },
        "N7": {
          "coord": "L5.N7",
          "title": "O mesmo componente, duas identidades",
          "tags": [
            "Mesmo código",
            "Duas identidades",
            "Prova visual"
          ],
          "content": "O poder desta arquitetura vê-se ao colocar lado a lado o mesmo componente (um Audio Player ou um Breaking News Card). Com o tema do The Times, tem tipografia serifada Times Modern, cantos retos (0px) e tons neutros. Com o tema do The Sun ou da Virgin Radio, tem tipos sem serifa pesados, cantos arredondados e cores muito saturadas.",
          "witnessComponent": {
            "type": "newskit-chameleon-card",
            "interactiveFeatures": [
              "Theme Switcher: The Times (Serif, 0px radius, Sober) vs The Sun (Condensed Sans, 8px radius, #EB1701 Header)"
            ],
            "wcagNotes": "A árvore DOM e os atributos aria-label permanecem 100% idênticos em ambos os temas; apenas as variáveis CSS de superfície e tipografia mutam."
          }
        }
      }
    },
    {
      "rowId": "L6",
      "order": 6,
      "entity": "Público (caso português)",
      "systemName": "Sistemas editoriais em Portugal",
      "country": "Portugal",
      "period": "1990 / 2006 (Print) / 2014–Presente (Digital)",
      "archetype": "Redação de média dimensão",
      "nodes": {
        "N1": {
          "coord": "L6.N1",
          "title": "O nascimento do Público (1990)",
          "tags": [
            "Portugal",
            "1990",
            "Imprensa europeia"
          ],
          "content": "O Público foi fundado em 1990, com Vicente Jorge Silva na direção. Nasceu com uma forte cultura visual e fotográfica, em rutura com o grafismo pesado da imprensa portuguesa anterior. Inspirou-se em jornais europeus como o Libération e o El País e destacou-se desde o primeiro número pela paginação rigorosa, pela infografia e pela fotografia de autor."
        },
        "N2": {
          "coord": "L6.N2",
          "title": "Mark Porter (2006 / 2015) e a tipografia portuguesa",
          "tags": [
            "Mark Porter",
            "Mário Feliciano",
            "Christian Schwartz"
          ],
          "content": "Em 2006, o Público convidou o estúdio de Mark Porter, autor do redesenho do The Guardian no ano anterior, para renovar a edição impressa. Isto liga diretamente o caso português à escola modular britânica. O percurso reforçou também o prestígio da tipografia portuguesa, com a família Público (de Christian Schwartz, Paul Barnes e Mário Feliciano) e o uso da Flama, de Mário Feliciano."
        },
        "N3": {
          "coord": "L6.N3",
          "title": "O digital num mercado de média dimensão (2014–presente)",
          "tags": [
            "Sistemas internos",
            "Web e mobile",
            "Mercado lusófono"
          ],
          "content": "Como outros media portugueses (o Expresso ou o Observador), o Público criou bibliotecas de componentes e guias de estilo internos para gerir o digital, mas sem publicar documentação aberta como a BBC ou o Guardian. Mostra a realidade das redações de média dimensão: equipas pequenas que tentam juntar um bom legado gráfico à rapidez do ciclo de notícias online."
        },
        "N4": {
          "coord": "L6.N4",
          "title": "Publicidade num mercado pequeno",
          "tags": [
            "Modelo híbrido",
            "Paywall e publicidade",
            "CLS"
          ],
          "content": "Num mercado do tamanho de Portugal, as assinaturas digitais (paywall) crescem, mas continuam a conviver com muita dependência de publicidade programática e de formatos comerciais de grande impacto. Isto afeta o sistema de design: a grelha editorial é posta à prova por banners dinâmicos e vídeos que mudam o ritmo da página (Cumulative Layout Shift)."
        },
        "N5": {
          "coord": "L6.N5",
          "title": "DL n.º 82/2022 e o European Accessibility Act",
          "tags": [
            "DL 82/2022",
            "EAA",
            "Auditoria WCAG"
          ],
          "content": "Com o envelhecimento da população e a entrada em vigor do European Accessibility Act (transposto para Portugal pelo Decreto-Lei n.º 82/2022), os media digitais portugueses têm um desafio urgente de inclusão. A análise das interfaces jornalísticas portuguesas mostra muitas vezes pouco contraste nos metadados (datas e autores em cinzento-claro sobre branco), áreas de toque pequenas no telemóvel e falhas na navegação por teclado."
        },
        "N6": {
          "coord": "L6.N6",
          "title": "CMS, scripts externos e desempenho",
          "tags": [
            "CMS",
            "Dívida técnica",
            "Multicanal"
          ],
          "content": "Nas redações portuguesas, a sistematização visual choca muitas vezes com a rigidez dos sistemas de gestão de conteúdos (CMS) e com os scripts externos acumulados (comentários, redes sociais, métricas de audiência, consentimento). Isto dificulta manter uma fonte única de design tokens que garanta o mesmo comportamento tipográfico no navegador e nas aplicações móveis."
        },
        "N7": {
          "coord": "L6.N7",
          "title": "Tipografia Público, vermelho e a lacuna a investigar",
          "tags": [
            "Diagnóstico",
            "Tipografia Público",
            "Lacuna de investigação"
          ],
          "content": "A identidade digital mantém a tipografia serifada Público e o vermelho institucional como cor de destaque. Nesta investigação, a análise visual do Article Card e da página de artigo funciona como diagnóstico: mostra onde a herança tipográfica do papel precisa de uma nova arquitetura de design tokens acessíveis (WCAG 2.2 AA). É isto que justifica o projeto prático da dissertação.",
          "witnessComponent": {
            "type": "portuguese-media-audit-card",
            "interactiveFeatures": [
              "Toggle Audit Mode: Original (Contrast Warning on Meta #888888 = 3.5:1 Fail) vs Proposed DS Fix (Tokenized #525252 = 7.5:1 Pass AAA)"
            ],
            "wcagNotes": "Demonstração prática da resolução de falhas de contraste (Critério 1.4.3), estabilização de contentores (CLS) e foco de teclado visível (Critério 2.4.7)."
          }
        }
      }
    },
    {
      "rowId": "L7",
      "order": 7,
      "entity": "Observador (nativo digital)",
      "systemName": "Jornal digital com rádio",
      "country": "Portugal",
      "period": "2014–Presente (100% Digital)",
      "archetype": "Nascido no digital, com texto e rádio",
      "nodes": {
        "N1": {
          "coord": "L7.N1",
          "isBornDigitalPreHistory": true,
          "title": "Sem papel desde o início (2014)",
          "tags": [
            "Nativo digital",
            "Pós-troika",
            "Sem papel"
          ],
          "content": "O Observador foi fundado em maio de 2014, quando a imprensa portuguesa vivia uma forte crise económica e quedas históricas nas vendas em banca. Nasceu de uma decisão radical: dispensar o papel. Sem custos de impressão e distribuição, o investimento foi todo para uma redação pensada para o digital."
        },
        "N2": {
          "coord": "L7.N2",
          "isBornDigitalPreHistory": true,
          "title": "Autoridade clássica sem passado impresso",
          "tags": [
            "Remediação",
            "Autoridade editorial",
            "Tradição e ecrã"
          ],
          "content": "O Observador não tinha edição impressa antes, mas o primeiro projeto gráfico recusou a estética passageira dos portais noticiosos dos anos 2000. Com base no conceito de remediação (Bolter & Grusin), foi buscar os códigos de autoridade da imprensa clássica — manchetes serifadas de grande contraste, muito espaço em branco e filetes — e aplicou-os a uma grelha web."
        },
        "N3": {
          "coord": "L7.N3",
          "title": "Responsive e multicanal (2014–presente)",
          "tags": [
            "Mobile-first",
            "Responsive",
            "Sistema próprio"
          ],
          "content": "O Observador nasceu quatro anos depois de Ethan Marcotte formular o Responsive Web Design, e o seu sistema visual foi pensado desde o início para ecrãs fluidos e toque. Ao longo de uma década, a biblioteca de componentes passou de um jornal só de texto para um conjunto que inclui web, aplicações móveis, newsletters temáticas e emissão de rádio contínua."
        },
        "N4": {
          "coord": "L7.N4",
          "title": "Subscrição e Rádio Observador (2018–2019)",
          "tags": [
            "Paywall dinâmica",
            "Rádio Observador",
            "Subscrição e publicidade"
          ],
          "content": "O modelo de negócio mudou duas vezes e isso alterou a interface: em 2018 chegaram as assinaturas digitais e em 2019 a Rádio Observador. O design system teve de incluir componentes comerciais (módulos de subscrição e sinais de artigos exclusivos) e transformar o cabeçalho e o rodapé em centros de controlo de áudio em direto e podcasts."
        },
        "N5": {
          "coord": "L7.N5",
          "title": "Ler e ouvir: acessibilidade e DL n.º 82/2022",
          "tags": [
            "Leitura e escuta",
            "Sobrecarga cognitiva",
            "Auditoria WCAG"
          ],
          "content": "O público do Observador alterna entre ler depressa em mobilidade e ouvir áudio durante muito tempo. Em termos de usabilidade e de lei de acessibilidade (DL n.º 82/2022), isto traz desafios sérios: players de áudio fixos, notificações, banners de consentimento e publicidade ocupam espaço de leitura no telemóvel. É preciso controlar bem a ordem de foco por teclado (WCAG 2.4.3) e os rácios de contraste do azul institucional."
        },
        "N6": {
          "coord": "L7.N6",
          "title": "Formatos jornalísticos como componentes",
          "tags": [
            "Liveblogs",
            "Explicadores",
            "Player de áudio persistente"
          ],
          "content": "No CMS, o jornal criou templates e componentes editoriais muito sistematizados: os 'Explicadores' por pontos, os 'Fact-Checks' com selos de verificação e os 'Ao Minuto' (liveblogs). No front-end, o grande desafio é manter o player de áudio ativo ao navegar e sincronizar os componentes entre a web e as aplicações iOS e Android."
        },
        "N7": {
          "coord": "L7.N7",
          "title": "Azul, serifada e o Card Híbrido",
          "tags": [
            "Azul Observador",
            "Card multimédia",
            "Diagnóstico comparativo"
          ],
          "content": "Visualmente, o Observador distingue-se pelo azul-petróleo (fugindo ao vermelho que domina o mercado português) e por títulos serifados de inspiração transicional/moderna, combinados com tipografia sem serifa nos metadados. Na análise do componente-testemunha, estuda-se o Card Híbrido, que junta etiqueta de tópico, título, indicador de conteúdo Premium e botão de áudio. Mostra como o design system desta dissertação pode resolver a densidade de informação e cumprir a WCAG 2.2 AA.",
          "witnessComponent": {
            "type": "observador-born-digital-card",
            "interactiveFeatures": [
              "Toggle Content Type: Standard Article vs Audio/Podcast Card vs Premium Locked",
              "Inspect Mobile Viewport Density (Audio Player + Sticky Header vs Reading Area)"
            ],
            "wcagNotes": "Análise do rácio de contraste da cor de acento azul sobre fundos claros/cinzentos e validação de áreas de toque (44x44px) nos controlos de áudio integrados no cartão."
          }
        }
      }
    }
  ],
  "crossReferences": [
    {
      "from": "L0.N2",
      "to": "L1.N6",
      "relation": "A grelha modular de Müller-Brockmann e os programas de Gerstner evoluem para os layouts por contentores e para os design tokens."
    },
    {
      "from": "L1.N2",
      "to": "L6.N2",
      "relation": "Mark Porter lidera o redesenho do The Guardian (2005) e o do Público (2006), com Christian Schwartz na tipografia: a mesma metodologia editorial passa de um jornal para o outro."
    },
    {
      "from": "L2.N5",
      "to": "L6.N7",
      "relation": "As diretrizes de acessibilidade da BBC GEL, pioneiras, orientam os critérios WCAG usados no projeto prático em Portugal."
    },
    {
      "from": "L6.N7",
      "to": "L7.N7",
      "relation": "Dois casos portugueses frente a frente: a herança impressa do Público (vermelho) e o Observador, nativo digital e centrado no áudio (azul)."
    }
  ]
};
