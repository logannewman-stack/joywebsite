"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Play } from "lucide-react";

/**
 * Turns a YouTube or Vimeo link into an embed address that plays as soon as
 * it loads, with captions on and without tracking cookies where the host
 * allows it. Returns null for anything else.
 */
export function embedUrl(link: string): string | null {
  let u: URL;
  try {
    u = new URL(link);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^(www|m)\./, "");
  const youtube = (id: string | null | undefined) =>
    id && /^[\w-]{6,}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&cc_load_policy=1&playsinline=1` : null;
  if (host === "youtu.be") return youtube(u.pathname.slice(1));
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (u.pathname === "/watch") return youtube(u.searchParams.get("v"));
    return youtube(u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/)?.[1]);
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const m = u.pathname.match(/(?:^|\/)(\d+)(?:\/([\da-f]+))?/);
    if (!m) return null;
    const hash = m[2] ?? u.searchParams.get("h");
    return `https://player.vimeo.com/video/${m[1]}?autoplay=1&dnt=1&texttrack=en${hash ? `&h=${hash}` : ""}`;
  }
  return null;
}

/**
 * A video that costs nothing until it is played: a still (or a quiet dark
 * panel) with a play button, swapped for the player on click.
 */
export function VideoFacade({
  url,
  label,
  shape = "landscape",
  poster,
}: {
  url: string;
  /** What the video is, for the play button and the player's title. */
  label: string;
  shape?: "landscape" | "portrait";
  /** Optional still, rendered by the page (e.g. a Photo filling the frame). */
  poster?: ReactNode;
}) {
  const [playing, setPlaying] = useState(false);
  const player = useRef<HTMLIFrameElement>(null);
  const src = embedUrl(url);

  // Keep keyboard focus on the video once the button it replaced is gone.
  useEffect(() => {
    if (playing) player.current?.focus();
  }, [playing]);

  if (!src) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-ink px-6 py-3 text-[0.9375rem] font-medium whitespace-nowrap text-white transition-colors hover:bg-ink-soft focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink"
      >
        <Play className="size-4" aria-hidden />
        Play video
        <ArrowUpRight className="size-4" aria-hidden />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }

  const frame = shape === "portrait" ? "aspect-[9/16] w-full max-w-[18rem]" : "aspect-video w-full";
  return (
    <div className={`relative overflow-hidden bg-ink ${poster || playing ? "" : "grain grain-light"} ${frame}`}>
      {playing ? (
        <iframe
          ref={player}
          src={src}
          title={label}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${label}`}
          className="group absolute inset-0 flex size-full items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink"
        >
          {poster && <span className="absolute inset-0 opacity-75 transition-opacity duration-(--duration-ui) group-hover:opacity-60">{poster}</span>}
          <span className="relative flex flex-col items-center gap-4 text-white">
            <span className="inline-flex size-16 items-center justify-center rounded-full border border-white/50 transition-colors duration-(--duration-ui) group-hover:border-white group-hover:bg-white group-hover:text-ink">
              <Play className="ml-0.5 size-5" aria-hidden />
            </span>
            <span className="label text-white/80">Play video</span>
          </span>
        </button>
      )}
    </div>
  );
}
