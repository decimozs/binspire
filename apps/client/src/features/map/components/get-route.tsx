import { Button } from "@binspire/ui/components/button";
import { ArrowUpRight, X } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";

export default function GetRoute() {
  const [selectProfileQuery, setSelectProfileQuery] = useQueryState(
    "select_profile",
    parseAsBoolean.withDefault(false),
  );

  return (
    <Button
      variant="secondary"
      onClick={() => setSelectProfileQuery(!selectProfileQuery)}
    >
      {!selectProfileQuery ? <ArrowUpRight /> : <X />}
    </Button>
  );
}
