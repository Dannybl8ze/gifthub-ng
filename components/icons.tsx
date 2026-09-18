import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

const base = "w-5 h-5";

export function CartIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className ?? base}
      {...props}
    >
      <path d="M2.5 3h2l2.5 13.5a2 2 0 0 0 2 1.5h8a2 2 0 0 0 2-1.5L21 7H6" />
      <circle cx="10" cy="20.5" r="1.3" />
      <circle cx="18" cy="20.5" r="1.3" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={props.className ?? base} {...props}>
      <path d="M12 21s-7-4.534-7-10.2A4.8 4.8 0 0 1 12 6.6 4.8 4.8 0 0 1 19 10.8C19 16.466 12 21 12 21Z"/>
    </svg>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={props.className ?? base} {...props}>
      <path d="M12 3v4M12 17v4M5 12H1M23 12h-4M6.3 6.3 8.5 8.5M15.5 15.5l2.2 2.2M6.3 17.7 8.5 15.5M15.5 8.5l2.2-2.2"/>
    </svg>
  );
}

export function GiftIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={props.className ?? base} {...props}>
      <rect x="3" y="8" width="18" height="4" rx="1"/>
      <path d="M12 8v13M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8"/>
      <path d="M12 8S8 8 7 6.5C6 5 7 3 9 3.5c1.6.4 3 4.5 3 4.5s1.4-4.1 3-4.5c2-.5 3 1.5 2 3C16 8 12 8 12 8Z"/>
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={props.className ?? base} {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

export function AcademicIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={props.className ?? base} {...props}>
      <path d="M22 10 12 5 2 10l10 5 10-5Z"/>
      <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>
    </svg>
  );
}

export function BriefcaseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={props.className ?? base} {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    </svg>
  );
}

export function CakeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={props.className ?? base} {...props}>
      <path d="M12 5V3M12 5s-1 1-1 2a1 1 0 0 0 2 0c0-1-1-2-1-2Z"/>
      <rect x="4" y="11" width="16" height="9" rx="2"/>
      <path d="M4 15c2 1 4-1 4-1s2 2 4 0 4 1 4 1 2 1 4 0"/>
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={props.className ?? base} {...props}>
      <path d="M3 6h18M3 12h18M3 18h18"/>
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={props.className ?? base} {...props}>
      <path d="M6 6l12 12M18 6 6 18"/>
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={props.className ?? base} {...props}>
      <path d="M5 12h14M13 5l7 7-7 7"/>
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className ?? base} {...props}>
      <path d="M5 12l5 5L20 7"/>
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={props.className ?? base} {...props}>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
    </svg>
  );
}

export function FilterIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={props.className ?? base} {...props}>
      <path d="M3 5h18M6 12h12M10 19h4"/>
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className ?? base} {...props}>
      <path d="M12 5v14M5 12h14"/>
    </svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className ?? base} {...props}>
      <path d="M5 12h14"/>
    </svg>
  );
}

export function EditIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={props.className ?? base} {...props}>
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z"/>
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={props.className ?? base} {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.004 2c-5.514 0-9.988 4.474-9.988 9.988 0 1.762.462 3.484 1.34 5.003L2 22l5.135-1.346a9.958 9.958 0 0 0 4.869 1.24h.004c5.514 0 9.988-4.474 9.988-9.988C21.996 6.474 17.522 2.004 12.004 2zm0 18.176a8.15 8.15 0 0 1-4.152-1.136l-.298-.177-3.048.8.814-2.972-.194-.306a8.156 8.156 0 0 1-1.256-4.397c0-4.512 3.672-8.184 8.188-8.184 4.512 0 8.184 3.672 8.184 8.184 0 4.512-3.672 8.188-8.188 8.188z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={props.className ?? base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={props.className ?? base} {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className ?? base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={props.className ?? base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export function GroupIconFor({ icon, className }: { icon: string; className?: string }) {
  switch (icon) {
    case "academic": return <AcademicIcon className={className} />;
    case "briefcase": return <BriefcaseIcon className={className} />;
    case "heart": return <HeartIcon className={className} />;
    case "sparkles": return <SparklesIcon className={className} />;
    case "users": return <UsersIcon className={className} />;
    case "gift": return <GiftIcon className={className} />;
    case "cake": return <CakeIcon className={className} />;
    default: return <GiftIcon className={className} />;
  }
}
