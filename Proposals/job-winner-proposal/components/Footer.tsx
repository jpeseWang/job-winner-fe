export default function Footer() {
  return (
    <footer className="bg-black text-white px-12 py-8 mt-8">
      <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-2 font-bold"><span>💼</span> Job</div>
          <div className="text-sm text-gray-400">Quis enim pellentesque viverra tellus eget malesuada facilisis...</div>
        </div>
        <div>
          <div className="font-bold mb-2">Company</div>
          <ul className="space-y-1 text-sm text-gray-400">
            <li>About Us</li>
            <li>Our Team</li>
            <li>Partners</li>
            <li>For Candidates</li>
            <li>For Employers</li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-2">Job Categories</div>
          <ul className="space-y-1 text-sm text-gray-400">
            <li>Telecommunications</li>
            <li>Hotels & Tourism</li>
            <li>Construction</li>
            <li>Education</li>
            <li>Financial Services</li>
          </ul>
        </div>
        <div>
          <div className="font-bold mb-2">Newsletter</div>
          <div className="text-sm text-gray-400 mb-2">Eu nunc pretium vitae platea. Non netus elementum vulputate</div>
          <form className="flex flex-col gap-2">
            <input className="bg-transparent border border-gray-500 rounded px-3 py-2 text-white" placeholder="Email Address"/>
            <button className="bg-[#1A9176] px-5 py-2 rounded-lg text-white font-semibold">Subscribe now</button>
          </form>
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-500 border-t border-gray-700 pt-6 mt-6">
        <span>© Copyright Job Portal 2024. Designed by Figma.guru</span>
        <span>
          <a href="#" className="underline mr-4">Privacy Policy</a>
          <a href="#" className="underline">Terms & Conditions</a>
        </span>
      </div>
    </footer>
  );
}

