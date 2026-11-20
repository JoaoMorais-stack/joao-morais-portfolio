import type { SceneState } from "./renderer";

// Três poses de câmera ligadas ao scroll:
// 0 = abertura (quase de perfil, o disco cruza a tela na diagonal entre o nome)
// 1 = introdução (a câmera sobe e revela os estratos; a singularidade vai para a lateral)
// 2 = vitrine (vista de cima, luz baixa; vira a fonte de luz atrás do primeiro projeto)

const DESKTOP: SceneState[] = [
  { incl: 6.5, dist: 26, yaw: 0.0, roll: 0.2, cx: 0.0, cy: 0.07, zoom: 1.28, exposure: 1.0, grid: 1.0 },
  { incl: 30, dist: 33, yaw: 0.55, roll: 0.06, cx: 0.52, cy: 0.04, zoom: 1.45, exposure: 0.85, grid: 0.75 },
  { incl: 64, dist: 36, yaw: 0.9, roll: 0.0, cx: 0.0, cy: 0.4, zoom: 1.6, exposure: 0.36, grid: 0.2 },
  // 3 = contato: a singularidade volta de frente, como fechamento do percurso
  { incl: 74, dist: 31, yaw: 1.4, roll: 0.0, cx: 0.5, cy: 0.02, zoom: 1.5, exposure: 0.8, grid: 0.55 },
];

const MOBILE: SceneState[] = [
  { incl: 7.5, dist: 27, yaw: 0.0, roll: 0.42, cx: 0.0, cy: 0.1, zoom: 0.98, exposure: 1.0, grid: 1.0 },
  { incl: 34, dist: 38, yaw: 0.55, roll: 0.15, cx: 0.0, cy: 0.36, zoom: 1.1, exposure: 0.42, grid: 0.6 },
  { incl: 64, dist: 40, yaw: 0.9, roll: 0.0, cx: 0.0, cy: 0.46, zoom: 1.3, exposure: 0.2, grid: 0.15 },
  { incl: 74, dist: 34, yaw: 1.4, roll: 0.0, cx: 0.0, cy: 0.3, zoom: 1.1, exposure: 0.55, grid: 0.5 },
];

const smooth = (t: number) => t * t * (3 - 2 * t);

export function poseAt(progress: number, mobile: boolean): SceneState {
  const frames = mobile ? MOBILE : DESKTOP;
  const p = Math.min(Math.max(progress, 0), frames.length - 1);
  const i = Math.min(Math.floor(p), frames.length - 2);
  const t = smooth(p - i);
  const a = frames[i];
  const b = frames[i + 1];
  const out = {} as SceneState;
  (Object.keys(a) as (keyof SceneState)[]).forEach((k) => {
    out[k] = a[k] + (b[k] - a[k]) * t;
  });
  return out;
}
