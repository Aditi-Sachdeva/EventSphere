







import { useState } from "react";
import ViewUsers from "./ViewUsers";
import CreateClub from "./CreateClub";
import ViewClubs from "./ViewClubs";
import ViewEvents from "./ViewEvents";

const ES_GRAD = "linear-gradient(135deg,#ec4899 0%,#a855f7 50%,#6366f1 100%)";

const SIDEBAR_LINKS = [
  {
    id: "dashboard", label: "Dashboard",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  },
  {
    id: "view-users", label: "View Users",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/><path d="M21 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round"/></svg>,
  },
  {
    id: "create-club", label: "Create Club",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><path d="M12 5v14M5 12h14" strokeLinecap="round"/></svg>,
  },
  {
    id: "view-clubs", label: "View Clubs",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/></svg>,
  },
  {
    id: "view-events", label: "View Events",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" strokeLinecap="round" strokeWidth="2.5"/></svg>,
  },
];

const STATS = [
  { id:"users",  label:"Total Users",  value:"4,821", change:"+12%", grad:"linear-gradient(135deg,#a855f7,#6366f1)", accentBg:"#f3e8ff", accentColor:"#7c3aed",
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:22,height:22}}><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/><path d="M21 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round"/></svg> },
  { id:"clubs",  label:"Total Clubs",  value:"138",   change:"+5%",  grad:"linear-gradient(135deg,#ec4899,#a855f7)", accentBg:"#fdf2f8", accentColor:"#be185d",
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:22,height:22}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/></svg> },
  { id:"events", label:"Total Events", value:"2,047", change:"+18%", grad:"linear-gradient(135deg,#6366f1,#818cf8)", accentBg:"#eef2ff", accentColor:"#4f46e5",
    icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:22,height:22}}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round"/></svg> },
];

const RECENT_EVENTS = [
  { name:"Tech Symposium 2026", club:"Tech Club",     date:"Mar 10", attendees:340, status:"Upcoming" },
  { name:"Cultural Fest Night", club:"Arts Society",  date:"Mar 7",  attendees:210, status:"Upcoming" },
  { name:"Hackathon Spring",    club:"Dev Guild",     date:"Feb 28", attendees:180, status:"Done"     },
  { name:"Leadership Summit",   club:"Business Club", date:"Feb 22", attendees:95,  status:"Done"     },
  { name:"Photography Walk",    club:"Lens Club",     date:"Feb 18", attendees:60,  status:"Done"     },
];

const TOP_CLUBS = [
  { name:"Tech Club",     members:420, color:"#a855f7" },
  { name:"Arts Society",  members:310, color:"#ec4899" },
  { name:"Dev Guild",     members:275, color:"#6366f1" },
  { name:"Business Club", members:230, color:"#8b5cf6" },
];

export default function AdminDashboard() {
  const [activePage, setActivePage]   = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#fdf2f8 0%,#faf5ff 40%,#eef2ff 100%)", display:"flex", flexDirection:"column", fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box}
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn1 { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .fade-in  { animation: fadeIn  .45s ease both; }
        .fade-in-1{ animation: fadeIn1 .45s .05s ease both; }
        .fade-in-2{ animation: fadeIn1 .45s .10s ease both; }
        .fade-in-3{ animation: fadeIn1 .45s .15s ease both; }
        .fade-in-4{ animation: fadeIn1 .45s .20s ease both; }
        .sidebar-link { transition: all .18s ease; }
        .sidebar-link:hover { transform: translateX(3px); }
        .stat-card { transition: all .2s ease; }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px -8px rgba(168,85,247,0.18); }
        .nav-link-hover:hover { background:#faf5ff!important; color:#7c3aed!important; }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:#e9d5ff;border-radius:4px}
        .row-hover:hover { background:#fdf4ff!important; }
      `}</style>

      {/* ── NAVBAR ── */}
      <header style={{ height:60, background:"white", borderBottom:"1px solid #f3e8ff", display:"flex", alignItems:"center", padding:"0 20px", justifyContent:"space-between", position:"fixed", top:0, left:0, right:0, zIndex:40, boxShadow:"0 1px 8px rgba(168,85,247,0.07)" }}>
        {/* Left */}
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ width:34, height:34, borderRadius:10, border:"none", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#9ca3af", transition:"background .15s" }}
            onMouseEnter={e=>{e.currentTarget.style.background="#faf5ff";e.currentTarget.style.color="#7c3aed";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#9ca3af";}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:18,height:18}}><path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round"/></svg>
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:ES_GRAD, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 12px rgba(168,85,247,0.3)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{width:15,height:15}}><circle cx="12" cy="12" r="3"/><path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round"/><path d="M12 6V2M18 6l2.5-2.5M22 12h-4" strokeLinecap="round"/></svg>
            </div>
            <span style={{ fontWeight:800, fontSize:17, color:"#111827", letterSpacing:"-0.3px" }}>
              Event<span style={{ background:ES_GRAD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Sphere</span>
            </span>
          </div>
        </div>

        {/* Right */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"#faf5ff", border:"1px solid #e9d5ff", borderRadius:12, padding:"7px 12px", width:200 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/></svg>
            <input placeholder="Search…" style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:"#374151", fontFamily:"inherit", width:"100%" }}/>
          </div>

          <button style={{ position:"relative", width:34, height:34, borderRadius:10, border:"none", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#9ca3af" }}
            onMouseEnter={e=>{e.currentTarget.style.background="#faf5ff";e.currentTarget.style.color="#a855f7";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#9ca3af";}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:17,height:17}}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round"/></svg>
            <span style={{ position:"absolute", top:7, right:7, width:7, height:7, background:"#a855f7", borderRadius:"50%", outline:"2px solid white" }}/>
          </button>

          <div style={{ display:"flex", alignItems:"center", gap:10, paddingLeft:12, borderLeft:"1px solid #f3e8ff" }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:ES_GRAD, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:12, fontWeight:700, boxShadow:"0 2px 8px rgba(168,85,247,0.35)" }}>A</div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:"#111827", lineHeight:1.2 }}>Admin</div>
              <span style={{ fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:999, background:"#f3e8ff", color:"#7c3aed" }}>● Logged in</span>
            </div>
          </div>
        </div>
      </header>

      <div style={{ display:"flex", paddingTop:60, flex:1 }}>

        {/* ── SIDEBAR ── */}
        <aside style={{ position:"fixed", left:0, top:60, height:"100vh", background:"white", borderRight:"1px solid #f3e8ff", zIndex:30, display:"flex", flexDirection:"column", transition:"width .3s", width: sidebarOpen ? 220 : 68, boxShadow:"1px 0 8px rgba(168,85,247,0.05)", overflowX:"hidden" }}>
          <nav style={{ flex:1, padding:"16px 10px", display:"flex", flexDirection:"column", gap:4 }}>
            {SIDEBAR_LINKS.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button key={link.id} onClick={() => setActivePage(link.id)}
                  className="sidebar-link"
                  style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding: sidebarOpen ? "10px 12px" : "10px 0", justifyContent: sidebarOpen ? "flex-start" : "center", borderRadius:12, border:"none", cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight: isActive ? 700 : 500, transition:"all .18s",
                    background: isActive ? ES_GRAD : "transparent",
                    color: isActive ? "white" : "#6b7280",
                    boxShadow: isActive ? "0 4px 14px rgba(168,85,247,0.3)" : "none",
                  }}
                  onMouseEnter={e=>{ if(!isActive){ e.currentTarget.style.background="#faf5ff"; e.currentTarget.style.color="#7c3aed"; } }}
                  onMouseLeave={e=>{ if(!isActive){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#6b7280"; } }}>
                  <span style={{ flexShrink:0 }}>{link.icon}</span>
                  {sidebarOpen && <span style={{ whiteSpace:"nowrap", overflow:"hidden" }}>{link.label}</span>}
                  {sidebarOpen && isActive && <span style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%", background:"rgba(255,255,255,0.8)", flexShrink:0 }}/>}
                </button>
              );
            })}
          </nav>

          {/* Sidebar footer */}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{ flex:1, transition:"margin-left .3s", marginLeft: sidebarOpen ? 220 : 68, minHeight:"100vh" }}>
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

function DashboardPage() {
  return (
    <div style={{ padding:"20px", width:"100%" }}>

      {/* Page header */}
      <div className="fade-in" style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <div>
          <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", color:"#a855f7", marginBottom:4 }}>Overview</div>
          <h1 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:0 }}>Dashboard</h1>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, color:"#9ca3af", background:"white", border:"1px solid #f3e8ff", borderRadius:10, padding:"7px 12px", boxShadow:"0 1px 4px rgba(168,85,247,0.07)" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:13,height:13}}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round"/></svg>
          March 4, 2026
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:20 }}>
        {STATS.map((s, i) => (
          <div key={s.id} className={`stat-card fade-in-${i+1}`}
            style={{ background:"white", borderRadius:18, border:"1px solid rgba(236,72,153,0.1)", padding:"18px 20px", boxShadow:"0 1px 8px rgba(168,85,247,0.07)" }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ width:42, height:42, borderRadius:13, background:s.accentBg, color:s.accentColor, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {s.icon}
              </div>
              <span style={{ fontSize:11, fontWeight:700, padding:"4px 8px", borderRadius:999, background:"#f0fdf4", color:"#15803d" }}>{s.change} ↑</span>
            </div>
            <div style={{ fontSize:12, color:"#9ca3af", fontWeight:500, marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:28, fontWeight:800, color:"#111827", lineHeight:1 }}>{s.value}</div>
            <div style={{ marginTop:14, height:5, background:"#f3e8ff", borderRadius:999, overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:999, background:s.grad, width: s.id==="users"?"72%":s.id==="clubs"?"48%":"65%", transition:"width .6s" }}/>
            </div>
            <div style={{ fontSize:10, color:"#9ca3af", marginTop:5 }}>vs last month</div>
          </div>
        ))}
      </div>

      {/* ── BOTTOM GRID ── */}
      <div className="fade-in-4" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>

        {/* Recent Events */}
        <div style={{ gridColumn:"1 / 3", background:"white", borderRadius:18, border:"1px solid rgba(236,72,153,0.1)", boxShadow:"0 1px 8px rgba(168,85,247,0.07)", overflow:"hidden" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", borderBottom:"1px solid #fdf4ff" }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>Recent Events</div>
            <button style={{ fontSize:11, fontWeight:600, color:"#a855f7", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }}>View all →</button>
          </div>
          <div>
            {RECENT_EVENTS.map((ev, i) => (
              <div key={ev.name} className="row-hover"
                style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 18px", borderBottom: i < RECENT_EVENTS.length-1 ? "1px solid #fdf4ff" : "none", transition:"background .15s" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:32, height:32, borderRadius:9, background:"#faf5ff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" style={{width:14,height:14}}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:"#111827", lineHeight:1.3 }}>{ev.name}</div>
                    <div style={{ fontSize:10, color:"#9ca3af" }}>{ev.club} · {ev.date}</div>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:11, color:"#6b7280" }}>{ev.attendees} attendees</span>
                  <span style={{ fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:999,
                    background: ev.status==="Upcoming" ? "#f3e8ff" : "#f0fdf4",
                    color:       ev.status==="Upcoming" ? "#7c3aed"  : "#15803d" }}>
                    {ev.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Clubs */}
        <div style={{ background:"white", borderRadius:18, border:"1px solid rgba(236,72,153,0.1)", boxShadow:"0 1px 8px rgba(168,85,247,0.07)", overflow:"hidden", display:"flex", flexDirection:"column" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", borderBottom:"1px solid #fdf4ff" }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>Top Clubs</div>
            <button style={{ fontSize:11, fontWeight:600, color:"#a855f7", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }}>View all →</button>
          </div>
          <div style={{ padding:"12px 16px", display:"flex", flexDirection:"column", gap:10, flex:1 }}>
            {TOP_CLUBS.map((club, idx) => (
              <div key={club.name} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:11, fontWeight:700, color:"#d8b4fe", width:16, textAlign:"center", flexShrink:0 }}>{idx+1}</span>
                <div style={{ width:32, height:32, borderRadius:10, background:club.color, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:11, fontWeight:700, flexShrink:0, boxShadow:"0 2px 8px rgba(168,85,247,0.25)" }}>
                  {club.name[0]}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:"#111827", marginBottom:4 }}>{club.name}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ flex:1, height:4, background:"#f3e8ff", borderRadius:999, overflow:"hidden" }}>
                      <div style={{ height:"100%", borderRadius:999, background:club.color, width:`${(club.members/420)*100}%`, opacity:.8 }}/>
                    </div>
                    <span style={{ fontSize:10, color:"#9ca3af", flexShrink:0 }}>{club.members}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer accent */}
          <div style={{ margin:"0 14px 14px", borderRadius:14, padding:14, background:ES_GRAD }}>
            <div style={{ fontSize:10, color:"rgba(255,255,255,0.7)", marginBottom:10, fontWeight:600 }}>Platform Activity</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[["92%","Active Rate"], ["4.8★","Avg Rating"]].map(([val, lbl]) => (
                <div key={lbl} style={{ background:"rgba(255,255,255,0.15)", borderRadius:10, padding:"8px 6px", textAlign:"center" }}>
                  <div style={{ fontSize:16, fontWeight:800, color:"white" }}>{val}</div>
                  <div style={{ fontSize:9, color:"rgba(255,255,255,0.7)", marginTop:2 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}









