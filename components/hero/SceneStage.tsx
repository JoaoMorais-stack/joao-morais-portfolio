"use client";

import { useEffect, useRef, useState } from "react";
import { sceneBus } from "@/lib/sceneBus";
import { afterInteractionOnTouch } from "@/lib/afterLoad";
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

      // suspende a renderização quando uma seção opaca cobre a tela inteira
      // (galeria, "sobre") ou quando a aba fica em segundo plano
      const opaque = Array.from(document.querySelectorAll<HTMLElement>("[data-opaque]"));
      let pageVisible = !document.hidden;
      let pending = false;
      const sync = () => {
        pending = false;
        const vh = window.innerHeight;
        const covered = opaque.some((el) => {
          const r = el.getBoundingClientRect();
          return r.top <= 0 && r.bottom >= vh;
        });
        scene.setActive(pageVisible && !covered);
      };
      const onScroll = () => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(sync);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      sync();
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
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        scene.destroy();
      };
    };

    // a cena só carrega depois da página; até lá a imagem estática idêntica fica no lugar
    void afterInteractionOnTouch().then(() => {
      if (!disposed) void start();
    });

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
