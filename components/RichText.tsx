import type { ReactNode } from "react";

type RichTextProps = {
  content: string;
  className?: string;
};

export function RichText({ content, className = "" }: RichTextProps) {
  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className={["rich-text", className].filter(Boolean).join(" ")}>
      {blocks.map((block, index) => (
        <RichBlock key={`${index}-${block.slice(0, 24)}`} block={block} />
      ))}
    </div>
  );
}

function RichBlock({ block }: { block: string }) {
  const alignmentMatch = block.match(/^\[align=(left|center|right|justify)\]\n?([\s\S]*?)\n?\[\/align\]$/);

  if (alignmentMatch) {
    return (
      <div className={`rich-text-align-${alignmentMatch[1]}`}>
        <RichBlock block={alignmentMatch[2]} />
      </div>
    );
  }

  const lines = block.split(/\n/).map((line) => line.trim()).filter(Boolean);
  const firstLine = lines[0] ?? "";

  if (firstLine.startsWith("# ")) {
    return <h2>{renderInline(firstLine.replace(/^#\s+/, ""))}</h2>;
  }

  if (firstLine.startsWith("## ")) {
    return <h3>{renderInline(firstLine.replace(/^##\s+/, ""))}</h3>;
  }

  if (lines.every((line) => line.startsWith("- "))) {
    return (
      <ul>
        {lines.map((line) => (
          <li key={line}>{renderInline(line.replace(/^-\s+/, ""))}</li>
        ))}
      </ul>
    );
  }

  const hasHeadingLine =
    lines.length > 1
    && firstLine.length <= 80
    && !/[.:;!?]$/.test(firstLine);

  if (hasHeadingLine) {
    return (
      <section>
        <h2>{renderInline(firstLine)}</h2>
        <p>{renderLines(lines.slice(1))}</p>
      </section>
    );
  }

  return <p>{renderLines(lines)}</p>;
}

function renderLines(lines: string[]) {
  return lines.flatMap((line, index) => (
    index === 0 ? [renderInline(line)] : [<br key={`br-${index}`} />, renderInline(line)]
  ));
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
