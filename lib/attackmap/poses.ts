// Poses de câmera do mapa de ataque, ligadas ao scroll:
// 0 = abertura (sistema montado, entre as duas palavras do nome)
// 1 = introdução (camadas se separam, o mapa vai para a lateral)
// 2 = vitrine (vista de cima, luz baixa, atrás do primeiro projeto)
// 3 = segurança ofensiva (camadas separadas, ao lado do método)
// 4 = contato (sistema inteiro, calmo, de volta ao lado do texto)

export type Pose = {
  az: number; // azimute em radianos
  el: number; // elevação em graus
  dist: number; // distância da câmera
  cx: number; // deslocamento do centro na tela (unidades da altura)
  cy: number;
  explode: number; // separação entre as camadas (0 a 1)
  light: number; // intensidade geral (0 a 1)
};

const DESKTOP: Pose[] = [
  { az: 0.78, el: 36, dist: 39, cx: 0.27, cy: 0.14, explode: 0.0, light: 1 },
  { az: 0.55, el: 24, dist: 40, cx: 0.48, cy: 0.0, explode: 0.85, light: 0.95 },
  { az: 0.9, el: 62, dist: 36, cx: 0.0, cy: 0.36, explode: 0.4, light: 0.35 },
  { az: 0.6, el: 18, dist: 42, cx: 0.44, cy: 0.04, explode: 0.6, light: 0.9 },
  { az: 1.05, el: 34, dist: 40, cx: 0.5, cy: 0.02, explode: 0.15, light: 0.85 },
];

const MOBILE: Pose[] = [
  { az: 0.78, el: 38, dist: 55, cx: 0.0, cy: -0.02, explode: 0.0, light: 1 },
  { az: 0.55, el: 26, dist: 44, cx: 0.0, cy: 0.3, explode: 0.7, light: 0.32 },
  { az: 0.9, el: 62, dist: 44, cx: 0.0, cy: 0.44, explode: 0.4, light: 0.25 },
  { az: 0.6, el: 22, dist: 48, cx: 0.0, cy: 0.34, explode: 0.5, light: 0.26 },
  { az: 1.05, el: 34, dist: 42, cx: 0.0, cy: 0.27, explode: 0.15, light: 0.6 },
];

const smooth = (t: number) => t * t * (3 - 2 * t);

export function poseAt(progress: number, mobile: boolean): Pose {
  const frames = mobile ? MOBILE : DESKTOP;
  const p = Math.min(Math.max(progress, 0), frames.length - 1);
  const i = Math.min(Math.floor(p), frames.length - 2);
  const t = smooth(p - i);
  const a = frames[i];
  const b = frames[i + 1];
  const out = {} as Pose;
  (Object.keys(a) as (keyof Pose)[]).forEach((k) => {
    out[k] = a[k] + (b[k] - a[k]) * t;
  });
  return out;
}
