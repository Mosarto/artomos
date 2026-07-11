"use client";

import { ArrowUpRight } from "lucide-react";
import {
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type PointerEvent,
  type ReactNode,
} from "react";

export interface MagneticButtonProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: ReactNode;
  strength?: number;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function MagneticButton({
  href,
  children,
  strength = 8,
  className = "",
  onPointerMove,
  onPointerLeave,
  onPointerCancel,
  rel,
  target,
  ...anchorProps
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const resetPosition = () => {
    const button = buttonRef.current;

    if (!button) {
      return;
    }

    button.style.setProperty("--artomos-magnetic-x", "0px");
    button.style.setProperty("--artomos-magnetic-y", "0px");
  };

  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    onPointerMove?.(event);

    if (
      event.defaultPrevented ||
      event.pointerType !== "mouse" ||
      window.matchMedia(REDUCED_MOTION_QUERY).matches
    ) {
      return;
    }

    const button = event.currentTarget;
    const bounds = button.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * strength;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * strength;

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      button.style.setProperty("--artomos-magnetic-x", `${x.toFixed(2)}px`);
      button.style.setProperty("--artomos-magnetic-y", `${y.toFixed(2)}px`);
    });
  };

  const handlePointerLeave = (event: PointerEvent<HTMLAnchorElement>) => {
    onPointerLeave?.(event);
    resetPosition();
  };

  const handlePointerCancel = (event: PointerEvent<HTMLAnchorElement>) => {
    onPointerCancel?.(event);
    resetPosition();
  };

  const safeRel = target === "_blank" ? rel ?? "noreferrer" : rel;

  return (
    <a
      {...anchorProps}
      ref={buttonRef}
      href={href}
      target={target}
      rel={safeRel}
      className={`artomos-button artomos-button--magnetic ${className}`.trim()}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerCancel}
    >
      <span
        className="artomos-button__magnetic-content"
        style={{
          transform:
            "translate3d(var(--artomos-magnetic-x, 0px), var(--artomos-magnetic-y, 0px), 0)",
        }}
      >
        <span className="artomos-button__label">{children}</span>
        <ArrowUpRight
          className="artomos-button__icon"
          size={18}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </span>
    </a>
  );
}
