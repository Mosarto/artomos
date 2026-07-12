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
const READY_EVENT = "artomos:experience-ready";

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
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preparedFrames, setPreparedFrames] = useState(0);
  const [loadingLabel, setLoadingLabel] = useState("Preparando tipografia");

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
    let releaseTimer: number | undefined;
    let animationCleanup: (() => void) | undefined;
    const frames = new Array<HTMLImageElement>(FRAME_COUNT);
    const objectUrls: string[] = [];
    const getFrameFocus = () => (window.innerWidth <= 767 ? 0.75 : 0.25);

    document.documentElement.classList.add("artomos-is-loading");

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

    const updateProgress = (value: number) => {
      if (!active) return;
      setProgress(Math.max(0, Math.min(100, Math.round(value))));
    };

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
    let preparedCount = 0;

    const prepareFrames = async (
      indexes: number[],
      showLoaderProgress: boolean,
    ) => {
      let downloaded = 0;

      if (showLoaderProgress) {
        setLoadingLabel("Preparando os primeiros quadros");
      }

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
          downloaded += 1;
          if (showLoaderProgress) {
            updateProgress(10 + (downloaded / indexes.length) * 45);
          }
        }
      });

      if (!active) return;
      if (showLoaderProgress) setLoadingLabel("Ajustando a sequência");

      let decoded = 0;
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

        decoded += 1;
        preparedCount += 1;
        if (active) setPreparedFrames(preparedCount);
        if (showLoaderProgress) {
          updateProgress(55 + (decoded / indexes.length) * 45);
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
      updateProgress(10);
      const initialIndexes = Array.from(
        { length: INITIAL_FRAME_COUNT },
        (_, index) => index,
      );
      const deferredIndexes = Array.from(
        { length: FRAME_COUNT - INITIAL_FRAME_COUNT },
        (_, index) => index + INITIAL_FRAME_COUNT,
      );

      await prepareFrames(initialIndexes, true);
      if (!active) return;

      renderFrame(0);
      setIsReady(true);
      setLoadingLabel("A experiência está pronta");
      updateProgress(100);
      setupScrollAnimation();

      releaseTimer = window.setTimeout(() => {
        if (!active) return;
        setLoaderComplete(true);
        document.documentElement.classList.remove("artomos-is-loading");
        window.dispatchEvent(new CustomEvent(READY_EVENT));

        releaseTimer = window.setTimeout(() => {
          if (active) setLoaderVisible(false);
        }, 850);
      }, 280);

      void prepareFrames(deferredIndexes, false);
    };

    void prepareExperience();

    return () => {
      active = false;
      document.documentElement.classList.remove("artomos-is-loading");
      if (releaseTimer !== undefined) window.clearTimeout(releaseTimer);
      resizeObserver.disconnect();
      animationCleanup?.();
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <>
      {loaderVisible ? (
        <div
          className={`artomos-loader${loaderComplete ? " is-complete" : ""}`}
          role="status"
          aria-live="polite"
          aria-label={`${loadingLabel}: ${progress}%`}
        >
          <div className="artomos-loader__frame" aria-hidden="true">
            <span className="artomos-loader__corner artomos-loader__corner--top" />
            <span className="artomos-loader__corner artomos-loader__corner--bottom" />
          </div>

          <div className="artomos-loader__content">
            <div className="artomos-loader__brand" aria-hidden="true">
              <span className="artomos-loader__brand-mark">
                <i />
                <i />
                <i />
                <i />
              </span>
              <span>Artomos</span>
            </div>

            <div className="artomos-loader__edition" aria-hidden="true">
              <span>01</span>
              <i />
              <span>92</span>
            </div>

            <div className="artomos-loader__headline" aria-hidden="true">
              <span>Construindo</span>
              <strong>a experiência.</strong>
            </div>

            <svg
              className="artomos-loader__trace"
              viewBox="0 0 420 76"
              focusable="false"
              aria-hidden="true"
            >
              <path className="artomos-loader__trace-base" d="M14 58H406" />
              <path
                className="artomos-loader__trace-signal"
                d="M14 58 76 39 132 53 194 17 247 46 315 28 406 52"
              />
              <path className="artomos-loader__trace-scan" d="M14 58 76 39 132 53 194 17" />
              <circle className="artomos-loader__trace-node artomos-loader__trace-node--1" cx="14" cy="58" r="3" />
              <circle className="artomos-loader__trace-node artomos-loader__trace-node--2" cx="76" cy="39" r="4" />
              <circle className="artomos-loader__trace-node artomos-loader__trace-node--3" cx="132" cy="53" r="3" />
              <circle className="artomos-loader__trace-node artomos-loader__trace-node--4" cx="194" cy="17" r="5" />
              <circle className="artomos-loader__trace-node artomos-loader__trace-node--5" cx="247" cy="46" r="3" />
              <circle className="artomos-loader__trace-node artomos-loader__trace-node--6" cx="315" cy="28" r="4" />
              <circle className="artomos-loader__trace-node artomos-loader__trace-node--7" cx="406" cy="52" r="3" />
            </svg>

            <div className="artomos-loader__meta">
              <span>{loadingLabel}</span>
              <strong>
                {String(preparedFrames).padStart(2, "0")}
                <small>/92</small>
              </strong>
            </div>
            <div className="artomos-loader__progress" aria-hidden="true">
              <span style={{ transform: `scaleX(${progress / 100})` }} />
            </div>
            <p className="artomos-loader__sequence" aria-hidden="true">
              ARTOMOS® &nbsp;·&nbsp; DESIGN &amp; ENGENHARIA DIGITAL
            </p>
          </div>
        </div>
      ) : null}

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
    </>
  );
}

export default HeroToAboutTransition;
