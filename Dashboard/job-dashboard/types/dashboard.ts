export interface DashboardStats {
  totalVisitor: number;
  shortlisted: number;
  views: number;
  appliedJob: number;
}
export interface JobViewData {
  day: string;
  count: number;
}
export interface JobItem {
  id: string;
  title: string;
  type: string;
  location: string;
  tag: string;
}
