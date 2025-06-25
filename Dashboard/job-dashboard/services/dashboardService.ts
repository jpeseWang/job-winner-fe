import axiosInstance from "./axiosInstance";
export const getDashboardStats = async () => {
  const res = await axiosInstance.get('/api/dashboard');
  return res.data;
};
