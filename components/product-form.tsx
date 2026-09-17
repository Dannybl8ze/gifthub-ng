"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ConsumerGroupSlug, OccasionSlug, Product } from "@/lib/types";
import { CONSUMER_GROUPS, OCCASIONS } from "@/lib/mock-data";
import { slugify } from "@/lib/admin-store";

export interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  image: string;
  groups: ConsumerGroupSlug[];
  occasions: OccasionSlug[];
  inStock: boolean;
  featured: boolean;
  badge: string;
  slug: string;
}

interface Props {
  initial?: Partial<Product>;
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
  submitLabel: string;
}

const DEFAULT_IMG =
  "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=70";

export function ProductForm({ initial, onSubmit, onCancel, submitLabel }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<ProductFormValues>({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    price: initial?.price ?? 0,
    image: initial?.image ?? DEFAULT_IMG,
    groups: (initial?.groups as ConsumerGroupSlug[]) ?? [],
    occasions: (initial?.occasions as OccasionSlug[]) ?? [],
    inStock: initial?.inStock ?? true,
    featured: initial?.featured ?? false,
    badge: initial?.badge ?? "",
    slug: initial?.slug ?? "",
  });

  // Auto-suggest slug from name when slug is empty
  useEffect(() => {
    if (!initial?.slug && values.name && !values.slug) {
      setValues((v) => ({ ...v, slug: slugify(v.name) }));
    }
  }, [values.name, values.slug, initial?.slug]);

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function toggleGroup(slug: ConsumerGroupSlug) {
    update(
      "groups",
      values.groups.includes(slug)
        ? values.groups.filter((g) => g !== slug)
        : [...values.groups, slug]
    );
  }

  function toggleOccasion(slug: OccasionSlug) {
    update(
      "occasions",
      values.occasions.includes(slug)
        ? values.occasions.filter((o) => o !== slug)
        : [...values.occasions, slug]
    );
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = typeof reader.result === "string" ? reader.result : "";
      if (url) update("image", url);
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.name.trim() || !values.description.trim() || values.price <= 0) return;
    if (values.groups.length === 0 && values.occasions.length === 0) {
      if (!confirm("This product has no group or occasion tags. Customers won't find it via filters. Save anyway?")) return;
    }
    onSubmit({ ...values, slug: values.slug || slugify(values.name) });
  }

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
      <div className="space-y-6">
        <section className="card p-6">
          <h2 className="font-display text-lg font-semibold text-ink mb-4">Basic info</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="label">Product name</label>
              <input
                id="name"
                required
                value={values.name}
                onChange={(e) => update("name", e.target.value)}
                className="input"
                placeholder="Anniversary Gold Hamper"
              />
            </div>
            <div>
              <label htmlFor="slug" className="label">URL slug</label>
              <input
                id="slug"
                value={values.slug}
                onChange={(e) => update("slug", slugify(e.target.value))}
                className="input font-mono text-xs"
                placeholder="anniversary-gold-hamper"
              />
            </div>
            <div>
              <label htmlFor="price" className="label">Price (₦)</label>
              <input
                id="price"
                type="number"
                min={0}
                step={500}
                required
                value={values.price}
                onChange={(e) => update("price", Number(e.target.value))}
                className="input"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="description" className="label">Description</label>
              <textarea
                id="description"
                required
                value={values.description}
                onChange={(e) => update("description", e.target.value)}
                className="input min-h-[120px] resize-y"
                placeholder="Describe what's in the hamper, who it's for, and how it's presented."
              />
            </div>
            <div>
              <label htmlFor="badge" className="label">Badge (optional)</label>
              <input
                id="badge"
                value={values.badge}
                onChange={(e) => update("badge", e.target.value)}
                className="input"
                placeholder="Bestseller, Limited, etc."
              />
            </div>
            <div className="flex items-end gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.inStock}
                  onChange={(e) => update("inStock", e.target.checked)}
                  className="h-4 w-4 accent-brand-800 cursor-pointer"
                />
                <span className="text-sm text-ink-soft">In stock</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.featured}
                  onChange={(e) => update("featured", e.target.checked)}
                  className="h-4 w-4 accent-brand-800 cursor-pointer"
                />
                <span className="text-sm text-ink-soft">Featured</span>
              </label>
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-display text-lg font-semibold text-ink mb-1">Consumer groups</h2>
          <p className="text-xs text-ink-muted mb-4">Pick one or more groups this gift is suitable for.</p>
          <div className="flex flex-wrap gap-2">
            {CONSUMER_GROUPS.map((g) => {
              const active = values.groups.includes(g.slug);
              return (
                <button
                  key={g.slug}
                  type="button"
                  onClick={() => toggleGroup(g.slug)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium border cursor-pointer transition-colors ${
                    active
                      ? "bg-brand-800 text-gold-soft border-brand-800"
                      : "bg-white text-ink-soft border-line hover:border-brand-300 hover:bg-brand-50"
                  }`}
                >
                  {g.name}
                </button>
              );
            })}
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-display text-lg font-semibold text-ink mb-1">Occasions</h2>
          <p className="text-xs text-ink-muted mb-4">Pick all occasions this gift fits — products can belong to many.</p>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((o) => {
              const active = values.occasions.includes(o.slug);
              return (
                <button
                  key={o.slug}
                  type="button"
                  onClick={() => toggleOccasion(o.slug)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium border cursor-pointer transition-colors ${
                    active
                      ? "bg-gold text-ink border-gold"
                      : "bg-white text-ink-soft border-line hover:border-gold/50 hover:bg-gold/10"
                  }`}
                >
                  {o.name}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-8 lg:self-start space-y-4">
        <section className="card p-6">
          <h2 className="font-display text-lg font-semibold text-ink mb-3">Image</h2>
          <div className="relative aspect-square rounded-xl overflow-hidden bg-bg-soft border border-line mb-3">
            {values.image && (
              <Image src={values.image} alt="Product preview" fill sizes="320px" className="object-cover" />
            )}
          </div>
          <label htmlFor="image-url" className="label">Image URL</label>
          <input
            id="image-url"
            type="url"
            value={values.image.startsWith("data:") ? "" : values.image}
            onChange={(e) => update("image", e.target.value)}
            className="input"
            placeholder="https://…"
          />
          <p className="mt-3 text-xs text-ink-muted">Or upload from device:</p>
          <input
            ref={fileRef}
            id="image-file"
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="block w-full text-xs text-ink-muted mt-1 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-brand-50 file:text-brand-800 hover:file:bg-brand-100 file:cursor-pointer cursor-pointer"
          />
        </section>

        <div className="card p-4 flex gap-3">
          <button type="button" onClick={onCancel} className="btn-ghost flex-1">Cancel</button>
          <button type="submit" className="btn-gold flex-1">{submitLabel}</button>
        </div>
      </aside>
    </form>
  );
}
