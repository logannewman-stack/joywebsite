"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

const base =
  "w-full rounded-none border-0 border-b border-ink/25 bg-transparent px-0 py-2.5 text-[16px] text-ink placeholder:text-ink/40 outline-none transition-colors focus:border-ink";

export function Field({
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
  placeholder,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="label !text-[10.5px] text-stone">
        {label}
        {required ? <span aria-hidden> *</span> : <span className="normal-case tracking-normal"> (optional)</span>}
      </span>
      <input name={name} type={type} required={required} autoComplete={autoComplete} placeholder={placeholder} className={base} />
    </label>
  );
}

export function TextArea({ label, name, required = false, rows = 4 }: { label: string; name: string; required?: boolean; rows?: number }) {
  return (
    <label className="block">
      <span className="label !text-[10.5px] text-stone">
        {label}
        {required ? <span aria-hidden> *</span> : <span className="normal-case tracking-normal"> (optional)</span>}
      </span>
      <textarea name={name} required={required} rows={rows} className={`${base} resize-y`} />
    </label>
  );
}

export function Select({ label, name, options, required = false }: { label: string; name: string; options: string[]; required?: boolean }) {
  return (
    <label className="block">
      <span className="label !text-[10.5px] text-stone">
        {label}
        {required ? <span aria-hidden> *</span> : <span className="normal-case tracking-normal"> (optional)</span>}
      </span>
      <span className="relative block">
        <select name={name} required={required} defaultValue="" className={`${base} cursor-pointer appearance-none pr-7`}>
          <option value="" disabled>
            Choose one
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-0 size-4 -translate-y-1/2" aria-hidden />
      </span>
    </label>
  );
}

export function CheckGroup({ legend, name, options }: { legend: string; name: string; options: string[] }) {
  return (
    <fieldset>
      <legend className="label mb-3 !text-[10.5px] text-stone">
        {legend} <span className="normal-case tracking-normal">(optional)</span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className="cursor-pointer">
            <input type="checkbox" name={name} value={o} className="peer sr-only" />
            <span className="inline-flex min-h-10 items-center rounded-full border border-ink/20 px-4 text-[14px] transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink hover:border-ink/50">
              {o}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Consent({ name, children }: { name: string; children: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-[13.5px] leading-relaxed text-stone">
      <input type="checkbox" name={name} className="mt-1 size-4 shrink-0 accent-ink" />
      <span>{children}</span>
    </label>
  );
}

/** Hidden field that only bots fill in. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Company website
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
