"use client";

import { useEffect, useRef, useState } from "react";
import { sceneBus } from "@/lib/sceneBus";

type Props = { inclLabel: string; distLabel: string; note: string };

/**
 * Palco fixo atrás das seções narrativas. Mostra primeiro uma imagem estática
 * (também usada como fallback sem WebGL) e troca para a cena em tempo real
 * quando o primeiro quadro fica pronto. O módulo WebGL é carregado sob demanda.
 */
export default function SingularityStage({ inclLabel, distLabel, note }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inclRef = useRef<HTMLSpanElement>(null);
  const distRef = useRef<HTMLSpanElement>(null);
  const [live, setLive] = useState(false);
  const [mode, setMode] = useState<"loading" | "live" | "static">("loading");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const params = new URLSearchParams(window.location.search);
    if (params.has("capture")) document.documentElement.dataset.capture = "1";
    if (params.has("nowebgl")) {
      setMode("static");
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobileQuery = window.matchMedia("(max-width: 760px), (max-width: 1100px) and (orientation: portrait)");
    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const [{ createSingularity }, { poseAt }] = await Promise.all([
        import("@/lib/singularity/renderer"),
        import("@/lib/singularity/keyframes"),
      ]);
      if (disposed) return;
      let mobile = mobileQuery.matches;
      let lastIncl = "";
      let lastDist = "";
      const renderer = createSingularity(canvas, poseAt(sceneBus.get(), mobile), {
        mobile,
        reducedMotion: reduced,
        onFirstFrame: () => {
          setLive(true);
          setMode("live");
          document.documentElement.dataset.scene = "live";
        },
        onStats: ({ incl, dist }) => {
          const i = incl.toFixed(1);
          const d = dist.toFixed(1);
          if (i !== lastIncl && inclRef.current) inclRef.current.textContent = `${i}°`;
          if (d !== lastDist && distRef.current) distRef.current.textContent = `${d} rs`;
          lastIncl = i;
          lastDist = d;
        },
      });
      if (!renderer) {
        setMode("static");
        return;
      }

      const unsub = sceneBus.subscribe((p) => renderer.setState(poseAt(p, mobile)));
      const onMq = () => {
        mobile = mobileQuery.matches;
        renderer.setState(poseAt(sceneBus.get(), mobile));
      };
      mobileQuery.addEventListener("change", onMq);

      // cursor: resposta discreta apenas em dispositivos com ponteiro fino
      const fine = window.matchMedia("(pointer: fine)").matches;
      const onMove = (e: PointerEvent) => {
        renderer.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      };
      if (fine && !reduced) window.addEventListener("pointermove", onMove, { passive: true });

      // suspende a renderização quando nenhuma seção que mostra a cena está visível
      const visible = new Set<Element>();
      let pageVisible = !document.hidden;
      const sync = () => renderer.setActive(pageVisible && visible.size > 0);
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => (en.isIntersecting ? visible.add(en.target) : visible.delete(en.target)));
          sync();
        },
        { rootMargin: "10% 0px" },
      );
      document.querySelectorAll("[data-scene]").forEach((el) => io.observe(el));
      const onVis = () => {
        pageVisible = !document.hidden;
        sync();
      };
      document.addEventListener("visibilitychange", onVis);

      cleanup = () => {
        unsub();
        mobileQuery.removeEventListener("change", onMq);
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("visibilitychange", onVis);
        io.disconnect();
        renderer.destroy();
      };
    };

    // não disputa a thread principal com a primeira pintura
    const idle = (cb: () => void) => {
      const w = window as Window & { requestIdleCallback?: Window["requestIdleCallback"] };
      if (typeof w.requestIdleCallback === "function") w.requestIdleCallback(cb, { timeout: 600 });
      else setTimeout(cb, 120);
    };
    idle(() => void start());

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div className="stage" data-mode={mode} aria-hidden="true">
      <picture>
        <source media="(max-width: 760px)" srcSet="/media/singularity-still-mobile.webp" />
        <img className="stage-poster" src="/media/singularity-still.webp" alt="" decoding="async" fetchPriority="high" />
      </picture>
      <canvas ref={canvasRef} className={`stage-canvas${live ? " is-live" : ""}`} />
      <div className="stage-scrim" />
      <div className="hud">
        <p className="hud-note">{note}</p>
        <p className="hud-values">
          <span>{inclLabel}</span> <span ref={inclRef} className="hud-num">6.5°</span>
          <span>{distLabel}</span> <span ref={distRef} className="hud-num">25.0 rs</span>
        </p>
      </div>
    </div>
  );
}
