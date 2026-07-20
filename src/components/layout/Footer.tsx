import { ArrowUpRight } from "lucide-react";

import { siteConfig } from "@/config/site";

import { Container } from "./Container";
import { BrandMark } from "./BrandMark";

function FooterBrand() {
  return (
    <a
      className="artomos-footer__brand"
      href="#inicio"
      aria-label="Artomos — voltar ao início"
    >
      <BrandMark />
      <span className="artomos-footer__wordmark">Artomos</span>
    </a>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const hasConfiguredSocialLink = siteConfig.socialLinks.some(
    (link) => link.href,
  );

  return (
    <footer className="artomos-footer">
      <Container className="artomos-footer__container">
        <div className="artomos-footer__primary">
          <div className="artomos-footer__identity">
            <FooterBrand />
            <p>{siteConfig.footer.phrase}</p>
          </div>

          <nav className="artomos-footer__navigation" aria-label="Navegação do rodapé">
            <ul>
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="artomos-footer__contact">
            <span>Contato</span>
            <a href={siteConfig.contact.emailHref}>
              {siteConfig.contact.email}
            </a>
            <p>{siteConfig.contact.serviceMode}</p>
          </div>

          <div className="artomos-footer__availability">
            <span className="artomos-footer__status-dot" aria-hidden="true" />
            <span>{siteConfig.availability}</span>
          </div>

          <a
            className="artomos-footer__cta"
            href={siteConfig.primaryCta.href}
          >
            <span>{siteConfig.primaryCta.label}</span>
            <ArrowUpRight aria-hidden="true" size={19} strokeWidth={1.35} />
          </a>
        </div>

        <div className="artomos-footer__secondary">
          <p>
            © {currentYear} {siteConfig.name}. Todos os direitos reservados.
          </p>

          {hasConfiguredSocialLink ? (
            <nav aria-label="Redes sociais">
              <ul className="artomos-footer__social-links">
                {siteConfig.socialLinks.map((link) =>
                  link.href ? (
                    <li key={link.label}>
                      <a href={link.href} rel="noreferrer" target="_blank">
                        {link.label}
                      </a>
                    </li>
                  ) : null,
                )}
              </ul>
            </nav>
          ) : null}

          <nav aria-label="Informações legais">
            <ul className="artomos-footer__legal-links">
              {siteConfig.footer.legalLinks.map((link) => (
                <li key={link.label}>
                  {link.href === "#" ? (
                    <span>{link.label}</span>
                  ) : (
                    <a href={link.href}>{link.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
