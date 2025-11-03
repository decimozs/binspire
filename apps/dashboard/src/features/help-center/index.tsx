import MainLayout from "@/components/layout/main-layout";
import { Input } from "@binspire/ui/components/input";
import HelpCard from "./components/help-card";
import { Book, Rocket, Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@binspire/ui/components/accordion";
import { useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";

const helpCards = [
  { title: "Get started with Binspire", icon: Rocket },
  { title: "Manage your account", icon: Rocket },
  { title: "Troubleshooting", icon: Rocket },
];

const recommended = [
  "Understanding waste levels",
  "Battery maintenance",
  "Real-time monitoring setup",
];

const faqs = [
  {
    q: "Is it accessible?",
    a: "Yes. It adheres to the WAI-ARIA design pattern.",
  },
  {
    q: "Can I reset my device?",
    a: "Yes. You can reset it from the settings page.",
  },
  {
    q: "How to update firmware?",
    a: "Connect to Wi-Fi and navigate to the updates section.",
  },
];

export default function HelpCenter() {
  const [globalSearch, setGlobalSearch] = useQueryState("q", {
    defaultValue: "",
  });
  const [searchInput, setSearchInput] = useState(globalSearch);

  const debouncedSetSearch = useMemo(
    () => debounce((val: string) => setGlobalSearch(val), 300),
    [setGlobalSearch],
  );

  useEffect(() => {
    setSearchInput(globalSearch);
  }, [globalSearch]);

  useEffect(() => {
    debouncedSetSearch(searchInput);
    return () => debouncedSetSearch.cancel();
  }, [searchInput, debouncedSetSearch]);

  const filtered = useMemo(() => {
    const lower = searchInput.toLowerCase();
    if (!lower) return { helpCards, recommended, faqs };

    return {
      helpCards: helpCards.filter((h) => h.title.toLowerCase().includes(lower)),
      recommended: recommended.filter((r) => r.toLowerCase().includes(lower)),
      faqs: faqs.filter((f) => f.q.toLowerCase().includes(lower)),
    };
  }, [searchInput]);

  const isSearching = searchInput.trim().length > 0;

  return (
    <MainLayout title="Welcome to Help Center" description="How can we help?">
      <Input
        placeholder="What are you looking for?"
        className="h-9 max-w-[300px]"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      <div className="mt-6">
        {!isSearching && (
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-3 gap-4">
              {helpCards.map((h) => (
                <HelpCard key={h.title} title={h.title} icon={h.icon} />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <p className="text-3xl font-semibold">Recommended</p>
                <div className="flex flex-col gap-4">
                  {recommended.map((r) => (
                    <div
                      key={r}
                      className="flex flex-row items-center gap-4 cursor-pointer hover:underline"
                    >
                      <Book size={15} />
                      {r}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-3xl font-semibold">FAQs</p>
                <div className="flex flex-col gap-2">
                  {faqs.map((f, i) => (
                    <Accordion
                      key={i}
                      type="single"
                      collapsible
                      className="border-[1px] border-accent rounded-md px-4"
                    >
                      <AccordionItem value={`faq-${i}`}>
                        <AccordionTrigger className="cursor-pointer">
                          {f.q}
                        </AccordionTrigger>
                        <AccordionContent>{f.a}</AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {isSearching && (
          <div className="flex flex-col gap-3 -mt-1">
            <p className="text-xl font-semibold flex items-center gap-2">
              <Search size={16} /> Search results for “{searchInput}”
            </p>
            {[
              ...filtered.helpCards.map((h) => ({
                type: "Topic",
                title: h.title,
              })),
              ...filtered.recommended.map((r) => ({
                type: "Recommendation",
                title: r,
              })),
              ...filtered.faqs.map((f) => ({
                type: "FAQ",
                title: f.q,
              })),
            ].length === 0 ? (
              <p className="text-sm text-muted-foreground mt-4">
                No results found.
              </p>
            ) : (
              <div className="flex flex-col divide-y divide-accent rounded-md border border-accent">
                {[
                  ...filtered.helpCards.map((h) => ({
                    type: "Topic",
                    title: h.title,
                  })),
                  ...filtered.recommended.map((r) => ({
                    type: "Recommendation",
                    title: r,
                  })),
                  ...filtered.faqs.map((f) => ({
                    type: "FAQ",
                    title: f.q,
                  })),
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 hover:bg-accent/30 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
