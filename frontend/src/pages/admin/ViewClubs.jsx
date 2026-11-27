
import { useState, useEffect, useCallback } from "react";
import axios from "../../api/axios";

const GRAD = "linear-gradient(to right, #ec4899, #6366f1)";

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const ViewClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [toast, setToast] = useState({
    msg: "",
    type: "",
  });

  const [confirmDeactivate, setConfirmDeactivate] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

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

  // Fetch all clubs
  const fetchClubs = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const response = await axios.get("/api/admin/clubs");

      const fetchedClubs = response.data?.clubs;

      if (!Array.isArray(fetchedClubs)) {
        throw new Error("Invalid club data received from server.");
      }

      setClubs(fetchedClubs);

    } catch (error) {
      console.error(
        "Failed to fetch clubs:",
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
        "Failed to fetch clubs."
      );

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  // Open confirmation before deactivating
  const toggleStatus = (club) => {
    if (!club?._id || togglingId !== null) return;

    if (club.isActive) {
      setConfirmDeactivate(club);
    } else {
      doToggle(club);
    }
  };

  // Activate or deactivate a club
  const doToggle = async (club) => {
    if (!club?._id || togglingId !== null) return;

    setTogglingId(club._id);
    setConfirmDeactivate(null);

    try {
      let response;

      if (club.isActive) {
        response = await axios.put(
          `/api/admin/club/deactivate/${club._id}`,
          {}
        );
      } else {
        response = await axios.put(
          `/api/admin/club/reactivate/${club._id}`,
          {}
        );
      }

      const updatedClub = response.data?.club;

      const newStatus =
        typeof updatedClub?.isActive === "boolean"
          ? updatedClub.isActive
          : !club.isActive;

      setClubs((prev) =>
        prev.map((item) =>
          item._id === club._id
            ? {
                ...item,
                ...(updatedClub || {}),
                isActive: newStatus,
              }
            : item
        )
      );

      showToast(
        response.data?.msg ||
        `"${club.name}" ${
          newStatus ? "reactivated" : "deactivated"
        } successfully`
      );

    } catch (error) {
      console.error(
        "Club status update failed:",
        error.response?.data || error
      );

      showToast(
        error.response?.data?.msg ||
        "Failed to update club status.",
        "error"
      );

    } finally {
      setTogglingId(null);
    }
  };

  // Search and filter
  const filteredClubs = clubs.filter((club) => {
    const query = search.toLowerCase();

    const matchesSearch =
      !query ||
      club.name?.toLowerCase().includes(query) ||
      club.mainOrganizer?.name?.toLowerCase().includes(query) ||
      club.mainOrganizer?.email?.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && club.isActive) ||
      (statusFilter === "inactive" && !club.isActive);

    return matchesSearch && matchesStatus;
  });

  // Statistics
  const stats = {
    total: clubs.length,
    active: clubs.filter((club) => club.isActive).length,
    inactive: clubs.filter((club) => !club.isActive).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 py-6 sm:py-8 px-3 sm:px-4">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-5 sm:mb-6">

          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              Administration
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              Manage Clubs
            </h1>

            <p className="text-sm text-gray-500">
              Monitor and manage all clubs
            </p>
          </div>

          <div className="self-start sm:self-auto bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 flex items-center gap-2 shadow-sm whitespace-nowrap">
            🏛 {stats.total} clubs
          </div>

        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">

          {[
            {
              label: "Total",
              value: stats.total,
              bg: "bg-indigo-100",
              color: "text-indigo-700",
              icon: "🏛",
            },
            {
              label: "Active",
              value: stats.active,
              bg: "bg-emerald-100",
              color: "text-emerald-700",
              icon: "✅",
            },
            {
              label: "Inactive",
              value: stats.inactive,
              bg: "bg-red-100",
              color: "text-red-700",
              icon: "⏸️",
            },
          ].map((stat) => (

            <div
              key={stat.label}
              className="bg-white rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-sm flex items-center gap-2 sm:gap-4 hover:shadow-md transition-all"
            >

              <div
                className={`w-9 h-9 sm:w-12 sm:h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center text-lg sm:text-2xl shrink-0`}
              >
                {stat.icon}
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>

                <div className="text-xs text-gray-500 mt-0.5">
                  {stat.label}
                </div>
              </div>

            </div>

          ))}

        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 mb-5 sm:mb-6 shadow-sm flex flex-col gap-3">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clubs or organizers..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <div className="flex items-center gap-2 flex-wrap">

            <span className="text-xs font-semibold text-gray-400">
              Status:
            </span>

            {["all", "active", "inactive"].map((status) => (

              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  statusFilter === status
                    ? "text-white border-transparent shadow-md"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-indigo-50"
                }`}
                style={
                  statusFilter === status
                    ? { background: GRAD }
                    : {}
                }
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>

            ))}

          </div>

        </div>

        {/* Clubs List */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">

          {/* Desktop Header */}
          <div className="hidden md:grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">

            <div className="col-span-4">
              Club
            </div>

            <div className="col-span-3">
              Main Organizer
            </div>

            <div className="col-span-2">
              Organizers
            </div>

            <div className="col-span-2">
              Status
            </div>

            <div className="col-span-1 text-right">
              Actions
            </div>

          </div>

          {/* Loading */}
          {loading ? (

            <div className="p-12 text-center text-gray-400 text-sm animate-pulse">
              Loading clubs...
            </div>

          ) : loadError ? (

            <div className="p-8 sm:p-12 text-center">

              <p className="text-red-500 text-sm font-semibold mb-2">
                Unable to load clubs
              </p>

              <p className="text-gray-500 text-sm mb-4">
                {loadError}
              </p>

              <button
                onClick={fetchClubs}
                className="px-5 py-2 rounded-xl text-white text-sm font-semibold"
                style={{ background: GRAD }}
              >
                Try Again
              </button>

            </div>

          ) : filteredClubs.length === 0 ? (

            <div className="p-12 text-center text-gray-400 text-sm">
              No clubs match your filters
            </div>

          ) : (

            <div className="divide-y divide-gray-100">

              {filteredClubs.map((club) => (

                <div
                  key={club._id}
                  className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
                >

                  {/* Desktop Row */}
                  <div className="hidden md:grid grid-cols-12 items-center gap-2">

                    {/* Club */}
                    <div className="col-span-4 flex items-center gap-3">

                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm uppercase shrink-0"
                        style={{ background: GRAD }}
                      >
                        {club.name?.[0] || "C"}
                      </div>

                      <div className="min-w-0">

                        <div className="font-semibold text-gray-900 text-sm truncate">
                          {club.name}
                        </div>

                        <div className="text-xs text-gray-400">
                          Created {formatDate(club.createdAt)}
                        </div>

                      </div>

                    </div>

                    {/* Main Organizer */}
                    <div className="col-span-3">

                      {club.mainOrganizer ? (

                        <div className="flex items-center gap-2">

                          <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                            {club.mainOrganizer.name?.[0]?.toUpperCase() || "?"}
                          </div>

                          <div className="min-w-0">

                            <div className="text-xs font-semibold text-gray-700 truncate">
                              {club.mainOrganizer.name}
                            </div>

                            <div className="text-xs text-gray-400 truncate">
                              {club.mainOrganizer.email}
                            </div>

                          </div>

                        </div>

                      ) : (

                        <span className="text-xs text-gray-400">
                          —
                        </span>

                      )}

                    </div>

                    {/* Organizers */}
                    <div className="col-span-2">

                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                        👥 {club.organizers?.length || 0}
                      </span>

                    </div>

                    {/* Status */}
                    <div className="col-span-2">

                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                          club.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-600 border-red-200"
                        }`}
                      >
                        {club.isActive ? "● Active" : "● Inactive"}
                      </span>

                    </div>

                    {/* Action */}
                    <div className="col-span-1 flex justify-end">

                      <button
                        onClick={() => toggleStatus(club)}
                        disabled={togglingId !== null}
                        title={
                          club.isActive
                            ? "Deactivate"
                            : "Reactivate"
                        }
                        className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all text-sm disabled:opacity-50 ${
                          club.isActive
                            ? "bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 border-red-100"
                            : "bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700 border-emerald-100"
                        }`}
                      >
                        {togglingId === club._id
                          ? "⏳"
                          : club.isActive
                            ? "⏸️"
                            : "▶️"}
                      </button>

                    </div>

                  </div>

                  {/* Mobile Card */}
                  <div className="md:hidden flex flex-col gap-3">

                    {/* Top Row */}
                    <div className="flex items-center gap-3">

                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm uppercase shrink-0"
                        style={{ background: GRAD }}
                      >
                        {club.name?.[0] || "C"}
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="font-semibold text-gray-900 text-sm truncate">
                          {club.name}
                        </div>

                        <div className="text-xs text-gray-400">
                          Created {formatDate(club.createdAt)}
                        </div>

                      </div>

                      <button
                        onClick={() => toggleStatus(club)}
                        disabled={togglingId !== null}
                        title={
                          club.isActive
                            ? "Deactivate"
                            : "Reactivate"
                        }
                        className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all text-sm disabled:opacity-50 shrink-0 ${
                          club.isActive
                            ? "bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 border-red-100"
                            : "bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700 border-emerald-100"
                        }`}
                      >
                        {togglingId === club._id
                          ? "⏳"
                          : club.isActive
                            ? "⏸️"
                            : "▶️"}
                      </button>

                    </div>

                    {/* Organizer, Count and Status */}
                    <div className="flex items-center gap-2 flex-wrap pl-1">

                      {club.mainOrganizer ? (

                        <div className="flex items-center gap-1.5">

                          <div className="w-5 h-5 rounded-md bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                            {club.mainOrganizer.name?.[0]?.toUpperCase() || "?"}
                          </div>

                          <span className="text-xs font-semibold text-gray-700 truncate max-w-[120px]">
                            {club.mainOrganizer.name}
                          </span>

                        </div>

                      ) : (

                        <span className="text-xs text-gray-400">
                          No organizer
                        </span>

                      )}

                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                        👥 {club.organizers?.length || 0}
                      </span>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          club.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-600 border-red-200"
                        }`}
                      >
                        {club.isActive ? "● Active" : "● Inactive"}
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      {/* Deactivate Confirmation Modal */}
      {confirmDeactivate && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">

          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-gray-100">

            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-2xl mb-4 mx-auto">
              ⏸️
            </div>

            <h3 className="text-lg font-black text-gray-900 text-center mb-1">
              Deactivate Club?
            </h3>

            <p className="text-sm text-gray-500 text-center mb-1">
              You're about to deactivate
            </p>

            <p className="text-sm font-bold text-gray-800 text-center mb-5">
              "{confirmDeactivate.name}"
            </p>

            <p className="text-xs text-amber-600 text-center mb-6 bg-amber-50 rounded-xl px-3 py-2 border border-amber-100">
              ⚠️ Members won't be able to join or create events under this club.
            </p>

            <div className="flex gap-3">

              <button
                onClick={() => setConfirmDeactivate(null)}
                disabled={togglingId !== null}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={() => doToggle(confirmDeactivate)}
                disabled={togglingId !== null}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-50"
              >
                {togglingId === confirmDeactivate._id
                  ? "Processing..."
                  : "Deactivate"}
              </button>

            </div>

          </div>

        </div>

      )}

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
          {toast.type === "error" ? "❌" : "✅"}

          <span className="truncate">
            {toast.msg}
          </span>

        </div>

      )}

    </div>
  );
};

export default ViewClubs;
