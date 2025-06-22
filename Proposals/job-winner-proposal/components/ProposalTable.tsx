import { Proposal } from "@/types/proposal";
import StatusTag from "./StatusTag";
import { FaEdit, FaTrash } from "react-icons/fa";
import formatCurrency from "@/utils/formatCurrency";
import formatDate from "@/utils/formatDate";

export default function ProposalTable({
  proposals,
  onEdit,
  onDelete,
}: {
  proposals: Proposal[];
  onEdit: (p: Proposal) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <table className="w-full mt-5 rounded-2xl overflow-hidden shadow-sm text-sm">
      <thead>
        <tr className="bg-gray-100 font-semibold text-gray-900">
          <th className="py-3 px-4 text-left">Application ID</th>
          <th className="py-3 px-4 text-left">Job Title</th>
          <th className="py-3 px-4 text-left">Company</th>
          <th className="py-3 px-4 text-center">Applied Date</th>
          <th className="py-3 px-4 text-center">Offered</th>
          <th className="py-3 px-4 text-center">Job Type</th>
          <th className="py-3 px-4 text-center">Status</th>
          <th className="py-3 px-4 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {proposals.map((p, idx) => (
          <tr
            key={p._id}
            className={
              idx % 2 === 0
                ? "bg-gray-50 hover:bg-gray-100"
                : "bg-white hover:bg-gray-100"
            }
          >
            <td className="py-2 px-4 text-left font-medium">#{p.applicationId}</td>
            <td className="py-2 px-4 text-left">{p.jobTitle}</td>
            <td className="py-2 px-4 text-left">{p.company}</td>
            <td className="py-2 px-4 text-center">{formatDate(p.appliedDate)}</td>
            <td className="py-2 px-4 text-center">{formatCurrency(p.offered)}</td>
            <td className="py-2 px-4 text-center">{p.jobType}</td>
            <td className="py-2 px-4 text-center"><StatusTag status={p.status} /></td>
            <td className="py-2 px-4 text-center">
              <button
                className="text-indigo-600 hover:text-indigo-900 mr-3"
                onClick={() => onEdit(p)}
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                className="text-red-600 hover:text-red-900"
                onClick={() => onDelete(p._id!)}
                title="Delete"
              >
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
