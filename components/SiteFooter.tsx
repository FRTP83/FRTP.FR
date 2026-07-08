import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { navItems } from "@/lib/data";
import { Logo } from "@/components/Logo";
import { getStudioSettings } from "@/lib/server-data";

export async function SiteFooter() {
  const studio = await getStudioSettings();

  return (
    <footer className="dark-panel text-white">
      <div className="mx-auto grid max-w-7xl gap-9 px-4 py-10 md:grid-cols-[1.2fr_1fr_1fr] md:px-6 md:py-12">
        <div>
          <Logo variant="white" className="h-12 w-auto md:h-16" />
          <p className="mt-5 max-w-md text-sm leading-7 text-zinc-300 md:mt-6">
            {studio.footerText}
          </p>
          <div className="mt-6 h-1 w-32 bg-gradient-to-r from-frtp-blue to-frtp-orange" />
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.24em] text-zinc-400">Navigation</h2>
          <div className="mt-5 grid gap-3 text-sm">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="inline-flex min-h-9 items-center text-zinc-200 transition hover:text-white">
                {item.label}
              </Link>
            ))}
            <Link href="/mentions-legales" className="inline-flex min-h-9 items-center text-zinc-200 transition hover:text-white">
              Mentions legales
            </Link>
            <Link href="/politique-confidentialite" className="inline-flex min-h-9 items-center text-zinc-200 transition hover:text-white">
              Politique de confidentialite
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.24em] text-zinc-400">Contact</h2>
          <div className="mt-5 grid gap-4 text-sm text-zinc-200">
            <p className="flex gap-3"><MapPin size={18} className="mt-1 shrink-0 text-frtp-orange" />{studio.address}</p>
            <p className="flex gap-3"><Phone size={18} className="mt-1 shrink-0 text-frtp-orange" />{studio.phone}</p>
            <p className="flex gap-3"><Mail size={18} className="mt-1 shrink-0 text-frtp-orange" />{studio.email}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {studio.serviceArea.slice(0, 5).map((area) => (
              <span key={area} className="border border-white/15 px-2.5 py-1 text-xs text-zinc-300">
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
