"use client";
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import SearchBar from '@/components/SearchBar';
import JobViewChart from '@/components/JobViewChart';
import JobList from '@/components/JobList';
import Footer from '@/components/Footer';
import useFetchDashboard from '@/hooks/useFetchDashboard';
import { HiOutlineUser, HiOutlineBookmark, HiOutlineEye, HiOutlinePencil } from "react-icons/hi2";

export default function DashboardPage() {
  const { stats, jobViews, jobs, loading } = useFetchDashboard();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F9]">
      <Header />
      <div className="flex flex-1 w-full max-w-7xl mx-auto gap-8 py-10">
        <Sidebar />
        <main className="flex-1 flex flex-col gap-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <div className="flex gap-4">
              <SearchBar />
              <button className="bg-[#214A36] text-white px-6 py-2 rounded-full font-semibold shadow hover:brightness-110 transition">Post a Job</button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-6">
            <StatCard icon={<HiOutlineUser className="text-[#D3FF62]" size={32} />} value={stats?.totalVisitor || 0} label="Total Visitor" highlight />
            <StatCard icon={<HiOutlineBookmark className="text-[#D3FF62]" size={32} />} value={stats?.shortlisted || 0} label="Shortlisted" highlight />
            <StatCard icon={<HiOutlineEye className="text-[#D3FF62]" size={32} />} value={stats?.views || 0} label="Views" highlight />
            <StatCard icon={<HiOutlinePencil className="text-[#D3FF62]" size={32} />} value={stats?.appliedJob || 0} label="Applied Job" highlight />
          </div>
          <div className="flex gap-6">
            <JobViewChart data={jobViews} />
            <JobList jobs={jobs} />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
