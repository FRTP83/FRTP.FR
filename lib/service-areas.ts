export const serviceAreas = [
  {
    slug: "var",
    code: "83",
    name: "Var",
    title: "Terrassement, VRD et voirie dans le Var (83)",
    description: "FRTP intervient dans le Var (83) pour les travaux de terrassement, VRD, voirie, assainissement, réseaux et aménagements extérieurs.",
    intro: "Basée à Fréjus, FRTP propose l’ensemble de ses prestations dans le Var, pour les particuliers, les copropriétés, les entreprises et les collectivités.",
    sections: [
      {
        title: "Voirie et réseaux d’une villa à La Croix-Valmer",
        text: "Ce chantier associe les terrassements, les réseaux d’eaux usées et pluviales, l’alimentation en eau potable, les télécommunications et les réseaux électriques. Les travaux portent aussi sur la voirie d’accès, le pavage en travertin et les cheminements extérieurs.",
        projectSlug: "voirie-reseaux-amenagement-exterieur-villa"
      },
      {
        title: "Gestion des eaux pluviales dans une cour à Fréjus",
        text: "La création de regards à grille et de caniveaux permet de raccorder la cour au réseau pluvial existant. Les travaux comprennent également la reprise des enrobés et le marquage au sol, pour remettre la surface en usage après l’intervention.",
        projectSlug: "creation-regards-caniveaux-cour-recreation"
      },
      {
        title: "Réfection d’un parking à Saint-Raphaël",
        text: "Après la dépose de l’ancien enrobé, le chantier comprend le terrassement et la reprise de la structure de voirie. La mise en place du revêtement noir et du marquage au sol complète la réfection du parking.",
        projectSlug: "refection-parking-enrobe-saint-raphael"
      }
    ],
    preparation: "Pour une reprise de parking, une création d’accès ou un lot VRD, indiquez la commune, l’état des surfaces existantes, les réseaux concernés et l’usage prévu. Des photos et un plan du terrain permettent de préparer l’échange sur votre chantier."
  },
  {
    slug: "alpes-maritimes",
    code: "06",
    name: "Alpes-Maritimes",
    title: "Travaux publics et aménagements extérieurs dans les Alpes-Maritimes (06)",
    description: "FRTP intervient dans les Alpes-Maritimes (06) pour les travaux de terrassement, VRD, voirie, assainissement, réseaux et aménagements extérieurs.",
    intro: "FRTP propose l’ensemble de ses prestations dans les Alpes-Maritimes, pour les particuliers, les copropriétés, les entreprises et les collectivités.",
    sections: [
      {
        title: "Soutènement et clôture à Puget-Théniers",
        text: "À la résidence La Colette, nous avons réalisé les fondations et construit un mur paysager en bétonflore d’environ trois mètres de longueur. Nous avons également posé une clôture rigide verte de 1,50 mètre.",
        projectSlug: "creation-d-un-mur-de-soutenement-en-betonflore"
      }
    ],
    preparation: "Pour un soutènement, un talus ou un aménagement extérieur, précisez la commune, les accès au terrain, les différences de niveau et les ouvrages souhaités. Joignez les photos et les plans disponibles afin de préparer l’étude des contraintes de votre projet."
  }
];

export function getServiceArea(slug: string) {
  return serviceAreas.find(area => area.slug === slug);
}
