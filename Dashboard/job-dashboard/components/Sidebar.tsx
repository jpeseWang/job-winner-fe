import { HiOutlineUser, HiOutlineBookmark, HiOutlineEye, HiOutlinePencil, HiOutlineHome, HiOutlineDocumentText, HiOutlineChatBubbleBottomCenterText, HiOutlinePlus, HiOutlineStar, HiOutlineCog6Tooth } from "react-icons/hi2";

export default function Sidebar() {
  return (
    <aside className="bg-white px-4 pt-6 rounded-2xl shadow-lg min-h-[88vh] w-64">
      <div className="flex flex-col items-center mb-8">
        <img src="/avatar.png" className="w-16 h-16 rounded-full mb-2 object-cover" alt="avatar"/>
        <span className="font-semibold text-lg">John Doe</span>
        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mt-1" />
      </div>
      <nav className="flex flex-col gap-1">
        {[
          { label: "Dashboard", icon: <HiOutlineHome size={20}/> },
          { label: "Company Profile", icon: <HiOutlineUser size={20}/> },
          { label: "My Jobs", icon: <HiOutlineDocumentText size={20}/> },
          { label: "Messages", icon: <HiOutlineChatBubbleBottomCenterText size={20}/> },
          { label: "Submit Job", icon: <HiOutlinePlus size={20}/> },
          { label: "Saved Candidate", icon: <HiOutlineStar size={20}/> },
          { label: "Account Settings", icon: <HiOutlineCog6Tooth size={20}/> }
        ].map((item, i) => (
          <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-1 font-medium hover:bg-gray-100 cursor-pointer transition ${i === 0 ? 'bg-[#214A36] text-white' : 'text-gray-700'}`}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}
