import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page text-center py-20">
      <h1 className="font-display text-3xl font-semibold text-ink">Gift not found</h1>
      <p className="text-ink-muted mt-2">We couldn't find the product you were looking for.</p>
      <Link href="/shop" className="btn-primary mt-6">Back to shop</Link>
    </div>
  );
}
