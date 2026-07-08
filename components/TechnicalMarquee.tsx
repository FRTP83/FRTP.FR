const items = [
  "Terrassement",
  "VRD",
  "Assainissement",
  "Voirie",
  "Réseaux",
  "Fréjus",
  "Var",
  "Alpes-Maritimes"
];

export function TechnicalMarquee() {
  return (
    <div className="overflow-hidden border-y border-zinc-800 bg-zinc-950 py-4 text-white">
      <div data-marquee-track className="flex w-max gap-8 whitespace-nowrap will-change-transform">
        {[...items, ...items, ...items, ...items].map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-8 text-sm font-black uppercase tracking-[0.28em] text-zinc-300">
            <span>{item}</span>
            <span className="h-2 w-10 bg-gradient-to-r from-frtp-blue to-frtp-orange" />
          </span>
        ))}
      </div>
    </div>
  );
}
