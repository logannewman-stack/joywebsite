"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Current year, read on the client so a static page never goes stale. */
export function Year() {
  return <>{useSyncExternalStore(noop, () => String(new Date().getFullYear()), () => "2026")}</>;
}
