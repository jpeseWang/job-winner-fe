import { JobItem } from "@/types/dashboard";
import { HiOutlineClock, HiOutlineCurrencyDollar, HiOutlineCodeBracket } from "react-icons/hi2";

type Props = { jobs: JobItem[] };

export default function JobList({ jobs }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl flex-1 min-w-[320px]">
      <h2 className="font-semibold mb-4">Posted Job</h2>
      <ul>
        {jobs.map((job, i) => (
          <li key={job.id} className="flex items-center gap-4 py-3 border-b last:border-b-0">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-xl">
              {job.tag === 'Fulltime' && <HiOutlineClock className="text-purple-600" />}
              {job.tag === 'Part time' && <HiOutlineCodeBracket className="text-green-600" />}
              {job.tag === 'Fixed-Price' && <HiOutlineCurrencyDollar className="text-orange-600" />}
            </div>
            <div className="flex flex-col">
              <span className="font-medium">{job.title}</span>
              <span className="text-sm text-gray-500">{job.type} . {job.location}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
