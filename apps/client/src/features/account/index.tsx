import MainLayout from "@/components/layout/main-layout";
import AccountDetails from "./components/account-details";
import LogoutButton from "./components/logout-button";
import { Separator } from "@binspire/ui/components/separator";
import Settings from "../settings";
import CheckRewards from "../rewards/components/check-rewards";
import ReportIssue from "../report-issue";

export default function Account() {
  return (
    <MainLayout>
      <AccountDetails />
      <Separator />
      <CheckRewards />
      <Separator />
      <Settings />
      <Separator />
      <ReportIssue
        settings={true}
        entity="issueManagement"
        label="Report Issue"
      />
      <Separator />
      <LogoutButton />
    </MainLayout>
  );
}
