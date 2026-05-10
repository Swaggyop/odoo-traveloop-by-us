import { useEffect, useState } from "react";
import { getMyTrips, getTripById, addStopToTrip } from "../../services/tripService";
import { addActivityToStop } from "../../services/activityService";

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
  const [activeTrip, setActiveTrip] = useState(null);
  const [activeStopId, setActiveStopId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showAddStopForm, setShowAddStopForm] = useState(false);
  const [stopForm, setStopForm] = useState({
    city_id: 1,
    arrival_date: "",
    departure_date: "",
  });

  const loadTrip = async () => {
    try {
      const trips = await getMyTrips();
      const activeTripId =
        localStorage.getItem("activeTripId") || trips?.[0]?.id;

      if (!activeTripId) {
        setError("Create a trip first to add activity expenses.");
        setLoading(false);
        return;
      }

      localStorage.setItem("activeTripId", activeTripId);
      const trip = await getTripById(activeTripId);
      setActiveTrip(trip);
      setActiveStopId(trip.stops?.[0]?.id || null);
      setShowAddStopForm(!trip.stops?.length);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Unable to load trip information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
  }, []);

  const handleAddStop = async (e) => {
    e.preventDefault();
    if (!activeTrip || !stopForm.arrival_date || !stopForm.departure_date) {
      setError("Please fill in arrival and departure dates.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newStop = await addStopToTrip(activeTrip.id, {
        city_id: Number(stopForm.city_id),
        arrival_date: stopForm.arrival_date,
        departure_date: stopForm.departure_date,
      });

      setSuccessMessage("Stop added successfully!");
      setShowAddStopForm(false);
      setActiveStopId(newStop.id);

      await loadTrip();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Unable to add stop.");
    } finally {
      setLoading(false);
    }
  };

  const parsePrice = (price) => Number(String(price).replace(/[^0-9.]/g, "")) || 0;

  const handleAddActivity = async (activity) => {
    if (!activeTrip || !activeStopId) {
      setError("A valid trip and stop are required before adding activities.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      await addActivityToStop(activeTrip.id, activeStopId, {
        custom_name: activity.title,
        custom_cost: parsePrice(activity.price),
        scheduled_date: activeTrip.start_date,
        notes: "Added from Activities page",
      });
      setSuccessMessage(`${activity.title} added to ${activeTrip.title}. Budget updated!`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Unable to add activity.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !activeTrip) {
    return <div className="p-10">Loading activities...</div>;
  }

  if (showAddStopForm && activeTrip) {
    return (
      <div>
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-stone-900">Add Stop First</h1>
          <p className="text-stone-500 mt-3 text-lg">
            Your trip <strong>{activeTrip.title}</strong> has no stops yet. Add a destination stop to start adding activities.
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm max-w-2xl">
          <form onSubmit={handleAddStop} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">City</label>
              <select
                value={stopForm.city_id}
                onChange={(e) => setStopForm({ ...stopForm, city_id: e.target.value })}
                className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-teal-500"
              >
                <option value="1">Paris, France</option>
                <option value="2">Venice, Italy</option>
                <option value="3">Tokyo, Japan</option>
                <option value="4">Bern, Switzerland</option>
                <option value="5">Barcelona, Spain</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Arrival Date</label>
              <input
                type="date"
                value={stopForm.arrival_date}
                onChange={(e) => setStopForm({ ...stopForm, arrival_date: e.target.value })}
                className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Departure Date</label>
              <input
                type="date"
                value={stopForm.departure_date}
                onChange={(e) => setStopForm({ ...stopForm, departure_date: e.target.value })}
                className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-teal-500"
                required
              />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-2xl font-semibold transition disabled:opacity-50"
              >
                {loading ? "Adding Stop..." : "Add Stop"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

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

        {activeTrip?.title && (
          <p className="text-stone-500 mt-2 text-sm">
            Adding activity expenses to <strong>{activeTrip.title}</strong>.
          </p>
        )}

      </div>

      {error && <div className="mb-6 text-red-600">{error}</div>}
      {successMessage && <div className="mb-6 text-teal-700">{successMessage}</div>}

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
            type="button"
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

                <button
                  type="button"
                  onClick={() => handleAddActivity(activity)}
                  disabled={loading || !activeStopId}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-2xl transition disabled:opacity-50"
                >
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
