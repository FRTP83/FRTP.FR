import { NextResponse } from "next/server";
import { sendContactRequestMail } from "@/lib/mail";
import { getSupabaseAdmin } from "@/lib/supabase";
import { normalizeFrenchCopy } from "@/lib/french-copy";

const requiredFields = ["name", "phone", "email", "city", "work_type", "message"] as const;

// Longueurs maximales par champ (anti-abus / cohérence base).
const maxLengths: Record<string, number> = {
  name: 120,
  company: 160,
  email: 160,
  phone: 40,
  city: 120,
  work_type: 80,
  message: 4000
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Limitation de débit "best-effort" en mémoire (par instance serverless).
// Pour une protection robuste, prévoir un store partagé (KV/Redis) ou un captcha.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_BODY_BYTES = 16_000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();

  if (hits.size > 1_000) {
    hits.forEach((timestamps: number[], key: string) => {
      if (!timestamps.some((timestamp: number) => now - timestamp < RATE_WINDOW_MS)) {
        hits.delete(key);
      }
    });
  }

  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  if (recent.length > 0) hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);

  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "La demande est trop volumineuse." }, { status: 413 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de demandes envoyées. Merci de réessayer dans quelques minutes." },
      { status: 429 }
    );
  }

  const rawBody = await request.text().catch(() => "");

  if (!rawBody || new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Données invalides ou trop volumineuses." }, { status: 400 });
  }

  const body = (() => {
    try {
      return JSON.parse(rawBody) as Record<string, unknown>;
    } catch {
      return null;
    }
  })();

  if (!body) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  // Champ piège (honeypot) : rempli uniquement par les robots.
  if (String(body.website ?? "").trim()) {
    return NextResponse.json({ ok: true });
  }

  for (const field of requiredFields) {
    if (!String(body[field] ?? "").trim()) {
      return NextResponse.json({ error: "Merci de renseigner tous les champs obligatoires." }, { status: 400 });
    }
  }

  for (const [field, max] of Object.entries(maxLengths)) {
    if (String(body[field] ?? "").length > max) {
      return NextResponse.json(
        { error: `Le champ ${field} dépasse la longueur autorisée.` },
        { status: 400 }
      );
    }
  }

  if (!emailRegex.test(String(body.email).trim())) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase n'est pas encore configuré pour enregistrer la demande." },
      { status: 503 }
    );
  }

  const payload = {
    name: normalizeFrenchCopy(String(body.name).trim()),
    company: normalizeFrenchCopy(String(body.company ?? "").trim()),
    email: normalizeFrenchCopy(String(body.email).trim()),
    phone: normalizeFrenchCopy(String(body.phone).trim()),
    city: normalizeFrenchCopy(String(body.city).trim()),
    work_type: normalizeFrenchCopy(String(body.work_type).trim()),
    message: normalizeFrenchCopy(String(body.message).trim())
  };

  const { error } = await supabase.from("contact_requests").insert({
    ...payload,
    status: "nouveau"
  });

  if (error) {
    console.error("Contact database error", error);
    return NextResponse.json({ error: "La demande n'a pas pu être enregistrée." }, { status: 500 });
  }

  try {
    const mail = await sendContactRequestMail(payload);

    return NextResponse.json({
      ok: true,
      mailSent: !mail.skipped,
      mailSkipped: mail.skipped
    });
  } catch (mailError) {
    console.error("Contact mail error", mailError);

    return NextResponse.json({
      ok: true,
      mailSent: false,
      mailError: "La demande est enregistrée, mais l'email de notification n'a pas pu être envoyé."
    });
  }
}
