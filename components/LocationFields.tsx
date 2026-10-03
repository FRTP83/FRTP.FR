"use client";

import { useEffect, useMemo, useState } from "react";
import departments from "@/lib/departments.json";
import { normalizeLocationSearch, type Municipality, type ProjectLocation } from "@/lib/geography";

export function LocationFields({ city = "", cityCode = "", departmentCode = "", names = { city: "city", cityCode: "city_code", departmentCode: "department_code" } }: {
  city?: string | null; cityCode?: string | null; departmentCode?: string | null;
  names?: { city: string; cityCode: string; departmentCode: string };
}) {
  const [department, setDepartment] = useState(departmentCode || "");
  const [municipality, setMunicipality] = useState(cityCode || "");
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [cities, setCities] = useState<Municipality[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (departmentCode || !city) return;
    const abort = new AbortController();
    fetch(`/api/geography?name=${encodeURIComponent(city)}`, { signal: abort.signal }).then(response => response.json()).then((data: { location: ProjectLocation | null }) => {
      if (data.location) {
        setDepartment(data.location.departmentCode);
        setMunicipality(data.location.cityCode);
      } else setError("La commune existante doit être confirmée dans les listes.");
    }).catch(() => { if (!abort.signal.aborted) setError("Impossible de charger la localisation existante."); });
    return () => abort.abort();
  }, [city, departmentCode]);

  useEffect(() => {
    if (!department) return;
    const abort = new AbortController();
    setLoading(true);
    setError("");
    fetch(`/api/geography?department=${encodeURIComponent(department)}`, { signal: abort.signal }).then(response => {
      if (!response.ok) throw new Error();
      return response.json();
    }).then((data: { municipalities: Municipality[] }) => setCities(data.municipalities)).catch(() => {
      if (!abort.signal.aborted) setError("Chargement impossible. Sélectionnez à nouveau le département.");
    }).finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [department]);

  const filteredDepartments = useMemo(() => departments.filter(item => item.code === department || normalizeLocationSearch(`${item.code} ${item.nom}`).includes(normalizeLocationSearch(departmentSearch))), [department, departmentSearch]);
  const filteredCities = useMemo(() => cities.filter(item => item.code === municipality || normalizeLocationSearch(`${item.nom} ${item.codesPostaux.join(" ")}`).includes(normalizeLocationSearch(citySearch))), [cities, citySearch, municipality]);
  const selectedCity = cities.find(item => item.code === municipality && item.codeDepartement === department);
  const fieldClass = "h-12 w-full border border-zinc-300 bg-white px-3 font-normal outline-none focus:border-frtp-blue";

  return (
    <fieldset className="grid gap-5 md:col-span-2 md:grid-cols-2">
      <legend className="mb-3 text-sm font-bold text-zinc-950">Localisation du chantier</legend>
      <div className="grid gap-2">
        <label htmlFor={`${names.departmentCode}-search`} className="text-sm font-bold">Département *</label>
        <input id={`${names.departmentCode}-search`} aria-label="Rechercher un département" placeholder="Rechercher par nom ou numéro…" type="search" value={departmentSearch} onChange={event => setDepartmentSearch(event.target.value)} className={fieldClass} />
        <select aria-label="Département" name={names.departmentCode} required value={department} className={fieldClass} onChange={event => {
          setDepartment(event.target.value); setMunicipality(""); setCities([]); setCitySearch("");
        }}>
          <option value="">Choisir un département</option>
          {filteredDepartments.map(item => <option key={item.code} value={item.code}>{item.nom} ({item.code})</option>)}
        </select>
        {!filteredDepartments.length ? <p className="text-xs text-zinc-600">Aucun département trouvé.</p> : null}
      </div>
      <div className="grid gap-2">
        <label htmlFor={`${names.cityCode}-search`} className="text-sm font-bold">Commune *</label>
        <input id={`${names.cityCode}-search`} aria-label="Rechercher une commune" placeholder="Rechercher par nom ou code postal…" type="search" disabled={!department || loading} value={citySearch} onChange={event => setCitySearch(event.target.value)} className={`${fieldClass} disabled:bg-zinc-100`} />
        <select aria-label="Commune" name={names.cityCode} required value={municipality} disabled={!department} className={`${fieldClass} disabled:bg-zinc-100`} onChange={event => setMunicipality(event.target.value)}>
          <option value="">{loading ? "Chargement des communes…" : department ? "Choisir une commune" : "Choisir d’abord un département"}</option>
          {filteredCities.map(item => <option key={item.code} value={item.code}>{item.nom} ({item.codesPostaux.join(", ")})</option>)}
        </select>
        {department && !loading && !filteredCities.length ? <p className="text-xs text-zinc-600">Aucune commune trouvée.</p> : null}
      </div>
      <input type="hidden" name={names.city} value={selectedCity?.nom ?? ""} />
      <p className="text-xs leading-5 text-zinc-500 md:col-span-2">La commune et son département seront affichés sur la réalisation. Choisissez une commune dans la liste pour confirmer sa localisation.</p>
      {error ? <p role="alert" className="text-sm font-semibold text-red-700 md:col-span-2">{error}</p> : null}
    </fieldset>
  );
}
