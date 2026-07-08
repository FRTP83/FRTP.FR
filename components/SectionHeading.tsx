import { RichText } from "@/components/RichText";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  text?: string;
};

export function SectionHeading({ eyebrow, title, text }: SectionHeadingProps) {
  return (
    <div data-gsap className="max-w-3xl">
      {eyebrow ? (
        <p className="mb-3 inline-flex border-l-4 border-frtp-orange pl-3 text-[11px] font-black uppercase tracking-[0.18em] text-frtp-blueDark md:mb-4 md:text-xs md:tracking-[0.24em]">{eyebrow}</p>
      ) : null}
      <h2 className="text-balance font-display text-[2rem] font-bold leading-[1.05] tracking-tight text-frtp-graphite md:text-5xl">{title}</h2>
      {text ? <RichText content={text} className="mt-4 max-w-2xl text-[15px] font-medium leading-7 text-zinc-600 md:mt-5 md:text-lg md:leading-8" /> : null}
    </div>
  );
}
