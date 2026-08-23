import type { Metadata } from "next";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: `/${string}`;
  image?: string;
};

const defaultImage = "/chantier/horizon-hero.jpeg";

export function buildPageMetadata({
  title,
  description,
  path,
  image = defaultImage
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url: path,
      title,
      description,
      images: [{ url: image, alt: `${title} - FRTP` }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    }
  };
}
