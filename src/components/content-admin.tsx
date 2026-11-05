"use client";

import { useEffect, useState, type ReactNode } from "react";
import { FieldArray, Form, Formik, useFormikContext } from "formik";
import { useRouter } from "next/navigation";
import { apiFetch, useAuth } from "@/components/auth-provider";
import { TextField } from "@/components/form-field";
import { contentSections, type ContentSectionId } from "@/content/content-sections";
import type { CompanyProfileContent, PartnerGroup, TextBlock } from "@/content/profile";
import { heroFileSchema, profileSchema } from "@/lib/validation";

const inputClass = "rounded-xl border border-line bg-paper px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-line bg-card p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}

function RowActions({ onRemove, canRemove }: { onRemove: () => void; canRemove: boolean }) {
  return (
    <button type="button" onClick={onRemove} disabled={!canRemove} className="text-sm text-brand disabled:opacity-40">
      Hapus
    </button>
  );
}

export function ContentAdmin({ section }: { section: ContentSectionId }) {
  const router = useRouter();
  const { user, ready, hasPermission } = useAuth();
  const [profile, setProfile] = useState<CompanyProfileContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.push("/masuk");
      return;
    }
    if (!user.permissions.includes("content.manage")) return;

    let active = true;
    apiFetch<{ data: CompanyProfileContent }>("/api/content/profile/admin")
      .then((payload) => {
        if (!active) return;
        setProfile(payload.data);
        setLoading(false);
      })
      .catch((caught: unknown) => {
        if (!active) return;
        setError(caught instanceof Error ? caught.message : "Konten tidak dapat dimuat");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [ready, user, router]);

  if (!ready || !user) return <p className="text-sm text-muted">Memuat konten...</p>;
  if (!hasPermission("content.manage")) {
    return <p className="text-sm">Anda tidak memiliki akses untuk mengubah konten situs.</p>;
  }
  if (loading) return <p className="text-sm text-muted">Memuat konten...</p>;
  if (!profile) return <p className="text-sm text-danger">{error ?? "Konten tidak tersedia"}</p>;

  return <ProfileForm initial={profile} section={section} />;
}

function ProfileForm({ initial, section }: { initial: CompanyProfileContent; section: ContentSectionId }) {
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const current = contentSections.find((item) => item.id === section) ?? contentSections[0];
  const showNotice = (value: string) => {
    setError(null);
    setNotice(value);
  };
  const showError = (value: string) => {
    setNotice(null);
    setError(value);
  };

  return (
    <Formik
      initialValues={initial}
      validationSchema={profileSchema.pick([...current.fields])}
      onSubmit={async (values, helpers) => {
        setError(null);
        setNotice(null);
        try {
          const latest = await apiFetch<{ data: CompanyProfileContent }>("/api/content/profile/admin");
          const payload = { ...latest.data };
          for (const field of current.fields) {
            Object.assign(payload, { [field]: values[field] });
          }
          const result = await apiFetch<{ data: CompanyProfileContent }>("/api/content/profile", {
            method: "PUT",
            body: JSON.stringify(payload),
          });
          helpers.resetForm({ values: result.data });
          setNotice("Bagian ini disimpan. Muat ulang beranda untuk melihat perubahan.");
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : "Konten gagal disimpan");
        }
      }}
    >
      {({ isSubmitting, submitCount, errors }) => (
        <Form noValidate className="flex flex-col gap-6">
          {error ? (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          ) : null}
          {notice ? <p className="text-sm text-muted">{notice}</p> : null}
          {submitCount > 0 && Object.keys(errors).length > 0 ? (
            <p role="alert" className="text-sm text-danger">
              Periksa isian yang ditandai.
            </p>
          ) : null}

          <SectionBody section={section} onNotice={showNotice} onError={showError} />

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-deep disabled:opacity-60"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

function SectionBody({
  section,
  onNotice,
  onError,
}: {
  section: ContentSectionId;
  onNotice: (message: string) => void;
  onError: (message: string) => void;
}) {
  if (section === "identitas") {
    return (
      <Section title="Identitas">
        <TextField name="legalName" label="Nama badan hukum" className={inputClass} />
        <TextField name="description" label="Ringkasan" multiline className={inputClass} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="locality" label="Kota" className={inputClass} />
          <TextField name="websiteLabel" label="Label situs" className={inputClass} />
        </div>
        <TextField name="websiteUrl" label="Alamat situs" className={inputClass} />
      </Section>
    );
  }

  if (section === "pembuka") return <HeroSection onNotice={onNotice} onError={onError} />;

  if (section === "menu") {
    return (
      <Section title="Menu">
        <NavFields />
      </Section>
    );
  }

  if (section === "tentang") {
    return (
      <Section title="Tentang">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="aboutKicker" label="Label bagian" className={inputClass} />
          <TextField name="aboutTitle" label="Judul bagian" className={inputClass} />
        </div>
        <BlockEditor name="highlights" />
      </Section>
    );
  }

  if (section === "jangkauan") {
    return (
      <Section title="Jangkauan">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="reachKicker" label="Label bagian" className={inputClass} />
          <TextField name="reachTitle" label="Judul bagian" className={inputClass} />
        </div>
        <TextField name="reachBody" label="Penjelasan" multiline className={inputClass} />
        <StatEditor />
      </Section>
    );
  }

  if (section === "cara-kerja") {
    return (
      <Section title="Cara kerja">
        <StepsImageField onNotice={onNotice} onError={onError} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="stepsKicker" label="Label bagian" className={inputClass} />
          <TextField name="stepsTitle" label="Judul bagian" className={inputClass} />
        </div>
        <BlockEditor name="steps" />
      </Section>
    );
  }

  if (section === "kemitraan") {
    return (
      <Section title="Kemitraan">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="partnersKicker" label="Label bagian" className={inputClass} />
          <TextField name="partnersTitle" label="Judul bagian" className={inputClass} />
        </div>
        <PartnerEditor />
      </Section>
    );
  }

  if (section === "keunggulan") {
    return (
      <Section title="Keunggulan">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="strengthsKicker" label="Label bagian" className={inputClass} />
          <TextField name="strengthsTitle" label="Judul bagian" className={inputClass} />
        </div>
        <BlockEditor name="strengths" />
      </Section>
    );
  }

  return (
    <Section title="Kontak">
      <TextField name="contactKicker" label="Label bagian" className={inputClass} />
    </Section>
  );
}

function StepsImageField({ onNotice, onError }: { onNotice: (message: string) => void; onError: (message: string) => void }) {
  const { values, setFieldValue } = useFormikContext<CompanyProfileContent>();
  const [uploading, setUploading] = useState(false);

  async function uploadSteps(file: File) {
    try {
      await heroFileSchema.validate(file);
    } catch (caught) {
      onError(caught instanceof Error ? caught.message : "Gambar tidak valid");
      return;
    }

    setUploading(true);
    try {
      const result = await apiFetch<{ data: CompanyProfileContent }>("/api/content/profile/steps-image", {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      await setFieldValue("stepsImage", result.data.stepsImage);
      onNotice("Ilustrasi cara kerja diperbarui.");
    } catch (caught) {
      onError(caught instanceof Error ? caught.message : "Gambar gagal diunggah");
    } finally {
      setUploading(false);
    }
  }

  async function resetSteps() {
    setUploading(true);
    try {
      const result = await apiFetch<{ data: CompanyProfileContent }>("/api/content/profile/steps-image", { method: "DELETE" });
      await setFieldValue("stepsImage", result.data.stepsImage);
      onNotice("Ilustrasi cara kerja dikembalikan ke bawaan.");
    } catch (caught) {
      onError(caught instanceof Error ? caught.message : "Gambar bawaan gagal dipulihkan");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm">Ilustrasi cara kerja</p>
      <img
        src={values.stepsImage || "/warungmigo.png"}
        alt="Pratinjau ilustrasi cara kerja"
        className="h-44 w-full max-w-sm object-contain"
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-deep">
          {uploading ? "Memproses..." : "Ganti gambar"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void uploadSteps(file);
            }}
          />
        </label>
        {values.stepsImage && values.stepsImage !== "/warungmigo.png" ? (
          <button type="button" onClick={() => void resetSteps()} disabled={uploading} className="text-sm text-brand disabled:opacity-40">
            Gunakan gambar bawaan
          </button>
        ) : null}
      </div>
      <p className="text-xs text-muted">JPEG, PNG, atau WebP, maksimal 5 MB. Gambar langsung tampil di bagian cara kerja.</p>
    </div>
  );
}

function NavFields() {
  const { values } = useFormikContext<CompanyProfileContent>();
  return (
    <>
      {values.nav.map((item, index) => (
        <TextField key={item.id} name={`nav.${index}.label`} label={item.id} className={inputClass} />
      ))}
    </>
  );
}

function HeroSection({ onNotice, onError }: { onNotice: (message: string) => void; onError: (message: string) => void }) {
  const { values, setFieldValue } = useFormikContext<CompanyProfileContent>();
  const [uploading, setUploading] = useState(false);

  async function uploadHero(file: File) {
    try {
      await heroFileSchema.validate(file);
    } catch (caught) {
      onError(caught instanceof Error ? caught.message : "Foto tidak valid");
      return;
    }

    setUploading(true);
    try {
      const result = await apiFetch<{ data: CompanyProfileContent }>("/api/content/profile/hero", {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      await setFieldValue("heroImage", result.data.heroImage);
      onNotice("Foto hero diperbarui.");
    } catch (caught) {
      onError(caught instanceof Error ? caught.message : "Foto gagal diunggah");
    } finally {
      setUploading(false);
    }
  }

  async function resetHero() {
    setUploading(true);
    try {
      const result = await apiFetch<{ data: CompanyProfileContent }>("/api/content/profile/hero", { method: "DELETE" });
      await setFieldValue("heroImage", result.data.heroImage);
      onNotice("Foto hero dikembalikan ke bawaan.");
    } catch (caught) {
      onError(caught instanceof Error ? caught.message : "Foto bawaan gagal dipulihkan");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Section title="Pembuka">
      <div className="flex flex-col gap-3">
        <p className="text-sm">Foto hero</p>
        <img src={values.heroImage || "/hero-warung.png"} alt="Pratinjau foto hero" className="h-44 w-full max-w-sm rounded-2xl object-cover" />
        <div className="flex flex-wrap items-center gap-3">
          <label className="cursor-pointer rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-deep">
            {uploading ? "Memproses..." : "Ganti foto"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={uploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) void uploadHero(file);
              }}
            />
          </label>
          {values.heroImage && values.heroImage !== "/hero-warung.png" ? (
            <button type="button" onClick={() => void resetHero()} disabled={uploading} className="text-sm text-brand disabled:opacity-40">
              Gunakan foto bawaan
            </button>
          ) : null}
        </div>
        <p className="text-xs text-muted">JPEG, PNG, atau WebP, maksimal 5 MB. Foto langsung tampil di beranda.</p>
      </div>
      <TextField name="heroHeadline" label="Judul utama" multiline className={inputClass} />
      <TextField name="heroLead" label="Pengantar" multiline className={inputClass} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="primaryCta" label="Tombol utama" className={inputClass} />
        <TextField name="secondaryCta" label="Tombol kedua" className={inputClass} />
      </div>
    </Section>
  );
}

function BlockEditor({ name }: { name: "highlights" | "steps" | "strengths" }) {
  const { values } = useFormikContext<CompanyProfileContent>();
  const items = values[name];

  return (
    <FieldArray name={name}>
      {({ push, remove }) => (
        <div className="flex flex-col gap-4">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col gap-3 border-t border-line pt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Entri {index + 1}</p>
                <RowActions canRemove={items.length > 1} onRemove={() => remove(index)} />
              </div>
              <TextField name={`${name}.${index}.title`} label="Judul" className={inputClass} />
              <TextField name={`${name}.${index}.body`} label="Deskripsi" multiline className={inputClass} />
            </div>
          ))}
          <button
            type="button"
            disabled={items.length >= 6}
            onClick={() => push({ title: "", body: "" } satisfies TextBlock)}
            className="self-start text-sm font-medium disabled:opacity-40"
          >
            Tambah entri
          </button>
        </div>
      )}
    </FieldArray>
  );
}

function StatEditor() {
  const { values } = useFormikContext<CompanyProfileContent>();

  return (
    <FieldArray name="stats">
      {({ push, remove }) => (
        <div className="flex flex-col gap-4">
          {values.stats.map((item, index) => (
            <div key={index} className="grid gap-3 border-t border-line pt-4 sm:grid-cols-[1fr_1.4fr_auto] sm:items-end">
              <TextField name={`stats.${index}.value`} label="Angka" className={inputClass} />
              <TextField name={`stats.${index}.label`} label="Keterangan" className={inputClass} />
              <RowActions canRemove={values.stats.length > 1} onRemove={() => remove(index)} />
            </div>
          ))}
          <button
            type="button"
            disabled={values.stats.length >= 6}
            onClick={() => push({ value: "", label: "" })}
            className="self-start text-sm font-medium disabled:opacity-40"
          >
            Tambah angka
          </button>
        </div>
      )}
    </FieldArray>
  );
}

function PartnerEditor() {
  const { values } = useFormikContext<CompanyProfileContent>();

  return (
    <FieldArray name="partners">
      {({ push, remove }) => (
        <div className="flex flex-col gap-6">
          {values.partners.map((group, groupIndex) => (
            <PartnerGroupEditor key={groupIndex} group={group} groupIndex={groupIndex} canRemove={values.partners.length > 1} onRemove={() => remove(groupIndex)} />
          ))}
          <button
            type="button"
            disabled={values.partners.length >= 4}
            onClick={() => push({ title: "", items: [{ name: "", detail: "" }] } satisfies PartnerGroup)}
            className="self-start text-sm font-medium disabled:opacity-40"
          >
            Tambah kelompok
          </button>
        </div>
      )}
    </FieldArray>
  );
}

function PartnerGroupEditor({
  group,
  groupIndex,
  canRemove,
  onRemove,
}: {
  group: PartnerGroup;
  groupIndex: number;
  canRemove: boolean;
  onRemove: () => void;
}) {
  return (
    <FieldArray name={`partners.${groupIndex}.items`}>
      {({ push, remove }) => (
        <div className="flex flex-col gap-3 border-t border-line pt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Kelompok {groupIndex + 1}</p>
            <RowActions canRemove={canRemove} onRemove={onRemove} />
          </div>
          <TextField name={`partners.${groupIndex}.title`} label="Judul kelompok" className={inputClass} />
          {group.items.map((item, itemIndex) => (
            <div key={itemIndex} className="grid gap-3 sm:grid-cols-[1fr_1.4fr_auto] sm:items-end">
              <TextField name={`partners.${groupIndex}.items.${itemIndex}.name`} label="Nama" className={inputClass} />
              <TextField name={`partners.${groupIndex}.items.${itemIndex}.detail`} label="Keterangan" className={inputClass} />
              <RowActions canRemove={group.items.length > 1} onRemove={() => remove(itemIndex)} />
            </div>
          ))}
          <button
            type="button"
            disabled={group.items.length >= 8}
            onClick={() => push({ name: "", detail: "" })}
            className="self-start text-sm font-medium disabled:opacity-40"
          >
            Tambah mitra
          </button>
        </div>
      )}
    </FieldArray>
  );
}
