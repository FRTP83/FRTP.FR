import { NextResponse } from "next/server";
import { defaultBeforeAfterItems, type BeforeAfterItem } from "@/lib/before-after";
import { getSupabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/utils";

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
    .eq("key", "before_after_items")
    .maybeSingle();

  if (error || !Array.isArray(data?.value)) {
    return NextResponse.json({ items: defaultBeforeAfterItems });
  }

  return NextResponse.json({ items: data.value as BeforeAfterItem[] });
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

  const formData = await request.formData();
  const count = Math.max(0, Number(formData.get("itemsLength") ?? 0) || 0);
  const items: BeforeAfterItem[] = [];

  await supabase.storage.createBucket("site-assets", { public: true }).catch(() => null);

  for (let index = 0; index < count; index += 1) {
    const id = stringValue(formData, `itemId${index}`, crypto.randomUUID());
    const title = stringValue(formData, `itemTitle${index}`, "Avant / apres chantier");
    const currentBefore = stringValue(formData, `itemBeforeCurrent${index}`, "/chantier/bastide-jessica.jpeg");
    const currentAfter = stringValue(formData, `itemAfterCurrent${index}`, "/chantier/park-sainte-estelle.jpg");

    items.push({
      id,
      title,
      city: stringValue(formData, `itemCity${index}`, "Frejus"),
      category: stringValue(formData, `itemCategory${index}`, "Travaux publics"),
      before: await uploadOptionalImage(formData.get(`itemBefore${index}`), currentBefore, `before-after/${id}/before`, title),
      after: await uploadOptionalImage(formData.get(`itemAfter${index}`), currentAfter, `before-after/${id}/after`, title),
      sortOrder: Number(formData.get(`itemSortOrder${index}`) ?? index) || index,
      isPublished: formData.get(`itemPublished${index}`) === "on"
    });
  }

  const orderedItems = items.sort((a, b) => a.sortOrder - b.sortOrder);

  const { error } = await supabase.from("site_settings").upsert({
    key: "before_after_items",
    value: orderedItems,
    updated_at: new Date().toISOString()
  }, { onConflict: "key" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: orderedItems });
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

  const { data, error } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.data.user.id)
    .maybeSingle();

  if (!error) return { ok: Boolean(data), status: 403, error: "Acces non autorise." };
  if (error.code === "PGRST205" || error.message.includes("Could not find the table")) return { ok: true };

  return { ok: false, status: 403, error: "Acces non autorise." };
}

async function uploadOptionalImage(file: FormDataEntryValue | null, fallback: string, folder: string, title: string) {
  const supabase = getSupabaseAdmin();

  if (!supabase || !(file instanceof File) || file.size === 0) {
    return fallback;
  }

  const extension = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const filePath = `${folder}/${Date.now()}-${slugify(file.name || title)}.${extension}`;
  const bytes = await file.arrayBuffer();

  const upload = await supabase.storage.from("site-assets").upload(filePath, bytes, {
    contentType: file.type || "image/jpeg",
    upsert: true
  });

  if (upload.error) {
    throw new Error(upload.error.message);
  }

  return supabase.storage.from("site-assets").getPublicUrl(filePath).data.publicUrl;
}

function stringValue(formData: FormData, key: string, fallback: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value || fallback;
}
