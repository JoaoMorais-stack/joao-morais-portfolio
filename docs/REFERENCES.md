# Referências investigadas (2026-11-20)

Cada referência foi aberta ao vivo pelo bundle público de pré-visualização do 21st.dev
(ou pelo site de demonstração do template), com movimento de mouse, clique e scroll,
em 1440×900 e 390×844. Capturas locais em `_research/` (fora do Git, por serem de terceiros).
Nenhum código de terceiros foi copiado: o plano gratuito do 21st permite 2 recuperações de
código por dia e a cena foi escrita do zero.

## Componentes pedidos

| # | Referência | O que observei | Decisão |
|---|---|---|---|
| 08 | Blackhole Hero (yura) | WebGL2 puro (sem Three.js), 1 shader de tela cheia, raymarch com até 460 passos, DPR limitado a 1,75, pausa por IntersectionObserver, respeita movimento reduzido. ~280 KB no total. Paleta laranja "Interstellar", texto à esquerda. | **Base técnica aproveitada** (mesma família de técnica: raio por pixel em campo gravitacional). **Visual transformado**: disco marfim/prata em estratos, anel de fótons azul, grade de coordenadas curvada pela lente, nome dividido em diagonal em torno da singularidade, poses de câmera ligadas ao scroll. Shader próprio. |
| 04 | Syntra Hero (clevision) | Núcleo isométrico em camadas que se separa no hover, com rótulos conectados. Visual claro, laranja. | **Princípio aproveitado**: camadas que se revelam com a interação → virou a câmera que sobe e revela os estratos do disco na introdução. Composição isométrica e paleta descartadas (destoariam da cena). Candidato para a seção "Competências" (fase 5). |
| 06 | Carousel Squeeze (yura) | Painéis que expandem/comprimem, clique, hover, setas, autoplay. | **Aproveitado** na galeria "Mais projetos": implementação própria com hover (só ponteiro fino), foco, clique e setas/Home/End; no celular vira acordeão vertical. Sem autoplay (o visitante controla). |
| 01 | Endless (helloweblisy) | Corredor 3D de imagens em perspectiva voando para a câmera. | **Princípio aproveitado** na vitrine do Ebinex: tela em perspectiva 3D que se endireita com o scroll. O corredor infinito foi descartado neste protótipo (pode virar a transição entre cases na fase 5). |
| 02 | Glassy Dashboard (automateflows) | Painéis translúcidos em camadas sobre fundo fotográfico. | **Parcial**: só o vidro discreto nos botões secundários e no menu mobile. Painéis de vidro em tudo seriam "glassmorphism sem motivo". |
| 03 | Peak Chart (louisstudios) | Gráficos com brilho e números grandes. | **Descartado agora**: não há métrica real que justifique gráfico. O único "dado" exibido é o HUD com parâmetros reais da cena (inclinação e distância da câmera). |
| 05 | Rainbow Button (dillionverma) | Botão com borda multicolor animada. | **Adaptado com contenção**: o botão principal recebe um feixe de luz marfim/azul no hover (a luz que contorna o horizonte), sem arco-íris. |
| 07 | Ink Orbit Features (kedhareswer) | Diagramas vivos de fluxo com nós conectados. | **Adiado para a fase 5** (seção de automação/competências), onde um fluxo real de um projeto pode ser diagramado. |
| 09 | Liquid Glass Checkout (gughigug) | Cartão com material líquido e física. | **Descartado neste protótipo**: não há elemento que precise de material líquido sem virar enfeite. Princípio de "material com física" guardado para o contato/CTA. |

## Templates enviados durante a execução

| Template | O que observei | Decisão |
|---|---|---|
| Kora 3D Creative Agency | Objetos iridescentes de vidro com tipografia gigante cinética por trás. | Confirma o caminho de tipografia integrada à cena 3D. Iridescência descartada (fugiria da paleta). |
| Emma Parker Photographer | Contenção editorial, HUD de câmera (ISO, f/, obturador) que reage ao cursor. | **Aproveitado**: o HUD "Inclinação / Distância" lê os valores reais da câmera WebGL. |
| Relay SaaS | Pilha de painéis de vidro em diagonal com luz violeta. | Referência de profundidade; visual violeta descartado. |
| Strata (glamorydev) | Monocromático, folhas translúcidas em onda; cards de trabalho inclinados em 3D. | **Aproveitado**: contenção monocromática e cards inclinados (vitrine em perspectiva). |
| Qronos AI Agent Scheduler | Funil de linhas em wireframe, monocromático. | Confirma a grade curvada; a minha é calculada pela própria lente gravitacional, não desenhada. |
