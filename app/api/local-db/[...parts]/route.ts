import { readFile } from "node:fs/promises";
import { localRequestAllowed, readLocalTables, mutateLocalTables, localAssetPath, writeLocalAsset } from "@/lib/local-preview-store";

type Row = Record<string, unknown>;
const allowedTables = new Set(["projects", "project_categories", "project_category_links", "project_images", "site_settings", "news", "contact_requests", "admins"]);

async function handle(request: Request, context: { params: Promise<{ parts: string[] }> }) {
  if (!localRequestAllowed(request)) return Response.json({ error: "Prévisualisation locale indisponible." }, { status: 404 });
  const { parts } = await context.params;
  const url = new URL(request.url);
  if (parts[0] === "auth" && parts[2] === "user") {
    if (request.headers.get("authorization") !== "Bearer local-preview") return Response.json({ message: "Session locale manquante" }, { status: 401 });
    return Response.json({ id: "local-preview", email: "local-preview@localhost", aud: "authenticated", role: "authenticated", app_metadata: {}, user_metadata: {}, created_at: "2026-10-02T00:00:00Z" });
  }
  if (parts[0] === "storage") {
    if (parts[2] === "bucket") return Response.json({ id: "local", name: "local" });
    const assetParts = parts.slice(parts[3] === "public" ? 4 : 3);
    try {
      if (request.method === "GET") {
        const bytes = await readFile(localAssetPath(assetParts));
        const extension = assetParts.at(-1)?.split(".").at(-1)?.toLowerCase();
        const types: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif", svg: "image/svg+xml" };
        return new Response(bytes, { headers: { "Content-Type": types[extension ?? ""] ?? "application/octet-stream", "X-Content-Type-Options": "nosniff" } });
      }
      if (request.headers.get("apikey") !== "local-preview") return Response.json({ error: "Accès local manquant" }, { status: 401 });
      if (request.headers.get("content-type")?.includes("multipart/form-data")) {
        const form = await request.formData();
        const file = Array.from(form.values()).find(value => value instanceof File);
        if (!(file instanceof File)) throw new Error("Fichier absent");
        await writeLocalAsset(assetParts, await file.arrayBuffer());
      } else await writeLocalAsset(assetParts, await request.arrayBuffer());
      return Response.json({ Key: assetParts.join("/"), Id: crypto.randomUUID() });
    } catch {
      return Response.json({ error: "Fichier local inaccessible" }, { status: 400 });
    }
  }
  const table = parts[2];
  if (parts[0] !== "rest" || !allowedTables.has(table)) return Response.json({ message: "Table locale inconnue" }, { status: 404 });
  if (request.headers.get("apikey") !== "local-preview") return Response.json({ message: "Accès local manquant" }, { status: 401 });
  const matches = (row: Row) => Array.from(url.searchParams.entries()).every(([key, value]) => {
    if (["select", "order", "on_conflict", "limit", "offset"].includes(key)) return true;
    if (value.startsWith("eq.")) return String(row[key]) === value.slice(3);
    if (value.startsWith("in.(")) return value.slice(4, -1).split(",").includes(String(row[key]));
    return false;
  });
  let rows: Row[];
  if (request.method === "GET") {
    const tables = await readLocalTables();
    rows = tables[table].filter(matches).map(row => ({ ...row }));
    if (table === "projects") rows = rows.map(row => ({ ...row, project_category_links: tables.project_category_links.filter(link => link.project_id === row.id), project_images: tables.project_images.filter(image => image.project_id === row.id) }));
    const [column, direction] = (url.searchParams.get("order") ?? "").split(".");
    if (column) rows.sort((a, b) => String(a[column] ?? "").localeCompare(String(b[column] ?? "")) * (direction === "desc" ? -1 : 1));
  } else {
    const payload = request.method === "DELETE" ? null : await request.json();
    rows = await mutateLocalTables(tables => {
      if (request.method === "DELETE") {
        const removed = tables[table].filter(matches);
        tables[table] = tables[table].filter(row => !matches(row));
        if (table === "projects") for (const child of ["project_category_links", "project_images"]) tables[child] = tables[child].filter(row => !removed.some(project => project.id === row.project_id));
        return removed;
      }
      if (request.method === "PATCH") {
        const changed = tables[table].filter(matches);
        changed.forEach(row => Object.assign(row, payload));
        return changed;
      }
      const inserted = (Array.isArray(payload) ? payload : [payload]) as Row[];
      return inserted.map(value => {
        const conflict = url.searchParams.get("on_conflict") ?? "id";
        const existing = value[conflict] ? tables[table].find(row => row[conflict] === value[conflict]) : null;
        if (existing && request.headers.get("prefer")?.includes("resolution=merge-duplicates")) return Object.assign(existing, value);
        const row = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...value };
        tables[table].push(row);
        return row;
      });
    });
  }
  if (request.headers.get("accept")?.includes("application/vnd.pgrst.object+json")) return Response.json(rows[0] ?? null);
  return Response.json(rows, { headers: { "Cache-Control": "no-store" } });
}

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const DELETE = handle;
