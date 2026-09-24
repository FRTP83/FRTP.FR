export type ActivitySeoContent = {
  heading: string;
  introduction: string;
  useCases: string[];
  process: Array<{ title: string; text: string }>;
  faq: Array<{ question: string; answer: string }>;
};

const commonProcess = [
  {
    title: "Visite et repérage",
    text: "FRTP étudie les accès, les niveaux, les réseaux existants et les contraintes propres au terrain."
  },
  {
    title: "Préparation de l'intervention",
    text: "Les moyens, les terrassements et l'évacuation éventuelle des matériaux sont organisés selon le chantier."
  },
  {
    title: "Exécution et contrôle",
    text: "Les travaux sont réalisés par étapes, avec contrôle des niveaux et remise en état de la zone d'intervention."
  }
];

export const activitySeoContent: Record<string, ActivitySeoContent> = {
  terrassement: {
    heading: "Entreprise de terrassement à Fréjus",
    introduction:
      "FRTP réalise les travaux de terrassement nécessaires à la préparation d'un terrain, d'un accès ou d'une plateforme dans le Var et les Alpes-Maritimes. Chaque intervention est étudiée selon la nature du sol, les niveaux à atteindre, les accès disponibles et les réseaux présents.",
    useCases: [
      "Décaissement et mise à niveau de terrain",
      "Fouilles et tranchées pour réseaux",
      "Préparation de plateforme avant construction",
      "Création ou reprise de chemin d'accès",
      "Évacuation de terres et déblais selon les besoins du chantier",
      "Remodelage et remise en forme des abords"
    ],
    process: commonProcess,
    faq: [
      {
        question: "Dans quelles communes FRTP réalise-t-elle des terrassements ?",
        answer:
          "Basée à Fréjus, l'équipe se déplace dans le Var comme dans les Alpes-Maritimes, notamment à Saint-Raphaël, Roquebrune-sur-Argens, Puget-sur-Argens, Cannes et Nice."
      },
      {
        question: "Quels éléments faut-il fournir pour un devis de terrassement ?",
        answer:
          "L'adresse du chantier, des photos, les dimensions ou plans disponibles, le type de projet et les contraintes d'accès permettent une première étude. Une visite sur place peut ensuite être nécessaire."
      },
      {
        question: "FRTP réalise-t-elle les tranchées et l'évacuation des terres ?",
        answer:
          "Oui, les fouilles, tranchées techniques et l'évacuation des déblais font partie des prestations qui peuvent être prévues selon le besoin et les conditions du chantier."
      }
    ]
  },
  vrd: {
    heading: "Travaux VRD à Fréjus et dans le Var",
    introduction:
      "FRTP prend en charge des travaux de voirie et réseaux divers pour préparer, raccorder et aménager des terrains, résidences et sites professionnels dans le Var et les Alpes-Maritimes : tranchées techniques, fourreaux, regards, raccordements et reprises de voirie.",
    useCases: [
      "Viabilisation et raccordement d'un terrain",
      "Tranchées pour réseaux secs et humides",
      "Pose de fourreaux, regards et évacuations",
      "Réseaux d'eaux usées et d'eaux pluviales",
      "Création ou réfection d'accès et de cheminements",
      "Remise en état des surfaces après intervention"
    ],
    process: commonProcess,
    faq: [
      {
        question: "Que comprennent les travaux VRD ?",
        answer:
          "Les VRD regroupent la voirie et les réseaux divers : accès, tranchées, fourreaux, alimentation en eau, évacuations, télécommunications, électricité et raccordements selon le projet."
      },
      {
        question: "FRTP intervient-elle pour les particuliers et les professionnels ?",
        answer:
          "Oui. L'entreprise travaille pour les particuliers, les copropriétés, les entreprises ainsi que pour les donneurs d'ordre publics ou privés."
      },
      {
        question: "Peut-on demander un devis VRD dans les Alpes-Maritimes ?",
        answer:
          "Oui. Les équipes se déplacent dans les Alpes-Maritimes, notamment autour de Cannes, du Cannet et de Nice, pour les travaux de VRD, terrassement, réseaux, voirie et assainissement."
      }
    ]
  },
  assainissement: {
    heading: "Travaux d'assainissement dans le Var et les Alpes-Maritimes",
    introduction:
      "FRTP réalise la création, la reprise et la mise en conformité de réseaux d'assainissement dans le Var et les Alpes-Maritimes. Les travaux concernent les eaux usées, les eaux pluviales, le drainage, les regards et les raccordements, avec une préparation adaptée aux niveaux et aux réseaux existants.",
    useCases: [
      "Création et reprise de réseaux d'eaux usées",
      "Gestion et évacuation des eaux pluviales",
      "Raccordement au réseau d'assainissement",
      "Pose de regards et canalisations",
      "Drainage de terrain et des abords",
      "Mise en conformité d'installations existantes"
    ],
    process: commonProcess,
    faq: [
      { question: "Quels travaux d'assainissement réalise FRTP ?", answer: "FRTP intervient sur les réseaux d'eaux usées et d'eaux pluviales, les raccordements, le drainage, les regards et la reprise de canalisations selon les besoins du chantier." },
      { question: "FRTP peut-elle reprendre un réseau existant ?", answer: "Oui. Une visite permet d'identifier le réseau, les niveaux, les accès et la nature de la reprise à prévoir avant l'établissement du devis." },
      { question: "Où demander un devis d'assainissement ?", answer: "Les chantiers d'assainissement sont pris en charge dans le Var et les Alpes-Maritimes, pour les particuliers comme pour les professionnels et les copropriétés." }
    ]
  },
  voirie: {
    heading: "Travaux de voirie, accès et parkings dans le Var et les Alpes-Maritimes",
    introduction:
      "FRTP crée et rénove des accès, chemins, parkings et surfaces de circulation dans le Var et les Alpes-Maritimes. Les travaux peuvent comprendre le décaissement, la préparation du fond de forme, les bordures, les réglages de niveaux et les finitions de surface.",
    useCases: [
      "Création et réfection de chemins d'accès",
      "Préparation de parkings et voies de circulation",
      "Décaissement et fond de forme",
      "Pose de bordures et délimitation des espaces",
      "Réglage des pentes et évacuation des eaux",
      "Enrobés et finitions selon le chantier"
    ],
    process: commonProcess,
    faq: [
      { question: "FRTP réalise-t-elle les chemins d'accès ?", answer: "Oui. Le chantier peut aller du terrassement et du fond de forme jusqu'aux bordures et à la finition prévue au devis." },
      { question: "Pouvez-vous créer un parking ?", answer: "Oui, pour les particuliers, les copropriétés et les professionnels, avec une attention portée aux niveaux, aux circulations et à l'évacuation des eaux pluviales." },
      { question: "Dans quelle zone intervenez-vous pour la voirie ?", answer: "Les travaux de voirie sont réalisés dans le Var et les Alpes-Maritimes, en fonction des caractéristiques techniques du chantier." }
    ]
  },
  reseaux: {
    heading: "Pose de réseaux secs et humides dans le Var et les Alpes-Maritimes",
    introduction:
      "FRTP réalise les tranchées et travaux nécessaires à la pose, la protection et la reprise de réseaux secs et humides : électricité, télécommunications, alimentation en eau, eaux usées et eaux pluviales dans le Var et les Alpes-Maritimes.",
    useCases: [
      "Tranchées techniques pour électricité et télécom",
      "Pose de fourreaux et chambres de tirage",
      "Alimentation en eau potable",
      "Canalisations d'eaux usées et pluviales",
      "Recherche et protection de réseaux existants",
      "Remblaiement et réfection après intervention"
    ],
    process: commonProcess,
    faq: [
      { question: "Quelle différence entre réseaux secs et réseaux humides ?", answer: "Les réseaux secs concernent notamment l'électricité et les télécommunications. Les réseaux humides transportent l'eau potable, les eaux usées ou les eaux pluviales." },
      { question: "FRTP réalise-t-elle les tranchées pour les raccordements ?", answer: "Oui. FRTP réalise les terrassements, tranchées, poses de fourreaux ou canalisations, puis le remblaiement et la remise en état prévus au chantier." },
      { question: "Intervenez-vous sur des réseaux existants ?", answer: "Oui, après repérage et analyse des contraintes. La méthode dépend de la nature du réseau, de son état et des conditions d'accès." }
    ]
  },
  "amenagements-exterieurs": {
    heading: "Aménagements extérieurs dans le Var et les Alpes-Maritimes",
    introduction:
      "FRTP prépare et remet en forme les espaces extérieurs de villas, résidences et sites professionnels dans le Var et les Alpes-Maritimes. Les interventions portent sur les cours, cheminements, abords, niveaux de terrain et supports nécessaires aux finitions.",
    useCases: [
      "Préparation de cours et d'abords de villa",
      "Création de cheminements piétons",
      "Décaissement avant revêtement",
      "Réglage des niveaux et des pentes",
      "Préparation des supports extérieurs",
      "Remise en état après travaux"
    ],
    process: commonProcess,
    faq: [
      { question: "Quels aménagements extérieurs réalise FRTP ?", answer: "FRTP intervient sur la préparation de cours, cheminements, accès, abords de bâtiments et terrains avant les finitions prévues au projet." },
      { question: "Pouvez-vous reprendre les niveaux autour d'une maison ?", answer: "Oui. La reprise des niveaux, le décaissement et la préparation du support peuvent être étudiés après analyse des pentes, des accès et de l'écoulement des eaux." },
      { question: "Travaillez-vous pour les copropriétés ?", answer: "Oui. Les aménagements extérieurs peuvent concerner une maison, une copropriété, un site d'entreprise ou un espace géré par un donneur d'ordre public ou privé." }
    ]
  },
  "demolition-reprise": {
    heading: "Démolition ciblée et reprise d'ouvrages dans le Var et les Alpes-Maritimes",
    introduction:
      "FRTP réalise des démolitions ciblées, déposes, curages et reprises d'ouvrages dans le Var et les Alpes-Maritimes. Chaque chantier est préparé selon les accès, les réseaux présents, les matériaux à retirer et la remise en sécurité attendue.",
    useCases: [
      "Dépose d'ouvrages et d'aménagements existants",
      "Démolition ciblée avant nouveaux travaux",
      "Curage et préparation de zone",
      "Reprise de malfaçons ou d'ouvrages dégradés",
      "Tri et évacuation des matériaux selon le chantier",
      "Remise en sécurité et préparation du support"
    ],
    process: commonProcess,
    faq: [
      { question: "FRTP réalise-t-elle des démolitions complètes ?", answer: "FRTP étudie principalement les démolitions ciblées, déposes, curages et reprises nécessaires à la préparation ou à la sécurisation d'un chantier." },
      { question: "L'évacuation des matériaux est-elle comprise ?", answer: "Elle peut être intégrée au devis selon la nature et le volume des matériaux, les possibilités de tri et les conditions d'accès au chantier." },
      { question: "Dans quels départements intervenez-vous ?", answer: "FRTP réalise ses interventions de démolition et de reprise dans le Var et les Alpes-Maritimes." }
    ]
  }
};
