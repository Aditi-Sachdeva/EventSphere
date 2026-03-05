import { useState } from "react";
import ViewUsers from "./ViewUsers";
import CreateClub from "./CreateClub";
import ViewClubs from "./ViewClubs";
import ViewEvents from "./ViewEvents";


const SIDEBAR_LINKS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: "view-users",
    label: "View Users",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <circle cx="9" cy="7" r="4" />
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" />
        <path d="M21 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "create-club",
    label: "Create Club",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "view-clubs",
    label: "View Clubs",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "view-events",
    label: "View Events",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" strokeLinecap="round" strokeWidth="2.5" />
      </svg>
    ),
  },
];

const STATS = [
  {
    id: "users",
    label: "Total Users",
    value: "4,821",
    change: "+12%",
    positive: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <circle cx="9" cy="7" r="4" />
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" />
        <path d="M21 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" />
      </svg>
    ),
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    text: "text-violet-600",
    accent: "bg-violet-100",
  },
  {
    id: "clubs",
    label: "Total Clubs",
    value: "138",
    change: "+5%",
    positive: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" />
      </svg>
    ),
    gradient: "from-fuchsia-500 to-pink-500",
    bg: "bg-fuchsia-50",
    text: "text-fuchsia-600",
    accent: "bg-fuchsia-100",
  },
  {
    id: "events",
    label: "Total Events",
    value: "2,047",
    change: "+18%",
    positive: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
      </svg>
    ),
    gradient: "from-indigo-500 to-violet-500",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    accent: "bg-indigo-100",
  },
];

const RECENT_EVENTS = [
  { name: "Tech Symposium 2026", club: "Tech Club", date: "Mar 10", attendees: 340, status: "Upcoming" },
  { name: "Cultural Fest Night", club: "Arts Society", date: "Mar 7", attendees: 210, status: "Upcoming" },
  { name: "Hackathon Spring", club: "Dev Guild", date: "Feb 28", attendees: 180, status: "Done" },
  { name: "Leadership Summit", club: "Business Club", date: "Feb 22", attendees: 95, status: "Done" },
  { name: "Photography Walk", club: "Lens Club", date: "Feb 18", attendees: 60, status: "Done" },
];

const TOP_CLUBS = [
  { name: "Tech Club", members: 420, events: 34, color: "bg-violet-500" },
  { name: "Arts Society", members: 310, events: 28, color: "bg-fuchsia-500" },
  { name: "Dev Guild", members: 275, events: 22, color: "bg-indigo-500" },
  { name: "Business Club", members: 230, events: 19, color: "bg-purple-500" },
];

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Sora:wght@600;700;800&display=swap');
        * { box-sizing: border-box; }
        :root {
          --purple-brand: #7c3aed;
          --purple-light: #ede9fe;
          --purple-mid: #a78bfa;
        }
        .sidebar-link { transition: all 0.18s ease; }
        .sidebar-link:hover { transform: translateX(3px); }
        .stat-card { transition: all 0.2s ease; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px -8px rgba(124,58,237,0.15); }
        .fade-in { animation: fadeIn 0.5s ease both; }
        .fade-in-1 { animation: fadeIn 0.5s 0.05s ease both; }
        .fade-in-2 { animation: fadeIn 0.5s 0.1s ease both; }
        .fade-in-3 { animation: fadeIn 0.5s 0.15s ease both; }
        .fade-in-4 { animation: fadeIn 0.5s 0.2s ease both; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .shimmer { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #6d28d9 100%); }
        .badge-upcoming { background: #ede9fe; color: #6d28d9; }
        .badge-done { background: #dcfce7; color: #15803d; }
        .scroll-area::-webkit-scrollbar { width: 4px; }
        .scroll-area::-webkit-scrollbar-track { background: transparent; }
        .scroll-area::-webkit-scrollbar-thumb { background: #ddd6fe; border-radius: 4px; }
      `}</style>

      {/* ── NAVBAR ── */}
      <header className="h-16 bg-white border-b border-gray-100 flex items-center px-5 justify-between fixed top-0 left-0 right-0 z-40 shadow-sm">
        {/* Left: hamburger + brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-violet-50 text-gray-500 hover:text-violet-600 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
            </svg>
          </button>
          <div className="flex items-center gap-2.5">
            {/* Logo mark */}
            <div className="w-8 h-8 shimmer rounded-lg flex items-center justify-center shadow-md shadow-violet-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round" />
                <path d="M12 6V2M18 6l2.5-2.5M22 12h-4" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800 }} className="text-gray-900 text-lg tracking-tight">
              Event<span className="text-violet-600">Sphere</span>
            </span>
          </div>
        </div>

        {/* Right: search + admin badge */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-56">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-400">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input placeholder="Search…" className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full" />
          </div>

          {/* Notification bell */}
          <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-violet-50 text-gray-500 hover:text-violet-600 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Admin badge */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
            <div className="w-8 h-8 shimmer rounded-full flex items-center justify-center shadow-md shadow-violet-200 text-white text-xs font-bold">A</div>
            <div className="hidden md:block">
              <p className="text-sm font-600 text-gray-800 leading-none mb-0.5" style={{ fontWeight: 600 }}>Admin</p>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700">● Logged in</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16 flex-1">
        {/* ── SIDEBAR ── */}
        <aside
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-100 z-30 flex flex-col transition-all duration-300 shadow-sm ${
            sidebarOpen ? "w-60" : "w-16"
          }`}
        >
          {/* Nav links */}
          <nav className="flex-1 py-5 px-3 space-y-1 scroll-area overflow-y-auto">
            {SIDEBAR_LINKS.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActivePage(link.id)}
                  className={`sidebar-link w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-medium text-sm transition-all ${
                    isActive
                      ? "bg-violet-600 text-white shadow-md shadow-violet-200"
                      : "text-gray-500 hover:bg-violet-50 hover:text-violet-700"
                  }`}
                >
                  <span className={`flex-shrink-0 ${isActive ? "text-white" : ""}`}>{link.icon}</span>
                  {sidebarOpen && (
                    <span className="truncate">{link.label}</span>
                  )}
                  {sidebarOpen && isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          {sidebarOpen && (
            <div className="p-4 border-t border-gray-100">
              <div className="bg-violet-50 rounded-xl p-3">
                <p className="text-xs font-semibold text-violet-700 mb-1">Need help?</p>
                <p className="text-xs text-violet-500 leading-snug">Check docs or contact support team.</p>
              </div>
            </div>
          )}
        </aside>

        {/* ── MAIN CONTENT ── */}
      <main
  className={`flex-1 transition-all duration-300 min-h-screen ${
    sidebarOpen ? "ml-60" : "ml-16"
  }`}
>
  {activePage === "dashboard" && <DashboardPage />}
  {activePage === "view-users" && <ViewUsers />}
  {activePage === "create-club" && <CreateClub />}
  {activePage === "view-clubs" && <ViewClubs/>}
  {activePage === "view-events" && <ViewEvents />}
</main>
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="p-6 space-y-6 max-w-7xl">
      {/* Page header */}
      <div className="fade-in flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-1">Overview</p>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700 }} className="text-2xl text-gray-900">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
            <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
          </svg>
          March 4, 2026
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {STATS.map((s, i) => (
          <div
            key={s.id}
            className={`stat-card bg-white rounded-2xl border border-gray-100 p-5 shadow-sm fade-in-${i + 1}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl ${s.accent} ${s.text} flex items-center justify-center`}>
                {s.icon}
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.positive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                {s.change} ↑
              </span>
            </div>
            <p className="text-sm text-gray-400 font-medium mb-1">{s.label}</p>
            <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700 }} className="text-3xl text-gray-900">
              {s.value}
            </p>
            {/* Mini bar */}
            <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${s.gradient}`}
                style={{ width: s.id === "users" ? "72%" : s.id === "clubs" ? "48%" : "65%" }}
              ></div>
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5">vs last month</p>
          </div>
        ))}
      </div>

      {/* ── BOTTOM GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 fade-in-4">
        {/* Recent Events */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-800">Recent Events</h2>
            <button className="text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors">View all →</button>
          </div>
          <div className="divide-y divide-gray-50">
            {RECENT_EVENTS.map((ev) => (
              <div key={ev.name} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 leading-tight">{ev.name}</p>
                    <p className="text-[11px] text-gray-400">{ev.club} · {ev.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 hidden sm:block">{ev.attendees} attendees</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ev.status === "Upcoming" ? "badge-upcoming" : "badge-done"}`}>
                    {ev.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Clubs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-800">Top Clubs</h2>
            <button className="text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors">View all →</button>
          </div>
          <div className="p-4 space-y-3">
            {TOP_CLUBS.map((club, idx) => (
              <div key={club.name} className="flex items-center gap-3 group">
                <span className="text-xs font-bold text-gray-300 w-4 text-center">{idx + 1}</span>
                <div className={`w-8 h-8 rounded-xl ${club.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
                  {club.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{club.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${club.color}`}
                        style={{ width: `${(club.members / 420) * 100}%`, opacity: 0.7 }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">{club.members} members</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick stats footer */}
          <div className="mx-4 mb-4 bg-violet-600 rounded-xl p-3 shimmer">
            <p className="text-xs text-violet-200 mb-2 font-medium">Platform Activity</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <p className="text-white font-bold text-lg" style={{ fontFamily: "'Sora', sans-serif" }}>92%</p>
                <p className="text-[10px] text-violet-200">Active Rate</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2 text-center">
                <p className="text-white font-bold text-lg" style={{ fontFamily: "'Sora', sans-serif" }}>4.8★</p>
                <p className="text-[10px] text-violet-200">Avg Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderPage({ name }) {
  return (
    <div className="p-6 flex items-center justify-center min-h-[80vh]">
      <div className="text-center fade-in">
        <div className="w-16 h-16 shimmer rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-200">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" className="w-8 h-8">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        </div>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700 }} className="text-xl text-gray-800 mb-2">{name}</h2>
        <p className="text-sm text-gray-400">This page will be connected to the backend.</p>
        <div className="mt-5 inline-flex items-center gap-2 bg-violet-50 text-violet-600 text-xs font-medium px-4 py-2 rounded-full">
          <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
          Coming soon
        </div>
      </div>
    </div>
  );
}



