import type { User, UserGreenHeart } from "@binspire/query";
import type { UserRole } from "@binspire/shared";
import { UserRoleBadge } from "@binspire/ui/badges";
import type { ColumnDef } from "@tanstack/react-table";
import RankedName from "./ranked-name";

export const leaderboardColumns: ColumnDef<User>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "role",
    accessorFn: (row) => row.status.role,
    header: () => <p>Role</p>,
    cell: ({ getValue }) => (
      <UserRoleBadge role={getValue<string>() as UserRole} />
    ),
    filterFn: "arrIncludesSome",
  },
];

export const topAdminsColumns: ColumnDef<
  User & { contributionCounts: number }
>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: ({ row, table }) => (
      <RankedName
        name={row.getValue("name")}
        rowId={row.id}
        rows={table.getFilteredRowModel().rows.map((r) => ({
          id: r.id,
          collectionCount: r.original.contributionCounts,
        }))}
      />
    ),
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "role",
    accessorFn: (row) => row.status.role,
    header: () => <p>Role</p>,
    cell: ({ getValue }) => (
      <UserRoleBadge role={getValue<string>() as UserRole} />
    ),
    filterFn: "arrIncludesSome",
  },
  {
    id: "contributionCounts",
    accessorKey: "contributionCounts",
    header: () => <p className="text-center">Contributions</p>,
    cell: ({ row }) => (
      <p className="text-center font-bold text-primary text-lg">
        + {row.getValue("contributionCounts")}
      </p>
    ),
  },
];

export const topMaintenanceColumns: ColumnDef<
  User & { collectionCount: number }
>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: ({ row, table }) => (
      <RankedName
        name={row.getValue("name")}
        rowId={row.id}
        rows={table.getFilteredRowModel().rows.map((r) => ({
          id: r.id,
          collectionCount: r.original.collectionCount,
        }))}
      />
    ),
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "role",
    accessorFn: (row) => row.status.role,
    header: () => <p>Role</p>,
    cell: ({ getValue }) => (
      <UserRoleBadge role={getValue<string>() as UserRole} />
    ),
    filterFn: "arrIncludesSome",
  },
  {
    id: "collectionCount",
    accessorKey: "collectionCount",
    header: () => <p className="text-center">Collections</p>,
    cell: ({ row }) => (
      <p className="text-center font-bold text-primary text-lg">
        + {row.getValue("collectionCount")}
      </p>
    ),
  },
];

export const topGreenHeartDonatorColumns: ColumnDef<UserGreenHeart>[] = [
  {
    id: "user",
    accessorFn: (row) => row.user.name,
    header: () => <p>Name</p>,
    cell: ({ row, table }) => (
      <RankedName
        name={row.original.user.name}
        rowId={row.id}
        rows={table.getFilteredRowModel().rows.map((r) => ({
          id: r.id,
          collectionCount: r.original.points,
        }))}
      />
    ),
  },
  {
    id: "totalKg",
    accessorKey: "totalKg",
    header: () => <p className="text-center">Total KG</p>,
    cell: ({ row }) => (
      <p className="text-center font-bold text-primary text-lg">
        {row.getValue("totalKg")}
      </p>
    ),
  },
  {
    id: "points",
    accessorKey: "points",
    header: () => <p className="text-center">Points</p>,
    cell: ({ row }) => (
      <p className="text-center font-bold text-primary text-lg">
        + {row.getValue("points")}
      </p>
    ),
  },
];
