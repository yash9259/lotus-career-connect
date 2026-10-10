import { ReactNode } from "react";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import type { Crumb } from "@/lib/seoConfig";

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  eyebrow?: string;
  crumbs?: Crumb[];
  children?: ReactNode;
}

/** Consistent page intro band: breadcrumbs, eyebrow, H1 and supporting copy. */
const PageHeader = ({ title, description, eyebrow, crumbs, children }: PageHeaderProps) => (
  <section className="hero-ink border-b border-white/10">
    <div className="container py-12 sm:py-16">
      {crumbs && <PageBreadcrumbs items={crumbs} className="mb-5 [&_*]:!text-white/70 [&_[aria-current]]:!text-white" />}
      {eyebrow && <p className="mb-3 text-sm font-semibold text-gold">{eyebrow}</p>}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl">{title}</h1>
      {description && <div className="mt-4 max-w-2xl text-base text-white/80 sm:text-lg">{description}</div>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  </section>
);

export default PageHeader;
