import { NextResponse } from "next/server";
import { careerSchema, enquirySchema } from "@/lib/schemas";

/**
 * Single endpoint for both the quote form and the careers form.
 *
 * Delivery is intentionally pluggable: with no provider configured the
 * submission is validated and logged so nothing is lost during staging.
 * Set RESEND_API_KEY + ENQUIRY_TO to start sending mail.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const kind =
    typeof payload === "object" && payload && "kind" in payload
      ? (payload as { kind?: string }).kind
      : "enquiry";

  // Honeypot is checked before validation so bots get a plain 200 and learn
  // nothing about the field rules.
  const trap =
    typeof payload === "object" && payload && "website" in payload
      ? (payload as { website?: string }).website
      : undefined;
  if (trap) return NextResponse.json({ ok: true });

  const schema = kind === "career" ? careerSchema : enquirySchema;
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO ?? "ganesh@irontechdetailing.com";

  if (!apiKey) {
    console.info(`[enquiry:${kind}] no mail provider configured — payload logged`, parsed.data);
    return NextResponse.json({ ok: true, delivered: false });
  }

  const lines = Object.entries(parsed.data)
    .filter(([key, value]) => key !== "website" && value)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.ENQUIRY_FROM ?? "website@irontechdetailing.com",
      to,
      reply_to: parsed.data.email,
      subject:
        kind === "career"
          ? `Career application — ${parsed.data.name}`
          : `Quote request — ${parsed.data.name}`,
      text: lines,
    }),
  });

  if (!res.ok) {
    console.error("[enquiry] delivery failed", await res.text());
    return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
