import {
  Building2,
  Cable,
  Construction,
  Droplets,
  Hammer,
  MapPinned,
  Mountain,
  Route
} from "lucide-react";

export const navItems = [
  { label: "Accueil", href: "/" },
  { label: "Entreprise", href: "/entreprise" },
  { label: "Prestations", href: "/activites" },
  { label: "Réalisations", href: "/realisations" },
  { label: "Avant / Après", href: "/avant-apres" },
  { label: "Actualités", href: "/actualites" },
  { label: "Contact", href: "/contact" }
];

export const prestationsNavItems = [
  { label: "Nos prestations", href: "/activites#prestations" },
  { label: "Zones d’intervention", href: "/activites#zones-intervention" }
];

export const activities = [
  {
    title: "Terrassement",
    slug: "terrassement",
    icon: Mountain,
    description:
      "Préparations de plateformes, décaissements, fouilles, accès chantier et remodelage de terrains.",
    services: ["Décaissement", "Fouilles en rigoles", "Évacuation des déblais", "Préparation de plateformes"]
  },
  {
    title: "VRD",
    slug: "vrd",
    icon: Route,
    description:
      "Voiries, réseaux divers, raccordements et aménagements techniques pour sites privés ou collectifs.",
    services: ["Tranchées techniques", "Regards et fourreaux", "Raccordements", "Reprises de voirie"]
  },
  {
    title: "Assainissement",
    slug: "assainissement",
    icon: Droplets,
    description:
      "Création, reprise et mise en conformité de réseaux d'eaux usées et eaux pluviales.",
    services: ["Eaux usées", "Eaux pluviales", "Drainage", "Mise en conformité"]
  },
  {
    title: "Voirie",
    slug: "voirie",
    icon: Construction,
    description:
      "Création et réfection de chemins, parkings, accès, bordures, enrobés et revêtements.",
    services: ["Parkings", "Accès véhicules", "Bordures", "Enrobés et finitions"]
  },
  {
    title: "Réseaux secs et humides",
    slug: "reseaux",
    icon: Cable,
    description:
      "Pose de fourreaux, tranchage, réseaux télécom, électricité, alimentation et évacuations.",
    services: ["Télécom", "Électricité", "AEP", "Réseaux humides"]
  },
  {
    title: "Aménagements extérieurs",
    slug: "amenagements-exterieurs",
    icon: Building2,
    description:
      "Mise en forme des abords, cours, cheminements, soutènements légers et finitions de terrain.",
    services: ["Cours", "Cheminements", "Abords de villas", "Finitions terrain"]
  },
  {
    title: "Démolition / reprise",
    slug: "demolition-reprise",
    icon: Hammer,
    description:
      "Interventions ciblées pour dépose, reprise de malfaçons, remise en sécurité et préparation travaux.",
    services: ["Dépose", "Reprise de malfaçons", "Curage", "Remise en sécurité"]
  }
];

export type Project = {
  title: string;
  slug: string;
  city: string;
  cityCode?: string;
  departmentCode?: string;
  departmentName?: string;
  category: string;
  categories: string[];
  date: string;
  image: string;
  short: string;
  problem: string;
  works: string[];
};

// Les réalisations publiques proviennent exclusivement de Supabase.
export const projects: Project[] = [];

export const stats = [
  { value: "83", label: "Var, secteur principal" },
  { value: "06", label: "Interventions Alpes-Maritimes" },
  { value: "7", label: "Familles de prestations" },
  { value: "2026", label: "Chantiers documentés" }
];

export type News = {
  title: string;
  slug: string;
  excerpt: string;
  is_archived?: boolean;
};

// Seuls les articles réellement publiés dans l'administration sont affichés.
export const news: News[] = [];

export const serviceArea = [
  "Fréjus",
  "Saint-Raphaël",
  "Roquebrune-sur-Argens",
  "Puget-sur-Argens",
  "Le Cannet",
  "Cannes",
  "Alpes-Maritimes",
  "Var"
];

export const contactTypes = [
  "Terrassement",
  "VRD",
  "Assainissement",
  "Voirie",
  "Réseaux",
  "Aménagements extérieurs",
  "Démolition / reprise",
  "Autre demande"
];

export const mapIcon = MapPinned;
