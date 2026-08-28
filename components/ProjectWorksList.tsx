"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

const INITIAL_VISIBLE_COUNT = 8;

export function ProjectWorksList({ works }: { works: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = works.length > INITIAL_VISIBLE_COUNT;

  return (
    <>
      <div className="project-work-grid mt-4">
        {works.map((work, index) => (
          <p
            key={`${work}-${index}`}
            className={!expanded && index >= INITIAL_VISIBLE_COUNT ? "hidden" : undefined}
          >
            <CheckCircle2 size={16} />
            {work}
          </p>
        ))}
      </div>

      {hasMore ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-5 inline-flex min-h-11 items-center gap-2 border border-frtp-blue/25 bg-white px-4 py-3 text-sm font-black text-frtp-blue transition hover:border-frtp-blue hover:bg-blue-50"
        >
          {expanded ? (
            <>
              Réduire la liste <ChevronUp size={17} />
            </>
          ) : (
            <>
              Voir les {works.length} travaux réalisés <ChevronDown size={17} />
            </>
          )}
        </button>
      ) : null}
    </>
  );
}
