import type { PhotoSlot } from "./site";

/** MEET DR. JOY: approved working copy. */
export const meet = {
  /**
   * Search description: the second sentence of the approved opening paragraph,
   * used verbatim (the full paragraph runs past the ~155 characters search
   * results show).
   */
  seo: {
    description:
      "I taught for more than a decade, chaired a dental hygiene program, and served on the Maryland State Board of Dental Examiners.",
  },

  hero: {
    heading: "My career has never followed a single lane.",
    paragraphs: [
      "I earned my dental hygiene license in 1997 and spent more than two decades in the operatory. I taught for more than a decade, chaired a dental hygiene program, and served on the Maryland State Board of Dental Examiners.",
      "Those roles showed me how clinical decisions are made, how professionals build their skills, how practices operate, and how manufacturers bring new products into clinical care.",
      "I earned my master’s and my doctorate to bring research into daily practice, and I stayed in clinical care the entire time.",
    ],
    couplet: ["In lecture halls, I studied.", "In the operatory, I tested and refined."],
    portrait: {
      src: "/photos/meet-hero-g.jpg",
      srcBw: "/photos/meet-hero-bw.jpg",
      alt: "Dr. Joy seated on stone steps in a black suit, smiling, her chin resting on her hand",
      treatment: "bw",
      direction: "Black-and-white portrait. Black jacket, seated or standing, natural expression. Preserve skin texture.",
      // Eyes on the upper third: the tall desktop frame and the 4:5 phone frame crop differently.
      focus: "50% 50%",
      focusMobile: "50% 68%",
      original: "JVH-115",
    } satisfies PhotoSlot,
  },

  /**
   * Clinical close-up set beside "In the operatory, I tested and refined." Calm grade
   * (scripts/grade_photos.py --foliage 0.45 --ceiling 0.30): the neon-teal gloves read
   * as matte teal, so the inset sits with the set.
   */
  operatory: {
    src: "/photos/meet-operatory-v2-g.jpg",
    alt: "Dr. Joy in glasses and teal gloves, pointing to the settings on a clinical handpiece",
    treatment: "color",
    direction: "Color close-up from clinical work: hands, instruments, the operatory. No legible product branding.",
    // Cropped from the original so the manufacturer's name on the handpiece is not shown.
    focus: "50% 50%",
    original: "3Z4A3971",
  } satisfies PhotoSlot,

  /** Full-bleed pause between the opening story and the credentials. */
  interlude: {
    src: "/photos/meet-interlude-g.jpg",
    srcBw: "/photos/meet-interlude-bw.jpg",
    alt: "Dr. Joy sitting on a long stone staircase in a black suit, smiling",
    treatment: "bw",
    direction: "Wide portrait on location, room around her. Same shoot as the opening portrait.",
    focus: "50% 74%",
    focusMobile: "64% 50%",
    original: "JVH-113",
  } satisfies PhotoSlot,

  credentials: {
    heading: "Education, Leadership, and Service",
    groups: [
      {
        title: "Education",
        items: [
          "Doctor of Health Science, Nova Southeastern University",
          "Master of Health Science, Forensic Investigative Science, Nova Southeastern University",
          "Bachelor of Science in Dental Hygiene, University of Maryland School of Dentistry",
          "Certificate in Dental Hygiene, Howard University",
        ],
      },
      {
        title: "Leadership and Service",
        items: [
          "Former member, Maryland State Board of Dental Examiners",
          "Consultant examiner, ADEX",
          "Treasurer, Executive Board, Maryland Dental Action Coalition",
          "Vice President, Executive Board, Mid Atlantic P.A.N.D.A. Coalition",
          "Advisory board member, RDH Magazine",
          "Advisory board member, Inside Dental Hygiene",
          "Advisory board member, GUM RDH Advisory Board",
          "Former Program Chair, Dental Hygiene, Fortis College",
          "Former faculty, American Denturist School",
        ],
      },
      {
        title: "What I’ve Built",
        items: [
          "Dr. Joy, RDH, founder",
          "Jell-Ed, co-founder",
          "The P3 System, creator",
          "Dental Hygiene Student Planner, creator",
        ],
      },
    ],
  },

  guides: {
    heading: "What Guides My Work",
    before: [
      "I first became involved with the Bowie Boys and Girls Club when my oldest son started playing football. I had a lot to say about how I thought things should go.",
      "I also had to ask myself a question.",
    ],
    question: "If you are going to complain, why not do something about it?",
    answer: "I joined the board.",
    after: [
      "Over the years, I’ve served as team mom, cheer commissioner, football administrator, and secretary of the executive board. I’ve also brought dental hygiene students to the club to talk with young athletes about oral health, vaping, and tobacco.",
      "My children have since aged out of the program. My husband and I are still volunteering more than 20 years later.",
    ],
    /**
     * A life photograph from the portrait shoot, so the story ends on her, not
     * on a studio pose. It does not show the club, and the alt text does not
     * claim it does. Swap in a Boys and Girls Club photo when Dr. Joy has one.
     */
    photo: {
      src: "/photos/meet-life-g.jpg",
      alt: "Dr. Joy laughing outdoors in a teal blouse",
      treatment: "color",
      direction: "One authentic contextual/life photograph, in color. Human, not posed: on the sideline, with the board, or with students at the club.",
      focus: "50% 40%",
      original: "JVH-167",
    } satisfies PhotoSlot,
  },
};
