import { Input } from "@binspire/ui/components/input";
import { Search } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

export default function SearchActivity() {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );

  return (
    <div className="grow relative">
      <Input
        className="rounded-full pl-12 text-lg"
        placeholder="What activity is that?"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Search className="absolute left-4 top-3" />
    </div>
  );
}
