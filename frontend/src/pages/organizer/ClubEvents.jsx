
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import axios from "../../api/axios";
import OrganizerLayout from "./OrganizerLayout";

const GRAD = "linear-gradient(to right, #ec4899, #6366f1)";

function fmt(dateStr) {
  if (!dateStr) return "Date not set";

  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isUpcoming(event) {
  const date = new Date(event.eventDate);

  return (
    !Number.isNaN(date.getTime()) &&
    date > new Date()
  );
}

function isPast(event) {
  const date = new Date(event.eventDate);

  return (
    !Number.isNaN(date.getTime()) &&
    date <= new Date()
  );
}

function getRegisteredCount(event) {
  if (
    typeof event.totalSeats !== "number" ||
    typeof event.availableSeats !== "number"
  ) {
    return null;
  }

  return Math.max(
    0,
    event.totalSeats - event.availableSeats
  );
}

function statusPill(status) {
  switch ((status || "").toLowerCase()) {
    case "approved":
      return "bg-green-100 text-green-700";

    case "cancelled":
      return "bg-red-100 text-red-600";

    case "pending":
      return "bg-yellow-100 text-yellow-700";

    default:
      return "bg-indigo-100 text-indigo-700";
  }
}

export default function ClubEvents() {
  const navigate = useNavigate();

  const [clubEvents, setClubEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState("all");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      setLoading(true);
      setLoadError("");

      try {
        const stored = localStorage.getItem("user");

        if (!stored) {
          navigate("/login");
          return;
        }

        let parsed;

        try {
          parsed = JSON.parse(stored);
        } catch {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const clubId =
          parsed?.clubId ||
          parsed?.club?._id ||
          parsed?.club?.id ||
          parsed?.club;

        if (!clubId || typeof clubId !== "string") {
          throw new Error(
            "No club is associated with this organizer account."
          );
        }

        const response = await axios.get(
          `/api/event/club/${encodeURIComponent(clubId)}`
        );

        if (cancelled) return;

        const events = response.data?.events;

        if (!Array.isArray(events)) {
          throw new Error(
            "Invalid response received while fetching events."
          );
        }

        setClubEvents(events);
      } catch (error) {
        console.error("Failed to load club events:", error);

        if (!cancelled) {
          setLoadError(
            error.response?.data?.msg ||
            error.message ||
            "Failed to load events. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      cancelled = true;
    };
  }, [navigate, reloadKey]);

  const filtered = clubEvents.filter((event) => {
    if (filter === "upcoming") {
      return isUpcoming(event);
    }

    if (filter === "past") {
      return isPast(event);
    }

    return true;
  });

  const upcomingCount = clubEvents.filter(isUpcoming).length;
  const pastCount = clubEvents.filter(isPast).length;

  const filters = ["all", "upcoming", "past"];

  return (
    <OrganizerLayout>
      {({ clubName }) => (
        <>

          {/* Header */}
          <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent truncate">
                Club Events
              </h2>

              <p className="text-gray-500 text-sm mt-1 truncate">
                All approved events organized by{" "}
                {clubName || "your club"}
              </p>
            </div>

            <button
              onClick={() => navigate("/scan")}
              className="self-start sm:self-auto shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white shadow hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
              style={{ background: GRAD }}
            >
              📷 Scan Attendance
            </button>

          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-2 sm:gap-5 mb-6 sm:mb-8">

            {[
              {
                label: "Total Approved",
                shortLabel: "Total",
                value: clubEvents.length,
              },
              {
                label: "Upcoming",
                shortLabel: "Soon",
                value: upcomingCount,
              },
              {
                label: "Past Events",
                shortLabel: "Past",
                value: pastCount,
              },
            ].map(({ label, shortLabel, value }) => (

              <div
                key={label}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-5 min-w-0"
              >
                <p className="text-[9px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider mb-1 truncate">
                  <span className="sm:hidden">
                    {shortLabel}
                  </span>

                  <span className="hidden sm:inline">
                    {label}
                  </span>
                </p>

                <p className="text-xl sm:text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
                  {value}
                </p>
              </div>

            ))}

          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">

            {filters.map((f) => (

              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium capitalize transition
                  ${
                    filter === f
                      ? "text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-pink-300"
                  }`}
                style={
                  filter === f
                    ? { background: GRAD }
                    : {}
                }
              >
                {f === "all" ? "All Events" : f}
              </button>

            ))}

          </div>

          {/* Loading */}
          {loading ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

              {[1, 2, 3].map((i) => (

                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse"
                >
                  <div className="h-36 bg-gray-100 rounded-xl mb-4" />

                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />

                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>

              ))}

            </div>

          ) : loadError ? (

            /* Error */
            <div className="bg-white rounded-2xl border border-red-100 p-8 text-center">

              <AlertCircle
                size={35}
                className="text-red-500 mx-auto mb-3"
              />

              <p className="text-gray-700 font-semibold">
                Unable to load events
              </p>

              <p className="text-sm text-gray-500 mt-2">
                {loadError}
              </p>

              <button
                onClick={() => setReloadKey((prev) => prev + 1)}
                className="mt-5 px-5 py-2 rounded-full text-sm font-semibold text-white"
                style={{ background: GRAD }}
              >
                Try Again
              </button>

            </div>

          ) : filtered.length === 0 ? (

            /* Empty state */
            <div className="text-center py-12 sm:py-16 px-4">

              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-pink-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4 text-2xl">
                📅
              </div>

              <p className="text-gray-500 text-sm">
                {clubEvents.length === 0
                  ? "No approved events found for your club."
                  : `No ${filter} events found.`}
              </p>

              <Link
                to="/organizer/create"
                className="mt-3 inline-block text-sm font-semibold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent"
              >
                Create a new event →
              </Link>

            </div>

          ) : (

            /* Event cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

              {filtered.map((event) => {

                const registeredCount = getRegisteredCount(event);

                return (

                  <div
                    key={event._id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden"
                  >

                    {/* Event image */}
                    {event.image ? (

                      <img
                        src={event.image}
                        alt={event.title || "Event"}
                        className="h-36 w-full object-cover"
                      />

                    ) : (

                      <div className="h-36 bg-gradient-to-br from-pink-100 to-indigo-100 flex items-center justify-center px-4">

                        <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent text-center line-clamp-2">
                          {event.title || "Untitled Event"}
                        </span>

                      </div>

                    )}

                    {/* Event details */}
                    <div className="p-4 sm:p-5 flex flex-col flex-1">

                      <div className="flex items-start justify-between gap-2 mb-3">

                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base leading-snug line-clamp-2 min-w-0">
                          {event.title}
                        </h4>

                        <span
                          className={`text-xs px-2 sm:px-2.5 py-1 rounded-full font-medium whitespace-nowrap capitalize shrink-0 ${statusPill(event.status)}`}
                        >
                          {event.status || "approved"}
                        </span>

                      </div>

                      <div className="space-y-1.5 mb-4 text-xs text-gray-500">

                        <div className="flex items-center gap-1 min-w-0">
                          <span>📅</span>

                          <span className="truncate">
                            {fmt(event.eventDate)}
                          </span>
                        </div>

                        {event.location && (

                          <div className="flex items-center gap-1 min-w-0">
                            <span>📍</span>

                            <span className="truncate">
                              {event.location}
                            </span>
                          </div>

                        )}

                        <div>
                          👥{" "}
                          {registeredCount !== null
                            ? `${registeredCount} / ${event.totalSeats} registered`
                            : "Registration details unavailable"}
                        </div>

                        {typeof event.availableSeats === "number" && (

                          <div>
                            🎟️ {event.availableSeats} seats available
                          </div>

                        )}

                      </div>

                      {/* Actions */}
                      <div className="mt-auto flex gap-2">

                        <Link
                          to={`/events/${event._id}`}
                          className="flex-1 text-center py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:border-pink-300 hover:text-pink-600 transition"
                        >
                          View
                        </Link>

                        <button
                          onClick={() => navigate("/scan")}
                          className="flex-1 py-2 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition"
                          style={{ background: GRAD }}
                        >
                          📷 Scan
                        </button>

                      </div>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </>
      )}
    </OrganizerLayout>
  );
}
