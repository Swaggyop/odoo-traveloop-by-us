import DashboardLayout from "./components/layout/DashboardLayout";
import StatsCard from "./components/cards/StatsCard";

import {
  Map,
  Wallet,
  Compass,
  CalendarDays,
} from "lucide-react";

function App() {
  return (
    <DashboardLayout>

      {/* Hero */}
      <section className="mb-10">

        <h2 className="text-5xl font-bold text-stone-900 leading-tight max-w-4xl">
          Plan elegant journeys with intelligent travel workflows.
        </h2>

        <p className="text-lg text-stone-500 mt-5 max-w-2xl leading-relaxed">
          Manage itineraries, budgets, activities and collaborative travel experiences through a beautifully organized platform.
        </p>

      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatsCard
          title="Trips Planned"
          value="12"
          change="+18%"
          icon={<Map className="text-teal-700" />}
        />

        <StatsCard
          title="Budget Managed"
          value="₹84K"
          change="+12%"
          icon={<Wallet className="text-teal-700" />}
        />

        <StatsCard
          title="Activities Added"
          value="148"
          change="+25%"
          icon={<Compass className="text-teal-700" />}
        />

        <StatsCard
          title="Upcoming Journeys"
          value="4"
          change="+8%"
          icon={<CalendarDays className="text-teal-700" />}
        />

      </section>

    </DashboardLayout>
  );
}

export default App;