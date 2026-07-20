"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";

const FRAME_COUNT = 92;
const INITIAL_FRAME_COUNT = 40;
const LOAD_CONCURRENCY = 6;
const DECODE_CONCURRENCY = 3;
const FRAME_FETCH_TIMEOUT = 15_000;
const IMAGE_LOAD_TIMEOUT = 12_000;
const IMAGE_DECODE_TIMEOUT = 5_000;
const ULTRAWIDE_RATIO = 2.18;

function frameSource(index: number): string {
  const frame = String(index + 1).padStart(6, "0");
  return `/assets/artomos/transitions/1_2/frame_${frame}.avif`;
}

async function runQueue<T>(
  items: T[],
  concurrency: number,
  task: (item: T) => Promise<void>,
): Promise<void> {
  let cursor = 0;

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    async () => {
      while (cursor < items.length) {
        const item = items[cursor];
        cursor += 1;
        await task(item);
      }
    },
  );

  await Promise.all(workers);
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
  const isUltrawide = canvasRatio >= ULTRAWIDE_RATIO;

  if (isUltrawide) {
    const coverScale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const containScale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
    const ratioProgress = Math.min(1, (canvasRatio - ULTRAWIDE_RATIO) / 0.28);
    const scale = coverScale - (coverScale - containScale) * (0.36 + ratioProgress * 0.16);
    const targetWidth = image.naturalWidth * scale;
    const targetHeight = image.naturalHeight * scale;
    const targetX = (width - targetWidth) * focusX;
    const targetY = (height - targetHeight) * 0.42;

    context.clearRect(0, 0, width, height);
    context.fillStyle = "#070707";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, targetX, targetY, targetWidth, targetHeight);
    return;
  }

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

    const experience = section.closest<HTMLElement>(
      ".artomos-hero-about-experience",
    );
    const heroSection = experience?.querySelector<HTMLElement>("#inicio");

    if (!experience || !heroSection) return;

    let active = true;
    let currentFrame = 0;
    let animationCleanup: (() => void) | undefined;
    const frames = new Array<HTMLImageElement>(FRAME_COUNT);
    const objectUrls: string[] = [];
    const getFrameFocus = () => (window.innerWidth <= 767 ? 0.75 : 0.25);

    const paint = (image: HTMLImageElement) => {
      if (!image.naturalWidth) return;
      drawCover(
        context,
        image,
        canvas.width,
        canvas.height,
        getFrameFocus(),
      );
    };

    const resizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio));
      canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));

      const image = frames[currentFrame];
      if (image?.complete && image.naturalWidth) paint(image);
    };

    const resolveFrame = (index: number) => {
      for (let candidate = index; candidate >= 0; candidate -= 1) {
        const frame = frames[candidate];
        if (frame?.complete && frame.naturalWidth) return frame;
      }

      for (let candidate = index + 1; candidate < FRAME_COUNT; candidate += 1) {
        const frame = frames[candidate];
        if (frame?.complete && frame.naturalWidth) return frame;
      }

      return undefined;
    };

    const renderFrame = (index: number) => {
      const nextFrame = Math.max(
        0,
        Math.min(FRAME_COUNT - 1, Math.round(index)),
      );
      const image = resolveFrame(nextFrame);

      currentFrame = nextFrame;
      section.dataset.frame = String(currentFrame + 1);
      if (image) paint(image);
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);
    resizeCanvas();

    const loadFonts = async () => {
      if (!("fonts" in document)) return;

      await Promise.allSettled([
        document.fonts.load('400 1rem "Manrope"'),
        document.fonts.load('300 1rem "Cormorant Garamond"'),
        document.fonts.load('400 1rem "IBM Plex Mono"'),
      ]);
      await document.fonts.ready;
    };

    const sources = new Array<string>(FRAME_COUNT);
    const prepareFrames = async (indexes: number[]) => {
      await runQueue(indexes, LOAD_CONCURRENCY, async (index) => {
        const source = frameSource(index);
        const controller = new AbortController();
        const fetchTimeout = window.setTimeout(
          () => controller.abort(),
          FRAME_FETCH_TIMEOUT,
        );

        try {
          const response = await fetch(source, {
            cache: "force-cache",
            signal: controller.signal,
          });
          if (!response.ok) throw new Error(`Frame ${index + 1} indisponível`);
          const objectUrl = URL.createObjectURL(await response.blob());
          objectUrls.push(objectUrl);
          sources[index] = objectUrl;
        } catch {
          sources[index] = source;
        } finally {
          window.clearTimeout(fetchTimeout);
        }
      });

      if (!active) return;

      await runQueue(indexes, DECODE_CONCURRENCY, async (index) => {
        const image = new window.Image();
        image.decoding = "async";
        frames[index] = image;

        await new Promise<void>((resolve) => {
          let settled = false;
          const finish = () => {
            if (settled) return;
            settled = true;
            window.clearTimeout(timeout);
            image.removeEventListener("load", finish);
            image.removeEventListener("error", finish);
            resolve();
          };
          const timeout = window.setTimeout(finish, IMAGE_LOAD_TIMEOUT);

          image.addEventListener("load", finish, { once: true });
          image.addEventListener("error", finish, { once: true });
          image.src = sources[index];

          if (image.complete) queueMicrotask(finish);
        });

        if (image.naturalWidth) {
          await Promise.race([
            image.decode().catch(() => undefined),
            new Promise<void>((resolve) =>
              window.setTimeout(resolve, IMAGE_DECODE_TIMEOUT),
            ),
          ]);
        }

        if (currentFrame === index) renderFrame(index);
      });
    };

    const setupScrollAnimation = () => {
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

            ScrollTrigger.create({
              trigger: heroSection,
              start: "top top",
              end: () => `+=${Math.round(window.innerHeight * 1.04)}`,
              invalidateOnRefresh: true,
              onUpdate: (self) =>
                renderFrame(self.progress * (FRAME_COUNT - 1)),
              onLeave: () => renderFrame(FRAME_COUNT - 1),
              onLeaveBack: () => renderFrame(0),
            });
          },
        );
      }, section);

      animationCleanup = () => {
        media.revert();
        animationContext.revert();
      };
    };

    const prepareExperience = async () => {
      await loadFonts();
      if (!active) return;
      const initialIndexes = Array.from(
        { length: INITIAL_FRAME_COUNT },
        (_, index) => index,
      );
      const deferredIndexes = Array.from(
        { length: FRAME_COUNT - INITIAL_FRAME_COUNT },
        (_, index) => index + INITIAL_FRAME_COUNT,
      );

      await prepareFrames(initialIndexes);
      if (!active) return;

      renderFrame(0);
      setIsReady(true);
      setupScrollAnimation();
      void prepareFrames(deferredIndexes);
    };

    void prepareExperience();

    return () => {
      active = false;
      resizeObserver.disconnect();
      animationCleanup?.();
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
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
            src={frameSource(0)}
            alt=""
            fill
            priority
            sizes="100vw"
            unoptimized
          />
          <canvas
            ref={canvasRef}
            className="artomos-hero-about-transition__canvas"
          />
          <div className="artomos-hero-about-transition__veil" />
          <div className="artomos-hero-about-transition__grain" />
        </div>
      </section>
  );
}

export default HeroToAboutTransition;
