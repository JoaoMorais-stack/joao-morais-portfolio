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
