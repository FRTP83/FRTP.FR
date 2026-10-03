"use client";
import { useId } from "react";
import departments from "@/lib/departments.json";

export function GeographicFilters({ locations, department, city, onDepartmentChange, onCityChange }: {
  locations: Array<{ city: string; cityCode?: string; departmentCode?: string }>;
  department: string; city: string; onDepartmentChange: (value: string) => void; onCityChange: (value: string) => void;
}) {
  const id = useId();
  const codes = Array.from(new Set(locations.map(item => item.departmentCode).filter(Boolean))).sort();
  const cities = Array.from(new Map(locations.filter(item => !department || item.departmentCode === department).map(item => [item.cityCode || item.city, item.city])).entries()).sort((a, b) => a[1].localeCompare(b[1], "fr"));
  return (
    <div className="mt-6 grid gap-4 border border-zinc-300 bg-white p-4 sm:grid-cols-2">
      <label htmlFor={`${id}-department`} className="grid gap-2 text-sm font-bold">Département
        <select id={`${id}-department`} value={department} onChange={event => onDepartmentChange(event.target.value)} className="h-12 min-w-0 border border-zinc-300 bg-white px-3 font-normal">
          <option value="">Tous les départements</option>
          {codes.map(code => <option key={code} value={code}>{departments.find(item => item.code === code)?.nom ?? code} ({code})</option>)}
        </select>
      </label>
      <label htmlFor={`${id}-city`} className="grid gap-2 text-sm font-bold">Commune
        <select id={`${id}-city`} value={city} onChange={event => onCityChange(event.target.value)} className="h-12 min-w-0 border border-zinc-300 bg-white px-3 font-normal">
          <option value="">Toutes les communes</option>
          {cities.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
        </select>
      </label>
    </div>
  );
}
