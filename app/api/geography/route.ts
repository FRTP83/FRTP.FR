import { municipalitiesForDepartment, resolveLegacyLocation } from "@/lib/geography-server";

export function GET(request: Request) {
  const url = new URL(request.url);
  const name = url.searchParams.get("name");
  if (name) return Response.json({ location: resolveLegacyLocation(name) });
  return Response.json({ municipalities: municipalitiesForDepartment(url.searchParams.get("department") ?? "") });
}
