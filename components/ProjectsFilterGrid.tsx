"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import type { SiteProject } from "@/lib/server-data";
import { GeographicFilters } from "@/components/GeographicFilters";

type ProjectsFilterGridProps = {
  projects: SiteProject[];
  categoryCounts: Array<[string, number]>;
};

const ALL_PROJECTS = "__all__";

export function ProjectsFilterGrid({ projects, categoryCounts }: ProjectsFilterGridProps) {
  const [activeCategory, setActiveCategory] = useState(ALL_PROJECTS);
  const [department, setDepartment] = useState("");
  const [city, setCity] = useState("");
  const visibleProjects = useMemo(
    () => projects.filter(project => (activeCategory === ALL_PROJECTS || project.categories.includes(activeCategory)) && (!department || project.departmentCode === department) && (!city || (project.cityCode || project.city) === city)),
    [activeCategory, projects, department, city]
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

      <GeographicFilters locations={projects} department={department} city={city} onDepartmentChange={value => { setDepartment(value); setCity(""); }} onCityChange={setCity} />
      <p aria-live="polite" className="mt-4 text-sm text-zinc-600">{visibleProjects.length} chantier{visibleProjects.length > 1 ? "s" : ""}</p>
      {!visibleProjects.length ? <p className="mt-6 text-zinc-700">Aucun chantier pour ces critères. Essayez une autre commune ou catégorie.</p> : null}
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
                <span><MapPin size={14} />{project.city}{project.departmentName ? `, ${project.departmentName} (${project.departmentCode})` : ""}</span>
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
