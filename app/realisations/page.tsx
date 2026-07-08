import type { Metadata } from "next";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getProjectsForSite, getStudioSettings } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Réalisations",
  description: "Chantiers récents de FRTP : terrassement, VRD et aménagements extérieurs dans le Var et les Alpes-Maritimes, présentés par commune et catégorie."
};

export default async function ProjectsPage() {
  const [projects, studio] = await Promise.all([getProjectsForSite(), getStudioSettings()]);

  return (
    <section className="technical-grid bg-frtp-gray px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Nos réalisations"
          title={studio.projectsPageTitle}
          text={studio.projectsPageText}
        />
        <div className="mt-8 grid gap-5 md:mt-12 md:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
