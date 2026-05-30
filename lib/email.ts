import { Resend } from "resend";
import type { ContactFormData } from "@/types";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: "Email service not configured" };
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "AshishOS <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL ?? "ashish863863@gmail.com",
      subject: `AshishOS Contact — ${data.name}`,
      replyTo: data.email,
      text: `From: ${data.name} <${data.email}>\n\n${data.message}`,
    });

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send email";
    return { success: false, error: message };
  }
}
