import Link from "next/link";

export function Logo({ size = "default" }: { size?: "default" | "small" }) {
  const text = size === "small" ? "text-base" : "text-lg";
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg"
      aria-label="GiftHub NG home"
    >
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-800 text-gold-soft shadow-card transition-transform duration-200 group-hover:rotate-3">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <rect x="3" y="8" width="18" height="4" rx="1"/>
          <path d="M12 8v13M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8"/>
          <path d="M12 8S8 8 7 6.5C6 5 7 3 9 3.5c1.6.4 3 4.5 3 4.5s1.4-4.1 3-4.5c2-.5 3 1.5 2 3C16 8 12 8 12 8Z"/>
        </svg>
        <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full bg-gold shadow-glow"></span>
      </span>
      <span className={`font-display ${text} font-semibold tracking-tight text-ink`}>
        GiftHub <span className="text-brand-700">NG</span>
      </span>
    </Link>
  );
}
