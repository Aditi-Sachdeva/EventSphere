import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);

      if (res.data.token) localStorage.setItem("token", res.data.token);
      if (res.data.user) localStorage.setItem("user", JSON.stringify(res.data.user));

      setIsError(false);
      setMessage(res.data.msg || "Login successful 🎉");

      setTimeout(() => navigate("/mainpage"), 1000);
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-gray-50 overflow-hidden">

      {/* Ambient gradient background (diagonal pink → indigo) */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-pink-100 opacity-50" />

      {/* ================= NAVBAR (same as Home) ================= */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-indigo-600 text-white flex items-center justify-center rounded-lg font-bold shadow-md text-xs">
              ES
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
              EventSphere
            </h1>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex gap-5 font-medium">
            <Link
              to="/"
              className="px-3 py-1 text-sm rounded-md transition bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-gray-700 hover:text-transparent"
            >
              Home
            </Link>
            <Link
              to="/events"
              className="px-3 py-1 text-sm rounded-md transition bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-gray-700 hover:text-transparent"
            >
              Events
            </Link>
            <Link
              to="/clubs"
              className="px-3 py-1 text-sm rounded-md transition bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-gray-700 hover:text-transparent"
            >
              Clubs
            </Link>
            <span className="px-3 py-1 text-sm bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-md font-semibold shadow-sm">
              Login
            </span>
          </div>

          {/* Register Button */}
          <Link
            to="/signup"
            className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:scale-[1.05] transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>




      {/* ================= MAIN ================= */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-24 mt-[80px]">
        <div className="w-full max-w-7xl grid md:grid-cols-2 gap-20 items-center">

          {/* LEFT CONTENT */}
          <div className="hidden md:flex justify-center">
            <div className="max-w-xl space-y-7">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 text-pink-600 text-xs font-medium">
                🔐 Secure Access
              </div>

              <h1 className="text-5xl font-bold text-gray-800 leading-tight">
                Welcome Back to
                <br />
                <span className="bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
                  EventSphere
                </span>
              </h1>

              <p className="text-gray-600 text-lg leading-relaxed">
                Log in to explore campus events, manage registrations,
                and stay connected with your college community.
              </p>

              <div className="pt-5 space-y-4">
                <Feature text="Fast and secure login" />
                <Feature text="Access your registrations" />
                <Feature text="Stay updated instantly" />
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="flex justify-center">
            <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-gray-300/50 shadow-2xl rounded-3xl p-10">

              <h2 className="text-2xl font-semibold text-gray-800 text-center">
                Login to Account
              </h2>

              {message && (
                <div
                  className={`mt-4 text-center text-sm px-4 py-2 rounded-xl ${isError
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-green-50 text-green-600 border border-green-200"
                    }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <FloatingInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <FloatingInput
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-indigo-600 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <p className="text-sm text-gray-500 text-center mt-7">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent hover:underline"
                >
                  Sign Up
                </Link>
              </p>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* floating input */
function FloatingInput({ label, ...props }) {
  return (
    <div className="relative">
      <input
        {...props}
        placeholder=" "
        required
        className="peer w-full rounded-xl border border-gray-300 bg-white px-4 pt-5 pb-2 text-gray-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 outline-none transition"
      />
      <label
        className="absolute left-4 top-2 text-sm text-gray-500 transition-all
        peer-placeholder-shown:top-3.5
        peer-placeholder-shown:text-base
        peer-placeholder-shown:text-gray-400
        peer-focus:top-2
        peer-focus:text-sm
        peer-focus:text-pink-600"
      >
        {label}
      </label>
    </div>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-center gap-4 text-gray-700">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-100 to-indigo-100 flex items-center justify-center text-pink-600 font-semibold shadow-sm">
        ✓
      </div>
      <span className="text-base">{text}</span>
    </div>
  );
}
