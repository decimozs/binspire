import { Link } from "@tanstack/react-router";
import { Gift } from "lucide-react";
import SettingsItem from "@/features/settings/components/settings-item";

export default function CheckRewards() {
  return (
    <div className="grid grid-cols-1 gap-4">
      <p className="text-2xl font-bold">Rewards</p>
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
