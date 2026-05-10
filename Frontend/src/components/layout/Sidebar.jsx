import {
  LayoutDashboard,
  Map,
  CalendarDays,
  Wallet,
  Compass,
  Package,
  NotebookPen,
  User,
  BarChart3,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Trips", icon: Map },
  { name: "Itinerary", icon: CalendarDays },
  { name: "Budget", icon: Wallet },
  { name: "Activities", icon: Compass },
  { name: "Packing", icon: Package },
  { name: "Notes", icon: NotebookPen },
  { name: "Profile", icon: User },
  { name: "Analytics", icon: BarChart3 },
];

function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-white border-r border-stone-200 px-6 py-8 flex flex-col justify-between">

      {/* Logo Section */}
      <div>
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">
            Traveloop
          </h1>

          <p className="text-sm text-stone-500 mt-1">
            Smart Travel Operations
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <button
                key={index}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200
                  
                  ${
                    index === 0
                      ? "bg-teal-50 text-teal-700"
                      : "text-stone-600 hover:bg-stone-100"
                  }
                `}
              >
                <Icon size={20} />

                <span className="font-medium text-[15px]">
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Card */}
      <div className="bg-stone-50 border border-stone-200 rounded-3xl p-4 flex items-center gap-3">
        <img
          src="https://i.pravatar.cc/100"
          alt="profile"
          className="w-12 h-12 rounded-full object-cover"
        />

        <div>
          <h3 className="font-semibold text-stone-800">
            Dhvani
          </h3>

          <p className="text-sm text-stone-500">
            Product Explorer
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;