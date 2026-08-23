import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  normalizeProjectHeroSettings,
  normalizeProjectHeroSettingsMap,
  type ProjectHeroSettingsMap
} from "@/lib/project-hero";
import { hasAdminAccess } from "@/lib/admin-access";
import { normalizeCopyObject } from "@/lib/french-copy";

const settingsKey = "project_hero_settings";

export async function GET(request: Request) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase serveur non configure." }, { status: 500 });
  }

  const access = await ensureAccess(request);

  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", settingsKey)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ settings: normalizeProjectHeroSettingsMap(data?.value) });
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase serveur non configure." }, { status: 500 });
  }

  const access = await ensureAccess(request);

  if (!access.ok) {
    return NextResponse.json({ error: access.error }, { status: access.status });
  }

  const body = await request.json().catch(() => null) as {
    projectId?: string;
    settings?: unknown;
  } | null;

  if (!body?.projectId || typeof body.projectId !== "string") {
    return NextResponse.json({ error: "Chantier manquant." }, { status: 400 });
  }

  const current = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", settingsKey)
    .maybeSingle();

  if (current.error) {
    return NextResponse.json({ error: current.error.message }, { status: 500 });
  }

  const settingsMap: ProjectHeroSettingsMap = normalizeProjectHeroSettingsMap(current.data?.value);
  settingsMap[body.projectId] = normalizeProjectHeroSettings(body.settings as Record<string, unknown>);

  const { error } = await supabase.from("site_settings").upsert({
    key: settingsKey,
    value: normalizeCopyObject(settingsMap),
    updated_at: new Date().toISOString()
  }, { onConflict: "key" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ settings: settingsMap });
}

async function ensureAccess(request: Request) {
  const supabase = getSupabaseAdmin();
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!supabase) return { ok: false, status: 500, error: "Supabase serveur non configure." };
  if (!token) return { ok: false, status: 401, error: "Session admin manquante." };

  const user = await supabase.auth.getUser(token);

  if (user.error || !user.data.user) {
    return { ok: false, status: 401, error: "Session admin invalide." };
  }

  if (!(await hasAdminAccess(user.data.user.id, user.data.user.email))) {
    return { ok: false, status: 403, error: "Accès non autorisé." };
  }

  return { ok: true, status: 200, error: "" };
}
