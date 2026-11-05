"use client";

import { useEffect, useState } from "react";
import { Form, Formik, useField } from "formik";
import { useRouter } from "next/navigation";
import { AdminPager, adminPageSize, pageAfterChange, pageLabel } from "@/components/admin-pager";
import { apiFetch, useAuth } from "@/components/auth-provider";
import { TextField } from "@/components/form-field";
import type { GalleryPhoto, PhotoPage } from "@/content/photo";
import { photoCreateSchema, photoUpdateSchema } from "@/lib/validation";

const inputClass = "rounded-xl border border-line bg-paper px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

type PhotoValues = {
  title: string;
  description: string;
  image: File | null;
};

function PhotoFileField({ label }: { label: string }) {
  const [field, meta, helpers] = useField<File | null>("image");
  const invalid = Boolean(meta.touched && meta.error);

  return (
    <label className="flex flex-col gap-2 text-sm">
      {label}
      <input
        name={field.name}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onBlur={field.onBlur}
        onChange={(event) => {
          void helpers.setValue(event.currentTarget.files?.[0] ?? null);
        }}
        className="text-sm file:mr-3 file:rounded-full file:border-0 file:bg-brand file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
      />
      {invalid ? <span className="text-xs text-danger">{meta.error}</span> : null}
    </label>
  );
}

function photoBody(values: PhotoValues) {
  const body = new FormData();
  body.set("title", values.title);
  body.set("description", values.description);
  if (values.image) body.set("image", values.image);
  return body;
}

const emptyPage: PhotoPage = { items: [], page: 1, pageSize: adminPageSize, total: 0, totalPages: 0 };

export function PhotoAdmin() {
  const router = useRouter();
  const { user, ready, hasPermission } = useAuth();
  const [list, setList] = useState<PhotoPage>(emptyPage);
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [createKey, setCreateKey] = useState(0);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.push("/masuk");
      return;
    }
    if (!user.permissions.includes("content.manage")) return;

    let active = true;
    setBusy(true);
    apiFetch<{ data: PhotoPage }>(`/api/photos?page=${page}&pageSize=${adminPageSize}&sort=order`)
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
        setError(caught instanceof Error ? caught.message : "Foto tidak dapat dimuat");
        setLoading(false);
        setBusy(false);
      });

    return () => {
      active = false;
    };
  }, [ready, user, router, page, reload]);

  function showPage(nextPage: number) {
    setError(null);
    setMessage(null);
    if (nextPage === page) setReload((current) => current + 1);
    else setPage(nextPage);
  }

  async function removeItem(item: GalleryPhoto) {
    if (!window.confirm("Hapus foto ini dari situs?")) return;
    setPendingId(item.id);
    setError(null);
    setMessage(null);
    try {
      await apiFetch(`/api/photos/${item.id}`, { method: "DELETE" });
      setMessage("Foto dihapus.");
      showPage(pageAfterChange(page, list.total - 1));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Foto gagal dihapus");
    } finally {
      setPendingId(null);
    }
  }

  if (!ready || !user) return <p className="text-sm text-muted">Memuat foto...</p>;
  if (!hasPermission("content.manage")) {
    return <p className="text-sm">Anda tidak memiliki akses untuk mengubah foto.</p>;
  }
  if (loading) return <p className="text-sm text-muted">Memuat foto...</p>;

  return (
    <div className="flex flex-col gap-6">
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
      {message ? <p className="text-sm text-muted">{message}</p> : null}

      <section className="rounded-3xl border border-line bg-card p-6">
        <h2 className="text-lg font-semibold">Foto baru</h2>
        <Formik
          key={createKey}
          initialValues={{ title: "", description: "", image: null }}
          validationSchema={photoCreateSchema}
          onSubmit={async (values, helpers) => {
            setError(null);
            setMessage(null);
            try {
              await apiFetch<{ data: GalleryPhoto }>("/api/photos", {
                method: "POST",
                body: photoBody(values),
              });
              helpers.resetForm();
              setCreateKey((current) => current + 1);
              setMessage("Foto ditambahkan.");
              showPage(Math.max(1, Math.ceil((list.total + 1) / adminPageSize)));
            } catch (caught) {
              setError(caught instanceof Error ? caught.message : "Foto gagal ditambahkan");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form noValidate className="mt-4 flex flex-col gap-4">
              <TextField name="title" label="Judul" className={inputClass} />
              <TextField name="description" label="Deskripsi" multiline rows={4} className={inputClass} />
              <PhotoFileField label="Foto" />
              <button
                type="submit"
                disabled={isSubmitting}
                className="self-start rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-deep disabled:opacity-60"
              >
                {isSubmitting ? "Menyimpan..." : "Unggah foto"}
              </button>
            </Form>
          )}
        </Formik>
      </section>

      {list.total === 0 ? <p className="text-sm text-muted">Belum ada foto.</p> : <p className="text-sm text-muted">{pageLabel(list.page, list.total)}</p>}

      {list.items.map((item) =>
        editingId === item.id ? (
          <PhotoEditor
            key={item.id}
            item={item}
            pending={pendingId === item.id}
            onCancel={() => setEditingId(null)}
            onSave={async (values) => {
              setPendingId(item.id);
              setError(null);
              setMessage(null);
              try {
                const result = await apiFetch<{ data: GalleryPhoto }>(`/api/photos/${item.id}`, {
                  method: "PATCH",
                  body: photoBody(values),
                });
                setList((current) => ({
                  ...current,
                  items: current.items.map((entry) => (entry.id === item.id ? result.data : entry)),
                }));
                setEditingId(null);
                setMessage("Foto diperbarui.");
              } catch (caught) {
                setError(caught instanceof Error ? caught.message : "Foto gagal diperbarui");
                throw caught;
              } finally {
                setPendingId(null);
              }
            }}
            onRemove={() => void removeItem(item)}
          />
        ) : (
          <section key={item.id} className="rounded-3xl border border-line bg-card p-6">
            <img src={item.image} alt={item.title} className="h-44 w-full max-w-sm rounded-2xl object-cover" />
            <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{item.description}</p>
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

function PhotoEditor({
  item,
  pending,
  onSave,
  onRemove,
  onCancel,
}: {
  item: GalleryPhoto;
  pending: boolean;
  onSave: (values: PhotoValues) => Promise<void>;
  onRemove: () => void;
  onCancel: () => void;
}) {
  return (
    <section className="rounded-3xl border border-brand/40 bg-card p-6">
      <img src={item.image} alt={item.title} className="h-44 w-full max-w-sm rounded-2xl object-cover" />
      <Formik
        initialValues={{ title: item.title, description: item.description, image: null }}
        validationSchema={photoUpdateSchema}
        onSubmit={(values) => onSave(values)}
      >
        <Form noValidate className="mt-4 flex flex-col gap-4">
          <TextField name="title" label="Judul" className={inputClass} />
          <TextField name="description" label="Deskripsi" multiline rows={4} className={inputClass} />
          <PhotoFileField label="Ganti foto" />
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
