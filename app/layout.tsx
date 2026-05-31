import type { Metadata } from "next";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-700.css";
import "@fontsource/syne/latin-400.css";
import "@fontsource/syne/latin-600.css";
import "@fontsource/syne/latin-700.css";
import "@fontsource/syne/latin-800.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ashish Kumar Jha — Full Stack Developer",
    template: "%s | Ashish Kumar Jha",
  },
  description:
    "Ashish Kumar Jha is a full-stack developer building Next.js, TypeScript, FastAPI, Docker, PostgreSQL, Redis, and AI systems.",
  keywords: [
    "Ashish Kumar Jha",
    "Full Stack Developer",
    "Next.js",
    "TypeScript",
    "FastAPI",
    "PostgreSQL",
    "Docker",
    "AI",
    "Portfolio",
    "AshishOS",
  ],
  authors: [{ name: "Ashish Kumar Jha", url: "https://github.com/AshishXoTech" }],
  openGraph: {
    title: "Ashish Kumar Jha — Full Stack Developer",
    description:
      "Ashish Kumar Jha is a full-stack developer building Next.js, TypeScript, FastAPI, Docker, PostgreSQL, Redis, and AI systems.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashish Kumar Jha — Full Stack Developer",
    description:
      "Ashish Kumar Jha is a full-stack developer building Next.js, TypeScript, FastAPI, Docker, PostgreSQL, Redis, and AI systems.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/JetBrainsMono.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
