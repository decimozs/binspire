import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export default function ContentSection() {
  return (
    <section className="py-16 md:py-32" id="about">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <h2 className="text-4xl font-medium">
            The Binspire Ecosystem: Connecting Data, Devices, and Decisions
          </h2>
          <div className="space-y-6">
            <p>
              Binspire unites smart sensors, AI-powered insights, and an
              intuitive management platform to transform how waste is collected
              and monitored.
            </p>
            <p>
              Binspire. It’s more than just a system it’s an integrated
              ecosystem that empowers cities and businesses to make data-driven,
              sustainable decisions in real time.
            </p>
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="gap-1 pr-1.5"
            >
              <Link to="/">
                <span>Learn More</span>
                <ChevronRight className="size-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
