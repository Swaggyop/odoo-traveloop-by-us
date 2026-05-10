import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const defaultData = [
  { name: "Hotels", value: 40 },
  { name: "Flights", value: 30 },
  { name: "Activities", value: 20 },
  { name: "Food", value: 10 },
];

const COLORS = [
  "#0D9488",
  "#14B8A6",
  "#5EEAD4",
  "#CCFBF1",
];

function BudgetAnalyticsCard({ breakdown }) {
  const data = breakdown
    ? [
        { name: "Transport", value: breakdown.transport },
        { name: "Accommodation", value: breakdown.accommodation },
        { name: "Activities", value: breakdown.activities },
      ]
    : defaultData;
  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm h-full">

      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-stone-900">
          Budget Insights
        </h3>

        <p className="text-stone-500 mt-1">
          Smart allocation across travel categories.
        </p>
      </div>

      <div className="h-70">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>

            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              dataKey="value"
            >

              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}

            </Pie>

          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">

        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3"
          >

            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: COLORS[index],
              }}
            />

            <span className="text-sm text-stone-600">
              {item.name}
            </span>

          </div>
        ))}

      </div>
    </div>
  );
}

export default BudgetAnalyticsCard;