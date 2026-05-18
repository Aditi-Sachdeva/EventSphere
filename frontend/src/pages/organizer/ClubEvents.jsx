import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import OrganizerLayout from "./OrganizerLayout";

const API = "http://localhost:5000/api";
const GRAD = "linear-gradient(to right, #ec4899, #6366f1)";
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

function fmt(dateStr) {
  if (!dateStr) return "Date not set";
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function statusPill(status) {
  switch ((status || "upcoming").toLowerCase()) {
    case "ongoing":   return "bg-green-100 text-green-700";
    case "cancelled": return "bg-red-100 text-red-600";
    default:          return "bg-indigo-100 text-indigo-700";
  }
}

export default function ClubEvents() {
  const navigate = useNavigate();
  const [clubEvents, setClubEvents] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState("all");
  const [toast, setToast]           = useState({ msg: "", type: "" });

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  }

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/login"); return; }
    const parsed = JSON.parse(stored);
    const clubId = parsed?.clubId || parsed?.club?._id || parsed?.club;
    if (clubId) {
      axios.get(`${API}/event/club/${clubId}`, auth())
        .then(r => setClubEvents(r.data.events || r.data || []))
        .catch(() => showToast("Failed to load events", "error"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const filtered = filter === "all"
    ? clubEvents
    : clubEvents.filter(e => (e.status || "upcoming").toLowerCase() === filter);

  return (
    <OrganizerLayout>
      {({ clubName }) => (
        <>
          {/* ── Header row with Scan button ── */}
          <div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent truncate">
                Club Events
              </h2>
              <p className="text-gray-500 text-sm mt-1 truncate">
                All events organized by {clubName || "your club"}
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

          {/* ── Stats row ── */}
          <div className="grid grid-cols-3 gap-2 sm:gap-5 mb-6 sm:mb-8">
            {[
              {
                label: "Total Events",
                shortLabel: "Total",
                value: clubEvents.length,
              },
              {
                label: "Upcoming",
                shortLabel: "Soon",
                value: clubEvents.filter(
                  e => (e.status || "").toLowerCase() === "approved"
                ).length,
              },
              {
                label: "Pending",
                shortLabel: "Pending",
                value: clubEvents.filter(
                  e => (e.status || "").toLowerCase() !== "approved"
                ).length,
              },
            ].map(({ label, shortLabel, value }) => (
              <div
                key={label}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-5 min-w-0"
              >
                <p className="text-[9px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider mb-1 truncate">
                  <span className="sm:hidden">{shortLabel}</span>
                  <span className="hidden sm:inline">{label}</span>
                </p>
                <p className="text-xl sm:text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* ── Filter pills ── */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["all", "upcoming", "ongoing", "cancelled"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium capitalize transition
                  ${filter === f
                    ? "text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-pink-300"
                  }`}
                style={filter === f ? { background: GRAD } : {}}
              >
                {f}
              </button>
            ))}
          </div>

          {/* ── Event cards ── */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                  <div className="h-36 bg-gray-100 rounded-xl mb-4" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 sm:py-16 px-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-pink-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4 text-2xl">
                📅
              </div>
              <p className="text-gray-500 text-sm">
                No {filter !== "all" ? filter : ""} events found.
              </p>
              <Link
                to="/organizer/create"
                className="mt-3 inline-block text-sm font-semibold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent"
              >
                Create your first event →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map(event => (
                <div
                  key={event._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden"
                >
                  {event.image
                    ? <img src={event.image} alt={event.title} className="h-36 w-full object-cover" />
                    : (
                      <div className="h-36 bg-gradient-to-br from-pink-100 to-indigo-100 flex items-center justify-center px-4">
                        <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent text-center line-clamp-2">
                          {event.title}
                        </span>
                      </div>
                    )
                  }

                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base leading-snug line-clamp-2 min-w-0">
                        {event.title}
                      </h4>
                      <span className={`text-xs px-2 sm:px-2.5 py-1 rounded-full font-medium whitespace-nowrap capitalize shrink-0 ${statusPill(event.status)}`}>
                        {event.status || "upcoming"}
                      </span>
                    </div>

                    <div className="space-y-1.5 mb-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1 min-w-0">
                        <span>📅</span>
                        <span className="truncate">{fmt(event.eventDate)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1 min-w-0">
                          <span>📍</span>
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                      <div>
                        👥 {event.registrations?.length ?? 0} / {event.totalSeats ?? "∞"} registered
                      </div>
                      {event.registrations?.length > 0 && (
                        <div>
                          ✅ {event.registrations.filter(r => r.attended).length} checked in
                        </div>
                      )}
                    </div>

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
              ))}
            </div>
          )}

          {/* ── Toast ── */}
          {toast.msg && (
            <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 px-4 sm:px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2 max-w-[calc(100vw-2rem)]
              ${toast.type === "error"
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-white border border-gray-200 text-gray-800"
              }`}
            >
              {toast.type === "error"
                ? <AlertCircle size={15} className="text-red-500 shrink-0" />
                : <CheckCircle2 size={15} className="text-green-500 shrink-0" />
              }
              <span className="truncate">{toast.msg}</span>
            </div>
          )}
        </>
      )}
    </OrganizerLayout>
  );
}