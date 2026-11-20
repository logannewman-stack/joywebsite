/**
 * ============================================================================
 *  SITE CONTENT
 *  Every word, link and photo on the homepage lives in this one file.
 *
 *  Inline formatting inside any text string:
 *    **words**  -> violet highlight (bold)
 *    _words_    -> elegant serif italic accent
 *
 *  Photos: set an `image` to a path in /public (for example
 *  "/images/joy-hero.jpg"). When it is null, a styled placeholder shows.
 *
 *  PLACEHOLDER COPY: everything below is draft copy written to show the
 *  layout. Replace names, numbers, testimonials and logos with real ones
 *  before launch.
 * ============================================================================
 */

export type Rich = string;

export const site = {
  meta: {
    title: "Joy | Speaker, Coach & Author",
    description:
      "Keynote speaker and coach helping high-achievers build careers and lives that feel as good as they look. Keynotes, workshops and 1:1 coaching.",
  },

  name: {
    first: "Joy",
    last: "", // e.g. "Lastname". When set, the logo becomes two lines.
  },

  email: "hello@yourdomain.com",

  nav: [
    { label: "About", href: "#about" },
    { label: "Method", href: "#method" },
    { label: "Speaking", href: "#speaking" },
    { label: "Work with me", href: "#services" },
    { label: "Testimonials", href: "#testimonials" },
  ],

  cta: { label: "Work with Joy", href: "#contact" },

  /** Paste a YouTube or Vimeo link to power every "Watch" button. */
  videoUrl: "",

  hero: {
    eyebrow: "Speaker · Coach · Author",
    lines: [
      { text: "Dream it.", style: "accent" },
      { text: "Build it.", style: "italic" },
      { text: "Enjoy it.", style: "accent" },
    ] as const,
    sub: "For high-achievers who have built a full life and still feel like something is missing. **Honest coaching, clear thinking,** and a plan that finally sticks.",
    reelLabel: "Watch the reel",
    stats: [
      { value: "12+", label: "Years coaching" },
      { value: "300+", label: "Stages & events" },
      { value: "5k+", label: "Lives impacted" },
    ],
    badges: [
      { title: "Certified Coach", sub: "ICF · PCC" },
      { title: "The Joy Podcast", sub: "New every Friday" },
    ],
    image: null as string | null, // "/images/joy-hero.jpg"
  },

  testimonialOne: {
    quote:
      "Joy delivered one of the **most energizing, genuinely useful talks** our leadership team has ever experienced. In twenty years of events, few speakers have left a room with this much **real, actionable clarity.**",
    name: "Client Name",
    role: "CEO, Company Name",
  },

  trustedBy: {
    heading: "Trusted by leaders at:",
    // Placeholder wordmarks. Swap for real client logos (SVG/PNG in /public/logos).
    logos: [
      { name: "Northvale", style: "display" },
      { name: "Lumen & Co.", style: "serif" },
      { name: "ATLAS/GROUP", style: "mono" },
      { name: "brightpath", style: "sans" },
      { name: "Kestrel", style: "display" },
      { name: "Harbor Health", style: "serif" },
      { name: "MERIDIAN", style: "wide" },
      { name: "foundry.", style: "sans" },
      { name: "Oakridge", style: "serif" },
      { name: "COBALT", style: "mono" },
      { name: "Evergreen", style: "display" },
      { name: "Summit+", style: "wide" },
    ] as const,
  },

  marquee: ["Speaker", "Coach", "Author", "Podcast host", "Founder", "Joy-builder"],

  story: [
    "Success shouldn't cost you your **joy**.",
    "Every week I meet people who have checked every box and **still feel stuck**.",
    "Like you, they're working to:",
    "**Build a career that fuels them,** not one that drains them.",
    "**Lead their people** without losing themselves.",
    "Create a life that feels as good **as it looks.**",
  ],

  problem: {
    heading: "More hustle isn't the answer. Neither is another planner or pushing harder.",
    image: "/images/microphone.jpg",
    imageAlt: "Microphone in front of a live audience",
    turn: "There's a _better way…_",
  },

  about: {
    eyebrow: "[ 01 ] Come closer",
    heading: "Hi, I'm Joy.",
    image: null as string | null, // "/images/joy-about.jpg"
    paragraphs: [
      "For years I was the person everyone counted on, and the last person I took care of.",
      "Big titles. Bigger rooms. A calendar packed with things that looked impressive from the outside. And underneath it all, a quiet feeling that I was running someone else's race.",
      "I kept meeting people just like me. Smart. Driven. Generous. Exhausted. Doing everything right and wondering why it never added up to happy.",
      "That's when it became clear: this was never a motivation problem. **It was a design problem.**",
      "So I stopped chasing more and started building on purpose. Not because I wanted a framework. Because nothing else actually worked.",
    ],
    signature: "Joy",
  },

  statements: {
    intro:
      "People aren't stuck because they aren't trying hard enough.\nThey're stuck because no one ever showed them a different way.",
    lines: [
      { accent: "Clarity", rest: "not chaos." },
      { accent: "Intention", rest: "not hustle." },
      { accent: "Joy", rest: "not just results." },
    ],
  },

  proof: {
    paragraphs: [
      "I've worked with leaders across **30+ industries** and spoken to more than **50,000 people** on stages around the world. I've sat in every seat: employee, founder and coach. Nothing I teach is theory.",
      "It's not about doing more. It's about designing a life where your effort finally **pays off.**",
      "Today I help people see what's really holding them back and build a way of working and living that is **clear, sustainable** and **genuinely joyful.**",
    ],
    image: "/images/audience.jpg",
    imageAlt: "Audience listening to a keynote",
    badge: { value: "50k+", label: "People reached" },
  },

  benefits: {
    heading: "When your work and your life finally move as **one**, everything changes.",
    items: [
      { icon: "compass", title: "Decisions get easier", text: "You know what matters, so the noise stops winning." },
      { icon: "zap", title: "Energy comes back", text: "You stop carrying things that were never yours to carry." },
      { icon: "users", title: "People follow your lead", text: "Teams trust a leader who knows exactly where they're going." },
      { icon: "sparkles", title: "Joy becomes the default", text: "Success stops feeling like something you have to survive." },
    ] as const,
  },

  video: {
    heading: "Watch Joy _in action_",
    button: "Watch the reel",
    image: "/images/keynote-stage.jpg",
  },

  method: {
    eyebrow: "[ 02 ] The method",
    heading: "How The JOY Method™ Works",
    image: "/images/podcast-mic.jpg",
    imageAlt: "Studio microphone",
    paragraphs: [
      "The JOY Method is the system I use to turn good intentions into a life that actually works.",
      "Clarity before action.",
      "Rhythm over willpower.",
      "It doesn't ask you to try harder. It builds the structure that makes the right choices easy.",
      "When the system holds, progress stops depending on motivation and **starts compounding.**",
    ],
    letters: [
      { letter: "J", title: "Journey Inward", text: "Get honest about what you actually want, not what you were told to want." },
      { letter: "O", title: "Own Your Rhythm", text: "Design habits, boundaries and routines around how you really work best." },
      { letter: "Y", title: "Yes to What's Next", text: "Take the bold next step with a plan, a partner and a reason that holds." },
    ],
  },

  topics: {
    eyebrow: "[ 03 ] On stage",
    heading: "Speaking Topics",
    sub: "Every talk is built around one question: what would change if you stopped surviving your success and started enjoying it?",
    items: [
      {
        icon: "sparkles",
        title: "The Joy Advantage",
        tagline: "Why the happiest leaders are also the most effective",
        text: "Burnout isn't a badge of honor. It's a performance problem. This keynote shows audiences how joy drives better decisions, stronger teams and results that last.",
      },
      {
        icon: "compass",
        title: "Built on Purpose",
        tagline: "Designing a career you don't need a vacation from",
        text: "Most people never design their lives; they inherit them. This session gives audiences a simple framework to get clear, cut the noise and build momentum that sticks.",
      },
      {
        icon: "shield",
        title: "Lead Without Losing Yourself",
        tagline: "Boundaries, energy and influence for high-performers",
        text: "Great leaders aren't the ones who give the most. They're the ones who know what to protect. A practical, honest talk on leading well without burning out.",
      },
    ] as const,
  },

  testimonialTwo: {
    quote: "Two years later, our team **still talks about her keynote.**",
    name: "Client Name",
    role: "Event Director, Organization",
    image: "/images/crowd-glow.jpg",
  },

  services: {
    eyebrow: "[ 04 ] Work with me",
    heading: "One philosophy. _Many_ doorways.",
    sub: "Every part of the work is built on the same foundation. Choose the doorway that fits where you are.",
    items: [
      {
        audience: "For organizations",
        title: "Keynote",
        accent: "Speaking",
        text: "45–60 minute talks for conferences, kickoffs and company events.",
        rows: [
          ["Format", "In person or virtual"],
          ["Length", "45–60 min"],
        ],
        cta: "Check availability",
      },
      {
        audience: "For individuals",
        title: "1:1",
        accent: "Coaching",
        text: "Private coaching for leaders and high-achievers ready for what's next.",
        rows: [
          ["Format", "Virtual"],
          ["Length", "3, 6 or 12 months"],
        ],
        cta: "Apply for coaching",
      },
      {
        audience: "For teams",
        title: "Team",
        accent: "Workshops",
        text: "Half-day and full-day intensives for leadership teams and offsites.",
        rows: [
          ["Format", "On-site"],
          ["Length", "Half or full day"],
        ],
        cta: "Plan a workshop",
      },
    ],
  },

  finalCta: {
    heading: "Let's build something that _lasts._",
    sub: "If life feels harder than it should, the problem is **not** you. It's the system you're living inside.",
  },

  contact: {
    eyebrow: "[ 05 ] Begin the work",
    heading: "The right change starts with _one_ conversation.",
    sub: "Tell me a little about where you are. I read every message personally and reply within two business days.",
    options: [
      { title: "Twenty minutes. Free.", sub: "No pitch. Just an honest conversation." },
      { title: "Speaking inquiry", sub: "For event planners & organizations" },
    ],
    interests: ["1:1 Coaching", "Speaking", "Workshops", "Podcast & media", "Something else"],
    formHeading: "If you're ready for what's next, I'd be honored to help.",
  },

  footer: {
    tagline: "You get one life. Let's make it a _joyful_ one.",
    newsletter: {
      heading: "The Friday Joy Note",
      sub: "One honest idea, every Friday. No spam, ever.",
    },
    columns: [
      {
        title: "Explore",
        links: [
          { label: "About", href: "#about" },
          { label: "The JOY Method", href: "#method" },
          { label: "Speaking", href: "#speaking" },
          { label: "Testimonials", href: "#testimonials" },
        ],
      },
      {
        title: "Work together",
        links: [
          { label: "1:1 Coaching", href: "#services" },
          { label: "Keynotes", href: "#services" },
          { label: "Workshops", href: "#services" },
          { label: "Contact", href: "#contact" },
        ],
      },
    ],
    socials: [
      { label: "Instagram", href: "#", icon: "instagram" },
      { label: "LinkedIn", href: "#", icon: "linkedin" },
      { label: "YouTube", href: "#", icon: "youtube" },
    ] as const,
  },
};

export type Site = typeof site;
