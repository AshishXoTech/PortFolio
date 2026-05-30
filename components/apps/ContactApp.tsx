"use client";

import { FormEvent, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

interface FormState {
  name: string;
  email: string;
  message: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

export function ContactApp(): JSX.Element {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
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
        body: JSON.stringify(form),
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
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <GlassCard className="p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="contact-name" className="mb-1 block font-mono text-xs text-muted">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded border border-glass bg-background px-3 py-2 text-sm text-text outline-none focus:border-green"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-1 block font-mono text-xs text-muted">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded border border-glass bg-background px-3 py-2 text-sm text-text outline-none focus:border-green"
          />
        </div>

        <div>
          <label htmlFor="contact-message" className="mb-1 block font-mono text-xs text-muted">
            Message
          </label>
          <textarea
            id="contact-message"
            required
            rows={4}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className="w-full resize-none rounded border border-glass bg-background px-3 py-2 text-sm text-text outline-none focus:border-green"
          />
        </div>

        {status === "success" && (
          <p className="font-mono text-xs text-green" role="status">
            Message sent successfully!
          </p>
        )}

        {status === "error" && (
          <p className="font-mono text-xs text-red" role="alert">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded border border-green/30 bg-green/10 py-2 font-mono text-sm text-green transition-colors hover:bg-green/20 disabled:opacity-50"
        >
          {status === "loading" ? "Sending..." : "Send Message"}
        </button>
      </form>
    </GlassCard>
  );
}
