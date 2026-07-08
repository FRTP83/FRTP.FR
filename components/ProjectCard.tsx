import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { projects } from "@/lib/data";

type Project = (typeof projects)[number];

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article data-gsap className="group overflow-hidden bg-white shadow-technical ring-1 ring-zinc-900/8 transition duration-300 hover:-translate-y-1 hover:shadow-lifted">
      <Link href={`/realisations/${project.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
          />
          <div className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] bg-white/92 px-2.5 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-frtp-blue backdrop-blur md:left-4 md:top-4 md:px-3 md:text-xs md:tracking-[0.16em]">
            {project.category}
          </div>
        </div>
        <div className="p-4 md:p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-500">
            <MapPin size={16} className="text-frtp-orange" />
            {project.city}
          </div>
          <h3 className="mt-3 font-display text-lg font-bold leading-tight text-frtp-graphite md:text-xl">{project.title}</h3>
          <p className="mt-3 text-sm font-medium leading-7 text-zinc-600">{project.short}</p>
          <span className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-black text-frtp-blueDark">
            Voir le chantier <ArrowRight size={17} />
          </span>
        </div>
      </Link>
    </article>
  );
}
