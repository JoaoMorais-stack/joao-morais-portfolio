import { FRAGMENT_SHADER, VERTEX_SHADER } from "./shaders";

/** Estado de câmera e luz que o scroll interpola. */
export type SceneState = {
  incl: number; // elevação da câmera acima do disco, em graus
  dist: number; // distância da câmera, em raios de Schwarzschild
  yaw: number; // giro em torno do eixo do disco, em radianos
  roll: number; // inclinação da composição na tela, em radianos
  cx: number; // deslocamento horizontal do centro (unidades de altura da tela)
  cy: number;
  zoom: number;
  exposure: number;
  grid: number;
};

export type RendererOptions = {
  mobile: boolean;
  reducedMotion: boolean;
  onFirstFrame?: () => void;
  onStats?: (s: { incl: number; dist: number; scale: number; fps: number }) => void;
};

export type SingularityRenderer = {
  setState: (s: SceneState) => void;
  setPointer: (x: number, y: number) => void;
  setActive: (active: boolean) => void;
  destroy: () => void;
};

const UNIFORMS = [
  "uRes", "uTime", "uCam", "uRoll", "uCenter", "uZoom",
  "uExposure", "uGrid", "uSteps", "uReveal",
] as const;
type UniformName = (typeof UNIFORMS)[number];

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) throw new Error("shader");
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`Falha ao compilar shader: ${log}`);
  }
  return sh;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Cria o renderizador. Retorna null quando WebGL2 não está disponível
 * (o chamador mantém a imagem estática de fallback).
 */
export function createSingularity(
  canvas: HTMLCanvasElement,
  initial: SceneState,
  opts: RendererOptions,
): SingularityRenderer | null {
  let gl: WebGL2RenderingContext | null = null;
  try {
    gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });
  } catch {
    gl = null;
  }
  if (!gl) return null;

  let program: WebGLProgram;
  try {
    const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const prog = gl.createProgram();
    if (!prog) return null;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("Singularity: falha ao ligar o programa", gl.getProgramInfoLog(prog));
      return null;
    }
    program = prog;
  } catch (err) {
    console.warn(err);
    return null;
  }

  // triângulo que cobre a tela inteira
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.useProgram(program);

  const u = {} as Record<UniformName, WebGLUniformLocation | null>;
  for (const name of UNIFORMS) u[name] = gl.getUniformLocation(program, name);

  // qualidade adaptativa: escala de resolução interna e limite de passos
  const maxDpr = opts.mobile ? 1.5 : 1.75;
  const maxScale = opts.mobile ? 0.75 : 1.0;
  let scale = opts.mobile ? 0.6 : 0.8;
  const steps = opts.mobile ? 170 : 260;

  const target: SceneState = { ...initial };
  const cur: SceneState = { ...initial };
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };

  let raf = 0;
  let active = true;
  let destroyed = false;
  let first = true;
  let reveal = opts.reducedMotion ? 1 : 0;
  const t0 = performance.now();
  let last = t0;
  let frameAcc = 0;
  let frameCount = 0;
  let fps = 60;
  let width = 0;
  let height = 0;
  let needsFrame = true;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const w = Math.max(2, Math.round(canvas.clientWidth * dpr * scale));
    const h = Math.max(2, Math.round(canvas.clientHeight * dpr * scale));
    if (w !== width || h !== height) {
      width = w;
      height = h;
      canvas.width = w;
      canvas.height = h;
      gl!.viewport(0, 0, w, h);
    }
    needsFrame = true;
  };

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const draw = (now: number) => {
    const g = gl!;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const time = opts.reducedMotion ? 12.0 : (now - t0) / 1000;

    // amortecimento: a câmera chega ao alvo do scroll com inércia curta
    const k = opts.reducedMotion ? 1 : 1 - Math.exp(-dt * 5.5);
    (Object.keys(target) as (keyof SceneState)[]).forEach((key) => {
      cur[key] = lerp(cur[key], target[key], k);
    });
    const pk = 1 - Math.exp(-dt * 3.0);
    pointer.sx = lerp(pointer.sx, pointer.x, pk);
    pointer.sy = lerp(pointer.sy, pointer.y, pk);
    if (!opts.reducedMotion) reveal = Math.min(1, reveal + dt / 1.8);

    const incl = ((cur.incl + pointer.sy * 3.0) * Math.PI) / 180;
    const yaw = cur.yaw + pointer.sx * 0.12;
    const camX = cur.dist * Math.cos(incl) * Math.sin(yaw);
    const camZ = cur.dist * Math.cos(incl) * Math.cos(yaw);
    const camY = cur.dist * Math.sin(incl);
    const easedReveal = 1 - Math.pow(1 - reveal, 3);

    g.uniform2f(u.uRes, width, height);
    g.uniform1f(u.uTime, time);
    g.uniform3f(u.uCam, camX, camY, camZ);
    g.uniform1f(u.uRoll, cur.roll);
    g.uniform2f(u.uCenter, cur.cx, cur.cy);
    g.uniform1f(u.uZoom, cur.zoom);
    g.uniform1f(u.uExposure, cur.exposure);
    g.uniform1f(u.uGrid, cur.grid * easedReveal);
    g.uniform1f(u.uSteps, steps);
    g.uniform1f(u.uReveal, 0.15 + 0.85 * easedReveal);
    g.drawArrays(g.TRIANGLES, 0, 3);

    if (first) {
      first = false;
      opts.onFirstFrame?.();
    }

    // mede o custo real e ajusta a resolução interna
    frameAcc += dt;
    frameCount++;
    if (frameCount >= 40) {
      const avg = frameAcc / frameCount;
      fps = 1 / avg;
      if (avg > 0.024 && scale > 0.42) {
        scale = Math.max(0.42, scale * 0.85);
        resize();
      } else if (avg < 0.0135 && scale < maxScale) {
        scale = Math.min(maxScale, scale * 1.08);
        resize();
      }
      frameAcc = 0;
      frameCount = 0;
    }
    opts.onStats?.({ incl: cur.incl, dist: cur.dist, scale, fps });
  };

  const loop = (now: number) => {
    if (destroyed || !active) return;
    if (opts.reducedMotion) {
      if (needsFrame) {
        needsFrame = false;
        draw(now);
      }
    } else {
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
    setState(s) {
      Object.assign(target, s);
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
      gl!.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
