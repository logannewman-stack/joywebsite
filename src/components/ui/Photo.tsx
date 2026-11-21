import Image from "next/image";
import { site, type PhotoSlot } from "@/content/site";

const treatmentLabel: Record<PhotoSlot["treatment"], string> = {
  bw: "B&W portrait",
  color: "Color photograph",
  cutout: "Background-removed cutout",
};

/**
 * A photograph slot. Renders the supplied image, or (until it arrives) an
 * art-direction placeholder that tells the photo editor what belongs here.
 */
export function Photo({
  slot,
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  tone = "light",
  showDirection = true,
}: {
  slot: PhotoSlot;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Background the slot sits on, so the placeholder contrasts correctly. */
  tone?: "light" | "dark";
  showDirection?: boolean;
}) {
  if (slot.src) {
    return (
      <div className={`relative overflow-hidden bg-sand ${className}`}>
        <Image
          src={slot.src}
          alt={slot.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={{ objectPosition: slot.focus ?? "50% 35%" }}
        />
        {slot.stock && site.showPlaceholders && (
          <span className="label absolute top-3 left-3 bg-paper/90 px-2 py-1 !text-[9.5px] !tracking-[0.14em] text-ink">
            Stock placeholder
          </span>
        )}
      </div>
    );
  }

  const isCutout = slot.treatment === "cutout";
  const bg = isCutout
    ? "bg-transparent"
    : slot.treatment === "color"
      ? "bg-[radial-gradient(120%_90%_at_70%_20%,#efe3d6_0%,#ddd0c0_45%,#c9b9a6_100%)]"
      : tone === "dark"
        ? "bg-[radial-gradient(110%_90%_at_60%_15%,#3a3a3a_0%,#232323_50%,#161616_100%)]"
        : "bg-[radial-gradient(110%_90%_at_60%_15%,#e9e9e7_0%,#d4d4d1_50%,#bdbdb9_100%)]";
  // Cutout captions sit on their own light chip; others read against the tone.
  const fg = tone === "dark" ? "text-white/75" : "text-ink/70";
  const silhouette = isCutout ? (tone === "dark" ? "#f2f2f0" : "#1a1a1a") : tone === "dark" ? "#ffffff" : "#000000";

  return (
    <div className={`${isCutout ? "" : "grain"} relative overflow-hidden ${bg} ${className}`} role="img" aria-label={`${slot.alt} (photo to come)`}>
      <svg
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMax meet"
        className="absolute inset-x-0 bottom-0 h-[86%] w-full"
        aria-hidden
      >
        <g fill={silhouette} opacity={isCutout ? 0.92 : 0.07}>
          <ellipse cx="200" cy="165" rx="66" ry="80" />
          <path d="M30 500 C 34 360, 100 282, 200 282 C 300 282, 366 360, 370 500 Z" />
        </g>
      </svg>
      {site.showPlaceholders && showDirection && (
        <div className={`absolute inset-x-0 bottom-0 p-4 md:p-5 ${isCutout ? "" : fg}`}>
          <div className={isCutout ? "max-w-[36ch] bg-paper/95 px-3.5 py-3 text-ink" : ""}>
            <p className="label !text-[9.5px]">Photo to come · {treatmentLabel[slot.treatment]}</p>
            <p className="mt-1.5 max-w-[34ch] font-serif text-[15px] leading-snug italic">{slot.direction}</p>
          </div>
        </div>
      )}
    </div>
  );
}
