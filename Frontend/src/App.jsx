import DashboardLayout from "./components/layout/DashboardLayout";

function App() {
  return (
    <DashboardLayout>

      {/* Hero Section */}
      <section className="mb-10">

        <h2 className="text-5xl font-bold text-stone-900 leading-tight max-w-3xl">
          Plan elegant journeys with intelligent travel workflows.
        </h2>

        <p className="text-lg text-stone-500 mt-5 max-w-2xl leading-relaxed">
          Manage itineraries, budgets, activities and collaborative travel experiences through a beautifully organized platform.
        </p>

      </section>

    </DashboardLayout>
  );
}

export default App;