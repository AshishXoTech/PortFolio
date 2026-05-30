import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ashish Kumar Jha — Full Stack Developer",
    template: "%s | Ashish Kumar Jha",
  },
  description:
    "Ashish Kumar Jha — Full Stack Developer building scalable web applications with Next.js, TypeScript, FastAPI, PostgreSQL, Docker, and AI.",
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
      "Ashish Kumar Jha — Full Stack Developer building scalable web applications with Next.js, TypeScript, FastAPI, PostgreSQL, Docker, and AI.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashish Kumar Jha — Full Stack Developer",
    description:
      "Ashish Kumar Jha — Full Stack Developer building scalable web applications with Next.js, TypeScript, FastAPI, PostgreSQL, Docker, and AI.",
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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
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
