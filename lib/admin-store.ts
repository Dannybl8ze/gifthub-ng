"use client";

import { useEffect, useState, useCallback } from "react";
import { PRODUCTS as SEED } from "./mock-data";
import type { Product } from "./types";

const PRODUCTS_KEY = "gifthub.admin.products.v1";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function genId() {
  return `p-${Math.random().toString(36).slice(2, 8)}`;
}

function readStored(): Product[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Hook used by admin pages to manage product CRUD with localStorage persistence. */
export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>(SEED);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStored();
    if (stored && stored.length) setProducts(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch {}
  }, [products, hydrated]);

  const create = useCallback((input: Omit<Product, "id" | "slug"> & { slug?: string }) => {
    const id = genId();
    const slug = input.slug || slugify(input.name);
    const product: Product = { ...input, id, slug };
    setProducts((prev) => [product, ...prev]);
    return product;
  }, []);

  const update = useCallback((id: string, patch: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const remove = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const reset = useCallback(() => {
    setProducts(SEED);
  }, []);

  return { products, hydrated, create, update, remove, reset };
}

export { slugify };
