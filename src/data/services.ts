export type ServiceIconKey =
  | "strategy"
  | "design"
  | "software"
  | "ai"
  | "mobile"
  | "cloud";

export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: ServiceIconKey;
}

export const services = [
  {
    id: "estrategia-de-produto",
    number: "01",
    title: "ESTRATÉGIA DE PRODUTO",
    description:
      "Definição de escopo, análise de oportunidades, priorização e planejamento técnico orientado aos objetivos do negócio.",
    icon: "strategy",
  },
  {
    id: "ux-ui-design",
    number: "02",
    title: "UX / UI DESIGN",
    description:
      "Interfaces claras, funcionais e consistentes, projetadas para reduzir atrito e fortalecer a experiência do usuário.",
    icon: "design",
  },
  {
    id: "software-sob-medida",
    number: "03",
    title: "SOFTWARE SOB MEDIDA",
    description:
      "Plataformas web, sistemas internos, APIs e ferramentas construídas de acordo com as necessidades da operação.",
    icon: "software",
  },
  {
    id: "ia-e-automacao",
    number: "04",
    title: "IA E AUTOMAÇÃO",
    description:
      "Agentes, RAG, automação de processos, análise de dados e integrações inteligentes aplicadas a problemas reais.",
    icon: "ai",
  },
  {
    id: "aplicativos-mobile",
    number: "05",
    title: "APLICATIVOS MOBILE",
    description:
      "Aplicações para Android, iOS e multiplataforma, com arquitetura modular, desempenho e manutenção previsível.",
    icon: "mobile",
  },
  {
    id: "cloud-e-devops",
    number: "06",
    title: "CLOUD E DEVOPS",
    description:
      "Infraestrutura, containers, observabilidade, pipelines de entrega e ambientes preparados para escalar.",
    icon: "cloud",
  },
] as const satisfies readonly Service[];
