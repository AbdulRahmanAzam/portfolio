import { ChevronDown } from "lucide-react";
import { portfolioData } from "@/lib/schema";

// Native <details> keeps every answer in the HTML (crawlable even when collapsed).
// The same Q&A is emitted as FAQPage JSON-LD from the home page.
export function FAQ() {
  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-label mb-4 inline-flex">FAQ</span>
          <h2 id="faq-heading" className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 mt-4">
            <span className="heading-underline">Questions about {portfolioData.name}</span>
          </h2>
        </div>

        <div className="space-y-3">
          {portfolioData.faqs.map((faq, index) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-border/50 bg-card/50 px-5 open:border-primary/30 open:bg-card/80"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                <h3 className="text-base font-semibold sm:text-lg">{faq.question}</h3>
                <ChevronDown
                  className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <p className="pb-5 leading-relaxed text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
