import { useState } from "react";
import { Button } from "@binspire/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@binspire/ui/components/dialog";
import { format } from "date-fns";
import { generateRandomCode } from "@/lib/utils";
import type { RewardItem } from "../lib/types";
import { useSession } from "@/features/auth";
import { ShowToast } from "@/components/toast";

function getRedeemedRewards(): string[] {
  const stored = localStorage.getItem("greenhearts_rewards");
  return stored ? JSON.parse(stored) : [];
}

function saveRedeemedReward(id: string) {
  const current = getRedeemedRewards();
  const updated = Array.from(new Set([...current, id]));
  localStorage.setItem("greenhearts_rewards", JSON.stringify(updated));
}

interface Props {
  data: RewardItem;
  isRedeemed: boolean;
  isAvailable: boolean;
  onRedeem: (id: string) => void;
}

export default function RedeemReward({
  data,
  isRedeemed,
  isAvailable,
  onRedeem,
}: Props) {
  const [open, setOpen] = useState(false);
  const { data: current } = useSession();

  const handleConfirmRedeem = () => {
    saveRedeemedReward(data.id);
    onRedeem(data.id);
    setOpen(false);
    ShowToast("success", "Reward redeemed successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="text-lg font-bold w-full"
          disabled={!isAvailable || isRedeemed}
          onClick={() => {
            if (isAvailable && !isRedeemed) setOpen(true);
          }}
        >
          {isRedeemed ? "Redeemed" : !isAvailable ? "Not available" : "Redeem"}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Redemption</DialogTitle>
          <DialogDescription>
            You are about to redeem <strong>{data.title}</strong> for{" "}
            {data.requiredPoints} GreenHearts.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-white rounded-md p-4 text-black">
          <div className="flex flex-row items-center justify-between">
            <p className="font-bold">{data.title}</p>
            <img src="/favicon.ico" alt="Binspire" className="rounded-md" />
          </div>
          <p>Code: {generateRandomCode(10)}</p>
          <div className="mt-4">
            <p>Redeemed by: {current?.user.name}</p>
            <p>Redeemed at: {format(new Date(), "MMMM d, yyyy - h:mm a")}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} size="sm">
            Cancel
          </Button>
          <Button onClick={handleConfirmRedeem} size="sm">
            Claim
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
