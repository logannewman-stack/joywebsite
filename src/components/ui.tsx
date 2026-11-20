import Image from "next/image";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Play,
  Shield,
  Sparkles,
  Users,
  Zap,
  Mic,
  Presentation,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";
import { site } from "@/content/site";

/* ---------------------------------------------------------------- Icons */

const icons: Record<string, LucideIcon> = {
  compass: Compass,
  zap: Zap,
  users: Users,
  sparkles: Sparkles,
  shield: Shield,
  mic: Mic,
  presentation: Presentation,
  messages: MessagesSquare,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = icons[name] ?? Sparkles;
  return <Cmp className={className} strokeWidth={1.6} aria-hidden />;
}

export function IconTile({ name }: { name: string }) {
  return (
    <span className="inline-flex size-11 items-center justify-center rounded-lg border border-white/10 bg-violet/15 text-violet-soft">
      <Icon name={name} className="size-5" />
    </span>
  );
}

/* -------------------------------------------------------------- Buttons */

type BtnProps = {
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

function BtnShell({ href, children, className = "", onClick, type = "button" }: BtnProps) {
  if (href) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
}

/** Solid violet call to action with a circular arrow, like a pill. */
export function ButtonPrimary({ arrow = true, className = "", ...props }: BtnProps & { arrow?: boolean }) {
  return (
    <BtnShell
      {...props}
      className={`group inline-flex items-center gap-3 rounded-full bg-violet py-2 pr-2 pl-6 text-[15px] font-semibold text-white shadow-[0_10px_40px_-10px_rgba(124,58,237,0.8)] transition-all duration-300 hover:bg-violet-hi hover:shadow-[0_14px_50px_-8px_rgba(155,109,255,0.9)] ${arrow ? "" : "pr-6"} ${className}`}
    >
      <span>{props.children}</span>
      {arrow && (
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-white text-violet transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-rotate-45">
          <ArrowRight className="size-4" strokeWidth={2.2} />
        </span>
      )}
    </BtnShell>
  );
}

/** Outline button with a play icon, used for video reels. */
export function ButtonPlay({ className = "", ...props }: BtnProps) {
  return (
    <BtnShell
      {...props}
      className={`group inline-flex items-center gap-3 rounded-full border border-white/25 py-2 pr-6 pl-2 text-[15px] font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-violet-hi hover:bg-white/5 ${className}`}
    >
      <span className="relative inline-flex size-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors group-hover:bg-violet">
        <span className="absolute inset-0 animate-ping rounded-full bg-violet/40 [animation-duration:2.4s]" />
        <Play className="relative size-3.5 fill-current" strokeWidth={0} />
      </span>
      <span>{props.children}</span>
    </BtnShell>
  );
}

/** Underlined text link with arrow. */
export function TextLink({ href, children, dark = false }: { href: string; children: ReactNode; dark?: boolean }) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-1.5 border-b pb-0.5 text-[13px] font-semibold tracking-wide uppercase transition-colors ${
        dark ? "border-ink/30 text-ink hover:border-violet hover:text-violet" : "border-white/30 text-white hover:border-violet-hi hover:text-violet-soft"
      }`}
    >
      {children}
      <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}

/* -------------------------------------------------------------- Labels */

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`eyebrow flex items-center gap-2 ${light ? "text-mute-dark" : "text-mute"}`}>
      <span className="inline-block size-1.5 bg-violet-hi" />
      {children}
    </p>
  );
}

/* --------------------------------------------------------------- Logo */

/** A round violet full stop, the brand's signature mark. Sized relative to the text. */
export function Dot() {
  return <span className="ml-[0.06em] inline-block size-[0.2em] rounded-full bg-violet-hi align-baseline" aria-hidden />;
}

export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const { first, last } = site.name;
  const text = size === "lg" ? "text-[34px]" : "text-[28px]";
  if (last) {
    return (
      <span className={`font-display font-bold leading-[0.95] ${size === "lg" ? "text-[26px]" : "text-[21px]"}`}>
        <span className="block text-white">{first}</span>
        <span className="block text-violet-hi">{last}</span>
      </span>
    );
  }
  return (
    <span className={`font-display leading-none font-bold tracking-tight text-white ${text}`}>
      {first.toLowerCase()}
      <Dot />
    </span>
  );
}

/* ------------------------------------------------------------ Portrait */

/**
 * Shows a real photo when `src` is set. Otherwise renders an on-brand
 * placeholder so the layout reads correctly before photos arrive.
 */
export function Portrait({
  src,
  alt,
  label = "Portrait",
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}: {
  src: string | null;
  alt: string;
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />
      </div>
    );
  }
  return (
    <div
      className={`relative overflow-hidden bg-[radial-gradient(120%_80%_at_50%_0%,#3b1d7a_0%,#1a1424_45%,#121216_100%)] ${className}`}
      role="img"
      aria-label={`${alt} (placeholder)`}
    >
      {/* soft silhouette */}
      <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMax meet" className="absolute inset-x-0 bottom-0 h-[88%] w-full" aria-hidden>
        <defs>
          <linearGradient id="sil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bda5ff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#bda5ff" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="170" r="78" fill="url(#sil)" />
        <path d="M40 500 C 40 360, 110 290, 200 290 C 290 290, 360 360, 360 500 Z" fill="url(#sil)" />
      </svg>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <span className="eyebrow absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 whitespace-nowrap text-white/70 backdrop-blur">
        {label} · photo coming soon
      </span>
    </div>
  );
}

/* --------------------------------------------------------- Quote mark */

export function QuoteMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 48" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M0 48V28.8C0 12.9 8.6 3.3 25.8 0l3 6.6C20 9.3 15.4 14.3 14.9 21.6H27V48H0Zm37 0V28.8C37 12.9 45.6 3.3 62.8 0l3 6.6C57 9.3 52.4 14.3 51.9 21.6H64V48H37Z"
      />
    </svg>
  );
}
