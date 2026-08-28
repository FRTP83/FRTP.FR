"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import type { SiteProject } from "@/lib/server-data";

type ProjectsFilterGridProps = {
  projects: SiteProject[];
  categoryCounts: Array<[string, number]>;
};

const ALL_PROJECTS = "__all__";

export function ProjectsFilterGrid({ projects, categoryCounts }: ProjectsFilterGridProps) {
  const [activeCategory, setActiveCategory] = useState(ALL_PROJECTS);
  const visibleProjects = useMemo(
    () => activeCategory === ALL_PROJECTS
      ? projects
      : projects.filter((project) => project.categories.includes(activeCategory)),
    [activeCategory, projects]
  );

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`projects-index-filter ${activeCategory === ALL_PROJECTS ? "is-active" : ""}`}
          onClick={() => setActiveCategory(ALL_PROJECTS)}
          aria-pressed={activeCategory === ALL_PROJECTS}
        >
          Tous les chantiers <small>{projects.length}</small>
        </button>
        {categoryCounts.map(([category, count]) => (
          <button
            key={category}
            type="button"
            className={`projects-index-filter ${activeCategory === category ? "is-active" : ""}`}
            onClick={() => setActiveCategory(category)}
            aria-pressed={activeCategory === category}
          >
            {category} <small>{count}</small>
          </button>
        ))}
      </div>

      <div className="projects-index-grid mt-8 md:mt-12">
        {visibleProjects.map((project) => (
          <Link key={project.slug} href={`/realisations/${project.slug}`} className="projects-index-card group">
            <span className="projects-index-image">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <span className="projects-index-overlay" />
              <span className="projects-index-category">{project.categories.join(" · ")}</span>
            </span>
            <span className="projects-index-content">
              <span className="projects-index-meta">
                <span><MapPin size={14} />{project.city}</span>
              </span>
              <span className="projects-index-title">{project.title}</span>
              <span className="projects-index-text">{project.short}</span>
              <span className="projects-index-link">
                Voir le chantier <ArrowRight size={17} />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
