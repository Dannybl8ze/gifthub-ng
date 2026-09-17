"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Magnetic — cursor-attracted hover wrapper.
 *
 * On pointer devices, content translates toward the cursor by `strength` × offset,
 * with a custom overshoot easing on release. Touch / no-hover devices get a pass-through.
 * Respects prefers-reduced-motion.
 */
export function Magnetic({
  children,
  strength = 0.18,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    // Skip on touch and reduced-motion users.
    const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hoverCapable || reduced) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const animate = () => {
      // simple lerp toward target — feels analog
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      inner.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        raf = requestAnimationFrame(animate);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      targetX = (e.clientX - cx) * strength;
      targetY = (e.clientY - cy) * strength;
      if (!raf) raf = requestAnimationFrame(animate);
    };

    const onLeave = () => {
      // overshoot snap-back via inline transition
      inner.style.transition = "transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1)";
      inner.style.transform = "translate3d(0, 0, 0)";
      targetX = 0;
      targetY = 0;
      currentX = 0;
      currentY = 0;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      // clear inline transition once it finishes so live drag is responsive again
      window.setTimeout(() => {
        if (inner) inner.style.transition = "";
      }, 620);
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);

    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <div ref={wrapRef} className={className}>
      <div ref={innerRef} style={{ willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}
