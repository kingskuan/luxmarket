"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scroll-reveal wrapper built on GSAP + ScrollTrigger.
 *
 * - Children are the animation targets: staggers over direct children,
 *   or animates the wrapper itself when it has no children of its own.
 * - trigger={false} plays immediately on mount (hero use-case).
 * - Respects prefers-reduced-motion (content just stays visible).
 */
interface RevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** initial y offset in px */
  y?: number;
  /** stagger between direct children, seconds */
  stagger?: number;
  /** extra delay before start, seconds */
  delay?: number;
  /** animate on mount instead of on scroll */
  trigger?: boolean;
  /** ScrollTrigger start position */
  start?: string;
  /** animation duration, seconds */
  duration?: number;
}

export default function Reveal({
  children,
  className,
  style,
  y = 40,
  stagger = 0,
  delay = 0,
  trigger = true,
  start = "top 85%",
  duration = 0.9,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const targets = el.children.length
      ? Array.from(el.children)
      : [el];

    const ctx = gsap.context(() => {
      const anim = gsap.fromTo(
        targets,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          ease: "power3.out",
          stagger,
          delay,
          scrollTrigger: trigger
            ? { trigger: el, start, once: true }
            : undefined,
        }
      );
      if (!trigger) anim.play();
    }, el);

    return () => ctx.revert();
  }, [y, stagger, delay, trigger, start, duration]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
