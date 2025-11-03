interface RankedNameProps {
  name: string;
  rowId: string;
  rows: { id: string; collectionCount: number }[];
}

export default function RankedName({ name, rowId, rows }: RankedNameProps) {
  const sortedRows = rows
    .slice()
    .sort((a, b) => (b.collectionCount ?? 0) - (a.collectionCount ?? 0));

  const rank = sortedRows.findIndex((r) => r.id === rowId) + 1;

  const rankColor =
    rank === 1
      ? "yellow-badge"
      : rank === 2
        ? "silver-badge"
        : rank === 3
          ? "bronze-badge"
          : rank <= 3
            ? `${rank}`
            : "";

  return (
    <div className="flex items-center gap-2">
      {rank <= 3 && (
        <span
          className={`font-bold flex items-center gap-1 text-xs ${rankColor} px-3 py-1 rounded-md w-fit`}
        >
          {rank}
        </span>
      )}
      <span>{name}</span>
    </div>
  );
}
