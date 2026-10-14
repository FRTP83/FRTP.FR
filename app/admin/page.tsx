import type { Metadata } from "next";
import { AdminConsole } from "@/components/AdminConsole";

export const metadata: Metadata = {
  title: "Administration",
  alternates: { canonical: "/admin" },
  robots: { index: false, follow: false }
};

export default function AdminPage() {
  return (
    <section className="admin-page"><AdminConsole /></section>
  );
}
