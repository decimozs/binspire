import MainLayout from "@/components/layout/main-layout";
import { Database, Hammer, HeartHandshake, Recycle, Trash } from "lucide-react";
import "@google/model-viewer";
import GlobalMap from "../map";
import {
  useGetAllIssues,
  useGetAllUserCollectionAssignment,
  useGetUserQuotaByUserId,
} from "@binspire/query";
import { authClient } from "../auth";
import ServiceCard from "../services/components/service-card";
import { parseAsBoolean, useQueryState } from "nuqs";
import { Button } from "@binspire/ui/components/button";
import { Link } from "@tanstack/react-router";

export default function Home() {
  const { data: currentSession } = authClient.useSession();
  const user = currentSession?.user;
  const userAssignments = useGetAllUserCollectionAssignment();
  const issues = useGetAllIssues();
  const userQuota = useGetUserQuotaByUserId(user?.id!).data?.used || 0;
  const [, setAssignedTrashbinsQuery] = useQueryState(
    "assigned_trashbins",
    parseAsBoolean.withDefault(false),
  );

  const [, setTrashbinIssuesQuery] = useQueryState(
    "trashbin_issues",
    parseAsBoolean.withDefault(false),
  );

  const assignedCollections = userAssignments.data?.filter(
    (i) => i.userId === user?.id,
  );
  const trashbinIssues = issues.data?.filter(
    (i) =>
      i.entity === "trashbinManagement" &&
      i.status !== "resolved" &&
      i.status !== "closed",
  );

  return (
    <MainLayout>
      <div className="bg-accent/40 border-md p-4 rounded-md grid grid-cols-[200px_1fr]">
        <div className="flex flex-col">
          <div>
            <p className="font-bold text-xl">Daily Collectives</p>
            <p className="text-muted-foreground font-bold">
              Trashbin Collection
            </p>
          </div>
          <div className="flex flex-row items-center gap-2 mt-auto">
            <Database size={15} className="text-primary" />
            <p className="font-bold">{userQuota} / 5 bins</p>
          </div>
        </div>
        <div className="flex items-end justify-end">
          {/* @ts-ignore: model-viewer is a custom element */}
          <model-viewer
            src="/models/bin.glb"
            alt="3D Trash Bin"
            auto-rotate
            interaction-prompt="none"
            style={{
              width: "100px",
              height: "100px",
              "--poster-color": "transparent",
            }}
          />
        </div>
      </div>
      <div className="text-center rounded-md bg-primary/10 border-primary border-[1px] py-4 px-2">
        <div className="flex flex-row items-center justify-center gap-2">
          <HeartHandshake />
          <p className="text-xl font-bold">Green Hearts</p>
        </div>
        <p className="font-bold mt-2">
          Change lives with your trash. Your waste donations fuel sustainability
          drives, local clean-ups, and community welfare programs.
        </p>
      </div>
      <div className="flex flex-row items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-bold">
            Assigned Collections
          </p>
          <div className="flex flex-row items-center gap-2 font-bold">
            <Trash size={15} />
            <p>{assignedCollections?.length} bins</p>
          </div>
        </div>
        <div>
          <p className="text-muted-foreground text-sm font-bold">
            Trashbin Issues
          </p>
          <div className="flex flex-row items-center gap-2 font-bold">
            <Trash size={15} />
            <p>{trashbinIssues?.length} issues</p>
          </div>
        </div>
      </div>
      <div>
        <GlobalMap isOnHome={true} />
      </div>
      <div className="grid grid-cols-1 gap-2">
        <p className="text-xl font-bold">Things to do</p>
        <div className="grid grid-cols-1 gap-2">
          <ServiceCard
            label="Collect"
            link="/map"
            icon={Recycle}
            onClick={() => setAssignedTrashbinsQuery(true)}
          />
          <ServiceCard
            label="Fix"
            link="/map"
            icon={Hammer}
            onClick={() => setTrashbinIssuesQuery(true)}
          />
        </div>
        <Link to="/services" className="mt-2 w-full">
          <Button className="w-full font-bold text-lg" variant="outline">
            View More Services
          </Button>
        </Link>
      </div>
    </MainLayout>
  );
}
