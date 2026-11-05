"use client";

import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { AdminPager, adminPageSize, pageAfterChange, pageLabel } from "@/components/admin-pager";
import { apiFetch, useAuth } from "@/components/auth-provider";
import { TextField } from "@/components/form-field";
import type { FaqItem, FaqPage } from "@/content/faq";
import { faqSchema } from "@/lib/validation";

const inputClass = "rounded-xl border border-line bg-paper px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";
const emptyPage: FaqPage = { items: [], page: 1, pageSize: adminPageSize, total: 0, totalPages: 0 };

export function FaqAdmin() {
  const router = useRouter();
  const { user, ready, hasPermission } = useAuth();
  const [list, setList] = useState<FaqPage>(emptyPage);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [reload, setReload] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.push("/masuk");
      return;
    }
    if (!user.permissions.includes("content.manage")) return;

    let active = true;
    setBusy(true);
    const params = new URLSearchParams({ page: String(page), pageSize: String(adminPageSize) });
    if (query) params.set("q", query);
    apiFetch<{ data: FaqPage }>(`/api/faqs?${params.toString()}`)
      .then((payload) => {
        if (!active) return;
        if (payload.data.items.length === 0 && payload.data.total > 0 && page > 1) {
          setPage(Math.ceil(payload.data.total / adminPageSize));
          return;
        }
        setList(payload.data);
        setEditingId(null);
        setLoading(false);
        setBusy(false);
      })
      .catch((caught: unknown) => {
        if (!active) return;
        setError(caught instanceof Error ? caught.message : "FAQ tidak dapat dimuat");
        setLoading(false);
        setBusy(false);
      });

    return () => {
      active = false;
    };
  }, [ready, user, router, page, query, reload]);

  function search(keyword: string) {
    const next = keyword.trim().slice(0, 80);
    setDraft(next);
    setQuery(next);
    setError(null);
    setMessage(null);
    if (page !== 1) setPage(1);
    else setReload((current) => current + 1);
  }

  function showPage(nextPage: number) {
    setError(null);
    setMessage(null);
    if (nextPage === page) setReload((current) => current + 1);
    else setPage(nextPage);
  }

  async function removeItem(item: FaqItem) {
    if (!window.confirm("Hapus pertanyaan ini dari situs?")) return;
    setPendingId(item.id);
    setError(null);
    setMessage(null);
    try {
      await apiFetch(`/api/faqs/${item.id}`, { method: "DELETE" });
      showPage(pageAfterChange(page, list.total - 1));
      setMessage("Pertanyaan dihapus.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Pertanyaan gagal dihapus");
    } finally {
      setPendingId(null);
    }
  }

  if (!ready || !user) return <p className="text-sm text-muted">Memuat FAQ...</p>;
  if (!hasPermission("content.manage")) {
    return <p className="text-sm">Anda tidak memiliki akses untuk mengubah FAQ.</p>;
  }
  if (loading) return <p className="text-sm text-muted">Memuat FAQ...</p>;

  return (
    <div className="flex flex-col gap-6">
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
      {message ? <p className="text-sm text-muted">{message}</p> : null}

      <section className="rounded-3xl border border-line bg-card p-6">
        <h2 className="text-lg font-semibold">Pertanyaan baru</h2>
        <Formik
          initialValues={{ question: "", answer: "" }}
          validationSchema={faqSchema}
          onSubmit={async (values, helpers) => {
            setError(null);
            setMessage(null);
            try {
              await apiFetch<{ data: FaqItem }>("/api/faqs", {
                method: "POST",
                body: JSON.stringify(values),
              });
              helpers.resetForm();
              setDraft("");
              setQuery("");
              showPage(1000);
              setMessage("Pertanyaan ditambahkan.");
            } catch (caught) {
              setError(caught instanceof Error ? caught.message : "Pertanyaan gagal ditambahkan");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form noValidate className="mt-4 flex flex-col gap-4">
              <TextField name="question" label="Pertanyaan" className={inputClass} />
              <TextField name="answer" label="Jawaban" multiline rows={4} className={inputClass} />
              <button
                type="submit"
                disabled={isSubmitting}
                className="self-start rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-deep disabled:opacity-60"
              >
                {isSubmitting ? "Menyimpan..." : "Tambah pertanyaan"}
              </button>
            </Form>
          )}
        </Formik>
      </section>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          search(draft);
        }}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <label className="flex min-w-0 flex-1 flex-col gap-2 text-sm">
          Cari pertanyaan
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            maxLength={80}
            placeholder="Pertanyaan atau jawaban"
            className={inputClass}
          />
        </label>
        <button type="submit" className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-deep">
          Filter
        </button>
        {query ? (
          <button type="button" onClick={() => search("")} className="rounded-full border border-line px-5 py-2.5 text-sm">
            Reset
          </button>
        ) : null}
      </form>

      {list.total === 0 ? (
        <p className="text-sm text-muted">{query ? "Tidak ada pertanyaan yang cocok." : "Belum ada pertanyaan."}</p>
      ) : (
        <p className="text-sm text-muted">{pageLabel(list.page, list.total)}</p>
      )}

      {list.items.map((item) =>
        editingId === item.id ? (
          <FaqEditor
            key={item.id}
            item={item}
            pending={pendingId === item.id}
            onCancel={() => setEditingId(null)}
            onSave={async (values) => {
              setPendingId(item.id);
              setError(null);
              setMessage(null);
              try {
                const result = await apiFetch<{ data: FaqItem }>(`/api/faqs/${item.id}`, {
                  method: "PATCH",
                  body: JSON.stringify(values),
                });
                setList((current) => ({
                  ...current,
                  items: current.items.map((entry) => (entry.id === item.id ? result.data : entry)),
                }));
                setEditingId(null);
                setMessage("Pertanyaan diperbarui.");
              } catch (caught) {
                setError(caught instanceof Error ? caught.message : "Pertanyaan gagal diperbarui");
              } finally {
                setPendingId(null);
              }
            }}
            onRemove={() => void removeItem(item)}
          />
        ) : (
          <section key={item.id} className="rounded-3xl border border-line bg-card p-6">
            <h2 className="text-lg font-semibold">{item.question}</h2>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{item.answer}</p>
            <div className="mt-4 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setEditingId(item.id)}
                disabled={pendingId !== null}
                className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-deep disabled:opacity-60"
              >
                Edit
              </button>
              <button type="button" onClick={() => void removeItem(item)} disabled={pendingId !== null} className="text-sm text-brand disabled:opacity-40">
                Hapus
              </button>
            </div>
          </section>
        ),
      )}

      <AdminPager page={list.page} totalPages={list.totalPages} disabled={busy} onPage={showPage} />
    </div>
  );
}

function FaqEditor({
  item,
  pending,
  onSave,
  onRemove,
  onCancel,
}: {
  item: FaqItem;
  pending: boolean;
  onSave: (values: { question: string; answer: string }) => Promise<void>;
  onRemove: () => void;
  onCancel: () => void;
}) {
  return (
    <section className="rounded-3xl border border-brand/40 bg-card p-6">
      <Formik initialValues={{ question: item.question, answer: item.answer }} validationSchema={faqSchema} onSubmit={(values) => onSave(values)}>
        <Form noValidate className="flex flex-col gap-4">
          <TextField name="question" label="Pertanyaan" className={inputClass} />
          <TextField name="answer" label="Jawaban" multiline rows={4} className={inputClass} />
          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-deep disabled:opacity-60"
            >
              {pending ? "Menyimpan..." : "Simpan"}
            </button>
            <button type="button" onClick={onCancel} disabled={pending} className="text-sm text-muted disabled:opacity-40">
              Batal
            </button>
            <button type="button" onClick={onRemove} disabled={pending} className="text-sm text-brand disabled:opacity-40">
              Hapus
            </button>
          </div>
        </Form>
      </Formik>
    </section>
  );
}
