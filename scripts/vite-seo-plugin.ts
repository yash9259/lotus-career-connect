import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { HOME_FAQS, JOBS_FAQS, LOCATIONS, SITE, STATIC_ROUTES, absoluteUrl, buildTitle } from "../src/lib/seoConfig";

interface SeoPluginOptions {
  /** Public origin, e.g. https://www.example.com (no trailing slash). */
  siteUrl: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

const escapeAttr = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const setMeta = (html: string, attr: "name" | "property", key: string, content: string) =>
  html.replace(
    new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`),
    (_m, a, b) => `${a}${escapeAttr(content)}${b}`,
  );

/**
 * Build-time SEO helper:
 *  - replaces the __SITE_URL__ token in index.html
 *  - emits sitemap.xml (static routes + approved jobs when Supabase env vars are present)
 *  - emits robots.txt (blocks private areas, points to the sitemap)
 *  - emits a per-route HTML shell (about.html, contact.html ...) with route-specific
 *    <title>, description, canonical and social tags, so crawlers that do not run
 *    JavaScript still see accurate metadata. The SPA still boots normally.
 */
export default function seoPlugin(options: SeoPluginOptions): Plugin {
  const { siteUrl } = options;
  let outDir = "dist";

  return {
    name: "hkjp-seo",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return html.replace(/__SITE_URL__/g, siteUrl);
      },
    },
    async closeBundle() {
      if (!siteUrl) {
        console.warn(
          "[seo] VITE_SITE_URL is not set — skipped sitemap.xml and per-route HTML. " +
            "Set it (e.g. https://www.yourdomain.com) in your hosting environment variables.",
        );
        fs.writeFileSync(
          path.join(outDir, "robots.txt"),
          ["User-agent: *", "Allow: /", "Disallow: /admin", "Disallow: /dashboard", ""].join("\n"),
        );
        return;
      }

      /* ---- sitemap.xml ---- */
      const urls: Array<{ loc: string; lastmod?: string; changefreq: string; priority: number }> =
        STATIC_ROUTES.map((route) => ({
          loc: absoluteUrl(siteUrl, route.path === "/" ? "/" : route.path),
          lastmod: new Date().toISOString().slice(0, 10),
          changefreq: route.changefreq,
          priority: route.priority,
        }));

      if (options.supabaseUrl && options.supabaseAnonKey) {
        try {
          const response = await fetch(
            `${options.supabaseUrl}/rest/v1/job_posts?select=id,created_at&status=eq.approved&order=created_at.desc&limit=5000`,
            {
              headers: {
                apikey: options.supabaseAnonKey,
                Authorization: `Bearer ${options.supabaseAnonKey}`,
              },
            },
          );
          if (response.ok) {
            const rows = (await response.json()) as Array<{ id: string; created_at?: string }>;
            for (const row of rows) {
              urls.push({
                loc: absoluteUrl(siteUrl, `/jobs/${row.id}`),
                lastmod: row.created_at ? row.created_at.slice(0, 10) : undefined,
                changefreq: "weekly",
                priority: 0.7,
              });
            }
          } else {
            console.warn(`[seo] Could not fetch approved jobs for sitemap (HTTP ${response.status}).`);
          }
        } catch (error) {
          console.warn("[seo] Could not fetch approved jobs for sitemap:", (error as Error).message);
        }
      }

      const sitemap =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        urls
          .map(
            (u) =>
              `  <url>\n    <loc>${u.loc}</loc>\n` +
              (u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : "") +
              `    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority.toFixed(1)}</priority>\n  </url>`,
          )
          .join("\n") +
        `\n</urlset>\n`;
      fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap);

      /* ---- robots.txt ---- */
      fs.writeFileSync(
        path.join(outDir, "robots.txt"),
        [
          "User-agent: *",
          "Allow: /",
          "Disallow: /admin",
          "Disallow: /dashboard",
          "",
          "# AI and answer-engine crawlers: public pages may be read and cited",
          ...["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot"].flatMap(
            (bot) => [`User-agent: ${bot}`, "Allow: /", "Disallow: /admin", "Disallow: /dashboard", ""],
          ),
          `Sitemap: ${absoluteUrl(siteUrl, "/sitemap.xml")}`,
          "",
        ].join("\n"),
      );

      /* ---- llms.txt (plain-language summary for AI assistants) ---- */
      fs.writeFileSync(
        path.join(outDir, "llms.txt"),
        [
          `# ${SITE.name}`,
          "",
          `> Job placement platform based in Bhuj, Gujarat. Jobs are posted from across India and worldwide and are not limited to one location; candidates in any city can apply.`,
          "",
          "## What we do",
          "- Candidates register, complete a profile, browse admin-approved jobs and apply from a dashboard.",
          "- Employers post a job without an account; our admin team reviews it before it is published.",
          "",
          "## Contact",
          `- Phone: ${SITE.phoneDisplay}`,
          `- Email: ${SITE.email}`,
          `- Office: ${SITE.address.streetAddress}, ${SITE.address.addressLocality}, ${SITE.address.addressRegion} ${SITE.address.postalCode}`,
          "",
          "## Pages",
          `- [Browse jobs](${absoluteUrl(siteUrl, "/jobs")})`,
          `- [Post a job](${absoluteUrl(siteUrl, "/post-job")})`,
          `- [Register as a candidate](${absoluteUrl(siteUrl, "/register")})`,
          `- [About](${absoluteUrl(siteUrl, "/about")})`,
          `- [Contact](${absoluteUrl(siteUrl, "/contact")})`,
          "",
          "## Locations",
          `Candidates can apply from anywhere. Locations we are commonly searched for: ${LOCATIONS.map((l) => l.name).join(", ")}.`,
          "",
          "## Frequently asked questions",
          ...[...HOME_FAQS, ...JOBS_FAQS.filter((f) => !HOME_FAQS.some((h) => h.question === f.question))].flatMap((faq) => [
            `### ${faq.question}`,
            faq.answer,
            "",
          ]),
        ].join("\n"),
      );

      /* ---- per-route HTML shells ---- */
      const indexPath = path.join(outDir, "index.html");
      if (!fs.existsSync(indexPath)) return;
      const baseHtml = fs.readFileSync(indexPath, "utf8");

      for (const route of STATIC_ROUTES) {
        if (route.path === "/") continue;
        const fullTitle = buildTitle(route.title);
        const canonical = absoluteUrl(siteUrl, route.path);
        let html = baseHtml
          .replace(
            "<h1>Hare Krishna Job Placement</h1>",
            `<h1>${escapeAttr(route.title.split(" | ")[0])}</h1>\n          <p>${escapeAttr(route.description)}</p>`,
          )
          .replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(fullTitle)}</title>`)
          .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`);
        html = setMeta(html, "name", "description", route.description);
        html = setMeta(html, "property", "og:title", fullTitle);
        html = setMeta(html, "property", "og:description", route.description);
        html = setMeta(html, "property", "og:url", canonical);
        html = setMeta(html, "name", "twitter:title", fullTitle);
        html = setMeta(html, "name", "twitter:description", route.description);
        const shellPath = path.join(outDir, `${route.path.slice(1)}.html`);
        fs.mkdirSync(path.dirname(shellPath), { recursive: true });
        fs.writeFileSync(shellPath, html);
      }
    },
  };
}
