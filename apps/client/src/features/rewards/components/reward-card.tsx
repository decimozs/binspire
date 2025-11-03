import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@binspire/ui/components/card";
import type { RewardItem } from "../lib/types";
import RedeemReward from "./redeem-reward";

interface Props {
  reward: RewardItem;
  isRedeemed: boolean;
  isAvailable: boolean;
  onRedeem: (id: string) => void;
}

export default function RewardCard({
  reward,
  isRedeemed,
  isAvailable,
  onRedeem,
}: Props) {
  return (
    <Card key={reward.id}>
      <CardHeader>
        <CardTitle>{reward.title}</CardTitle>
        <CardDescription>{reward.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {reward.details.map((item, index) => (
          <p key={index}>- {item}</p>
        ))}
      </CardContent>
      <CardFooter className="mt-auto">
        <RedeemReward
          data={reward}
          isRedeemed={isRedeemed}
          isAvailable={isAvailable}
          onRedeem={onRedeem}
        />
      </CardFooter>
    </Card>
  );
}
