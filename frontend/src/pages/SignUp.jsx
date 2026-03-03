import React, { useState } from "react";
import axios from "axios";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      return setMessage("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      setMessage(res.data.msg);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setMessage(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7fb] relative">
      {/* soft background */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-200 rounded-full blur-3xl opacity-40" />

      {/* ================= NAVBAR ================= */}
      <nav className="relative bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center">
          {/* Left */}
          <div className="flex-1 flex items-center gap-3">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              ES
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              EventSphere
            </span>
          </div>

          {/* Center */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-10 text-[15px] font-medium text-gray-600">
            <button className="hover:text-indigo-600 transition">Home</button>
            <button className="hover:text-indigo-600 transition">Events</button>
            <button className="hover:text-indigo-600 transition">Clubs</button>
            <button className="hover:text-indigo-600 transition">Login</button>
          </div>

          {/* Right */}
          <div className="flex-1 flex justify-end">
            <button className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2 rounded-2xl hover:shadow-md hover:scale-[1.03] active:scale-95 transition font-semibold">
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <main className="relative flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-7xl grid md:grid-cols-2 gap-16 items-center">

          {/* ========== LEFT CONTENT ========== */}
          <div className="hidden md:flex justify-center">
            <div className="w-full max-w-xl space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">
                ✨ Smart Campus Platform
              </div>

              <h1 className="text-5xl font-bold text-gray-800 leading-tight">
                Discover Amazing
                <br />
                Campus Events
              </h1>

              <p className="text-gray-600 leading-relaxed text-lg">
                Find, manage and register for college events effortlessly.
                Stay connected with clubs and never miss what’s happening on
                your campus.
              </p>

              <div className="pt-4 space-y-4">
                <Feature text="Smart event discovery" />
                <Feature text="One‑click registrations" />
                <Feature text="Real‑time notifications" />
              </div>
            </div>
          </div>

          {/* ========== RIGHT FORM ========== */}
          <div className="flex justify-center">
            <div className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-xl rounded-3xl p-10 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 text-center">
                Create Account
              </h2>

              {message && (
                <div className="mt-3 text-center text-sm text-red-500">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <FloatingInput
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />

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

                <FloatingInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition disabled:bg-gray-400 shadow-sm"
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </button>
              </form>

              <p className="text-sm text-gray-500 text-center mt-6">
                Already have an account?{" "}
                <span className="text-indigo-600 font-medium cursor-pointer hover:underline">
                  Login
                </span>
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
        className="peer w-full border border-gray-300 rounded-xl px-3 pt-5 pb-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
      />
      <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all
        peer-placeholder-shown:top-3.5
        peer-placeholder-shown:text-base
        peer-placeholder-shown:text-gray-400
        peer-focus:top-2
        peer-focus:text-sm
        peer-focus:text-indigo-600">
        {label}
      </label>
    </div>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-center gap-3 text-gray-700">
      <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
        ✓
      </div>
      <span className="text-base">{text}</span>
    </div>
  );
}