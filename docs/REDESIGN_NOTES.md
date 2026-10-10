# Hare Krishna Job Placement — Redesign, SEO / AIO / AEO & Performance Notes

Stack: React 18 + Vite + TypeScript + Tailwind + shadcn/Radix + Supabase (SPA, deployed on Vercel).
Approach: design-system and shell upgrade on top of the existing architecture. No database, API, auth, routing or
business-logic files were changed (`src/lib/*`, `src/hooks/*`, `src/components/auth/*`, `supabase/*` are untouched).

## 1. Baseline — functionality that must keep working

Public: `/` home · `/jobs` list + filters + pagination · `/jobs/:id` detail (Apply / Save / Share) · `/post-job`
(no account, goes to admin review) · `/register` · `/login` · `/reset-password` · `/about` · `/contact` · `*` 404.
Candidate (auth-gated): `/dashboard`, `/dashboard/jobs|applications|saved-jobs|profile|education|experience|resume|references|payment`.
Admin (auth-gated): `/admin`, `/admin/jobs|job-review(/:jobId)|candidates|candidates/profile(/:id)|applications|payments|notifications|settings`, `/admin/login`.
Critical workflows: employer posts job → status `pending` → admin reviews / edits / approves → appears on `/jobs`;
candidate registers → logs in → payment verification gate → applies / saves; admin manages candidates, applications, payments.

## 2. What changed

**Design system** — `src/index.css`, `tailwind.config.ts`, `src/components/ui/{button,input,textarea,select,badge,card,dialog,skeleton}.tsx`
Plum brand (from the logo) with logo-colour accents, Fraunces display headings + Plus Jakarta Sans body, refined shadows,
radii, focus rings, 3:1 form-control borders, reduced-motion support. All component APIs unchanged, so every dashboard /
admin screen inherits the new look automatically.

**Shell & pages** — Header (sticky glass, accessible mobile menu, Esc to close), Footer, Layout (skip link, `<main>`),
WhatsApp button (removed endless bounce), Home (fixed broken `/hero.png` reference, working search → `/jobs?keyword=`,
how-it-works, FAQ), JobCard, Jobs (reads `?keyword=`), JobDetail, About, Contact (labels now linked to inputs), 404,
Admin/Dashboard shells (skip link, landmarks, noindex), AdminLogin.

**SEO / AIO / AEO**
- `Seo` component (title, description, canonical, robots, Open Graph, Twitter, JSON-LD) on every page; private pages `noindex`.
- `src/lib/seoConfig.ts` is the single source for route metadata, sitemap and JSON-LD builders.
- Structured data: `EmploymentAgency` + `WebSite` (index.html), `FAQPage` (Home, Contact), `BreadcrumbList` (Jobs, Job detail, About, Contact, Post a Job),
  `JobPosting` (job detail; salary only emitted when it parses cleanly). All mirrors visible content.
- Build plugin (`scripts/vite-seo-plugin.ts`): generates `sitemap.xml` (static routes + approved jobs via Supabase REST),
  `robots.txt`, and per-route HTML shells (`about.html`, `contact.html`, …) with route-specific title / description / canonical,
  so crawlers that do not run JavaScript still get correct metadata. `vercel.json` uses `cleanUrls` to serve them at `/about` etc.
- `robots.txt`: allows public pages, blocks `/admin` and `/dashboard`, links the sitemap. `/login`, `/reset-password` stay crawlable but `noindex`.

**Performance** — route-level code splitting (`React.lazy`) + vendor chunks; fonts via preconnect + `display=swap` instead of a CSS `@import`;
about/values images 1.4 MB PNG → 115 KB WebP (PNGs kept); header logo 77 KB → 9 KB; explicit image dimensions; long-lived asset caching headers.

**Accessibility / security** — skip links, landmarks, `aria-current`, labelled filters and form fields, visible focus, reduced motion;
security headers in `vercel.json`; **removed pre-filled admin credentials** (`admin@hkjobs.com` / `admin123`) from `AdminLogin`.

## 3. Deployment checklist

1. `npm install && npm run build` — fix anything the type-check/build reports (this environment had no network, see §4).
2. Set **`VITE_SITE_URL`** (e.g. `https://www.yourdomain.com`) in Vercel → needed for canonical URLs, sitemap, Open Graph and JSON-LD.
   (`.env.example` added.) Vercel's production URL is used as a fallback.
3. Confirm `dist/` contains `sitemap.xml`, `robots.txt`, `about.html`, `contact.html`, `jobs.html`, `post-job.html`, `register.html`.
4. Add the site to Google Search Console and Bing Webmaster Tools, verify, submit `/sitemap.xml`.
5. Validate with Rich Results Test (JobPosting, FAQ, Breadcrumb) and run Lighthouse on `/`, `/jobs`, a job detail page and `/contact`.
6. Because the sitemap lists approved jobs at build time, trigger a redeploy (or a Vercel deploy hook on a schedule) as jobs are added.
7. **Change the admin password** if `admin123` was ever a real credential, and confirm `.env` is not committed to a public repo.

## 4. Test report

Verified here: all 37 changed/new `.ts`/`.tsx` files parse without syntax errors (TypeScript compiler); the SEO plugin was dry-run and
produced a valid `sitemap.xml`, `robots.txt`, five per-route HTML shells and valid JSON-LD; `vercel.json` is valid JSON; no logic files
(data layer, hooks, auth, Supabase) were modified, so data and permission behaviour is unchanged by construction.

**Not verified (sandbox had no network/`node_modules`, no browser):** full `vite build` and strict type-check, Lighthouse / Core Web Vitals,
visual QA at each breakpoint, and click-through of the live workflows. Run this manual regression pass after `npm run build`:

- [ ] Home: stats and recent jobs load; search box → `/jobs?keyword=…` filters results
- [ ] Jobs: filters, pagination, Apply (logged out → login; candidate without payment → payment page)
- [ ] Job detail: Apply / Save / Share / Report; page source shows JobPosting JSON-LD
- [ ] Post a Job: submit → success state → job visible as *pending* in admin Job Review
- [ ] Admin: login, approve / reject / edit / delete job, candidates, applications, payments, notifications, settings
- [ ] Candidate: register, login, profile / education / experience / resume / references / payment, saved jobs, applications
- [ ] Mobile menu opens, closes on route change and Esc; no horizontal scroll at 360 px
- [ ] `/admin/*` and `/dashboard/*` redirect when logged out and are `noindex`

## 5. Items to review (pre-existing, intentionally not changed)

- **Contact form does not send anything**: `handleSubmit` simulates a 1.5 s delay and shows a success toast. Connect it to your email function / Supabase.
- **Unverified claims in copy**: About says "thousands of candidates and hundreds of employers" and "Founded in 2025"; Contact FAQ mentions "free and featured job posting"
  and a 24-hour approval time. Please confirm these are accurate (the 24-hour line is reused in the Home FAQ).
- **Employer name is not shown on job pages**, so `JobPosting.hiringOrganization` declares Hare Krishna Job Placement. If you decide to show employers publicly, switch it to the employer.
- The job filter lists (cities, categories) are hard-coded and limited; jobs in other cities can only be found via keyword.
- Repo hygiene: `tmp/test_rls.js` and `supabase/.temp/` look like local artefacts; consider removing them from the repository.
- This is a client-rendered SPA. The per-route shells fix metadata for non-JS crawlers, but full content for AI crawlers that skip JavaScript would need pre-rendering (e.g. `vite-react-ssg`) as a later step.

## 6. Premium UI + location SEO/AEO/AIO pass

- **Design**: dark plum hero with a faint ajrakh-style lattice, gold accent (`--gold`), glass panel, gold primary CTA (`.btn-gold`), area chips, asymmetric area grid (`.card-premium`). Tokens live in `src/index.css` / `tailwind.config.ts`.
- **Local landing pages**: `/jobs-in/bhuj|gandhidham|madhapar|mundra|kandla|kutchh` (`src/pages/JobsInArea.tsx`, data in `AREAS` in `src/lib/seoConfig.ts`). Each has an answer-first paragraph, roles, FAQ, internal links, and JSON-LD (`WebPage` + speakable, `Service` + `areaServed`, `BreadcrumbList`, `FAQPage`).
- **Site-wide**: `EmploymentAgency` now declares `areaServed`; home FAQ adds area questions; footer + hero link to every area page.
- **Build plugin**: area pages added to `sitemap.xml` and per-route HTML shells (nested `jobs-in/*.html`, with crawler-visible `<noscript>` text); `robots.txt` explicitly allows AI crawlers; new `llms.txt`.
- **Please verify**: the "roles you may find" lists in `AREAS` are generic examples, not promises of openings. Edit them to match the jobs you really place.
- **Update**: jobs are posted globally, so location pages (`(removed)`, 20 of them: Kutch towns, major Indian cities, Gujarat, India, Remote) say candidates in that place can apply to all jobs. Add or remove locations in `AREAS` (`src/lib/seoConfig.ts`). The Kutch towns are `featured` and shown on the home page.
- **Update 2**: separate location pages were removed because jobs are posted globally. Location SEO now comes from `LOCATIONS` in `src/lib/seoConfig.ts` (company `areaServed` JSON-LD, meta keywords, `llms.txt`, footer text, home FAQ). There are no `/jobs-in/*` routes.
- **Update 3 (site-wide premium pass)**: dark plum header with gold active pill and gold CTA, dark `PageHeader` band (Jobs), premium `JobCard`, gradient primary button, 2xl cards, gold footer hairline, dark home CTA band. Dashboard and admin screens inherit buttons/cards/inputs/tokens but their layouts were not individually restyled.
- **About page** redesigned (arched hero image, dark mission/vision panel, value strip, AboutPage JSON-LD). I removed the unverified claims "Founded in 2025" and "thousands of candidates and hundreds of employers"; add them back only if they are accurate.
- **Palette change**: switched from plum/gold to calm navy + slate with a soft sky accent and white buttons on dark bands, for a more professional look. Token names `--gold` and `--plum-deep` were kept so existing classes still work; they now hold sky-blue and deep navy.
