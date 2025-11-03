import { formatLabel } from "@binspire/shared";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@binspire/ui/components/drawer";
import { format } from "date-fns";
import type { AuditWithType, CollectionWithType } from "./activity-list";
import { TrashbinStatus as TrashbinStatusBadge } from "@/components/badges";

interface Props {
  data: CollectionWithType | AuditWithType;
}

function isCollection(
  data: CollectionWithType | AuditWithType,
): data is CollectionWithType {
  return data.type === "trashbin-collection";
}

function isAudit(
  data: CollectionWithType | AuditWithType,
): data is AuditWithType {
  return data.type === "register-trashbin";
}

export default function ActivityCard({ data }: Props) {
  return (
    <Drawer>
      <DrawerTrigger className="p-4 border rounded grid grid-cols-1 gap-2">
        <div>
          <p className="text-lg font-bold">
            {formatLabel(data.type).replace("-", " ")} #{data.no}
          </p>
          <p className="text-sm font-bold text-muted-foreground">
            {format(new Date(data.createdAt), "MMM d, yyyy h:mm a")}
          </p>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="font-bold text-xl text-left">
            Activity
          </DrawerTitle>
          <DrawerDescription className="text-left">
            ID: {data.id}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 grid-cols-1 gap-2 pb-4">
          <div className="text-xl font-bold mt-2">
            <p>Type</p>
            <p className="text-muted-foreground">
              {formatLabel(data.type).replace("-", " ")} #{data.no}
            </p>
          </div>

          {isCollection(data) && (
            <>
              <p className="mt-4 text-xl">Details</p>
              <div className="text-xl font-bold mt-2 flex flex-row items-center justify-between">
                <p>Waste Level</p>
                <TrashbinStatusBadge
                  label="Waste Level"
                  value={data.wasteLevel as number}
                  unit="%"
                  type="waste-level"
                  enabledColumn={true}
                />
              </div>

              <div className="text-xl font-bold mt-2 flex flex-row items-center justify-between">
                <p>Weight Level</p>
                <TrashbinStatusBadge
                  label="Weight Level"
                  value={data.weightLevel as number}
                  unit="kg"
                  type="weight-level"
                  enabledColumn={true}
                />
              </div>

              <div className="text-xl font-bold mt-2 flex flex-row items-center justify-between">
                <p>Battery Level</p>
                <TrashbinStatusBadge
                  label="Battery Level"
                  value={data.batteryLevel as number}
                  unit="%"
                  type="battery-level"
                  enabledColumn={true}
                />
              </div>
            </>
          )}

          {isAudit(data) && (
            <>
              <p className="mt-4 text-xl">Details</p>
              <div className="text-lg mt-2">
                <div className="text-xl font-bold mt-2">
                  <p>Title</p>
                  <p className="text-muted-foreground">
                    {data.title || "No title provided"}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="text-xl font-bold mt-4">
            <p>Created At</p>
            <p className="text-muted-foreground">
              {format(new Date(data.createdAt), "MMMM dd, yyyy - hh:mm a")}
            </p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
