import MainLayout from "@/components/layout/main-layout";
import AccountDetails from "./components/account-details";
import LogoutButton from "./components/logout-button";
import { Separator } from "@binspire/ui/components/separator";
import Settings from "../settings";
import CheckRewards from "../rewards/components/check-rewards";

export default function Account() {
  return (
    <MainLayout>
      <AccountDetails />
      <Separator />
      <CheckRewards />
      <Separator />
      <Settings />
      <Separator />
      <LogoutButton />
    </MainLayout>
  );
}
