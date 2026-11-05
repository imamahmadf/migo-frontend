"use client";

import { useField } from "formik";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

type Shared = {
  name: string;
  label: ReactNode;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
};

export function TextField({
  name,
  label,
  className,
  labelClassName = "",
  errorClassName = "text-xs text-danger",
  multiline = false,
  rows = 3,
  ...props
}: Shared & { multiline?: boolean; rows?: number } & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "className"> &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name" | "className" | "rows">) {
  const [field, meta] = useField(name);
  const invalid = Boolean(meta.touched && meta.error);

  return (
    <label className={`flex flex-col gap-2 text-sm ${labelClassName}`}>
      {label}
      {multiline ? (
        <textarea {...field} rows={rows} className={className} />
      ) : (
        <input {...field} {...props} className={className} />
      )}
      {invalid ? <span className={errorClassName}>{meta.error}</span> : null}
    </label>
  );
}

export function SelectField({
  name,
  label,
  className,
  labelClassName = "",
  errorClassName = "text-xs text-danger",
  children,
  ...props
}: Shared & Omit<SelectHTMLAttributes<HTMLSelectElement>, "name" | "className">) {
  const [field, meta] = useField(name);
  const invalid = Boolean(meta.touched && meta.error);

  return (
    <label className={`flex flex-col gap-2 text-sm ${labelClassName}`}>
      {label}
      <select {...field} {...props} className={className}>
        {children}
      </select>
      {invalid ? <span className={errorClassName}>{meta.error}</span> : null}
    </label>
  );
}
