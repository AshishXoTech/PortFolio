"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

interface SocialLinkProps {
  href: string;
  label: string;
  icon: JSX.Element;
}

function SocialLink({ href, label, icon }: SocialLinkProps): JSX.Element {
  return (
    <motion.a
      variants={itemVariants}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2 rounded-md px-2 py-1.5 font-mono text-[11px] text-[#888888] transition-all duration-200 hover:translate-x-0.5 hover:text-[#00ff41] hover:shadow-[0_0_12px_rgba(0,255,65,0.25)]"
    >
      <span className="text-[#00ff41] transition-colors group-hover:text-[#00ff41]">
        {icon}
      </span>
      {label}
    </motion.a>
  );
}

function SectionHeader({ children }: { children: string }): JSX.Element {
  return (
    <motion.h3
      variants={itemVariants}
      className="mb-3 font-mono text-xs text-[#00ff41]"
    >
      {children}
    </motion.h3>
  );
}

const ABOUT_AS_CODE = `// Name: Ashish Kumar Jha
// Role: Full Stack Developer
// Location: Jaipur, Rajasthan, India
// Education: B.Tech CSE, University of Engineering & Management, Jaipur
// Batch: 2024-2028
// CGPA: 8.0 / 10.0

const ashish = {
  skills: [
    "MERN",
    "Next.js 14",
    "TypeScript",
    "Node.js",
    "FastAPI",
    "PostgreSQL",
    "Redis",
    "Docker",
    "Prisma ORM",
    "JWT",
    "OpenAI API",
  ],
  currentlyLearning: ["Java", "DSA", "System Design"],
  goals: [
    "Get stronger at fundamentals",
    "Build production-grade full-stack systems",
    "Earn a Software Engineer role through real work",
  ],
  funFact:
    "Most of my best debugging progress has happened after I admitted I had no idea what was going on.",
};`;

export function AboutApp(): JSX.Element {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="rounded-lg bg-[rgba(12,12,12,0.88)] p-7 backdrop-blur-[14px]"
    >
      <div className="flex flex-col gap-8 md:flex-row md:gap-10">
        {/* Left column */}
        <motion.aside
          variants={itemVariants}
          className="mx-auto flex w-full shrink-0 flex-col items-center md:mx-0 md:w-[240px] md:items-stretch"
        >
          <div className="relative mx-auto h-[176px] w-[176px]">
            <div
              className="about-photo-ring-1 pointer-events-none absolute inset-0 rounded-full border-2 border-[#00ff41] opacity-60"
              aria-hidden="true"
            />
            <div
              className="about-photo-ring-2 pointer-events-none absolute inset-2 rounded-full border border-[#7c3aed] opacity-40"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-x-2 top-2 bottom-2 rounded-full border border-dashed border-[#00ff41] opacity-20"
              aria-hidden="true"
            />
            <div className="absolute inset-[8px] overflow-hidden rounded-full">
              <Image
                src="/images/avatar.jpg"
                alt="Ashish Kumar Jha"
                width={160}
                height={160}
                className="h-40 w-40 object-cover"
                priority
                unoptimized
              />
            </div>
          </div>

          <motion.h2
            variants={itemVariants}
            className="mt-5 text-center font-sans text-base font-bold text-[#e0e0e0] md:text-left"
          >
            Ashish Kumar Jha
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-1 text-center font-mono text-[11px] text-[#888888] md:text-left"
          >
            Full Stack Developer
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-3 flex items-center justify-center gap-2 md:justify-start"
          >
            <span
              className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#00ff41] shadow-[0_0_8px_#00ff41]"
              aria-hidden="true"
            />
            <span className="font-mono text-[11px] text-[#888888]">
              Available for opportunities
            </span>
          </motion.div>

          <nav className="mt-5 flex flex-col gap-1" aria-label="Social links">
            <SocialLink
              href="https://github.com/AshishXoTech"
              label="GitHub"
              icon={<Github className="h-3.5 w-3.5" aria-hidden="true" />}
            />
            <SocialLink
              href="https://www.linkedin.com/in/ashishkumarjha"
              label="LinkedIn"
              icon={<Linkedin className="h-3.5 w-3.5" aria-hidden="true" />}
            />
            <SocialLink
              href="mailto:ashish863863@gmail.com"
              label="Email"
              icon={<Mail className="h-3.5 w-3.5" aria-hidden="true" />}
            />
          </nav>
        </motion.aside>

        {/* Right column */}
        <div className="min-w-0 flex-1">
          <SectionHeader>{"// about me"}</SectionHeader>

          <motion.pre
            variants={itemVariants}
            className="window-scrollbar mb-6 max-h-[360px] overflow-auto rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#050510] p-4 font-mono text-[11px] leading-6 text-[#e8e8f0]"
          >
            <code>{ABOUT_AS_CODE}</code>
          </motion.pre>

          <SectionHeader>{"// education"}</SectionHeader>

          <motion.div
            variants={itemVariants}
            className="mb-6 rounded-lg border border-[rgba(255,255,255,0.07)] border-l-[3px] border-l-[#7c3aed] bg-[rgba(12,12,12,0.88)] p-4 backdrop-blur-[14px]"
          >
            <p className="font-mono text-sm font-bold text-[#e0e0e0]">
              University of Engineering &amp; Management, Jaipur
            </p>
            <p className="mt-1 font-mono text-xs text-[#888888]">
              B.Tech — Computer Science &amp; Engineering
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-[11px]">
              <span className="text-[#7c3aed]">2024 – 2028</span>
              <span className="text-[#888888]">|</span>
              <span className="text-[#00ff41]">GPA 8.0 / 10</span>
            </div>
          </motion.div>

          <SectionHeader>{"// currently learning"}</SectionHeader>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
            {["Java", "Data Structures & Algorithms", "System Design"].map(
              (skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-[#7c3aed] bg-[#7c3aed20] px-3 py-1 font-mono text-[11px] text-[#e0e0e0]"
                >
                  {skill}
                </span>
              )
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
