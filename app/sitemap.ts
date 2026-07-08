import type { MetadataRoute } from "next";
import { activities, projects } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export const revalidate = 86400;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

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
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7
  }));

  const activityRoutes = activities.map((activity) => ({
    url: `${SITE_URL}/activites/${activity.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${SITE_URL}/realisations/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5
  }));

  return [...staticRoutes, ...activityRoutes, ...projectRoutes];
}
