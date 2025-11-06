import MainLayout from "@/components/layout/main-layout";
import FilterButton from "./components/filter-button";
import SearchActivity from "./components/search-activity";
import ActivityList from "./components/activity-list";
import type { Audit, TrashbinCollections } from "@binspire/query";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@binspire/ui/components/empty";
import { Activity as ActivityIcon } from "lucide-react";

interface Props {
  collections: TrashbinCollections[];
  audits: Audit[];
}

export default function Activity({ collections, audits }: Props) {
  return (
    <div>
      {collections.length === 0 && audits.length === 0 ? null : (
        <div className="flex flex-row items-center gap-4 mb-4">
          <SearchActivity />
          <FilterButton />
        </div>
      )}
      {collections.length === 0 && audits.length === 0 ? (
        <Empty className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/1">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ActivityIcon />
            </EmptyMedia>
            <EmptyTitle>No Activity Found</EmptyTitle>
            <EmptyDescription className="w-[300px]">
              There is no activity matching your search criteria.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <MainLayout>
          <ActivityList collections={collections} audits={audits} />
        </MainLayout>
      )}
    </div>
  );
}
