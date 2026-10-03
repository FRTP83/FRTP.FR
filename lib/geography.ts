export type Municipality = { nom: string; code: string; codeDepartement: string; codesPostaux: string[] };
export type ProjectLocation = { city: string; cityCode: string; departmentCode: string; departmentName: string };

export function normalizeLocationSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}
