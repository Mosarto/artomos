"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

import { siteConfig } from "@/config/site";

import { Container } from "./Container";
import { BrandMark } from "./BrandMark";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuDialogRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback((restoreFocus = false) => {
    setIsMenuOpen(false);

    if (restoreFocus) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 24);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) setIsMenuOpen(false);
    };

    desktopQuery.addEventListener("change", closeOnDesktop);

    return () => desktopQuery.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const dialog = menuDialogRef.current;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      dialog
        ?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
        ?.focus({ preventScroll: true });
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
        return;
      }

      if (event.key !== "Tab" || !dialog) return;

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, isMenuOpen]);

  return (
    <>
      <a className="artomos-skip-link" href="#conteudo-principal">
        Ir para o conteúdo principal
      </a>

      <header
        className={[
          "artomos-header",
          isScrolled ? "artomos-header--scrolled" : "",
          isMenuOpen ? "artomos-header--menu-open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        data-artomos-header
        data-site-header
        data-scrolled={isScrolled ? "true" : "false"}
      >
        <Container className="artomos-header__inner">
          <a
            className="artomos-header__brand"
            href="#inicio"
            aria-label="Artomos — voltar ao início"
            onClick={() => closeMenu()}
          >
            <BrandMark />
            <span className="artomos-header__wordmark">Artomos</span>
          </a>

          <nav className="artomos-header__desktop-nav" aria-label="Navegação principal">
            <ul className="artomos-header__nav-list">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <a className="artomos-header__nav-link" href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="artomos-header__actions">
            <a
              className="artomos-header__project-link"
              href={siteConfig.primaryCta.href}
            >
              <span>{siteConfig.primaryCta.label}</span>
              <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.5} />
            </a>

            <button
              ref={menuButtonRef}
              className="artomos-header__menu-button"
              type="button"
              aria-controls="artomos-mobile-menu"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Fechar menu principal" : "Abrir menu principal"}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? (
                <X aria-hidden="true" size={24} strokeWidth={1.4} />
              ) : (
                <Menu aria-hidden="true" size={24} strokeWidth={1.4} />
              )}
            </button>
          </div>
        </Container>
      </header>

      <div
        ref={menuDialogRef}
        id="artomos-mobile-menu"
        className="artomos-mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
        hidden={!isMenuOpen}
      >
        <div className="artomos-mobile-menu__decoration" aria-hidden="true">
          <span />
          <span />
        </div>

        <Container className="artomos-mobile-menu__inner">
          <button
            className="artomos-mobile-menu__close"
            type="button"
            onClick={() => closeMenu(true)}
          >
            <span>Fechar</span>
            <X aria-hidden="true" size={22} strokeWidth={1.4} />
          </button>

          <nav aria-label="Navegação principal no celular">
            <ol className="artomos-mobile-menu__links">
              {siteConfig.navigation.map((item, index) => (
                <li key={item.href}>
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <a href={item.href} onClick={() => closeMenu()}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="artomos-mobile-menu__footer">
            <p>{siteConfig.availability}</p>
            <a href={siteConfig.primaryCta.href} onClick={() => closeMenu()}>
              <span>{siteConfig.primaryCta.label}</span>
              <ArrowUpRight aria-hidden="true" size={19} strokeWidth={1.4} />
            </a>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Header;
