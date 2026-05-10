function CreateTripPage() {
  return (
    <div>

      {/* Header */}
      <div className="mb-10">

        <h1 className="text-5xl font-bold text-stone-900">
          Create Journey
        </h1>

        <p className="text-stone-500 mt-3 text-lg">
          Organize intelligent travel experiences with AI assistance.
        </p>

      </div>

      {/* Form */}
      <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm max-w-4xl">

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Destination City
            </label>

            <input
              type="text"
              placeholder="Search destination"
              className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Country
            </label>

            <input
              type="text"
              placeholder="Country name"
              className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Start Date
            </label>

            <input
              type="date"
              className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              End Date
            </label>

            <input
              type="date"
              className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-teal-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Budget
            </label>

            <input
              type="number"
              placeholder="Enter estimated budget"
              className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-teal-500"
            />
          </div>

          <div className="md:col-span-2">

            <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-2xl font-semibold transition">
              Create Trip
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateTripPage;