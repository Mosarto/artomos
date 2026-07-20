import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "Artomos — Software, Aplicativos e Inteligência Artificial";
const description =
  "A Artomos cria software sob medida, aplicativos, plataformas web, automações e soluções com inteligência artificial para empresas que precisam transformar ideias em produtos digitais.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title,
    description,
    alternates: { canonical: "/" },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: "/",
      siteName: "Artomos",
      title,
      description,
      images: [
        {
          url: "/og.png",
          width: 1731,
          height: 909,
          alt: "Artomos — arte, engenharia e inteligência artificial",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="preload"
          href="/fonts/cormorant-garamond-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/manrope-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/ibm-plex-mono-400-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
