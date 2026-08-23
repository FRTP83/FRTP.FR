"use client";

import Link from "next/link";
import { FileText, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navItems } from "@/lib/data";
import { Logo } from "@/components/Logo";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const pathname = usePathname();
  const useSolidHeader = pathname !== "/" || isScrolled;
  const desktopNavItems = [
    { label: "Accueil", href: "/" },
    ...navItems.slice(1, 6)
  ];

  function closeMenu() {
    setIsOpen(false);
  }

  useEffect(() => {
    function updateHeaderState() {
      setIsScrolled(window.scrollY > 32);
    }

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
    return () => window.removeEventListener("scroll", updateHeaderState);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <header className={`site-glass-header ${useSolidHeader ? "is-scrolled" : "at-top"} fixed inset-x-0 top-0 z-50 border-b border-white/10 text-white`}>
      <div className="site-glass-header-inner mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" aria-label="Accueil FRTP" className="flex min-h-11 items-center" onClick={closeMenu}>
          <Logo variant="white" className="site-header-logo h-10 w-auto md:h-14" />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-8 text-[15px] font-extrabold text-zinc-200 lg:flex">
          {desktopNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
              className={isActivePath(pathname, item.href)
                ? "relative py-2 text-white transition after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-frtp-orange"
                : "relative py-2 text-zinc-300 transition hover:text-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-frtp-orange after:transition-all hover:after:w-full"}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="hidden items-center gap-2 border border-white/14 bg-white/10 px-4 py-3 text-[15px] font-extrabold text-white shadow-lifted backdrop-blur transition hover:border-frtp-orange hover:bg-white/14 active:translate-y-px sm:inline-flex"
          >
            <FileText size={18} />
            Demander un devis
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center border border-white/15 bg-white/10 text-white backdrop-blur lg:hidden"
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
            aria-controls="site-mobile-menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div id="site-mobile-menu" className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-frtp-black/92 backdrop-blur-xl lg:hidden">
          <nav aria-label="Navigation mobile" className="mx-auto grid max-w-7xl gap-1 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                onClick={closeMenu}
                className={isActivePath(pathname, item.href)
                  ? "flex min-h-12 items-center border-b border-white/10 text-base font-black text-white"
                  : "flex min-h-12 items-center border-b border-white/10 text-base font-black text-zinc-300"}
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

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
