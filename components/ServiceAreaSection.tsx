import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import type { SiteProject } from "@/lib/server-data";
import { serviceAreas } from "@/lib/service-areas";

const sectors = [
  {
    title: "Fréjus et communes voisines",
    text: "Implantée à Fréjus, FRTP intervient à Saint-Raphaël, Puget-sur-Argens, Roquebrune-sur-Argens et dans les communes voisines.",
    places: ["Fréjus", "Saint-Raphaël", "Puget-sur-Argens", "Roquebrune-sur-Argens"]
  },
  {
    title: "Var",
    text: "Nous intervenons dans toutes les communes du Var.",
    places: ["La Croix-Valmer", "Sainte-Maxime", "Golfe de Saint-Tropez", "Draguignan", "Toulon"],
    href: "/zones-intervention/var"
  },
  {
    title: "Alpes-Maritimes",
    text: "Nous intervenons dans toutes les communes des Alpes-Maritimes.",
    places: ["Puget-Théniers", "Cannes", "Le Cannet", "Mandelieu-la-Napoule", "Nice"],
    href: "/zones-intervention/alpes-maritimes"
  }
];

export function ServiceAreaSection({ projects }: { projects: SiteProject[] }) {
  return (
    <section id="zones-intervention" className="scroll-mt-28 border-t border-zinc-300 px-4 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-7xl">
        <p className="border-l-4 border-frtp-orange pl-3 text-xs font-black uppercase tracking-[0.2em] text-frtp-blue">Zones d’intervention</p>
        <h2 className="mt-4 max-w-4xl font-display text-3xl font-bold leading-tight text-zinc-950 md:text-5xl">Des travaux dans le Var et les Alpes-Maritimes</h2>
        <p className="mt-5 max-w-3xl leading-8 text-zinc-600">Toutes nos prestations sont proposées dans le Var et les Alpes-Maritimes. Basée à Fréjus, FRTP intervient pour les particuliers, les copropriétés, les entreprises et les collectivités.</p>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {sectors.map(sector => (
            <article key={sector.title} className="border border-zinc-300 bg-white p-6 md:p-8">
              <MapPin className="text-frtp-orange" size={28} />
              <h3 className="mt-5 font-display text-2xl font-bold text-zinc-950">{sector.title}</h3>
              <p className="mt-4 text-sm leading-7 text-zinc-600">{sector.text}</p>
              <ul className="mt-6 grid gap-2">
                {sector.places.map(place => <li key={place} className="flex items-center gap-2 text-sm font-bold text-zinc-800"><CheckCircle2 size={16} className="text-frtp-orange" />{place}</li>)}
              </ul>
              {sector.href ? <Link href={sector.href} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-frtp-blue">Voir les chantiers <ArrowRight size={16} /></Link> : null}
            </article>
          ))}
        </div>
        <div className="mt-12 border-t border-zinc-300 pt-10">
          <h2 className="font-display text-3xl font-bold text-zinc-950">Nos chantiers dans le Var et les Alpes-Maritimes</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {serviceAreas.map(area => {
              const departmentProjects = projects.filter(project => project.departmentCode === area.code);
              return (
              <section key={area.code} className="border border-zinc-300 bg-white p-6">
                <h3 className="font-display text-2xl font-bold text-zinc-950">{area.name} ({area.code})</h3>
                <p className="mt-2 text-sm text-zinc-600">{departmentProjects.length} chantier{departmentProjects.length === 1 ? "" : "s"}</p>
                <div className="mt-5 grid gap-6">
                  {departmentProjects.map(project => (
                    <article key={project.slug}>
                      <p className="text-sm font-semibold text-frtp-blue">{project.city}</p>
                      <h4 className="mt-1 font-black text-zinc-950">{project.title}</h4>
                      <p className="mt-2 text-sm leading-7 text-zinc-600">{project.short}</p>
                      <Link href={`/realisations/${project.slug}`} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-frtp-blue">Voir les travaux et les photos <ArrowRight size={16} /></Link>
                    </article>
                  ))}
                </div>
                <Link href={`/zones-intervention/${area.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-frtp-blue">Voir tous les chantiers du département <ArrowRight size={16} /></Link>
              </section>
              );
            })}
          </div>
        </div>
        <div className="mt-12 border-l-4 border-frtp-orange bg-white p-6 md:p-8">
          <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight text-zinc-950">Votre chantier dans le Var ou les Alpes-Maritimes</h2>
          <p className="mt-4 max-w-3xl leading-8 text-zinc-600">Indiquez la commune et les travaux prévus. Ajoutez les photos ou les plans dont vous disposez pour nous permettre d’étudier votre demande.</p>
          <Link href="/contact" className="mt-6 inline-flex min-h-12 items-center gap-2 bg-frtp-orange px-5 py-3 font-bold text-white">Demander un devis <ArrowRight size={18} /></Link>
        </div>
      </div>
    </section>
  );
}
