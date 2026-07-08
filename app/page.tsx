import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, ShieldCheck, Star, StarHalf } from "lucide-react";
import { BeforeAfterHomeCarousel } from "@/components/BeforeAfterHomeCarousel";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getActivitiesForSite, getBeforeAfterItemsForSite, getProjectsForSite, getStudioSettings } from "@/lib/server-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [activities, beforeAfterItems, projects, studio] = await Promise.all([
    getActivitiesForSite(),
    getBeforeAfterItemsForSite(),
    getProjectsForSite(),
    getStudioSettings()
  ]);

  return (
    <>
      <section data-parallax-section className="dark-panel relative overflow-hidden text-white">
        <div className="absolute inset-0">
          <Image
            data-hero-image
            src={studio.heroImage}
            alt="Chantier FRTP"
            fill
            sizes="100vw"
            className="object-cover opacity-48 saturate-[0.9]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-frtp-black via-frtp-black/82 to-frtp-black/18" />
          <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-frtp-mist to-transparent" />
        </div>
        <div className="relative mx-auto grid min-h-[calc(100dvh-72px)] max-w-7xl items-center gap-8 px-4 py-12 md:min-h-[82dvh] md:grid-cols-[1.08fr_0.92fr] md:px-6 md:py-20">
          <div>
            <div data-hero-line className="mb-5 inline-flex max-w-full items-center gap-3 border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur md:mb-8 md:px-4 md:text-xs md:tracking-[0.22em]">
              {studio.heroEyebrow}
            </div>
            <h1 data-hero-line className="text-balance max-w-4xl font-display text-[2.85rem] font-bold leading-[0.96] tracking-tight md:text-7xl md:leading-[0.92]">
              {studio.heroTitle}
            </h1>
            <p data-hero-line className="mt-5 max-w-2xl text-base font-medium leading-7 text-zinc-100 md:mt-7 md:text-xl md:leading-8">
              {studio.heroSubtitle}
            </p>
            <div data-hero-line className="mt-7 flex flex-col gap-3 sm:flex-row md:mt-9">
              <Link
                href="/contact"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-frtp-orange px-5 py-4 text-sm font-black text-white shadow-lifted transition hover:bg-frtp-orangeDark active:translate-y-px sm:w-auto"
              >
                <FileText size={19} />
                Demander un devis
              </Link>
              <Link
                href="/realisations"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 border border-white/30 bg-white/95 px-5 py-4 text-sm font-black text-frtp-graphite transition hover:border-white active:translate-y-px sm:w-auto"
              >
                Voir nos réalisations
                <ArrowRight size={19} />
              </Link>
            </div>
          </div>

          <div data-hero-line className="hidden md:block">
            <div data-parallax-slow className="ml-auto max-w-sm border border-white/12 bg-frtp-graphite/96 p-6 text-white shadow-lifted backdrop-blur-xl">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-frtp-orange">{studio.heroPanelEyebrow}</p>
              <p className="mt-4 font-display text-2xl font-bold leading-tight text-white">
                {studio.heroPanelTitle}
              </p>
              <div className="mt-6 grid gap-3 text-sm font-semibold text-zinc-200">
                {studio.heroPanelItems.map((item) => (
                  <span key={item} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-frtp-orange" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-frtp-mist">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 md:grid-cols-4 md:px-6">
          {studio.stats.map((stat, index) => (
            <div
              data-gsap
              key={stat.label}
              className={`bg-frtp-mist py-5 md:py-7 ${index % 2 === 1 ? "border-l border-zinc-200 pl-4 md:pl-0" : ""} ${index > 1 ? "border-t border-zinc-200 md:border-t-0" : ""} ${index > 0 ? "md:border-l md:border-zinc-200 md:pl-6" : ""}`}
            >
              <p className="font-mono text-2xl font-black text-frtp-blue md:text-3xl">{stat.value}</p>
              <p className="mt-2 text-xs font-semibold leading-5 text-zinc-600 md:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="metal-surface border-y border-zinc-200 px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div data-gsap className="lg:sticky lg:top-28">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-frtp-orange">Méthode terrain</p>
            <h2 className="mt-4 text-[2rem] font-black leading-tight tracking-tight text-zinc-950 md:text-5xl">
              {studio.methodTitle}
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-zinc-600 md:mt-5 md:text-base md:leading-8">
              {studio.methodText}
            </p>
          </div>
          <div className="grid gap-4">
            {studio.methodSteps.map(({ number, title, text }) => (
              <article data-gsap key={title} className="grid gap-3 bg-white/82 p-4 shadow-technical ring-1 ring-zinc-900/8 backdrop-blur md:grid-cols-[96px_1fr] md:gap-4 md:p-5">
                <p className="font-mono text-3xl font-black text-frtp-blue md:text-4xl">{number}</p>
                <div>
                  <h3 className="text-xl font-black text-zinc-950 md:text-2xl">{title}</h3>
                  <p className="mt-2 text-[15px] leading-7 text-zinc-600 md:text-base">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-frtp-mist px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Activités"
            title={studio.homeActivitiesTitle}
            text={studio.homeActivitiesText}
          />
          <div className="mt-8 grid gap-4 md:mt-12 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr]">
            {activities.slice(0, 5).map((activity, index) => {
              const Icon = activity.icon;
              return (
                <Link
                  data-gsap
                  key={activity.slug}
                  href={`/activites/${activity.slug}`}
                  className={index === 0 ? "group bg-white p-5 shadow-technical ring-1 ring-zinc-900/8 md:row-span-2 md:p-6" : "group bg-white/86 p-5 shadow-technical ring-1 ring-zinc-900/8 transition hover:-translate-y-1 hover:bg-white md:p-6"}
                >
                  <Icon size={30} className="text-frtp-blue" />
                  <h3 className="mt-4 text-xl font-black text-zinc-950 md:mt-5 md:text-2xl">{activity.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-600">{activity.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-black text-frtp-orange">
                    Détail de l'activité <ArrowRight size={17} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="technical-grid bg-frtp-gray px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Réalisations"
              title={studio.homeProjectsTitle}
              text={studio.homeProjectsText}
            />
            <Link href="/realisations" className="inline-flex items-center gap-2 font-black text-frtp-blue">
              Toutes les réalisations <ArrowRight size={18} />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:mt-12 md:grid-cols-2 lg:grid-cols-4">
            {projects.slice(0, 4).map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-frtp-mist px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <SectionHeading
              eyebrow="Avant / Après"
              title={studio.beforeAfterTitle}
              text={studio.beforeAfterText}
            />
            <Link
              href="/avant-apres"
              className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-frtp-blue px-5 py-4 text-sm font-black text-white transition hover:bg-frtp-blueDark sm:w-auto md:mt-8"
            >
              Voir les comparaisons <ArrowRight size={18} />
            </Link>
          </div>
          <BeforeAfterHomeCarousel items={beforeAfterItems} fallbackBefore={studio.beforeImage} fallbackAfter={studio.afterImage} />
        </div>
      </section>

      {studio.reviews.length > 0 ? (
      <section className="metal-surface border-y border-zinc-200 px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <SectionHeading
                eyebrow={studio.reviewsEyebrow}
                title={studio.reviewsTitle}
                text={studio.reviewsText}
              />
              <div className="mt-7 inline-flex w-full items-center justify-between gap-4 border border-zinc-200 bg-white px-5 py-4 shadow-technical sm:w-auto md:mt-8">
                <span className="font-display text-3xl font-black text-frtp-blue md:text-4xl">{studio.reviewsRating}</span>
                <span className="grid gap-1">
                  <RatingStars rating={studio.reviewsRating} size={17} />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">{studio.reviewsCount}</span>
                </span>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {studio.reviews.map((review) => (
                <article key={`${review.author}-${review.text}`} className="flex min-h-[220px] flex-col justify-between border border-zinc-200 bg-white p-5 shadow-technical md:min-h-[260px]">
                  <div>
                    <RatingStars rating={review.rating} size={16} />
                    <p className="mt-5 text-sm font-semibold leading-7 text-zinc-700">"{review.text}"</p>
                  </div>
                  <div className="mt-6 border-t border-zinc-200 pt-4">
                    <p className="font-black text-zinc-950">{review.author}</p>
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.2em] text-frtp-blue">{review.source}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <Link href={studio.reviewsGoogleUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex min-h-12 items-center gap-2 font-black text-frtp-blue">
            Voir tous les avis sur Google <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      ) : null}

      <section className="dark-panel px-4 py-12 text-white md:px-6 md:py-16">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-frtp-orange">Contact rapide</p>
            <h2 className="mt-3 max-w-2xl text-2xl font-black tracking-tight md:text-5xl">
              {studio.homeCtaTitle}
            </h2>
          </div>
          <Link href="/contact" className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-white px-5 py-4 text-sm font-black text-zinc-950 sm:w-auto">
            <ShieldCheck size={19} />
            Demander un devis
          </Link>
        </div>
      </section>
    </>
  );
}

function RatingStars({ rating, size }: { rating: string; size: number }) {
  const value = Math.max(0, Math.min(5, Number(rating.replace(",", ".")) || 0));
  const fullStars = Math.floor(value);
  const decimal = value - fullStars;
  const hasHalfStar = decimal >= 0.25 && decimal < 0.75;
  const visibleFullStars = decimal >= 0.75 ? fullStars + 1 : fullStars;
  const emptyStars = 5 - visibleFullStars - (hasHalfStar ? 1 : 0);

  return (
    <span className="flex gap-1 text-frtp-orange" aria-label={`${rating} sur 5`}>
      {Array.from({ length: visibleFullStars }).map((_, index) => (
        <Star key={`full-${index}`} size={size} fill="currentColor" />
      ))}
      {hasHalfStar ? <StarHalf size={size} fill="currentColor" /> : null}
      {Array.from({ length: Math.max(0, emptyStars) }).map((_, index) => (
        <Star key={`empty-${index}`} size={size} className="text-zinc-300" />
      ))}
    </span>
  );
}
