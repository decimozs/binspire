import type { Audit, TrashbinCollections } from "@binspire/query";
import { parseAsString, useQueryState } from "nuqs";
import ActivityCard from "./activity-card";

interface Props {
  collections: TrashbinCollections[];
  audits: Audit[];
}

export type CollectionWithType = TrashbinCollections & { type: string };
export type AuditWithType = Audit & { type: string };

export default function ActivityList({ collections, audits }: Props) {
  const [searchFilter] = useQueryState("search", parseAsString.withDefault(""));
  const [filter] = useQueryState(
    "filter_activity_by",
    parseAsString.withDefault(""),
  );

  const data = {
    userCollections: collections.map((item) => ({
      ...item,
      type: "trashbin-collection",
    })) as CollectionWithType[],
    userAudits: audits.map((item) => ({
      ...item,
      type: "register-trashbin",
    })) as AuditWithType[],
  };

  let combinedData = [...data.userCollections, ...data.userAudits];

  if (filter === "collection") {
    combinedData = combinedData.filter(
      (item) => item.type === "trashbin-collection",
    );
  } else if (filter === "register") {
    combinedData = combinedData.filter(
      (item) => item.type === "register-trashbin",
    );
  }

  const filteredData = searchFilter
    ? combinedData.filter((item) => {
        const query = searchFilter.toLowerCase().trim();
        const typeNormalized = item.type.replace(/-/g, " ").toLowerCase();
        if (typeNormalized.includes(query)) return true;

        if (item.type === "trashbin-collection") {
          const collection = item as CollectionWithType;
          return (
            collection.no.toString().includes(query) ||
            collection.trashbin.name.toLowerCase().includes(query) ||
            collection.collector.name.toLowerCase().includes(query)
          );
        } else if (item.type === "register-trashbin") {
          const audit = item as AuditWithType;
          return (
            audit.no.toString().includes(query) ||
            audit.title.toLowerCase().includes(query) ||
            audit.user.name.toLowerCase().includes(query) ||
            audit.action.toLowerCase().includes(query) ||
            audit.entity.toLowerCase().includes(query)
          );
        }

        return false;
      })
    : combinedData;

  const sortedData = [...filteredData].sort((a, b) => {
    const dateA = new Date(a.createdAt ?? a.updatedAt ?? 0).getTime();
    const dateB = new Date(b.createdAt ?? b.updatedAt ?? 0).getTime();
    return dateB - dateA;
  });

  return (
    <div className="grid grid-cols-1 gap-3">
      {sortedData.length > 0 &&
        sortedData.map((item) => <ActivityCard key={item.id} data={item} />)}
    </div>
  );
}
