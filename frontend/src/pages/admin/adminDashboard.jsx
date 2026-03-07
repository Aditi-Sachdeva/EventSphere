import { useState, useEffect } from "react";
import API from "../../api/api";

import ViewUsers from "./ViewUsers";
import CreateClub from "./CreateClub";
import ViewClubs from "./ViewClubs";
import ViewEvents from "./ViewEvents";

const NAV_LINKS = [
  { id: "dashboard",   label: "Dashboard",   icon: "⊞" },
  { id: "view-users",  label: "View Users",  icon: "👥" },
  { id: "create-club", label: "Create Club", icon: "＋" },
  { id: "view-clubs",  label: "View Clubs",  icon: "🏛" },
  { id: "view-events", label: "View Events", icon: "📅" },
];

const GRAD = "linear-gradient(to right, #ec4899, #6366f1)";
const CLUB_COLORS = ["bg-indigo-500", "bg-pink-500", "bg-violet-500", "bg-cyan-500"];

export default function AdminDashboard() {
  const [page, setPage] = useState("dashboard");
  const [open, setOpen] = useState(true);
  const [stats, setStats] = useState({ users: 0, clubs: 0, events: 0 });
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const usersRes = await API.get("/admin/users");
      const clubsRes = await API.get("/admin/clubs");
      const eventsRes = await API.get("/admin/events");

      setStats({
        users: usersRes.data.users.length,
        clubs: clubsRes.data.clubs.length,
        events: eventsRes.data.events.length,
      });

      setEvents(eventsRes.data.events.slice(0, 5));
      setClubs(clubsRes.data.clubs.slice(0, 4));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-pink-50">

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-5 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-500 transition-colors"
          >
            ☰
          </button>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-md" style={{ background: GRAD }}>
            ES
          </div>
          <span className="font-black text-lg text-gray-800">
            Event
            <span style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Sphere
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-52">
         
          
        </div>

        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: GRAD }}>A</div>
          <div>
            <div className="text-xs font-bold text-gray-800">Admin</div>
            <div className="text-xs font-semibold text-green-600 bg-green-50 px-2 rounded-full">● Logged in</div>
          </div>
        </div>
      </header>

      <div className="flex pt-16 flex-1">

        {/* Sidebar */}
        <aside
          className={`fixed top-16 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden ${open ? "w-56" : "w-16"}`}
          style={{ height: "calc(100vh - 64px)" }}
        >
          <nav className="p-2.5 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.id}
                onClick={() => setPage(link.id)}
                className={`w-full flex items-center gap-2.5 rounded-xl py-2.5 text-sm border-none cursor-pointer transition-all ${open ? "px-3" : "px-0 justify-center"} ${
                  page === link.id
                    ? "text-white font-bold shadow-lg"
                    : "text-gray-500 bg-transparent hover:bg-indigo-50 hover:text-indigo-500"
                }`}
                style={page === link.id ? { background: GRAD } : {}}
              >
                <span className="shrink-0">{link.icon}</span>
                {open && <span>{link.label}</span>}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className={`flex-1 transition-all duration-300 ${open ? "ml-56" : "ml-16"}`}>
          {page === "dashboard"   && <Dashboard stats={stats} events={events} clubs={clubs} />}
          {page === "view-users"  && <ViewUsers />}
          {page === "create-club" && <CreateClub />}
          {page === "view-clubs"  && <ViewClubs />}
          {page === "view-events" && <ViewEvents />}
        </main>

      </div>
    </div>
  );
}

function Dashboard({ stats, events, clubs }) {

  const STAT_CARDS = [
    { label: "Total Users",  value: stats.users,  icon: "👥", bg: "bg-indigo-50", text: "text-indigo-500", bar: "bg-indigo-500"  },
    { label: "Total Clubs",  value: stats.clubs,  icon: "🏛", bg: "bg-pink-50",   text: "text-pink-500",  bar: "bg-pink-500"    },
    { label: "Total Events", value: stats.events, icon: "📅", bg: "bg-violet-50", text: "text-violet-600", bar: "bg-violet-500" },
  ];

  const maxOrganizers = clubs.length ? Math.max(...clubs.map(c => c.organizers?.length || 1)) : 1;

  const activeClubs  = clubs.filter(c => c.isActive).length;
  const pendingEvents = events.filter(e => e.status === "pending").length;

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 border border-indigo-200 rounded-full px-2.5 py-1 mb-2">
            ● Overview
          </div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Dashboard</h1>
        </div>
       
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-3.5 mb-4">
        {STAT_CARDS.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all">
            <div className="flex justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl ${s.bg} ${s.text} flex items-center justify-center text-xl`}>{s.icon}</div>
            </div>
            <div className="text-xs text-gray-400 font-medium mb-1">{s.label}</div>
            <div className="text-3xl font-black text-gray-800 tracking-tight">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-3 gap-3.5">

        {/* Recent Events */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
            <span className="text-sm font-bold text-gray-800">Recent Events</span>
            {pendingEvents > 0 && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                ⚡ {pendingEvents} pending
              </span>
            )}
          </div>
          {events.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-gray-400">No events yet</div>
          ) : (
            events.map((ev, i) => (
              <div
                key={ev._id}
                className={`flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors ${i < events.length - 1 ? "border-b border-gray-50" : ""}`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">📅</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{ev.title}</div>
                    <div className="text-xs text-gray-400">{ev.club?.name}</div>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  ev.status === "approved"  ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                  ev.status === "pending"   ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                              "bg-red-50 text-red-600 border-red-200"
                }`}>
                  {ev.status}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Top Clubs */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
            <span className="text-sm font-bold text-gray-800">Top Clubs</span>
            <span className="text-xs text-gray-400">{activeClubs} active</span>
          </div>

          <div className="p-4 flex flex-col gap-3 flex-1">
            {clubs.length === 0 ? (
              <div className="text-center text-xs text-gray-400 py-4">No clubs yet</div>
            ) : (
              clubs.map((club, i) => (
                <div key={club._id} className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-gray-400 w-4 text-center">{i + 1}</span>
                  <div className={`w-8 h-8 rounded-xl ${CLUB_COLORS[i % CLUB_COLORS.length]} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                    {club.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-gray-800 mb-1">{club.name}</div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${CLUB_COLORS[i % CLUB_COLORS.length]} opacity-80 rounded-full`}
                          style={{ width: `${Math.max(20, ((club.organizers?.length || 0) / maxOrganizers) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{club.organizers?.length || 0} organizers</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Real stats footer */}
          <div className="mx-3.5 mb-3.5 rounded-2xl overflow-hidden">
            <div className="p-3.5 grid grid-cols-2 gap-2" style={{ background: GRAD }}>
              <div className="bg-white/20 rounded-xl py-2 text-center">
                <div className="text-base font-black text-white">{activeClubs}</div>
                <div className="text-xs text-white/70">Active Clubs</div>
              </div>
              <div className="bg-white/20 rounded-xl py-2 text-center">
                <div className="text-base font-black text-white">{pendingEvents}</div>
                <div className="text-xs text-white/70">Pending Events</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}