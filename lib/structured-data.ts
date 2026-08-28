import { SITE_NAME, SITE_URL, business } from "@/lib/site";

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`
    }))
  };
}

export function serviceJsonLd(activity: {
  slug: string;
  title: string;
  description: string;
  services: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${activity.title} à Fréjus et dans le Var`,
    serviceType: activity.title,
    description: activity.description,
    url: `${SITE_URL}/activites/${activity.slug}`,
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: business.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Prestations de ${activity.title}`,
      itemListElement: activity.services.map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name }
      }))
    }
  };
}

export function projectJsonLd(project: {
  slug: string;
  title: string;
  short: string;
  image: string;
  city: string;
  category: string;
  categories?: string[];
  date: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.short,
    url: `${SITE_URL}/realisations/${project.slug}`,
    image: absoluteUrl(project.image),
    dateCreated: project.date,
    genre: project.categories?.length ? project.categories : project.category,
    creator: { "@id": `${SITE_URL}/#business`, name: SITE_NAME },
    contentLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: project.city, addressCountry: "FR" }
    }
  };
}

export function articleJsonLd(item: {
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url?: string | null;
  created_at?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description: item.excerpt,
    url: `${SITE_URL}/actualites/${item.slug}`,
    mainEntityOfPage: `${SITE_URL}/actualites/${item.slug}`,
    image: absoluteUrl(item.cover_image_url || "/chantier/horizon-hero.jpeg"),
    ...(item.created_at ? { datePublished: item.created_at, dateModified: item.created_at } : {}),
    author: { "@id": `${SITE_URL}/#business`, name: SITE_NAME },
    publisher: { "@id": `${SITE_URL}/#business`, name: SITE_NAME }
  };
}

function absoluteUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://") ? value : `${SITE_URL}${value}`;
}
