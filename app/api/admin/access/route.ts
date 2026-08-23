import { NextResponse } from "next/server";
import { hasAdminAccess } from "@/lib/admin-access";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  const supabase = getSupabaseAdmin();
  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!supabase) {
    return NextResponse.json({ error: "Supabase serveur non configuré." }, { status: 500 });
  }

  if (!token) {
    return NextResponse.json({ error: "Session admin manquante." }, { status: 401 });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return NextResponse.json({ error: "Session admin invalide." }, { status: 401 });
  }

  if (!(await hasAdminAccess(data.user.id, data.user.email))) {
    return NextResponse.json({ error: "Accès non autorisé." }, { status: 403 });
  }

  return NextResponse.json({ ok: true });
}
