"use client";

import { Check } from "lucide-react";
import { FormEvent, useState } from "react";

interface FormState {
  email: string;
  message: string;
  name: string;
  subject: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

export function ContactApp(): JSX.Element {
  const [form, setForm] = useState<FormState>({
    email: "",
    message: "",
    name: "",
    subject: "",
  });
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          message: `Subject: ${form.subject || "Portfolio contact"}\n\n${form.message}`,
          name: form.name,
        }),
      });

      const data = (await response.json()) as {
        success: boolean;
        error?: string;
      };

      if (!response.ok || !data.success) {
        setStatus("error");
        setErrorMessage(data.error ?? "Failed to send message");
        return;
      }

      setStatus("success");
      setForm({ email: "", message: "", name: "", subject: "" });
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[20px] border border-white/[0.055] bg-[rgba(6,6,16,0.85)] p-10 text-center shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-green bg-green/[0.08] text-green">
          <Check className="h-7 w-7" aria-hidden="true" />
        </div>
        <h3 className="mt-5 font-display text-xl font-bold text-green">
          Message transmitted.
        </h3>
        <p className="mt-2 font-mono text-xs text-[#555]">
          I&apos;ll respond within 24 hours.
        </p>
        <p className="mt-5 font-mono text-[11px] text-[#444]">
          ashish863863@gmail.com
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[20px] border border-white/[0.055] bg-[rgba(6,6,16,0.85)] shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
      <div className="flex h-[42px] items-center gap-3 border-b border-white/[0.04] bg-[#080816] px-4">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28ca42]" />
        </div>
        <div className="flex items-center gap-2 rounded-t bg-white/[0.04] px-3.5 py-1.5 font-mono text-[11px] text-[#888]">
          contact.cfg
          <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        <div className="mb-5 font-mono text-xs leading-8 text-[#2a2a3a]">
          <p># Contact configuration</p>
          <p># Fill in values and submit to send</p>
        </div>

        <ConfigInput
          id="contact-name"
          label="name"
          placeholder="your name"
          required
          value={form.name}
          onChange={(value) => setForm((current) => ({ ...current, name: value }))}
        />
        <ConfigInput
          id="contact-email"
          label="email"
          placeholder="you@example.com"
          required
          type="email"
          value={form.email}
          onChange={(value) => setForm((current) => ({ ...current, email: value }))}
        />
        <ConfigInput
          id="contact-subject"
          label="subject"
          placeholder="What are we building?"
          value={form.subject}
          onChange={(value) => setForm((current) => ({ ...current, subject: value }))}
        />

        <label htmlFor="contact-message" className="mt-2 block font-mono text-[13px] text-purple">
          message
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={form.message}
          onChange={(event) =>
            setForm((current) => ({ ...current, message: event.target.value }))
          }
          placeholder="Tell me about the project, role, or problem."
          className="mt-2 w-full resize-none rounded-lg border border-white/[0.04] bg-white/[0.01] p-3 font-mono text-[13px] text-[#e0e0e0] caret-green outline-none transition placeholder:text-[#333] focus:border-green/30"
        />

        {status === "error" ? (
          <p className="mt-4 font-mono text-xs text-red" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-6 w-full rounded-[10px] border-0 bg-[linear-gradient(135deg,rgba(124,58,237,0.9),rgba(100,40,220,0.9))] px-4 py-[13px] font-mono text-xs font-bold uppercase tracking-[0.08em] text-[#e8e8f0] transition hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(124,58,237,0.3)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "transmitting..." : "transmit message →"}
        </button>
      </form>
    </div>
  );
}

function ConfigInput({
  id,
  label,
  onChange,
  placeholder,
  required = false,
  type = "text",
  value,
}: {
  id: string;
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  type?: "email" | "text";
  value: string;
}): JSX.Element {
  return (
    <label htmlFor={id} className="mb-5 flex items-center font-mono text-[13px]">
      <span className="w-20 shrink-0 text-purple">{label}</span>
      <span className="px-2 text-[#444]">=</span>
      <input
        id={id}
        required={required}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 border-0 border-b border-white/[0.06] bg-transparent px-0 py-1 font-mono text-[13px] text-[#e0e0e0] caret-green outline-none transition placeholder:text-[#333] focus:border-green/30"
      />
    </label>
  );
}
