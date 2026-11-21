import type { PhotoSlot } from "./site";

/**
 * SPEAKING: approved working copy.
 * `pdf`: path or URL to the approved course-detail PDF. Links stay hidden
 * until a PDF is supplied, so there are never dead links.
 */
export const speaking = {
  hero: {
    heading: "Presentations grounded in clinical practice.",
    paragraphs: [
      "I speak at dental conferences, study clubs, and professional organizations on periodontal care, emerging technology, the business of hygiene, and professional well-being.",
      "My presentations connect evidence with clinical experience and give attendees something to use the next clinic day.",
    ],
    primary: { label: "View Speaking Topics", href: "#topics" },
    secondary: { label: "Submit a Speaking Inquiry" },
    // Event photograph: color in both photo styles, so no black-and-white twin.
    photo: {
      src: "/photos/speaking-hero-stage-g.jpg",
      alt: "Dr. Joy on a conference stage in a white blazer, mid-presentation",
      treatment: "color",
      direction: "Color stage photograph: Dr. Joy at full height, the protagonist of the frame.",
      focus: "50% 38%",
      original: "54708125748",
    } satisfies PhotoSlot,
  },

  /** Full-bleed proof of a real room, between the courses and the team programs. */
  room: {
    // The conference's sign on the podium is retouched to a plain panel
    // (third-party branding needs clearance).
    photo: {
      src: "/photos/speaking-room-v2-g.jpg",
      alt: "Dr. Joy on stage in front of a conference audience",
      treatment: "color",
      direction: "Wide color photograph of the stage and the audience.",
      focus: "52% 46%",
      original: "54708146349",
    } satisfies PhotoSlot,
  },

  clinical: {
    heading: "Featured Clinical Courses",
    intro: "Evidence-based programs for dental professionals, with a focus on clinical decisions and practical application.",
    courses: [
      { title: "GLP-1s in Your Chair", text: "Oral findings linked to these medications, patient risk, and preventive care.", pdf: "/pdfs/glp-1s-in-your-chair.pdf" as string | null },
      { title: "Right Instrument, Right Place, Right Patient", text: "Instrument selection, technique, and clinical decision-making in periodontal care.", pdf: "/pdfs/right-instrument-right-place-right-patient.pdf" as string | null },
      { title: "Staging, Grading & Getting to Yes", text: "Applying periodontal classification to diagnosis, treatment recommendations, and patient communication.", pdf: "/pdfs/staging-grading-getting-to-yes.pdf" as string | null },
      { title: "The Biofilm Breakthrough", text: "How biofilm behaves and how to disrupt it.", pdf: "/pdfs/the-biofilm-breakthrough.pdf" as string | null },
      { title: "Sensitive Teeth, Sensible Solutions", text: "Assessment and management of dentinal hypersensitivity.", pdf: "/pdfs/sensitive-teeth-sensible-solutions.pdf" as string | null },
      { title: "AI in the Hygiene Chair", text: "Where artificial intelligence supports clinical assessment, documentation, and patient communication.", pdf: "/pdfs/ai-in-the-hygiene-chair.pdf" as string | null },
      // PDF held: the supplied file carries retired 2026 course-year wording.
      { title: "Prep, Protect, Prevent", text: "Infection control principles, clinical safety, and effective protocols for dental teams.", pdf: null as string | null },
    ],
  },

  teams: {
    heading: "For Dental Teams & Organizations",
    intro: "Programs that connect clinical care with practice operations, professional development, and the business of hygiene.",
    programs: [
      {
        title: "The Business of Hygiene",
        subtitle: "Turning Prevention Into Production, Profit, and Practice Value",
        text: "How consistent clinical care and measured hygiene performance strengthen a practice.",
        pdf: "/pdfs/the-business-of-hygiene.pdf" as string | null,
      },
      {
        title: "Caregiver. Strategist. Owner.",
        subtitle: "Know Your Numbers. Increase Your Worth. Prove Your Worth.",
        text: "Build business literacy while maintaining a commitment to clinical excellence and patient care.",
        pdf: "/pdfs/caregiver-strategist-owner.pdf" as string | null,
      },
    ],
  },

  keynotes: {
    heading: "Keynote Presentations",
    items: [
      {
        title: "The Power of the Hygiene Hour",
        subtitle: "Reimagining the Appointment, Empowering the Clinician",
        text: "A new look at how the hygiene appointment is structured and the role of the clinician within it.",
        pdf: "/pdfs/the-power-of-the-hygiene-hour.pdf" as string | null,
      },
      {
        title: "Boundaries, Burnout, and Breakthrough",
        subtitle: "Becoming the Chief Boundary Officer of Your Life",
        text: "Recognizing personal boundaries, protecting professional well-being, and making intentional choices.",
        pdf: "/pdfs/boundaries-burnout-and-breakthrough.pdf" as string | null,
      },
    ],
    // Stage frame cropped to 4:5. The black-and-white twin (red-weighted mix,
    // so the curtain falls to black) is used when site.photoStyle is "bw".
    photo: {
      src: "/photos/speaking-keynote-stage-g.jpg",
      srcBw: "/photos/speaking-keynote-stage-bw.jpg",
      alt: "Dr. Joy delivering a keynote on stage",
      treatment: "color",
      direction: "Stage photograph to carry the keynote typography: profile, mid-sentence.",
      focus: "40% 30%",
      original: "54708146684",
    } satisfies PhotoSlot,
  },

  p3: {
    heading: "Dr. Joy’s P3",
    bring: {
      title: "Bring P3 to Your Conference",
      text: "P3 Interactive and P3 Mini are available for conference and organization programs.",
      cta: "Inquire About P3 for Your Conference",
    },
    attend: {
      title: "Attend P3",
      text: "I host my own P3 events during the year. See upcoming programs and register.",
      cta: { label: "Upcoming P3 Events", href: "/hands-on-education#events" },
    },
  },

  spokenAt: {
    heading: "Where I’ve Spoken",
    // Curated, verified conference and association logos: { name, src }
    logos: [] as { name: string; src: string }[],
    /**
     * Until logos are cleared, venues are set as type. Source: "Presentations
     * (partial listing)" in Testimonials.pdf. Review mode shows the list with a
     * "confirm before launch" tag; at launch it appears only once Dr. Joy has
     * confirmed it: set verified: true (or remove venues she wants left out).
     */
    verified: false,
    venues: [
      "American Association of Dental Consultants",
      "American Dental Hygienists’ Association",
      "Association for Dental Safety (formerly OSAP)",
      "California Dental Association",
      "Canadian Dental Hygienists’ Association",
      "Chicago MidWinter",
      "Colgate Oral Health Network for Professional Development",
      "Connecticut State Dental Association",
      "Dentsply Sirona World",
      "Greater New York Dental Meeting",
      "Mid Continent Dental Congress",
      "National Dental Hygienists’ Association",
      "Ontario Dental Association",
      "Pacific Dental Conference",
      "RDH Under One Roof",
      "Rocky Mountain Dental Convention",
      "Star of the North",
      "Thrive Live – Henry Schein",
      "Victoria and District Dental Society",
      "Virginia Dental Hygienists’ Association",
      "Viva Learning",
      "Western Society of Periodontology",
      "Wisconsin Dental Hygienists’ Association",
    ],
  },

  testimonial: {
    heading: "What Meeting Planners Are Saying",
    quote:
      "When she keynoted our sold-out conference, she created a meaningful experience that sparked connection, confidence, and a lasting impact that resonated with our attendees long after the event ended.",
    name: "Anne Duffy",
    role: "Founder & CEO, Dental Entrepreneur Woman (DeW)",
    permission: "pending" as "pending" | "granted",
  },

  resources: {
    heading: "Meeting Planner Resources",
    text: "Access my speaker packet, professional biography, approved headshots, and detailed course information.",
    cta: "View Speaker Resources",
    /**
     * Until links.speakerResources is set, "View Speaker Resources" opens this
     * list: the four things the approved line names, in its order, each with
     * what exists today. The supplied speaker packet and "Meet Dr. Joy.pdf"
     * carry the retired P3 wording, so they are NOT linked: the packet and
     * headshots are sent on request until a clean packet is supplied.
     * "On request" is a UI label awaiting Dr. Joy's approval.
     */
    kit: {
      packet: "Speaker packet",
      biography: "Professional biography",
      headshots: "Approved headshots",
      courses: "Detailed course information",
      onRequest: "On request",
    },
  },

  planning: {
    heading: "Planning an Event?",
    text: "Tell me about your audience, your program, and what you’re looking for in a speaker.",
    cta: "Submit a Speaking Inquiry",
  },
};

/**
 * Every bookable program title, in page order (clinical courses, team
 * programs, keynotes). For the speaking inquiry's "Program of interest" field.
 */
export const programTitles: string[] = [
  ...speaking.clinical.courses.map((c) => c.title),
  ...speaking.teams.programs.map((p) => p.title),
  ...speaking.keynotes.items.map((k) => k.title),
];
