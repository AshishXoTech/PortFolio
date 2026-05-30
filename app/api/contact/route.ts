import { NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";
import type { ContactFormData } from "@/types";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as ContactFormData;

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    const result = await sendContactEmail(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
