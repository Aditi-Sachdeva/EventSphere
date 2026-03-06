import { useState } from "react";
import ViewUsers from "./ViewUsers";
import CreateClub from "./CreateClub";
import ViewClubs from "./ViewClubs";
import ViewEvents from "./ViewEvents";

// ── THEME TOKENS (matches Login page) ──────────────────────────────────────
const GRAD      = "linear-gradient(to right, #ec4899, #6366f1)";       // pink-500 → indigo-600
const GRAD_DIAG = "linear-gradient(135deg, #ec4899 0%, #6366f1 100%)"; // diagonal variant
const ACCENT_PINK   = "#ec4899";
const ACCENT_INDIGO = "#6366f1";
const PINK_LIGHT    = "#fdf2f8";
const INDIGO_LIGHT  = "#eef2ff";
const BORDER        = "#e5e7eb";  // gray-200
const TEXT_MAIN     = "#1f2937";  // gray-800
const TEXT_SUB      = "#6b7280";  // gray-500
const TEXT_MUTED    = "#9ca3af";  // gray-400
const BG_PAGE       = "linear-gradient(135deg, #eef2ff 0%, #ffffff 50%, #fdf2f8 100%)";
// ───────────────────────────────────────────────────────────────────────────

const SIDEBAR_LINKS = [
  {
    id: "dashboard", label: "Dashboard",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:17,height:17}}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  },
  {
    id: "view-users", label: "View Users",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:17,height:17}}><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/><path d="M21 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round"/></svg>,
  },
  {
    id: "create-club", label: "Create Club",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:17,height:17}}><path d="M12 5v14M5 12h14" strokeLinecap="round"/></svg>,
  },
  {
    id: "view-clubs", label: "View Clubs",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:17,height:17}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/></svg>,
  },
  {
    id: "view-events", label: "View Events",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:17,height:17}}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" strokeLinecap="round" strokeWidth="2.5"/></svg>,
  },
];

const STATS = [
  {
    id: "users", label: "Total Users", value: "4,821", change: "+12%",
    accentBg: INDIGO_LIGHT, accentColor: ACCENT_INDIGO,
    bar: "linear-gradient(to right,#6366f1,#818cf8)",
    barW: "72%",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:21,height:21}}><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/><path d="M21 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round"/></svg>,
  },
  {
    id: "clubs", label: "Total Clubs", value: "138", change: "+5%",
    accentBg: PINK_LIGHT, accentColor: ACCENT_PINK,
    bar: "linear-gradient(to right,#ec4899,#f472b6)",
    barW: "48%",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:21,height:21}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/></svg>,
  },
  {
    id: "events", label: "Total Events", value: "2,047", change: "+18%",
    accentBg: "#f5f3ff", accentColor: "#7c3aed",
    bar: "linear-gradient(to right,#8b5cf6,#a78bfa)",
    barW: "65%",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:21,height:21}}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round"/></svg>,
  },
];

const RECENT_EVENTS = [
  { name: "Tech Symposium 2026", club: "Tech Club",     date: "Mar 10", attendees: 340, status: "Upcoming" },
  { name: "Cultural Fest Night",  club: "Arts Society",  date: "Mar 7",  attendees: 210, status: "Upcoming" },
  { name: "Hackathon Spring",     club: "Dev Guild",     date: "Feb 28", attendees: 180, status: "Done"     },
  { name: "Leadership Summit",    club: "Business Club", date: "Feb 22", attendees: 95,  status: "Done"     },
  { name: "Photography Walk",     club: "Lens Club",     date: "Feb 18", attendees: 60,  status: "Done"     },
];

const TOP_CLUBS = [
  { name: "Tech Club",     members: 420, color: ACCENT_INDIGO },
  { name: "Arts Society",  members: 310, color: ACCENT_PINK   },
  { name: "Dev Guild",     members: 275, color: "#8b5cf6"     },
  { name: "Business Club", members: 230, color: "#06b6d4"     },
];

export default function AdminDashboard() {
  const [activePage, setActivePage]   = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{
      minHeight: "100vh",
      background: BG_PAGE,
      display: "flex",
      flexDirection: "column",
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .fade0 { animation: fadeUp .4s ease both; }
        .fade1 { animation: fadeUp .4s .07s ease both; }
        .fade2 { animation: fadeUp .4s .14s ease both; }
        .fade3 { animation: fadeUp .4s .21s ease both; }
        .fade4 { animation: fadeUp .4s .28s ease both; }
        .stat-card { transition: transform .2s ease, box-shadow .2s ease; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 16px 36px -8px rgba(99,102,241,0.18) !important; }
        .sidebar-btn { transition: all .17s ease; }
        .sidebar-btn:hover { transform: translateX(2px); }
        .row-hover:hover { background: #f9fafb !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 4px; }
      `}</style>

      {/* ── NAVBAR ── */}
      <header style={{
        height: 64,
        background: "white",
        borderBottom: `1px solid ${BORDER}`,
        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px",
      }}>
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ width: 36, height: 36, borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: TEXT_MUTED, transition: "all .15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = INDIGO_LIGHT; e.currentTarget.style.color = ACCENT_INDIGO; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = TEXT_MUTED; }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:17,height:17}}><path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round"/></svg>
          </button>

          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(99,102,241,0.35)" }}>
              <span style={{ color: "white", fontWeight: 800, fontSize: 11, letterSpacing: "-.3px" }}>ES</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: 17, color: TEXT_MAIN, letterSpacing: "-0.3px" }}>
              Event<span style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Sphere</span>
            </span>
          </div>
        </div>

        {/* Center search */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f9fafb", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "8px 14px", width: 220 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke={TEXT_MUTED} strokeWidth="2" style={{width:13,height:13,flexShrink:0}}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/></svg>
          <input placeholder="Search…" style={{ border: "none", outline: "none", background: "transparent", fontSize: 12, color: TEXT_MAIN, fontFamily: "inherit", width: "100%" }} />
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Bell */}
          <button style={{ position: "relative", width: 36, height: 36, borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: TEXT_MUTED }}
            onMouseEnter={e => { e.currentTarget.style.background = PINK_LIGHT; e.currentTarget.style.color = ACCENT_PINK; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = TEXT_MUTED; }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16}}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round"/></svg>
            <span style={{ position: "absolute", top: 8, right: 8, width: 7, height: 7, background: ACCENT_PINK, borderRadius: "50%", outline: "2px solid white" }} />
          </button>

          {/* Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 9, paddingLeft: 12, borderLeft: `1px solid ${BORDER}` }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: GRAD, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700, boxShadow: "0 2px 8px rgba(99,102,241,0.35)" }}>A</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: TEXT_MAIN, lineHeight: 1.3 }}>Admin</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 600, padding: "1px 8px", borderRadius: 999, background: "#f0fdf4", color: "#16a34a" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                Logged in
              </div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: "flex", paddingTop: 64, flex: 1 }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          position: "fixed", left: 0, top: 64, height: "calc(100vh - 64px)",
          background: "white", borderRight: `1px solid ${BORDER}`,
          zIndex: 40, display: "flex", flexDirection: "column",
          transition: "width .28s cubic-bezier(.4,0,.2,1)",
          width: sidebarOpen ? 224 : 66,
          boxShadow: "1px 0 8px rgba(0,0,0,0.04)",
          overflowX: "hidden",
        }}>
          <nav style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
            {SIDEBAR_LINKS.map(link => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActivePage(link.id)}
                  className="sidebar-btn"
                  style={{
                    width: "100%",
                    display: "flex", alignItems: "center",
                    gap: 10,
                    padding: sidebarOpen ? "10px 13px" : "10px 0",
                    justifyContent: sidebarOpen ? "flex-start" : "center",
                    borderRadius: 12, border: "none", cursor: "pointer",
                    fontFamily: "inherit", fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                    background: isActive ? GRAD : "transparent",
                    color: isActive ? "white" : TEXT_SUB,
                    boxShadow: isActive ? "0 4px 14px rgba(99,102,241,0.3)" : "none",
                    transition: "all .17s ease",
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = INDIGO_LIGHT; e.currentTarget.style.color = ACCENT_INDIGO; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = TEXT_SUB; } }}
                >
                  <span style={{ flexShrink: 0 }}>{link.icon}</span>
                  {sidebarOpen && <span style={{ whiteSpace: "nowrap", overflow: "hidden" }}>{link.label}</span>}
                  {sidebarOpen && isActive && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.75)", flexShrink: 0 }} />}
                </button>
              );
            })}
          </nav>


        </aside>

        {/* ── MAIN ── */}
        <main style={{ flex: 1, marginLeft: sidebarOpen ? 224 : 66, transition: "margin-left .28s cubic-bezier(.4,0,.2,1)", minHeight: "100vh" }}>
          {activePage === "dashboard"   && <DashboardPage />}
          {activePage === "view-users"  && <ViewUsers />}
          {activePage === "create-club" && <CreateClub />}
          {activePage === "view-clubs"  && <ViewClubs />}
          {activePage === "view-events" && <ViewEvents />}
        </main>
      </div>
    </div>
  );
}

// ── DASHBOARD PAGE ────────────────────────────────────────────────────────────
function DashboardPage() {
  return (
    <div style={{ padding: "24px", width: "100%" }}>

      {/* Page header */}
      <div className="fade0" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: ACCENT_INDIGO, background: INDIGO_LIGHT, border: "1px solid #c7d2fe", borderRadius: 999, padding: "3px 10px", marginBottom: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT_INDIGO, display: "inline-block" }} />
            Overview
          </div>
          <h1 style={{ fontSize: 23, fontWeight: 800, color: TEXT_MAIN, margin: 0, letterSpacing: "-0.4px" }}>Dashboard</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: TEXT_SUB, background: "white", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "7px 13px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:13,height:13,color:TEXT_MUTED}}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round"/></svg>
          March 6, 2026
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 18 }}>
        {STATS.map((s, i) => (
          <div key={s.id} className={`stat-card fade${i + 1}`}
            style={{ background: "white", borderRadius: 20, border: `1px solid ${BORDER}`, padding: "20px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: s.accentBg, color: s.accentColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {s.icon}
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 9px", borderRadius: 999, background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0" }}>
                {s.change} ↑
              </span>
            </div>
            <div style={{ fontSize: 12, color: TEXT_MUTED, fontWeight: 500, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: TEXT_MAIN, lineHeight: 1, letterSpacing: "-0.5px" }}>{s.value}</div>
            <div style={{ marginTop: 16, height: 5, background: "#f3f4f6", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 999, background: s.bar, width: s.barW, transition: "width .7s cubic-bezier(.4,0,.2,1)" }} />
            </div>
            <div style={{ fontSize: 10, color: TEXT_MUTED, marginTop: 5 }}>vs last month</div>
          </div>
        ))}
      </div>

      {/* ── BOTTOM GRID ── */}
      <div className="fade4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>

        {/* Recent Events */}
        <div style={{ gridColumn: "1 / 3", background: "white", borderRadius: 20, border: `1px solid ${BORDER}`, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 18px", borderBottom: `1px solid #f3f4f6` }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: TEXT_MAIN }}>Recent Events</span>
            <button style={{ fontSize: 11, fontWeight: 600, color: ACCENT_INDIGO, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>View all →</button>
          </div>
          {RECENT_EVENTS.map((ev, i) => (
            <div key={ev.name} className="row-hover"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 18px", borderBottom: i < RECENT_EVENTS.length - 1 ? "1px solid #f9fafb" : "none", transition: "background .15s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: INDIGO_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={ACCENT_INDIGO} strokeWidth="2" style={{width:14,height:14}}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_MAIN, lineHeight: 1.3 }}>{ev.name}</div>
                  <div style={{ fontSize: 11, color: TEXT_MUTED }}>{ev.club} · {ev.date}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 11, color: TEXT_SUB }}>{ev.attendees} attendees</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
                  background: ev.status === "Upcoming" ? INDIGO_LIGHT : "#f0fdf4",
                  color:      ev.status === "Upcoming" ? ACCENT_INDIGO : "#15803d",
                  border: `1px solid ${ev.status === "Upcoming" ? "#c7d2fe" : "#bbf7d0"}`,
                }}>
                  {ev.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Top Clubs */}
        <div style={{ background: "white", borderRadius: 20, border: `1px solid ${BORDER}`, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 18px", borderBottom: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: TEXT_MAIN }}>Top Clubs</span>
            <button style={{ fontSize: 11, fontWeight: 600, color: ACCENT_PINK, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>View all →</button>
          </div>
          <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
            {TOP_CLUBS.map((club, idx) => (
              <div key={club.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: TEXT_MUTED, width: 16, textAlign: "center", flexShrink: 0 }}>{idx + 1}</span>
                <div style={{ width: 34, height: 34, borderRadius: 11, background: club.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11, fontWeight: 700, flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                  {club.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: TEXT_MAIN, marginBottom: 4 }}>{club.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ flex: 1, height: 4, background: "#f3f4f6", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 999, background: club.color, width: `${(club.members / 420) * 100}%`, opacity: 0.85 }} />
                    </div>
                    <span style={{ fontSize: 10, color: TEXT_MUTED, flexShrink: 0 }}>{club.members}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gradient footer accent */}
          <div style={{ margin: "0 14px 14px", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ background: GRAD, padding: "14px" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)", fontWeight: 600, marginBottom: 10 }}>Platform Activity</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[["92%", "Active Rate"], ["4.8★", "Avg Rating"]].map(([val, lbl]) => (
                  <div key={lbl} style={{ background: "rgba(255,255,255,.18)", borderRadius: 10, padding: "9px 6px", textAlign: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "white" }}>{val}</div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,.7)", marginTop: 2 }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}





