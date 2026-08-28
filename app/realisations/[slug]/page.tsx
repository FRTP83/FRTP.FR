import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Images, MapPin } from "lucide-react";
import { GalleryLightbox } from "@/components/GalleryLightbox";
import { StructuredData } from "@/components/StructuredData";
import { projects } from "@/lib/data";
import { getProjectForSite } from "@/lib/server-data";
import { breadcrumbJsonLd, projectJsonLd } from "@/lib/structured-data";
import { activitySlugForCategory } from "@/lib/project-categories";

export const revalidate = 60;

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
      url: `/realisations/${project.slug}`,
      images: [{ url: project.image }]
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | FRTP`,
      description: project.short,
      images: [project.image]
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
  const photoLabel = galleryImages.length > 1 ? "photos" : "photo";
  const viewLabel = galleryImages.length > 1 ? "vues" : "vue";
  const heroSettings = project.heroSettings ?? {
    imageUrl: project.image,
    positionX: 50,
    positionY: 50,
    zoom: 1,
    overlay: 34
  };

  return (
    <article className="project-detail-page bg-frtp-mist">
      <StructuredData
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Réalisations", path: "/realisations" },
            { name: project.title, path: `/realisations/${project.slug}` }
          ]),
          projectJsonLd(project)
        ]}
      />
      <section data-parallax-section className="project-detail-hero relative min-h-[62dvh] overflow-hidden bg-zinc-950 px-4 pb-16 pt-32 text-white md:min-h-[74dvh] md:px-6 md:pb-20 md:pt-36">
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
        <div className="absolute inset-0" style={{ backgroundColor: `rgba(9, 9, 11, ${Math.max(heroSettings.overlay, 34) / 100})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-frtp-black/88 via-frtp-black/42 to-frtp-black/12" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-frtp-black via-frtp-black/72 to-transparent" />
        <div className="project-detail-hero-line absolute inset-x-0 bottom-0" />

        <div className="relative mx-auto flex min-h-[calc(62dvh-12rem)] max-w-7xl flex-col justify-end drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)] md:min-h-[calc(74dvh-14rem)]">
          <Link href="/realisations" className="mb-8 inline-flex w-fit items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-white/75 transition hover:text-white">
            <ArrowLeft size={15} />
            Tous les chantiers
          </Link>
          <div data-hero-line className="flex flex-wrap gap-2">
            {project.categories.map((category) => {
              const activitySlug = activitySlugForCategory(category);
              const className = "inline-flex w-fit bg-white/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-frtp-orange backdrop-blur transition hover:bg-white/20 md:text-xs md:tracking-[0.26em]";
              return activitySlug ? (
                <Link key={category} href={`/activites/${activitySlug}`} className={className}>{category}</Link>
              ) : (
                <span key={category} className={className}>{category}</span>
              );
            })}
          </div>
          <h1 data-hero-line className="mt-4 max-w-4xl text-balance font-display text-[2.4rem] font-bold leading-[0.98] tracking-tight md:text-6xl lg:text-7xl">
            {project.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-zinc-100/88 md:text-lg">
            {project.short}
          </p>
          <div data-hero-line className="mt-6 flex flex-col gap-3 text-sm font-bold text-zinc-100 sm:flex-row sm:flex-wrap md:gap-4">
            <span className="inline-flex items-center gap-2"><MapPin size={18} />{project.city}</span>
            <span className="inline-flex items-center gap-2"><CalendarDays size={18} />{project.date}</span>
            <span className="inline-flex items-center gap-2"><Images size={18} />{galleryImages.length} {photoLabel}</span>
          </div>
        </div>
      </section>

      <section className="project-detail-body bg-frtp-mist px-4 py-10 md:px-6 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.45fr_0.55fr] lg:items-start">
          <div data-gsap className="project-detail-copy">
            <p className="project-detail-eyebrow">Le chantier</p>
            <h2>Problématique initiale</h2>
            <p>{project.problem}</p>

            <p className="project-detail-eyebrow mt-10">Travaux réalisés</p>
            <div className="project-work-grid mt-4">
              {project.works.map((work) => (
                <p key={work}>
                  <CheckCircle2 size={16} />
                  {work}
                </p>
              ))}
            </div>
          </div>

          <aside data-gsap className="project-detail-side">
            <div className="project-detail-facts">
              <div>
                <span>Localisation</span>
                <strong>{project.city}</strong>
              </div>
              <div>
                <span>Année</span>
                <strong>{project.date}</strong>
              </div>
              <div>
                <span>Photos</span>
                <strong>{galleryImages.length} {viewLabel} du chantier</strong>
              </div>
            </div>
            <div className="project-detail-cta">
              <h2>Un chantier comparable ?</h2>
              <p>FRTP reprend contact après lecture de votre demande.</p>
              <Link href="/contact">
                Demander un devis <ArrowRight size={16} />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="project-detail-gallery bg-frtp-mist px-4 pb-14 md:px-6 md:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="project-detail-eyebrow">En images</p>
              <h2>{galleryImages.length} {photoLabel} du chantier</h2>
            </div>
            <p className="text-sm font-semibold text-zinc-500">Cliquez sur une photo pour l'agrandir</p>
          </div>
          <GalleryLightbox images={galleryImages} title={project.title} />
        </div>
      </section>
    </article>
  );
}
