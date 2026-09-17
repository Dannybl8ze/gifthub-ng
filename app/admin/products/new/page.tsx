"use client";

import { useRouter } from "next/navigation";
import { useAdminProducts } from "@/lib/admin-store";
import { ProductForm } from "@/components/product-form";

export default function NewProductPage() {
  const router = useRouter();
  const { create } = useAdminProducts();

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-ink tracking-tight">New product</h1>
        <p className="text-ink-muted mt-1">Add a new gift to the catalogue.</p>
      </header>

      <ProductForm
        submitLabel="Create product"
        onCancel={() => router.push("/admin/products")}
        onSubmit={(values) => {
          create(values);
          router.push("/admin/products");
        }}
      />
    </div>
  );
}
