export type BeforeAfterItem = {
  id: string;
  title: string;
  city: string;
  category: string;
  before: string;
  after: string;
  sortOrder: number;
  isPublished: boolean;
};

export const defaultBeforeAfterItems: BeforeAfterItem[] = [
  {
    id: "abords-villa",
    title: "Reprise d'abords de villa",
    city: "Saint-Raphael",
    category: "Amenagements exterieurs",
    before: "/chantier/bastide-jessica.jpeg",
    after: "/chantier/park-sainte-estelle.jpg",
    sortOrder: 0,
    isPublished: true
  },
  {
    id: "talus",
    title: "Confortement et reprise de talus",
    city: "Le Cannet",
    category: "Terrassement",
    before: "/chantier/horizon-hero.jpeg",
    after: "/chantier/les-chenes.jpg",
    sortOrder: 1,
    isPublished: true
  }
];
