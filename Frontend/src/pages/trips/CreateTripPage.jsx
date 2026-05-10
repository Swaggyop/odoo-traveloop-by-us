import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTrip } from "../../services/tripService";

function CreateTripPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const createdTrip = await createTrip({
        title: title || `${destination} Adventure`,
        description: description || `Travel plan to ${destination}, ${country}`,
        start_date: startDate,
        end_date: endDate,
        budget_limit: Number(budget) || 0,
        cover_image: coverImage,
      });
      localStorage.setItem("activeTripId", createdTrip.id);
      navigate("/trips");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Unable to create trip"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-5xl font-bold text-stone-900">Create Journey</h1>
        <p className="text-stone-500 mt-3 text-lg">
          Organize intelligent travel experiences with API-connected planning.
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm max-w-4xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-2">Trip Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter trip title"
              className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Destination City</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Search destination"
              className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country name"
              className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Budget</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter estimated budget"
              className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Cover Image URL</label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Optional image URL"
              className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-teal-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a short trip description"
              className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-teal-500 h-32 resize-none"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-2xl font-semibold transition disabled:opacity-50"
            >
              {loading ? "Creating trip..." : "Create Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTripPage;
