import { refreshPublicContent } from "@/lib/publication";
import { getSupabaseAdmin } from "@/lib/supabase";
import { hasAdminAccess } from "@/lib/admin-access";
import { validateLocation } from "@/lib/geography-server";
import { normalizeCopyObject } from "@/lib/french-copy";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!supabase) return Response.json({ error: "Supabase serveur non configuré." }, { status: 500 });
  if (!token) return Response.json({ error: "Session admin manquante." }, { status: 401 });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return Response.json({ error: "Session admin invalide." }, { status: 401 });
  if (!(await hasAdminAccess(data.user.id, data.user.email))) return Response.json({ error: "Accès non autorisé." }, { status: 403 });
  try {
    const body = await request.json();
    const source = body.project ?? {};
    const location = validateLocation(String(source.department_code ?? ""), String(source.city_code ?? ""));
    const title = String(source.title ?? "").trim();
    if (!title) throw new Error("Le titre du chantier est obligatoire.");
    const categoryIds: string[] = Array.from(new Set<string>((body.categoryIds ?? []).map(String)));
    const { data: categories, error: categoriesError } = await supabase.from("project_categories").select("id");
    if (categoriesError) throw new Error(categoriesError.message);
    if (!categoryIds.length || categoryIds.some(id => !categories?.some(category => category.id === id))) throw new Error("Sélectionnez au moins une catégorie valide.");
    const text = (key: string) => String(source[key] ?? "").trim() || null;
    const payload = normalizeCopyObject({
      title, slug: text("slug") || slugify(title), city: location.city,
      city_code: location.cityCode, department_code: location.departmentCode,
      category_id: categoryIds[0], short_description: text("short_description"), description: text("description"),
      initial_problem: text("initial_problem"), works_done: text("works_done"), client_type: text("client_type"),
      duration: text("duration"), work_date: text("work_date"), is_featured: source.is_featured === true,
      is_published: source.is_published === true, updated_at: new Date().toISOString()
    });
    const result = body.id
      ? await supabase.from("projects").update(payload).eq("id", String(body.id)).select("id").single()
      : await supabase.from("projects").insert(payload).select("id").single();
    if (result.error || !result.data) throw new Error(result.error?.message ?? "Chantier non enregistré.");
    // Insert additions first; an error never removes the existing categories.
    const { data: existing, error: linksError } = await supabase.from("project_category_links").select("category_id").eq("project_id", result.data.id);
    if (linksError) throw new Error(linksError.message);
    const additions = categoryIds.filter(id => !existing?.some(link => link.category_id === id));
    if (additions.length) {
      const inserted = await supabase.from("project_category_links").insert(additions.map(category_id => ({ project_id: result.data.id, category_id })));
      if (inserted.error) throw new Error(inserted.error.message);
    }
    for (const link of existing ?? []) if (!categoryIds.includes(link.category_id)) {
      const removed = await supabase.from("project_category_links").delete().eq("project_id", result.data.id).eq("category_id", link.category_id);
      if (removed.error) throw new Error(removed.error.message);
    }
    refreshPublicContent();
    return Response.json({ id: result.data.id });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Chantier non enregistré." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const supabase = getSupabaseAdmin();
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!supabase) return Response.json({ error: "Supabase serveur non configuré." }, { status: 500 });
  if (!token) return Response.json({ error: "Session admin manquante." }, { status: 401 });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return Response.json({ error: "Session admin invalide." }, { status: 401 });
  if (!(await hasAdminAccess(data.user.id, data.user.email))) return Response.json({ error: "Accès non autorisé." }, { status: 403 });
  try {
    const body = await request.json();
    const id = String(body.id ?? "");
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return Response.json({ error: "Identifiant du chantier invalide." }, { status: 400 });
    }
    const removed = await supabase.from("projects").delete().eq("id", id).select("id").maybeSingle();
    if (removed.error) throw new Error(removed.error.message);
    if (!removed.data) return Response.json({ error: "Chantier introuvable." }, { status: 404 });
    refreshPublicContent();
    return Response.json({ id: removed.data.id });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Chantier non supprimé." }, { status: 400 });
  }
}
