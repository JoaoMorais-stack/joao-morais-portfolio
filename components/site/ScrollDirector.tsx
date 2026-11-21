"use client";

import { useEffect } from "react";
import { sceneBus } from "@/lib/sceneBus";

/**
 * Liga o scroll nativo (sem sequestro de rolagem) à câmera da cena e às
 * transições das seções. Com movimento reduzido, só a pose da câmera muda
 * (sem animação contínua) e os textos ficam visíveis desde o início.
 */
export default function ScrollDirector() {
  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.documentElement.dataset.motion = reduced ? "reduced" : "full";

      // cada segmento leva a câmera da pose i para a i+1; vale o último já iniciado
      const seg = [0, 0, 0, 0];
      const push = () => {
        let p = seg[0];
        for (let i = 1; i < seg.length; i++) if (seg[i] > 0) p = i + seg[i];
        sceneBus.set(p);
      };

      ctx = gsap.context(() => {
        // segmento 0→1: abertura até o fim da introdução
        ScrollTrigger.create({
          trigger: "#inicio",
          start: "top top",
          endTrigger: "#intro",
          end: "bottom bottom",
          onUpdate: (s) => {
            seg[0] = s.progress;
            push();
          },
        });
        // segmento 1→2: a vitrine sobe e a singularidade vira luz de fundo
        ScrollTrigger.create({
          trigger: ".featured",
          start: "top bottom",
          end: "center center",
          onUpdate: (s) => {
            seg[1] = s.progress;
            push();
          },
        });
        // segmento 2→3: segurança ofensiva, o mapa ao lado do método
        ScrollTrigger.create({
          trigger: "#seguranca",
          start: "top bottom",
          end: "top top",
          onUpdate: (s) => {
            seg[2] = s.progress;
            push();
          },
        });
        // segmento 3→4: retorno no contato
        ScrollTrigger.create({
          trigger: "#contato",
          start: "top bottom",
          end: "top top",
          onUpdate: (s) => {
            seg[3] = s.progress;
            push();
          },
        });

        if (reduced) return;

        // o nome se separa ao rolar: as duas palavras se afastam da singularidade
        const heroTl = gsap.timeline({
          scrollTrigger: { trigger: "#inicio", start: "top top", end: "bottom top", scrub: 0.6 },
        });
        heroTl
          .to("[data-parallax='first']", { xPercent: -14, yPercent: -40, opacity: 0.0, ease: "none" }, 0)
          .to("[data-parallax='last']", { xPercent: 12, yPercent: 50, opacity: 0.0, ease: "none" }, 0)
          .to("[data-parallax='copy']", { y: -60, opacity: 0, ease: "none" }, 0)
          .to(".hud", { opacity: 0, ease: "none" }, 0);

        // a frase da introdução acende palavra por palavra, controlada pelo scroll
        gsap.fromTo(
          "[data-reveal-words] .word",
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: { trigger: "#intro", start: "top 75%", end: "center 45%", scrub: 0.4 },
          },
        );
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el, i) => {
          gsap.from(el, {
            opacity: 0,
            y: 28,
            duration: 0.7,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        // vitrine: a tela sai do plano inclinado e assenta de frente para o visitante
        gsap.fromTo(
          "[data-rig]",
          { rotateX: 34, rotateY: -18, rotateZ: 6, y: 120, scale: 0.86 },
          {
            rotateX: 8,
            rotateY: -9,
            rotateZ: 1.5,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: ".featured", start: "top bottom", end: "center 55%", scrub: 0.8 },
          },
        );
        gsap.fromTo(
          ".device-phone",
          { z: 40, yPercent: 30 },
          {
            z: 160,
            yPercent: -6,
            ease: "none",
            scrollTrigger: { trigger: ".featured", start: "top bottom", end: "bottom top", scrub: 0.8 },
          },
        );
      });

      // inclinação leve da vitrine pelo cursor
      const stage = document.querySelector<HTMLElement>("[data-tilt]");
      if (stage && !reduced && window.matchMedia("(pointer: fine)").matches) {
        const qx = gsap.quickTo(stage, "rotationY", { duration: 0.8, ease: "power3.out" });
        const qy = gsap.quickTo(stage, "rotationX", { duration: 0.8, ease: "power3.out" });
        stage.addEventListener("pointermove", (e) => {
          const r = stage.getBoundingClientRect();
          qx(((e.clientX - r.left) / r.width - 0.5) * 6);
          qy(-((e.clientY - r.top) / r.height - 0.5) * 4);
        });
        stage.addEventListener("pointerleave", () => {
          qx(0);
          qy(0);
        });
      }
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return null;
}
