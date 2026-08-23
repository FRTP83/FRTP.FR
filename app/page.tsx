import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, ShieldCheck, Star, StarHalf } from "lucide-react";
import { BeforeAfterHomeCarousel } from "@/components/BeforeAfterHomeCarousel";
import { SectionHeading } from "@/components/SectionHeading";
import { getActivitiesForSite, getBeforeAfterItemsForSite, getProjectsForSite, getStudioSettings } from "@/lib/server-data";

export const revalidate = 60;

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
            className="object-cover opacity-[0.72] saturate-[0.95] contrast-[1.03]"
            priority
          />
          <div className="home-hero-blue-filter absolute inset-0" />
          <div className="absolute left-0 top-0 h-36 w-full bg-gradient-to-b from-[#091525]/55 via-[#0d1f38]/18 to-transparent" />
          <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-[#111419]/82 via-[#0f1d2f]/24 to-transparent" />
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

      <div className="invert-site">
      <section className="home-stats-light section-light border-b border-zinc-200 bg-frtp-mist">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 md:grid-cols-4 md:px-6">
          {studio.stats.map((stat, index) => (
            <div
              data-gsap
              key={stat.label}
              className={`py-5 md:py-7 ${index % 2 === 1 ? "border-l border-zinc-200 pl-4 md:pl-0" : ""} ${index > 1 ? "border-t border-zinc-200 md:border-t-0" : ""} ${index > 0 ? "md:border-l md:border-zinc-200 md:pl-6" : ""}`}
            >
              <p className="font-mono text-2xl font-black text-frtp-blue md:text-3xl">{stat.value}</p>
              <p className="mt-2 text-xs font-semibold leading-5 text-zinc-600 md:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="method-terrain-dark section-dark border-y border-white/10 px-4 py-14 text-white md:px-6 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div data-gsap className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-frtp-orange">Méthode terrain</p>
            <h2 className="mt-4 max-w-2xl text-[2rem] font-black leading-tight tracking-tight text-white md:text-5xl">
              {studio.methodTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] font-medium leading-7 text-zinc-300 md:text-base md:leading-8">
              {studio.methodText}
            </p>
          </div>
          <div className="method-steps-grid mt-12 grid gap-0 md:mt-16 md:grid-cols-4">
            {studio.methodSteps.map(({ number, title, text }) => (
              <article data-gsap key={title} className="method-step-item">
                <div className="method-step-number-row">
                  <p className="font-mono text-3xl font-medium text-frtp-blue md:text-4xl">{number}</p>
                  <span aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-lg font-black text-white md:text-xl">{title}</h3>
                <p className="mt-4 max-w-[17rem] text-sm font-medium leading-7 text-zinc-300">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-activities-light section-light bg-frtp-mist px-4 py-10 md:px-6 md:py-14">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Activités"
            title={studio.homeActivitiesTitle}
            text={studio.homeActivitiesText}
          />
          <div className="home-activities-list mt-7 grid md:mt-9 md:grid-cols-2 xl:grid-cols-3">
            {activities.slice(0, 6).map((activity, index) => {
              const Icon = activity.icon;
              return (
                <Link
                  data-gsap
                  key={activity.slug}
                  href={`/activites/${activity.slug}`}
                  className="home-activity-card group bg-white p-4 shadow-technical ring-1 ring-zinc-900/8 transition md:p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="home-activity-index">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <div className="flex items-center gap-3">
                        <Icon size={20} className="text-frtp-orange" />
                        <h3 className="text-lg font-black text-zinc-950 md:text-xl">{activity.title}</h3>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 max-w-xl text-sm font-medium leading-[1.45] text-zinc-600">{activity.description}</p>
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[12px] font-semibold leading-tight text-zinc-700">
                    {activity.services.slice(0, 3).map((service) => (
                      <span key={service} className="home-activity-service">{service}</span>
                    ))}
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-black text-frtp-orange">
                    Détail de l'activité <ArrowRight size={17} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-projects-dark section-dark technical-grid bg-frtp-gray px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Réalisations"
              title={studio.homeProjectsTitle}
              text={studio.homeProjectsText}
            />
            <Link href="/realisations" className="inline-flex min-h-11 items-center gap-2 font-black text-frtp-blue">
              Toutes les réalisations <ArrowRight size={18} />
            </Link>
          </div>
          <div className="home-project-showcase mt-8 grid gap-3 md:mt-12 md:grid-cols-2 lg:grid-cols-4">
            {projects.slice(0, 4).map((project) => (
              <Link
                data-gsap
                key={project.slug}
                href={`/realisations/${project.slug}`}
                className="home-project-tile group"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
                />
                <span className="home-project-overlay" />
                <span className="home-project-category">{project.category}</span>
                <span className="home-project-content">
                  <span className="home-project-city">{project.city} · {project.date}</span>
                  <span className="home-project-title">{project.title}</span>
                  <span className="home-project-text">{project.short}</span>
                  <span className="home-project-link">
                    Voir le chantier <ArrowRight size={15} />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-before-after-light section-light bg-frtp-mist px-4 py-12 md:px-6 md:py-20">
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
      <section className="home-reviews-dark section-dark metal-surface border-y border-zinc-200 px-4 py-12 md:px-6 md:py-20">
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

      <section className="home-cta-light section-light px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-frtp-orange">Contact rapide</p>
            <h2 className="mt-3 max-w-2xl text-2xl font-black tracking-tight text-zinc-950 md:text-5xl">
              {studio.homeCtaTitle}
            </h2>
          </div>
          <Link href="/contact" className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-frtp-blue px-5 py-4 text-sm font-black text-white sm:w-auto">
            <ShieldCheck size={19} />
            Demander un devis
          </Link>
        </div>
      </section>
      </div>
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
