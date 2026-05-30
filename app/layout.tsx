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
    default: "AshishOS — Ashish Kumar Jha",
    template: "%s | AshishOS",
  },
  description:
    "AshishOS — A simulated operating system portfolio by Ashish Kumar Jha, Full Stack Developer specializing in MERN, Next.js, TypeScript, and FastAPI.",
  keywords: [
    "Ashish Kumar Jha",
    "Full Stack Developer",
    "Next.js",
    "MERN",
    "Portfolio",
    "AshishOS",
  ],
  authors: [{ name: "Ashish Kumar Jha", url: "https://github.com/AshishXoTech" }],
  openGraph: {
    title: "AshishOS — Ashish Kumar Jha",
    description: "Interactive OS-themed developer portfolio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AshishOS — Ashish Kumar Jha",
    description: "Interactive OS-themed developer portfolio",
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
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
