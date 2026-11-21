import { inquiryTypes, optIns, optInsVersion, optInTypes, programChoices, type InquiryType } from "@/content/integrations";

/**
 * Receives every form on the site and forwards it to GoHighLevel.
 *
 * Environment:
 *   GHL_WEBHOOK_URL            Inbound webhook for all inquiry types
 *   GHL_WEBHOOK_URL_<TYPE>     Optional override per type, e.g. GHL_WEBHOOK_URL_SPEAKING
 *
 * The payload carries `tags` (one per inquiry type) so Hazel's workflow can
 * apply the right tag and route the lead. Other fields:
 *   program                    Speaking form: the program a planner picked (or "Not sure yet")
 *   sponsor_opt_in, sms_opt_in Booleans; false unless the box was checked
 *   sponsor_consent_text,      The exact opt-in wording the person agreed to,
 *   sms_consent_text           present only when that box was checked,
 *   consent_version            with the wording's version and time
 *   consent_recorded_at
 *
 * Responses: 200 ok, 400 bad request, 422 invalid email / text messages
 * without a phone number, 503 webhook not configured, 502 GoHighLevel failed.
 */

const MAX_LEN = 5000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIMEOUT_MS = 10_000;

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
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const type = body.type as InquiryType;
  if (!type || !Object.hasOwn(inquiryTypes, type)) {
    return Response.json({ error: "unknown_type" }, { status: 400 });
  }

  const raw = body.fields && typeof body.fields === "object" ? body.fields : {};
  // Honeypot: real visitors never fill this in. Pretend success to bots.
  if (typeof raw.company_website === "string" && raw.company_website.trim()) {
    return Response.json({ ok: true });
  }

  const fields: Record<string, string | string[]> = {};
  // Form field names only (lowercase words), and no more than a form could hold.
  for (const [key, value] of Object.entries(raw).slice(0, 40)) {
    if (key === "company_website" || !/^[a-z_]{1,40}$/.test(key)) continue;
    const v = clean(value);
    if (v !== undefined && v !== "" && !(Array.isArray(v) && !v.length)) fields[key] = v;
  }

  const email = typeof fields.email === "string" ? fields.email : "";
  if (!EMAIL.test(email)) {
    return Response.json({ error: "invalid_email" }, { status: 422 });
  }

  // Opt-ins only exist on the P3 interest list. Checkboxes arrive as "on"
  // only when checked; anything else is a no (they are unchecked by default).
  const offersOptIns = optInTypes.includes(type);
  const sponsor = offersOptIns && fields.sponsor_opt_in === "on";
  const sms = offersOptIns && fields.sms_opt_in === "on";
  delete fields.sponsor_opt_in;
  delete fields.sms_opt_in;

  const phone = typeof fields.phone === "string" ? fields.phone : "";
  if (sms && phone.replace(/\D/g, "").length < 7) {
    return Response.json({ error: "phone_required" }, { status: 422 });
  }

  // The speaking form's program must be one of the programs on the page.
  if (fields.program !== undefined && (typeof fields.program !== "string" || !programChoices.includes(fields.program))) {
    delete fields.program;
  }

  const webhook = process.env[`GHL_WEBHOOK_URL_${type.toUpperCase()}`] || process.env.GHL_WEBHOOK_URL;
  if (!webhook) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const submittedAt = new Date().toISOString();
  const payload = {
    ...fields,
    // Opt-in answers exist only on forms that ask (the P3 interest list).
    ...(offersOptIns ? { sponsor_opt_in: sponsor, sms_opt_in: sms } : {}),
    ...(sponsor ? { sponsor_consent_text: optIns.sponsor } : {}),
    ...(sms ? { sms_consent_text: optIns.sms } : {}),
    ...(sponsor || sms ? { consent_version: optInsVersion, consent_recorded_at: submittedAt } : {}),
    tags: [inquiryTypes[type].tag],
    inquiry_type: type,
    source_page: typeof body.page === "string" ? body.page.slice(0, 200) : "",
    submitted_at: submittedAt,
  };

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      return Response.json({ error: "upstream_failed" }, { status: 502 });
    }
  } catch {
    return Response.json({ error: "upstream_unreachable" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
