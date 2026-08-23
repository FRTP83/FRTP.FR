import type { Metadata } from "next";
import { BeforeAfterLightboxList } from "@/components/BeforeAfterLightboxList";
import { getBeforeAfterItemsForSite, getStudioSettings } from "@/lib/server-data";
import { buildPageMetadata } from "@/lib/metadata";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Avant / Après",
  description: "Comparez les photos de chantier FRTP avant et après intervention : terrassement, VRD et aménagements extérieurs dans le Var et les Alpes-Maritimes.",
  path: "/avant-apres"
});

export default async function BeforeAfterPage() {
  const [studio, pairs] = await Promise.all([getStudioSettings(), getBeforeAfterItemsForSite()]);

  return (
    <section className="before-after-page bg-frtp-mist">
      <div className="dark-panel px-4 pb-14 pt-12 text-white md:px-6 md:pb-20 md:pt-18">
        <div className="mx-auto max-w-7xl">
          <p className="inline-flex border-l-4 border-frtp-orange pl-3 text-[11px] font-black uppercase tracking-[0.2em] text-blue-200 md:text-xs md:tracking-[0.24em]">Avant / Après</p>
          <div className="mt-5">
            <h1 className="max-w-4xl font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight text-white md:text-7xl">
              {studio.beforeAfterTitle}
            </h1>
            {studio.beforeAfterText ? (
              <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-zinc-300 md:text-xl">
                {studio.beforeAfterText}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="px-4 py-10 md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <BeforeAfterLightboxList pairs={pairs} />
        </div>
      </div>
    </section>
  );
}
