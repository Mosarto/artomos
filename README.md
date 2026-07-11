# Artomos

Site institucional da Artomos, uma software house focada em produtos digitais, plataformas web, aplicativos, automação e inteligência artificial aplicada.

O projeto combina uma direção visual editorial com uma transição animada entre a abertura e a seção Sobre, usando frames AVIF em `public/assets/artomos/transitions/1_2`.

## Stack

- Vinext / Next.js
- React 19
- GSAP + ScrollTrigger
- Lenis para smooth scroll
- CSS global em `app/globals.css`
- Assets públicos em `public/assets/artomos`

## Requisitos

- Node.js `22.x` LTS (`>=22.13.0 <24`)
- npm

Use a versao indicada em `.nvmrc` quando possivel. O Node 24 no Windows pode encerrar o `vinext build` com uma assert nativa depois de concluir a geracao.

## Rodando localmente

```bash
npm install
npm run dev
```

Depois abra `http://localhost:3000`.

## Validação

```bash
npm run lint
npm test
```

`npm test` executa o build de produção e valida o HTML renderizado.

## Estrutura

```text
app/
  layout.tsx        Metadata, fontes locais e casca global
  page.tsx          Composição principal da landing page

src/
  components/       Seções, layout e componentes visuais
  config/site.ts    Conteúdo institucional e caminhos de mídia
  data/             Dados de serviços, cases e processo
  lib/              Utilitários de animação e helpers

public/
  assets/artomos/   Imagens, backgrounds e frames da transição
  fonts/            Fontes locais usadas pelo CSS
```

## Assets

- `public/assets/artomos/bc_*.png`: imagens base das seções.
- `public/assets/artomos/transitions/1_2/*.avif`: sequência da transição hero/sobre.
- `public/fonts/*.woff2`: fontes locais para evitar carregamento externo ou caminhos gerados.

## Deploy

O projeto está preparado para build com Vinext:

```bash
npm run build
```

As configurações de hosting ficam em `.openai/hosting.json`. O projeto não usa banco, migrations, exemplos D1 ou autenticação opcional do starter.
