export interface CaseStudy {
  id: string;
  number: string;
  name: string;
  category: string;
  description: string;
  technologies: readonly string[];
  highlights: readonly string[];
  image?: string;
  imageAlt?: string;
  disclosure: string;
}

export const cases = [
  {
    id: "aether",
    number: "01",
    name: "AETHER",
    category: "PLATAFORMA DE IA E CONHECIMENTO",
    description:
      "Aplicação multiplataforma com chat inteligente, recuperação de contexto, busca vetorial e arquitetura preparada para integrar diferentes ferramentas e fontes de conhecimento.",
    technologies: [
      "Flutter",
      "Python",
      "PostgreSQL",
      "Qdrant",
      "Docker",
      "RAG",
    ],
    highlights: ["Arquitetura escalável", "Contexto centralizado"],
    image: "/assets/aether.avif",
    imageAlt: "Interface do projeto Aether",
    disclosure: "Projeto entregue · Visual demonstrativo",
  },
  {
    id: "ecossistema-mobile-white-label",
    number: "02",
    name: "ECOSSISTEMA MOBILE WHITE-LABEL",
    category: "APLICATIVOS E COMÉRCIO DIGITAL",
    description:
      "Estrutura multiplataforma preparada para atender diferentes operações, marcas e configurações sem duplicação desnecessária de código.",
    technologies: ["Flutter", "REST API", "Firebase", "BLoC", "Analytics"],
    highlights: ["Experiência multiplataforma", "Arquitetura escalável"],
    image: "/assets/case-mobile-white-label.avif",
    imageAlt: "Exemplo visual de um ecossistema mobile white-label",
    disclosure: "Projeto privado · Visual demonstrativo",
  },
  {
    id: "automacao-conversacional",
    number: "03",
    name: "AUTOMAÇÃO CONVERSACIONAL",
    category: "IA APLICADA À OPERAÇÃO",
    description:
      "Sistema para organizar grandes volumes de conversas, gerar relatórios, consultar informações por contexto e apoiar decisões operacionais.",
    technologies: ["Python", "LLM", "RAG", "APIs", "Bancos vetoriais"],
    highlights: ["Automação de processos", "Contexto centralizado"],
    image: "/assets/case-automacao-conversacional.avif",
    imageAlt: "Exemplo visual de uma plataforma de automação conversacional",
    disclosure: "Projeto privado · Visual demonstrativo",
  },
] as const satisfies readonly CaseStudy[];
