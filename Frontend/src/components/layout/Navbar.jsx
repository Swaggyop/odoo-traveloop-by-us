import { Bell, Search } from "lucide-react";

function Navbar() {
  return (
    <header className="w-full flex items-center justify-between mb-10">

      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-stone-900">
          Dashboard
        </h1>

        <p className="text-stone-500 mt-1">
          Organize smarter journeys with AI assistance.
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-2xl px-4 py-3 shadow-sm w-[280px]">

          <Search size={18} className="text-stone-400" />

          <input
            type="text"
            placeholder="Search trips..."
            className="outline-none bg-transparent text-sm w-full"
          />
        </div>

        {/* Notification */}
        <button className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center shadow-sm hover:bg-stone-100 transition">

          <Bell size={20} className="text-stone-600" />
        </button>

        {/* Profile */}
        <img
          src="https://i.pravatar.cc/100"
          alt="profile"
          className="w-12 h-12 rounded-2xl object-cover border border-stone-200"
        />
      </div>
    </header>
  );
}

export default Navbar;