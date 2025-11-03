import MainLayout from "@/components/layout/main-layout";
import MetricCard from "./components/metric-card";
import {
  Database,
  Info,
  ShieldQuestionMark,
  UserRound,
  Trash,
  Mail,
  ClipboardList,
  History as HistoryIcon,
} from "lucide-react";
import GlobalMap from "../map/components/global-map";
import type {
  Audit,
  Issue,
  Trashbin,
  User,
  UserInvitation,
  UserRequest,
  History,
  TrashbinCollections,
} from "@binspire/query";

interface DashboardData {
  users: User[];
  collections: TrashbinCollections[];
  issues: Issue[];
  audits: Audit[];
  trashbins: Trashbin[];
  invitations: UserInvitation[];
  requests: UserRequest[];
  history: History[];
}

interface Props {
  data: DashboardData;
}

export default function Dashboard({ data }: Props) {
  const {
    users,
    collections,
    issues,
    audits,
    trashbins,
    invitations,
    requests,
    history,
  } = data;

  const calculateChange = (current: number, previous: number) => {
    const absolute = current - previous;
    const percent = previous ? ((absolute / previous) * 100).toFixed(1) : "0.0";
    return { absolute, percent };
  };

  const formatNumber = (num: number) => (num / 100).toFixed(1);

  const isLastMonth = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
    return (
      date.getMonth() === lastMonth.getMonth() &&
      date.getFullYear() === lastMonth.getFullYear()
    );
  };

  const usersLastMonth =
    users?.filter((u) => isLastMonth(u.createdAt)).length ?? 0;
  const { absolute: usersChange, percent: usersPercent } = calculateChange(
    users?.length ?? 0,
    usersLastMonth,
  );

  const collectionsLastMonth =
    collections?.filter((c) => isLastMonth(c.createdAt)).length ?? 0;
  const { absolute: collectionsChange, percent: collectionsPercent } =
    calculateChange(collections?.length ?? 0, collectionsLastMonth);

  const issuesLastMonth =
    issues?.filter((i) => isLastMonth(i.createdAt)).length ?? 0;
  const { absolute: issuesChange, percent: issuesPercent } = calculateChange(
    issues?.length ?? 0,
    issuesLastMonth,
  );

  const auditsLastMonth =
    audits?.filter((a) => isLastMonth(a.createdAt)).length ?? 0;
  const { absolute: auditsChange, percent: auditsPercent } = calculateChange(
    audits?.length ?? 0,
    auditsLastMonth,
  );

  const trashbinsLastMonth =
    trashbins?.filter((t) => isLastMonth(t.createdAt)).length ?? 0;
  const { absolute: trashbinsChange, percent: trashbinsPercent } =
    calculateChange(trashbins?.length ?? 0, trashbinsLastMonth);

  const invitationsLastMonth =
    invitations?.filter((i) => isLastMonth(i.createdAt)).length ?? 0;
  const { absolute: invitationsChange, percent: invitationsPercent } =
    calculateChange(invitations?.length ?? 0, invitationsLastMonth);

  const requestsLastMonth =
    requests?.filter((r) => isLastMonth(r.createdAt)).length ?? 0;
  const { absolute: requestsChange, percent: requestsPercent } =
    calculateChange(requests?.length ?? 0, requestsLastMonth);

  const historyLastMonth =
    history?.filter((h) => isLastMonth(h.createdAt)).length ?? 0;
  const { absolute: historyChange, percent: historyPercent } = calculateChange(
    history?.length ?? 0,
    historyLastMonth,
  );

  return (
    <MainLayout
      title="Dashboard"
      description="Overview of key metrics and recent activities."
    >
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Registered Users"
          description={`${formatNumber(Number(usersPercent))}% from last month`}
          label={`+${formatNumber(usersChange)}`}
          icon={UserRound}
          analyticsLink="/analytics/users"
        />
        <MetricCard
          title="Trash Bin Collections"
          description={`${formatNumber(Number(collectionsPercent))}% from last month`}
          label={`+${formatNumber(collectionsChange)}`}
          icon={Database}
          analyticsLink="/analytics"
        />
        <MetricCard
          title="Reported Issues"
          description={`${formatNumber(Number(issuesPercent))}% from last month`}
          label={`+${formatNumber(issuesChange)}`}
          icon={Info}
          analyticsLink="/analytics/issues"
        />
        <MetricCard
          title="Audit Activities"
          description={`${formatNumber(Number(auditsPercent))}% from last month`}
          label={`+${formatNumber(auditsChange)}`}
          icon={ShieldQuestionMark}
          analyticsLink="/analytics/audits"
        />
        <MetricCard
          title="Trashbins"
          description={`${formatNumber(Number(trashbinsPercent))}% from last month`}
          label={`+${formatNumber(trashbinsChange)}`}
          icon={Trash}
          analyticsLink="/analytics/trashbins"
        />
        <MetricCard
          title="Invitations"
          description={`${formatNumber(Number(invitationsPercent))}% from last month`}
          label={`+${formatNumber(invitationsChange)}`}
          icon={Mail}
          analyticsLink="/analytics/invitations"
        />
        <MetricCard
          title="Requests"
          description={`${formatNumber(Number(requestsPercent))}% from last month`}
          label={`+${formatNumber(requestsChange)}`}
          icon={ClipboardList}
          analyticsLink="/analytics/requests"
        />
        <MetricCard
          title="Histories"
          description={`${formatNumber(Number(historyPercent))}% from last month`}
          label={`+${formatNumber(historyChange)}`}
          icon={HistoryIcon}
          analyticsLink="/analytics/history"
        />
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <p className="text-3xl font-semibold">Live map</p>
          <p className="text-muted-foreground">View current live map</p>
        </div>
        <div className="w-full h-[650px]">
          <GlobalMap isFullScreen={false} />
        </div>
      </div>
    </MainLayout>
  );
}
