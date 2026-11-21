"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Interactive motion (menu, inquiry panel) honors the visitor's reduced-motion setting. */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
