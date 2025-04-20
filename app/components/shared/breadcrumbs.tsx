import { useLocation } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

function formatSegment(segment: string) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function DashboardBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);
  const cleanedPathnames =
    pathnames[0] === "dashboard" ? pathnames.slice(1) : pathnames;

  return (
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
          const isSecondToLast = index === cleanedPathnames.length - 2;

          return (
            <div key={index} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage
                  className={isSecondToLast ? "text-muted-foreground" : ""}
                >
                  {formatSegment(segment)}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
