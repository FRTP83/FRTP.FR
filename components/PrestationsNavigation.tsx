"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { prestationsNavItems } from "@/lib/data";

type Props = {
  mobile?: boolean;
  active: boolean;
  onNavigate: () => void;
};

export function PrestationsNavigation({ mobile = false, active, onNavigate }: Props) {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pointerIsMouse = useRef(false);
  const panelId = mobile ? "prestations-mobile-links" : "prestations-desktop-links";

  useEffect(() => {
    if (!expanded) return;
    function closeOutside(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setExpanded(false);
    }
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [expanded]);

  return (
    <div
      ref={containerRef}
      className={mobile ? "border-b border-white/10" : "relative"}
      onPointerEnter={event => {
        pointerIsMouse.current = event.pointerType === "mouse";
        if (!mobile && event.pointerType === "mouse") setExpanded(true);
      }}
      onPointerLeave={event => {
        if (!mobile && event.pointerType === "mouse" && !containerRef.current?.contains(document.activeElement)) setExpanded(false);
      }}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false);
      }}
      onKeyDown={event => {
        if (event.key === "Escape" && expanded) {
          event.preventDefault();
          event.stopPropagation();
          setExpanded(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={event => setExpanded(current => !mobile && event.detail > 0 && pointerIsMouse.current ? true : !current)}
        className={`${mobile ? "flex min-h-12 w-full items-center justify-between text-base font-black" : "relative flex items-center gap-1.5 py-2 after:absolute after:bottom-0 after:left-0 after:h-px after:bg-frtp-orange after:transition-all"} ${active ? "text-white" : "text-zinc-300 transition hover:text-white"} ${mobile ? "" : active ? "after:w-full" : "after:w-0 hover:after:w-full"} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-frtp-orange`}
      >
        Prestations
        <ChevronDown aria-hidden="true" size={16} className={`shrink-0 transition-transform duration-200 motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`} />
      </button>
      <div id={panelId} hidden={!expanded} className={mobile ? "pb-3 pl-3" : "absolute left-0 top-full z-20 w-64 pt-3"}>
        <ul className={mobile ? "border-l-2 border-frtp-orange pl-3" : "border border-white/15 bg-frtp-black p-2 shadow-lifted"}>
          {prestationsNavItems.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => {
                  setExpanded(false);
                  onNavigate();
                }}
                className={`flex min-h-11 items-center text-sm font-bold text-zinc-200 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-frtp-orange ${mobile ? "px-2" : "px-4 py-3"}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
