const activities = [
  {
    title: "Paris itinerary updated",
    time: "2 hours ago",
  },
  {
    title: "Budget optimized for Venice trip",
    time: "5 hours ago",
  },
  {
    title: "3 new activities added",
    time: "Yesterday",
  },
];

function ActivityTimeline() {
  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm">

      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-stone-900">
          Recent Activity
        </h3>

        <p className="text-stone-500 mt-1">
          Latest intelligent travel updates.
        </p>
      </div>

      <div className="space-y-5">

        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex gap-4"
          >

            <div className="w-3 h-3 rounded-full bg-teal-500 mt-2" />

            <div>
              <h4 className="font-medium text-stone-800">
                {activity.title}
              </h4>

              <p className="text-sm text-stone-500 mt-1">
                {activity.time}
              </p>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

export default ActivityTimeline;