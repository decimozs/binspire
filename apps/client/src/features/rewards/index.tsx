import { type UserGreenHeart, UserGreenHeartApi } from "@binspire/query";
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { ShowToast } from "@/components/toast";
import RewardCard from "./components/reward-card";
import { REWARDS } from "./lib/constants";

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

  const handleRedeem = async (id: string) => {
    const reward = REWARDS.find((r) => r.id === id);

    if (!reward) return ShowToast("error", "Reward not found.");

    try {
      await UserGreenHeartApi.update(data.user.id, {
        points: currentPoints - reward.requiredPoints,
      });

      setRedeemed((prev) => {
        const updated = [...prev, id];
        localStorage.setItem("greenhearts_rewards", JSON.stringify(updated));
        return updated;
      });

      ShowToast("success", "Reward redeemed successfully!");
    } catch (error) {
      const err = error as Error;
      ShowToast(
        "error",
        err.message || "An error occurred while redeeming the reward.",
      );
    }
  };

  return (
    <MainLayout>
      <div className="grid grid-rows-1 gap-4 font-bold">
        <div className="font-bold text-2xl flex flex-row items-center justify-between rounded-full border-accent border-[1px] py-4 px-6">
          <p>Green Hearts</p>
          <p className="text-primary">+ {currentPoints}</p>
        </div>
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
