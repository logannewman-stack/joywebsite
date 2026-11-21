/**
 * ============================================================================
 *  FORMS AND GOHIGHLEVEL TAGS
 *  Every form posts to /api/inquiry, which forwards to the GoHighLevel
 *  inbound webhook set in the GHL_WEBHOOK_URL environment variable.
 *  Each inquiry type carries its own tag so Hazel's workflows can route it.
 *  Optional per-type webhooks: GHL_WEBHOOK_URL_<TYPE> (e.g. GHL_WEBHOOK_URL_SPEAKING).
 * ============================================================================
 */

export const inquiryTypes = {
  speaking: {
    tag: "speaking",
    label: "Conference talk or keynote",
    title: "Submit a Speaking Inquiry",
    intro: "Tell me about your audience, your program, and what you’re looking for in a speaker.",
  },
  p3_conference: {
    tag: "p3-conference-inquiry",
    label: "P3 Interactive or P3 Mini for my conference",
    title: "Inquire About P3 for Your Conference",
    intro: "P3 Interactive and P3 Mini are available for conference and organization programs.",
  },
  partnership: {
    tag: "manufacturer-partnership-kol",
    label: "Sponsorship or KOL partnership",
    title: "Discuss a Partnership",
    intro: "I partner with manufacturers on sponsored education, speaking engagements, hands-on programs, professional content, and clinical advisory roles.",
  },
  clinical_launch: {
    tag: "clinical-launch-strategy",
    label: "Clinical launch strategy",
    title: "Discuss a Clinical Launch Project",
    intro: "Tell me what you are building: a clinical education program, a professional partnership, or a product launch.",
  },
  p3_interest: {
    tag: "p3-interest-list",
    label: "Attend a P3 event",
    title: "Join the P3 Interest List",
    intro: "Join the P3 interest list to be notified when event details and registration are announced.",
  },
  general: {
    tag: "general-inquiry",
    label: "Something else",
    title: "Start a Conversation",
    intro: "Tell me what you’re working on.",
  },
  newsletter: {
    tag: "newsletter-from-dr-joy",
    label: "From Dr. Joy newsletter",
    title: "Subscribe to From Dr. Joy",
    intro: "A monthly email with clinical perspectives, upcoming education, and news from my work.",
  },
} as const;

export type InquiryType = keyof typeof inquiryTypes;

/** Choices offered in the general "Start a Conversation" flow, in order. */
export const interestChoices: (InquiryType | "consulting")[] = [
  "speaking",
  "p3_conference",
  "p3_interest",
  "partnership",
  "clinical_launch",
  "consulting",
  "general",
];

export const consultingChoice = {
  label: "Practice or DSO hygiene department",
  note: "Practice and DSO consulting, including practice-specific P3 team training, is offered through Instrumental.",
};

/**
 * DRAFT opt-in language for the P3 interest list. Both boxes are unchecked
 * by default. Language must be reviewed before launch (brief, section 04).
 */
export const optIns = {
  sponsor:
    "Yes, I’d like to receive occasional communications about P3 education from event sponsors. (Optional)",
  sms: "Yes, send me text messages about P3 event announcements and registration. Message and data rates may apply. Reply STOP to opt out. (Optional)",
};
