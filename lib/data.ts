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
  { label: "Activités", href: "/activites" },
  { label: "Réalisations", href: "/realisations" },
  { label: "Avant / Après", href: "/avant-apres" },
  { label: "Actualités", href: "/actualites" },
  { label: "Contact", href: "/contact" }
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

export const projects = [
  {
    title: "Confortement et reprise de talus",
    slug: "horizon-croisette",
    city: "Le Cannet",
    category: "Terrassement",
    categories: ["Terrassement"],
    date: "2026",
    image: "/chantier/horizon-hero.jpeg",
    short:
      "Intervention de terrassement et sécurisation de zone avec accès contraint et suivi technique.",
    problem:
      "Zone fragilisée avec besoin de remise en sécurité rapide et de maintien des circulations.",
    works: ["Préparation de l'accès", "Terrassement par zones", "Évacuation des matériaux", "Nettoyage de fin d'intervention"]
  },
  {
    title: "Reprise d'abords de villa",
    slug: "bastide-jessica",
    city: "Saint-Raphaël",
    category: "Aménagements extérieurs",
    categories: ["Aménagements extérieurs", "Terrassement"],
    date: "2026",
    image: "/chantier/bastide-jessica.jpeg",
    short:
      "Travaux extérieurs autour d'une habitation avec préparation de support et remise en état.",
    problem: "Abords déformés et zones à reprendre avant finitions.",
    works: ["Décaissement", "Préparation de fond de forme", "Reprise des niveaux", "Finitions de chantier"]
  },
  {
    title: "Cheminement piéton et VRD",
    slug: "park-sainte-estelle",
    city: "Nice",
    category: "VRD",
    categories: ["VRD", "Terrassement", "Réseaux"],
    date: "2026",
    image: "/chantier/park-sainte-estelle.jpg",
    short:
      "Création de cheminement et intervention VRD en site occupé pour habitat collectif.",
    problem: "Besoin d'un cheminement propre, lisible et durable en résidence.",
    works: ["Implantation", "Terrassement", "Pose de réseaux", "Remise en circulation"]
  },
  {
    title: "Intervention réseau télécom",
    slug: "les-chenes",
    city: "Fréjus",
    category: "Réseaux",
    categories: ["Réseaux", "Terrassement"],
    date: "2025",
    image: "/chantier/les-chenes.jpg",
    short:
      "Recherche, reprise et protection de réseau télécom sur zone de travaux publics.",
    problem: "Réseau sensible identifié pendant intervention.",
    works: ["Ouverture soignée", "Identification réseau", "Protection", "Réfection de surface"]
  }
];

export const stats = [
  { value: "83", label: "Var, secteur principal" },
  { value: "06", label: "Interventions Alpes-Maritimes" },
  { value: "7", label: "Familles de prestations" },
  { value: "2026", label: "Chantiers documentés" }
];

export const news = [
  {
    title: "Les chantiers récents de FRTP",
    slug: "chantiers-recents",
    excerpt:
      "Suivez les dernières interventions de terrassement, VRD et aménagement extérieur réalisées par FRTP."
  },
  {
    title: "L'évolution des travaux en images",
    slug: "photos-chantier",
    excerpt:
      "Les photos avant, pendant et après permettent de suivre clairement l'évolution de chaque chantier."
  }
];

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
