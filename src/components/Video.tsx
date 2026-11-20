"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { site } from "@/content/site";
import { ButtonPlay } from "./ui";

const VideoCtx = createContext<() => void>(() => {});

function toEmbed(url: string): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1`;
  return url;
}

export function VideoProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const show = useCallback(() => setOpen(true), []);
  const embed = toEmbed(site.videoUrl);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <VideoCtx.Provider value={show}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Video"
          >
            <motion.div
              className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-coal shadow-2xl"
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {embed ? (
                <iframe
                  src={embed}
                  title="Video"
                  className="absolute inset-0 size-full"
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-3 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(124,58,237,0.35),transparent)] text-center">
                  <p className="font-display text-3xl font-bold text-white">The reel is on its way.</p>
                  <p className="max-w-sm text-mute">Add a YouTube or Vimeo link to <code className="text-violet-soft">videoUrl</code> in the content file and it plays right here.</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 inline-flex size-10 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-violet"
                aria-label="Close video"
              >
                <X className="size-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </VideoCtx.Provider>
  );
}

export function WatchButton({ children, className }: { children: ReactNode; className?: string }) {
  const show = useContext(VideoCtx);
  return (
    <ButtonPlay onClick={show} className={className}>
      {children}
    </ButtonPlay>
  );
}
