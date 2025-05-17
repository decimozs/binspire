import { SquareCheck, Trash, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryState } from "nuqs";
import { trashbinStatusColorMap } from "@/lib/constants";
import type { Role, Trashbin, TrashbinStatus } from "@/lib/types";

export interface CollectorTasks {
  label: string;
}

export interface CollectorTaskGroup {
  label: string;
  tasks: CollectorTasks[];
}

const collectorTaskItems: Array<CollectorTaskGroup> = [
  {
    label: "To collect",
    tasks: [{ label: "Trashbin 1" }],
  },
  { label: "To fix", tasks: [{ label: "Trashbin 1" }] },
];

export default function CollectorTasks({
  data,
  role,
}: {
  data: Trashbin[];
  role: Role;
}) {
  if (role === "admin") return null;
  const trashbins = data;
  const [, setTrashbinIdParam] = useQueryState("trashbin_id", {
    history: "replace",
  });
  const [, setViewTrashbinParam] = useQueryState("view_trashbin");
  const [, setRouteDirectionParam] = useQueryState("route_direction", {
    history: "replace",
  });
  const [, setStartLatLangParam] = useQueryState("start_latlang", {
    history: "replace",
  });
  const [, setEndLatLangParam] = useQueryState("end_latlang", {
    history: "replace",
  });
  const handleReviewTrashbin = (
    id: string,
    start: [number, number],
    end: [number, number],
  ) => {
    setTrashbinIdParam(id);
    setStartLatLangParam(start.toString());
    setEndLatLangParam(end.toString());
    setRouteDirectionParam("true");
    setViewTrashbinParam("true");
  };
  const notCollectedTrashbins = trashbins.filter(
    (i) => i.isCollected === false,
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon">
            {notCollectedTrashbins.length > 0 && (
              <span className="w-[10px] h-[10px] bg-red-500 rounded-[50%] absolute mt-[-1.7rem] mr-[-1.9rem]"></span>
            )}
            <SquareCheck />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="ml-2 w-[13rem]"
          align="start"
          side="right"
        >
          <DropdownMenuLabel>Tasks</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {collectorTaskItems.map((group) => (
            <DropdownMenuGroup key={group.label}>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span className="flex flex-row items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      {" "}
                      {notCollectedTrashbins.length}
                    </p>
                    {group.label}
                  </span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-[15rem]">
                    {notCollectedTrashbins.map((item) => (
                      <DropdownMenuItem
                        key={item.id}
                        className="flex flex-row items-center justify-between w-full"
                        onClick={() =>
                          handleReviewTrashbin(
                            item.id,
                            [121.07544884155124, 14.577870676283723],
                            [Number(item.longitude), Number(item.latitude)],
                          )
                        }
                      >
                        <div className="flex flex-row items-center gap-4">
                          <Trash />
                          {item.name}
                        </div>
                        {Number(item.weightLevel) > 60 ? (
                          <TrendingUp
                            style={{
                              color:
                                trashbinStatusColorMap[
                                  item.wasteStatus as TrashbinStatus
                                ],
                            }}
                          />
                        ) : (
                          <TrendingDown
                            style={{
                              color:
                                trashbinStatusColorMap[
                                  item.wasteStatus as TrashbinStatus
                                ],
                            }}
                          />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
