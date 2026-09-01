export type ActivityFaq = { question: string; answer: string };

const activityDetails: Record<string, { localIntro: string; faqs: ActivityFaq[] }> = {
  terrassement: {
    localIntro: "FRTP réalise les travaux de terrassement nécessaires à la préparation d’un terrain, d’un accès ou d’une plateforme à Fréjus et dans les communes voisines. Chaque intervention commence par l’analyse des accès, des niveaux, des volumes à déplacer et des réseaux existants.",
    faqs: [
      { question: "Quels travaux de terrassement réalisez-vous ?", answer: "FRTP intervient notamment pour le décaissement, les fouilles, la préparation de plateformes, la création d’accès et l’évacuation des déblais." },
      { question: "Dans quelles communes intervenez-vous pour un terrassement ?", answer: "FRTP intervient principalement à Fréjus, Saint-Raphaël, Roquebrune-sur-Argens, Puget-sur-Argens et plus largement dans le Var et les Alpes-Maritimes." },
      { question: "Comment obtenir un devis de terrassement ?", answer: "Présentez votre projet à FRTP depuis la page contact. Une visite du terrain peut ensuite permettre d’évaluer les accès, les volumes et les contraintes du chantier." }
    ]
  },
  vrd: {
    localIntro: "FRTP prend en charge les travaux de voirie et réseaux divers pour les maisons, résidences, entreprises et sites collectifs autour de Fréjus. L’intervention peut réunir terrassement, tranchées, pose de fourreaux, regards, raccordements et réfection des surfaces.",
    faqs: [
      { question: "Que comprennent les travaux de VRD ?", answer: "Les VRD regroupent la préparation des accès et la mise en place des réseaux nécessaires au terrain : eau, évacuations, électricité, télécommunications et voirie." },
      { question: "FRTP intervient-elle sur des sites occupés ?", answer: "Selon la configuration du chantier, FRTP organise les travaux par zones afin de préserver les accès et de limiter la gêne pendant l’intervention." },
      { question: "Où réalisez-vous des travaux de VRD ?", answer: "FRTP intervient à Fréjus, dans le Var et dans les Alpes-Maritimes, notamment à Saint-Raphaël, Roquebrune-sur-Argens, Cannes et Le Cannet." }
    ]
  },
  assainissement: {
    localIntro: "FRTP crée et reprend les réseaux d’eaux usées et d’eaux pluviales à Fréjus et dans le secteur Var–Alpes-Maritimes. Les travaux sont étudiés selon les pentes, les points de raccordement, la nature du terrain et les contraintes d’accès.",
    faqs: [
      { question: "Quels réseaux d’assainissement réalisez-vous ?", answer: "FRTP intervient sur les réseaux d’eaux usées, les eaux pluviales, le drainage, les regards et les raccordements associés." },
      { question: "Pouvez-vous reprendre un réseau existant ?", answer: "Oui, FRTP peut ouvrir la zone concernée, identifier le réseau, reprendre les éléments nécessaires puis remettre les surfaces en état selon le projet." },
      { question: "Comment faire étudier un problème d’évacuation ?", answer: "Décrivez la situation et joignez si possible des photos depuis la page contact. FRTP pourra ensuite organiser un repérage sur place." }
    ]
  },
  voirie: {
    localIntro: "FRTP réalise et rénove les accès, chemins, cours et parkings autour de Fréjus. La prestation peut comprendre le décaissement, la structure de fondation, les bordures, la gestion des niveaux et le revêtement de finition.",
    faqs: [
      { question: "Quels aménagements de voirie réalisez-vous ?", answer: "FRTP intervient pour les chemins d’accès, parkings, cours, bordures, reprises de chaussée et préparations avant enrobé ou autre finition." },
      { question: "Intervenez-vous pour les particuliers et les professionnels ?", answer: "Oui, les projets peuvent concerner une habitation, une copropriété, une entreprise ou un site collectif, selon les contraintes et l’accès au chantier." },
      { question: "Dans quel secteur intervenez-vous ?", answer: "FRTP travaille principalement autour de Fréjus, Saint-Raphaël et Roquebrune-sur-Argens, ainsi que dans le Var et les Alpes-Maritimes." }
    ]
  },
  reseaux: {
    localIntro: "FRTP réalise les tranchées et ouvrages nécessaires aux réseaux secs et humides : télécommunications, électricité, alimentation en eau et évacuations. Les tracés et profondeurs sont préparés en tenant compte des réseaux déjà présents.",
    faqs: [
      { question: "Quels types de réseaux prenez-vous en charge ?", answer: "FRTP intervient pour les fourreaux télécom et électriques, l’alimentation en eau potable, les évacuations et différents réseaux humides." },
      { question: "Pouvez-vous intervenir sur un réseau existant ?", answer: "Oui, une intervention peut comprendre l’ouverture soignée, l’identification ou la reprise du réseau, sa protection et la réfection de la surface." },
      { question: "Réalisez-vous aussi la remise en état ?", answer: "La remise en état peut être intégrée à la prestation selon la surface concernée et le périmètre défini dans le devis." }
    ]
  },
  "amenagements-exterieurs": {
    localIntro: "FRTP prépare et façonne les abords de maisons, résidences et bâtiments dans le secteur de Fréjus. Les travaux concernent notamment les cours, cheminements, accès, niveaux de terrain et supports avant finitions.",
    faqs: [
      { question: "Quels aménagements extérieurs réalisez-vous ?", answer: "FRTP intervient sur les cours, cheminements, abords de villas, accès, reprises de niveaux et préparations de terrain avant les finitions." },
      { question: "Pouvez-vous reprendre des abords déjà aménagés ?", answer: "Oui, après étude de l’existant, FRTP peut déposer les éléments nécessaires, corriger les supports ou les niveaux et préparer la remise en état." },
      { question: "Comment présenter mon projet ?", answer: "Vous pouvez envoyer une description, la commune du chantier et des photos depuis la page contact afin de faciliter la première étude." }
    ]
  },
  "demolition-reprise": {
    localIntro: "FRTP intervient pour des démolitions ciblées, des déposes et des reprises nécessaires avant de nouveaux travaux. L’organisation tient compte des accès, des ouvrages à conserver, de l’évacuation des matériaux et de la sécurité de la zone.",
    faqs: [
      { question: "Quels travaux de démolition réalisez-vous ?", answer: "FRTP prend en charge des déposes et démolitions ciblées, du curage, des reprises de malfaçons et la préparation de zones avant reconstruction ou aménagement." },
      { question: "Les matériaux peuvent-ils être évacués ?", answer: "L’évacuation et la gestion des matériaux peuvent être prévues dans le devis selon leur nature, leur volume et l’accessibilité du chantier." },
      { question: "Intervenez-vous autour de Fréjus ?", answer: "Oui, FRTP intervient à Fréjus et dans les communes du Var et des Alpes-Maritimes couvertes par son secteur d’activité." }
    ]
  }
};

export function getActivitySeo(slug: string) {
  return activityDetails[slug];
}
