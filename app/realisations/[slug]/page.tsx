import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, CheckCircle2, MapPin } from "lucide-react";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { projects } from "@/lib/data";
import { getProjectForSite } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectForSite(slug);

  if (!project) {
    return { title: "Réalisation" };
  }

  return {
    title: `${project.title} - ${project.city}`,
    description: project.short,
    alternates: { canonical: `/realisations/${project.slug}` },
    openGraph: {
      title: `${project.title} | FRTP`,
      description: project.short,
      images: [{ url: project.image }]
    }
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectForSite(slug);

  if (!project) {
    notFound();
  }

  const galleryImages = project.galleryImages?.length
    ? project.galleryImages
    : [{ url: project.image, type: "gallery" }];
  const heroSettings = project.heroSettings ?? {
    imageUrl: project.image,
    positionX: 50,
    positionY: 50,
    zoom: 1,
    overlay: 28
  };

  return (
    <article className="bg-white">
      <section data-parallax-section className="relative min-h-[46dvh] overflow-hidden bg-zinc-950 px-4 py-14 text-white md:min-h-[62dvh] md:px-6 md:py-20">
        <Image
          src={heroSettings.imageUrl || project.image}
          alt={project.title}
          fill
          sizes="100vw"
          className="object-cover"
          style={{
            objectPosition: `${heroSettings.positionX}% ${heroSettings.positionY}%`,
            transform: `scale(${heroSettings.zoom})`,
            transformOrigin: `${heroSettings.positionX}% ${heroSettings.positionY}%`
          }}
          priority
        />
        <div className="absolute inset-0" style={{ backgroundColor: `rgba(9, 9, 11, ${heroSettings.overlay / 100})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/35 via-zinc-950/10 to-transparent" />
        <div className="relative mx-auto max-w-7xl drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)]">
          <p data-hero-line className="text-[11px] font-black uppercase tracking-[0.2em] text-frtp-orange md:text-xs md:tracking-[0.3em]">{project.category}</p>
          <h1 data-hero-line className="mt-4 max-w-4xl text-[2.1rem] font-black leading-tight tracking-tight md:text-6xl">{project.title}</h1>
          <div data-hero-line className="mt-5 flex flex-col gap-3 text-sm font-bold text-zinc-100 sm:flex-row sm:flex-wrap md:mt-6 md:gap-4">
            <span className="inline-flex items-center gap-2"><MapPin size={18} />{project.city}</span>
            <span className="inline-flex items-center gap-2"><CalendarDays size={18} />{project.date}</span>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:px-6 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.7fr_1.3fr] lg:gap-10">
          <aside data-gsap className="border-t-4 border-frtp-blue bg-frtp-gray p-5 md:p-6">
            <h2 className="text-xl font-black text-zinc-950">Résumé chantier</h2>
            <p className="mt-4 text-[15px] leading-7 text-zinc-600 md:text-base">{project.short}</p>
            <Link href="/contact" className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-frtp-orange px-4 py-3 text-sm font-black text-white sm:w-auto">
              Demander un devis <ArrowRight size={17} />
            </Link>
          </aside>
          <div data-gsap>
            <h2 className="text-2xl font-black tracking-tight text-zinc-950 md:text-3xl">Problématique initiale</h2>
            <p className="mt-4 text-[15px] leading-7 text-zinc-600 md:text-base md:leading-8">{project.problem}</p>

            <h2 className="mt-8 text-2xl font-black tracking-tight text-zinc-950 md:mt-10 md:text-3xl">Travaux réalisés</h2>
            <div className="mt-5 grid gap-x-8 gap-y-3 md:grid-cols-2 xl:grid-cols-3">
              {project.works.map((work) => (
                <p key={work} className="flex min-w-0 items-start gap-3 text-[15px] font-semibold leading-6 text-zinc-700">
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-frtp-blue" />
                  {work}
                </p>
              ))}
            </div>

            <h2 className="mt-8 text-2xl font-black tracking-tight text-zinc-950 md:mt-10 md:text-3xl">Galerie</h2>
            <GalleryLightbox images={galleryImages} title={project.title} />
          </div>
        </div>
      </section>
    </article>
  );
}
