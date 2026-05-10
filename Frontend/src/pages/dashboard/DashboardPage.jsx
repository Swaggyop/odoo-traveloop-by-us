import StatsCard from "../../components/cards/StatsCard";
import TripCard from "../../components/cards/TripCard";
import BudgetAnalyticsCard from "../../components/cards/BudgetAnalyticsCard";
import ActivityTimeline from "../../components/cards/ActivityTimeline";
import AIRecommendationCard from "../../components/cards/AIRecommendationCard";

import {
  Map,
  Wallet,
  Compass,
  CalendarDays,
} from "lucide-react";

function DashboardPage() {
  return (
    <>

      {/* Hero Section */}
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

      {/* Main Dashboard Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-10">

        {/* Trips Section */}
        <div className="xl:col-span-2">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-3xl font-bold text-stone-900">
                Upcoming Journeys
              </h2>

              <p className="text-stone-500 mt-1">
                Curated intelligent travel experiences.
              </p>
            </div>

            <button className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-2xl font-medium transition">
              View All
            </button>

          </div>

          {/* Trip Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <TripCard
              image="https://images.unsplash.com/photo-1502602898657-3e91760cbb34"
              title="Paris Escape"
              country="France"
              date="12 Aug - 18 Aug"
              budget="42K"
            />

            <TripCard
              image="https://images.unsplash.com/photo-1523906834658-6e24ef2386f9"
              title="Venice Retreat"
              country="Italy"
              date="2 Sept - 9 Sept"
              budget="36K"
            />

          </div>

        </div>

        {/* Budget Analytics */}
        <div>
          <BudgetAnalyticsCard />
        </div>

      </section>

      {/* Bottom Dashboard Section */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-10">

        {/* Activity Timeline */}
        <div className="xl:col-span-2">
          <ActivityTimeline />
        </div>

        {/* AI Recommendation */}
        <div>
          <AIRecommendationCard />
        </div>

      </section>

    </>
  );
}

export default DashboardPage;