import { useEffect, useState } from "react";
import {
  Wallet,
  TrendingUp,
  CreditCard,
  Landmark,
} from "lucide-react";

import StatsCard from "../../components/cards/StatsCard";
import BudgetAnalyticsCard from "../../components/cards/BudgetAnalyticsCard";
import { getMyTrips } from "../../services/tripService";
import { getTripBudget } from "../../services/budgetService";

function formatAmount(value) {
  return `₹${Number(value || 0).toLocaleString()}`;
}

function BudgetPage() {
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBudget = async () => {
      try {
        const trips = await getMyTrips();
        const activeTripId =
          localStorage.getItem("activeTripId") || trips?.[0]?.id;

        if (!activeTripId) {
          setError("Create a trip first to track budgets.");
          return;
        }

        localStorage.setItem("activeTripId", activeTripId);
        const budget = await getTripBudget(activeTripId);
        setBudgetData(budget);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Unable to load budget data.");
      } finally {
        setLoading(false);
      }
    };

    loadBudget();
  }, []);

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

        {budgetData?.trip_title && (
          <p className="text-stone-500 mt-2 text-sm">
            Showing budget for: <strong>{budgetData.trip_title}</strong>
          </p>
        )}

      </div>

      {loading ? (
        <div>Loading budget...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <>
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

            <StatsCard
              title="Total Budget"
              value={formatAmount(budgetData.budget_limit)}
              change=""
              icon={<Wallet className="text-teal-700" />}
            />

            <StatsCard
              title="Remaining Budget"
              value={formatAmount(budgetData.budget_remaining)}
              change=""
              icon={<TrendingUp className="text-teal-700" />}
            />

            <StatsCard
              title="Total Expenses"
              value={formatAmount(budgetData.total_expenses)}
              change=""
              icon={<CreditCard className="text-teal-700" />}
            />

            <StatsCard
              title="Tracked Trips"
              value={budgetData.trip_id ? "1" : "0"}
              change=""
              icon={<Landmark className="text-teal-700" />}
            />

          </section>

          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            <BudgetAnalyticsCard breakdown={budgetData.category_breakdown} />

            <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">

              <span className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium">
                Expense Breakdown
              </span>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-stone-700">
                  <span className="font-medium">Transport</span>
                  <span>{formatAmount(budgetData.transport_total)}</span>
                </div>

                <div className="flex items-center justify-between text-stone-700">
                  <span className="font-medium">Accommodation</span>
                  <span>{formatAmount(budgetData.accommodation_total)}</span>
                </div>

                <div className="flex items-center justify-between text-stone-700">
                  <span className="font-medium">Activities</span>
                  <span>{formatAmount(budgetData.activities_total)}</span>
                </div>

                <div className="border-t border-stone-200 pt-4 text-stone-900 font-semibold flex items-center justify-between">
                  <span>Total Expenses</span>
                  <span>{formatAmount(budgetData.total_expenses)}</span>
                </div>
              </div>

            </div>

          </section>
        </>
      )}
    </div>
  );
}

export default BudgetPage;