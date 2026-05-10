import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TripCard from "../../components/cards/TripCard";
import { getMyTrips } from "../../services/tripService";

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await getMyTrips();
        setTrips(data);
        if (data.length > 0 && !localStorage.getItem("activeTripId")) {
          localStorage.setItem("activeTripId", data[0].id);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Unable to load trips");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-stone-900">My Trips</h1>
          <p className="text-stone-500 mt-2">
            Organize and manage all your travel journeys.
          </p>
        </div>

        <Link
          to="/create-trip"
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-medium transition"
        >
          + Create Trip
        </Link>
      </div>

      {loading ? (
        <div>Loading trips...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : trips.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-300 p-10 text-center text-stone-500">
          You don’t have any trips yet. Create your first itinerary to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              image={trip.cover_image || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34"}
              title={trip.title}
              country={trip.country || "Destination"}
              date={`${trip.start_date || ""} - ${trip.end_date || ""}`}
              budget={trip.budget_limit || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTrips;
