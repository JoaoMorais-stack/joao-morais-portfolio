# Identidade visual

**Conceito (desde 2026-11-21): mapa de ataque.** A arquitetura de um sistema (interface, API, banco,
servidor e automações) desenhada como planta técnica em 3D. Ela se monta, uma varredura percorre as
camadas, um caminho de ataque aparece em vermelho (`GET /api/contas/1042 → 200`) e é corrigido em azul
(`→ 403`). Representa as duas frentes do João: construir e testar. O buraco negro anterior foi
descartado por não ter relação com a profissão.

**Público:** recrutadores e clientes avaliando competência técnica; precisa impressionar e continuar legível.

## Cor
| Token | Hex | Uso |
|---|---|---|
| space | #000000 | fundo, espaço |
| surface | #101114 | painéis da galeria |
| ivory | #ECE6DA | texto principal, botão primário, traço da planta |
| ivory-dim | #A29E95 | texto secundário (7,6:1 sobre o preto) |
| photon | #7D96FF | varredura, correção, foco do teclado, borda iluminada das telas, status |
| finding | #FF5A4F | só a falha encontrada no mapa de ataque |

O vermelho aparece só no achado; sem neon, sem gradiente de template. Azul e vermelho nunca são cor de bloco.

## Tipo
- **Archivo** com eixo de largura: nome e títulos em 125% de largura, peso 720–760, caixa alta só no nome.
- **Instrument Serif** itálico: especialidades, tipo de projeto, frase da introdução.
- Números tabulares no HUD.

## Assinatura
O mapa de ataque em linhas marfim finas, com varredura azul e um único achado vermelho que vira azul.
Todo o resto fica quieto: sem cards repetidos, sem ícones decorativos.

## Movimento
- Entrada: letras do nome sobem em cascata (55 ms); as camadas do sistema se montam de baixo para cima em 2,8 s; nada bloqueia a navegação.
- Ciclo de 13 s: varredura (3,4 s) → achado vermelho (3,2 s) → correção azul (2,6 s) → calmo. Com movimento reduzido: quadro fixo já corrigido.
- Scroll: as camadas se separam na introdução, a cena vira luz de fundo da vitrine e volta ao lado do contato; palavras do nome se afastam, frase acende palavra por palavra.
- Interação: cursor move a câmera ±3°/±7°; vitrine inclina ±6°; galeria expande em 0,7 s.
