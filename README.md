# Joy: personal brand website

A one-page personal brand site for a speaker and coach, built with Next.js 16, Tailwind CSS 4 and Motion.

The design is dark and editorial, with violet as the brand accent. It uses scroll-driven storytelling, arch-framed portraits, mono section labels and serif-italic accent words.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000.

## Edit the content

All copy, links, stats and photo paths are in **`src/content/site.ts`**. You shouldn't need to touch the components to change words.

Inline formatting works in any string:

| Write | Renders as |
| --- | --- |
| `**words**` | violet highlight |
| `_words_` | serif italic accent |

### Placeholder checklist before launch

- [ ] `name.last`: add a last name and the logo switches to a two-line lockup
- [ ] `email`: the contact form and links send here
- [ ] `videoUrl`: a YouTube or Vimeo link powers every "Watch" button
- [ ] `hero.image`, `about.image`: Joy's portraits (see Photos below)
- [ ] Testimonials: real quotes, names and roles
- [ ] `trustedBy.logos`: replace the placeholder wordmarks with real client logos
- [ ] Stats (`12+`, `300+`, `5k+`, `50k+`, `30+ industries`) and credentials (`ICF · PCC`)
- [ ] Social links in `footer.socials`
- [ ] Newsletter: connect `Newsletter` in `src/components/FooterClient.tsx` to Beehiiv or ConvertKit
- [ ] Contact form: it currently opens the visitor's email app. Swap `onSubmit` in `src/components/sections/Contact.tsx` for a form service if you prefer.

## Photos

Drop images into `public/images/` and point to them from `site.ts`:

| Slot | Suggested size | Notes |
| --- | --- | --- |
| `hero.image` | 1200×1500 (4:5) | Shows inside an arch. Keep the face in the upper third. |
| `about.image` | 1200×1500 (4:5) | A warmer, candid shot works well here. |

While an image is `null`, an on-brand placeholder is shown.

The background photos in `public/images/` (audience, stage, microphones) are royalty-free [Unsplash](https://unsplash.com/license) placeholders. Swap them for real event photos when available.

## Brand colors and fonts

Colors are defined once in `src/app/globals.css` under `@theme` (`--color-violet`, `--color-violet-hi`, `--color-violet-soft`, …). Change them there and the whole site follows.

| Role | Font |
| --- | --- |
| Display | Clash Display (self-hosted in `src/fonts`, [Fontshare free license](https://www.fontshare.com/licenses/itf-ffl)) |
| Body | DM Sans |
| Accent | Instrument Serif italic |
| Labels | Geist Mono |

## Deploy

Push to GitHub and import the repo in Vercel. No environment variables are needed.
