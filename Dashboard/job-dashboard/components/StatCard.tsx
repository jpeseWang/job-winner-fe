type StatCardProps = {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  highlight?: boolean;
};
export default function StatCard({ icon, value, label, highlight }: StatCardProps) {
  return (
    <div className={`flex flex-col items-center bg-white rounded-2xl shadow-xl p-7 min-w-[170px] ${highlight ? 'bg-[#EBFFAD]' : ''}`}>
      <div className="mb-2 text-3xl">{icon}</div>
      <div className="text-3xl font-extrabold mb-1">{value}</div>
      <div className="text-gray-500 font-medium">{label}</div>
    </div>
  );
}
