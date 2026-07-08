// Informations centrales du site, réutilisées pour le SEO, le sitemap,
// les données structurées et le footer.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.frtp.fr").replace(/\/$/, "");

export const SITE_NAME = "FRTP";

export const SITE_DESCRIPTION =
  "FRTP, entreprise de travaux publics à Fréjus : terrassement, VRD, assainissement, voirie, réseaux et aménagements extérieurs dans le Var et les Alpes-Maritimes.";

export const business = {
  legalName: "FRTP",
  phone: "+33658017171",
  phoneDisplay: "06 58 01 71 71",
  email: "contact@frtp.fr",
  streetAddress: "51 rue Girardin",
  postalCode: "83600",
  city: "Fréjus",
  region: "Provence-Alpes-Côte d'Azur",
  country: "FR",
  latitude: 43.434007,
  longitude: 6.735731,
  areaServed: ["Var", "Alpes-Maritimes", "Fréjus", "Saint-Raphaël", "Cannes", "Le Cannet"]
};

// JSON-LD LocalBusiness pour le référencement local (pack Google).
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    legalName: business.legalName,
    url: SITE_URL,
    image: `${SITE_URL}/brand/frtp-logo.png`,
    logo: `${SITE_URL}/brand/frtp-logo.png`,
    telephone: business.phone,
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.streetAddress,
      postalCode: business.postalCode,
      addressLocality: business.city,
      addressRegion: business.region,
      addressCountry: business.country
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.latitude,
      longitude: business.longitude
    },
    areaServed: business.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
    description: SITE_DESCRIPTION,
    vatID: "FR03980664080",
    knowsAbout: [
      "Terrassement",
      "VRD",
      "Assainissement",
      "Voirie",
      "Réseaux secs et humides",
      "Aménagements extérieurs",
      "Démolition"
    ]
  };
}
