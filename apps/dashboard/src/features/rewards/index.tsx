import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import type { UserGreenHeart } from "@binspire/query";
import { REWARDS } from "../settings/lib/constants";
import RewardCard from "./components/reward-card";

function getRedeemedRewards(): string[] {
  const stored = localStorage.getItem("greenhearts_rewards");
  return stored ? JSON.parse(stored) : [];
}

export default function Rewards({ data }: { data: UserGreenHeart }) {
  const currentPoints = data?.points ?? 0;
  const [redeemed, setRedeemed] = useState<string[]>([]);

  useEffect(() => {
    setRedeemed(getRedeemedRewards());
  }, []);

  const handleRedeem = (id: string) => {
    setRedeemed((prev) => [...prev, id]);
  };

  return (
    <MainLayout
      title="Rewards"
      description="Discover and redeem your rewards here."
    >
      <div className="grid grid-cols-3 gap-4">
        {REWARDS.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            isRedeemed={redeemed.includes(reward.id)}
            isAvailable={currentPoints >= reward.requiredPoints}
            onRedeem={handleRedeem}
          />
        ))}
      </div>
    </MainLayout>
  );
}
