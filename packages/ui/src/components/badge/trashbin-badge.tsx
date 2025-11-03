import { TRASHBIN_CONFIG, WASTE_TYPE_CONFIG } from "@binspire/shared";

type TrashbinCategory = keyof typeof TRASHBIN_CONFIG;

interface TrashbinStatusBadgeProps {
  type: TrashbinCategory;
  level: number;
}

export function TrashbinStatusBadge({ type, level }: TrashbinStatusBadgeProps) {
  const states = TRASHBIN_CONFIG[type];
  const stateEntries = Object.entries(states);

  const matchedState = stateEntries
    .sort((a, b) => b[1].value - a[1].value)
    .find(([, config]) => level >= config.value);

  const label = matchedState ? matchedState[0] : "unknown";
  const style = matchedState
    ? matchedState[1].style
    : "bg-gray-500/10 text-gray-500";

  return (
    <div className={`text-xs ${style} px-3 py-1 rounded-md`}>
      <p className="capitalize">{label.replace("-", " ")}</p>
    </div>
  );
}

type TrashbinWasteType = keyof typeof WASTE_TYPE_CONFIG;

export function TrashbinWasteTypeBadge({ type }: { type: TrashbinWasteType }) {
  const state = WASTE_TYPE_CONFIG[type];

  return (
    <div className={`text-xs ${state.style} px-3 py-1 rounded-md w-fit`}>
      <p className="capitalize">{state.label}</p>
    </div>
  );
}
