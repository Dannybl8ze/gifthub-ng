"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminProducts } from "@/lib/admin-store";
import { ProductForm } from "@/components/product-form";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { products, update, hydrated } = useAdminProducts();
  const product = products.find((p) => p.id === id);

  if (!hydrated) {
    return <p className="text-sm text-ink-muted">Loading…</p>;
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <h1 className="font-display text-2xl font-semibold text-ink">Product not found</h1>
        <p className="text-ink-muted mt-2">It may have been deleted.</p>
        <Link href="/admin/products" className="btn-primary mt-6 inline-flex">Back to products</Link>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-ink tracking-tight">Edit product</h1>
        <p className="text-ink-muted mt-1">Updating <span className="text-brand-900 font-medium">{product.name}</span></p>
      </header>

      <ProductForm
        initial={product}
        submitLabel="Save changes"
        onCancel={() => router.push("/admin/products")}
        onSubmit={(values) => {
          update(product.id, values);
          router.push("/admin/products");
        }}
      />
    </div>
  );
}
