import type { RewardItem } from "./types";

export const REWARDS: RewardItem[] = [
  {
    id: "landers-100",
    title: "₱100 Landers Superstore Voucher",
    description:
      "Treat yourself while helping the planet! Redeem ₱100 worth of groceries, snacks, or essentials at Landers Superstore.",
    details: [
      "Redeemable at any Landers branch or online.",
      "Valid for 3 months from redemption date.",
      "Redeem 800 GreenHearts to claim.",
    ],
    requiredPoints: 100,
  },
  {
    id: "landers-eco-tote",
    title: "Eco-Friendly Shopping Tote",
    description:
      "Ditch the plastic — go reusable! A stylish Landers-branded eco tote made from recycled materials.",
    details: [
      "Redeem 800 GreenHearts to claim.",
      "Available in limited colors.",
      "Pick up in-store or have it delivered with your next Landers order.",
    ],
    requiredPoints: 800,
  },
  {
    id: "landers-500-bundle",
    title: "₱500 Grocery Bundle (Sustainable Picks)",
    description: "A curated pack of eco-friendly or organic grocery products.",
    details: [
      "Includes reusable straws, organic snacks, and biodegradable kitchen essentials.",
      "Exclusive to GreenHearts users.",
      "Redeemable with 2000 GreenHearts.",
    ],
    requiredPoints: 2000,
  },
];
