import { HiMagnifyingGlass } from "react-icons/hi2";

export default function SearchBar() {
  return (
    <div className="flex items-center bg-gray-100 rounded-full px-5 py-2 w-96 shadow">
      <HiMagnifyingGlass className="text-gray-400 mr-2" size={22} />
      <input className="bg-transparent outline-none flex-1" placeholder="Search here.." />
    </div>
  );
}
