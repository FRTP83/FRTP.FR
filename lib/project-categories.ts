const activityAliases: Record<string, string[]> = {
  terrassement: ["terrassement"],
  vrd: ["vrd", "voiries reseaux divers"],
  assainissement: ["assainissement", "eaux usees", "eaux pluviales"],
  voirie: ["voirie"],
  reseaux: ["reseaux", "reseaux secs", "reseaux humides", "telecom", "electricite"],
  "amenagements-exterieurs": ["amenagements exterieurs", "amenagement", "abords"],
  "demolition-reprise": ["demolition", "reprise"]
};

export function categoryMatchesActivity(category: string, activitySlug: string, activityTitle: string) {
  const normalizedCategory = normalize(category);
  return [activitySlug, activityTitle, ...(activityAliases[activitySlug] ?? [])].some((candidate) => {
    const normalizedCandidate = normalize(candidate);
    return normalizedCategory === normalizedCandidate || normalizedCategory.includes(normalizedCandidate);
  });
}

export function activitySlugForCategory(category: string) {
  return Object.keys(activityAliases).find((slug) =>
    categoryMatchesActivity(category, slug, slug.replaceAll("-", " "))
  );
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
