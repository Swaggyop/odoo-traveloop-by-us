function StatsCard({
  title,
  value,
  change,
  icon,
}) {
  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-300">

      {/* Top */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <p className="text-sm text-stone-500 mb-2">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-stone-900">
            {value}
          </h2>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center">
          {icon}
        </div>
      </div>

      {/* Bottom */}
      <div className="flex items-center gap-2">

        <span className="text-sm font-semibold text-teal-700">
          {change}
        </span>

        <span className="text-sm text-stone-400">
          this month
        </span>
      </div>
    </div>
  );
}

export default StatsCard;