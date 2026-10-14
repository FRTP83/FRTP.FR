import { RichText } from "@/components/RichText";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  text?: string;
  level?: 1 | 2;
  studioTitle?: string;
  studioText?: string;
  studioEyebrow?: string;
};

export function SectionHeading({ eyebrow, title, text, level = 2, studioTitle, studioText, studioEyebrow }: SectionHeadingProps) {
  const Heading = level === 1 ? "h1" : "h2";

  return (
    <div data-gsap className="max-w-3xl">
      {eyebrow ? (
        <p data-studio-field={studioEyebrow} className="mb-3 inline-flex border-l-4 border-frtp-orange pl-3 text-[11px] font-black uppercase tracking-[0.18em] text-frtp-blueDark md:mb-4 md:text-xs md:tracking-[0.24em]">{eyebrow}</p>
      ) : null}
      <Heading data-studio-field={studioTitle} className="text-balance font-display text-[2rem] font-bold leading-[1.05] tracking-tight text-frtp-graphite md:text-5xl">{title}</Heading>
      {text ? <div data-studio-field={studioText}><RichText content={text} className="mt-4 max-w-2xl text-[15px] font-medium leading-7 text-zinc-600 md:mt-5 md:text-lg md:leading-8" /></div> : null}
    </div>
  );
}
