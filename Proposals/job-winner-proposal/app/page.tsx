"use client";
import { useState } from "react";
import { Proposal } from "@/types/proposal";
import ProposalTable from "@/components/ProposalTable";
import Pagination from "@/components/Pagination";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TabMenu from "@/components/TabMenu";

// ==== Dữ liệu mẫu để demo UI ====
const SAMPLE_DATA: Proposal[] = [
  {
    _id: "1",
    applicationId: "20462",
    jobTitle: "Frontend Developer",
    company: "Google",
    appliedDate: "2025-05-13",
    offered: 80000,
    jobType: "Tranfer Bank",
    status: "Interviewing",
  },
  {
    _id: "2",
    applicationId: "18933",
    jobTitle: "Backend Developer",
    company: "Wiktoria",
    appliedDate: "2022-05-22",
    offered: 90000,
    jobType: "Cash on Delivery",
    status: "Accepted",
  },
  {
    _id: "3",
    applicationId: "45169",
    jobTitle: "Data Analyst",
    company: "Trixie Byrd",
    appliedDate: "2022-06-15",
    offered: 1149.95,
    jobType: "Cash on Delivery",
    status: "Process",
  },
  {
    _id: "4",
    applicationId: "34304",
    jobTitle: "Developer",
    company: "Brad Mason",
    appliedDate: "2022-09-06",
    offered: 899.95,
    jobType: "Tranfer Bank",
    status: "Process",
  },
  {
    _id: "5",
    applicationId: "17188",
    jobTitle: "UI/UX Designer",
    company: "Sanderson",
    appliedDate: "2022-09-25",
    offered: 22.95,
    jobType: "Cash on Delivery",
    status: "Rejected",
  },
  {
    _id: "6",
    applicationId: "73003",
    jobTitle: "Developer",
    company: "Jun Redfern",
    appliedDate: "2022-10-04",
    offered: 54.95,
    jobType: "Tranfer Bank",
    status: "Accepted",
  },
  {
    _id: "7",
    applicationId: "58825",
    jobTitle: "Developer",
    company: "Miriam Kidd",
    appliedDate: "2022-10-17",
    offered: 174.95,
    jobType: "Tranfer Bank",
    status: "Accepted",
  },
  {
    _id: "8",
    applicationId: "44122",
    jobTitle: "UI/UX Designer",
    company: "Dominic",
    appliedDate: "2022-10-24",
    offered: 249.95,
    jobType: "Cash on Delivery",
    status: "Accepted",
  },
  {
    _id: "9",
    applicationId: "89094",
    jobTitle: "DevOps Engineer",
    company: "Shanice",
    appliedDate: "2022-11-01",
    offered: 899.95,
    jobType: "Tranfer Bank",
    status: "Canceled",
  },
  {
    _id: "10",
    applicationId: "85252",
    jobTitle: "DevOps Engineer",
    company: "Poppy-Rose",
    appliedDate: "2022-11-22",
    offered: 6.948,
    jobType: "Tranfer Bank",
    status: "Process",
  },
];

export default function ProposalPage() {
  const [proposals, setProposals] = useState<Proposal[]>(SAMPLE_DATA);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Lọc search (demo)
  const filteredProposals = proposals.filter(
    (p) =>
      p.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      p.company.toLowerCase().includes(search.toLowerCase()) ||
      p.applicationId.includes(search)
  );

  // Phân trang (demo)
  const pageCount = Math.ceil(filteredProposals.length / pageSize);
  const currentPageData = filteredProposals.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Xoá (demo)
  const handleDelete = (id: string) => {
    setProposals((prev) => prev.filter((p) => p._id !== id));
  };

  // Edit (demo)
  const handleEdit = (proposal: Proposal) => {
    alert("Bạn bấm sửa proposal: " + proposal.applicationId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="container mx-auto flex-1 px-6 pt-12">
        <TabMenu />
        <div className="flex mb-3 justify-between items-center mt-6">
          <div>
            <input
              className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search..."
              style={{ width: 230 }}
            />
          </div>
          <button
            className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg font-medium transition"
          >
            + Add Application
          </button>
        </div>

        <div className="rounded-2xl shadow-md overflow-hidden bg-white">
          <ProposalTable
            proposals={currentPageData}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
        <Pagination
          page={page}
          total={filteredProposals.length}
          pageSize={pageSize}
          onChange={setPage}
        />
      </main>
      <Footer />
    </div>
  );
}
