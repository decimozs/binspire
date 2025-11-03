import { Button } from "@binspire/ui/components/button";
import { useLocation } from "@tanstack/react-router";
import { parseAsString, useQueryState } from "nuqs";

export default function LeaderboardsButton() {
  const location = useLocation();
  const [leaderboards, setLeaderboards] = useQueryState(
    "most_performant",
    parseAsString.withDefault("top_admins"),
  );

  if (location.pathname !== "/leaderboards") return null;

  const handleSetLeaderboard = (type: string) => {
    setLeaderboards(type);
  };

  return (
    <div className="flex flex-row gap-2">
      <Button
        variant={leaderboards === "top_admins" ? "default" : "outline"}
        size="sm"
        onClick={() => handleSetLeaderboard("top_admins")}
      >
        Top Admin
      </Button>
      <Button
        variant={leaderboards === "top_maintenance" ? "default" : "outline"}
        size="sm"
        onClick={() => handleSetLeaderboard("top_maintenance")}
      >
        Top Maintenace
      </Button>
      <Button
        variant={leaderboards === "top_green_hearts" ? "default" : "outline"}
        size="sm"
        onClick={() => handleSetLeaderboard("top_green_hearts")}
      >
        Top Green Hearts
      </Button>
    </div>
  );
}
