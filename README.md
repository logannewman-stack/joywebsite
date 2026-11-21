# Dr. Joy RDH: website

A six-page, photo-led personal website for Dr. Joy RDH. It has separate pathways for speaking, hands-on education, industry collaborations and consulting (which links out to Instrumental).

Built with Next.js 16, Tailwind CSS 4 and Motion. The look is a black-and-white editorial foundation, with ivory for warmth and blush as a restrained accent. Type is Instrument Serif for display and Geist for text.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000. To test forms locally, copy `.env.example` to `.env.local` and set `GHL_WEBHOOK_URL`.

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/meet-dr-joy` | Meet Dr. Joy |
| `/speaking` | Speaking |
| `/hands-on-education` | Hands-On Education |
| `/industry-collaborations` | Industry Collaborations |
| `/insights` | Insights |
| `/directions` | **Review only** (not indexed, not in the nav): three opening-screen directions with rationale, image selection and tradeoffs |

## Where things live

| What | File |
| --- | --- |
| Approved copy, one file per page | `src/content/home.ts`, `meet.ts`, `speaking.ts`, `education.ts`, `industry.ts`, `insights.ts` |
| Site settings, outbound links, nav, wordmark | `src/content/site.ts` |
| Form types and GoHighLevel tags | `src/content/integrations.ts` |
| Colors and type tokens | `src/app/globals.css` (`@theme`) |

Copy in the content files is the approved working copy from the creative brief. Present any wording changes to Dr. Joy as options before editing.

### Review mode

`showPlaceholders` in `src/content/site.ts` is `true` while the site is in review. In that mode:

- empty photo slots show their art direction
- logo walls, articles and the attendee testimonial show labelled slots
- unconfirmed published articles show "To confirm"
- testimonials awaiting permission carry a "Permission to republish pending" tag
- Unsplash stand-ins carry a "Stock placeholder" tag

Set it to `false` for launch. Anything still empty is then hidden, so the site never shows a dead link or an empty section.

### Opening screen

`homeHero` in `src/content/site.ts` picks the Home opening screen: `"a"` Editorial Monochrome (current), `"b"` Black Stage, or `"c"` Ivory & Color. Compare them at `/directions`.

## Wordmark

The header and footer show a plain typographic stand-in, **not** a logo. Add the existing Dr. Joy script wordmark files to `public/brand/` and set `wordmark.onLight` / `wordmark.onDark` in `site.ts`.

## Photos

Each photo slot in the content files has a `src`, `alt`, intended `treatment` (`bw`, `color` or `cutout`) and a `direction` note. While `src` is `null`, the slot shows that note as an art-direction placeholder.

Supply images already converted to black and white. The site does not apply CSS grayscale to final photography, so tonal quality stays under the photographer's control.

The color images in `public/images/` are royalty-free Unsplash stand-ins and must be replaced with authentic photography.

## Forms and GoHighLevel

Every form posts to `/api/inquiry`. That route validates the submission, drops spam (a hidden honeypot field) and forwards JSON to `GHL_WEBHOOK_URL`. A single webhook can route on the tag, or use the per-type override variables in `.env.example`.

| Inquiry | Opened from | Tag |
| --- | --- | --- |
| Speaking (talk or keynote) | Speaking page, footer, general flow | `speaking` |
| P3 for my conference | Speaking › Dr. Joy's P3 | `p3-conference-inquiry` |
| P3 interest list | Hands-On Education (when no event page is live) | `p3-interest-list` |
| Sponsorship / KOL partnership | Industry Collaborations | `manufacturer-partnership-kol` |
| Clinical launch strategy | Industry Collaborations | `clinical-launch-strategy` |
| General ("Start a Conversation") | Header, Home closing | `general-inquiry` |
| From Dr. Joy newsletter | Footer, Insights | `newsletter-from-dr-joy` |

The general flow asks what the visitor needs:

- **Consulting** routes to Instrumental instead of a form.
- **Attend a P3 event** goes to the live event page when one is set, otherwise to the interest list.

The P3 interest list has two separate opt-ins: sponsor communications and text messages. Both are unchecked by default and arrive as `sponsor_opt_in` / `sms_opt_in` booleans. Choosing text messages requires a phone number. **The opt-in language in `integrations.ts` is a draft and needs review before launch.**

### P3 event

Set `education.events.featured` (in `src/content/education.ts`) to the next event, using Hazel's landing-page URL as `registrationUrl`. While it is `null`, the page shows the approved "not yet available" message and the interest-list form, so there is never a dead registration link.

## Before launch

- [ ] Script wordmark files added
- [ ] Final photography selected, with color, B&W and cutout treatments tested for the hero
- [ ] `links.instrumental`, `links.speakerResources`, `links.privacy` set; `site.url` set to the production domain
- [ ] Course, program and keynote PDFs added (`pdf` fields in `speaking.ts`). Links stay hidden until set.
- [ ] Permissions confirmed for Claire Jeong, Anne Duffy and the P3 attendee testimonial; set `permission: "granted"`
- [ ] Approved conference logos (`speaking.spokenAt.logos`) and manufacturer logos (`industry.collaborations.logos`) added
- [ ] Two original articles added; published-article URLs confirmed
- [ ] Opt-in language approved; GoHighLevel webhook, tags, welcome email and unsubscribe handling tested
- [ ] `showPlaceholders` set to `false`
- [ ] Mobile crops, contrast and alt text checked on real photography

## Deploy

Import the repo in Vercel and add `GHL_WEBHOOK_URL` as an environment variable.
