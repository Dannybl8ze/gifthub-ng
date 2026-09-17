import type { ReactNode } from "react";

type MonogramPos = "tl" | "tr" | "bl" | "br";

/**
 * EditorialSection — wraps a section with the magazine-chapter treatment:
 * a giant decorative Roman numeral in the upper-right, an optional oversized
 * Fraunces monogram letter anchored to a corner, plus the eyebrow + title + sub.
 *
 * The numeral and monogram are decorative only (pointer-events: none,
 * very low opacity) so they never interfere with the section's real content.
 */
export function EditorialSection({
  numeral,
  eyebrow,
  title,
  subtitle,
  monogram,
  monogramPos = "br",
  trailing,
  children,
  className = "",
}: {
  numeral: string;            // "I.", "II.", etc.
  eyebrow: string;            // "CHAPTER ONE — BY GROUP"
  title: ReactNode;           // can include <span className="accent"> for italicized words
  subtitle?: string;
  monogram?: string;          // a single Fraunces character anchored to one corner
  monogramPos?: MonogramPos;
  trailing?: ReactNode;       // right-aligned content next to the heading block (e.g. "View all →")
  children: ReactNode;
  className?: string;
}) {
  const monogramClass =
    monogramPos === "tl" ? "monogram monogram-tl"
    : monogramPos === "tr" ? "monogram monogram-tr"
    : monogramPos === "bl" ? "monogram monogram-bl"
    : "monogram monogram-br";

  return (
    <section className={`relative container-page ${className}`}>
      {/* Decorative monogram (background letter) */}
      {monogram && (
        <span aria-hidden="true" className={monogramClass}>{monogram}</span>
      )}
      {/* Decorative Roman numeral marker */}
      <span aria-hidden="true" className="chapter-numeral absolute top-0 right-2 sm:right-6">
        {numeral}
      </span>

      <header className="relative max-w-3xl pt-8 sm:pt-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-8">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="section-title mt-4">{title}</h2>
            {subtitle && <p className="section-sub">{subtitle}</p>}
          </div>
          {trailing && <div className="shrink-0">{trailing}</div>}
        </div>
        <span className="hairline mt-6"></span>
      </header>

      <div className="relative mt-8 sm:mt-10">{children}</div>
    </section>
  );
}

/** Eyebrow — usable standalone (e.g. above hero text). */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
