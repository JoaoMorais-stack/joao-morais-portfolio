# Decisões

1. **Next.js com export estático, sem servidor.** Custo zero e qualquer hospedagem estática. Rotas `/pt/` e `/en/` geradas no build; `/` redireciona pelo idioma do navegador.
2. **WebGL2 puro em vez de Three.js/R3F.** A cena é um shader de tela cheia; uma biblioteca 3D só adicionaria peso. O módulo é carregado sob demanda depois da primeira pintura.
3. **Qualidade adaptativa.** Resolução interna entre 0,42 e 1,0 do tamanho CSS (DPR limitado a 1,75 desktop / 1,5 mobile), ajustada a cada 40 quadros pelo tempo real de quadro. Passos: 260 desktop, 170 mobile.
4. **Antisserrilhado só na borda da sombra.** Pixels perto do parâmetro de impacto crítico (b ≈ 2,598 r_s) traçam 4 raios; o resto, 1.
5. **Pausa fora de vista.** IntersectionObserver nas seções `[data-scene]` + `visibilitychange`. Testado.
6. **Fallback = render real.** `scripts/capture-stills.mjs` captura a própria cena (`?capture`) e gera o WebP de fallback e a imagem OG.
7. **Scroll nativo.** Sem sequestro de rolagem; GSAP ScrollTrigger só lê o progresso. Movimento reduzido: sem parallax nem cena animada, texto visível desde o início.
8. **Tablet em retrato usa a câmera do celular** (`(max-width:1100px) and (orientation:portrait)`).
9. **Blend "difference" no nome foi testado e descartado**: deixava letras turvas nos meios-tons do disco. A legibilidade veio da composição (singularidade entre as palavras).
10. **Conteúdo só com fatos verificáveis** (READMEs + portfólio antigo). Projetos marcados como demonstração e dados fictícios.
11. **Tom dos textos (2026-11-20, pedido do João):** primeira pessoa, frases curtas, só fatos verificáveis. Sem slogans, tríades com ponto final, metatexto sobre o site ou frases de efeito.
12. **Buraco negro será substituído (2026-11-20):** o João achou bonito e imersivo, mas sem relação com pentest e programação. Fica como referência de nível visual; o próximo hero precisa representar o trabalho dele.
13. **Fluxo de publicação:** trabalho na branch `feat/*` gera link de prévia na Vercel; aprovado, vai para `main` (produção, deploy automático).
14. **Hero "mapa de ataque" (2026-11-21, escolhido pelo João):** arquitetura de sistema em planta técnica 3D com varredura, achado (IDOR ilustrativo: `GET /api/contas/1042 → 200`) e correção (`→ 403`). Three.js 0.187 (MIT), carregado sob demanda; ~120 FPS medidos na GPU integrada. Código do buraco negro removido (fica no histórico do Git).
15. **Carregamento adiado no celular (2026-11-21):** em `pointer: coarse`, Three.js e GSAP só carregam na primeira interação ou após 5 s. Motivo: o pacote 3D custava ~4 s de CPU simulada e derrubava o desempenho; a imagem estática é a mesma cena, então não há salto visual.
16. **Pausa por cobertura:** a cena pausa quando uma seção marcada `data-opaque` (galeria, "sobre") cobre a tela inteira, em vez de depender de seções `data-scene` visíveis.
