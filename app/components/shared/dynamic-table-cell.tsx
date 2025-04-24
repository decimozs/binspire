import { CircleCheck, CircleX, Timer } from "lucide-react";

export default function RequestStatus({ status }: { status: string }) {
  return (
    <span className="border-input border-[1px] rounded-sm p-1 px-2 font-medium text-[0.8rem] capitalize flex flex-row gap-1 items-center w-fit">
      {status === "pending" && <Timer size={15} className="mb-0.5" />}
      {status === "rejected" && <CircleX size={15} className="mb-0.5" />}
      {status === "approved" && <CircleCheck size={15} className="mb-0.5" />}
      {status}
    </span>
  );
}
