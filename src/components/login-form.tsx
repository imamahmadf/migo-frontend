"use client";

import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch, useAuth } from "@/components/auth-provider";
import type { AuthUser } from "@/components/auth-provider";
import { TextField } from "@/components/form-field";
import { loginSchema } from "@/lib/validation";

const inputClass = "rounded-xl border border-line bg-card px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={loginSchema}
      onSubmit={async (values, helpers) => {
        helpers.setStatus(null);
        try {
          const result = await apiFetch<{ data: AuthUser }>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(values),
          });
          setUser(result.data);

          const next = searchParams.get("next");
          const fallback = result.data.role?.id === "admin" ? "/admin" : "/akun";
          const destination = next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
          router.push(destination);
          router.refresh();
        } catch (caught) {
          helpers.setStatus(caught instanceof Error ? caught.message : "Gagal masuk");
        }
      }}
    >
      {({ isSubmitting, status }) => (
        <Form noValidate className="flex flex-col gap-4">
          <TextField name="email" label="Email" type="email" autoComplete="username" className={inputClass} />
          <TextField name="password" label="Kata sandi" type="password" autoComplete="current-password" className={inputClass} />
          {status ? (
            <p role="alert" className="text-sm text-danger">
              {status}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-deep disabled:opacity-60"
          >
            {isSubmitting ? "Memeriksa..." : "Masuk"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
