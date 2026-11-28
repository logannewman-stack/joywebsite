"use client";

import { useCallback } from "react";

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/**
 * Shows a field's validation message under the field, in the site's own type,
 * instead of the browser's pop-up bubble (which looks different in every
 * browser and like none of the site).
 *
 * The checks stay the browser's own: `required`, `type="email"`, and the
 * messages the forms set with setCustomValidity (feedback.tsx). Where the
 * message appears changes, and an empty required field gets the site's own
 * wording (messageFor) rather than the browser's, in the browser's language. Use the returned function as the form's `ref`;
 * a field shows its message in the [data-error] element inside its
 * [data-field] wrapper (FieldError in fields.tsx). A control without one
 * keeps the browser's bubble.
 *
 * After a failed check the first field with a message takes focus and is
 * scrolled into view with its message; each message goes as soon as its field
 * is edited or no longer applies. The field is marked aria-invalid and
 * described by its message.
 */
/**
 * The message for a field: the form's own wording where it set one, the site's
 * wording for an empty required field (from the field's label, "Enter your
 * first name."), and otherwise the browser's.
 */
function messageFor(el: Control) {
  if (!el.validity.valueMissing || el.validity.customError) return el.validationMessage;
  if (el instanceof HTMLInputElement && (el.type === "checkbox" || el.type === "radio")) return "Tick this box to continue.";
  const label = el.closest<HTMLElement>("[data-field]")?.dataset.label?.trim().replace(/[?:]$/, "");
  if (!label) return "Fill this in to continue.";
  return el instanceof HTMLSelectElement ? `Choose your ${label.toLowerCase()}.` : `Enter your ${label.toLowerCase()}.`;
}

export function useInlineValidation() {
  return useCallback((form: HTMLFormElement | null) => {
    if (!form) return;
    let batch: Control[] = [];
    const slot = (el: Control) => el.closest?.("[data-field]")?.querySelector<HTMLElement>("[data-error]") ?? null;
    const clear = (el: Control) => {
      const s = slot(el);
      if (!s || s.hidden) return;
      s.hidden = true;
      el.removeAttribute("aria-invalid");
      el.removeAttribute("aria-describedby");
    };
    // The messages are read after every `invalid` handler has run: the forms set their own wording in those handlers.
    const flush = () => {
      const list = batch;
      batch = [];
      for (const el of list) {
        const s = slot(el);
        if (!s) continue;
        const text = s.querySelector("[data-error-text]");
        if (text) text.textContent = messageFor(el);
        s.hidden = false;
        el.setAttribute("aria-invalid", "true");
        if (s.id) el.setAttribute("aria-describedby", s.id);
      }
      const first = list[0];
      if (first) {
        // Bring the field and its message into view only if they are not already there.
        first.focus({ preventScroll: true });
        (first.closest("[data-field]") ?? first).scrollIntoView({ block: "nearest" });
      }
    };
    const onInvalid = (e: Event) => {
      const el = e.target as Control;
      if (!slot(el)) return;
      e.preventDefault(); // no bubble
      if (!batch.length) setTimeout(flush, 0);
      batch.push(el);
    };
    // Editing a field removes its message. Editing another field can also settle one (un-ticking text
    // messages makes the phone number optional again), so every shown message is checked once the
    // form's own handlers have run.
    const settle = () => {
      form.querySelectorAll<Control>('[aria-invalid="true"]').forEach((el) => {
        if (el.validity.valid) clear(el);
      });
    };
    const onEdit = (e: Event) => {
      clear(e.target as Control);
      setTimeout(settle, 0);
    };
    form.addEventListener("invalid", onInvalid, true);
    form.addEventListener("input", onEdit);
    form.addEventListener("change", onEdit);
    return () => {
      form.removeEventListener("invalid", onInvalid, true);
      form.removeEventListener("input", onEdit);
      form.removeEventListener("change", onEdit);
    };
  }, []);
}
