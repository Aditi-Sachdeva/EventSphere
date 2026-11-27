
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";

import ViewUsers from "./ViewUsers";
import CreateClub from "./CreateClub";
import ViewClubs from "./ViewClubs";
import ViewEvents from "./ViewEvents";

const NAV_LINKS = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "view-users", label: "View Users", icon: "👥" },
  { id: "create-club", label: "Create Club", icon: "＋" },
  { id: "view-clubs", label: "View Clubs", icon: "🏛" },
  { id: "view-events", label: "View Events", icon: "📅" },
];

const GRAD = "linear-gradient(to right, #ec4899, #6366f1)";
const CLUB_COLORS = [
  "bg-indigo-500",
  "bg-pink-500",
  "bg-violet-500",
  "bg-cyan-500",
];

export default function AdminDashboard() {
  const [page, setPage] = useState("dashboard");
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [stats, setStats] = useState({
    users: 0,
    clubs: 0,
    events: 0,
  });

  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    function onResize() {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setOpen(!mobile);
    }

    onResize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [usersRes, clubsRes, eventsRes] = await Promise.all([
        axios.get("/api/admin/users"),
        axios.get("/api/admin/clubs"),
        axios.get("/api/admin/events"),
      ]);

      const users = Array.isArray(usersRes.data?.users)
        ? usersRes.data.users
        : [];

      const allClubs = Array.isArray(clubsRes.data?.clubs)
        ? clubsRes.data.clubs
        : [];

      const allEvents = Array.isArray(eventsRes.data?.events)
        ? eventsRes.data.events
        : [];

      setStats({
        users: users.length,
        clubs: allClubs.length,
        events: allEvents.length,
      });

      setEvents(allEvents.slice(0, 5));
      setClubs(allClubs.slice(0, 4));
    } catch (err) {
      console.error("Error fetching admin dashboard data:", err);

      setError(
        err.response?.data?.msg ||
          "Unable to load dashboard data. Please refresh the page."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  function handleNavClick(id) {
    setPage(id);

    if (isMobile) {
      setOpen(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <header className="fixed top-0 inset-x-0 z-50 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-5 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-500 transition-colors"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>

          <Link to="/mainpage" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-md"
              style={{ background: GRAD }}
            >
              ES
            </div>

            <h1 className="text-base sm:text-lg font-bold hidden sm:block">
              Event
              <span
                style={{
                  background: GRAD,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Sphere
              </span>
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ background: GRAD }}
          >
            A
          </div>

          <div className="hidden sm:block">
            <div className="text-sm font-bold text-gray-800">Admin</div>
          </div>
        </div>
      </header>

      <div className="flex pt-16 flex-1 relative">
        {isMobile && open && (
          <div
            className="fixed inset-0 top-16 z-30 bg-black/30"
            onClick={() => setOpen(false)}
          />
        )}

        <aside
          className={`fixed top-16 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden ${
            open ? "w-56" : "w-0 md:w-16"
          }`}
          style={{ height: "calc(100vh - 64px)" }}
        >
          <nav className="p-2.5 flex flex-col gap-1 min-w-[14rem] md:min-w-0">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center gap-2.5 rounded-xl py-2.5 text-sm border-none cursor-pointer transition-all ${
                  open ? "px-3" : "px-0 justify-center"
                } ${
                  page === link.id
                    ? "text-white font-bold shadow-lg"
                    : "text-gray-500 bg-transparent hover:bg-indigo-50 hover:text-indigo-500"
                }`}
                style={page === link.id ? { background: GRAD } : {}}
                title={!open ? link.label : undefined}
              >
                <span className="shrink-0">{link.icon}</span>

                {open && (
                  <span className="whitespace-nowrap">{link.label}</span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        <main
          className={`flex-1 transition-all duration-300 ${
            open && !isMobile ? "ml-56" : "ml-0 md:ml-16"
          }`}
        >
          {page === "dashboard" && (
            <Dashboard
              stats={stats}
              events={events}
              clubs={clubs}
              loading={loading}
              error={error}
              onRetry={fetchDashboardData}
            />
          )}

          {page === "view-users" && <ViewUsers />}
          {page === "create-club" && <CreateClub />}
          {page === "view-clubs" && <ViewClubs />}
          {page === "view-events" && <ViewEvents />}
        </main>
      </div>
    </div>
  );
}

function Dashboard({ stats, events, clubs, loading, error, onRetry }) {
  const STAT_CARDS = [
    {
      label: "Total Users",
      value: stats.users,
      icon: "👥",
      bg: "bg-indigo-50",
      text: "text-indigo-500",
    },
    {
      label: "Total Clubs",
      value: stats.clubs,
      icon: "🏛",
      bg: "bg-pink-50",
      text: "text-pink-500",
    },
    {
      label: "Total Events",
      value: stats.events,
      icon: "📅",
      bg: "bg-violet-50",
      text: "text-violet-600",
    },
  ];

  const maxOrganizers = clubs.length
    ? Math.max(...clubs.map((club) => club.organizers?.length || 1))
    : 1;

  const activeClubs = clubs.filter((club) => club.isActive).length;

  const pendingEvents = events.filter(
    (event) => event.status === "pending"
  ).length;

  if (loading) {
    return (
      <div className="p-6 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <p className="text-sm text-red-600 mb-4">{error}</p>

        <button
          type="button"
          onClick={onRetry}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: GRAD }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-end justify-between mb-5 sm:mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 border border-indigo-200 rounded-full px-2.5 py-1 mb-2">
            ● Overview
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight">
            Dashboard
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5 mb-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all"
          >
            <div className="flex justify-between mb-3 sm:mb-4">
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${card.bg} ${card.text} flex items-center justify-center text-lg sm:text-xl`}
              >
                {card.icon}
              </div>
            </div>

            <div className="text-xs text-gray-400 font-medium mb-1">
              {card.label}
            </div>

            <div className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">
              {card.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-3.5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
            <span className="text-sm font-bold text-gray-800">
              Recent Events
            </span>

            {pendingEvents > 0 && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                ⚡ {pendingEvents} pending
              </span>
            )}
          </div>

          {events.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-gray-400">
              No events yet
            </div>
          ) : (
            events.map((event, index) => (
              <div
                key={event._id}
                className={`flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors ${
                  index < events.length - 1 ? "border-b border-gray-50" : ""
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                    📅
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">
                      {event.title || "Untitled event"}
                    </div>

                    <div className="text-xs text-gray-400 truncate">
                      {event.club?.name || "Club not available"}
                    </div>
                  </div>
                </div>

                <span
                  className={`ml-2 shrink-0 text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                    event.status === "approved"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : event.status === "pending"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : "bg-red-50 text-red-600 border-red-200"
                  }`}
                >
                  {event.status
                    ? event.status.charAt(0).toUpperCase() +
                      event.status.slice(1)
                    : "Unknown"}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
            <span className="text-sm font-bold text-gray-800">Top Clubs</span>

            <span className="text-xs text-gray-400">
              {activeClubs} active
            </span>
          </div>

          <div className="p-4 flex flex-col gap-3 flex-1">
            {clubs.length === 0 ? (
              <div className="text-center text-xs text-gray-400 py-4">
                No clubs yet
              </div>
            ) : (
              clubs.map((club, index) => (
                <div key={club._id} className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-gray-400 w-4 text-center shrink-0">
                    {index + 1}
                  </span>

                  <div
                    className={`w-8 h-8 rounded-xl ${
                      CLUB_COLORS[index % CLUB_COLORS.length]
                    } flex items-center justify-center text-white text-xs font-bold shadow-md shrink-0`}
                  >
                    {club.name?.charAt(0)?.toUpperCase() || "C"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-800 mb-1 truncate">
                      {club.name || "Unnamed club"}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            CLUB_COLORS[index % CLUB_COLORS.length]
                          } opacity-80 rounded-full`}
                          style={{
                            width: `${
                              Math.max(
                                20,
                                ((club.organizers?.length || 0) /
                                  maxOrganizers) *
                                  100
                              )
                            }%`,
                          }}
                        />
                      </div>

                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {club.organizers?.length || 0} org
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mx-3.5 mb-3.5 rounded-2xl overflow-hidden">
            <div
              className="p-3.5 grid grid-cols-2 gap-2"
              style={{ background: GRAD }}
            >
              <div className="bg-white/20 rounded-xl py-2 text-center">
                <div className="text-base font-black text-white">
                  {activeClubs}
                </div>
                <div className="text-xs text-white/70">Active Clubs</div>
              </div>

              <div className="bg-white/20 rounded-xl py-2 text-center">
                <div className="text-base font-black text-white">
                  {pendingEvents}
                </div>
                <div className="text-xs text-white/70">Pending Events</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
