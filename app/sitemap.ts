import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getActivitiesForSite, getNewsForSite, getProjectsForSite } from "@/lib/server-data";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [activities, projects, news] = await Promise.all([
    getActivitiesForSite(),
    getProjectsForSite(),
    getNewsForSite()
  ]);

  const staticRoutes = [
    "",
    "/entreprise",
    "/activites",
    "/realisations",
    "/avant-apres",
    "/actualites",
    "/contact",
    "/mentions-legales",
    "/politique-confidentialite"
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7
  }));

  const activityRoutes = activities.map((activity) => ({
    url: `${SITE_URL}/activites/${activity.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${SITE_URL}/realisations/${project.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5
  }));

  const newsRoutes = news.map((item) => ({
    url: `${SITE_URL}/actualites/${item.slug}`,
    lastModified: item.created_at ? new Date(item.created_at) : undefined,
    changeFrequency: "monthly" as const,
    priority: 0.5
  }));

  return [...staticRoutes, ...activityRoutes, ...projectRoutes, ...newsRoutes];
}
