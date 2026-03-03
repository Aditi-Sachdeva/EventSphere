import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

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
      setIsError(true);
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

      setIsError(false);
      setMessage(res.data.msg || "Registration successful 🎉");

      // Redirect to login after 1.5 seconds
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-[#f6f7fb] overflow-hidden">
      
      {/* Ambient Background */}
      <div className="absolute -top-32 -left-32 w-[26rem] h-[26rem] bg-indigo-300 rounded-full blur-[120px] opacity-40" />
      <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-pink-300 rounded-full blur-[120px] opacity-40" />

      {/* ================= NAVBAR ================= */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center">
          
          <div className="flex-1 flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shadow-md">
              ES
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              EventSphere
            </span>
          </div>

          <div className="hidden md:flex flex-1 justify-center gap-10 text-sm font-medium text-gray-600">
            <button className="hover:text-indigo-600 transition">Home</button>
            <button className="hover:text-indigo-600 transition">Events</button>
            <button className="hover:text-indigo-600 transition">Clubs</button>
            <button className="text-indigo-600 font-semibold">Register</button>
          </div>

          <div className="flex-1 flex justify-end">
            <Link
              to="/"
              className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2 rounded-2xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.04] active:scale-95 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-7xl grid md:grid-cols-2 gap-20 items-center">

          {/* LEFT CONTENT */}
          <div className="hidden md:flex justify-center">
            <div className="max-w-xl space-y-7">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">
                🚀 Join the Community
              </div>

              <h1 className="text-5xl font-bold text-gray-800 leading-tight">
                Create Your
                <br />
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  EventSphere
                </span>{" "}
                Account
              </h1>

              <p className="text-gray-600 text-lg leading-relaxed">
                Sign up to discover campus events, connect with clubs,
                and manage your registrations effortlessly.
              </p>

              <div className="pt-5 space-y-4">
                <Feature text="Explore exclusive events" />
                <Feature text="Register in seconds" />
                <Feature text="Connect with your community" />
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="flex justify-center">
            <div className="w-full max-w-md bg-white/85 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-10">
              
              <h2 className="text-2xl font-semibold text-gray-800 text-center">
                Create Account
              </h2>

              {message && (
                <div
                  className={`mt-4 text-center text-sm px-4 py-2 rounded-xl border ${
                    isError
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "bg-green-50 text-green-600 border-green-200"
                  }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                
                <FloatingInput
                  label="Full Name"
                  name="name"
                  type="text"
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
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </button>

              </form>

              <p className="text-sm text-gray-500 text-center mt-7">
                Already have an account?{" "}
                <Link
                  to="/"
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Login
                </Link>
              </p>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* Floating Input */
function FloatingInput({ label, ...props }) {
  return (
    <div className="relative">
      <input
        {...props}
        placeholder=" "
        required
        className="peer w-full rounded-xl border border-gray-300 bg-white px-4 pt-5 pb-2 text-gray-800
        focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none transition"
      />
      <label
        className="absolute left-4 top-2 text-sm text-gray-500 transition-all
        peer-placeholder-shown:top-3.5
        peer-placeholder-shown:text-base
        peer-placeholder-shown:text-gray-400
        peer-focus:top-2
        peer-focus:text-sm
        peer-focus:text-indigo-600"
      >
        {label}
      </label>
    </div>
  );
}

function Feature({ text }) {
  return (
    <div className="flex items-center gap-4 text-gray-700">
      <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold shadow-sm">
        ✓
      </div>
      <span className="text-base">{text}</span>
    </div>
  );
}