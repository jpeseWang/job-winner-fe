"use client";

import useSWR from "swr";
import { useState } from "react";
import { CheckCircle, Clock, Send } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ContactManagementPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("-createdAt");

  const query = new URLSearchParams({
    search,
    status: statusFilter,
    sort,
  }).toString();
  const { data, mutate } = useSWR(`/api/contact?${query}`, fetcher);

  const [replyMap, setReplyMap] = useState<Record<string, string>>({});

  const handleReply = async (id: string) => {
    const message = replyMap[id]?.trim();
    if (!message) return;
    await fetch(`/api/contact/${id}/reply`, {
      method: "PUT",
      body: JSON.stringify({ replyMessage: message }),
      headers: { "Content-Type": "application/json" },
    });
    mutate();
    setReplyMap({ ...replyMap, [id]: "" });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Contacts</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border rounded px-3 py-1"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="">All</option>
          <option value="replied">Replied</option>
          <option value="pending">Not Replied</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="-createdAt">Newest</option>
          <option value="createdAt">Oldest</option>
        </select>
      </div>

      <div className="grid gap-4">
        {data?.map((contact: any) => (
          <div key={contact._id} className="border p-4 rounded bg-white shadow">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{contact.email}</span>
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-white text-xs ${
                  contact.replied ? "bg-green-500" : "bg-yellow-500"
                }`}
              >
                {contact.replied ? " Replied" : " Pending"}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Sent at: {new Date(contact.createdAt).toLocaleString()}
            </p>
            <p className="font-semibold text-base mt-2">{contact.fullName}</p>
            <p className="text-gray-700 mt-1 whitespace-pre-line">
              {contact.message}
            </p>

            {contact.replied && contact.replies?.length > 0 && (
              <div className="mt-3 bg-gray-50 border rounded p-3 text-sm">
                <p className="text-gray-500 font-medium mb-1">Reply History:</p>
                {contact.replies.map((r: any, idx: number) => (
                  <p key={idx} className="text-gray-800">
                    • {r.message}
                  </p>
                ))}
              </div>
            )}

            {/* Chỉ hiển thị form trả lời nếu chưa reply */}
            {!contact.replied && (
              <div className="mt-3 flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Enter message..."
                  value={replyMap[contact._id] || ""}
                  onChange={(e) =>
                    setReplyMap({ ...replyMap, [contact._id]: e.target.value })
                  }
                  className="border rounded px-3 py-1 w-full"
                />
                <button
                  onClick={() => handleReply(contact._id)}
                  className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
