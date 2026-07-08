"use client";

import Link from "next/link";
import { FileText, Menu, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "@/lib/data";
import { Logo } from "@/components/Logo";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const desktopNavItems = [
    { label: "Accueil", href: "/" },
    ...navItems.slice(1, 6)
  ];

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-900/10 bg-frtp-mist/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" aria-label="Accueil FRTP" className="flex items-center" onClick={closeMenu}>
          <Logo className="h-10 w-auto md:h-14" />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-extrabold text-zinc-700 lg:flex">
          {desktopNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="relative transition hover:text-frtp-blue after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-frtp-orange after:transition-all hover:after:w-full">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="hidden items-center gap-2 bg-frtp-graphite px-4 py-3 text-sm font-extrabold text-white shadow-lifted transition hover:bg-frtp-blueDark active:translate-y-px sm:inline-flex"
          >
            <FileText size={18} />
            Demander un devis
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center border border-zinc-200 bg-white text-zinc-900 lg:hidden"
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="border-t border-zinc-200 bg-white lg:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="flex min-h-12 items-center border-b border-zinc-100 text-base font-black text-zinc-800"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={closeMenu}
              className="mt-3 inline-flex min-h-12 items-center justify-center gap-2 bg-frtp-orange px-5 py-3 text-sm font-black text-white"
            >
              <FileText size={18} />
              Demander un devis
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
