"use client";

import Lenis from "lenis";
import { useEffect, type PropsWithChildren } from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FORM_CONTROL_SELECTOR =
  "input, textarea, select, option, [contenteditable='true'], [data-lenis-prevent]";
const INTERNAL_SCROLL_SELECTOR = "[data-scroll-to], a[href^='#']";

type SmoothScrollRuntime = {
  consumers: number;
  lenis: Lenis | null;
  mediaQuery: MediaQueryList;
  onAnchorClick: (event: MouseEvent) => void;
  onMotionPreferenceChange: () => void;
  onLenisScroll: () => void;
  onTick: (time: number) => void;
};

let runtime: SmoothScrollRuntime | null = null;

function getScrollTarget(trigger: HTMLElement): {
  element: HTMLElement;
  hash: string;
} | null {
  const explicitTarget = trigger.dataset.scrollTo;
  const hrefTarget =
    trigger instanceof HTMLAnchorElement ? trigger.getAttribute("href") : null;
  const rawTarget = explicitTarget ?? hrefTarget;

  if (!rawTarget || (!rawTarget.startsWith("#") && !explicitTarget)) {
    return null;
  }

  const hash = rawTarget.startsWith("#") ? rawTarget : `#${rawTarget}`;

  if (hash === "#") {
    return null;
  }

  let id: string;

  try {
    id = decodeURIComponent(hash.slice(1));
  } catch {
    return null;
  }

  const element = document.getElementById(id);

  return element ? { element, hash } : null;
}

function getAnchorOffset(trigger: HTMLElement, target: HTMLElement): number {
  if (target.id === "inicio") {
    return 0;
  }

  const explicitOffset = Number(trigger.dataset.scrollOffset);

  if (Number.isFinite(explicitOffset)) {
    return explicitOffset;
  }

  const header = document.querySelector<HTMLElement>("[data-site-header]");
  return -(header?.offsetHeight ?? 80);
}

function focusScrollTarget(target: HTMLElement): void {
  const needsTemporaryTabIndex = !target.hasAttribute("tabindex");

  if (needsTemporaryTabIndex) {
    target.setAttribute("tabindex", "-1");
  }

  target.focus({ preventScroll: true });

  if (needsTemporaryTabIndex) {
    target.addEventListener(
      "blur",
      () => target.removeAttribute("tabindex"),
      { once: true },
    );
  }
}

function startLenis(activeRuntime: SmoothScrollRuntime): void {
  if (activeRuntime.lenis || activeRuntime.mediaQuery.matches) {
    return;
  }

  const lenis = new Lenis({
    autoRaf: false,
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 0.9,
    prevent: (node) => Boolean(node.closest(FORM_CONTROL_SELECTOR)),
  });

  activeRuntime.lenis = lenis;
  lenis.on("scroll", activeRuntime.onLenisScroll);
  gsap.ticker.add(activeRuntime.onTick);
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.refresh();
}

function stopLenis(activeRuntime: SmoothScrollRuntime): void {
  if (!activeRuntime.lenis) {
    return;
  }

  gsap.ticker.remove(activeRuntime.onTick);
  activeRuntime.lenis.off("scroll", activeRuntime.onLenisScroll);
  activeRuntime.lenis.destroy();
  activeRuntime.lenis = null;
  gsap.ticker.lagSmoothing(500, 33);
}

function createRuntime(): SmoothScrollRuntime {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  const activeRuntime = {} as SmoothScrollRuntime;

  activeRuntime.consumers = 0;
  activeRuntime.lenis = null;
  activeRuntime.mediaQuery = mediaQuery;
  activeRuntime.onLenisScroll = () => ScrollTrigger.update();
  activeRuntime.onTick = (time) => activeRuntime.lenis?.raf(time * 1_000);
  activeRuntime.onMotionPreferenceChange = () => {
    if (mediaQuery.matches) {
      stopLenis(activeRuntime);
    } else {
      startLenis(activeRuntime);
    }

    ScrollTrigger.refresh();
  };
  activeRuntime.onAnchorClick = (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !(event.target instanceof Element)
    ) {
      return;
    }

    const trigger = event.target.closest<HTMLElement>(INTERNAL_SCROLL_SELECTOR);

    if (!trigger) {
      return;
    }

    const target = getScrollTarget(trigger);

    if (!target) {
      return;
    }

    event.preventDefault();
    const offset = getAnchorOffset(trigger, target.element);
    const shouldMoveFocus = trigger.matches(
      ".artomos-skip-link, [data-scroll-focus]",
    );

    if (shouldMoveFocus) {
      focusScrollTarget(target.element);
    }

    if (activeRuntime.lenis && !mediaQuery.matches) {
      activeRuntime.lenis.scrollTo(target.element, {
        offset,
        duration: 0.9,
      });
    } else {
      window.scrollTo({
        top:
          target.element.getBoundingClientRect().top + window.scrollY + offset,
        behavior: "auto",
      });
    }

    if (window.location.hash !== target.hash) {
      window.history.pushState(null, "", target.hash);
    }
  };

  document.addEventListener("click", activeRuntime.onAnchorClick);
  mediaQuery.addEventListener("change", activeRuntime.onMotionPreferenceChange);
  startLenis(activeRuntime);

  return activeRuntime;
}

function acquireRuntime(): () => void {
  const activeRuntime = runtime ?? createRuntime();
  runtime = activeRuntime;
  activeRuntime.consumers += 1;

  return () => {
    activeRuntime.consumers -= 1;

    if (activeRuntime.consumers > 0) {
      return;
    }

    document.removeEventListener("click", activeRuntime.onAnchorClick);
    activeRuntime.mediaQuery.removeEventListener(
      "change",
      activeRuntime.onMotionPreferenceChange,
    );
    stopLenis(activeRuntime);

    if (runtime === activeRuntime) {
      runtime = null;
    }
  };
}

export function getLenis(): Lenis | null {
  return runtime?.lenis ?? null;
}

export function SmoothScrollProvider({ children }: PropsWithChildren) {
  useEffect(() => acquireRuntime(), []);

  return children;
}

export default SmoothScrollProvider;
