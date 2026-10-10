import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/seoConfig";

/**
 * Native <details> FAQ: keyboard accessible, no JS state, and every answer stays
 * in the DOM so crawlers and answer engines can read it.
 */
const FaqList = ({ faqs }: { faqs: FaqItem[] }) => (
  <div className="divide-y divide-border rounded-lg border border-border bg-card">
    {faqs.map((faq) => (
      <details
        key={faq.question}
        className="group"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg px-5 py-4 text-left text-base font-semibold text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
          <h3 className="text-base font-semibold">{faq.question}</h3>
          <ChevronDown
            className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
      </details>
    ))}
  </div>
);

export default FaqList;
