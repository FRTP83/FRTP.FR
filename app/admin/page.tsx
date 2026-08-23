import type { Metadata } from "next";
import { AdminConsole } from "@/components/AdminConsole";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Administration",
  alternates: { canonical: "/admin" },
  robots: { index: false, follow: false }
};

export default function AdminPage() {
  return (
    <section className="technical-grid bg-frtp-gray px-4 py-16 md:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Administration"
          title="Studio de gestion FRTP."
          level={1}
        />
        <div className="mt-10">
          <AdminConsole />
        </div>
      </div>
    </section>
  );
}
