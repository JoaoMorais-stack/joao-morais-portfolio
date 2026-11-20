// Canal mínimo entre o diretor de scroll (GSAP) e o palco WebGL.
type Listener = (v: number) => void;

let progress = 0;
const listeners = new Set<Listener>();

export const sceneBus = {
  get: () => progress,
  set(v: number) {
    if (v === progress) return;
    progress = v;
    listeners.forEach((l) => l(v));
  },
  subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};
