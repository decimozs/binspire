import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import { Logo } from "./logo";
import { Button } from "@binspire/ui/components/button";

const links = [
  {
    group: "Product",
    items: [
      {
        title: "Features",
        href: "#",
      },
      {
        title: "Help",
        href: "https://docs.binspire.space/",
      },
      {
        title: "About",
        href: "#",
      },
    ],
  },
  {
    group: "Solution",
    items: [
      {
        title: "Organizations",
        href: "#",
      },
      {
        title: "Collaboration",
        href: "#",
      },
    ],
  },
];

export default function FooterSection() {
  return (
    <footer className="border-b bg-white pt-20 dark:bg-transparent">
      <div className="mb-8 border-b md:mb-12">
        <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-6 px-6 pb-6">
          <Link to="/" aria-label="go home" className="block size-fit">
            <Logo />
          </Link>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a
              href="https://github.com/decimozs/binspire"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground hover:text-primary block"
            >
              <svg
                className="size-6"
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-3">
        <div className="grid gap-12 md:grid-cols-5 md:gap-0 lg:grid-cols-5">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:col-span-5 md:row-start-1 lg:col-span-7">
            {links.map((link, index) => (
              <div key={index} className="space-y-4 text-sm">
                <span className="block font-medium">{link.group}</span>
                {link.items.map((item, index) => (
                  <Link
                    key={index}
                    to={item.href}
                    className="text-muted-foreground hover:text-primary block duration-150"
                  >
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <div className="row-start-1 border-b pb-7 text-sm md:col-span-2 md:border-none lg:col-span-1">
            <div className="space-y-4">
              <Label
                htmlFor="mail"
                className="block text-primary font-black text-5xl mb-2 lg:text-9xl"
              >
                BINSPIRE
              </Label>
            </div>
            <form>
              <div className="space-y-4">
                <Label htmlFor="mail" className="block font-bold">
                  Newsletter
                </Label>
                <Link to="/newsletter">
                  <Button size="sm" className="w-full py-6 font-bold">
                    Notify to latest updates
                  </Button>
                </Link>
                <span className="text-muted-foreground block text-sm mt-4">
                  {"Don't miss any update!"}
                </span>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-12 flex border-t py-6">
          <small className="text-muted-foreground order-last block text-center text-sm md:order-first">
            © {new Date().getFullYear()} Binspire, All rights reserved
          </small>
        </div>
      </div>
    </footer>
  );
}
