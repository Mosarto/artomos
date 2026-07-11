"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

import { gsap } from "@/lib/gsap";

const SOURCE_FRAME_COUNT = 192;
const FRAME_COUNT = 97;
const PRELOAD_RADIUS = 3;
const MAX_DECODED_FRAMES = 18;

function frameSource(index: number, isMobile: boolean): string {
  const sourceFrame =
    index === FRAME_COUNT - 1 ? SOURCE_FRAME_COUNT : index * 2 + 1;
  const frame = String(sourceFrame).padStart(6, "0");

  return isMobile
    ? `/assets/artomos/transitions/1_2-mobile/frame_${frame}.webp`
    : `/assets/artomos/transitions/1_2/frame_${frame}.avif`;
}

function drawCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  focusX = 0.5,
) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const canvasRatio = width / height;
  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;
  let sourceX = 0;
  let sourceY = 0;

  if (canvasRatio > imageRatio) {
    sourceHeight = image.naturalWidth / canvasRatio;
    sourceY = (image.naturalHeight - sourceHeight) / 2;
  } else {
    sourceWidth = image.naturalHeight * canvasRatio;
    sourceX = (image.naturalWidth - sourceWidth) * focusX;
  }

  context.clearRect(0, 0, width, height);
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    width,
    height,
  );
}

export function HeroToAboutTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });

    if (!section || !canvas || !context) return;

    let active = true;
    let currentFrame = -1;
    const cache = new Map<number, HTMLImageElement>();
    const getFrameFocus = () => (window.innerWidth <= 767 ? 0.75 : 0.25);
    const isMobile = () => window.innerWidth <= 767;

    const resizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = 1;
      canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio));
      canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));

      const image = cache.get(currentFrame);
      if (image?.complete && image.naturalWidth) {
        drawCover(
          context,
          image,
          canvas.width,
          canvas.height,
          getFrameFocus(),
        );
      }
    };

    const trimCache = (focus: number) => {
      if (cache.size <= MAX_DECODED_FRAMES) return;

      const removable = [...cache.keys()]
        .filter((index) => index !== focus && index !== 0 && index !== FRAME_COUNT - 1)
        .sort((a, b) => Math.abs(b - focus) - Math.abs(a - focus));

      while (cache.size > MAX_DECODED_FRAMES && removable.length) {
        const index = removable.shift();
        if (index === undefined) break;
        const image = cache.get(index);
        if (image) image.onload = null;
        cache.delete(index);
      }
    };

    const loadFrame = (index: number, drawWhenReady = false) => {
      const safeIndex = Math.max(0, Math.min(FRAME_COUNT - 1, index));
      const cached = cache.get(safeIndex);

      if (cached) {
        if (drawWhenReady && cached.complete && cached.naturalWidth) {
          drawCover(
            context,
            cached,
            canvas.width,
            canvas.height,
            getFrameFocus(),
          );
          setIsReady(true);
        }
        return cached;
      }

      const image = new window.Image();
      image.decoding = "async";
      image.src = frameSource(safeIndex, isMobile());
      image.onload = () => {
        if (!active) return;
        if (drawWhenReady && currentFrame === safeIndex) {
          drawCover(
            context,
            image,
            canvas.width,
            canvas.height,
            getFrameFocus(),
          );
          setIsReady(true);
        }
      };
      cache.set(safeIndex, image);
      trimCache(currentFrame);
      return image;
    };

    const preloadAround = (index: number) => {
      for (let distance = 1; distance <= PRELOAD_RADIUS; distance += 1) {
        loadFrame(index + distance);
        loadFrame(index - distance);
      }
    };

    const renderFrame = (index: number) => {
      const nextFrame = Math.max(
        0,
        Math.min(FRAME_COUNT - 1, Math.round(index)),
      );

      if (nextFrame === currentFrame && cache.has(nextFrame)) return;

      currentFrame = nextFrame;
      section.dataset.frame = String(currentFrame + 1);
      const image = loadFrame(currentFrame, true);

      if (image.complete && image.naturalWidth) {
        drawCover(
          context,
          image,
          canvas.width,
          canvas.height,
          getFrameFocus(),
        );
        setIsReady(true);
      }

      preloadAround(currentFrame);
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);
    resizeCanvas();
    renderFrame(0);
    loadFrame(FRAME_COUNT - 1);

    const experience = section.closest<HTMLElement>(
      ".artomos-hero-about-experience",
    );
    const aboutSection = experience?.querySelector<HTMLElement>("#servicos");

    if (!experience || !aboutSection) return;

    const media = gsap.matchMedia();
    const animationContext = gsap.context(() => {
      media.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (matchContext) => {
          const { reduced } = matchContext.conditions as { reduced: boolean };

          if (reduced) {
            renderFrame(FRAME_COUNT - 1);
            return;
          }

          const playhead = { frame: 0 };
          gsap.to(playhead, {
            frame: FRAME_COUNT - 1,
            ease: "none",
            snap: { frame: 1 },
            onUpdate: () => renderFrame(playhead.frame),
            scrollTrigger: {
              trigger: experience,
              start: "top top",
              endTrigger: aboutSection,
              end: "top top",
              scrub: 0.28,
              invalidateOnRefresh: true,
            },
          });
        },
      );
    }, section);

    return () => {
      active = false;
      resizeObserver.disconnect();
      media.revert();
      animationContext.revert();
      cache.forEach((image) => {
        image.onload = null;
      });
      cache.clear();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`artomos-hero-about-transition${isReady ? " is-ready" : ""}`}
      aria-label="Fundo animado do início e sobre a Artomos"
    >
      <div className="artomos-hero-about-transition__scene" aria-hidden="true">
        <Image
          className="artomos-hero-about-transition__poster"
          src="/assets/artomos/transitions/hero-about-start.avif"
          alt=""
          fill
          sizes="100vw"
          unoptimized
        />
        <canvas ref={canvasRef} className="artomos-hero-about-transition__canvas" />
        <div className="artomos-hero-about-transition__veil" />
        <div className="artomos-hero-about-transition__grain" />
      </div>
    </section>
  );
}

export default HeroToAboutTransition;
