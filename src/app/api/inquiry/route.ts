import { inquiryTypes, type InquiryType } from "@/content/integrations";

/**
 * Receives every form on the site and forwards it to GoHighLevel.
 *
 * Environment:
 *   GHL_WEBHOOK_URL            Inbound webhook for all inquiry types
 *   GHL_WEBHOOK_URL_<TYPE>     Optional override per type, e.g. GHL_WEBHOOK_URL_SPEAKING
 *
 * The payload carries `tags` (one per inquiry type) so Hazel's workflow can
 * apply the right tag and route the lead.
 */

const MAX_LEN = 5000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown): string | string[] | undefined {
  if (typeof value === "string") return value.trim().slice(0, MAX_LEN);
  if (Array.isArray(value)) return value.filter((v) => typeof v === "string").slice(0, 20).map((v) => v.trim().slice(0, 500));
  return undefined;
}

export async function POST(request: Request) {
  let body: { type?: string; fields?: Record<string, unknown>; page?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const type = body.type as InquiryType;
  if (!type || !(type in inquiryTypes)) {
    return Response.json({ error: "unknown_type" }, { status: 400 });
  }

  const raw = body.fields ?? {};
  // Honeypot: real visitors never fill this in. Pretend success to bots.
  if (typeof raw.company_website === "string" && raw.company_website.trim()) {
    return Response.json({ ok: true });
  }

  const fields: Record<string, string | string[]> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (key === "company_website" || !/^[a-z_]{1,40}$/.test(key)) continue;
    const v = clean(value);
    if (v !== undefined && v !== "") fields[key] = v;
  }

  const email = typeof fields.email === "string" ? fields.email : "";
  if (!EMAIL.test(email)) {
    return Response.json({ error: "invalid_email" }, { status: 422 });
  }

  const webhook = process.env[`GHL_WEBHOOK_URL_${type.toUpperCase()}`] || process.env.GHL_WEBHOOK_URL;
  if (!webhook) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const payload = {
    ...fields,
    // Checkboxes arrive as "on" only when ticked. Unticked = false (opt-ins default to no).
    sponsor_opt_in: fields.sponsor_opt_in === "on",
    sms_opt_in: fields.sms_opt_in === "on",
    tags: [inquiryTypes[type].tag],
    inquiry_type: type,
    source_page: typeof body.page === "string" ? body.page.slice(0, 200) : "",
    submitted_at: new Date().toISOString(),
  };

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return Response.json({ error: "upstream_failed" }, { status: 502 });
    }
  } catch {
    return Response.json({ error: "upstream_unreachable" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
