"use client";

import { useEffect, useState } from "react";
import { Form, Formik, useFormik } from "formik";
import { useRouter } from "next/navigation";
import { AdminPager, adminPageSize, pageLabel } from "@/components/admin-pager";
import { apiFetch, useAuth, type AuthUser } from "@/components/auth-provider";
import { SelectField, TextField } from "@/components/form-field";
import { createUserSchema, updateUserSchema } from "@/lib/validation";

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
};

type UserList = {
  items: AuthUser[];
  page: number;
  pageSize: number;
  total: number;
};

const inputClass =
  "rounded-xl border border-line bg-paper px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export function UserAdmin() {
  const router = useRouter();
  const { user, ready, hasPermission } = useAuth();
  const canManage = hasPermission("users.manage");
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [roles, setRoles] = useState<Role[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.push("/masuk");
      return;
    }
    if (!user.permissions.includes("users.read")) return;

    let active = true;
    setBusy(true);
    Promise.all([
      apiFetch<{ data: UserList }>(`/api/users?page=${page}&pageSize=${adminPageSize}`),
      apiFetch<{ data: Role[] }>("/api/users/roles"),
    ])
      .then(([userPayload, rolePayload]) => {
        if (!active) return;
        if (userPayload.data.items.length === 0 && userPayload.data.total > 0 && page > 1) {
          setPage(Math.ceil(userPayload.data.total / adminPageSize));
          return;
        }
        setUsers(userPayload.data.items);
        setTotal(userPayload.data.total);
        setRoles(rolePayload.data);
        setEditingId(null);
        setLoading(false);
        setBusy(false);
      })
      .catch((caught: unknown) => {
        if (!active) return;
        setError(
          caught instanceof Error
            ? caught.message
            : "Data pengguna tidak dapat dimuat",
        );
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

  async function saveUser(target: AuthUser, roleId: string, isActive: boolean) {
    setError(null);
    setMessage(null);
    try {
      const result = await apiFetch<{ data: AuthUser }>(
        `/api/users/${target.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ roleId, isActive }),
        },
      );
      setUsers((current) =>
        current.map((item) => (item.id === target.id ? result.data : item)),
      );
      setEditingId(null);
      setMessage("Perubahan disimpan");
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Gagal menyimpan pengguna",
      );
    }
  }

  if (!ready || !user)
    return <p className="text-sm text-muted">Memuat pengguna...</p>;
  if (!hasPermission("users.read")) {
    return (
      <p className="text-sm">Anda tidak memiliki akses ke daftar pengguna.</p>
    );
  }
  if (loading) return <p className="text-sm text-muted">Memuat pengguna...</p>;

  return (
    <div className="flex flex-col gap-8">
      {canManage ? (
        <section className="rounded-2xl border border-line bg-card p-6">
          <h2 className="text-lg font-semibold">Pengguna baru</h2>
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              roleId: roles[0]?.id ?? "",
            }}
            validationSchema={createUserSchema}
            onSubmit={async (values, helpers) => {
              setError(null);
              setMessage(null);
              try {
                await apiFetch<{ data: AuthUser }>("/api/users", {
                  method: "POST",
                  body: JSON.stringify(values),
                });
                helpers.resetForm();
                setMessage("Pengguna berhasil dibuat");
                showPage(1);
              } catch (caught) {
                setError(
                  caught instanceof Error
                    ? caught.message
                    : "Gagal membuat pengguna",
                );
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form noValidate className="mt-4 grid gap-4 sm:grid-cols-2">
                <TextField name="name" label="Nama" className={inputClass} />
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  className={inputClass}
                />
                <TextField
                  name="password"
                  label="Kata sandi awal"
                  type="password"
                  autoComplete="new-password"
                  className={inputClass}
                />
                <SelectField name="roleId" label="Peran" className={inputClass}>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </SelectField>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-deep disabled:opacity-60"
                  >
                    {isSubmitting ? "Menyimpan..." : "Buat pengguna"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </section>
      ) : null}

      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
      {message ? <p className="text-sm text-muted">{message}</p> : null}

      {total > 0 ? <p className="text-sm text-muted">{pageLabel(page, total)}</p> : null}

      <div className="overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-paper">
            <tr>
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Peran</th>
              <th className="px-4 py-3 font-medium">Status</th>
              {canManage ? (
                <th className="px-4 py-3 font-medium">Aksi</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {users.map((item) => (
              <UserRow
                key={item.id}
                item={item}
                roles={roles}
                canManage={canManage}
                editing={editingId === item.id}
                onEdit={() => setEditingId(item.id)}
                onCancel={() => setEditingId(null)}
                onSave={saveUser}
              />
            ))}
            {users.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 5 : 4} className="px-4 py-6 text-muted">
                  Belum ada pengguna.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <AdminPager page={page} totalPages={total === 0 ? 0 : Math.ceil(total / adminPageSize)} disabled={busy} onPage={showPage} />
    </div>
  );
}

function UserRow({
  item,
  roles,
  canManage,
  editing,
  onEdit,
  onCancel,
  onSave,
}: {
  item: AuthUser;
  roles: Role[];
  canManage: boolean;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (user: AuthUser, roleId: string, isActive: boolean) => Promise<void>;
}) {
  const formik = useFormik({
    initialValues: { roleId: item.role?.id ?? "", isActive: item.isActive },
    validationSchema: updateUserSchema,
    enableReinitialize: true,
    onSubmit: (values) => onSave(item, values.roleId, values.isActive),
  });
  const showFields = canManage && editing;

  return (
    <tr className="border-t border-line">
      <td className="px-4 py-3">{item.name}</td>
      <td className="px-4 py-3">{item.email}</td>
      <td className="px-4 py-3">
        {showFields ? (
          <div className="flex flex-col gap-1">
            <select
              name="roleId"
              value={formik.values.roleId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="rounded-lg border border-line bg-card px-2 py-1"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {formik.touched.roleId && formik.errors.roleId ? (
              <span className="text-xs text-danger">
                {formik.errors.roleId}
              </span>
            ) : null}
          </div>
        ) : (
          item.role?.name
        )}
      </td>
      <td className="px-4 py-3">
        {showFields ? (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formik.values.isActive}
              onChange={(event) =>
                void formik.setFieldValue("isActive", event.target.checked)
              }
              onBlur={formik.handleBlur}
              className="accent-brand"
            />
            {formik.values.isActive ? "Aktif" : "Nonaktif"}
          </label>
        ) : item.isActive ? (
          "Aktif"
        ) : (
          "Nonaktif"
        )}
      </td>
      {canManage ? (
        <td className="px-4 py-3">
          {showFields ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => void formik.submitForm()}
                disabled={formik.isSubmitting}
                className="font-medium text-brand disabled:opacity-40"
              >
                {formik.isSubmitting ? "Menyimpan..." : "Simpan"}
              </button>
              <button type="button" onClick={onCancel} disabled={formik.isSubmitting} className="text-muted disabled:opacity-40">
                Batal
              </button>
            </div>
          ) : (
            <button type="button" onClick={onEdit} className="font-medium text-brand">
              Edit
            </button>
          )}
        </td>
      ) : null}
    </tr>
  );
}
