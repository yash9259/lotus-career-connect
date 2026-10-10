import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE, absoluteUrl, buildTitle } from "@/lib/seoConfig";

interface SeoProps {
  /** Page title. The brand name is appended automatically when missing. */
  title: string;
  description?: string;
  /** Override canonical path (defaults to the current pathname, without query string). */
  path?: string;
  /** Use on private / transactional pages that must stay out of search results. */
  noindex?: boolean;
  image?: string;
  type?: "website" | "article";
  /** One or more JSON-LD objects. They must describe content visible on the page. */
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const JSON_LD_ID = "seo-page-jsonld";

export const getSiteUrl = () => {
  const configured = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim();
  return (configured || window.location.origin).replace(/\/+$/, "");
};

const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

/**
 * Lightweight head manager (no extra dependency). Updates title, description,
 * canonical, robots, Open Graph, Twitter and page-level JSON-LD on route change.
 */
const Seo = ({ title, description, path, noindex = false, image, type = "website", jsonLd }: SeoProps) => {
  const location = useLocation();
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    const siteUrl = getSiteUrl();
    const fullTitle = buildTitle(title);
    const canonicalPath = path ?? location.pathname;
    const canonicalUrl = absoluteUrl(siteUrl, canonicalPath === "/" ? "/" : canonicalPath.replace(/\/+$/, ""));
    const imageUrl = image
      ? image.startsWith("http")
        ? image
        : absoluteUrl(siteUrl, image)
      : absoluteUrl(siteUrl, SITE.ogImagePath);

    document.title = fullTitle;
    if (description) {
      upsertMeta("name", "description", description);
      upsertMeta("property", "og:description", description);
      upsertMeta("name", "twitter:description", description);
    }

    upsertMeta(
      "name",
      "robots",
      noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1",
    );

    if (noindex) {
      document.head.querySelector('link[rel="canonical"]')?.remove();
    } else {
      upsertCanonical(canonicalUrl);
    }

    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", imageUrl);
    upsertMeta("property", "og:site_name", SITE.name);
    upsertMeta("property", "og:locale", "en_IN");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:image", imageUrl);

    document.getElementById(JSON_LD_ID)?.remove();
    if (jsonLdString && !noindex) {
      const script = document.createElement("script");
      script.id = JSON_LD_ID;
      script.type = "application/ld+json";
      script.text = jsonLdString;
      document.head.appendChild(script);
    }

    return () => {
      document.getElementById(JSON_LD_ID)?.remove();
    };
  }, [title, description, path, noindex, image, type, jsonLdString, location.pathname]);

  return null;
};

export default Seo;
