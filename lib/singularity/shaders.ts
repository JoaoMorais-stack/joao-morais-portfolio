// Shaders da cena "Singularity".
// Implementação própria: cada pixel lança um raio que é integrado passo a passo
// em um campo gravitacional (aproximação de Schwarzschild, r_s = 1).
// O disco é composto por estratos finos (anéis de precisão) e o fundo é uma
// grade de coordenadas que se curva ao redor do horizonte, a assinatura visual.

export const VERTEX_SHADER = /* glsl */ `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const FRAGMENT_SHADER = /* glsl */ `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 uRes;
uniform float uTime;
uniform vec3 uCam;
uniform float uRoll;
uniform vec2 uCenter;
uniform float uZoom;
uniform float uExposure;
uniform float uGrid;
uniform float uSteps;
uniform float uReveal;

const float R_IN = 2.6;
const float R_OUT = 14.0;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float s = 0.0;
  float a = 0.55;
  for (int i = 0; i < 3; i++) {
    s += a * vnoise(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    a *= 0.5;
  }
  return s;
}

// Emissão e opacidade do disco no ponto em que o raio cruza o plano y = 0.
vec4 diskSample(vec3 hit, vec3 vel, float rr) {
  float ang = atan(hit.z, hit.x);
  // rotação diferencial (Kepler): o interior gira mais rápido que a borda
  float omega = 1.9 * pow(rr, -1.5);
  float rot = ang + uTime * omega;
  vec2 ring = vec2(cos(rot), sin(rot));

  // estratos: anéis concêntricos de larguras diferentes, como um instrumento usinado
  float strata = 0.78 + 0.22 * sin(rr * 6.1 + 1.7 * vnoise(vec2(rr * 0.9, 3.1)));
  float fine = 0.93 + 0.07 * sin(rr * 38.0);
  float gaps = smoothstep(0.02, 0.10, abs(fract(rr * 0.52) - 0.5));
  float turb = fbm(ring * (1.4 + rr * 0.42) + vec2(rr * 0.8, 0.0));
  float density = strata * fine * mix(0.72, 1.0, gaps) * (0.55 + 0.75 * turb);

  // perfil radial de um disco fino: brilho concentrado perto da órbita interna
  float prof = pow(R_IN / rr, 2.1)
             * smoothstep(R_IN, R_IN + 0.55, rr)
             * smoothstep(R_OUT, R_OUT - 5.5, rr);

  // feixe relativístico: o lado que se aproxima fica mais brilhante e frio
  vec3 tangent = normalize(vec3(-hit.z, 0.0, hit.x));
  float beta = sqrt(0.5 / rr);
  float cosT = dot(tangent, -normalize(vel));
  float gamma = inversesqrt(1.0 - beta * beta);
  float dop = 1.0 / (gamma * (1.0 - beta * cosT));
  float grav = sqrt(max(1.0 - 1.0 / rr, 0.0));
  float shift = dop * grav;
  float boost = pow(shift, 2.6);

  float x = clamp((rr - R_IN) / (R_OUT - R_IN), 0.0, 1.0);
  vec3 hot = vec3(0.80, 0.88, 1.00);
  vec3 ivory = vec3(1.00, 0.93, 0.83);
  vec3 ember = vec3(0.56, 0.54, 0.53);
  vec3 base = mix(hot, ivory, smoothstep(0.0, 0.35, x));
  base = mix(base, ember, smoothstep(0.35, 1.0, x));
  vec3 blue = vec3(0.55, 0.68, 1.0);
  vec3 warm = vec3(1.0, 0.84, 0.7);
  vec3 col = base * mix(warm, blue, smoothstep(0.75, 1.35, shift));

  float a = clamp(prof * density * 1.25, 0.0, 1.0);
  vec3 emission = col * prof * density * boost * 3.4;
  return vec4(emission, a);
}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

struct Trace {
  vec3 col;
  float alpha;
  float escaped;
  float minR;
  vec3 p;
  vec3 v;
};

// Integra um raio de luz pelo campo gravitacional, acumulando o disco que ele cruza.
Trace march(vec3 ro, vec3 rd) {
  Trace tr;
  tr.col = vec3(0.0);
  tr.alpha = 0.0;
  tr.escaped = 1.0;
  tr.minR = 1e4;
  vec3 p = ro;
  vec3 v = rd;
  vec3 hv = cross(p, v);
  float h2 = dot(hv, hv);
  int maxSteps = int(uSteps);
  for (int i = 0; i < 420; i++) {
    if (i >= maxSteps) break;
    float r = length(p);
    tr.minR = min(tr.minR, r);
    float dt = clamp(0.075 * r, 0.035, 1.25);
    float r2 = r * r;
    vec3 acc = -1.5 * h2 * p / (r2 * r2 * r);
    vec3 prev = p;
    v += acc * dt;
    p += v * dt;
    if (prev.y * p.y < 0.0) {
      float tc = prev.y / (prev.y - p.y);
      vec3 hit = mix(prev, p, tc);
      float rr = length(hit.xz);
      if (rr > R_IN && rr < R_OUT) {
        vec4 d = diskSample(hit, v, rr);
        tr.col += (1.0 - tr.alpha) * d.rgb;
        tr.alpha += (1.0 - tr.alpha) * d.a;
      }
    }
    if (r < 1.0) { tr.escaped = 0.0; break; }
    if (r > 48.0 && dot(p, v) > 0.0) break;
    if (tr.alpha > 0.985) break;
  }
  tr.p = p;
  tr.v = v;
  return tr;
}

vec3 stars(vec3 d) {
  vec2 sph = vec2(atan(d.z, d.x), asin(clamp(d.y, -1.0, 1.0)));
  vec2 g = sph * 95.0;
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  float hs = hash12(id);
  vec2 jitter = (vec2(hash12(id + 1.3), hash12(id + 7.1)) - 0.5) * 0.6;
  float star = step(0.986, hs) * smoothstep(0.11, 0.0, length(f + jitter));
  return star * mix(vec3(0.72, 0.80, 1.0), vec3(1.0, 0.92, 0.82), hash12(id + 3.0))
              * (0.35 + 1.6 * pow(hash12(id + 9.0), 6.0));
}

// Cor de um raio sem a grade: disco + estrelas + anel de fótons.
vec3 compose(Trace tr) {
  vec3 d = normalize(tr.v);
  float rx = max(tr.minR - 1.5, 0.0);
  float ring = exp(-rx * 9.0) * 0.75 + exp(-rx * 2.0) * 0.1;
  vec3 light = stars(d) + vec3(0.55, 0.66, 1.0) * ring;
  return tr.col + (1.0 - tr.alpha) * tr.escaped * light;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 screen = (frag - 0.5 * uRes) / uRes.y;
  float cr = cos(uRoll);
  float sr = sin(uRoll);
  mat2 rot = mat2(cr, -sr, sr, cr);
  vec2 uv = rot * (screen - uCenter);

  vec3 ro = uCam;
  vec3 F = normalize(-ro);
  vec3 R = normalize(cross(F, vec3(0.0, 1.0, 0.0)));
  vec3 U = cross(R, F);
  vec3 rd = normalize(F * uZoom + R * uv.x + U * uv.y);

  Trace tr = march(ro, rd);
  vec3 col = compose(tr);

  // grade de coordenadas atrás da singularidade, curvada pela lente gravitacional
  // (fluxo uniforme: as derivadas de tela são válidas aqui)
  vec3 d = normalize(tr.v);
  float dn = dot(d, F);
  float t = dot(F * 30.0 - tr.p, F) / max(dn, 0.02);
  vec3 q = tr.p + d * t;
  vec2 w = vec2(dot(q, R), dot(q, U));
  float cell = 2.2;
  vec2 gw = abs(fract(w / cell + 0.5) - 0.5) * cell;
  vec2 fw = fwidth(w);
  float fwm = max(fw.x, fw.y);
  vec2 lines = 1.0 - smoothstep(vec2(0.0), fw * 0.9 + 0.004, gw);
  float line = max(lines.x, lines.y) * smoothstep(0.5, 0.08, fwm);
  float fade = exp(-dot(w, w) * 0.0042) * step(0.02, dn);
  vec3 grid = vec3(0.78, 0.80, 0.86) * line * uGrid * fade * 0.075;

  // antisserrilhado só na borda da sombra: 4 raios por pixel numa faixa estreita,
  // localizada pelo parâmetro de impacto crítico b = 3√3/2 · r_s
  float b = length(cross(ro, rd));
  float bpix = length(ro) / (uRes.y * uZoom);
  if (abs(b - 2.598) < 3.0 * bpix) {
    float o = 0.35 / uRes.y;
    vec3 acc = col;
    acc += compose(march(ro, normalize(F * uZoom + R * (uv.x + o) + U * (uv.y + o))));
    acc += compose(march(ro, normalize(F * uZoom + R * (uv.x - o) + U * (uv.y + o))));
    acc += compose(march(ro, normalize(F * uZoom + R * (uv.x + o) + U * (uv.y - o))));
    col = acc * 0.25;
  }

  col += (1.0 - tr.alpha) * tr.escaped * grid;

  col *= uExposure * uReveal;
  col = aces(col);
  float vig = smoothstep(1.55, 0.35, length(screen * vec2(0.85, 1.0)));
  col *= mix(0.55, 1.0, vig);
  col = pow(col, vec3(1.0 / 2.2));
  col += (hash12(frag + fract(uTime * 7.0) * 61.0) - 0.5) / 255.0;
  outColor = vec4(col, 1.0);
}
`;
