import { ConstructionExplorer, type ConstructionZone } from "@/components/ConstructionExplorer";
import { projectForActivity } from "@/lib/activity-projects";
import type { SiteActivity, SiteProject } from "@/lib/server-data";

const zones: Record<string, ConstructionZone> = {
  terrassement: "earthwork", vrd: "connections", assainissement: "drainage",
  voirie: "road", reseaux: "utilities", "amenagements-exterieurs": "landscaping"
};

export function HomeActivityExplorer({ activities, projects, heading }: {
  activities: SiteActivity[]; projects: SiteProject[]; heading: string;
}) {
  return <div id="frtp-activities-explorer"><ConstructionExplorer heading={heading} introduction="" allActivitiesHref="/activites" activities={activities.filter(activity => zones[activity.slug]).map(activity => {
    const project = projectForActivity(activity, projects);
    return {
      id: activity.slug, zone: zones[activity.slug], title: activity.title,
      description: activity.description, services: activity.services,
      href: `/activites/${activity.slug}`,
      ...(project ? { photo: { src: project.image, alt: project.title, caption: project.title, href: `/realisations/${project.slug}` } } : {})
    };
  })} /></div>;
}
