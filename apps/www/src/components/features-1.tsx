import { Settings2, Sparkles, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { CardContent, CardHeader } from "@/components/ui/card";

export default function Features1() {
  return (
    <section
      className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent"
      id="features1"
    >
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Built to cover your needs
          </h2>
          <p className="mt-4">
            Designed for both cities and businesses, Binspire adapts to your
            waste management operations from collection tracking to real-time
            monitoring ensuring efficiency, sustainability, and accountability
            at every level.
          </p>
        </div>
        <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16">
          <div className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Zap className="size-6 text-primary" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Smart & Scalable</h3>
            </CardHeader>

            <CardContent>
              <p className="text-sm">
                Built to scale with your city or business from small communities
                to enterprise operations. Customize routes, bin types, and data
                views to match your unique waste management workflow.
              </p>
            </CardContent>
          </div>

          <div className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Settings2 className="size-6 text-primary" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">You’re in Control</h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">
                Monitor, manage, and optimize your entire waste collection
                network from a single dashboard. Gain full visibility and act in
                real time, anytime, anywhere.
              </p>
            </CardContent>
          </div>

          <div className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Sparkles className="size-6 text-primary" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Powered By AI</h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">
                Binspire AI delivers actionable insights through an MCP-style
                interface. Analyze patterns, query data, and leverage multiple
                LLMs for smarter operations.
              </p>
            </CardContent>
          </div>
        </div>
      </div>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
    />

    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">
      {children}
    </div>
  </div>
);
