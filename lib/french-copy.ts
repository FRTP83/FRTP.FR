const replacements: Array<[RegExp, string]> = [
  [/\u2014/g, "-"],
  [/\bAmenagements exterieurs\b/gi, "Aménagements extérieurs"],
  [/\bAmenagement extérieur\b/gi, "Aménagement extérieur"],
  [/\bAmenagement\b/gi, "Aménagement"],
  [/\bSaint-Raphael\b/g, "Saint-Raphaël"],
  [/\bFrejus\b/g, "Fréjus"],
  [/\bEvacuation\b/g, "Évacuation"],
  [/\bElectricite\b/gi, "Électricité"],
  [/\bTelecom\b/gi, "Télécom"],
  [/\bprives\b/gi, "privés"],
  [/\benrobes\b/gi, "enrobés"],
  [/\bQuelques references\b/gi, "Quelques références"],
  [/\bChantiers associes\b/gi, "Chantiers associés"],
  [/\bTravaux realises\b/gi, "Travaux réalisés"],
  [/\bPolitique de confidentialite\b/gi, "Politique de confidentialité"],
  [/\bMentions legales\b/gi, "Mentions légales"],
  [/\bchantiers presentes\b/gi, "chantiers présentés"],
  [/\bMoyens humains et materiels\b/gi, "Moyens humains et matériels"],
  [/\bAvant \/ Apres\b/g, "Avant / Après"],
  [/\bImplantee a\b/gi, "Implantée à"],
  [/\bImplantée a\b/gi, "Implantée à"],
  [/\bBasee a\b/gi, "Basée à"],
  [/\bBasée a\b/gi, "Basée à"],
  [/\ba chiffrer\b/gi, "à chiffrer"],
  [/\bpelle a la\b/gi, "pelle à la"]
];

export function normalizeFrenchCopy(value: string) {
  return replacements.reduce((copy, [pattern, replacement]) => copy.replace(pattern, replacement), value);
}

export function normalizeCopyObject<T>(value: T, key = ""): T {
  if (typeof value === "string") {
    return (key === "slug" ? value : normalizeFrenchCopy(value)) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeCopyObject(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([entryKey, entryValue]) => [
        entryKey,
        normalizeCopyObject(entryValue, entryKey)
      ])
    ) as T;
  }

  return value;
}
