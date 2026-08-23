import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function NotFound() {
  return (
    <section className="dark-panel min-h-[72dvh] px-4 pb-20 pt-32 text-white md:px-6 md:pb-28 md:pt-40">
      <div className="mx-auto max-w-5xl">
        <p className="border-l-4 border-frtp-orange pl-3 text-xs font-black uppercase tracking-[0.24em] text-blue-200">
          Erreur 404
        </p>
        <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold leading-[0.98] tracking-tight md:text-8xl">
          Cette page n’existe pas ou a été déplacée.
        </h1>
        <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-zinc-300 md:text-lg">
          Revenez à l’accueil ou décrivez votre chantier pour être orienté vers la bonne prestation.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/20 px-5 py-3 text-sm font-black transition hover:border-white/50 hover:bg-white/10">
            <ArrowLeft size={18} /> Retour à l’accueil
          </Link>
          <Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 bg-frtp-orange px-5 py-3 text-sm font-black transition hover:bg-frtp-orangeDark">
            <FileText size={18} /> Demander un devis
          </Link>
        </div>
      </div>
    </section>
  );
}
