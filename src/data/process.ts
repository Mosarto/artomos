export type ProcessIconKey = "discover" | "design" | "build" | "evolve";

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: ProcessIconKey;
}

export const processSteps = [
  {
    id: "descobrir",
    number: "01",
    title: "DESCOBRIR",
    description:
      "Entendemos o negócio, o usuário, o problema e as restrições antes de propor uma solução.",
    icon: "discover",
  },
  {
    id: "projetar",
    number: "02",
    title: "PROJETAR",
    description:
      "Definimos experiência, arquitetura, fluxos, prioridades e critérios de sucesso.",
    icon: "design",
  },
  {
    id: "construir",
    number: "03",
    title: "CONSTRUIR",
    description:
      "Desenvolvemos o produto com qualidade técnica, entregas incrementais e comunicação transparente.",
    icon: "build",
  },
  {
    id: "evoluir",
    number: "04",
    title: "EVOLUIR",
    description:
      "Monitoramos, medimos, corrigimos e expandimos o produto de acordo com o uso e os objetivos do negócio.",
    icon: "evolve",
  },
] as const satisfies readonly ProcessStep[];
