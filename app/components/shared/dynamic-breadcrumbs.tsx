import { useLocation } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Command } from "lucide-react";

function formatSegment(segment: string) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function DynamicBreadcrumbs({
  userName,
}: {
  userName?: string;
}) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);
  const cleanedPathnames =
    pathnames[0] === "dashboard" ? pathnames.slice(1) : pathnames;

  if (location.pathname.includes("/profile")) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="text-secondary-foreground">
            {userName}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <div className="flex flex-row items-center justify-between w-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/dashboard"
              className={
                location.pathname === "/dashboard"
                  ? "text-secondary-foreground"
                  : ""
              }
            >
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>

          {cleanedPathnames.map((segment, index) => {
            const isLast = index === cleanedPathnames.length - 1;

            return (
              <div key={index} className="flex items-center">
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage
                    className={!isLast ? "text-muted-foreground" : ""}
                  >
                    {formatSegment(segment)}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-row items-center text-muted-foreground gap-3">
        <div className="flex flex-row items-center gap-1 text-muted-foreground border-input border-dashed border-[1px] rounded-sm p-1 px-2 font-medium text-[0.8rem]">
          <p>CTRL</p>
          <p>+</p>
          <p>K</p>
        </div>
        <div>
          <Command size={15} />
        </div>
      </div>
    </div>
  );
}
