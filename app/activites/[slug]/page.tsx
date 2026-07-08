import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { activities } from "@/lib/data";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getActivitiesForSite, getProjectsForSite } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return activities.map((activity) => ({ slug: activity.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const siteActivities = await getActivitiesForSite();
  const activity = siteActivities.find((item) => item.slug === slug);

  if (!activity) {
    return { title: "Activite" };
  }

  return {
    title: activity.title,
    description: activity.description,
    alternates: { canonical: `/activites/${activity.slug}` },
    openGraph: {
      title: `${activity.title} | FRTP`,
      description: activity.description
    }
  };
}

export default async function ActivityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [siteActivities, projects] = await Promise.all([getActivitiesForSite(), getProjectsForSite()]);
  const activity = siteActivities.find((item) => item.slug === slug);

  if (!activity) {
    notFound();
  }

  const Icon = activity.icon;
  const related = projects.filter((project) => isProjectRelatedToActivity(project.category, activity.slug, activity.title));

  return (
    <section className="bg-white px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start lg:gap-10">
          <div>
            <Icon size={42} className="text-frtp-blue" />
            <SectionHeading eyebrow="Activite" title={activity.title} text={activity.description} />
            <Link href="/contact" className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-frtp-orange px-5 py-4 text-sm font-black text-white sm:w-auto md:mt-8">
              Demander un devis <ArrowRight size={18} />
            </Link>
          </div>
          <div className="border border-zinc-200 bg-frtp-gray p-5 md:p-6">
            <h2 className="text-xl font-black text-zinc-950 md:text-2xl">Prestations realisees</h2>
            <div className="mt-5 grid gap-3 md:mt-6">
              {activity.services.map((service) => (
                <p key={service} className="flex items-start gap-3 text-[15px] font-semibold leading-6 text-zinc-700 md:text-base">
                  <CheckCircle2 size={18} className="text-frtp-orange" />
                  {service}
                </p>
              ))}
            </div>
            <h2 className="mt-8 text-xl font-black text-zinc-950 md:text-2xl">Exemples d'interventions</h2>
            <p className="mt-3 text-[15px] leading-7 text-zinc-600 md:text-base md:leading-8">
              {activity.interventionExample}
            </p>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <SectionHeading eyebrow="Chantiers associes" title="Quelques references proches de cette activite." />
          <div className="mt-8 grid gap-5 md:grid-cols-3 md:gap-6">
            {related.length ? (
              related.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))
            ) : (
              <p className="border border-zinc-200 bg-frtp-gray p-5 font-semibold leading-7 text-zinc-600 md:col-span-3">
                Aucun chantier publie n'est encore lie a cette activite. Ajoutez ou modifiez un chantier dans le Studio, puis choisissez la categorie correspondante.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function isProjectRelatedToActivity(projectCategory: string, activitySlug: string, activityTitle: string) {
  const category = normalize(projectCategory);
  const title = normalize(activityTitle);
  const slug = normalize(activitySlug);
  const aliases: Record<string, string[]> = {
    terrassement: ["terrassement"],
    vrd: ["vrd", "voiries reseaux divers"],
    assainissement: ["assainissement", "eaux usees", "eaux pluviales"],
    voirie: ["voirie"],
    reseaux: ["reseaux", "reseaux secs", "reseaux humides", "telecom", "electricite"],
    "amenagements-exterieurs": ["amenagements exterieurs", "amenagement", "abords"],
    "demolition-reprise": ["demolition", "reprise"]
  };

  return [slug, title, ...(aliases[activitySlug] ?? [])].some((candidate) => {
    const normalizedCandidate = normalize(candidate);
    return category === normalizedCandidate || category.includes(normalizedCandidate);
  });
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
