import {
  Wallet,
  TrendingUp,
  CreditCard,
  Landmark,
} from "lucide-react";

import StatsCard from "../../components/cards/StatsCard";
import BudgetAnalyticsCard from "../../components/cards/BudgetAnalyticsCard";

function BudgetPage() {
  return (
    <div>

      {/* Header */}
      <div className="mb-10">

        <h1 className="text-5xl font-bold text-stone-900">
          Budget Management
        </h1>

        <p className="text-stone-500 mt-3 text-lg">
          Track intelligent financial planning across all journeys.
        </p>

      </div>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        <StatsCard
          title="Total Budget"
          value="₹2.4L"
          change="+14%"
          icon={<Wallet className="text-teal-700" />}
        />

        <StatsCard
          title="Savings Optimized"
          value="₹38K"
          change="+22%"
          icon={<TrendingUp className="text-teal-700" />}
        />

        <StatsCard
          title="Transactions"
          value="148"
          change="+9%"
          icon={<CreditCard className="text-teal-700" />}
        />

        <StatsCard
          title="Invested Trips"
          value="12"
          change="+11%"
          icon={<Landmark className="text-teal-700" />}
        />

      </section>

      {/* Analytics */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <BudgetAnalyticsCard />

        {/* Smart Insights */}
        <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">

          <span className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium">
            Smart Financial Insights
          </span>

          <h2 className="text-4xl font-bold text-stone-900 mt-6 leading-tight">
            AI detected lower accommodation pricing in your October journeys.
          </h2>

          <p className="text-stone-500 mt-5 leading-relaxed text-lg">
            Reallocating destination schedules could reduce your travel expenses by nearly 16% while maintaining itinerary quality.
          </p>

          <button className="mt-8 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-medium transition">
            Optimize Expenses
          </button>

        </div>

      </section>

    </div>
  );
}

export default BudgetPage;