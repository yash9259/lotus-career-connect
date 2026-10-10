import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import type { Crumb } from "@/lib/seoConfig";

/** Visible breadcrumb trail. Pair with breadcrumbSchema() in the page's <Seo jsonLd />. */
const PageBreadcrumbs = ({ items, className = "" }: { items: Crumb[]; className?: string }) => (
  <nav aria-label="Breadcrumb" className={className}>
    <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            {item.to && !isLast ? (
              <Link to={item.to} className="rounded-sm transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span aria-current={isLast ? "page" : undefined} className={isLast ? "font-medium text-foreground" : ""}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default PageBreadcrumbs;
