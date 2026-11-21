"use client";

import { useEffect, useRef, useState } from "react";
import { sceneBus } from "@/lib/sceneBus";
import type { Dictionary } from "@/content/site";

type Props = { map: Dictionary["hero"]["map"] };

/**
 * Palco fixo atrás das seções narrativas. Mostra primeiro uma imagem estática
 * (também usada como fallback sem WebGL) e troca para a cena em tempo real
 * quando o primeiro quadro fica pronto. O módulo 3D é carregado sob demanda.
 */
export default function SceneStage({ map }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const [live, setLive] = useState(false);
  const [mode, setMode] = useState<"loading" | "live" | "static">("loading");

  useEffect(() => {
    const canvas = canvasRef.current;
    const labelRoot = labelsRef.current;
    if (!canvas || !labelRoot) return;
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
    const layerNames = [map.layers.ui, map.layers.api, map.layers.db, map.layers.infra];

    const start = async () => {
      const [{ createAttackMap }, { poseAt }] = await Promise.all([
        import("@/lib/attackmap/scene"),
        import("@/lib/attackmap/poses"),
      ]);
      if (disposed) return;
      let mobile = mobileQuery.matches;
      const scene = createAttackMap(canvas, poseAt(sceneBus.get(), mobile), {
        mobile,
        reducedMotion: reduced,
        fixedQuality: params.has("fixedq"),
        labels: { layers: map.layers, request: map.request },
        labelRoot,
        onFirstFrame: () => {
          setLive(true);
          setMode("live");
        },
        onPhase: (phase, { layer }) => {
          const el = statusRef.current;
          if (!el) return;
          const text =
            phase === "scan"
              ? map.phases.scan.replace("{layer}", layerNames[layer ?? 0].toLowerCase())
              : map.phases[phase];
          el.textContent = text;
          el.dataset.phase = phase;
        },
      });
      if (!scene) {
        setMode("static");
        return;
      }

      const unsub = sceneBus.subscribe((p) => scene.setPose(poseAt(p, mobile)));
      const onMq = () => {
        mobile = mobileQuery.matches;
        scene.setPose(poseAt(sceneBus.get(), mobile));
      };
      mobileQuery.addEventListener("change", onMq);

      const fine = window.matchMedia("(pointer: fine)").matches;
      const onMove = (e: PointerEvent) => {
        scene.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      };
      if (fine && !reduced) window.addEventListener("pointermove", onMove, { passive: true });

      // suspende a renderização quando nenhuma seção que mostra a cena está visível
      const visible = new Set<Element>();
      let pageVisible = !document.hidden;
      const sync = () => scene.setActive(pageVisible && visible.size > 0);
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
        scene.destroy();
      };
    };

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
  }, [map]);

  return (
    <div className="stage" data-mode={mode} aria-hidden="true">
      <picture>
        <source media="(max-width: 760px)" srcSet="/media/scene-still-mobile.webp" />
        <img className="stage-poster" src="/media/scene-still.webp" alt="" decoding="async" fetchPriority="high" />
      </picture>
      <canvas ref={canvasRef} className={`stage-canvas${live ? " is-live" : ""}`} />
      <div ref={labelsRef} className="map-labels" />
      <div className="stage-scrim" />
      <div className="hud">
        <p className="hud-note">{map.note}</p>
        <p ref={statusRef} className="hud-status" data-phase="build">
          {map.phases.build}
        </p>
      </div>
    </div>
  );
}
