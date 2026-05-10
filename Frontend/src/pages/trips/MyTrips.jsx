import TripCard from "../../components/cards/TripCard";

const trips = [
  {
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    title: "Paris Escape",
    country: "France",
    date: "12 Aug - 18 Aug",
    budget: "42K",
  },

  {
    image:
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9",
    title: "Venice Retreat",
    country: "Italy",
    date: "2 Sept - 9 Sept",
    budget: "36K",
  },

  {
    image:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
    title: "Tokyo Horizon",
    country: "Japan",
    date: "20 Sept - 29 Sept",
    budget: "78K",
  },

  {
    image:
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1",
    title: "Swiss Alps Journey",
    country: "Switzerland",
    date: "4 Oct - 11 Oct",
    budget: "95K",
  },
];

function MyTrips() {
  return (
    <div>

      {/* Header */}
      <div className="flex items-center justify-between mb-10">

        <div>
          <h1 className="text-4xl font-bold text-stone-900">
            My Trips
          </h1>

          <p className="text-stone-500 mt-2">
            Organize and manage all your travel journeys.
          </p>
        </div>

        <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-medium transition">
          + Create Trip
        </button>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {trips.map((trip, index) => (
          <TripCard
            key={index}
            image={trip.image}
            title={trip.title}
            country={trip.country}
            date={trip.date}
            budget={trip.budget}
          />
        ))}

      </div>
    </div>
  );
}

export default MyTrips;