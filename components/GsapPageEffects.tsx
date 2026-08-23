"use client";

import { ReactNode, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function GsapPageEffects({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        gsap.set("[data-gsap]", { autoAlpha: 1, y: 0, clearProps: "transform,visibility" });
        return;
      }

      gsap.defaults({ ease: "power3.out", duration: 0.85 });

      const heroLines = scope.current?.querySelectorAll("[data-hero-line]");
      const heroImage = scope.current?.querySelector("[data-hero-image]");
      const revealElements = scope.current?.querySelectorAll("[data-gsap]");
      const parallaxElement = scope.current?.querySelector("[data-parallax-slow]");
      const parallaxSection = scope.current?.querySelector("[data-parallax-section]");

      if (heroLines?.length) {
        gsap.from(heroLines, {
          y: 34,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 1
        });
      }

      if (heroImage) {
        gsap.fromTo(heroImage, { scale: 1.08 }, {
          scale: 1,
          duration: 1.8,
          ease: "power2.out"
        });
      }

      if (revealElements?.length) {
        ScrollTrigger.batch(revealElements, {
          start: "top 82%",
          once: true,
          onEnter: (elements) => {
            gsap.fromTo(
              elements,
              { y: 44, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, stagger: 0.08, overwrite: true }
            );
          }
        });
      }

      if (parallaxElement && parallaxSection) {
        gsap.to(parallaxElement, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: parallaxSection,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.7
          }
        });
      }

      ScrollTrigger.refresh();
    },
    { scope }
  );

  return <div ref={scope}>{children}</div>;
}
