import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { RichText } from "@/components/RichText";
import { SectionHeading } from "@/components/SectionHeading";
import { getStudioSettings } from "@/lib/server-data";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Contact",
  description: "Demandez un devis à FRTP pour vos travaux de terrassement, VRD, assainissement ou aménagements extérieurs dans le Var et les Alpes-Maritimes. Tél. 06 58 01 71 71."
};

export default async function ContactPage() {
  const studio = await getStudioSettings();

  return (
    <section className="technical-grid bg-frtp-gray px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start lg:gap-10">
        <div>
          <SectionHeading
            eyebrow="Demande de devis"
            title={studio.contactTitle}
            text={studio.contactPageText}
          />
          <div className="mt-8 border-l-4 border-frtp-orange bg-white p-5">
            <p className="font-black text-zinc-950">Informations utiles</p>
            <RichText content={studio.contactText} className="mt-3 text-sm" />
            <div className="mt-5 grid gap-2 text-sm font-semibold text-zinc-700">
              <p>{studio.phone}</p>
              <p>{studio.email}</p>
              <p>{studio.address}</p>
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
