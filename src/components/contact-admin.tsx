"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminPager, adminPageSize, pageLabel } from "@/components/admin-pager";
import { apiFetch, useAuth } from "@/components/auth-provider";
import { contactStatuses, type ContactMessage, type ContactMessagePage, type ContactStatus } from "@/content/contact";

const inputClass = "rounded-xl border border-line bg-paper px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";
const emptyPage: ContactMessagePage = { items: [], page: 1, pageSize: adminPageSize, total: 0, totalPages: 0 };

function statusLabel(status: string) {
  return contactStatuses.find((item) => item.value === status)?.label ?? status;
}

function formatWhen(value: string) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function ContactAdmin() {
  const router = useRouter();
  const { user, ready, hasPermission } = useAuth();
  const [list, setList] = useState<ContactMessagePage>(emptyPage);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");
  const [draftStatus, setDraftStatus] = useState("");
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
    if (status) params.set("status", status);
    apiFetch<{ data: ContactMessagePage }>(`/api/contact?${params.toString()}`)
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
        setError(caught instanceof Error ? caught.message : "Pesan tidak dapat dimuat");
        setLoading(false);
        setBusy(false);
      });

    return () => {
      active = false;
    };
  }, [ready, user, router, page, query, status, reload]);

  function search(keyword: string, nextStatus = draftStatus) {
    const next = keyword.trim().slice(0, 80);
    setDraft(next);
    setDraftStatus(nextStatus);
    setQuery(next);
    setStatus(nextStatus);
    setError(null);
    setMessage(null);
    if (page !== 1) setPage(1);
    else setReload((current) => current + 1);
  }

  async function saveStatus(item: ContactMessage, nextStatus: ContactStatus) {
    setPendingId(item.id);
    setError(null);
    setMessage(null);
    try {
      await apiFetch(`/api/contact/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      setEditingId(null);
      if (status && status !== nextStatus) search(query, status);
      else setReload((current) => current + 1);
      setMessage("Status pesan disimpan.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Status gagal disimpan");
    } finally {
      setPendingId(null);
    }
  }

  if (!ready || !user) return <p className="text-sm text-muted">Memuat pesan...</p>;
  if (!hasPermission("content.manage")) {
    return <p className="text-sm">Anda tidak memiliki akses untuk melihat pesan.</p>;
  }
  if (loading) return <p className="text-sm text-muted">Memuat pesan...</p>;

  return (
    <div className="flex flex-col gap-6">
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
      {message ? <p className="text-sm text-muted">{message}</p> : null}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          search(String(data.get("q") ?? ""), String(data.get("status") ?? ""));
        }}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <label className="flex min-w-0 flex-1 flex-col gap-2 text-sm">
          Cari pesan
          <input name="q" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={80} placeholder="Nama, nomor, atau isi pesan" className={inputClass} />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          Status
          <select name="status" value={draftStatus} onChange={(event) => setDraftStatus(event.target.value)} className={inputClass}>
            <option value="">Semua</option>
            {contactStatuses.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-deep">
          Filter
        </button>
      </form>

      {list.total === 0 ? (
        <p className="text-sm text-muted">{query || status ? "Tidak ada pesan yang cocok." : "Belum ada pesan."}</p>
      ) : (
        <p className="text-sm text-muted">{pageLabel(list.page, list.total)}</p>
      )}

      {list.items.map((item) => (
        <article key={item.id} className="rounded-3xl border border-line bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="mt-1 text-sm text-muted">
                {item.phone} · {item.topic}
              </p>
            </div>
            <p className="text-sm font-medium text-brand">{statusLabel(item.status)}</p>
          </div>
          <p className="mt-4 text-sm leading-6">{item.message}</p>
          <p className="mt-3 text-xs text-muted">{formatWhen(item.createdAt)}</p>
          {editingId === item.id ? (
            <StatusEditor item={item} pending={pendingId === item.id} onCancel={() => setEditingId(null)} onSave={(next) => void saveStatus(item, next)} />
          ) : (
            <button
              type="button"
              onClick={() => setEditingId(item.id)}
              disabled={pendingId !== null}
              className="mt-4 rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-deep disabled:opacity-60"
            >
              Ubah status
            </button>
          )}
        </article>
      ))}

      <AdminPager page={list.page} totalPages={list.totalPages} disabled={busy} onPage={(next) => (next === page ? setReload((current) => current + 1) : setPage(next))} />
    </div>
  );
}

function StatusEditor({
  item,
  pending,
  onSave,
  onCancel,
}: {
  item: ContactMessage;
  pending: boolean;
  onSave: (status: ContactStatus) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState<ContactStatus>(item.status);

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <label className="text-sm">
        Status
        <select value={value} onChange={(event) => setValue(event.target.value as ContactStatus)} className={`${inputClass} ml-2`}>
          {contactStatuses.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        disabled={pending}
        onClick={() => onSave(value)}
        className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-deep disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : "Simpan"}
      </button>
      <button type="button" onClick={onCancel} disabled={pending} className="text-sm text-muted disabled:opacity-40">
        Batal
      </button>
    </div>
  );
}
