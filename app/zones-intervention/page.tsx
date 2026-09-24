import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { buildPageMetadata } from "@/lib/metadata";
import { activities } from "@/lib/data";
import { StructuredData } from "@/components/StructuredData";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = buildPageMetadata({
  title: "Terrassement et VRD dans le Var et les Alpes-Maritimes",
  description:
    "FRTP intervient pour vos travaux de terrassement, VRD, assainissement, voirie et réseaux dans le Var et les Alpes-Maritimes.",
  path: "/zones-intervention"
});

const sectors = [
  {
    title: "Fréjus et communes voisines",
    text: "Implantée à Fréjus, FRTP intervient à Saint-Raphaël, Puget-sur-Argens, Roquebrune-sur-Argens et dans les communes voisines.",
    places: ["Fréjus", "Saint-Raphaël", "Puget-sur-Argens", "Roquebrune-sur-Argens"]
  },
  {
    title: "Var",
    text: "FRTP réalise des travaux de terrassement, voirie, assainissement et réseaux dans l'ensemble du département du Var.",
    places: ["Draguignan", "Toulon", "Sainte-Maxime", "Golfe de Saint-Tropez"]
  },
  {
    title: "Alpes-Maritimes",
    text: "FRTP réalise également des travaux publics, VRD et terrassements dans l'ensemble du département des Alpes-Maritimes.",
    places: ["Cannes", "Le Cannet", "Mandelieu-la-Napoule", "Nice et secteur mentonnais"]
  }
];

export default function ServiceAreaPage() {
  return (
    <main className="bg-frtp-mist">
      <StructuredData data={breadcrumbJsonLd([
        { name: "Accueil", path: "/" },
        { name: "Zones d'intervention", path: "/zones-intervention" }
      ])} />
      <section className="dark-panel px-4 py-14 text-white md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="border-l-4 border-frtp-orange pl-3 text-xs font-black uppercase tracking-[0.22em] text-blue-200">Entreprise locale de travaux publics</p>
          <h1 className="mt-5 max-w-5xl font-display text-[2.7rem] font-bold leading-[1.02] tracking-tight md:text-7xl">
            Terrassement et VRD dans le Var et les Alpes-Maritimes
          </h1>
          <p className="mt-6 max-w-3xl text-base font-semibold leading-8 text-zinc-300 md:text-xl">
            Basée à Fréjus, l'entreprise accompagne les particuliers, les copropriétés, les entreprises et les collectivités dans le Var et les Alpes-Maritimes pour leurs travaux de terrassement, voirie, réseaux et assainissement.
          </p>
          <Link href="/contact" className="mt-8 inline-flex min-h-12 items-center gap-2 bg-frtp-orange px-5 py-4 text-sm font-black text-white">
            Étudier mon chantier <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-3">
            {sectors.map((sector) => (
              <article key={sector.title} className="border border-zinc-300 bg-white p-6 md:p-8">
                <MapPin className="text-frtp-orange" size={28} />
                <h2 className="mt-5 font-display text-2xl font-bold text-zinc-950">{sector.title}</h2>
                <p className="mt-4 text-sm leading-7 text-zinc-600">{sector.text}</p>
                <ul className="mt-6 grid gap-2">
                  {sector.places.map((place) => <li key={place} className="flex items-center gap-2 text-sm font-bold text-zinc-800"><CheckCircle2 size={16} className="text-frtp-orange" />{place}</li>)}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-14 grid gap-8 border-t border-zinc-300 pt-12 md:mt-20 md:grid-cols-[0.75fr_1.25fr] md:pt-16">
            <div>
              <p className="border-l-4 border-frtp-orange pl-3 text-[11px] font-black uppercase tracking-[0.2em] text-frtp-blue">Prestations</p>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-zinc-950 md:text-5xl">Un interlocuteur pour préparer les sols, les accès et les réseaux</h2>
              <p className="mt-5 leading-8 text-zinc-600">FRTP couvre les départements du Var et des Alpes-Maritimes. Décrivez votre projet pour obtenir une réponse adaptée à la nature des travaux et aux contraintes du chantier.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {activities.map((activity) => (
                <Link key={activity.slug} href={`/activites/${activity.slug}`} className="group flex items-center justify-between gap-4 border border-zinc-300 bg-white p-5 font-black text-zinc-950 transition hover:border-frtp-orange">
                  {activity.title}<ArrowRight size={17} className="text-frtp-orange transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
