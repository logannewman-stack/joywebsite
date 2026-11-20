"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { site } from "@/content/site";
import { Rich } from "../Rich";
import { Reveal } from "../Reveal";
import { Eyebrow } from "../ui";

const field =
  "w-full rounded-xl border border-transparent bg-[#ebebe8] px-4 py-3.5 text-[15px] text-ink placeholder:text-ink/40 outline-none transition focus:border-violet focus:bg-white focus:ring-4 focus:ring-violet/15";

export function Contact() {
  const { contact } = site;
  const [picked, setPicked] = useState<string[]>([contact.interests[0]]);
  const [sent, setSent] = useState(false);

  const toggle = (v: string) => setPicked((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  // No backend yet: hand the message to the visitor's email app.
  // Swap this for a form service (Formspree, Resend, etc.) when ready.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = `New inquiry: ${picked.join(", ") || "General"}`;
    const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nInterested in: ${picked.join(", ")}\n\n${data.get("message")}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section id="contact" className="scroll-mt-20 bg-paper p-2 md:p-4">
      <div className="relative isolate overflow-hidden rounded-[28px] bg-ink px-5 py-20 md:rounded-[44px] md:px-14 md:py-28">
        <div className="glow -right-40 -bottom-40 -z-10 size-[760px] opacity-70" />
        <div className="glow -top-60 -left-40 -z-10 size-[560px] opacity-30" />

        <div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[1fr_1.02fr] lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow>{contact.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display text-[clamp(2.5rem,5.2vw,4.6rem)] leading-[0.98] font-bold tracking-[-0.02em] text-white">
                <Rich text={contact.heading} accentClass="font-serif italic font-normal text-violet-soft text-[1.12em]" />
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-porcelain/70">{contact.sub}</p>
            </Reveal>

            <Reveal delay={0.15}>
              <ul className="mt-12 border-b border-white/10">
                {contact.options.map((o) => (
                  <li key={o.title}>
                    <a href={`mailto:${site.email}?subject=${encodeURIComponent(o.title)}`} className="group flex items-center justify-between gap-6 border-t border-white/10 py-5">
                      <span>
                        <span className="block text-lg font-semibold text-white">{o.title}</span>
                        <span className="eyebrow mt-1 block !text-[10px] text-mute">{o.sub}</span>
                      </span>
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-all group-hover:border-violet group-hover:bg-violet">
                        <ArrowRight className="size-4" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[15px] text-mute">
                Prefer email?{" "}
                <a href={`mailto:${site.email}`} className="font-semibold text-white underline decoration-violet-hi underline-offset-4 hover:text-violet-soft">
                  {site.email}
                </a>
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} y={40}>
            <form
              onSubmit={onSubmit}
              className="relative rounded-[24px] bg-white p-6 text-ink shadow-[0_40px_120px_-30px_rgba(124,58,237,0.65)] md:p-9"
            >
              <p className="font-display text-[26px] leading-[1.1] font-semibold">{contact.formHeading}</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="eyebrow mb-2 block !text-[10px] text-mute-dark">Name</span>
                  <input required name="name" autoComplete="name" className={field} placeholder="Your name" />
                </label>
                <label className="block">
                  <span className="eyebrow mb-2 block !text-[10px] text-mute-dark">Email</span>
                  <input required type="email" name="email" autoComplete="email" className={field} placeholder="you@email.com" />
                </label>
              </div>

              <fieldset className="mt-6">
                <legend className="eyebrow mb-3 block !text-[10px] text-mute-dark">I&apos;m interested in</legend>
                <div className="flex flex-wrap gap-2">
                  {contact.interests.map((v) => {
                    const on = picked.includes(v);
                    return (
                      <button
                        key={v}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(v)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all ${
                          on ? "border-ink bg-ink text-white" : "border-ink/15 text-ink/80 hover:border-ink/40"
                        }`}
                      >
                        {on && <Check className="size-3.5" strokeWidth={2.6} />}
                        {v}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <label className="mt-6 block">
                <span className="eyebrow mb-2 block !text-[10px] text-mute-dark">What do you want to talk about?</span>
                <textarea name="message" rows={4} className={`${field} resize-y`} placeholder="A little about where you are and where you want to be…" />
              </label>

              <button
                type="submit"
                className="group mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-violet py-3 text-[15px] font-semibold text-white transition-colors hover:bg-violet-hi"
              >
                {sent ? "Opening your email app…" : "Send it"}
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-white text-violet transition-transform group-hover:-rotate-45">
                  <ArrowRight className="size-3.5" strokeWidth={2.4} />
                </span>
              </button>
              <p className="eyebrow mt-5 text-center !text-[10px] text-mute-dark">You don&apos;t have to figure this out alone.</p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
