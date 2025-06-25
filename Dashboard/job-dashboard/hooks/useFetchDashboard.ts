"use client";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/services/dashboardService";
import { DashboardStats, JobViewData, JobItem } from "@/types/dashboard";

export default function useFetchDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [jobViews, setJobViews] = useState<JobViewData[]>([]);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(data => {
      setStats(data.stats);
      setJobViews(data.jobViews);
      setJobs(data.jobs);
      setLoading(false);
    });
  }, []);

  return { stats, jobViews, jobs, loading };
}
