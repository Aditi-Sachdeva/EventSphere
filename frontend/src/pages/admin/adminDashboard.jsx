import { useState } from "react";
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

const STATS = [
  { label: "Total Users",  value: "4,821", change: "+12%", bar: "72%",  bg: "bg-indigo-50", text: "text-indigo-500", icon: "👥" },
  { label: "Total Clubs",  value: "138",   change: "+5%",  bar: "48%",  bg: "bg-pink-50",   text: "text-pink-500",  icon: "🏛" },
  { label: "Total Events", value: "2,047", change: "+18%", bar: "65%",  bg: "bg-violet-50", text: "text-violet-600",icon: "📅" },
];

const EVENTS = [
  { name: "Tech Symposium 2026", club: "Tech Club",     date: "Mar 10", attendees: 340, upcoming: true  },
  { name: "Cultural Fest Night",  club: "Arts Society",  date: "Mar 7",  attendees: 210, upcoming: true  },
  { name: "Hackathon Spring",     club: "Dev Guild",     date: "Feb 28", attendees: 180, upcoming: false },
  { name: "Leadership Summit",    club: "Business Club", date: "Feb 22", attendees: 95,  upcoming: false },
  { name: "Photography Walk",     club: "Lens Club",     date: "Feb 18", attendees: 60,  upcoming: false },
];

const CLUBS = [
  { name: "Tech Club",     members: 420, color: "bg-indigo-500" },
  { name: "Arts Society",  members: 310, color: "bg-pink-500"   },
  { name: "Dev Guild",     members: 275, color: "bg-violet-500" },
  { name: "Business Club", members: 230, color: "bg-cyan-500"   },
];

const GRAD = "linear-gradient(to right, #ec4899, #6366f1)";

export default function AdminDashboard() {
  const [page, setPage] = useState("dashboard");
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-pink-50" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap')`}</style>

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-5 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(!open)} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-500 transition-colors">☰</button>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-md" style={{ background: GRAD }}>ES</div>
          <span className="font-black text-lg text-gray-800">
            Event<span style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Sphere</span>
          </span>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-52">
          <span className="text-gray-400 text-xs">🔍</span>
          <input placeholder="Search…" className="bg-transparent outline-none text-xs text-gray-800 w-full" />
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
        <aside className={`fixed top-16 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden ${open ? "w-56" : "w-16"}`} style={{ height: "calc(100vh - 64px)" }}>
          <nav className="p-2.5 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <button key={link.id} onClick={() => setPage(link.id)}
                className={`w-full flex items-center gap-2.5 rounded-xl py-2.5 text-sm border-none cursor-pointer transition-all ${open ? "px-3" : "px-0 justify-center"} ${page === link.id ? "text-white font-bold shadow-lg" : "text-gray-500 bg-transparent hover:bg-indigo-50 hover:text-indigo-500"}`}
                style={page === link.id ? { background: GRAD } : {}}>
                <span className="shrink-0">{link.icon}</span>
                {open && <span>{link.label}</span>}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className={`flex-1 transition-all duration-300 ${open ? "ml-56" : "ml-16"}`}>
          {page === "dashboard"   && <Dashboard />}
          {page === "view-users"  && <ViewUsers />}
          {page === "create-club" && <CreateClub />}
          {page === "view-clubs"  && <ViewClubs />}
          {page === "view-events" && <ViewEvents />}
        </main>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 border border-indigo-200 rounded-full px-2.5 py-1 mb-2">● Overview</div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Dashboard</h1>
        </div>
        <div className="text-xs text-gray-500 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">📅 March 6, 2026</div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-3.5 mb-4">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all">
            <div className="flex justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl ${s.bg} ${s.text} flex items-center justify-center text-xl`}>{s.icon}</div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 self-start">{s.change} ↑</span>
            </div>
            <div className="text-xs text-gray-400 font-medium mb-1">{s.label}</div>
            <div className="text-3xl font-black text-gray-800 tracking-tight">{s.value}</div>
            <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${s.text.replace("text-", "bg-")}`} style={{ width: s.bar }} />
            </div>
            <div className="text-xs text-gray-400 mt-1">vs last month</div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-3 gap-3.5">
        {/* Recent Events */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
            <span className="text-sm font-bold text-gray-800">Recent Events</span>
            <button className="text-xs font-semibold text-indigo-500 bg-transparent border-none cursor-pointer">View all →</button>
          </div>
          {EVENTS.map((ev, i) => (
            <div key={ev.name} className={`flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors ${i < EVENTS.length - 1 ? "border-b border-gray-50" : ""}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">📅</div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{ev.name}</div>
                  <div className="text-xs text-gray-400">{ev.club} · {ev.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{ev.attendees} attendees</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${ev.upcoming ? "bg-indigo-50 text-indigo-500 border-indigo-200" : "bg-green-50 text-green-700 border-green-200"}`}>
                  {ev.upcoming ? "Upcoming" : "Done"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Top Clubs */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
            <span className="text-sm font-bold text-gray-800">Top Clubs</span>
            <button className="text-xs font-semibold text-pink-500 bg-transparent border-none cursor-pointer">View all →</button>
          </div>
          <div className="p-4 flex flex-col gap-3 flex-1">
            {CLUBS.map((club, i) => (
              <div key={club.name} className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-gray-400 w-4 text-center">{i + 1}</span>
                <div className={`w-8 h-8 rounded-xl ${club.color} flex items-center justify-center text-white text-xs font-bold shadow-md`}>{club.name[0]}</div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-800 mb-1">{club.name}</div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${club.color} opacity-80 rounded-full`} style={{ width: `${(club.members / 420) * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-400">{club.members}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Gradient footer */}
          <div className="mx-3.5 mb-3.5 rounded-2xl overflow-hidden">
            <div className="p-3.5 grid grid-cols-2 gap-2" style={{ background: GRAD }}>
              {[["92%", "Active Rate"], ["4.8★", "Avg Rating"]].map(([val, lbl]) => (
                <div key={lbl} className="bg-white/20 rounded-xl py-2 text-center">
                  <div className="text-base font-black text-white">{val}</div>
                  <div className="text-xs text-white/70">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}