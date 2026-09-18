import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { CartProvider } from "@/lib/cart-context";

const SITE_URL = "https://gifthub-ng.me";
const TITLE = "GiftHub NG — Thoughtful gifts for every group & occasion";
const DESCRIPTION =
  "Curated gift hampers and products for students, professionals, health workers, and faith communities — tailored to birthdays, anniversaries, Valentine's, graduations and more.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "GiftHub NG",
  authors: [{ name: "GiftHub NG" }],
  keywords: [
    "gifts Nigeria", "gift hamper Lagos", "corporate gifting Nigeria",
    "anniversary gifts", "valentines day gifts Lagos", "graduation gift Nigeria",
  ],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    siteName: "GiftHub NG",
    title: TITLE,
    description: DESCRIPTION,
    images: [{
      url: "/hero.mp4",
      width: 1200, height: 960,
      alt: "Beautifully wrapped gift hampers",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FEF3C7",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="sr-only-focusable">Skip to main content</a>
        <CartProvider>
          <Navbar />
          <main id="main" className="pt-24 pb-16 min-h-[calc(100vh-180px)]">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
