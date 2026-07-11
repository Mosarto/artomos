"use client";

import { ArrowUpRight, Globe2, Mail, Radio } from "lucide-react";
import {
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { siteConfig } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { BackgroundArtwork } from "@/components/ui/BackgroundArtwork";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { ProcessCard } from "@/components/ui/ProcessCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TechnicalDecoration } from "@/components/ui/TechnicalDecoration";
import { processSteps } from "@/data/process";
import { gsap } from "@/lib/gsap";

type ContactField = "name" | "email" | "company" | "projectType" | "message";
type ContactErrors = Partial<Record<ContactField, string>>;
type FormFeedback = {
  kind: "idle" | "error" | "validated";
  message: string;
};
type MotionConditions = {
  desktop?: boolean;
  mobile?: boolean;
  reduced?: boolean;
};

const initialFeedback: FormFeedback = { kind: "idle", message: "" };

function readFormValue(formData: FormData, field: ContactField): string {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function validateContactForm(form: HTMLFormElement): ContactErrors {
  const formData = new FormData(form);
  const errors: ContactErrors = {};
  const name = readFormValue(formData, "name");
  const email = readFormValue(formData, "email");
  const projectType = readFormValue(formData, "projectType");
  const message = readFormValue(formData, "message");

  if (name.length < 2) {
    errors.name = "Informe seu nome com pelo menos 2 caracteres.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Informe um e-mail válido.";
  }

  if (!projectType) {
    errors.projectType = "Selecione o tipo de projeto.";
  }

  if (message.length < 10) {
    errors.message = "Conte um pouco mais sobre o projeto (mínimo de 10 caracteres).";
  }

  return errors;
}

export function ProcessContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [feedback, setFeedback] = useState<FormFeedback>(initialFeedback);

  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const matchMedia = gsap.matchMedia();
    const select = gsap.utils.selector(section);
    const context = gsap.context(() => {
      matchMedia.add(
        {
          desktop:
            "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          mobile:
            "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (mediaContext) => {
          const { desktop, reduced } =
            mediaContext.conditions as MotionConditions;
          const label = select(".artomos-process__label");
          const processHeader = select(".artomos-process__header")[0];
          const titleLines = select(".artomos-process__title-line");
          const subtitle = select(".artomos-process__subtitle");
          const cards = select(".artomos-process__card");
          const contact = select(".artomos-contact");
          const contactContent = select(".artomos-contact__content > *");
          const artworkImage = select(".artomos-process-contact__artwork-image");
          const decoration = select(".artomos-process-contact__decoration");

          if (reduced) {
            gsap.set(
              [
                ...label,
                ...titleLines,
                ...subtitle,
                ...cards,
                ...contact,
                ...contactContent,
                ...artworkImage,
                ...decoration,
              ],
              { clearProps: "all" },
            );
            return;
          }

          gsap
            .timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: {
                trigger: processHeader,
                start: desktop ? "top 74%" : "top 86%",
                once: true,
              },
            })
            .from(label, { autoAlpha: 0, y: 18, duration: 0.5 })
            .from(
              titleLines,
              {
                autoAlpha: 0,
                yPercent: desktop ? 105 : 55,
                duration: desktop ? 0.85 : 0.7,
                stagger: 0.09,
              },
              "-=0.25",
            )
            .from(
              subtitle,
              { autoAlpha: 0, y: 22, duration: 0.55 },
              "-=0.35",
            )
            .from(
              cards,
              {
                autoAlpha: 0,
                y: desktop ? 56 : 30,
                duration: desktop ? 0.78 : 0.62,
                stagger: desktop ? 0.12 : 0.09,
              },
              "-=0.18",
            );

          gsap
            .timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: {
                trigger: contact[0],
                start: desktop ? "top 76%" : "top 88%",
                once: true,
              },
            })
            .from(contact, {
              autoAlpha: 0,
              x: desktop ? 48 : 0,
              y: desktop ? 0 : 30,
              duration: 0.78,
            })
            .from(
              contactContent,
              {
                autoAlpha: 0,
                y: 20,
                duration: 0.5,
                stagger: 0.07,
              },
              "-=0.4",
            );

          gsap.fromTo(
            artworkImage,
            { scale: 1.045, yPercent: -2 },
            {
              scale: 1,
              yPercent: desktop ? 8 : 3,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: desktop ? 1 : 0.5,
              },
            },
          );

          if (desktop) {
            gsap.to(decoration, {
              rotate: -14,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            });
          }
        },
      );
    }, section);

    return () => {
      matchMedia.revert();
      context.revert();
    };
  }, []);

  const clearFieldError = (field: ContactField) => {
    if (!errors[field] && feedback.kind === "idle") {
      return;
    }

    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
    setFeedback(initialFeedback);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const validationErrors = validateContactForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFeedback({
        kind: "error",
        message: "Revise os campos indicados antes de continuar.",
      });

      requestAnimationFrame(() => {
        form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      });
      return;
    }

    setErrors({});

    // Integração intencionalmente pendente: conecte aqui Resend, Formspree,
    // uma API própria ou uma Server Action. Não há simulação de envio.
    setFeedback({
      kind: "validated",
      message:
        "Dados validados. O envio ainda não está conectado; fale conosco pelo e-mail abaixo.",
    });
  };

  return (
    <section
      ref={sectionRef}
      id={siteConfig.process.id}
      className="artomos-section artomos-process-contact"
      aria-labelledby="artomos-process-title"
    >
      <BackgroundArtwork
        src={siteConfig.artwork.process}
        className="artomos-process-contact__artwork"
        imageClassName="artomos-process-contact__artwork-image"
        objectPosition="76% center"
        sizes="100vw"
      />
      <TechnicalDecoration
        variant="diagonals"
        className="artomos-process-contact__decoration"
      />
      <TechnicalDecoration
        variant="ticks"
        className="artomos-process-contact__ticks"
        label="04 / PROCESSO"
      />

      <Container className="artomos-process-contact__container">
        <div className="artomos-process-contact__layout">
          <div className="artomos-process">
            <header className="artomos-process__header">
              <SectionLabel index="04" className="artomos-process__label">
                {siteConfig.process.eyebrow}
              </SectionLabel>
              <h2 id="artomos-process-title" className="artomos-process__title">
                {siteConfig.process.titleLines.map((line) => (
                  <span className="artomos-process__title-mask" key={line}>
                    <span className="artomos-process__title-line">{line}</span>
                  </span>
                ))}
              </h2>
              <p className="artomos-process__subtitle">
                {siteConfig.process.subtitle}
              </p>
            </header>

            <div className="artomos-process__grid">
              {processSteps.map((step, index) => (
                <ProcessCard
                  className="artomos-process__card"
                  isLast={index === processSteps.length - 1}
                  key={step.id}
                  step={step}
                />
              ))}
            </div>
          </div>

          <aside
            id={siteConfig.contact.id}
            className="artomos-contact"
            aria-labelledby="artomos-contact-title"
          >
            <div className="artomos-contact__content">
              <SectionLabel className="artomos-contact__label">
                {siteConfig.contact.eyebrow}
              </SectionLabel>
              <h2 id="artomos-contact-title" className="artomos-contact__title">
                {siteConfig.contact.titleLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <p className="artomos-contact__description">
                {siteConfig.contact.description}
              </p>

              <div className="artomos-contact__actions">
                <MagneticButton href={siteConfig.contact.actions[0].href}>
                  {siteConfig.contact.actions[0].label}
                </MagneticButton>
                <OutlineButton href={siteConfig.contact.actions[1].href}>
                  {siteConfig.contact.actions[1].label}
                </OutlineButton>
              </div>

              <ul className="artomos-contact__details" aria-label="Informações de contato">
                <li>
                  <Mail aria-hidden="true" size={18} strokeWidth={1.3} />
                  <a href={siteConfig.contact.emailHref}>
                    {siteConfig.contact.email}
                  </a>
                </li>
                <li>
                  <Radio aria-hidden="true" size={18} strokeWidth={1.3} />
                  <span>{siteConfig.contact.serviceMode}</span>
                </li>
                <li>
                  <Globe2 aria-hidden="true" size={18} strokeWidth={1.3} />
                  <span>{siteConfig.contact.reach}</span>
                </li>
              </ul>
            </div>

            <form
              className="artomos-contact-form"
              noValidate
              onSubmit={handleSubmit}
              aria-label="Formulário de contato"
            >
              <div className="artomos-contact-form__field">
                <label htmlFor="contact-name">Nome</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  minLength={2}
                  required
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                  onChange={() => clearFieldError("name")}
                />
                {errors.name ? (
                  <span id="contact-name-error" className="artomos-contact-form__error">
                    {errors.name}
                  </span>
                ) : null}
              </div>

              <div className="artomos-contact-form__field">
                <label htmlFor="contact-email">E-mail</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                  onChange={() => clearFieldError("email")}
                />
                {errors.email ? (
                  <span id="contact-email-error" className="artomos-contact-form__error">
                    {errors.email}
                  </span>
                ) : null}
              </div>

              <div className="artomos-contact-form__field">
                <label htmlFor="contact-company">Empresa</label>
                <input
                  id="contact-company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  onChange={() => clearFieldError("company")}
                />
              </div>

              <div className="artomos-contact-form__field">
                <label htmlFor="contact-project-type">Tipo de projeto</label>
                <select
                  id="contact-project-type"
                  name="projectType"
                  defaultValue=""
                  required
                  aria-invalid={Boolean(errors.projectType)}
                  aria-describedby={
                    errors.projectType ? "contact-project-type-error" : undefined
                  }
                  onChange={() => clearFieldError("projectType")}
                >
                  <option value="" disabled>
                    Selecione uma opção
                  </option>
                  <option value="software-sob-medida">Software sob medida</option>
                  <option value="aplicativo-mobile">Aplicativo mobile</option>
                  <option value="plataforma-web">Plataforma web</option>
                  <option value="ia-automacao">IA e automação</option>
                  <option value="estrategia-design">Estratégia e design</option>
                  <option value="outro">Outro</option>
                </select>
                {errors.projectType ? (
                  <span
                    id="contact-project-type-error"
                    className="artomos-contact-form__error"
                  >
                    {errors.projectType}
                  </span>
                ) : null}
              </div>

              <div className="artomos-contact-form__field artomos-contact-form__field--wide">
                <label htmlFor="contact-message">Mensagem</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  minLength={10}
                  required
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? "contact-message-error" : undefined
                  }
                  onChange={() => clearFieldError("message")}
                />
                {errors.message ? (
                  <span id="contact-message-error" className="artomos-contact-form__error">
                    {errors.message}
                  </span>
                ) : null}
              </div>

              <div className="artomos-contact-form__footer">
                <button
                  type="submit"
                  className="artomos-button artomos-button--primary artomos-contact-form__submit"
                >
                  <span>VALIDAR DADOS</span>
                  <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.5} />
                </button>
                <p
                  className={`artomos-contact-form__feedback artomos-contact-form__feedback--${feedback.kind}`}
                  role={feedback.kind === "error" ? "alert" : "status"}
                  aria-live="polite"
                >
                  {feedback.message}
                </p>
              </div>
            </form>
          </aside>
        </div>
      </Container>
    </section>
  );
}

export default ProcessContactSection;
