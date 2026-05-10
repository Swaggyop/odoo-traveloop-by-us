function AIRecommendationCard() {
  return (
    <div className="bg-teal-600 rounded-3xl p-7 text-white shadow-sm h-full flex flex-col justify-between">

      <div>

        <span className="bg-white/20 text-sm px-3 py-1 rounded-full">
          AI Suggestion
        </span>

        <h2 className="text-3xl font-bold mt-5 leading-snug">
          Reduce hotel costs by 18% with smart destination balancing.
        </h2>

        <p className="text-teal-50 mt-4 leading-relaxed">
          Our AI identified optimized accommodation patterns across your upcoming journeys.
        </p>

      </div>

      <button className="mt-8 bg-white text-teal-700 px-5 py-3 rounded-2xl font-semibold hover:bg-stone-100 transition w-fit">
        Optimize Budget
      </button>
    </div>
  );
}

export default AIRecommendationCard;