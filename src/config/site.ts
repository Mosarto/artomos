export interface SocialLink {
  label: "LinkedIn" | "GitHub" | "Instagram";
  href: string | null;
}

export const siteConfig = {
  name: "Artomos",
  url: "https://artomos.com",
  locale: "pt-BR",
  metadata: {
    title: "Artomos — Software, Aplicativos e Inteligência Artificial",
    description:
      "A Artomos é uma software house full stack que cria software sob medida, plataformas web, aplicativos mobile, automações e soluções com inteligência artificial.",
    canonicalPath: "/",
  },
  navigation: [
    { label: "Serviços", href: "#servicos" },
    { label: "Projetos", href: "#projetos" },
    { label: "Processo", href: "#processo" },
    { label: "Sobre", href: "#sobre" },
    { label: "Contato", href: "#contato" },
  ],
  primaryCta: { label: "INICIAR UM PROJETO", href: "#contato" },
  secondaryCta: { label: "VER PROJETOS", href: "#projetos" },
  hero: {
    id: "inicio",
    eyebrow: "SOFTWARE HOUSE • IA APLICADA • PRODUTOS DIGITAIS",
    titleLines: ["CRIAMOS", "O QUE AINDA", "NÃO EXISTE"],
    accentWord: "AINDA",
    description:
      "A Artomos transforma ideias complexas em produtos digitais claros, escaláveis e preparados para evoluir. Unimos estratégia, design, engenharia de software e inteligência artificial em uma única operação.",
    specialtiesLabel: "ESPECIALIDADES",
    specialties: [
      "Estratégia de produto",
      "Software sob medida",
      "Inteligência artificial",
      "Aplicativos mobile",
      "Plataformas web",
      "Cloud e DevOps",
    ],
    statement: "INTELIGÊNCIA É A NOVA INTERFACE.",
    signals: [
      "Projetos web e mobile",
      "Soluções com IA aplicada",
      "Arquitetura escalável",
      "Disponível para novos projetos",
    ],
  },
  about: {
    id: "sobre",
    eyebrow: "SOBRE A ARTOMOS",
    titleLines: ["ARTE +", "ENGENHARIA"],
    subtitle: "ONDE VISÃO SE TRANSFORMA EM SISTEMA",
    description:
      "A Artomos é uma software house que combina estratégia, design, engenharia e inteligência artificial para construir produtos digitais úteis, elegantes e sustentáveis. Trabalhamos desde a definição do problema até a evolução do produto em produção.",
    manifesto: [
      "ESTRATÉGIA. DESIGN. ENGENHARIA. IA.",
      "UMA ABORDAGEM INTEGRADA.",
    ],
  },
  cases: {
    id: "projetos",
    eyebrow: "PROJETOS SELECIONADOS",
    titleLines: ["TRABALHOS", "QUE GERAM", "MOVIMENTO"],
    description:
      "Tecnologia com propósito, decisões técnicas conscientes e produtos preparados para evoluir.",
    imagePlaceholder: "IMAGEM DO PROJETO",
  },
  process: {
    id: "processo",
    eyebrow: "COMO TRABALHAMOS",
    titleLines: ["VAMOS CONSTRUIR", "O QUE VEM", "DEPOIS"],
    subtitle:
      "UM CAMINHO CLARO. UMA CONSTRUÇÃO COLABORATIVA. RESULTADOS MENSURÁVEIS.",
  },
  contact: {
    id: "contato",
    eyebrow: "VAMOS CONVERSAR",
    titleLines: ["VAMOS CRIAR", "SEU PRÓXIMO", "PRODUTO?"],
    description:
      "Se você possui uma ideia, um processo manual ou um sistema que precisa evoluir, a Artomos pode ajudar a definir e construir o próximo passo.",
    email: "contato@artomos.com",
    emailHref: "mailto:contato@artomos.com",
    serviceMode: "Atendimento remoto",
    reach: "Brasil e projetos internacionais",
    actions: [
      { label: "INICIAR UM PROJETO", href: "#formulario-contato" },
      {
        label: "AGENDAR CONVERSA",
        href: "mailto:contato@artomos.com?subject=Agendar%20uma%20conversa%20com%20a%20Artomos&body=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20conversa.%0A%0AMelhores%20dias%20e%20hor%C3%A1rios%3A%0A",
      },
    ],
  },
  footer: {
    phrase: "ESTRATÉGIA. DESIGN. ENGENHARIA. EVOLUÇÃO.",
    legalLinks: [
      { label: "Política de privacidade", href: "#" },
      { label: "Termos", href: "#" },
    ],
  },
  availability: "DISPONÍVEL PARA NOVOS PROJETOS",
  socialLinks: [
    { label: "LinkedIn", href: null },
    { label: "GitHub", href: null },
    { label: "Instagram", href: null },
  ] as readonly SocialLink[],
  artwork: {
    hero: "/assets/artomos/bc_1.png",
    about: "/assets/artomos/bc_2.png",
    cases: "/assets/artomos/bc_3.png",
    process: "/assets/artomos/bc_4.png",
  },
} as const;
