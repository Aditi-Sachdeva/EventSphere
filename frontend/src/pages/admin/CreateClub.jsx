
import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Plus,
  CheckCircle2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import axios from "../../api/axios";

const GRAD = "linear-gradient(to right, #ec4899, #6366f1)";

export default function CreateClub() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [organizerId, setOrganizerId] = useState("");

  const [organizers, setOrganizers] = useState([]);
  const [totalClubs, setTotalClubs] = useState(0);

  const [loadingOrganizers, setLoadingOrganizers] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [toast, setToast] = useState({
    msg: "",
    type: "",
  });

  // Toast notification
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
  }, []);

  useEffect(() => {
    if (!toast.msg) return;

    const timer = setTimeout(() => {
      setToast({ msg: "", type: "" });
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  // Fetch users and clubs
  const fetchData = useCallback(async () => {
    setLoadingOrganizers(true);
    setLoadError("");

    try {
      const [usersResponse, clubsResponse] = await Promise.all([
        axios.get("/api/admin/users"),
        axios.get("/api/admin/clubs"),
      ]);

      const users = usersResponse.data?.users;
      const clubs = clubsResponse.data?.clubs;

      if (!Array.isArray(users) || !Array.isArray(clubs)) {
        throw new Error("Invalid data received from server.");
      }

      // Only users without an existing club can be assigned.
      const eligibleUsers = users.filter(
        (user) => !user.club
      );

      setOrganizers(eligibleUsers);
      setTotalClubs(clubs.length);

    } catch (error) {
      console.error(
        "Failed to load club creation data:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      setLoadError(
        error.response?.data?.msg ||
        error.message ||
        "Failed to load users and clubs."
      );

    } finally {
      setLoadingOrganizers(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Create club
  const handleSubmit = async () => {
    if (!name.trim() || !description.trim() || !organizerId) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    if (submitting) return;

    setSubmitting(true);

    try {
      const response = await axios.post(
        "/api/admin/club/create",
        {
          name: name.trim(),
          description: description.trim(),
          mainOrganizerId: organizerId,
        }
      );

      showToast(
        response.data?.msg || "Club created successfully!"
      );

      setTotalClubs((prev) => prev + 1);

      // Remove the newly assigned organizer from available users.
      setOrganizers((prev) =>
        prev.filter((user) => user._id !== organizerId)
      );

      setName("");
      setDescription("");
      setOrganizerId("");

    } catch (error) {
      console.error(
        "Create club error:",
        error.response?.data || error
      );

      showToast(
        error.response?.data?.msg ||
        "Failed to create club.",
        "error"
      );

    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    if (submitting) return;

    setName("");
    setDescription("");
    setOrganizerId("");
  };

  const selectedOrganizer = organizers.find(
    (user) => user._id === organizerId
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-4 sm:p-6">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-5 sm:mb-6">

          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              Administration
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 mt-1">
              Create a New Club
            </h1>

            <p className="text-sm text-gray-500">
              Set up a new community space for your members
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border px-4 py-2 rounded-xl text-sm text-gray-600 shadow-sm self-start sm:self-auto whitespace-nowrap">
            <Users size={16} className="text-pink-500" />

            {loadingOrganizers
              ? "Loading..."
              : `${organizers.length} eligible users`}
          </div>

        </div>

        {/* Loading Error */}
        {loadError && (

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle size={18} />
              {loadError}
            </div>

            <button
              onClick={fetchData}
              disabled={loadingOrganizers}
              className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold disabled:opacity-50"
            >
              Retry
            </button>

          </div>

        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">

          {/* Form */}
          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white rounded-2xl border shadow-sm">

              <div className="border-b p-4">
                <h2 className="font-semibold text-gray-800">
                  Club Details
                </h2>

                <p className="text-xs text-gray-500">
                  Basic information about your club
                </p>
              </div>

              <div className="p-4 sm:p-6 space-y-5">

                {/* Club Name */}
                <div>
                  <label
                    htmlFor="clubName"
                    className="text-sm font-semibold text-gray-600"
                  >
                    Club Name
                  </label>

                  <input
                    id="clubName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Photography Enthusiasts"
                    maxLength={100}
                    disabled={submitting}
                    className="w-full mt-1 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="clubDescription"
                    className="text-sm font-semibold text-gray-600"
                  >
                    Description
                  </label>

                  <textarea
                    id="clubDescription"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this club is about..."
                    maxLength={2000}
                    disabled={submitting}
                    className="w-full mt-1 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none disabled:bg-gray-100"
                  />

                  <p className="text-xs text-gray-400 text-right mt-1">
                    {description.length}/2000
                  </p>
                </div>

                {/* Main Organizer */}
                <div>
                  <label
                    htmlFor="mainOrganizer"
                    className="text-sm font-semibold text-gray-600"
                  >
                    Main Organizer
                  </label>

                  {loadingOrganizers ? (

                    <div className="mt-1 border rounded-lg px-4 py-2.5 text-sm text-gray-400 bg-gray-50 animate-pulse">
                      Loading eligible users...
                    </div>

                  ) : organizers.length === 0 ? (

                    <div className="mt-1 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-600 bg-amber-50 flex items-start gap-2">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />

                      <span>
                        No eligible users found. Users already associated
                        with another club cannot be assigned.
                      </span>
                    </div>

                  ) : (

                    <select
                      id="mainOrganizer"
                      value={organizerId}
                      onChange={(e) => setOrganizerId(e.target.value)}
                      disabled={submitting}
                      className="w-full mt-1 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
                    >
                      <option value="">
                        Select a main organizer
                      </option>

                      {organizers.map((user) => (

                        <option
                          key={user._id}
                          value={user._id}
                        >
                          {user.name} — {user.email}
                          {" "}({user.role})
                        </option>

                      ))}

                    </select>

                  )}
                </div>

                {/* Selected Organizer */}
                {selectedOrganizer && (

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">

                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: GRAD }}
                    >
                      {selectedOrganizer.name
                        ?.split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-800 truncate">
                        {selectedOrganizer.name}
                      </div>

                      <div className="text-xs text-gray-400 truncate">
                        {selectedOrganizer.email}
                      </div>
                    </div>

                    <span className="sm:ml-auto text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-600 border border-indigo-200 shrink-0">
                      Main Organizer
                    </span>

                  </div>

                )}

                {/* Backend Role Information */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                  <p className="text-xs text-blue-700 leading-relaxed">
                    <strong>Note:</strong> The selected user will become
                    the main organizer of this club. If their current
                    role is User, the backend automatically changes
                    their role to Organizer.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-3 items-center pt-1">

                  <button
                    onClick={handleSubmit}
                    disabled={
                      submitting ||
                      loadingOrganizers ||
                      !organizerId ||
                      !name.trim() ||
                      !description.trim()
                    }
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: GRAD }}
                  >
                    <Plus size={16} />

                    {submitting ? "Creating..." : "Create Club"}
                  </button>

                  <button
                    onClick={handleReset}
                    disabled={submitting}
                    className="px-4 py-2.5 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Reset
                  </button>

                </div>

              </div>

            </div>

          </div>

          {/* Right Side */}
          <div className="space-y-5 sm:space-y-6">

            {/* Tips */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 sm:p-5">

              <h3 className="flex items-center gap-2 font-semibold text-indigo-600 mb-3">
                <Sparkles size={16} />
                Tips for a great club
              </h3>

              <ul className="text-sm text-gray-600 space-y-2">
                <li>✦ Use a clear and descriptive name.</li>
                <li>✦ Explain what members will do.</li>
                <li>✦ Choose an eligible main organizer.</li>
                <li>✦ Make sure the club description is meaningful.</li>
              </ul>

            </div>

            {/* Statistics */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

              <div className="flex justify-between items-center p-4 border-b">

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Total Clubs
                  </p>

                  <p className="text-xs text-gray-400">
                    Across platform
                  </p>
                </div>

                <p
                  className="text-2xl font-extrabold bg-clip-text text-transparent"
                  style={{ backgroundImage: GRAD }}
                >
                  {totalClubs}
                </p>

              </div>

              <div className="flex justify-between items-center p-4">

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Eligible Users
                  </p>

                  <p className="text-xs text-gray-400">
                    Available to assign
                  </p>
                </div>

                <p
                  className="text-2xl font-extrabold bg-clip-text text-transparent"
                  style={{ backgroundImage: GRAD }}
                >
                  {loadingOrganizers ? "—" : organizers.length}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Toast */}
      {toast.msg && (

        <div
          role="alert"
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 px-4 sm:px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white flex items-center gap-2 max-w-[calc(100vw-2rem)] z-50 ${
            toast.type === "error" ? "bg-red-500" : ""
          }`}
          style={
            toast.type !== "error"
              ? { background: GRAD }
              : {}
          }
        >
          {toast.type === "error" ? (
            <AlertCircle size={15} className="shrink-0" />
          ) : (
            <CheckCircle2 size={15} className="shrink-0" />
          )}

          <span className="truncate">
            {toast.msg}
          </span>

        </div>

      )}

    </div>
  );
}
