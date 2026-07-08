import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { defaultStudioSettings, type StudioSettings } from "@/lib/studio";
import { slugify } from "@/lib/utils";

const imageFields = ["heroImage", "companyImage", "beforeImage", "afterImage"] as const;

export async function GET(request: Request) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase serveur non configure." }, { status: 500 });
  }

  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Session admin manquante." }, { status: 401 });
  }

  const user = await supabase.auth.getUser(token);

  if (user.error || !user.data.user) {
    return NextResponse.json({ error: "Session admin invalide." }, { status: 401 });
  }

  const adminAccess = await hasAdminAccess(user.data.user.id);

  if (!adminAccess) {
    return NextResponse.json({ error: "Acces non autorise." }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "studio")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    settings: {
      ...defaultStudioSettings,
      ...((data?.value as Partial<StudioSettings> | null) ?? {})
    }
  });
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase serveur non configure." }, { status: 500 });
  }

  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Session admin manquante." }, { status: 401 });
  }

  const user = await supabase.auth.getUser(token);

  if (user.error || !user.data.user) {
    return NextResponse.json({ error: "Session admin invalide." }, { status: 401 });
  }

  const adminAccess = await hasAdminAccess(user.data.user.id);

  if (!adminAccess) {
    return NextResponse.json({ error: "Acces non autorise." }, { status: 403 });
  }

  const formData = await request.formData();
  const currentRaw = formData.get("current");
  const current = currentRaw ? JSON.parse(String(currentRaw)) as Partial<StudioSettings> : {};

  const nextSettings: StudioSettings = {
    heroTitle: stringValue(formData, "heroTitle", defaultStudioSettings.heroTitle),
    heroSubtitle: stringValue(formData, "heroSubtitle", defaultStudioSettings.heroSubtitle),
    heroImage: current.heroImage ?? defaultStudioSettings.heroImage,
    heroEyebrow: stringValue(formData, "heroEyebrow", defaultStudioSettings.heroEyebrow),
    heroPanelEyebrow: stringValue(formData, "heroPanelEyebrow", defaultStudioSettings.heroPanelEyebrow),
    heroPanelTitle: stringValue(formData, "heroPanelTitle", defaultStudioSettings.heroPanelTitle),
    heroPanelItems: linesValue(formData, "heroPanelItems", defaultStudioSettings.heroPanelItems),
    homeActivitiesTitle: stringValue(formData, "homeActivitiesTitle", defaultStudioSettings.homeActivitiesTitle),
    homeActivitiesText: stringValue(formData, "homeActivitiesText", defaultStudioSettings.homeActivitiesText),
    homeProjectsTitle: stringValue(formData, "homeProjectsTitle", defaultStudioSettings.homeProjectsTitle),
    homeProjectsText: stringValue(formData, "homeProjectsText", defaultStudioSettings.homeProjectsText),
    reviewsEyebrow: stringValue(formData, "reviewsEyebrow", defaultStudioSettings.reviewsEyebrow),
    reviewsTitle: stringValue(formData, "reviewsTitle", defaultStudioSettings.reviewsTitle),
    reviewsText: stringValue(formData, "reviewsText", defaultStudioSettings.reviewsText),
    reviewsRating: stringValue(formData, "reviewsRating", defaultStudioSettings.reviewsRating),
    reviewsCount: stringValue(formData, "reviewsCount", defaultStudioSettings.reviewsCount),
    reviewsGoogleUrl: stringValue(formData, "reviewsGoogleUrl", defaultStudioSettings.reviewsGoogleUrl),
    reviews: reviewsValue(formData),
    homeCtaTitle: stringValue(formData, "homeCtaTitle", defaultStudioSettings.homeCtaTitle),
    companyTitle: stringValue(formData, "companyTitle", defaultStudioSettings.companyTitle),
    companyIntro: stringValue(formData, "companyIntro", defaultStudioSettings.companyIntro),
    companyImage: current.companyImage ?? defaultStudioSettings.companyImage,
    companyCards: defaultStudioSettings.companyCards.map((card, index) => ({
      title: stringValue(formData, `companyCardTitle${index}`, card.title),
      text: stringValue(formData, `companyCardText${index}`, card.text)
    })),
    companyPillars: linesValue(formData, "companyPillars", defaultStudioSettings.companyPillars),
    serviceArea: linesValue(formData, "serviceArea", defaultStudioSettings.serviceArea),
    methodTitle: stringValue(formData, "methodTitle", defaultStudioSettings.methodTitle),
    methodText: stringValue(formData, "methodText", defaultStudioSettings.methodText),
    methodSteps: defaultStudioSettings.methodSteps.map((step, index) => ({
      number: stringValue(formData, `methodStepNumber${index}`, step.number),
      title: stringValue(formData, `methodStepTitle${index}`, step.title),
      text: stringValue(formData, `methodStepText${index}`, step.text)
    })),
    activitiesPageTitle: stringValue(formData, "activitiesPageTitle", defaultStudioSettings.activitiesPageTitle),
    activitiesPageText: stringValue(formData, "activitiesPageText", defaultStudioSettings.activitiesPageText),
    activities: defaultStudioSettings.activities.map((activity) => ({
      slug: activity.slug,
      title: stringValue(formData, `activityTitle-${activity.slug}`, activity.title),
      description: stringValue(formData, `activityDescription-${activity.slug}`, activity.description),
      services: linesValue(formData, `activityServices-${activity.slug}`, activity.services),
      interventionExample: stringValue(formData, `activityIntervention-${activity.slug}`, activity.interventionExample)
    })),
    projectsPageTitle: stringValue(formData, "projectsPageTitle", defaultStudioSettings.projectsPageTitle),
    projectsPageText: stringValue(formData, "projectsPageText", defaultStudioSettings.projectsPageText),
    newsPageTitle: stringValue(formData, "newsPageTitle", defaultStudioSettings.newsPageTitle),
    newsPageText: stringValue(formData, "newsPageText", defaultStudioSettings.newsPageText),
    beforeAfterTitle: stringValue(formData, "beforeAfterTitle", defaultStudioSettings.beforeAfterTitle),
    beforeAfterText: stringValue(formData, "beforeAfterText", defaultStudioSettings.beforeAfterText),
    beforeImage: current.beforeImage ?? defaultStudioSettings.beforeImage,
    afterImage: current.afterImage ?? defaultStudioSettings.afterImage,
    contactTitle: stringValue(formData, "contactTitle", defaultStudioSettings.contactTitle),
    contactPageText: stringValue(formData, "contactPageText", defaultStudioSettings.contactPageText),
    contactText: stringValue(formData, "contactText", defaultStudioSettings.contactText),
    phone: stringValue(formData, "phone", defaultStudioSettings.phone),
    email: stringValue(formData, "email", defaultStudioSettings.email),
    address: stringValue(formData, "address", defaultStudioSettings.address),
    footerText: stringValue(formData, "footerText", defaultStudioSettings.footerText),
    stats: defaultStudioSettings.stats.map((stat, index) => ({
      value: stringValue(formData, `statValue${index}`, stat.value),
      label: stringValue(formData, `statLabel${index}`, stat.label)
    })),
    legalTitle: stringValue(formData, "legalTitle", defaultStudioSettings.legalTitle),
    legalText: stringValue(formData, "legalText", defaultStudioSettings.legalText),
    privacyTitle: stringValue(formData, "privacyTitle", defaultStudioSettings.privacyTitle),
    privacyText: stringValue(formData, "privacyText", defaultStudioSettings.privacyText)
  };

  await supabase.storage.createBucket("site-assets", { public: true }).catch(() => null);

  for (const field of imageFields) {
    const file = formData.get(field);

    if (file instanceof File && file.size > 0) {
      const extension = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
      const filePath = `studio/${field}/${Date.now()}-${slugify(file.name || String(field))}.${extension}`;
      const bytes = await file.arrayBuffer();

      const upload = await supabase.storage.from("site-assets").upload(filePath, bytes, {
        contentType: file.type || "image/jpeg",
        upsert: true
      });

      if (upload.error) {
        return NextResponse.json({ error: upload.error.message }, { status: 500 });
      }

      nextSettings[field] = supabase.storage.from("site-assets").getPublicUrl(filePath).data.publicUrl;
    }
  }

  const { error } = await supabase.from("site_settings").upsert({
    key: "studio",
    value: nextSettings,
    updated_at: new Date().toISOString()
  }, { onConflict: "key" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ settings: nextSettings });
}

function stringValue(formData: FormData, key: string, fallback: string) {
  if (!formData.has(key)) {
    return fallback;
  }

  return String(formData.get(key) ?? "").trim();
}

function linesValue(formData: FormData, key: string, fallback: string[]) {
  if (!formData.has(key)) {
    return fallback;
  }

  const value = String(formData.get(key) ?? "").trim();
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function reviewsValue(formData: FormData) {
  const length = Math.max(0, Number(formData.get("reviewsLength") ?? defaultStudioSettings.reviews.length) || 0);

  return Array.from({ length }).map((_, index) => ({
    author: stringValue(formData, `reviewAuthor${index}`, "Client FRTP"),
    rating: stringValue(formData, `reviewRating${index}`, "5"),
    text: String(formData.get(`reviewText${index}`) ?? "").trim(),
    source: stringValue(formData, `reviewSource${index}`, "Google")
  })).filter((review) => review.text);
}

async function hasAdminAccess(userId: string) {
  const supabase = getSupabaseAdmin();

  if (!supabase) return false;

  const { data, error } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!error) {
    return Boolean(data);
  }

  if (error.code === "PGRST205" || error.message.includes("Could not find the table")) {
    return true;
  }

  return false;
}
