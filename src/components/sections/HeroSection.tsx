"use client";

import { useLayoutEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";

import { siteConfig } from "@/config/site";
import { gsap } from "@/lib/gsap";
import {
  MagneticButton,
  OutlineButton,
  SectionLabel,
} from "@/components/ui";
import { Container } from "@/components/layout/Container";

function HeroTitleLine({ line }: { line: string }) {
  const { accentWord } = siteConfig.hero;
  const accentStart = line.indexOf(accentWord);

  if (accentStart === -1) {
    return <span data-hero-line>{line}</span>;
  }

  return (
    <span data-hero-line>
      {line.slice(0, accentStart)}
      <em>{accentWord}</em>
      {line.slice(accentStart + accentWord.length)}
    </span>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(
        {
          desktop: "(min-width: 1024px)",
          mobile: "(max-width: 1023px)",
          reducedMotion: "(prefers-reduced-motion: reduce)",
        },
        (matchContext) => {
          const { desktop, reducedMotion } = matchContext.conditions as {
            desktop: boolean;
            mobile: boolean;
            reducedMotion: boolean;
          };

          const revealTargets = [
            "[data-hero-eyebrow]",
            "[data-hero-line]",
            "[data-hero-description]",
            "[data-hero-actions]",
            "[data-hero-aside]",
            "[data-hero-capabilities]",
          ];

          if (reducedMotion) {
            gsap.set(revealTargets, { clearProps: "all" });
            return;
          }

          const header = document.querySelector<HTMLElement>(
            "[data-artomos-header]",
          );
          const artwork = section.querySelector<HTMLElement>(
            ".artomos-hero__artwork",
          );

          const entrance = gsap.timeline({
            defaults: { duration: 0.82, ease: "power3.out" },
          });

          if (header) {
            entrance.from(
              header,
              { autoAlpha: 0, y: -24, duration: 0.72 },
              0,
            );
          }

          if (artwork) {
            entrance.fromTo(
              artwork,
              { scale: 1.06 },
              { scale: 1, duration: 2.1, ease: "power2.out" },
              0,
            );
          }

          entrance
            .from(
              "[data-hero-eyebrow]",
              { autoAlpha: 0, y: 18 },
              0.18,
            )
            .from(
              "[data-hero-line]",
              {
                autoAlpha: 0,
                yPercent: 112,
                stagger: 0.12,
                duration: 1,
              },
              0.32,
            )
            .from(
              "[data-hero-description]",
              { autoAlpha: 0, y: 22 },
              0.78,
            )
            .from(
              "[data-hero-actions]",
              { autoAlpha: 0, y: 18 },
              0.94,
            )
            .from(
              "[data-hero-aside]",
              { autoAlpha: 0, x: desktop ? 24 : 0, y: desktop ? 0 : 20 },
              0.72,
            )
            .from(
              "[data-hero-capabilities]",
              { autoAlpha: 0, y: 16 },
              1.04,
            )
            .from(
              "[data-hero-decoration]",
              { autoAlpha: 0, scale: 0.9, stagger: 0.08 },
              0.52,
            );

          if (artwork) {
            gsap.to(artwork, {
              yPercent: desktop ? 7 : 3,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "bottom top",
                scrub: 0.8,
              },
            });
          }

          gsap.to(
            [
              ".artomos-hero__copy",
              "[data-hero-aside]",
              "[data-hero-capabilities]",
              ".artomos-hero__technical-rail",
            ],
            {
            y: desktop ? -92 : -44,
            autoAlpha: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom 28%",
              scrub: 0.8,
            },
            },
          );

          gsap.to("[data-hero-orbit]", {
            rotate: desktop ? 8 : 3,
            transformOrigin: "50% 50%",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
            },
          });
        },
      );
    }, section);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={siteConfig.hero.id}
      className="artomos-section artomos-hero"
      aria-labelledby="artomos-hero-title"
    >
      <div className="artomos-hero__scrim" aria-hidden="true" />
      <div className="artomos-hero__grid" aria-hidden="true" />

      <div
        className="artomos-hero__technical-rail"
        aria-hidden="true"
        data-hero-decoration
      >
        <span className="artomos-hero__rail-dots" />
        <span className="artomos-hero__rail-target" data-hero-orbit>
          <i />
        </span>
        <span className="artomos-hero__rail-line" />
        <ArrowDown size={18} strokeWidth={1.25} />
      </div>

      <Container className="artomos-hero__container">
        <div className="artomos-hero__layout">
          <div className="artomos-hero__copy">
            <div data-hero-eyebrow>
              <SectionLabel index="01">{siteConfig.hero.eyebrow}</SectionLabel>
            </div>

            <h1 id="artomos-hero-title" className="artomos-hero__title">
              {siteConfig.hero.titleLines.map((line) => (
                <span className="artomos-hero__title-mask" key={line}>
                  <HeroTitleLine line={line} />
                </span>
              ))}
            </h1>

            <p
              className="artomos-hero__description"
              data-hero-description
            >
              {siteConfig.hero.description}
            </p>

            <div className="artomos-hero__actions" data-hero-actions>
              <MagneticButton
                className="artomos-hero__primary-action"
                href={siteConfig.primaryCta.href}
              >
                {siteConfig.primaryCta.label}
              </MagneticButton>
              <OutlineButton href={siteConfig.secondaryCta.href}>
                {siteConfig.secondaryCta.label}
              </OutlineButton>
            </div>

            <a className="artomos-hero__explore" href="#servicos">
              <ArrowDown aria-hidden="true" size={17} strokeWidth={1.25} />
              <span>Role para explorar</span>
            </a>
          </div>

          <aside
            className="artomos-hero__aside"
            aria-labelledby="artomos-specialties-title"
            data-hero-aside
          >
            <h2 id="artomos-specialties-title">
              {siteConfig.hero.specialtiesLabel}
            </h2>
            <ul className="artomos-hero__specialties">
              {siteConfig.hero.specialties.map((specialty) => (
                <li key={specialty}>{specialty}</li>
              ))}
            </ul>

            <blockquote className="artomos-hero__statement">
              <span aria-hidden="true">+</span>
              <p>{siteConfig.hero.statement}</p>
            </blockquote>
          </aside>
        </div>

        <ul
          className="artomos-hero__capabilities"
          aria-label="Capacidades da Artomos"
          data-hero-capabilities
        >
          {siteConfig.hero.signals.map((signal, index) => (
            <li key={signal}>
              <span className="artomos-hero__capability-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{signal}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default HeroSection;
