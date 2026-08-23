import type { ReactNode } from "react";

type LegalSection = {
  title: string;
  blocks: Array<
    | { type: "paragraph"; text: string }
    | { type: "list"; items: string[] }
  >;
};

export function LegalDocument({ content }: { content: string }) {
  const sections = buildLegalSections(content);

  return (
    <article className="legal-document mt-8 md:mt-10">
      {sections.map((section) => (
        <section key={section.title} className="legal-document-section">
          <h2>{renderInline(section.title)}</h2>
          <div className="legal-document-body">
            {section.blocks.map((block, index) => {
              if (block.type === "list") {
                return (
                  <ul key={`${section.title}-list-${index}`}>
                    {block.items.map((item) => (
                      <li key={item}>{renderInline(item)}</li>
                    ))}
                  </ul>
                );
              }

              return <p key={`${section.title}-p-${index}`}>{renderInline(block.text)}</p>;
            })}
          </div>
        </section>
      ))}
    </article>
  );
}

function buildLegalSections(content: string): LegalSection[] {
  const lines = content
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const sections: LegalSection[] = [];
  let current: LegalSection | null = null;

  lines.forEach((line, index) => {
    const nextLine = lines[index + 1] ?? "";

    if (isLegalHeading(line, nextLine, index)) {
      current = { title: line, blocks: [] };
      sections.push(current);
      return;
    }

    if (!current) {
      current = { title: "Informations légales", blocks: [] };
      sections.push(current);
    }

    if (line.startsWith("- ")) {
      const lastBlock = current.blocks[current.blocks.length - 1];
      const item = line.replace(/^-\s+/, "");

      if (lastBlock?.type === "list") {
        lastBlock.items.push(item);
      } else {
        current.blocks.push({ type: "list", items: [item] });
      }
      return;
    }

    current.blocks.push({ type: "paragraph", text: line });
  });

  return sections;
}

function isLegalHeading(line: string, nextLine: string, index: number) {
  if (line.startsWith("- ")) {
    return false;
  }

  if (!nextLine) {
    return false;
  }

  if (line.replace(/[^a-z]/gi, "").toUpperCase() === "FRTP") {
    return false;
  }

  if (
    line.includes(":")
    || /@|https?:\/\/|www\./i.test(line)
    || /^(FRTP|SASU|SIREN|RCS|TVA|Siège social|Adresse|Email|Téléphone|Capital social)\b/i.test(line)
  ) {
    return false;
  }

  if (index === 0) {
    return true;
  }

  return line.length <= 64 && !/[.:;!?]$/.test(line) && nextLine.length > line.length;
}

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${index}-${part}`}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("__") && part.endsWith("__")) {
      return <u key={`${index}-${part}`}>{part.slice(2, -2)}</u>;
    }

    return part;
  });
}
