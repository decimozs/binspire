import { type UserGreenHeart, UserGreenHeartApi } from "@binspire/query";
import { useEffect, useState } from "react";
import { ShowToast } from "@/components/core/toast-notification";
import MainLayout from "@/components/layout/main-layout";
import { REWARDS } from "../settings/lib/constants";
import RewardCard from "./components/reward-card";

function getRedeemedRewards(): string[] {
  const stored = localStorage.getItem("greenhearts_rewards");
  return stored ? JSON.parse(stored) : [];
}

export default function Rewards({ data }: { data: UserGreenHeart }) {
  const currentPoints = data?.points ?? 0;
  const [redeemed, setRedeemed] = useState<string[]>([]);
  const [points, setPoints] = useState<number>(currentPoints);

  useEffect(() => {
    setRedeemed(getRedeemedRewards());
  }, []);

  const handleRedeem = async (id: string) => {
    const reward = REWARDS.find((r) => r.id === id);
    if (!reward) return;

    if (points < reward.requiredPoints) {
      ShowToast("error", "Not enough points to redeem this reward.");
      return;
    }

    try {
      await UserGreenHeartApi.update(data.user.id, {
        points: points - reward.requiredPoints,
      });

      setRedeemed((prev) => {
        const updated = [...prev, id];
        localStorage.setItem("greenhearts_rewards", JSON.stringify(updated));
        return updated;
      });

      setPoints((prev) => prev - reward.requiredPoints);

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
    <MainLayout
      title="Rewards"
      description="Discover and redeem your rewards here."
    >
      <div className="grid grid-rows-1 gap-4 font-bold">
        <div className="font-bold text-2xl mt-2 flex flex-row items-center justify-between rounded-full border-accent border-[1px] py-4 px-6">
          <p>Green Hearts</p>
          <p className="text-primary">+ {points}</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {REWARDS.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              isRedeemed={redeemed.includes(reward.id)}
              isAvailable={points >= reward.requiredPoints}
              onRedeem={handleRedeem}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
