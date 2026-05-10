import {
  LayoutDashboard,
  Map,
  Wallet,
  Compass,
  User,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },

  {
    name: "Create Trip",
    icon: Map,
    path: "/create-trip",
  },

  {
    name: "Trips",
    icon: Map,
    path: "/trips",
  },

  {
    name: "Budget",
    icon: Wallet,
    path: "/budget",
  },

  {
    name: "Activities",
    icon: Compass,
    path: "/activities",
  },

  {
    name: "Profile",
    icon: User,
    path: "/profile",
  },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-stone-200 px-6 py-8 flex flex-col justify-between">

      {/* Top Section */}
      <div>

        {/* Logo */}
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

            const isActive =
              location.pathname === item.path;

            return (
              <Link
                key={index}
                to={item.path}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200
                  
                  ${
                    isActive
                      ? "bg-teal-50 text-teal-700"
                      : "text-stone-600 hover:bg-stone-100"
                  }
                `}
              >

                <Icon size={20} />

                <span className="font-medium text-[15px]">
                  {item.name}
                </span>

              </Link>
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
            Travel Strategist
          </p>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;