/**
 * DrawArrow — a small SVG arrow that "draws in" on parent group-hover.
 *
 * Replaces the generic `→` text arrow throughout the site with a custom
 * hand-drawn-feel mark. Use inside any element that has the `group` class.
 *
 * The path is set up with `pathLength="100"` so the stroke-dasharray /
 * stroke-dashoffset trick works at any rendered size, and the arrowhead
 * tip is drawn from two short separate strokes for a slightly off-axis,
 * etched feel.
 */
export function DrawArrow({
  className = "",
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size * 0.4}
      viewBox="0 0 40 16"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      {/* origin dot — always visible */}
      <circle cx="2" cy="8" r="1.5" fill="currentColor" />
      {/* body line — draws on hover (animated via the CSS below) */}
      <path
        d="M 4 8 Q 16 8.6 30 8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        pathLength="100"
        className="draw-arrow-body"
      />
      {/* arrowhead — two short strokes, slightly off-axis for handcrafted feel */}
      <path
        d="M 25 4.2 L 30.5 8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        pathLength="100"
        className="draw-arrow-head draw-arrow-head-top"
      />
      <path
        d="M 25.4 12 L 30.5 8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        pathLength="100"
        className="draw-arrow-head draw-arrow-head-bottom"
      />
      <style>{`
        .draw-arrow-body, .draw-arrow-head {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          transition: stroke-dashoffset 450ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .group:hover .draw-arrow-body { stroke-dashoffset: 0; transition-duration: 380ms; }
        .group:hover .draw-arrow-head-top { stroke-dashoffset: 0; transition-delay: 320ms; transition-duration: 220ms; }
        .group:hover .draw-arrow-head-bottom { stroke-dashoffset: 0; transition-delay: 360ms; transition-duration: 220ms; }
        @media (prefers-reduced-motion: reduce) {
          .draw-arrow-body, .draw-arrow-head { stroke-dashoffset: 0; transition: none; }
        }
      `}</style>
    </svg>
  );
}
