import { FaRegClone, FaSlidersH, FaPaperPlane, FaUsers, FaCog } from "react-icons/fa";

const tabs = [
  { label: "CV Template", icon: <FaRegClone />, active: false },
  { label: "AI Resume Builder", icon: <FaSlidersH />, active: false },
  { label: "Proposal", icon: <FaPaperPlane />, active: true },
  { label: "Consumers", icon: <FaUsers />, active: false },
  { label: "Settings", icon: <FaCog />, active: false },
];

export default function TabMenu() {
  return (
    <div className="flex justify-center">
      <div
        className="flex gap-2 px-3 py-2 bg-white rounded-2xl border border-gray-200 shadow-sm"
        style={{ minWidth: 720, marginTop: 0, marginBottom: 24 }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`
              flex items-center gap-2 px-5 py-2 font-medium text-[16px] text-gray-400 hover:text-black transition-all whitespace-nowrap
            `}
            disabled={tab.active}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              cursor: tab.active ? "default" : "pointer",
              minWidth: 120, 
              justifyContent: "center"
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
