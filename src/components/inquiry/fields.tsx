"use client";

import type { ChangeEventHandler, InputHTMLAttributes, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export { Honeypot } from "./feedback";

/*
 * Form fields for the inquiry panel. Labels are sentence case at 14px so they
 * read easily on a phone; optional fields say so on the right, required ones
 * carry no mark. Each wrapper has data-field / data-label, which the email
 * fallback uses to label what the visitor typed.
 */

/* A soft filled field, not an underline: the site draws no lines. Focus rings it in ink. */
const control =
  "block w-full rounded-[0.5rem] border-0 bg-ink/[0.045] px-4 py-3 text-[1rem] leading-normal text-ink outline-none transition-[background-color,box-shadow] duration-[var(--duration-hover,180ms)] placeholder:text-stone hover:bg-ink/[0.065] focus:bg-ink/[0.06] focus:shadow-[inset_0_0_0_1.5px_var(--color-ink)]";

function FieldLabel({ label, required, hint }: { label: string; required?: boolean; hint?: string }) {
  const note = hint ?? (required ? null : "Optional");
  return (
    <span className="mb-1.5 flex items-baseline justify-between gap-4">
      <span className="text-[0.875rem] leading-snug font-medium text-ink">{label}</span>
      {note && <span className="shrink-0 text-right text-[0.8125rem] leading-snug text-stone">{note}</span>}
    </span>
  );
}

export function Field({
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
  placeholder,
  className = "",
  hint,
  defaultValue,
  inputProps,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
  /** Replaces the "Optional" note, e.g. "Required for text messages". */
  hint?: string;
  defaultValue?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <label className={`block ${className}`} data-field={name} data-label={label}>
      <FieldLabel label={label} required={required} hint={hint} />
      <input
        {...inputProps}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={control}
      />
    </label>
  );
}

export function TextArea({
  label,
  name,
  required = false,
  rows = 4,
  defaultValue,
}: {
  label: string;
  name: string;
  required?: boolean;
  rows?: number;
  defaultValue?: string;
}) {
  return (
    <label className="block" data-field={name} data-label={label}>
      <FieldLabel label={label} required={required} />
      <textarea
        name={name}
        required={required}
        rows={rows}
        defaultValue={defaultValue}
        className={`${control} min-h-28 resize-none [field-sizing:content]`}
      />
    </label>
  );
}

export type SelectOption = string | { group: string; options: string[] };

export function Select({
  label,
  name,
  options,
  required = false,
  defaultValue = "",
  hint,
}: {
  label: string;
  name: string;
  /** Plain values, or groups rendered as <optgroup>. */
  options: SelectOption[];
  required?: boolean;
  defaultValue?: string;
  hint?: string;
}) {
  return (
    <label className="block" data-field={name} data-label={label}>
      <FieldLabel label={label} required={required} hint={hint} />
      <span className="relative block">
        <select
          name={name}
          required={required}
          defaultValue={defaultValue}
          className={`${control} cursor-pointer appearance-none pr-10 has-[option[value='']:checked]:text-stone [&_option]:text-ink`}
        >
          <option value="" disabled>
            Choose one
          </option>
          {options.map((o) =>
            typeof o === "string" ? (
              <option key={o} value={o}>
                {o}
              </option>
            ) : (
              <optgroup key={o.group} label={o.group}>
                {o.options.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </optgroup>
            ),
          )}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink" aria-hidden />
      </span>
    </label>
  );
}

export function CheckGroup({
  legend,
  name,
  options,
  defaultValues = [],
}: {
  legend: string;
  name: string;
  options: string[];
  defaultValues?: string[];
}) {
  return (
    <fieldset data-field={name} data-label={legend}>
      <legend className="w-full">
        <FieldLabel label={legend} />
      </legend>
      <div className="mt-1 flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className="cursor-pointer">
            <input type="checkbox" name={name} value={o} defaultChecked={defaultValues.includes(o)} className="peer sr-only" />
            <span className="inline-flex min-h-11 items-center rounded-full border border-ink/25 px-4 text-[0.875rem] press select-none peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white forced-colors:peer-checked:border-[Highlight] forced-colors:peer-checked:bg-[Highlight] forced-colors:peer-checked:text-[HighlightText] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink hover:border-ink/60">
              {o}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Consent({
  name,
  label,
  children,
  onChange,
  defaultChecked,
}: {
  name: string;
  /** Short name for the email fallback, e.g. "Text messages". */
  label?: string;
  children: ReactNode;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-[0.90625rem] leading-relaxed text-ink/80" data-field={name} data-label={label ?? name}>
      <input type="checkbox" name={name} onChange={onChange} defaultChecked={defaultChecked} className="mt-[3px] size-[1.125rem] shrink-0 cursor-pointer accent-ink" />
      <span>
        {children} <span className="text-stone">(optional)</span>
      </span>
    </label>
  );
}
