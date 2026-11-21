"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";

/**
 * YouTube or Vimeo watch/share URL -> privacy-friendly embed URL that starts
 * playing (the visitor has just pressed play). Captions are requested where
 * the player supports it. Returns null for anything else.
 */
export function reelEmbedUrl(url: string): string | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^(www|m)\./, "");
  let yt: string | null = null;
  if (host === "youtu.be") yt = u.pathname.split("/")[1] ?? null;
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    yt = u.pathname === "/watch" ? u.searchParams.get("v") : (u.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] ?? null);
  }
  if (yt && /^[\w-]{6,}$/.test(yt)) {
    return `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&playsinline=1&cc_load_policy=1`;
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const m = u.pathname.match(/(?:^|\/)(\d{6,})(?:\/([\da-f]+))?/);
    if (m) {
      const hash = m[2] ?? u.searchParams.get("h");
      return `https://player.vimeo.com/video/${m[1]}?autoplay=1&dnt=1&texttrack=en&title=0&byline=0&portrait=0${hash ? `&h=${hash}` : ""}`;
    }
  }
  return null;
}

const control =
  "group inline-flex min-h-12 items-center gap-4 rounded-full text-[0.9375rem] font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white";

function Disc() {
  return (
    <span className="inline-flex size-14 items-center justify-center rounded-full bg-white text-ink transition-transform duration-300 group-hover:scale-105 md:size-16">
      <Play className="ml-0.5 size-5 fill-current" aria-hidden />
    </span>
  );
}

/**
 * Speaker reel over a poster photograph. Nothing loads from YouTube or Vimeo
 * until the visitor presses play; then the player replaces the poster in place.
 * A link the player cannot embed opens in a new tab instead.
 */
export function SpeakerReel({ url, label, title }: { url: string; label: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const embed = reelEmbedUrl(url);

  useEffect(() => {
    if (playing) frame.current?.focus();
  }, [playing]);

  if (!embed) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={control}>
        <Disc />
        <span className="link-draw pb-0.5">{label}</span>
        <ArrowUpRight className="size-4" aria-hidden />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  if (playing) {
    return (
      <div className="absolute inset-0 z-10 bg-ink">
        <iframe
          ref={frame}
          src={embed}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      </div>
    );
  }

  return (
    <button type="button" onClick={() => setPlaying(true)} className={control}>
      <Disc />
      <span className="link-draw pb-0.5">{label}</span>
    </button>
  );
}
