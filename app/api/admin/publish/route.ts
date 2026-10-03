import { getSupabaseAdmin } from "@/lib/supabase";
import { hasAdminAccess } from "@/lib/admin-access";
import { refreshPublicContent } from "@/lib/publication";

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return Response.json({ error: "Supabase serveur non configuré." }, { status: 500 });
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return Response.json({ error: "Session admin manquante." }, { status: 401 });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return Response.json({ error: "Session admin invalide." }, { status: 401 });
  if (!(await hasAdminAccess(data.user.id, data.user.email))) {
    return Response.json({ error: "Accès non autorisé." }, { status: 403 });
  }
  refreshPublicContent();
  return Response.json({ published: true });
}
