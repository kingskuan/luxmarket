"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Hero cinematic effects: slow Ken Burns zoom on the background image
 * + breathing ambient glows. Runs continuously (yoyo loop) so the hero
 * visibly "lives" even after the entrance animation finishes.
 */
export default function HeroFX({ backgroundImage }: { backgroundImage: string }) {
  const bgRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Ken Burns: slow continuous zoom on the hero image
      gsap.fromTo(
        bgRef.current,
        { scale: 1 },
        {
          scale: 1.09,
          duration: 14,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          transformOrigin: "center 30%",
        }
      );
      // breathing glows
      gsap.to(glowRef.current, {
        opacity: 0.55,
        duration: 5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to(glow2Ref.current, {
        opacity: 0.7,
        duration: 6.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div
        ref={glowRef}
        className="pointer-events-none absolute -left-24 top-1/4 h-[380px] w-[380px] rounded-full bg-lux-gold/25 blur-[110px]"
      />
      <div
        ref={glow2Ref}
        className="pointer-events-none absolute -right-20 bottom-10 h-[420px] w-[420px] rounded-full bg-purple-500/20 blur-[120px]"
      />
    </>
  );
}
