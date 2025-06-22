import { ProposalStatus } from "@/types/enums";
import clsx from "clsx";
const statusColors: Record<ProposalStatus, string> = {
  Interviewing: "bg-blue-100 text-blue-700",
  Accepted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Process: "bg-orange-100 text-orange-700",
  Canceled: "bg-red-100 text-red-700",
};
export default function StatusTag({ status }: { status: ProposalStatus }) {
  return (
    <span className={clsx(
      "rounded-lg px-3 py-1 text-sm font-semibold",
      statusColors[status] || "bg-gray-100 text-gray-800"
    )}>
      {status}
    </span>
  );
}
