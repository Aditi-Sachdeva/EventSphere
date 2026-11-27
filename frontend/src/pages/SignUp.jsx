
import React, { useState } from "react";
import axios from "../api/axios";
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
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;

    if (!name || !email || !password) {
      return "Please fill in all required fields.";
    }

    if (name.length > 80) {
      return "Name must be 80 characters or fewer.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setMessage("");

    const validationError = validateForm();

    if (validationError) {
      setIsError(true);
      setMessage(validationError);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/auth/signup", {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      setIsError(false);
      setMessage(res.data.msg || "Registration successful!");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Signup error:", err);

      setIsError(true);

      if (err.response?.status === 409) {
        setMessage("An account with this email already exists.");
      } else if (err.response?.status === 429) {
        setMessage(
          err.response?.data?.msg ||
            "Too many attempts. Please try again later."
        );
      } else {
        setMessage(
          err.response?.data?.msg ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-gray-50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-pink-100 opacity-50" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 py-3 sm:py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-indigo-600 text-white flex items-center justify-center rounded-lg font-bold shadow-md text-xs flex-shrink-0">
              ES
            </div>

            <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
              EventSphere
            </h1>
          </Link>

          <div className="hidden md:flex gap-5 font-medium">
            <Link
              to="/"
              className="px-3 py-1 text-sm rounded-md transition text-gray-700 hover:text-pink-500"
            >
              Home
            </Link>

            <Link
              to="/events"
              className="px-3 py-1 text-sm rounded-md transition text-gray-700 hover:text-pink-500"
            >
              Events
            </Link>

            <Link
              to="/clubs"
              className="px-3 py-1 text-sm rounded-md transition text-gray-700 hover:text-pink-500"
            >
              Clubs
            </Link>

            <span className="px-3 py-1 text-sm bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-md font-semibold shadow-sm">
              Sign Up
            </span>
          </div>

          <Link
            to="/login"
            className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg hover:scale-[1.05] transition"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-24 mt-[56px] sm:mt-[72px]">
        <div className="w-full max-w-7xl grid md:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Left panel */}
          <div className="hidden md:flex justify-center">
            <div className="max-w-xl space-y-7">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 text-pink-600 text-xs font-medium">
                🤝 Join the Community
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                Create Your
                <br />

                <span className="bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
                  EventSphere
                </span>{" "}
                Account
              </h1>

              <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
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

          {/* Signup Form */}
          <div className="flex justify-center w-full">
            <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-gray-300/50 shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-10">
              <div className="md:hidden text-center mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-xs font-medium mb-2">
                  🤝 Join the Community
                </div>

                <p className="text-gray-500 text-sm">
                  Discover events & connect with clubs
                </p>
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center">
                Create Account
              </h2>

              {message && (
                <div
                  role="alert"
                  className={`mt-4 text-center text-sm px-4 py-2 rounded-xl ${
                    isError
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : "bg-green-50 text-green-600 border border-green-200"
                  }`}
                >
                  {message}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="mt-6 sm:mt-8 space-y-5 sm:space-y-6"
              >
                <FloatingInput
                  label="Full Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  maxLength={80}
                />

                <FloatingInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />

                <FloatingInput
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />

                <p className="text-xs text-gray-500 -mt-3">
                  At least 8 characters, with uppercase, lowercase, number,
                  and special character.
                </p>

                <FloatingInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-indigo-600 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </button>
              </form>

              <p className="text-sm text-gray-500 text-center mt-6 sm:mt-7">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent hover:underline"
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

function FloatingInput({ label, ...props }) {
  return (
    <div className="relative">
      <input
        {...props}
        placeholder=" "
        required
        className="peer w-full rounded-xl border border-gray-300 bg-white px-4 pt-5 pb-2 text-sm sm:text-base text-gray-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/40 outline-none transition"
      />

      <label
        className="absolute left-4 top-2 text-xs sm:text-sm text-gray-500 transition-all
        peer-placeholder-shown:top-3.5
        peer-placeholder-shown:text-sm
        peer-placeholder-shown:sm:text-base
        peer-placeholder-shown:text-gray-400
        peer-focus:top-2
        peer-focus:text-xs
        peer-focus:sm:text-sm
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
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-100 to-indigo-100 flex items-center justify-center text-pink-600 font-semibold shadow-sm flex-shrink-0">
        ✓
      </div>

      <span className="text-base">{text}</span>
    </div>
  );
}
