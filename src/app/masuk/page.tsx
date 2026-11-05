import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";
import { SiteHeader } from "@/components/site-header";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Masuk",
  description: "Masuk ke akun perusahaan Migo.",
  path: "/masuk",
  index: false,
});

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Masuk</h1>
        <p className="mt-2 text-sm text-muted">Gunakan akun yang diberikan administrator.</p>
        <div className="mt-8">
          <Suspense fallback={<p className="text-sm text-muted">Memuat formulir...</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
