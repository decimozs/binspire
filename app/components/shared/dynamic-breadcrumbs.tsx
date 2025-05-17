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
  username,
}: {
  username?: string;
}) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);
  const cleanedPathnames =
    pathnames[0] === "dashboard" ? pathnames.slice(1) : pathnames;

  if (location.pathname.includes("/profile")) {
    return (
      <div className="flex flex-row items-center justify-between w-full">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="text-secondary-foreground">
              {username}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
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
    </div>
  );
}
