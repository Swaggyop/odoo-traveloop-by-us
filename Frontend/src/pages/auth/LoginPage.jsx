import { useState } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authService";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      const response = await loginUser({
        email,
        password,
      });

      localStorage.setItem("token", response.token);
      navigate("/dashboard");

    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Login failed"
      );
    } finally {

      setLoading(false);

    }
  };

  return (
    <AuthLayout>

      <div>

        <h1 className="text-4xl font-bold text-stone-900">
          Welcome Back
        </h1>

        <p className="text-stone-500 mt-3">
          Sign in to continue your intelligent travel planning.
        </p>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="mt-10 space-y-5"
        >

          <div>

            <label className="block text-sm font-medium text-stone-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-teal-500"
            />

          </div>

          <div>

            <label className="block text-sm font-medium text-stone-700 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border border-stone-200 rounded-2xl px-5 py-4 outline-none focus:border-teal-500"
            />

          </div>

          <button
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-2xl font-semibold transition"
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </button>

        </form>

        {/* Register Redirect */}
        <p className="mt-6 text-stone-500 text-center">

          New here?{" "}

          <Link
            to="/register"
            className="text-teal-700 font-semibold hover:underline"
          >
            Create an account
          </Link>

        </p>

      </div>

    </AuthLayout>
  );
}

export default LoginPage;