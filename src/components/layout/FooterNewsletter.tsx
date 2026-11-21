"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * The footer's From Dr. Joy signup. Insights and its article pages have their
 * own signup, so the footer leaves it out there and its link columns take
 * the full width.
 */
export function FooterNewsletter({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/insights" || pathname.startsWith("/insights/")) return null;
  return <>{children}</>;
}
