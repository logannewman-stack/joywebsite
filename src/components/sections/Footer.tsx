import { site } from "@/content/site";
import { Rich } from "../Rich";
import { Dot, Logo } from "../ui";
import { Newsletter, Year } from "../FooterClient";

const brandIcons: Record<string, React.ReactNode> = {
  instagram: (
    <path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM21.9 8c-.1-1.6-.4-3-1.6-4.2C19 2.6 17.6 2.2 16 2.1 14.4 2 9.6 2 8 2.1c-1.6.1-3 .4-4.2 1.6C2.6 5 2.2 6.4 2.1 8 2 9.6 2 14.4 2.1 16c.1 1.6.4 3 1.6 4.2 1.2 1.2 2.6 1.5 4.2 1.6 1.6.1 6.4.1 8 0 1.6-.1 3-.4 4.2-1.6 1.2-1.2 1.5-2.6 1.6-4.2.1-1.6.1-6.4.2-8Zm-2.1 9.7a3.2 3.2 0 0 1-1.8 1.8c-1.3.5-4.3.4-5.7.4s-4.4.1-5.7-.4a3.2 3.2 0 0 1-1.8-1.8c-.5-1.3-.4-4.3-.4-5.7s-.1-4.4.4-5.7A3.2 3.2 0 0 1 6.6 4.5c1.3-.5 4.3-.4 5.7-.4s4.4-.1 5.7.4a3.2 3.2 0 0 1 1.8 1.8c.5 1.3.4 4.3.4 5.7s.1 4.4-.4 5.7Z" />
  ),
  linkedin: (
    <path d="M6.9 21H2.8V8.9h4.1V21ZM4.8 7.2a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8ZM21.2 21h-4.1v-5.9c0-1.4 0-3.2-2-3.2s-2.2 1.5-2.2 3.1v6H8.8V8.9h3.9v1.7h.1a4.3 4.3 0 0 1 3.9-2.1c4.1 0 4.9 2.7 4.9 6.3V21Z" />
  ),
  youtube: (
    <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.7 15V9l5.9 3-5.9 3Z" />
  ),
};

export function Footer() {
  const { footer } = site;
  const wordmark = (site.name.last ? `${site.name.first} ${site.name.last}` : site.name.first).toLowerCase();
  return (
    <footer className="bg-paper p-2 pt-0 md:p-4 md:pt-0">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-ink px-5 pt-16 pb-8 text-white md:rounded-[44px] md:px-14 md:pt-20">
        <div className="glow -bottom-64 left-1/2 -z-10 size-[900px] -translate-x-1/2 opacity-40" />

        <div className="grid gap-14 lg:grid-cols-[1.1fr_1.4fr]">
          <div>
            <Logo size="lg" />
            <p className="mt-6 max-w-xs font-display text-2xl leading-[1.15] font-semibold">
              <Rich text={footer.tagline} accentClass="font-serif italic font-normal text-violet-soft text-[1.12em]" />
            </p>
            <div className="mt-8 flex gap-2.5">
              {footer.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-all hover:border-violet hover:bg-violet hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                    {brandIcons[s.icon]}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-12 sm:grid-cols-[1.3fr_1fr_1fr]">
            <div>
              <p className="eyebrow text-mute">{footer.newsletter.heading}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-porcelain/70">{footer.newsletter.sub}</p>
              <Newsletter />
            </div>
            {footer.columns.map((col) => (
              <div key={col.title}>
                <p className="eyebrow text-mute">{col.title}</p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="text-[15px] text-white/85 transition-colors hover:text-violet-soft">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* giant wordmark */}
        <p
          aria-hidden
          className="mt-16 font-display text-[clamp(7rem,34vw,32rem)] leading-[0.8] font-bold tracking-[-0.05em] whitespace-nowrap text-white select-none md:mt-20"
        >
          {wordmark}
          <Dot />
        </p>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="eyebrow !text-[10px] text-mute">
            © <Year /> {[site.name.first, site.name.last].filter(Boolean).join(" ")}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="eyebrow !text-[10px] text-mute hover:text-white">
              Privacy
            </a>
            <a href="#" className="eyebrow !text-[10px] text-mute hover:text-white">
              Terms
            </a>
            <a href="#top" className="eyebrow !text-[10px] text-white hover:text-violet-soft">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
