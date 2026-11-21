// Resolve depois do evento "load" e de um momento ocioso da thread principal.
// Usado para carregar a cena 3D e o GSAP sem disputar a primeira pintura do nome
// (em celulares lentos isso derrubava o LCP). Até lá, a imagem estática da cena fica visível.
/**
 * Em telas de toque, espera também a primeira interação (ou `touchTimeout` ms):
 * o pacote 3D é pesado para CPUs de celular e a imagem estática é a mesma cena.
 */
export function afterInteractionOnTouch(touchTimeout = 5000): Promise<void> {
  return afterLoad().then(
    () =>
      new Promise<void>((resolve) => {
        if (!window.matchMedia("(pointer: coarse)").matches) return resolve();
        const events = ["pointerdown", "touchstart", "scroll", "keydown", "wheel"] as const;
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          events.forEach((e) => window.removeEventListener(e, finish));
          clearTimeout(timer);
          resolve();
        };
        events.forEach((e) => window.addEventListener(e, finish, { once: true, passive: true }));
        const timer = window.setTimeout(finish, touchTimeout);
      }),
  );
}

export function afterLoad(idleTimeout = 2500): Promise<void> {
  return new Promise((resolve) => {
    const idle = () => {
      const w = window as Window & { requestIdleCallback?: Window["requestIdleCallback"] };
      if (typeof w.requestIdleCallback === "function") w.requestIdleCallback(() => resolve(), { timeout: idleTimeout });
      else setTimeout(resolve, 200);
    };
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  });
}
