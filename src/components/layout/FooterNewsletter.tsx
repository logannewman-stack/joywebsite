"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * The footer's From Dr. Joy signup. Insights has its own signup section, so
 * the footer leaves it out there and its link columns take the full width.
 */
export function FooterNewsletter({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/insights") return null;
  return <>{children}</>;
}
