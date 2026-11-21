/**
 * Small helpers shared by the header menu and the inquiry panel: scroll lock,
 * an inert background, a Tab trap and focus return. Plain DOM, no library.
 * Locks and inert marks are counted, so the menu and the panel can overlap
 * (opening the panel from the menu) without undoing each other.
 */

let scrollLocks = 0;
let savedPadding = "";

/** Stops the page behind an overlay from scrolling. Returns the release function. */
export function lockScroll(): () => void {
  const root = document.documentElement;
  if (scrollLocks++ === 0) {
    const before = root.clientWidth;
    savedPadding = root.style.paddingRight;
    root.style.overflow = "hidden";
    // Classic (Windows) scrollbars: keep the layout from shifting sideways.
    // With `scrollbar-gutter: stable` the width does not change and nothing is added.
    const shift = root.clientWidth - before;
    if (shift > 0) {
      root.style.paddingRight = `${shift}px`;
      root.style.setProperty("--scroll-lock-gap", `${shift}px`);
    }
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--scrollLocks === 0) {
      root.style.overflow = "";
      root.style.paddingRight = savedPadding;
      root.style.removeProperty("--scroll-lock-gap");
    }
  };
}

const held = new WeakMap<HTMLElement, number>();
const SKIP = /^(SCRIPT|STYLE|LINK|TEMPLATE|NOSCRIPT|NEXT-ROUTE-ANNOUNCER)$/;

/**
 * Makes everything outside `keep` inert (unreachable by Tab, clicks and
 * screen readers) by marking the siblings along each kept element's path to
 * <body>. Returns the function that undoes it.
 */
export function inertOutside(keep: (Element | null | undefined)[]): () => void {
  const keepers = keep.filter((k): k is Element => !!k);
  const onPath = new Set<Element>();
  for (const k of keepers) for (let n: Element | null = k; n && n !== document.body; n = n.parentElement) onPath.add(n);
  const changed: HTMLElement[] = [];
  const walk = (parent: Element) => {
    for (const child of Array.from(parent.children)) {
      if (!(child instanceof HTMLElement) || keepers.includes(child) || SKIP.test(child.tagName)) continue;
      if (onPath.has(child)) {
        walk(child);
        continue;
      }
      const count = held.get(child);
      if (count === undefined && child.inert) continue; // inert for some other reason: leave it alone
      held.set(child, (count ?? 0) + 1);
      child.inert = true;
      changed.push(child);
    }
  };
  walk(document.body);
  let done = false;
  return () => {
    if (done) return;
    done = true;
    for (const el of changed) {
      const count = (held.get(el) ?? 1) - 1;
      if (count > 0) held.set(el, count);
      else {
        held.delete(el);
        el.inert = false;
      }
    }
  };
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

/** Tabbable, visible elements inside the given containers, in document order. */
export function tabbables(...roots: (Element | null | undefined)[]): HTMLElement[] {
  const out: HTMLElement[] = [];
  for (const root of roots) {
    if (!root) continue;
    for (const el of Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE))) {
      if (el.tabIndex < 0 || el.closest("[inert]")) continue;
      if (!el.getClientRects().length || getComputedStyle(el).visibility === "hidden") continue;
      out.push(el);
    }
  }
  return out;
}

/** Keeps Tab and Shift+Tab cycling inside the given containers. Call from a keydown listener. */
export function trapTab(e: KeyboardEvent, roots: (Element | null | undefined)[]) {
  if (e.key !== "Tab") return;
  const list = tabbables(...roots);
  if (!list.length) {
    e.preventDefault();
    return;
  }
  const first = list[0];
  const last = list[list.length - 1];
  const active = document.activeElement;
  const inside = roots.some((r) => r && active && r.contains(active));
  if (!inside) {
    e.preventDefault();
    (e.shiftKey ? last : first).focus();
  } else if (e.shiftKey && active === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  }
}

/** Focuses the first candidate that can actually take focus (connected, visible, not inert). */
export function focusFirst(...candidates: (HTMLElement | null | undefined)[]) {
  for (const el of candidates) {
    if (!el || !el.isConnected) continue;
    el.focus({ preventScroll: true });
    if (document.activeElement === el) return true;
  }
  return false;
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
