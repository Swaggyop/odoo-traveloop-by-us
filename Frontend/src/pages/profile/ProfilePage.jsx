import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <div>

      <div className="mb-10">

        <h1 className="text-5xl font-bold text-stone-900">
          Profile Settings
        </h1>

        <p className="text-stone-500 mt-3 text-lg">
          Manage your traveler account and preferences.
        </p>

      </div>

      <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm max-w-3xl">

        <div className="flex items-center gap-5 mb-10">

          <img
            src="https://i.pravatar.cc/120"
            alt="profile"
            className="w-24 h-24 rounded-full"
          />

          <div>

            <h2 className="text-2xl font-bold text-stone-900">
              Dhvani
            </h2>

            <p className="text-stone-500">
              dhvani@example.com
            </p>

          </div>

        </div>

        <form className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              defaultValue="Dhvani"
              className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Email
            </label>

            <input
              type="email"
              defaultValue="dhvani@example.com"
              className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex gap-4 pt-5">

            <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-medium transition">
              Save Changes
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-medium transition"
            >
              Logout
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ProfilePage;