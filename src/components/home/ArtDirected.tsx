import { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import { site, type PhotoSlot } from "@/content/site";

/** Black-and-white twin when the site is set to "bw", as Photo does. */
function source(slot: PhotoSlot) {
  return slot.src && site.photoStyle === "bw" && slot.srcBw ? slot.srcBw : slot.src;
}

/**
 * One photograph, two crops: the wide frame on landscape screens and a taller
 * crop on upright ones (phones, a tablet held upright), served as a single
 * <picture> so each screen downloads only the file it shows. It fills its
 * positioned parent (object-cover). Served at quality 90, like Photo.
 */
export function ArtDirected({
  wide,
  tall,
  sizesWide,
  sizesTall = "100vw",
  eager = false,
  className = "",
}: {
  wide: PhotoSlot;
  tall: PhotoSlot;
  sizesWide: string;
  sizesTall?: string;
  /** Above-the-fold photo: load immediately at high priority. */
  eager?: boolean;
  className?: string;
}) {
  const wideSrc = source(wide);
  const tallSrc = source(tall) ?? wideSrc;
  if (!wideSrc || !tallSrc) return null;
  const loading = eager ? { loading: "eager" as const, fetchPriority: "high" as const } : {};
  const { props: wideProps } = getImageProps({ src: wideSrc, alt: wide.alt, fill: true, sizes: sizesWide, quality: 90 });
  const { props: img } = getImageProps({ src: tallSrc, alt: wide.alt, fill: true, sizes: sizesTall, quality: 90, ...loading });
  const focus = {
    "--focus-wide": wide.focus ?? "50% 35%",
    "--focus-tall": tall.focus ?? wide.focus ?? "50% 35%",
  } as CSSProperties;
  return (
    <picture>
      <source media="(orientation: landscape)" srcSet={wideProps.srcSet} sizes={wideProps.sizes} />
      <img
        {...img}
        alt={wide.alt}
        className={`object-cover object-[var(--focus-tall)] landscape:object-[var(--focus-wide)] ${className}`}
        style={{ ...img.style, ...focus }}
      />
    </picture>
  );
}
