"use client";

import TerminalApp from "@/components/apps/TerminalApp";

const CODE_COLUMNS = Array.from({ length: 8 }, (_, index) => ({
  delay: `${index * -1.2}s`,
  left: `${8 + index * 12}%`,
}));

export function TerminalSection(): JSX.Element {
  return (
    <section className="terminal-contact-atmosphere relative overflow-hidden px-6 py-16 md:px-12">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {CODE_COLUMNS.map((column, index) => (
          <div
            key={`terminal-code-${index}`}
            className="terminal-code-rain"
            style={{ animationDelay: column.delay, left: column.left }}
          >
            {"help\nwhoami\nsudo\nhire\nashish\nprojects\nopen\ncontact"}
          </div>
        ))}
        <span className="absolute bottom-0 left-[18%] h-[400px] w-[400px] rounded-full bg-purple/[0.03] blur-[100px]" />
        <span className="absolute right-[14%] top-[20%] h-[300px] w-[300px] rounded-full bg-green/[0.025] blur-[80px]" />
        <span className="terminal-artifact left-[7%] top-[22%]">MERN</span>
        <span className="terminal-artifact right-[8%] top-[36%]">Docker</span>
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px]">
        <header className="mb-8 max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-green">
            07 / Terminal
          </p>
          <h2 className="mt-3 font-display text-[clamp(48px,7vw,72px)] font-black leading-[0.9] tracking-[-0.04em] text-[#e8e8f0]">
            Talk to
            <span className="block text-green">the machine.</span>
          </h2>
          <p className="mt-3 font-sans text-sm leading-7 text-muted">
            Type a command. The OS responds. Try: help, whoami, sudo hire ashish
          </p>
        </header>

        <div className="mx-auto max-w-[900px]">
          <TerminalApp showcase />
        </div>
      </div>
    </section>
  );
}
