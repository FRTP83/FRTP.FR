import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { RichText } from "@/components/RichText";
import { SectionHeading } from "@/components/SectionHeading";
import { getStudioSettings } from "@/lib/server-data";
import { buildPageMetadata } from "@/lib/metadata";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: "Demandez un devis à FRTP pour vos travaux de terrassement, VRD, assainissement ou aménagements extérieurs dans le Var et les Alpes-Maritimes. Tél. 06 58 01 72 71.",
  path: "/contact"
});

export default async function ContactPage() {
  const studio = await getStudioSettings();

  return (
    <section className="contact-page bg-frtp-mist px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:gap-12">
        <div className="lg:sticky lg:top-32">
          <SectionHeading
            eyebrow="Demande de devis"
            title={studio.contactTitle}
            text={studio.contactPageText}
            level={1}
          />

          <aside className="contact-info-panel mt-8 border border-zinc-200 bg-white p-5 shadow-technical md:mt-10 md:p-6">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-frtp-orange">Informations utiles</p>
            <RichText content={studio.contactText} className="mt-4 text-sm leading-7 text-zinc-600" />

            <div className="mt-6 grid gap-3 text-sm font-bold text-zinc-950">
              <a href={`tel:${studio.phone.replace(/\s/g, "")}`} className="contact-info-row">
                <Phone size={18} />
                {studio.phone}
              </a>
              <a href={`mailto:${studio.email}`} className="contact-info-row">
                <Mail size={18} />
                {studio.email}
              </a>
              <p className="contact-info-row">
                <MapPin size={18} />
                {studio.address}
              </p>
            </div>
          </aside>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
