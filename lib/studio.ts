import { activities as defaultActivities, stats as defaultStats } from "@/lib/data";

export type StudioActivity = {
  slug: string;
  title: string;
  description: string;
  services: string[];
  interventionExample: string;
};

export type StudioStat = {
  value: string;
  label: string;
};

export type StudioReview = {
  author: string;
  rating: string;
  text: string;
  source: string;
};

export type StudioSettings = {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroEyebrow: string;
  heroPanelEyebrow: string;
  heroPanelTitle: string;
  heroPanelItems: string[];
  homeActivitiesTitle: string;
  homeActivitiesText: string;
  homeProjectsTitle: string;
  homeProjectsText: string;
  reviewsEyebrow: string;
  reviewsTitle: string;
  reviewsText: string;
  reviewsRating: string;
  reviewsCount: string;
  reviewsGoogleUrl: string;
  reviews: StudioReview[];
  homeCtaTitle: string;
  companyTitle: string;
  companyIntro: string;
  companyImage: string;
  companyCards: Array<{ title: string; text: string }>;
  companyPillars: string[];
  serviceArea: string[];
  methodTitle: string;
  methodText: string;
  methodSteps: Array<{ number: string; title: string; text: string }>;
  activitiesPageTitle: string;
  activitiesPageText: string;
  activities: StudioActivity[];
  projectsPageTitle: string;
  projectsPageText: string;
  newsPageTitle: string;
  newsPageText: string;
  beforeAfterTitle: string;
  beforeAfterText: string;
  beforeImage: string;
  afterImage: string;
  contactTitle: string;
  contactPageText: string;
  contactText: string;
  phone: string;
  email: string;
  address: string;
  footerText: string;
  stats: StudioStat[];
  legalTitle: string;
  legalText: string;
  privacyTitle: string;
  privacyText: string;
};

export const defaultStudioSettings: StudioSettings = {
  heroTitle: "FRTP - Terrassement, VRD et travaux publics",
  heroSubtitle:
    "Entreprise spécialisée en terrassement, voirie, réseaux divers, assainissement et aménagements extérieurs dans le Var et les Alpes-Maritimes.",
  heroImage: "/chantier/horizon-hero.jpeg",
  heroEyebrow: "Fréjus - Var - Alpes-Maritimes",
  heroPanelEyebrow: "Identité FRTP",
  heroPanelTitle: "Sobre, technique, solide. Une présence terrain avant tout.",
  heroPanelItems: ["Travaux publics", "VRD", "Terrassement", "Assainissement"],
  homeActivitiesTitle: "Des prestations lisibles, du premier coup de pelle à la remise en état.",
  homeActivitiesText:
    "Le site est structuré autour des métiers FRTP : terrassement, VRD, réseaux, assainissement, voirie et aménagements extérieurs.",
  homeProjectsTitle: "Chantiers récents et interventions documentées.",
  homeProjectsText:
    "Les cartes chantier mettent les photos en premier, puis la commune, la catégorie et l'intervention réalisée.",
  reviewsEyebrow: "Avis Google",
  reviewsTitle: "Des retours clients qui comptent autant que les photos de chantier.",
  reviewsText:
    "Les avis affichés ici sont repris depuis la fiche Google FRTP et peuvent être mis à jour depuis le Studio.",
  reviewsRating: "",
  reviewsCount: "Avis Google",
  reviewsGoogleUrl: "https://www.google.com/search?q=FRTP+Fréjus+avis+Google",
  reviews: [],
  homeCtaTitle: "Un chantier à chiffrer dans le Var ou les Alpes-Maritimes ?",
  companyTitle: "Une société de travaux publics implantée localement.",
  companyIntro:
    "FRTP est une société de travaux publics spécialisée dans les travaux de terrassement, VRD, assainissement, voirie et aménagements extérieurs.",
  companyImage: "/chantier/les-chenes.jpg",
  companyCards: [
    {
      title: "Implantation locale",
      text: "Basée à Fréjus, l'entreprise intervient principalement dans le Var et les Alpes-Maritimes."
    },
    {
      title: "Savoir-faire terrain",
      text: "Les interventions sont pensées pour les contraintes d'accès, les réseaux existants et les sites occupés."
    },
    {
      title: "Moyens humains et matériels",
      text: "Organisation simple, réactive et adaptée aux chantiers de particuliers, syndics, professionnels et collectivités."
    },
    {
      title: "Engagements",
      text: "Sérieux, sécurité, qualité d'exécution et suivi clair de chaque demande."
    }
  ],
  companyPillars: ["Exécution technique", "Moyens chantier", "Sécurité", "Proximité"],
  serviceArea: [
    "Fréjus",
    "Saint-Raphaël",
    "Roquebrune-sur-Argens",
    "Puget-sur-Argens",
    "Le Cannet",
    "Cannes",
    "Alpes-Maritimes",
    "Var"
  ],
  methodTitle: "Une lecture claire du chantier avant l'intervention.",
  methodText:
    "Le site doit montrer la même rigueur que l'entreprise : diagnostic, organisation, exécution, contrôle et preuve photo.",
  methodSteps: [
    { number: "01", title: "Repérage", text: "Contraintes d'accès, réseaux existants, volumes et sécurité." },
    { number: "02", title: "Préparation", text: "Choix du matériel, planning, protection des zones sensibles." },
    { number: "03", title: "Exécution", text: "Terrassement, pose, reprise ou finition avec suivi terrain." },
    { number: "04", title: "Réception", text: "Photos, nettoyage, points restants et remise en circulation." }
  ],
  activitiesPageTitle: "Terrassement, VRD, réseaux, voirie et aménagements.",
  activitiesPageText:
    "Chaque activité dispose d'une page claire avec prestations, exemples d'intervention et lien vers les chantiers associés.",
  activities: defaultActivities.map((activity) => ({
    slug: activity.slug,
    title: activity.title,
    description: activity.description,
    services: activity.services,
    interventionExample:
      "Analyse du besoin, repérage des contraintes, organisation des accès, exécution des travaux et remise en état de la zone d'intervention."
  })),
  projectsPageTitle: "Des chantiers présentés par commune, catégorie et intervention.",
  projectsPageText: "Cette page affiche les chantiers publiés depuis l'espace admin Supabase.",
  newsPageTitle: "Actualités FRTP.",
  newsPageText: "Retrouvez les dernières informations de l'entreprise, les chantiers récents et les interventions réalisées sur le terrain.",
  beforeAfterTitle: "Montrer le terrain, pas seulement le discours.",
  beforeAfterText:
    "La page avant / après est prévue pour comparer les photos de chantier par phase : avant, pendant et après intervention.",
  beforeImage: "/chantier/bastide-jessica.jpeg",
  afterImage: "/chantier/park-sainte-estelle.jpg",
  contactTitle: "Décrivez votre chantier, FRTP reprend contact.",
  contactPageText: "Le formulaire enregistre les demandes dans Supabase.",
  contactText:
    "Indiquez la commune, le type de travaux, les contraintes d'accès, le niveau d'urgence et les photos disponibles.",
  phone: "06 58 01 71 71",
  email: "contact@frtp.fr",
  address: "51 rue Girardin, 83600 Fréjus",
  footerText: "Terrassement, VRD, assainissement, voirie et aménagements extérieurs dans le Var et les Alpes-Maritimes.",
  stats: defaultStats,
  legalTitle: "Mentions légales",
  legalText: [
    "Éditeur du site : FRTP, société par actions simplifiée unipersonnelle (SASU) au capital de 20 000 €.",
    "Siège social : 51 rue Girardin, 83600 Fréjus.",
    "SIREN : 980 664 080 - RCS : 980 664 080 R.C.S. Fréjus - TVA intracommunautaire : FR03980664080.",
    "Directeur de la publication : Fabien Rolling, Président.",
    "Contact : 06 58 01 71 71 - contact@frtp.fr.",
    "Hébergement : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis (vercel.com).",
    "Le contenu du site, les textes, les images et le logo FRTP sont protégés. Toute reproduction non autorisée est interdite."
  ].join("\n\n"),
  privacyTitle: "Politique de confidentialité",
  privacyText: [
    "Responsable de traitement : FRTP, 51 rue Girardin, 83600 Fréjus - contact@frtp.fr.",
    "Finalité : les données transmises via le formulaire de contact sont utilisées uniquement pour répondre aux demandes de devis et de renseignement. Base légale : mesures précontractuelles et intérêt légitime de l'entreprise.",
    "Données collectées : nom, société, email, téléphone, commune du chantier, type de travaux et message.",
    "Durée de conservation : les demandes sont conservées 3 ans à compter du dernier contact, puis supprimées ou archivées.",
    "Destinataires : les données sont traitées par FRTP et ses sous-traitants techniques (Supabase pour l'hébergement de la base, Vercel pour l'hébergement du site) ; elles ne sont ni vendues ni cédées à des tiers à des fins commerciales.",
    "Vos droits : vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et d'opposition. Pour les exercer, écrivez à contact@frtp.fr. Vous pouvez également saisir la CNIL (cnil.fr).",
    "Ce site n'utilise pas de cookies de mesure d'audience ou de publicité."
  ].join("\n\n")
};
