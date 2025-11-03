import { createFileRoute } from "@tanstack/react-router";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import FooterSection from "@/components/footer";
import Features1 from "@/components/features-1";
import Features2 from "@/components/features-2";
import ContentSection from "@/components/content-4";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="w-full flex flex-col">
      <Header />
      <HeroSection />
      <Features1 />
      <Features2 />
      <ContentSection />
      <FooterSection />
    </main>
  );
}
