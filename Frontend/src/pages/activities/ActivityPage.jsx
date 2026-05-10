const activities = [
  {
    title: "Eiffel Tower Experience",
    country: "France",
    category: "Sightseeing",
    price: "₹4,200",
    image:
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f",
  },

  {
    title: "Venice Canal Tour",
    country: "Italy",
    category: "Luxury",
    price: "₹6,800",
    image:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963",
  },

  {
    title: "Tokyo Food Walk",
    country: "Japan",
    category: "Food",
    price: "₹3,900",
    image:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26",
  },

  {
    title: "Swiss Mountain Hiking",
    country: "Switzerland",
    category: "Adventure",
    price: "₹8,500",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  },
];

function ActivityPage() {
  return (
    <div>

      {/* Header */}
      <div className="mb-10">

        <h1 className="text-5xl font-bold text-stone-900">
          Explore Activities
        </h1>

        <p className="text-stone-500 mt-3 text-lg">
          Discover curated experiences across intelligent travel destinations.
        </p>

      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-3 mb-10">

        {[
          "All",
          "Adventure",
          "Luxury",
          "Food",
          "Sightseeing",
        ].map((item, index) => (
          <button
            key={index}
            className={`px-5 py-3 rounded-2xl font-medium transition
              
              ${
                index === 0
                  ? "bg-teal-600 text-white"
                  : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"
              }
            `}
          >
            {item}
          </button>
        ))}

      </div>

      {/* Activities Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {activities.map((activity, index) => (
          <div
            key={index}
            className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >

            {/* Image */}
            <img
              src={activity.image}
              alt={activity.title}
              className="w-full h-52 object-cover"
            />

            {/* Content */}
            <div className="p-6">

              <div className="flex items-center justify-between mb-4">

                <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
                  {activity.category}
                </span>

                <span className="text-sm text-stone-500">
                  {activity.country}
                </span>

              </div>

              <h2 className="text-2xl font-semibold text-stone-900">
                {activity.title}
              </h2>

              <div className="flex items-center justify-between mt-6">

                <span className="text-xl font-bold text-teal-700">
                  {activity.price}
                </span>

                <button className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-2xl transition">
                  Add
                </button>

              </div>

            </div>

          </div>
        ))}

      </section>

    </div>
  );
}

export default ActivityPage;