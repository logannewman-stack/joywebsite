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
    photo: {
      src: "/images/audience.jpg",
      alt: "Conference audience in a large hall",
      treatment: "color",
      direction: "Color stage photograph of Dr. Joy that proves presence in a real room.",
      stock: true,
    } satisfies PhotoSlot,
  },

  clinical: {
    heading: "Featured Clinical Courses",
    intro: "Evidence-based programs for dental professionals, with a focus on clinical decisions and practical application.",
    courses: [
      { title: "GLP-1s in Your Chair", text: "Oral findings linked to these medications, patient risk, and preventive care.", pdf: null as string | null },
      { title: "Right Instrument, Right Place, Right Patient", text: "Instrument selection, technique, and clinical decision-making in periodontal care.", pdf: null as string | null },
      { title: "Staging, Grading & Getting to Yes", text: "Applying periodontal classification to diagnosis, treatment recommendations, and patient communication.", pdf: null as string | null },
      { title: "The Biofilm Breakthrough", text: "How biofilm behaves and how to disrupt it.", pdf: null as string | null },
      { title: "Sensitive Teeth, Sensible Solutions", text: "Assessment and management of dentinal hypersensitivity.", pdf: null as string | null },
      { title: "AI in the Hygiene Chair", text: "Where artificial intelligence supports clinical assessment, documentation, and patient communication.", pdf: null as string | null },
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
        pdf: null as string | null,
      },
      {
        title: "Caregiver. Strategist. Owner.",
        subtitle: "Know Your Numbers. Increase Your Worth. Prove Your Worth.",
        text: "Build business literacy while maintaining a commitment to clinical excellence and patient care.",
        pdf: null as string | null,
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
        pdf: null as string | null,
      },
      {
        title: "Boundaries, Burnout, and Breakthrough",
        subtitle: "Becoming the Chief Boundary Officer of Your Life",
        text: "Recognizing personal boundaries, protecting professional well-being, and making intentional choices.",
        pdf: null as string | null,
      },
    ],
    photo: {
      src: null,
      alt: "Dr. Joy, monochrome headshot",
      treatment: "bw",
      direction: "Monochrome headshot to support the keynote typography. White blazer, high tonal detail.",
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
  },

  planning: {
    heading: "Planning an Event?",
    text: "Tell me about your audience, your program, and what you’re looking for in a speaker.",
    cta: "Submit a Speaking Inquiry",
  },
};
