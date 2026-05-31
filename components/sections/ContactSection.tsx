"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import { ContactApp } from "@/components/apps/ContactApp";

const CONTACT_LINKS = [
  {
    color: "#00ff41",
    href: "mailto:ashish863863@gmail.com",
    icon: Mail,
    label: "Email",
    value: "ashish863863@gmail.com",
  },
  {
    color: "#e0e0e0",
    href: "https://github.com/AshishXoTech",
    icon: Github,
    label: "GitHub",
    value: "AshishXoTech",
  },
  {
    color: "#9d5ff5",
    href: "https://www.linkedin.com/in/ashish-kumar-jha-43887726b",
    icon: Linkedin,
    label: "LinkedIn",
    value: "ashish-kumar-jha",
  },
];

export function ContactSection(): JSX.Element {
  return (
    <section className="terminal-contact-atmosphere relative overflow-hidden px-6 pb-40 md:px-12">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute left-[20%] top-10 h-[300px] w-[300px] rounded-full bg-green/[0.025] blur-[80px]" />
        <span className="terminal-artifact left-[5%] top-[45%]">Node.js</span>
        <span className="terminal-artifact right-[10%] top-[12%]">TypeScript</span>
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px]">
        <header className="mb-16 max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-purple">
            08 / Contact
          </p>
          <h2 className="mt-5 font-display text-[clamp(48px,7vw,72px)] font-black leading-[0.9] tracking-[-0.04em] text-[#e8e8f0]">
            Let&apos;s build
            <span className="block text-purple">something real.</span>
          </h2>
        </header>

        <div className="grid gap-14 lg:grid-cols-[45fr_55fr]">
          <div>
            <div className="mb-9 rounded-2xl border border-green/10 bg-green/[0.04] p-6">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-green">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green shadow-[0_0_10px_rgba(0,255,65,0.8)]" />
                Available for opportunities
              </div>
              <p className="mt-4 font-sans text-[13px] leading-[1.7] text-[#6a6a8a]">
                Open to SWE internships, full-stack roles, and interesting project
                collaborations. Response time: usually under 24 hours.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/[0.06] px-3 py-1 font-mono text-[10px] text-[#444]">
                  Remote OK
                </span>
                <span className="rounded-full border border-white/[0.06] px-3 py-1 font-mono text-[10px] text-[#444]">
                  Jaipur / Relocation Ready
                </span>
              </div>
            </div>

            <div>
              {CONTACT_LINKS.map((link) => {
                const Icon = link.icon;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.label === "Email" ? undefined : "_blank"}
                    rel={link.label === "Email" ? undefined : "noreferrer"}
                    className="group flex items-center gap-4 border-b border-white/[0.03] py-4 no-underline transition-all duration-200 hover:rounded-lg hover:bg-white/[0.015] hover:pl-2"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03]">
                      <Icon className="h-4 w-4" style={{ color: link.color }} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-[#444]">
                        {link.label}
                      </span>
                      <span className="block truncate font-mono text-[13px]" style={{ color: link.color }}>
                        {link.value}
                      </span>
                    </span>
                    <span className="font-mono text-[#333] transition group-hover:text-[#e0e0e0]">
                      ↗
                    </span>
                  </a>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl border border-white/[0.05] bg-[rgba(8,8,20,0.6)] p-5 font-mono text-[11px] leading-8 text-[#444]">
              <p>$ location&nbsp;&nbsp; Jaipur, Rajasthan, India</p>
              <p>$ timezone&nbsp;&nbsp; IST (UTC+5:30)</p>
              <p>$ status&nbsp;&nbsp;&nbsp;&nbsp; B.Tech CSE · Year 1 of 4</p>
              <p>$ learning&nbsp;&nbsp; Java · DSA · System Design</p>
              <p>$ goal&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Software Engineer @ product co</p>
            </div>
          </div>

          <ContactApp />
        </div>
      </div>
    </section>
  );
}
