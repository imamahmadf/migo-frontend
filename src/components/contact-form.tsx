"use client";

import { useState } from "react";
import { Form, Formik } from "formik";
import { apiFetch } from "@/components/auth-provider";
import { SelectField, TextField } from "@/components/form-field";
import { contactSchema, contactTopics } from "@/lib/validation";

const fieldClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#e30b29] focus:ring-2 focus:ring-[#e30b29]/15";

const labelClass = "text-slate-600";
const errorClass = "text-xs text-[#e30b29]";

const emptyContact = {
  name: "",
  phone: "",
  topic: "Menjadi Warung Mitra",
  message: "",
};

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-3xl bg-[#f4f6f8] px-6 py-10 text-slate-900 sm:px-8">
        <h3 className="text-xl font-semibold">Pesan terkirim</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">Tim kami akan membalas dalam satu hari kerja.</p>
        <button type="button" onClick={() => setSent(false)} className="mt-6 text-sm font-semibold text-[#e30b29]">
          Kirim pesan lain
        </button>
      </div>
    );
  }

  return (
    <Formik
      initialValues={emptyContact}
      validationSchema={contactSchema}
      onSubmit={async (values, helpers) => {
        helpers.setStatus(null);
        try {
          await apiFetch("/api/contact", {
            method: "POST",
            body: JSON.stringify(values),
          });
          helpers.resetForm();
          setSent(true);
        } catch (caught) {
          helpers.setStatus(caught instanceof Error ? caught.message : "Pesan gagal dikirim");
        }
      }}
    >
      {({ isSubmitting, status }) => (
        <Form noValidate className="rounded-3xl bg-[#f4f6f8] px-6 py-6 text-slate-900 sm:px-8 sm:py-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              name="name"
              label="Nama lengkap"
              autoComplete="name"
              className={fieldClass}
              labelClassName={labelClass}
              errorClassName={errorClass}
            />
            <TextField
              name="phone"
              label="No. WhatsApp"
              inputMode="tel"
              autoComplete="tel"
              className={fieldClass}
              labelClassName={labelClass}
              errorClassName={errorClass}
            />
          </div>
          <div className="mt-4">
            <SelectField name="topic" label="Keperluan" className={fieldClass} labelClassName={labelClass} errorClassName={errorClass}>
              {contactTopics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </SelectField>
          </div>
          <div className="mt-4">
            <TextField
              name="message"
              label="Pesan"
              multiline
              rows={4}
              className={fieldClass}
              labelClassName={labelClass}
              errorClassName={errorClass}
            />
          </div>
          {status ? (
            <p role="alert" className="mt-3 text-sm text-[#e30b29]">
              {status}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 rounded-lg bg-[#e30b29] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c10d22] disabled:opacity-60"
          >
            {isSubmitting ? "Mengirim..." : "Kirim pesan"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
