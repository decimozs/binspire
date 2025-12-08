import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@binspire/ui/components/accordion";
import { Input } from "@binspire/ui/components/input";
import { debounce } from "lodash";
import { Book, Rocket, Search } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import HelpCard from "./components/help-card";

type SearchItem = {
  type: string;
  title: string;
  link?: string;
};

const helpCards = [
  {
    title: "Get started with Binspire",
    icon: Rocket,
    link: "https://docs.binspire.space/docs/getting-started/quick-start",
  },
  {
    title: "Manage your account",
    icon: Rocket,
    link: "/https://docs.binspire.space/docs/guides/account",
  },
  {
    title: "Troubleshooting",
    icon: Rocket,
    link: "/https://docs.binspire.space/docs/guides/troubleshooting",
  },
];

const recommended = [
  {
    title: "Understanding waste levels",
    icon: Book,
    link: "https://docs.binspire.space/docs/recommendations/waste-levels",
  },
  {
    title: "Battery maintenance",
    icon: Book,
    link: "https://docs.binspire.space/docs/recommendations/battery-maintenance",
  },
  {
    title: "Real-time monitoring setup",
    icon: Book,
    link: "https://docs.binspire.space/docs/recommendations/real-time-monitoring",
  },
  {
    title: "Sensor calibration guide",
    icon: Book,
    link: "https://docs.binspire.space/docs/recommendations/sensor-calibration",
  },
  {
    title: "Data transmission and MQTT setup",
    icon: Book,
    link: "https://docs.binspire.space/docs/recommendations/mqtt-setup",
  },
  {
    title: "YOLOv11 waste detection configuration",
    icon: Book,
    link: "https://docs.binspire.space/docs/recommendations/yolo-configuration",
  },
  {
    title: "Optimizing collection routes",
    icon: Book,
    link: "https://docs.binspire.space/docs/recommendations/route-optimization",
  },
  {
    title: "Dashboard usage and alerts",
    icon: Book,
    link: "https://docs.binspire.space/docs/recommendations/dashboard-alerts",
  },
  {
    title: "IoT device connectivity tips",
    icon: Book,
    link: "https://docs.binspire.space/docs/recommendations/iot-connectivity",
  },
  {
    title: "Solar power and UPS maintenance",
    icon: Book,
    link: "https://docs.binspire.space/docs/recommendations/solar-ups",
  },
  {
    title: "Role-based access and security setup",
    icon: Book,
    link: "https://docs.binspire.space/docs/recommendations/security-setup",
  },
];

const faqs = [
  {
    q: "What is the Smart Community Waste Management System?",
    a: "It is an IoT-based system that monitors waste bins in real time using sensors and a web dashboard. It helps optimize waste collection and maintain a cleaner community environment.",
  },
  {
    q: "How does the smart bin work?",
    a: "Each bin has an ultrasonic sensor that detects the fill level. When full, it automatically sends data to the central system, alerting collectors for timely pickup.",
  },
  {
    q: "Who can use the system?",
    a: "Community administrators, garbage collectors, and residents can use the system. Administrators monitor bins, collectors receive route updates, and residents enjoy cleaner surroundings.",
  },
  {
    q: "How does the system improve waste collection?",
    a: "It identifies which bins are full and generates optimized routes for collectors. This reduces unnecessary trips, saves fuel, and prevents overflowing waste bins.",
  },
  {
    q: "What technologies are used in the system?",
    a: "The system uses IoT sensors, Raspberry Pi microcontrollers, cloud storage, and a real-time web dashboard built with modern web technologies.",
  },
  {
    q: "Can the system detect the type of waste?",
    a: "Yes. It uses a YOLOv11-based object detection model to classify waste types through image sensors, improving segregation and recycling efficiency.",
  },
  {
    q: "What happens when a bin is full?",
    a: "Once a bin reaches its full threshold, an automatic alert is sent to the collector and displayed on the monitoring dashboard for immediate action.",
  },
  {
    q: "How does this system benefit the community?",
    a: "It promotes cleanliness, reduces waste overflow, optimizes collection routes, lowers carbon emissions, and supports smart and sustainable community development.",
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
      recommended: recommended.filter((r) =>
        r.title.toLowerCase().includes(lower),
      ),
      faqs: faqs.filter((f) => f.q.toLowerCase().includes(lower)),
    };
  }, [searchInput]);

  const isSearching = searchInput.trim().length > 0;

  const searchResults: SearchItem[] = [
    ...filtered.helpCards.map((h) => ({
      type: "Topic",
      title: h.title,
      link: h.link,
    })),
    ...filtered.recommended.map((r) => ({
      type: "Recommendation",
      title: r.title,
      link: r.link,
    })),
    ...filtered.faqs.map((f) => ({
      type: "FAQ",
      title: f.q,
    })),
  ];

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
                    <a
                      key={r.title}
                      href={r.link}
                      className="flex flex-row items-center gap-4 cursor-pointer hover:underline"
                      rel="noreferrer"
                      target="_blank"
                    >
                      <Book size={15} />
                      {r.title}
                    </a>
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
            {searchResults.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 border-[1px] border-accent hover:bg-accent/30 transition-colors cursor-pointer"
                onClick={() => item.link && window.open(item.link, "_blank")}
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
    </MainLayout>
  );
}
