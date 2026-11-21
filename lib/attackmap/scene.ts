import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  CylinderGeometry,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineDashedMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Quaternion,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from "three";
import type { Pose } from "./poses";

// "Mapa de ataque": a arquitetura de um sistema desenhada como planta técnica.
// Ela se monta (desenvolvimento), uma varredura percorre as camadas, um caminho
// de ataque aparece em vermelho e é corrigido em azul (pentest). Ilustrativo.

export type Phase = "build" | "scan" | "finding" | "fix" | "calm";

export type SceneLabels = {
  layers: { ui: string; api: string; db: string; infra: string; auto: string };
  request: string;
};

export type AttackMapOptions = {
  mobile: boolean;
  reducedMotion: boolean;
  fixedQuality?: boolean;
  labels: SceneLabels;
  labelRoot: HTMLElement;
  onFirstFrame?: () => void;
  onPhase?: (phase: Phase, detail: { layer?: number }) => void;
};

export type AttackMap = {
  setPose: (p: Pose) => void;
  setPointer: (x: number, y: number) => void;
  setActive: (active: boolean) => void;
  destroy: () => void;
};

const IVORY = new Color(0xece6da);
const RED = new Color(0xff5a4f);
const BLUE = new Color(0x7d96ff);

const W = 7.2; // largura das camadas
const D = 5.0; // profundidade
const LAYER_Y = [2.7, 0.9, -0.9, -2.7]; // interface, API, banco, servidor
const BUILD = 2.8;
const CYCLE = 13;

type Part = { group: Group; edges: LineBasicMaterial[]; fills: MeshBasicMaterial[] };
type Layer = Part & { baseY: number; index: number };
type Anchor = { layer: number; local: Vector3; part?: Part };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

function part(): Part {
  return { group: new Group(), edges: [], fills: [] };
}

// Caixa como desenho técnico: contorno + preenchimento quase transparente.
function addBox(p: Part, w: number, h: number, d: number, pos: Vector3, edge = 0.6, fill = 0.035) {
  const geo = new BoxGeometry(w, h, d);
  const fm = new MeshBasicMaterial({ color: IVORY, transparent: true, opacity: fill, depthWrite: false });
  const em = new LineBasicMaterial({ color: IVORY, transparent: true, opacity: edge });
  const mesh = new Mesh(geo, fm);
  const lines = new LineSegments(new EdgesGeometry(geo), em);
  mesh.position.copy(pos);
  lines.position.copy(pos);
  fm.userData.base = fill;
  em.userData.base = edge;
  p.group.add(mesh, lines);
  p.edges.push(em);
  p.fills.push(fm);
  return { mesh, lines };
}

function addCylinder(p: Part, r: number, h: number, pos: Vector3) {
  const geo = new CylinderGeometry(r, r, h, 28, 1, true);
  const em = new LineBasicMaterial({ color: IVORY, transparent: true, opacity: 0.55 });
  em.userData.base = 0.55;
  // só os aros e quatro geratrizes: leitura de "tabela de banco" sem poluir
  const pts: number[] = [];
  const seg = 40;
  for (const y of [-h / 2, h / 2, 0]) {
    for (let i = 0; i < seg; i++) {
      const a0 = (i / seg) * Math.PI * 2;
      const a1 = ((i + 1) / seg) * Math.PI * 2;
      pts.push(Math.cos(a0) * r, y, Math.sin(a0) * r, Math.cos(a1) * r, y, Math.sin(a1) * r);
    }
  }
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
    pts.push(Math.cos(a) * r, -h / 2, Math.sin(a) * r, Math.cos(a) * r, h / 2, Math.sin(a) * r);
  }
  const lg = new BufferGeometry();
  lg.setAttribute("position", new Float32BufferAttribute(pts, 3));
  const lines = new LineSegments(lg, em);
  lines.position.copy(pos);
  const fm = new MeshBasicMaterial({ color: IVORY, transparent: true, opacity: 0.03, depthWrite: false });
  fm.userData.base = 0.03;
  const mesh = new Mesh(geo, fm);
  mesh.position.copy(pos);
  p.group.add(mesh, lines);
  p.edges.push(em);
  p.fills.push(fm);
}

// Linhas internas (texto de interface, slots de servidor, grade).
function addLines(p: Part, pts: number[], opacity: number) {
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pts, 3));
  const m = new LineBasicMaterial({ color: IVORY, transparent: true, opacity });
  m.userData.base = opacity;
  p.group.add(new LineSegments(g, m));
  p.edges.push(m);
}

function slabGrid(w: number, d: number, y: number, step: number) {
  const pts: number[] = [];
  for (let x = -w / 2 + step; x < w / 2 - 0.01; x += step) pts.push(x, y, -d / 2, x, y, d / 2);
  for (let z = -d / 2 + step; z < d / 2 - 0.01; z += step) pts.push(-w / 2, y, z, w / 2, y, z);
  return pts;
}

// Tela de interface vista de cima: moldura + barras de conteúdo.
function uiPanel(p: Part, w: number, d: number, pos: Vector3) {
  addBox(p, w, 0.06, d, pos, 0.75, 0.05);
  const y = pos.y + 0.035;
  const x0 = pos.x - w / 2 + 0.18;
  const z0 = pos.z - d / 2;
  const pts: number[] = [];
  pts.push(pos.x - w / 2, y, z0 + 0.32, pos.x + w / 2, y, z0 + 0.32); // barra de título
  const rows = Math.max(3, Math.floor(d / 0.36) - 1);
  for (let i = 0; i < rows; i++) {
    const z = z0 + 0.62 + i * 0.32;
    if (z > pos.z + d / 2 - 0.15) break;
    const len = (w - 0.36) * (i % 3 === 0 ? 0.55 : i % 3 === 1 ? 0.85 : 0.7);
    pts.push(x0, y, z, x0 + len, y, z);
  }
  addLines(p, pts, 0.32);
}

function rack(p: Part, pos: Vector3) {
  addBox(p, 1.4, 0.95, 1.0, pos, 0.6, 0.04);
  const pts: number[] = [];
  for (let i = 0; i < 4; i++) {
    const y = pos.y - 0.32 + i * 0.2;
    pts.push(pos.x - 0.6, y, pos.z + 0.505, pos.x + 0.6, y, pos.z + 0.505);
  }
  addLines(p, pts, 0.3);
}

// Pontos redondos (pacotes de dados) com tamanho em perspectiva.
function packetMaterial() {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uScale: { value: 1 }, uOpacity: { value: 1 } },
    vertexShader: /* glsl */ `
      attribute float aSize;
      attribute vec3 aColor;
      varying vec3 vColor;
      uniform float uScale;
      void main() {
        vColor = aColor;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * uScale / -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      uniform float uOpacity;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vColor * a * uOpacity, a * uOpacity);
      }`,
  });
}

export function createAttackMap(canvas: HTMLCanvasElement, initial: Pose, opts: AttackMapOptions): AttackMap | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  if (!renderer.getContext()) return null;
  renderer.setClearColor(0x000000, 1);

  const scene = new Scene();
  const camera = new PerspectiveCamera(24, 1, 0.1, 200);
  const root = new Group();
  scene.add(root);

  // ---------- camadas ----------
  const layers: Layer[] = LAYER_Y.map((y, index) => {
    const p = part();
    addBox(p, W, 0.1, D, new Vector3(0, 0, 0), 0.5, 0.012);
    addLines(p, slabGrid(W, D, 0.051, 0.9), 0.045);
    const layer: Layer = { ...p, baseY: y, index };
    root.add(p.group);
    return layer;
  });
  const top = 0.06;

  // interface: navegador, celular e painel administrativo
  const browser = part();
  uiPanel(browser, 3.4, 2.5, new Vector3(-1.4, top + 0.04, -0.6));
  const phone = part();
  uiPanel(phone, 1.05, 1.95, new Vector3(1.85, top + 0.04, 0.1));
  const admin = part();
  uiPanel(admin, 1.9, 1.2, new Vector3(-1.6, top + 0.04, 1.75));
  layers[0].group.add(browser.group, phone.group, admin.group);

  // API: quatro rotas
  const routes = ["/auth", "/contas", "/relatorios", "/escalas"].map((_, i) => {
    const r = part();
    addBox(r, 1.25, 0.5, 0.9, new Vector3(-2.55 + i * 1.7, top + 0.25, 0), 0.65, 0.05);
    layers[1].group.add(r.group);
    return r;
  });
  const gateway = part();
  addBox(gateway, W - 1.0, 0.08, 0.5, new Vector3(0, top + 0.04, -1.6), 0.35, 0.03);
  layers[1].group.add(gateway.group);

  // banco: três tabelas
  const tables = [-2.2, 0, 2.2].map((x) => {
    const t = part();
    addCylinder(t, 0.55, 0.62, new Vector3(x, top + 0.31, 0.2));
    layers[2].group.add(t.group);
    return t;
  });

  // servidor: três racks
  const racks = [-2.3, 0, 2.3].map((x) => {
    const r = part();
    rack(r, new Vector3(x, top + 0.48, 0));
    layers[3].group.add(r.group);
    return r;
  });

  // módulo lateral de automações
  const auto: Part = part();
  addBox(auto, 2.6, 0.1, 3.0, new Vector3(0, 0, 0), 0.5, 0.012);
  addLines(auto, slabGrid(2.6, 3.0, 0.051, 0.9), 0.045);
  const jobs = [-0.75, 0.75].map((z) => {
    const j = part();
    addBox(j, 1.6, 0.42, 0.9, new Vector3(0, top + 0.21, z), 0.65, 0.05);
    auto.group.add(j.group);
    return j;
  });
  root.add(auto.group);

  // ---------- conexões e pacotes ----------
  const anchorPos = (a: Anchor, out: Vector3) => {
    const g = a.layer === 4 ? auto.group : layers[a.layer].group;
    return out.copy(a.local).applyMatrix4(g.matrixWorld);
  };
  const A = (layer: number, x: number, y: number, z: number): Anchor => ({ layer, local: new Vector3(x, y, z) });
  const ROUTE_X = (i: number) => -2.55 + i * 1.7;
  const links: { a: Anchor; b: Anchor; dashed?: boolean }[] = [
    { a: A(0, -1.6, 0, -0.4), b: A(1, ROUTE_X(0), 0.5, 0) },
    { a: A(0, -0.9, 0, -0.2), b: A(1, ROUTE_X(1), 0.5, 0) },
    { a: A(0, 1.85, 0, 0.1), b: A(1, ROUTE_X(1), 0.5, 0) },
    { a: A(0, 1.85, 0, 0.4), b: A(1, ROUTE_X(3), 0.5, 0) },
    { a: A(0, -1.6, 0, 1.75), b: A(1, ROUTE_X(2), 0.5, 0) },
    { a: A(1, ROUTE_X(0), -0.05, 0), b: A(2, -2.2, 0.62, 0.2) },
    { a: A(1, ROUTE_X(1), -0.05, 0), b: A(2, 0, 0.62, 0.2) },
    { a: A(1, ROUTE_X(2), -0.05, 0), b: A(2, 0, 0.62, 0.2) },
    { a: A(1, ROUTE_X(3), -0.05, 0), b: A(2, 2.2, 0.62, 0.2) },
    { a: A(2, -2.2, -0.05, 0.2), b: A(3, -2.3, 0.96, 0) },
    { a: A(2, 0, -0.05, 0.2), b: A(3, 0, 0.96, 0) },
    { a: A(2, 2.2, -0.05, 0.2), b: A(3, 2.3, 0.96, 0) },
    { a: A(4, 0, 0.42, -0.75), b: A(1, ROUTE_X(2), 0.25, 0.45), dashed: true },
    { a: A(4, 0, 0.42, 0.75), b: A(2, 2.2, 0.35, 0.6), dashed: true },
  ];

  const linkGeo = new BufferGeometry();
  const linkPos = new Float32Array(links.filter((l) => !l.dashed).length * 6);
  linkGeo.setAttribute("position", new BufferAttribute(linkPos, 3));
  const linkMat = new LineBasicMaterial({ color: IVORY, transparent: true, opacity: 0.22 });
  const linkLines = new LineSegments(linkGeo, linkMat);
  const dashGeo = new BufferGeometry();
  const dashPos = new Float32Array(links.filter((l) => l.dashed).length * 6);
  dashGeo.setAttribute("position", new BufferAttribute(dashPos, 3));
  const dashMat = new LineDashedMaterial({ color: IVORY, transparent: true, opacity: 0.35, dashSize: 0.14, gapSize: 0.1 });
  const dashLines = new LineSegments(dashGeo, dashMat);
  scene.add(linkLines, dashLines);

  const PER_LINK = 2;
  const packetCount = links.length * PER_LINK;
  const pGeo = new BufferGeometry();
  const pPos = new Float32Array(packetCount * 3);
  const pSize = new Float32Array(packetCount).fill(opts.mobile ? 9 : 7);
  const pCol = new Float32Array(packetCount * 3);
  for (let i = 0; i < packetCount; i++) IVORY.toArray(pCol, i * 3);
  pGeo.setAttribute("position", new BufferAttribute(pPos, 3));
  pGeo.setAttribute("aSize", new BufferAttribute(pSize, 1));
  pGeo.setAttribute("aColor", new BufferAttribute(pCol, 3));
  const pMat = packetMaterial();
  const packets = new Points(pGeo, pMat);
  packets.frustumCulled = false;
  scene.add(packets);

  // ---------- varredura ----------
  const scanGroup = new Group();
  const scanFill = new Mesh(
    new PlaneGeometry(W + 0.8, D + 0.8),
    new MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0.05, depthWrite: false, side: 2 }),
  );
  scanFill.rotation.x = -Math.PI / 2;
  const scanEdgeMat = new LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.8 });
  const scanEdge = new LineSegments(new EdgesGeometry(new BoxGeometry(W + 0.8, 0.001, D + 0.8)), scanEdgeMat);
  scanGroup.add(scanFill, scanEdge);
  scene.add(scanGroup);

  // ---------- caminho de ataque (navegador → /contas → tabela contas) ----------
  const pathAnchors = [A(0, -0.9, 0.06, -0.2), A(1, ROUTE_X(1), 0.5, 0), A(1, ROUTE_X(1), 0, 0), A(2, 0, 0.62, 0.2)];
  const unitCyl = new CylinderGeometry(1, 1, 1, 10, 1, true);
  unitCyl.translate(0, 0.5, 0);
  const pathCore = new MeshBasicMaterial({ color: RED.clone(), transparent: true, opacity: 0, depthWrite: false });
  const pathGlow = new MeshBasicMaterial({
    color: RED.clone(),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const segs = [0, 1, 2].map(() => {
    const core = new Mesh(unitCyl, pathCore);
    const glow = new Mesh(unitCyl, pathGlow);
    scene.add(core, glow);
    return { core, glow };
  });

  // ---------- rótulos HTML projetados ----------
  const L = opts.labels;
  const mk = (text: string, cls: string) => {
    const el = document.createElement("span");
    el.className = `map-label ${cls}`;
    el.textContent = text;
    opts.labelRoot.appendChild(el);
    return el;
  };
  const layerLabels = [
    { el: mk(L.layers.ui, ""), a: A(0, -W / 2, 0.08, D / 2) },
    { el: mk(L.layers.api, ""), a: A(1, -W / 2, 0.08, D / 2) },
    { el: mk(L.layers.db, ""), a: A(2, -W / 2, 0.08, D / 2) },
    { el: mk(L.layers.infra, ""), a: A(3, -W / 2, 0.08, D / 2) },
    { el: mk(L.layers.auto, "map-label-right"), a: A(4, 1.3, 0.08, -1.5) },
  ];
  const reqEl = document.createElement("span");
  reqEl.className = "map-label map-request";
  reqEl.innerHTML = `<span class="map-req-text"></span> <b class="map-req-status"></b>`;
  (reqEl.querySelector(".map-req-text") as HTMLElement).textContent = L.request;
  const reqStatus = reqEl.querySelector(".map-req-status") as HTMLElement;
  opts.labelRoot.appendChild(reqEl);
  const reqAnchor = A(1, ROUTE_X(1), 0.62, 0);

  // ---------- estado ----------
  const target: Pose = { ...initial };
  const cur: Pose = { ...initial };
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  let width = 0;
  let height = 0;
  let maxPixelRatio = Math.min(window.devicePixelRatio || 1, opts.mobile ? 2 : 1.75);
  let raf = 0;
  let active = true;
  let destroyed = false;
  let first = true;
  let lastPhase: Phase | null = null;
  let lastLayer = -1;
  const t0 = performance.now();
  let last = t0;
  let frameAcc = 0;
  let frameCount = 0;
  const tmpA = new Vector3();
  const tmpB = new Vector3();
  const tmpV = new Vector3();
  const up = new Vector3(0, 1, 0);
  const q = new Quaternion();
  const col = new Color();

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    width = w;
    height = h;
    renderer.setPixelRatio(maxPixelRatio);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    pMat.uniforms.uScale.value = h * maxPixelRatio * 0.022;
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const project = (v: Vector3) => {
    tmpV.copy(v).project(camera);
    return { x: (tmpV.x * 0.5 + 0.5) * width, y: (-tmpV.y * 0.5 + 0.5) * height, behind: tmpV.z > 1 };
  };

  const phaseAt = (t: number): { phase: Phase; p: number } => {
    if (opts.reducedMotion) return { phase: "fix", p: 0.35 };
    if (t < BUILD) return { phase: "build", p: t / BUILD };
    const c = (t - BUILD) % CYCLE;
    if (c < 3.4) return { phase: "scan", p: c / 3.4 };
    if (c < 6.6) return { phase: "finding", p: (c - 3.4) / 3.2 };
    if (c < 9.2) return { phase: "fix", p: (c - 6.6) / 2.6 };
    return { phase: "calm", p: (c - 9.2) / (CYCLE - 9.2) };
  };

  // aplicado depois do passe das camadas: só desloca a cor e reforça o traço
  const setPartTint = (p: Part, c: Color, k: number) => {
    if (k <= 0) return;
    for (const m of p.edges) {
      m.color.lerp(c, k);
      m.opacity = Math.min(1, m.opacity * (1 + k * 0.9));
    }
  };

  const draw = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const time = (now - t0) / 1000;

    const k = opts.reducedMotion ? 1 : 1 - Math.exp(-dt * 5);
    (Object.keys(target) as (keyof Pose)[]).forEach((key) => {
      cur[key] += (target[key] - cur[key]) * k;
    });
    const pk = 1 - Math.exp(-dt * 3);
    pointer.sx += (pointer.x - pointer.sx) * pk;
    pointer.sy += (pointer.y - pointer.sy) * pk;

    // câmera
    const az = cur.az + pointer.sx * 0.1 + (opts.reducedMotion ? 0 : Math.sin(time * 0.12) * 0.04);
    const el = ((cur.el - pointer.sy * 3) * Math.PI) / 180;
    camera.position.set(
      cur.dist * Math.cos(el) * Math.sin(az),
      cur.dist * Math.sin(el),
      cur.dist * Math.cos(el) * Math.cos(az),
    );
    camera.lookAt(0, 0, 0);
    camera.setViewOffset(width, height, -cur.cx * height, cur.cy * height, width, height);
    camera.updateProjectionMatrix();

    const { phase, p } = phaseAt(time);
    const light = cur.light;

    // montagem e separação das camadas
    layers.forEach((layer) => {
      const delay = (3 - layer.index) * 0.18;
      const built = phase === "build" ? ease((p * BUILD - delay) / 1.1) : 1;
      layer.group.position.y = layer.baseY * (1 + cur.explode * 0.75) + (1 - built) * 1.4;
      layer.group.userData.built = built;
    });
    const autoBuilt = phase === "build" ? ease((p * BUILD - 0.9) / 1.1) : 1;
    auto.group.position.set(5.9 + cur.explode * 1.6, (1 - autoBuilt) * 1.4, 0.2);
    root.updateMatrixWorld(true);

    // varredura de cima para baixo
    const yTop = layers[0].group.position.y + 0.9;
    const yBot = layers[3].group.position.y - 0.4;
    const scanY = phase === "scan" ? yTop + (yBot - yTop) * ease(p) : -999;
    scanGroup.visible = phase === "scan";
    scanGroup.position.y = scanY;
    scanEdgeMat.opacity = 0.75 * light * Math.sin(Math.PI * clamp01(p * 1.1));
    (scanFill.material as MeshBasicMaterial).opacity = 0.06 * light;

    let scanLayer = -1;
    layers.forEach((layer) => {
      const built = layer.group.userData.built as number;
      const dist = Math.abs(layer.group.position.y + 0.3 - scanY);
      const glow = phase === "scan" ? Math.exp(-(dist * dist) / 0.35) : 0;
      if (glow > 0.5) scanLayer = layer.index;
      const fade = built * light;
      layer.group.traverse((o) => {
        const m = (o as Mesh).material as MeshBasicMaterial | LineBasicMaterial | undefined;
        if (!m || !("userData" in m) || m.userData.base === undefined) return;
        const base = m.userData.base as number;
        m.opacity = base * fade * (1 + glow * 1.2);
        if (m instanceof LineBasicMaterial && !(m instanceof LineDashedMaterial)) {
          m.color.copy(IVORY).lerp(BLUE, glow * 0.6);
        }
      });
    });
    auto.group.traverse((o) => {
      const m = (o as Mesh).material as MeshBasicMaterial | LineBasicMaterial | undefined;
      if (!m || m.userData?.base === undefined) return;
      m.opacity = (m.userData.base as number) * autoBuilt * light;
    });

    // achado e correção
    let pathColor = RED;
    let pathAlpha = 0;
    let drawn = 0;
    if (phase === "finding") {
      drawn = ease(p / 0.45);
      pathAlpha = 1;
      pathColor = RED;
    } else if (phase === "fix") {
      drawn = 1;
      const toBlue = ease(p / 0.35);
      col.copy(RED).lerp(BLUE, toBlue);
      pathColor = col;
      pathAlpha = opts.reducedMotion ? 1 : 1 - ease((p - 0.6) / 0.4);
    }
    pathCore.color.copy(pathColor);
    pathGlow.color.copy(pathColor);
    pathCore.opacity = pathAlpha * light;
    pathGlow.opacity = pathAlpha * 0.22 * light;
    const pts = pathAnchors.map((a, i) => anchorPos(a, i === 0 ? tmpA.clone() : new Vector3()));
    let remain = drawn * 3;
    segs.forEach((s, i) => {
      const from = pts[i];
      const to = pts[i + 1];
      const dir = tmpB.copy(to).sub(from);
      const len = dir.length();
      const frac = clamp01(remain);
      remain -= 1;
      const visible = frac > 0 && pathAlpha > 0;
      s.core.visible = visible;
      s.glow.visible = visible;
      if (!visible) return;
      q.setFromUnitVectors(up, dir.normalize());
      s.core.position.copy(from);
      s.glow.position.copy(from);
      s.core.quaternion.copy(q);
      s.glow.quaternion.copy(q);
      s.core.scale.set(0.035, len * frac, 0.035);
      s.glow.scale.set(0.14, len * frac, 0.14);
    });
    const findK = phase === "finding" ? ease(p / 0.3) : phase === "fix" ? 1 - ease((p - 0.6) / 0.4) : 0;
    const tint = phase === "fix" ? col : RED;
    setPartTint(routes[1], tint, findK);
    setPartTint(tables[1], tint, findK);
    setPartTint(browser, tint, findK * 0.6);

    // pacotes de dados
    const pos = pGeo.getAttribute("position") as BufferAttribute;
    const colors = pGeo.getAttribute("aColor") as BufferAttribute;
    let li = 0;
    let di = 0;
    links.forEach((l, idx) => {
      anchorPos(l.a, tmpA);
      anchorPos(l.b, tmpB);
      const arr = l.dashed ? dashPos : linkPos;
      const off = (l.dashed ? di++ : li++) * 6;
      arr[off] = tmpA.x;
      arr[off + 1] = tmpA.y;
      arr[off + 2] = tmpA.z;
      arr[off + 3] = tmpB.x;
      arr[off + 4] = tmpB.y;
      arr[off + 5] = tmpB.z;
      for (let j = 0; j < PER_LINK; j++) {
        const s = opts.reducedMotion ? (j + 0.5) / PER_LINK : (time * 0.32 + j / PER_LINK + idx * 0.137) % 1;
        tmpV.copy(tmpA).lerp(tmpB, s);
        const i3 = (idx * PER_LINK + j) * 3;
        pos.array[i3] = tmpV.x;
        pos.array[i3 + 1] = tmpV.y;
        pos.array[i3 + 2] = tmpV.z;
        const onPath = (idx === 1 || idx === 6) && (phase === "finding" || phase === "fix");
        (onPath ? (phase === "finding" ? RED : col) : IVORY).toArray(colors.array as Float32Array, i3);
      }
    });
    linkGeo.getAttribute("position").needsUpdate = true;
    dashGeo.getAttribute("position").needsUpdate = true;
    dashLines.computeLineDistances();
    pos.needsUpdate = true;
    colors.needsUpdate = true;
    const linkFade = phase === "build" ? ease((p * BUILD - 1.6) / 1.0) : 1;
    linkMat.opacity = 0.22 * light * linkFade;
    dashMat.opacity = 0.35 * light * linkFade;
    pMat.uniforms.uOpacity.value = 0.9 * light * linkFade;

    renderer.render(scene, camera);

    // rótulos
    const labelAlpha = clamp01(light * 1.4 - 0.2) * (phase === "build" ? ease((p * BUILD - 1.2) / 1.0) : 1);
    layerLabels.forEach(({ el, a }) => {
      const s = project(anchorPos(a, tmpA));
      el.style.transform = `translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0)`;
      el.style.opacity = s.behind ? "0" : labelAlpha.toFixed(3);
    });
    const r = project(anchorPos(reqAnchor, tmpA));
    const reqVisible = (phase === "finding" && p > 0.25) || phase === "fix";
    reqEl.style.transform = `translate3d(${r.x.toFixed(1)}px, ${r.y.toFixed(1)}px, 0)`;
    reqEl.style.opacity = reqVisible ? (pathAlpha * labelAlpha).toFixed(3) : "0";
    const status = phase === "fix" ? "403" : "200";
    if (reqStatus.textContent !== status) {
      reqStatus.textContent = status;
      reqEl.dataset.state = phase === "fix" ? "fixed" : "open";
    }

    if (phase !== lastPhase || (phase === "scan" && scanLayer !== lastLayer && scanLayer >= 0)) {
      lastPhase = phase;
      if (scanLayer >= 0) lastLayer = scanLayer;
      opts.onPhase?.(phase, { layer: scanLayer >= 0 ? scanLayer : undefined });
    }

    if (first) {
      first = false;
      opts.onFirstFrame?.();
    }

    // qualidade adaptativa: reduz a densidade de pixels se o quadro ficar caro
    frameAcc += dt;
    frameCount++;
    if (frameCount >= 45 && !opts.fixedQuality) {
      const avg = frameAcc / frameCount;
      if (avg > 0.028 && maxPixelRatio > 1) {
        maxPixelRatio = Math.max(1, maxPixelRatio - 0.25);
        resize();
      }
      frameAcc = 0;
      frameCount = 0;
    }
  };

  let needsFrame = true;
  const loop = (now: number) => {
    if (destroyed || !active) return;
    if (!opts.reducedMotion || needsFrame) {
      needsFrame = false;
      draw(now);
    }
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  const onLost = (e: Event) => {
    e.preventDefault();
    active = false;
    cancelAnimationFrame(raf);
  };
  canvas.addEventListener("webglcontextlost", onLost);

  return {
    setPose(p) {
      Object.assign(target, p);
      needsFrame = true;
    },
    setPointer(x, y) {
      pointer.x = x;
      pointer.y = y;
    },
    setActive(next) {
      if (next === active || destroyed) return;
      active = next;
      canvas.dataset.active = String(active);
      cancelAnimationFrame(raf);
      if (active) {
        last = performance.now();
        needsFrame = true;
        raf = requestAnimationFrame(loop);
      }
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      opts.labelRoot.querySelectorAll(".map-label").forEach((el) => el.remove());
      scene.traverse((o) => {
        const m = o as Mesh;
        m.geometry?.dispose();
        const mat = m.material as { dispose?: () => void } | undefined;
        mat?.dispose?.();
      });
      renderer.dispose();
    },
  };
}
