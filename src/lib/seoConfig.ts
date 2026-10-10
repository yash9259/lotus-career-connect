/**
 * Single source of truth for site-level SEO data.
 * Imported by the runtime <Seo /> component AND by the build-time
 * sitemap / robots / per-route HTML plugin (scripts/vite-seo-plugin.ts),
 * so keep this file free of React, aliases and browser APIs.
 */

export const SITE = {
  name: "Hare Krishna Job Placement",
  tagline: "Find your path. Serve with purpose.",
  phone: "+919879821908",
  phoneDisplay: "+91 98798 21908",
  email: "harekrishnajobplacement@gmail.com",
  address: {
    streetAddress: "Shop 4, Harikrishna Plaza, Raghuvanshi Rd, near Sarah's Academy, Char Raasta, Ravalvadi",
    addressLocality: "Bhuj",
    addressRegion: "Gujarat",
    postalCode: "370001",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.facebook.com/share/16GoJDMm55/",
    "https://www.instagram.com/harekrishnajobplacement",
    "https://www.linkedin.com/in/hare-krishna-job-placement-a2066435a",
  ],
  logoPath: "/logo.png",
  ogImagePath: "/og-image.png",
} as const;

export interface StaticRouteMeta {
  path: string;
  title: string;
  description: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: number;
}

/** Public, indexable, non-dynamic routes. Used for <Seo/> defaults, sitemap.xml and prerendered shells. */
export const STATIC_ROUTES: StaticRouteMeta[] = [
  {
    path: "/",
    title: "Job Placement in Bhuj, Gujarat | Jobs Across India | Hare Krishna Job Placement",
    description:
      "Hare Krishna Job Placement, Bhuj, connects job seekers and employers. Browse admin-approved jobs from across India and worldwide, or post an opening. Open to candidates in every city.",
    changefreq: "daily",
    priority: 1.0,
  },
  {
    path: "/jobs",
    title: "Browse Jobs | Hare Krishna Job Placement",
    description:
      "Search admin-approved job openings by keyword, city, experience and category. Apply through your Hare Krishna Job Placement candidate dashboard.",
    changefreq: "daily",
    priority: 0.9,
  },
  {
    path: "/post-job",
    title: "Post a Job Opening | Hare Krishna Job Placement",
    description:
      "Employers can post a job opening without creating an account. Our admin team reviews each listing before it is published to candidates.",
    changefreq: "monthly",
    priority: 0.8,
  },
  {
    path: "/register",
    title: "Register as a Candidate | Hare Krishna Job Placement",
    description:
      "Create your candidate profile with Hare Krishna Job Placement to browse openings, save jobs and apply from your dashboard.",
    changefreq: "monthly",
    priority: 0.7,
  },
  {
    path: "/about",
    title: "About Us | Hare Krishna Job Placement",
    description:
      "Learn about Hare Krishna Job Placement: our mission, vision and values in connecting professionals with purpose-driven organizations.",
    changefreq: "monthly",
    priority: 0.6,
  },
  {
    path: "/contact",
    title: "Contact Us | Hare Krishna Job Placement, Bhuj",
    description:
      "Contact Hare Krishna Job Placement in Bhuj, Gujarat by phone, WhatsApp, email or the contact form. Find our office address and answers to common questions.",
    changefreq: "yearly",
    priority: 0.6,
  },
];

/* ---------- Locations used for SEO (no separate pages: jobs are posted globally) ---------- */

export interface LocationInfo {
  name: string;
  /** Name used in structured data. */
  schemaName: string;
  type: "City" | "AdministrativeArea" | "Country";
}

const city = (name: string, schemaName = name): LocationInfo => ({ name, schemaName, type: "City" });

/** Shown in structured data, meta keywords, llms.txt and the footer. Edit freely. */
export const LOCATIONS: LocationInfo[] = [
  city("Bhuj"),
  city("Gandhidham"),
  city("Madhapar", "Madhapar, Bhuj"),
  city("Mundra"),
  city("Kandla"),
  { name: "Kutchh", schemaName: "Kutch district", type: "AdministrativeArea" },
  city("Ahmedabad"),
  city("Surat"),
  city("Vadodara"),
  city("Rajkot"),
  { name: "Gujarat", schemaName: "Gujarat", type: "AdministrativeArea" },
  city("Mumbai"),
  city("Pune"),
  city("Delhi"),
  city("Bengaluru"),
  city("Hyderabad"),
  city("Chennai"),
  city("Kolkata"),
  { name: "India", schemaName: "India", type: "Country" },
];

export const buildTitle = (title: string) =>
  title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;

export const absoluteUrl = (siteUrl: string, path: string) =>
  `${siteUrl.replace(/\/+$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

/* ---------- JSON-LD builders (must mirror visible page content) ---------- */

export const organizationSchema = (siteUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "EmploymentAgency",
  "@id": `${siteUrl}/#organization`,
  name: SITE.name,
  url: siteUrl,
  logo: absoluteUrl(siteUrl, SITE.logoPath),
  image: absoluteUrl(siteUrl, SITE.ogImagePath),
  description:
    "Job placement platform based in Bhuj, Gujarat, connecting candidates with employers for jobs posted across India and worldwide.",
  telephone: SITE.phone,
  email: SITE.email,
  address: { "@type": "PostalAddress", ...SITE.address },
  areaServed: LOCATIONS.map((l) => ({ "@type": l.type, name: l.schemaName })),
  knowsAbout: ["Job placement", "Recruitment", "Jobs in Kutch", "Port and logistics jobs", "Office and accounts jobs"],
  sameAs: SITE.sameAs,
});

export const websiteSchema = (siteUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: SITE.name,
  url: siteUrl,
  publisher: { "@id": `${siteUrl}/#organization` },
  inLanguage: "en-IN",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/jobs?keyword={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
});

export interface Crumb {
  label: string;
  to?: string;
}

export const breadcrumbSchema = (siteUrl: string, crumbs: Crumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.label,
    ...(crumb.to ? { item: absoluteUrl(siteUrl, crumb.to) } : {}),
  })),
});

export interface FaqItem {
  question: string;
  answer: string;
}

export const faqSchema = (faqs: FaqItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
});

/* ---------- Answer-engine (AEO / AIO) helpers ---------- */

/** Page-level node that links to the site and organization and marks the passages best suited for voice and AI answers. */
export const webPageSchema = (
  siteUrl: string,
  opts: {
    path: string;
    name: string;
    description: string;
    type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
    speakable?: string[];
  },
) => ({
  "@context": "https://schema.org",
  "@type": opts.type ?? "WebPage",
  "@id": `${absoluteUrl(siteUrl, opts.path)}#webpage`,
  url: absoluteUrl(siteUrl, opts.path),
  name: opts.name,
  description: opts.description,
  inLanguage: "en-IN",
  isPartOf: { "@id": `${siteUrl}/#website` },
  about: { "@id": `${siteUrl}/#organization` },
  ...(opts.speakable?.length
    ? { speakable: { "@type": "SpeakableSpecification", cssSelector: opts.speakable } }
    : {}),
});

export const itemListSchema = (siteUrl: string, jobs: Array<{ id: string; position: string }>) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: jobs.map((job, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: job.position,
    url: absoluteUrl(siteUrl, `/jobs/${job.id}`),
  })),
});

/* ---------- Visible FAQ copy (shared by pages, JSON-LD and llms.txt) ---------- */

export const HOME_FAQS: FaqItem[] = [
  {
    question: "What is Hare Krishna Job Placement?",
    answer:
      "Hare Krishna Job Placement is a job placement platform based in Bhuj, Gujarat. It connects candidates with employers: candidates can register and apply for approved openings, and employers can submit jobs for review and publishing.",
  },
  {
    question: "How do I apply for a job?",
    answer:
      "Register as a candidate, complete your profile, and complete payment verification in your dashboard. After that you can apply to approved jobs and track your applications from the dashboard.",
  },
  {
    question: "Do employers need an account to post a job?",
    answer:
      "No. Employers can submit a job listing without creating an account. Our admin team reviews the listing and publishes it once approved.",
  },
  {
    question: "How long does it take for a job to be approved?",
    answer: "Most jobs are reviewed and approved within 24 hours of submission.",
  },
  {
    question: "Which locations can I apply from?",
    answer:
      "Candidates in any location can use our platform, including Bhuj, Gandhidham, Madhapar, Mundra, Kandla and Kutch (also spelled Kutchh), and cities such as Ahmedabad, Mumbai and Bengaluru. Jobs are posted globally, not limited to one place.",
  },
  {
    question: "Is there a job placement agency in Bhuj?",
    answer:
      "Yes. Hare Krishna Job Placement has its office in Bhuj, Gujarat, at Ravalvadi near Char Raasta. Candidates can register online and employers can post jobs for review.",
  },
  {
    question: "Where is Hare Krishna Job Placement located?",
    answer:
      "Our office is at Shop 4, Harikrishna Plaza, Raghuvanshi Rd, near Sarah's Academy, Char Raasta, Ravalvadi, Bhuj, Gujarat 370001. You can also reach us on +91 98798 21908.",
  },
];

export const JOBS_FAQS: FaqItem[] = [
  {
    question: "How do I apply for a job on this page?",
    answer:
      "Register as a candidate, complete your profile, and complete payment verification in your dashboard. After that you can apply to approved jobs and track every application from the dashboard.",
  },
  {
    question: "Are all listed jobs reviewed?",
    answer: "Yes. Only jobs that our admin team has reviewed and approved are listed on the Browse Jobs page.",
  },
  {
    question: "Can I apply if I live outside Bhuj?",
    answer:
      "Yes. Candidates in any location can apply, including Gandhidham, Mundra, Kandla, Ahmedabad, Mumbai and Bengaluru. Jobs are posted from across India and worldwide.",
  },
];
