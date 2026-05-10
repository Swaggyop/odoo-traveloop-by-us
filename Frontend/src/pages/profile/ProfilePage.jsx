import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, updateProfile, logout } from "../../services/authService";

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getMe();
        setUser(profile);
        setName(profile.name || "");
        setEmail(profile.email || "");
        setLanguage(profile.language || "");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name, language });
      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Unable to update profile"
      );
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

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
              {user?.name || "Traveler"}
            </h2>

            <p className="text-stone-500">
              {email}
            </p>

          </div>

        </div>

        <form className="space-y-5" onSubmit={handleSave}>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              disabled
              className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none bg-stone-50 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Preferred Language
            </label>

            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g. English"
              className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex gap-4 pt-5">

            <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-2xl font-medium transition">
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