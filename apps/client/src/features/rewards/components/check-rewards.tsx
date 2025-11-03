import SettingsItem from "@/features/settings/components/settings-item";
import { Link } from "@tanstack/react-router";
import { Gift } from "lucide-react";

export default function CheckRewards() {
  return (
    <div className="grid grid-cols-1 gap-4">
      <p className="text-xl font-medium">Rewards</p>
      <Link to="/rewards">
        <SettingsItem
          label="Gifts"
          description="Check your redeemed rewards and gifts."
          icon={Gift}
        />
      </Link>
    </div>
  );
}
