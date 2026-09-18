/**
 * Central place to edit customer-support contact details.
 *
 * The WhatsApp number and phone number below are still PLACEHOLDERS.
 * Replace them with your real WhatsApp Business number and support line
 * before going live — whatsappNumber must include the country code with
 * no "+", spaces, or leading zeros (e.g. Nigeria: 234XXXXXXXXXX).
 */
export const SUPPORT_CONTACT = {
  whatsappNumber: "2348000000000",
  whatsappDisplay: "+234 800 000 0000",
  email: "support@gifthub-ng.me",
  /** Internal/business mailbox — not yet surfaced anywhere in the UI. */
  adminEmail: "admin-sunday@gifthub-ng.me",
  phone: "+234 800 000 0000",
  hours: "Mon–Sat, 9am–7pm WAT",
};

export function whatsappLink(prefillMessage?: string): string {
  const base = `https://wa.me/${SUPPORT_CONTACT.whatsappNumber}`;
  return prefillMessage ? `${base}?text=${encodeURIComponent(prefillMessage)}` : base;
}

export const SUPPORT_TOPICS = [
  "Order issue",
  "Delivery question",
  "Product question",
  "Corporate & bulk orders",
  "Other",
] as const;

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What areas do you deliver to?",
    answer:
      "We offer same-day delivery within Lagos for orders placed before 12pm. Other Nigerian states typically receive orders within 2–4 business days.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Card payment, bank transfer, and cash on delivery (Lagos & Abuja only). You choose your preferred method at checkout.",
  },
  {
    question: "Can I change or cancel my order after placing it?",
    answer:
      "Yes — if it hasn't been dispatched yet. Message us on WhatsApp or email with your order number as soon as possible and we'll do our best to help.",
  },
  {
    question: "Do you offer corporate or bulk gifting?",
    answer:
      "Absolutely. We deliver branded hampers for offices, hospitals, churches and schools, with volume pricing and scheduled delivery windows. Browse our corporate gifts or reach out directly to discuss your order.",
  },
  {
    question: "What if my hamper arrives damaged or incomplete?",
    answer:
      "Please contact us within 24 hours of delivery with a photo of the item, and we'll arrange a replacement or refund — no questions asked.",
  },
  {
    question: "Can I include a personalised message with my gift?",
    answer:
      "Yes — add your note in the delivery notes field at checkout, and we'll include a hand-written card with your order at no extra cost.",
  },
];
