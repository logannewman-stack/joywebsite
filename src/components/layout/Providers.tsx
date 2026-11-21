"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/**
 * Interactive motion (menu, inquiry panel) honors the visitor's reduced-motion
 * setting. LazyMotion supplies the animation features once for `m.*`
 * components, which are much smaller than `motion.*`. Once every component
 * uses `m.*` (Header, InquiryProvider, Pathways, Question), add `strict` here
 * so a stray `motion.*` is caught.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
