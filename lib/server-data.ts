import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { defaultBeforeAfterItems, type BeforeAfterItem } from "@/lib/before-after";
import { activities as fallbackActivities, news as fallbackNews, projects as fallbackProjects } from "@/lib/data";
import { defaultProjectHeroSettings, normalizeProjectHeroSettingsMap, type ProjectHeroSettings } from "@/lib/project-hero";
import { defaultStudioSettings, type StudioSettings } from "@/lib/studio";

export type SiteProject = (typeof fallbackProjects)[number] & {
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
  project_categories: { name: string | null } | Array<{ name: string | null }> | null;
  project_images: ProjectImageRow[] | null;
};

export async function getProjectsForSite(): Promise<SiteProject[]> {
  const supabase = getSupabaseAdmin();

  if (!isSupabaseConfigured || !supabase) {
    return fallbackProjects;
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, slug, city, short_description, description, initial_problem, works_done, work_date, project_categories(name), project_images(image_url, image_type, sort_order)"
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return fallbackProjects;
  }

  const heroSettingsResult = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "project_hero_settings")
    .maybeSingle();
  const heroSettingsMap = heroSettingsResult.error
    ? {}
    : normalizeProjectHeroSettingsMap(heroSettingsResult.data?.value);

  return (data as unknown as ProjectRow[]).map((project) => {
    const category = Array.isArray(project.project_categories)
      ? project.project_categories[0]
      : project.project_categories;
    const orderedImages = project.project_images
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
      title: project.title,
      slug: project.slug,
      city: project.city ?? "Frejus",
      category: category?.name ?? "Travaux publics",
      date: project.work_date ? new Date(project.work_date).getFullYear().toString() : "A venir",
      image,
      heroSettings: {
        ...projectHeroSettings,
        imageUrl: image
      },
      short: project.short_description ?? "Chantier FRTP publie depuis l'administration.",
      problem: project.initial_problem ?? "Contrainte terrain analysee avant intervention.",
      works: project.works_done
        ? project.works_done.split(/\n|,/).map((item) => item.trim()).filter(Boolean)
        : ["Preparation", "Execution", "Controle", "Remise en etat"],
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
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt ?? "",
    content: item.content,
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
        || "Analyse du besoin, reperage des contraintes, organisation des acces, execution des travaux et remise en etat de la zone d'intervention."
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

  return (data.value as BeforeAfterItem[])
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

  return {
    ...defaultStudioSettings,
    ...(data.value as Partial<StudioSettings>)
  };
}
