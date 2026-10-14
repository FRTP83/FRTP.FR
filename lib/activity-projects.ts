type Activity = { title: string; slug: string; featuredProjectId?: string };
type Project = { id?: string; categories: string[] };

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// An explicit choice always wins. If it is unpublished, hide its photo instead
// of silently replacing it with a different chantier.
export function projectForActivity<T extends Project>(activity: Activity, projects: T[]): T | undefined {
  if (activity.featuredProjectId === "none") return undefined;
  if (activity.featuredProjectId) return projects.find(project => project.id === activity.featuredProjectId);
  const terms = [normalize(activity.title), normalize(activity.slug).replace(/-/g, " ")];
  return projects.find(project => project.categories.some(category => {
    const name = normalize(category);
    return terms.some(term => name === term || name.includes(term) || term.includes(name));
  }));
}
