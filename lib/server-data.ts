import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { defaultBeforeAfterItems, type BeforeAfterItem } from "@/lib/before-after";
import { activities as fallbackActivities, news as fallbackNews, projects as fallbackProjects } from "@/lib/data";
import { defaultProjectHeroSettings, normalizeProjectHeroSettingsMap, type ProjectHeroSettings } from "@/lib/project-hero";
import { defaultStudioSettings, type StudioSettings } from "@/lib/studio";
import { normalizeCopyObject, normalizeFrenchCopy } from "@/lib/french-copy";

export type SiteProject = (typeof fallbackProjects)[number] & {
  categories: string[];
  galleryImages?: Array<{
    url: string;
    type: string;
  }>;
  heroSettings?: ProjectHeroSettings;
};
export type SiteNews = (typeof fallbackNews)[number] & {
  content?: string | null;
  cover_image_url?: string | null;
  created_at?: string | null;
};
export type SiteActivity = (typeof fallbackActivities)[number] & {
  interventionExample: string;
};


type ProjectImageRow = {
  image_url: string;
  image_type: string;
  sort_order: number | null;
};

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  city: string | null;
  short_description: string | null;
  description: string | null;
  initial_problem: string | null;
  works_done: string | null;
  work_date: string | null;
  category_id: string | null;
};

type ProjectCategoryLinkRow = {
  project_id: string;
  category_id: string;
};

export async function getProjectsForSite(): Promise<SiteProject[]> {
  const supabase = getSupabaseAdmin();

  if (!isSupabaseConfigured || !supabase) {
    return fallbackProjects;
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, slug, city, short_description, description, initial_problem, works_done, work_date, category_id"
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return fallbackProjects;
  }

  const projectIds = data.map((project) => project.id);
  const [categoryLinksResult, categoriesResult, imagesResult] = await Promise.all([
    supabase.from("project_category_links").select("project_id, category_id").in("project_id", projectIds),
    supabase.from("project_categories").select("id, name"),
    supabase.from("project_images").select("project_id, image_url, image_type, sort_order").in("project_id", projectIds)
  ]);
  const categoryNameById = new Map((categoriesResult.data ?? []).map((item) => [item.id, item.name]));
  const categoryIdsByProject = new Map<string, string[]>();
  const imagesByProject = new Map<string, ProjectImageRow[]>();

  (categoryLinksResult.data as ProjectCategoryLinkRow[] | null)?.forEach((link) => {
    categoryIdsByProject.set(link.project_id, [...(categoryIdsByProject.get(link.project_id) ?? []), link.category_id]);
  });
  (imagesResult.data ?? []).forEach((image) => {
    const row = { image_url: image.image_url, image_type: image.image_type, sort_order: image.sort_order };
    imagesByProject.set(image.project_id, [...(imagesByProject.get(image.project_id) ?? []), row]);
  });

  const heroSettingsResult = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "project_hero_settings")
    .maybeSingle();
  const heroSettingsMap = heroSettingsResult.error
    ? {}
    : normalizeProjectHeroSettingsMap(heroSettingsResult.data?.value);

  return (data as unknown as ProjectRow[]).map((project) => {
    const primaryCategory = project.category_id ? categoryNameById.get(project.category_id) : null;
    const linkedCategories = (categoryIdsByProject.get(project.id) ?? [])
      .map((categoryId) => categoryNameById.get(categoryId))
      .filter((name): name is string => Boolean(name));
    const categories = Array.from(new Set([
      ...linkedCategories,
      ...(primaryCategory ? [primaryCategory] : [])
    ])).map(normalizeFrenchCopy);
    const orderedImages = imagesByProject.get(project.id)
      ?.slice()
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)) ?? [];
    const projectHeroSettings = {
      ...defaultProjectHeroSettings,
      ...(heroSettingsMap[project.id] ?? heroSettingsMap[project.slug] ?? {})
    };
    const fallbackImage =
      orderedImages.find((item) => item.image_type === "gallery" || item.image_type === "after" || item.image_type === "before")
        ?.image_url ?? "/chantier/horizon-hero.jpeg";
    const image = projectHeroSettings.imageUrl || fallbackImage;

    return {
      title: normalizeFrenchCopy(project.title),
      slug: project.slug,
      city: normalizeFrenchCopy(project.city ?? "Fréjus"),
      category: normalizeFrenchCopy(primaryCategory ?? categories[0] ?? "Travaux publics"),
      categories: categories.length ? categories : ["Travaux publics"],
      date: project.work_date ? new Date(project.work_date).getFullYear().toString() : "À venir",
      image,
      heroSettings: {
        ...projectHeroSettings,
        imageUrl: image
      },
      short: normalizeFrenchCopy(project.short_description ?? "Chantier FRTP publié depuis l'administration."),
      problem: normalizeFrenchCopy(project.initial_problem ?? "Contrainte terrain analysée avant intervention."),
      works: project.works_done
        ? project.works_done.split(/\n|,/).map((item) => normalizeFrenchCopy(item.trim())).filter(Boolean)
        : ["Préparation", "Exécution", "Contrôle", "Remise en état"],
      galleryImages: orderedImages.map((item) => ({
        url: item.image_url,
        type: item.image_type
      }))
    };
  });
}

export async function getProjectForSite(slug: string): Promise<SiteProject | null> {
  const allProjects = await getProjectsForSite();
  return allProjects.find((project) => project.slug === slug)
    ?? fallbackProjects.find((project) => project.slug === slug)
    ?? null;
}

export async function getNewsForSite(): Promise<SiteNews[]> {
  const supabase = getSupabaseAdmin();

  if (!isSupabaseConfigured || !supabase) {
    return fallbackNews;
  }

  const { data, error } = await supabase
    .from("news")
    .select("title, slug, excerpt, content, cover_image_url, created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return fallbackNews;
  }

  return data.map((item) => ({
    title: normalizeFrenchCopy(item.title),
    slug: item.slug,
    excerpt: normalizeFrenchCopy(item.excerpt ?? ""),
    content: item.content ? normalizeFrenchCopy(item.content) : item.content,
    cover_image_url: item.cover_image_url,
    created_at: item.created_at
  }));
}

export async function getActivitiesForSite(): Promise<SiteActivity[]> {
  const studio = await getStudioSettings();

  return fallbackActivities.map((activity) => {
    const studioActivity = studio.activities.find((item) => item.slug === activity.slug);

    return {
      ...activity,
      title: studioActivity?.title || activity.title,
      description: studioActivity?.description || activity.description,
      services: studioActivity?.services?.length ? studioActivity.services : activity.services,
      interventionExample:
        studioActivity?.interventionExample
        || "Analyse du besoin, repérage des contraintes, organisation des accès, exécution des travaux et remise en état de la zone d'intervention."
    };
  });
}

export async function getBeforeAfterItemsForSite(): Promise<BeforeAfterItem[]> {
  const supabase = getSupabaseAdmin();

  if (!isSupabaseConfigured || !supabase) {
    return defaultBeforeAfterItems;
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "before_after_items")
    .maybeSingle();

  if (error || !Array.isArray(data?.value)) {
    return defaultBeforeAfterItems;
  }

  return normalizeCopyObject(data.value as BeforeAfterItem[])
    .filter((item) => item.isPublished)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export async function getStudioSettings(): Promise<StudioSettings> {
  const supabase = getSupabaseAdmin();

  if (!isSupabaseConfigured || !supabase) {
    return defaultStudioSettings;
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "studio")
    .maybeSingle();

  if (error || !data?.value || typeof data.value !== "object") {
    return defaultStudioSettings;
  }

  return normalizeCopyObject({
    ...defaultStudioSettings,
    ...(data.value as Partial<StudioSettings>),
    address: normalizeStudioAddress((data.value as Partial<StudioSettings>).address)
  });
}

function normalizeStudioAddress(value: string | undefined) {
  const address = value?.trim() || defaultStudioSettings.address;
  return address.replace(/\bImplantee a\b/i, "Implantée à").replace(/\bImplantée a\b/i, "Implantée à");
}
