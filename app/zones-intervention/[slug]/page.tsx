import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { StructuredData } from "@/components/StructuredData";
import { buildPageMetadata } from "@/lib/metadata";
import { getServiceArea } from "@/lib/service-areas";
import { getActivitiesForSite, getBeforeAfterItemsForSite, getProjectsForSite } from "@/lib/server-data";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const area = getServiceArea(slug);
  if (!area) return {};
  return buildPageMetadata({ title: area.title, description: area.description, path: `/zones-intervention/${area.slug}` });
}

export default async function DepartmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = getServiceArea(slug);
  if (!area) notFound();
  const [allProjects, allComparisons, activities] = await Promise.all([
    getProjectsForSite(), getBeforeAfterItemsForSite(), getActivitiesForSite()
  ]);
  const projects = allProjects.filter(project => project.departmentCode === area.code);
  const comparisons = allComparisons.filter(item => item.departmentCode === area.code);
  return (
    <section className="bg-frtp-mist">
      <StructuredData data={breadcrumbJsonLd([
        { name: "Accueil", path: "/" },
        { name: "Prestations et zones d’intervention", path: "/activites" },
        { name: `${area.name} (${area.code})`, path: `/zones-intervention/${area.slug}` }
      ])} />
      <div className="dark-panel px-4 py-14 text-white md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <Link href="/activites#zones-intervention" className="text-sm font-bold text-blue-200">Prestations et zones d’intervention</Link>
          <p className="mt-6 border-l-4 border-frtp-orange pl-3 text-xs font-black uppercase tracking-[0.2em] text-blue-200">{area.name} · {area.code}</p>
          <h1 className="mt-5 max-w-5xl font-display text-[2.6rem] font-bold leading-[1.02] md:text-6xl">{area.title}</h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-300 md:text-xl">{area.intro}</p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <h2 className="font-display text-3xl font-bold text-zinc-950">Nos chantiers {area.code === "83" ? "dans le Var" : "dans les Alpes-Maritimes"}</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {projects.map(project => {
            const example = area.sections.find(section => section.projectSlug === project.slug);
            return (
            <article key={project.slug} className="border border-zinc-300 bg-white p-6 md:p-8">
              <p className="text-sm font-semibold text-frtp-blue">{project.city}</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-zinc-950">{example?.title ?? project.title}</h3>
              <p className="mt-4 leading-8 text-zinc-600">{example?.text ?? project.short}</p>
              <Link href={`/realisations/${project.slug}`} className="mt-5 inline-flex items-center gap-2 font-bold text-frtp-blue">Voir le chantier et ses photos <ArrowRight size={17} /></Link>
            </article>
            );
          })}
        </div>
        {activities.length ? (
          <div className="mt-12 border-t border-zinc-300 pt-10">
            <h2 className="font-display text-3xl font-bold text-zinc-950">Nos prestations {area.code === "83" ? "dans le Var" : "dans les Alpes-Maritimes"}</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {activities.map(activity => <Link key={activity.slug} href={`/activites/${activity.slug}`} className="border border-zinc-300 bg-white px-5 py-3 font-bold text-frtp-blue">{activity.title}</Link>)}
            </div>
          </div>
        ) : null}
        {comparisons.length ? (
          <div className="mt-12 border-t border-zinc-300 pt-10">
            <h2 className="font-display text-3xl font-bold text-zinc-950">Avant et après les travaux</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {comparisons.map(item => (
                <article key={item.id} className="border border-zinc-300 bg-white p-5">
                  <p className="text-sm font-semibold text-frtp-blue">{item.city}</p>
                  <h3 className="mt-2 text-lg font-bold text-zinc-950">{item.title}</h3>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div><p className="mb-2 text-sm font-bold text-zinc-600">Avant</p><Image src={item.before} alt={`Avant les travaux : ${item.title}, ${item.city}`} width={600} height={450} className="aspect-[4/3] w-full object-cover" /></div>
                    <div><p className="mb-2 text-sm font-bold text-zinc-600">Après</p><Image src={item.after} alt={`Après les travaux : ${item.title}, ${item.city}`} width={600} height={450} className="aspect-[4/3] w-full object-cover" /></div>
                  </div>
                </article>
              ))}
            </div>
            <Link href="/avant-apres" className="mt-5 inline-flex items-center gap-2 font-bold text-frtp-blue">Ouvrir les comparaisons en grand <ArrowRight size={17} /></Link>
          </div>
        ) : null}
        <div className="mt-12 border-l-4 border-frtp-orange bg-white p-6 md:p-8">
          <h2 className="font-display text-3xl font-bold text-zinc-950">Préparer votre projet {area.code === "83" ? "dans le Var" : "dans les Alpes-Maritimes"}</h2>
          <p className="mt-4 max-w-3xl leading-8 text-zinc-600">{area.preparation}</p>
          <Link href="/contact" className="mt-6 inline-flex min-h-12 items-center gap-2 bg-frtp-orange px-5 py-3 font-bold text-white">Demander un devis <ArrowRight size={17} /></Link>
        </div>
      </div>
    </section>
  );
}
