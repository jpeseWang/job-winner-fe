"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { JobViewData } from "@/types/dashboard";

type Props = { data: JobViewData[] };

export default function JobViewChart({ data }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl flex-1 min-w-[400px]">
      <h2 className="font-semibold mb-4">Job Views</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#7DBA29" strokeWidth={3} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
