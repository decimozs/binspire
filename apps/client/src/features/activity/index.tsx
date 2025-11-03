import MainLayout from "@/components/layout/main-layout";
import FilterButton from "./components/filter-button";
import SearchActivity from "./components/search-activity";
import ActivityList from "./components/activity-list";
import type { Audit, TrashbinCollections } from "@binspire/query";

interface Props {
  collections: TrashbinCollections[];
  audits: Audit[];
}

export default function Activity({ collections, audits }: Props) {
  return (
    <div>
      <div className="flex flex-row items-center gap-4 mb-4">
        <SearchActivity />
        <FilterButton />
      </div>
      <MainLayout>
        <ActivityList collections={collections} audits={audits} />
      </MainLayout>
    </div>
  );
}
