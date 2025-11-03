import MainLayout from "@/components/layout/main-layout";
import ServiceCard from "./components/service-card";
import { Hammer, Recycle, Trash } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";

export default function Services() {
  const [, setAssignedTrashbinsQuery] = useQueryState(
    "assigned_trashbins",
    parseAsBoolean.withDefault(false),
  );

  const [, setTrashbinIssuesQuery] = useQueryState(
    "trashbin_issues",
    parseAsBoolean.withDefault(false),
  );

  return (
    <MainLayout>
      <p className="text-xl font-medium">What do you want to do today?</p>
      <div className="grid grid-cols-1 gap-4">
        <ServiceCard
          label="Collect"
          link="/map"
          icon={Recycle}
          onClick={() => setAssignedTrashbinsQuery(true)}
        />
        <ServiceCard label="Register" link="/register-trashbin" icon={Trash} />
        <ServiceCard
          label="Fix"
          link="/map"
          icon={Hammer}
          onClick={() => setTrashbinIssuesQuery(true)}
        />
      </div>
    </MainLayout>
  );
}
