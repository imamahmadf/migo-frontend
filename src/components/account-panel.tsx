"use client";

import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { apiFetch, useAuth } from "@/components/auth-provider";
import type { AuthUser } from "@/components/auth-provider";
import { TextField } from "@/components/form-field";
import { changePasswordSchema } from "@/lib/validation";

const inputClass = "rounded-xl border border-line bg-paper px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export function AccountPanel() {
  const router = useRouter();
  const { user, ready, setUser } = useAuth();

  useEffect(() => {
    if (ready && !user) router.push("/masuk");
  }, [ready, user, router]);

  if (!ready || !user) {
    return <p className="text-sm text-muted">Memuat akun...</p>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="rounded-2xl border border-line bg-card p-6">
        <h2 className="text-lg font-semibold">Profil</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-muted">Nama</dt>
            <dd className="mt-1 font-medium">{user.name}</dd>
          </div>
          <div>
            <dt className="text-muted">Email</dt>
            <dd className="mt-1 font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-muted">Peran</dt>
            <dd className="mt-1 font-medium">{user.role?.name ?? "-"}</dd>
          </div>
        </dl>
      </section>

      <PasswordForm
        onChanged={(next) => {
          setUser(next);
        }}
      />
    </div>
  );
}

function PasswordForm({ onChanged }: { onChanged: (user: AuthUser) => void }) {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <section className="rounded-2xl border border-line bg-card p-6">
      <h2 className="text-lg font-semibold">Ganti kata sandi</h2>
      <p className="mt-1 text-sm text-muted">Minimal 10 karakter, memuat huruf besar, huruf kecil, dan angka.</p>
      <Formik
        initialValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
        validationSchema={changePasswordSchema}
        onSubmit={async (values, helpers) => {
          helpers.setStatus(null);
          setMessage(null);
          try {
            const result = await apiFetch<{ data: AuthUser }>("/api/auth/change-password", {
              method: "POST",
              body: JSON.stringify(values),
            });
            onChanged(result.data);
            helpers.resetForm();
            setMessage("Kata sandi diperbarui. Sesi lain telah dikeluarkan.");
          } catch (caught) {
            helpers.setStatus(caught instanceof Error ? caught.message : "Gagal mengubah kata sandi");
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form noValidate className="mt-4 flex flex-col gap-4">
            <TextField name="currentPassword" label="Kata sandi saat ini" type="password" autoComplete="current-password" className={inputClass} />
            <TextField name="newPassword" label="Kata sandi baru" type="password" autoComplete="new-password" className={inputClass} />
            <TextField name="confirmPassword" label="Ulangi kata sandi baru" type="password" autoComplete="new-password" className={inputClass} />
            {status ? (
              <p role="alert" className="text-sm text-danger">
                {status}
              </p>
            ) : null}
            {message ? <p className="text-sm text-muted">{message}</p> : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-deep disabled:opacity-60"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan kata sandi"}
            </button>
          </Form>
        )}
      </Formik>
    </section>
  );
}
