import "server-only";
import communesData from "@/data/communes.json";
import departments from "@/lib/departments.json";
import { normalizeLocationSearch, type Municipality, type ProjectLocation } from "@/lib/geography";

const communes = communesData as Municipality[];
const byCode = new Map(communes.map(city => [city.code, city]));
const byDepartment = new Map<string, Municipality[]>();
const byName = new Map<string, Municipality[]>();
for (const city of communes) {
  byDepartment.set(city.codeDepartement, [...(byDepartment.get(city.codeDepartement) ?? []), city]);
  const name = normalizeLocationSearch(city.nom);
  byName.set(name, [...(byName.get(name) ?? []), city]);
}
export function municipalitiesForDepartment(code: string) {
  return byDepartment.get(code)?.slice().sort((a, b) => a.nom.localeCompare(b.nom, "fr")) ?? [];
}
export function validateLocation(departmentCode: string, cityCode: string): ProjectLocation {
  const city = byCode.get(cityCode);
  const department = departments.find(item => item.code === departmentCode);
  if (!city || !department || city.codeDepartement !== departmentCode) throw new Error("Choisissez un département puis une commune de ce département dans les listes.");
  return { city: city.nom, cityCode: city.code, departmentCode: department.code, departmentName: department.nom };
}
export function resolveLegacyLocation(name: string): ProjectLocation | null {
  const candidates = byName.get(normalizeLocationSearch(name)) ?? [];
  if (candidates.length !== 1) return null;
  return validateLocation(candidates[0].codeDepartement, candidates[0].code);
}
