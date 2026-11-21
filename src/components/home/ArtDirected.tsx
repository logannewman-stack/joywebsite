import { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import { site, type PhotoSlot } from "@/content/site";

/** Black-and-white twin when the site is set to "bw", as Photo does. */
function source(slot: PhotoSlot) {
  return slot.src && site.photoStyle === "bw" && slot.srcBw ? slot.srcBw : slot.src;
}

const breakpoints = {
  md: { media: "(min-width: 768px)", position: "object-[var(--focus-tall)] md:object-[var(--focus-wide)]" },
  lg: { media: "(min-width: 1024px)", position: "object-[var(--focus-tall)] lg:object-[var(--focus-wide)]" },
};

/**
 * One photograph, two crops: a wide frame from `at` up and a taller crop
 * below it, served as a single <picture> so each screen downloads only the
 * file it shows. Fills its positioned parent (object-cover).
 */
export function ArtDirected({
  wide,
  tall,
  at = "md",
  sizesWide,
  sizesTall = "100vw",
  eager = false,
  className = "",
}: {
  wide: PhotoSlot;
  tall: PhotoSlot;
  at?: keyof typeof breakpoints;
  sizesWide: string;
  sizesTall?: string;
  /** Above-the-fold photo: load immediately at high priority. */
  eager?: boolean;
  className?: string;
}) {
  const wideSrc = source(wide);
  const tallSrc = source(tall) ?? wideSrc;
  if (!wideSrc || !tallSrc) return null;
  const bp = breakpoints[at];
  const loading = eager ? { loading: "eager" as const, fetchPriority: "high" as const } : {};
  const { props: wideProps } = getImageProps({ src: wideSrc, alt: wide.alt, fill: true, sizes: sizesWide });
  const { props: img } = getImageProps({ src: tallSrc, alt: wide.alt, fill: true, sizes: sizesTall, ...loading });
  const focus = {
    "--focus-wide": wide.focus ?? "50% 35%",
    "--focus-tall": tall.focus ?? wide.focus ?? "50% 35%",
  } as CSSProperties;
  return (
    <picture>
      <source media={bp.media} srcSet={wideProps.srcSet} sizes={wideProps.sizes} />
      <img {...img} alt={wide.alt} className={`object-cover ${bp.position} ${className}`} style={{ ...img.style, ...focus }} />
    </picture>
  );
}
