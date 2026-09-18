"use client";

import { useState, type FormEvent } from "react";
import { Eyebrow } from "@/components/editorial";
import { WhatsAppIcon, MailIcon, PhoneIcon, ChevronDownIcon, CheckIcon } from "@/components/icons";
import { SUPPORT_CONTACT, SUPPORT_TOPICS, FAQ_ITEMS, whatsappLink } from "@/lib/support-data";
import { useSupportMessages } from "@/lib/support-store";

export default function SupportPage() {
  const { create } = useSupportMessages();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: SUPPORT_TOPICS[0] as string,
    orderId: "",
    message: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    create(form);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 300);
  }

  return (
    <div className="container-page relative">
      <span aria-hidden="true" className="chapter-numeral absolute top-0 right-2 sm:right-6">
        III.
      </span>
      <span aria-hidden="true" className="monogram monogram-tr">
        S
      </span>

      <header className="relative max-w-2xl pt-8">
        <Eyebrow>Customer Care</Eyebrow>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl font-medium text-ink tracking-[-0.02em] leading-[1.05]">
          We're here to{" "}
          <span className="font-editorial italic font-light text-brand-800">help.</span>
        </h1>
        <p className="mt-3 text-base text-ink-muted leading-relaxed">
          Questions about an order, delivery, or a gift you're planning? Reach us directly or
          check the answers below.
        </p>
        <span className="hairline mt-6"></span>
      </header>

      {/* Quick contact channels */}
      <div className="relative mt-10 grid sm:grid-cols-3 gap-4">
        <a
          href={whatsappLink("Hi! I have a question about GiftHub NG.")}
          target="_blank"
          rel="noopener noreferrer"
          className="editorial-card group p-6 flex flex-col items-start cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <span className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-forest text-white shadow-soft">
            <WhatsAppIcon className="w-5 h-5" />
          </span>
          <p className="mt-4 font-display text-lg font-medium text-ink">WhatsApp</p>
          <p className="text-sm text-ink-muted mt-1">Fastest way to reach us</p>
          <p className="mt-3 text-sm font-medium text-brand-900">{SUPPORT_CONTACT.whatsappDisplay}</p>
        </a>
        <a
          href={`mailto:${SUPPORT_CONTACT.email}`}
          className="editorial-card group p-6 flex flex-col items-start cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <span className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-white/90 text-brand-900 shadow-soft border border-line">
            <MailIcon className="w-5 h-5" />
          </span>
          <p className="mt-4 font-display text-lg font-medium text-ink">Email</p>
          <p className="text-sm text-ink-muted mt-1">We reply within a business day</p>
          <p className="mt-3 text-sm font-medium text-brand-900">{SUPPORT_CONTACT.email}</p>
        </a>
        <a
          href={`tel:${SUPPORT_CONTACT.phone.replace(/\s/g, "")}`}
          className="editorial-card group p-6 flex flex-col items-start cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <span className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-white/90 text-brand-900 shadow-soft border border-line">
            <PhoneIcon className="w-5 h-5" />
          </span>
          <p className="mt-4 font-display text-lg font-medium text-ink">Phone</p>
          <p className="text-sm text-ink-muted mt-1">{SUPPORT_CONTACT.hours}</p>
          <p className="mt-3 text-sm font-medium text-brand-900">{SUPPORT_CONTACT.phone}</p>
        </a>
      </div>

      <div className="relative mt-16 grid lg:grid-cols-2 gap-10 lg:gap-16 pb-4">
        {/* FAQ */}
        <section>
          <h2 className="font-display text-2xl font-medium text-ink tracking-tight mb-5">
            Frequently asked questions
          </h2>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item) => (
              <details key={item.question} className="group card overflow-hidden">
                <summary className="flex items-center justify-between gap-4 p-4 sm:p-5 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                  <span className="font-medium text-ink text-sm sm:text-base">{item.question}</span>
                  <ChevronDownIcon className="w-4 h-4 text-brand-700 shrink-0 transition-transform duration-300 ease-editorial group-open:rotate-180" />
                </summary>
                <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-ink-muted leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Contact form */}
        <section>
          <h2 className="font-display text-2xl font-medium text-ink tracking-tight mb-5">
            Send us a message
          </h2>
          {submitted ? (
            <div className="card p-8 text-center">
              <div className="mx-auto inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-forest-soft text-forest">
                <CheckIcon className="w-6 h-6" />
              </div>
              <p className="mt-4 font-display text-lg font-medium text-ink">Message sent</p>
              <p className="mt-1 text-sm text-ink-muted">
                We'll get back to you at {form.email} shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="s-name" className="label">
                    Name
                  </label>
                  <input
                    id="s-name"
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="input"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="s-email" className="label">
                    Email
                  </label>
                  <input
                    id="s-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="input"
                    placeholder="you@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="s-topic" className="label">
                  Topic
                </label>
                <select
                  id="s-topic"
                  value={form.topic}
                  onChange={(e) => update("topic", e.target.value)}
                  className="input cursor-pointer"
                >
                  {SUPPORT_TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="s-order" className="label">
                  Order number (optional)
                </label>
                <input
                  id="s-order"
                  value={form.orderId}
                  onChange={(e) => update("orderId", e.target.value)}
                  className="input"
                  placeholder="GH-XXXXXX"
                />
              </div>
              <div>
                <label htmlFor="s-message" className="label">
                  Message
                </label>
                <textarea
                  id="s-message"
                  required
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className="input min-h-[120px] resize-y"
                  placeholder="How can we help?"
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-gold w-full">
                {submitting ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
