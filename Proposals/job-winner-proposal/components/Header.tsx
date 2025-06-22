export default function Header() {
  return (
    <header className="bg-black py-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="logo" className="h-8" />
          <span className="text-white text-2xl font-bold">Job Winner</span>
        </div>
        <nav className="flex gap-8 text-white text-base font-medium">
          <a href="#">Home</a>
          <a href="#">Jobs</a>
          <a href="#">About Us</a>
          <a href="#">Contact Us</a>
        </nav>
        <div className="flex gap-4 items-center">
          <button className="text-white">Login</button>
          <button className="bg-[#1A9176] px-5 py-2 rounded-lg text-white font-semibold hover:brightness-110 transition">Register</button>
        </div>
      </div>
      <h1 className="text-4xl font-bold mt-7 text-white text-center">Proposals</h1>
    </header>
  );
}
