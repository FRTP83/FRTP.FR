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
  phone: "06 58 01 72 71",
  email: "contact@frtp.fr",
  address: "51 rue Girardin, 83600 Fréjus",
  footerText: "Terrassement, VRD, assainissement, voirie et aménagements extérieurs dans le Var et les Alpes-Maritimes.",
  stats: defaultStats,
  legalTitle: "Mentions légales",
  legalText: [
    "Dernière mise à jour",
    "23 août 2026.",
    "Éditeur du site",
    "Le site frtp.fr est édité par FRTP, société par actions simplifiée unipersonnelle (SASU) au capital social de 20 000 €.",
    "Siège social : 51 rue Girardin, 83600 Fréjus, France.",
    "SIREN : 980 664 080.",
    "SIRET : 980 664 080 00010.",
    "Immatriculation : 980 664 080 R.C.S. Fréjus.",
    "Numéro de TVA intracommunautaire : FR03980664080.",
    "Code APE : 43.12A.",
    "Téléphone : 06 58 01 72 71.",
    "Adresse électronique : contact@frtp.fr.",
    "Directeur de la publication",
    "Fabien Rolling, Président de FRTP.",
    "Hébergement et nom de domaine",
    "Le site est hébergé par Netlify, Inc., 101 2nd Street, San Francisco, CA 94105, États-Unis. Contact : support@netlify.com. Site : https://www.netlify.com.",
    "Le nom de domaine frtp.fr et sa zone DNS sont gérés par OVH SAS, 2 rue Kellermann, 59100 Roubaix, France. Site : https://www.ovhcloud.com.",
    "Propriété intellectuelle",
    "La structure du site, les textes, photographies, illustrations, éléments graphiques et le logo FRTP sont protégés par le droit de la propriété intellectuelle. Toute reproduction, représentation, adaptation ou exploitation, totale ou partielle, sans autorisation écrite préalable de FRTP est interdite, sous réserve des exceptions prévues par la loi.",
    "Responsabilité",
    "FRTP veille à l'exactitude et à la mise à jour des informations publiées. Ces informations sont fournies à titre général et ne constituent ni un devis ni un engagement contractuel. FRTP ne peut être tenue responsable d'une indisponibilité temporaire du site, d'une erreur involontaire ou de l'utilisation faite des informations publiées.",
    "Données personnelles",
    "Les modalités de collecte et de traitement des données personnelles sont détaillées dans la page Politique de confidentialité, accessible depuis le pied de page du site.",
    "Cookies et traceurs",
    "La partie publique du site n'utilise actuellement aucun cookie publicitaire ni traceur de mesure d'audience. Les seuls mécanismes techniques éventuellement utilisés dans l'espace d'administration sont strictement nécessaires à son authentification et à sa sécurité."
  ].join("\n\n"),
  privacyTitle: "Politique de confidentialité",
  privacyText: [
    "Dernière mise à jour",
    "23 août 2026.",
    "Responsable du traitement",
    "FRTP, société par actions simplifiée unipersonnelle, 51 rue Girardin, 83600 Fréjus, France. Contact pour toute question relative aux données personnelles : contact@frtp.fr.",
    "Données traitées",
    "Lorsque vous utilisez le formulaire de contact, FRTP traite les informations obligatoires suivantes : nom, adresse électronique, numéro de téléphone, commune du chantier, type de travaux et message. Le nom de société est facultatif.",
    "L'adresse IP est utilisée temporairement, pendant 10 minutes au maximum, uniquement pour limiter les envois abusifs. Elle n'est pas enregistrée dans la base des demandes de contact par l'application.",
    "Les prestataires techniques peuvent également générer des journaux nécessaires à la sécurité et au fonctionnement du service, notamment l'adresse IP, la date et l'heure de la requête, le type de navigateur, l'URL demandée et des informations de diagnostic.",
    "Finalités et bases légales",
    "- Répondre aux demandes de renseignement ou de devis et préparer une éventuelle relation contractuelle : exécution de mesures précontractuelles demandées par la personne.",
    "- Assurer le suivi des échanges et des prospects : intérêt légitime de FRTP à gérer son activité et ses relations commerciales.",
    "- Prévenir les abus, sécuriser le site et diagnostiquer les incidents : intérêt légitime de FRTP à protéger ses services.",
    "FRTP n'utilise pas les données du formulaire pour envoyer une newsletter ou de la prospection automatisée. Aucune décision automatisée ni aucun profilage n'est réalisé.",
    "Caractère obligatoire des informations",
    "Les champs signalés comme obligatoires sont nécessaires pour comprendre la demande et y répondre. Sans ces informations, FRTP ne pourra pas traiter la demande. Le champ société peut être laissé vide.",
    "Destinataires et prestataires",
    "Les données sont accessibles uniquement aux personnes habilitées au sein de FRTP et, dans la limite de leurs missions, aux prestataires techniques suivants :",
    "- Supabase : base de données des demandes, authentification de l'administration et stockage des contenus. Le projet principal est hébergé dans la région Irlande.",
    "- Resend, service de Plus Five Five, Inc. : acheminement des notifications contenant les informations envoyées par le formulaire.",
    "- Google Workspace : réception et gestion des messages dans la boîte contact@frtp.fr.",
    "- Netlify, Inc. : hébergement du site, exécution du formulaire et journaux techniques.",
    "- OVHcloud : enregistrement du nom de domaine et gestion DNS. OVHcloud ne reçoit pas le contenu du formulaire dans le fonctionnement normal du site.",
    "Les données ne sont ni vendues ni louées et ne sont pas communiquées à des tiers pour leur propre prospection commerciale.",
    "Transferts hors de l'Espace économique européen",
    "Supabase stocke principalement les données du projet dans la région Irlande. Resend indique que ses opérations principales de traitement se situent aux États-Unis. Netlify, Google et certains sous-traitants techniques peuvent également traiter des données depuis des pays situés hors de l'Espace économique européen.",
    "Lorsque ces traitements impliquent un transfert vers un pays ne bénéficiant pas d'une décision d'adéquation, les prestataires déclarent les encadrer notamment par les clauses contractuelles types approuvées par la Commission européenne et par des mesures de sécurité complémentaires. Une information sur les garanties applicables peut être demandée à FRTP à l'adresse contact@frtp.fr.",
    "Durées de conservation",
    "Les demandes de contact et les échanges associés sont conservés pendant 3 ans à compter du dernier contact avec le prospect, puis supprimés. Si une relation contractuelle est conclue, les informations nécessaires sont intégrées au dossier client et conservées pendant les durées légales applicables aux documents contractuels, comptables et aux garanties.",
    "L'adresse IP utilisée par le mécanisme de limitation des envois est conservée en mémoire pendant 10 minutes au maximum. Les journaux techniques et copies de sauvegarde sont conservés pendant les durées strictement nécessaires à la sécurité, au diagnostic et à la continuité du service, selon les cycles de conservation des prestataires, puis supprimés ou rendus anonymes.",
    "Sécurité",
    "FRTP met en œuvre des mesures techniques et organisationnelles adaptées, notamment le chiffrement des échanges, le contrôle des accès à l'administration, des règles d'accès à la base de données, la limitation des envois et la restriction des données collectées. Aucun système ne pouvant offrir une sécurité absolue, FRTP réévalue ces mesures en fonction des risques et de l'évolution des services.",
    "Vos droits",
    "Vous pouvez demander l'accès à vos données, leur rectification, leur effacement, la limitation de leur traitement ou vous opposer aux traitements fondés sur l'intérêt légitime. Vous disposez également du droit à la portabilité lorsqu'il est applicable et du droit de définir des directives relatives au sort de vos données après votre décès.",
    "Pour exercer vos droits, écrivez à contact@frtp.fr en précisant votre demande. Une preuve d'identité pourra être demandée uniquement en cas de doute raisonnable sur votre identité. FRTP répond dans les délais prévus par la réglementation.",
    "Vous pouvez introduire une réclamation auprès de la Commission nationale de l'informatique et des libertés, CNIL, 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07. Site : https://www.cnil.fr.",
    "Cookies et services tiers",
    "La partie publique du site ne dépose actuellement aucun cookie de mesure d'audience ou de publicité et n'intègre aucun traceur marketing. Aucun bandeau de consentement n'est donc affiché. Si de tels outils sont ajoutés, cette politique sera mise à jour et le consentement sera recueilli avant leur activation lorsque la loi l'exige.",
    "Évolution de la politique",
    "FRTP peut modifier la présente politique pour tenir compte d'une évolution légale, technique ou fonctionnelle. La date de mise à jour affichée en haut de cette page permet d'identifier la version en vigueur."
  ].join("\n\n")
};
