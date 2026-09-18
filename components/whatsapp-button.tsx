"use client";

import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "./icons";
import { whatsappLink } from "@/lib/support-data";

/**
 * Global floating support entry point. Sits higher on mobile (bottom-24)
 * so it clears the sticky shop CTA bar on the home page; drops to a
 * standard corner offset on desktop. Hidden in the admin console.
 */
export function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <a
      href={whatsappLink("Hi! I have a question about GiftHub NG.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-40 right-4 bottom-24 md:right-6 md:bottom-6 inline-flex items-center justify-center h-14 w-14 rounded-full bg-forest text-white shadow-glow hover:scale-105 transition-transform duration-200 ease-overshoot cursor-pointer"
      aria-label="Chat with us on WhatsApp"
    >
      <WhatsAppIcon className="w-7 h-7" />
    </a>
  );
}
