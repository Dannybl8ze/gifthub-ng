import { Logo } from "@/components/logo";
import { AdminLoginForm } from "@/components/admin-login-form";

export const metadata = {
  title: "Admin sign-in — GiftHub NG",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="card w-full max-w-md p-8">
        <Logo />
        <h1 className="mt-6 font-display text-2xl font-medium text-ink tracking-tight">
          Admin sign-in
        </h1>
        <p className="mt-1 text-sm text-ink-muted">For the GiftHub NG team only.</p>
        <div className="mt-6">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
