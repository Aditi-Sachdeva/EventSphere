import { useState, useMemo } from "react";
import {
  Search, X, Eye, CheckCircle2, XCircle, Clock, Calendar,
  Users, ChevronUp, ChevronDown, Trash2,
  MapPin, Tag, RefreshCw, Star, Zap
} from "lucide-react";

// ── THEME TOKENS (matches Dashboard & Login) ───────────────────────────────
const GRAD          = "linear-gradient(to right, #ec4899, #6366f1)";
const ACCENT_PINK   = "#ec4899";
const ACCENT_INDIGO = "#6366f1";
const PINK_LIGHT    = "#fdf2f8";
const INDIGO_LIGHT  = "#eef2ff";
const BORDER        = "#e5e7eb";
const TEXT_MAIN     = "#1f2937";
const TEXT_SUB      = "#6b7280";
const TEXT_MUTED    = "#9ca3af";
// ───────────────────────────────────────────────────────────────────────────

const SEED_EVENTS = [
  { id:1, name:"Hackathon 2024",      club:"Coding Club",       organizer:"Rahul Sharma",    date:"2024-05-12", seats:{filled:30,total:50}, status:"pending",  category:"Technology", location:"Hall A",       description:"A 24-hour coding marathon where participants build innovative solutions to real-world problems." },
  { id:2, name:"Dance Fest",          club:"Dance Club",         organizer:"Priya Gupta",     date:"2024-05-15", seats:{filled:20,total:40}, status:"approved", category:"Arts",       location:"Auditorium",   description:"Annual dance festival featuring classical, contemporary, and folk performances." },
  { id:3, name:"Music Night",         club:"Music Club",         organizer:"Aman Singh",      date:"2024-05-18", seats:{filled:10,total:30}, status:"rejected", category:"Arts",       location:"Open Air",     description:"An evening of live music performances spanning multiple genres." },
  { id:4, name:"Photography Walk",    club:"Photography Guild",  organizer:"Neha Joshi",      date:"2024-05-22", seats:{filled:12,total:20}, status:"pending",  category:"Arts",       location:"Campus",       description:"Guided photography walk to explore architecture and nature on campus." },
  { id:5, name:"Chess Tournament",    club:"Chess Society",      organizer:"Dev Kapoor",      date:"2024-05-25", seats:{filled:32,total:32}, status:"approved", category:"Sports",     location:"Room 204",     description:"Inter-college chess championship with prizes for top 3 winners." },
  { id:6, name:"Debate Championship", club:"Debate Forum",       organizer:"Priya Nair",      date:"2024-06-02", seats:{filled:18,total:60}, status:"pending",  category:"Academic",   location:"Seminar Hall", description:"Annual debate competition on topics of national and international importance." },
  { id:7, name:"Film Screening",      club:"Film Appreciation",  organizer:"Tanya Gupta",     date:"2024-06-08", seats:{filled:45,total:60}, status:"approved", category:"Arts",       location:"Mini Theater", description:"Curated selection of award-winning international short films followed by discussion." },
  { id:8, name:"Robotics Expo",       club:"Robotics Lab",       organizer:"Amit Chatterjee", date:"2024-06-15", seats:{filled:8, total:40}, status:"rejected", category:"Technology", location:"Lab Complex",  description:"Showcase of student-built robots and automation projects." },
];

const CATEGORY_PILL = {
  Technology: { bg: INDIGO_LIGHT, color: ACCENT_INDIGO },
  Arts:       { bg: PINK_LIGHT,   color: "#be185d"     },
  Sports:     { bg: "#f0fdf4",    color: "#15803d"     },
  Academic:   { bg: "#fffbeb",    color: "#b45309"     },
};

const CATEGORY_GRAD = {
  Technology: "linear-gradient(135deg,#6366f1,#818cf8)",
  Arts:       "linear-gradient(135deg,#ec4899,#f472b6)",
  Sports:     "linear-gradient(135deg,#10b981,#34d399)",
  Academic:   "linear-gradient(135deg,#f59e0b,#fbbf24)",
};

const STATUS_CONFIG = {
  pending:  { bg:"#fffbeb", color:"#b45309", border:"#fde68a", dot:"#f59e0b", label:"Pending"  },
  approved: { bg:"#f0fdf4", color:"#15803d", border:"#bbf7d0", dot:"#22c55e", label:"Approved" },
  rejected: { bg:"#fff1f2", color:"#be123c", border:"#fecdd3", dot:"#f43f5e", label:"Rejected" },
};

const AVATAR_PALETTE = [
  ACCENT_PINK, ACCENT_INDIGO, "#8b5cf6", "#7c3aed", "#db2777",
  "#4f46e5", "#c026d3", "#9333ea", "#6366f1", "#e11d48",
];

function initials(name) {
  if (!name) return "?";
  return name.trim().split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
}

function SeatsBar({ filled, total }) {
  const pct = Math.round((filled / total) * 100);
  const barColor = pct >= 90 ? "#f43f5e" : pct >= 60 ? "#f59e0b" : "#22c55e";
  return (
    <div style={{ minWidth:80 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
        <span style={{ fontSize:11, fontWeight:700, color:TEXT_MAIN }}>{filled}<span style={{ color:TEXT_MUTED, fontWeight:400 }}>/{total}</span></span>
        <span style={{ fontSize:11, color:TEXT_MUTED }}>{pct}%</span>
      </div>
      <div style={{ width:"100%", height:5, borderRadius:999, background:"#f3f4f6", overflow:"hidden" }}>
        <div style={{ height:"100%", borderRadius:999, width:`${pct}%`, background:barColor, transition:"width .3s" }}/>
      </div>
    </div>
  );
}

/* ── CONFIRM MODAL ── */
function ConfirmModal({ event, action, onConfirm, onCancel }) {
  const cfg = {
    approve: { icon:CheckCircle2, iconBg:"#f0fdf4",  iconColor:"#22c55e", btnBg:"linear-gradient(to right,#22c55e,#16a34a)", label:"Approve Event", msg:`"${event?.name}" will be published.` },
    reject:  { icon:XCircle,      iconBg:"#fff1f2",  iconColor:"#f43f5e", btnBg:"linear-gradient(to right,#f43f5e,#e11d48)", label:"Reject Event",  msg:`"${event?.name}" will be marked as rejected.` },
    delete:  { icon:Trash2,       iconBg:"#fff1f2",  iconColor:"#ef4444", btnBg:"linear-gradient(to right,#ef4444,#dc2626)", label:"Delete Event",  msg:`Permanently delete "${event?.name}"? Cannot be undone.` },
  }[action];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.35)", backdropFilter:"blur(4px)" }} onClick={onCancel}/>
      <div style={{ position:"relative", background:"white", borderRadius:24, boxShadow:"0 20px 60px rgba(0,0,0,0.18)", width:"100%", maxWidth:340, margin:"0 16px", padding:26, animation:"modalIn .22s ease both" }}>
        <div style={{ width:48, height:48, borderRadius:16, background:cfg.iconBg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
          <Icon style={{ width:22, height:22, color:cfg.iconColor }}/>
        </div>
        <div style={{ fontSize:15, fontWeight:800, color:TEXT_MAIN, marginBottom:6 }}>{cfg.label}</div>
        <div style={{ fontSize:13, color:TEXT_SUB, marginBottom:24, lineHeight:1.6 }}>{cfg.msg}</div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:"11px 0", borderRadius:12, border:`1px solid ${BORDER}`, fontSize:13, fontWeight:600, color:TEXT_SUB, background:"white", cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, padding:"11px 0", borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"white", background:cfg.btnBg, cursor:"pointer", fontFamily:"inherit" }}>{cfg.label}</button>
        </div>
      </div>
    </div>
  );
}

/* ── EVENT DRAWER ── */
function EventDrawer({ event, onClose, onApprove, onReject }) {
  if (!event) return null;
  const sc        = STATUS_CONFIG[event.status];
  const catGrad   = CATEGORY_GRAD[event.category] || GRAD;
  const isPending = event.status === "pending";
  const pct       = Math.round((event.seats.filled / event.seats.total) * 100);
  const barColor  = pct >= 90 ? "#f43f5e" : pct >= 60 ? "#f59e0b" : "#22c55e";

  return (
    <div style={{ position:"fixed", inset:0, top:64, zIndex:40, display:"flex", justifyContent:"flex-end" }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.28)", backdropFilter:"blur(4px)" }} onClick={onClose}/>
      <div style={{ position:"relative", background:"white", width:"100%", maxWidth:300, boxShadow:"-8px 0 40px rgba(0,0,0,0.10)", display:"flex", flexDirection:"column", animation:"slideIn .28s cubic-bezier(.22,1,.36,1) both", overflowY:"auto", overflowX:"hidden", height:"100%" }}>

        {/* Sticky close bar */}
        <div style={{ position:"sticky", top:0, zIndex:20, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:GRAD, flexShrink:0 }}>
          <span style={{ fontSize:13, fontWeight:700, color:"white" }}>Event Details</span>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:"50%", background:"rgba(255,255,255,0.25)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <X style={{ width:15, height:15, color:"white" }}/>
          </button>
        </div>

        {/* Header */}
        <div style={{ padding:"16px 20px 20px", background:GRAD, flexShrink:0 }}>
          <div style={{ display:"flex", gap:8, marginBottom:10 }}>
            <span style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 10px", borderRadius:999, background:"rgba(255,255,255,0.22)", color:"white", fontSize:11, fontWeight:700 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:sc.dot, display:"inline-block" }}/>{sc.label}
            </span>
            <span style={{ padding:"4px 10px", borderRadius:999, background:"rgba(255,255,255,0.18)", color:"white", fontSize:11, fontWeight:700 }}>{event.category}</span>
          </div>
          <div style={{ fontSize:17, fontWeight:800, color:"white", lineHeight:1.3, marginBottom:4 }}>{event.name}</div>
          <div style={{ display:"flex", alignItems:"center", gap:5, color:"rgba(255,255,255,0.75)", fontSize:12 }}>
            <MapPin style={{ width:12, height:12 }}/>{event.location}
          </div>
        </div>

        {/* Info card */}
        <div style={{ padding:"14px 16px 0", marginBottom:16 }}>
          <div style={{ background:"white", borderRadius:18, boxShadow:"0 4px 20px rgba(99,102,241,0.13)", padding:14, border:`1px solid ${BORDER}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, paddingBottom:12, borderBottom:`1px solid #f3f4f6` }}>
              <div style={{ width:40, height:40, borderRadius:12, background:catGrad, color:"white", fontSize:15, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 4px 12px rgba(0,0,0,0.14)" }}>
                {event.name.trim()[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:TEXT_MAIN, lineHeight:1.2 }}>{event.name}</div>
                <div style={{ fontSize:11, color:TEXT_MUTED, marginTop:2 }}>{event.club}</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[
                { icon:Users,    label:"Seats", value:`${event.seats.filled}/${event.seats.total}`, bg:INDIGO_LIGHT, grad:"linear-gradient(135deg,#6366f1,#818cf8)" },
                { icon:Calendar, label:"Date",  value:new Date(event.date).toLocaleDateString("en-IN",{day:"numeric",month:"short"}), bg:PINK_LIGHT, grad:"linear-gradient(135deg,#ec4899,#f472b6)" },
              ].map(({ icon:Icon, label, value, bg, grad }) => (
                <div key={label} style={{ borderRadius:12, padding:10, background:bg, display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:28, height:28, borderRadius:8, background:grad, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon style={{ width:14, height:14, color:"white" }}/>
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:800, color:TEXT_MAIN, lineHeight:1 }}>{value}</div>
                    <div style={{ fontSize:10, color:TEXT_MUTED, marginTop:2 }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex:1, padding:"0 16px 20px", display:"flex", flexDirection:"column", gap:16 }}>

          {/* About */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
              <Star style={{ width:12, height:12, color:ACCENT_INDIGO }}/>
              <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:ACCENT_INDIGO }}>About</span>
            </div>
            <p style={{ fontSize:12, color:"#4b5563", lineHeight:1.6, margin:0 }}>{event.description}</p>
          </div>

          {/* Details */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
              <Tag style={{ width:12, height:12, color:ACCENT_PINK }}/>
              <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:ACCENT_PINK }}>Details</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {[
                { icon:MapPin, label:"Location", value:event.location },
                { icon:Users,  label:"Club",     value:event.club     },
                { icon:Tag,    label:"Category", value:event.category },
              ].map(({ icon:Icon, label, value }) => (
                <div key={label} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderRadius:10, background:INDIGO_LIGHT }}>
                  <div style={{ width:26, height:26, borderRadius:8, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon style={{ width:12, height:12, color:"white" }}/>
                  </div>
                  <div>
                    <div style={{ fontSize:10, color:TEXT_MUTED }}>{label}</div>
                    <div style={{ fontSize:12, fontWeight:600, color:TEXT_MAIN }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Capacity */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
              <Users style={{ width:12, height:12, color:ACCENT_INDIGO }}/>
              <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:ACCENT_INDIGO }}>Capacity</span>
              <span style={{ marginLeft:"auto", fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:999, background:PINK_LIGHT, color:ACCENT_PINK }}>{pct}%</span>
            </div>
            <div style={{ padding:"12px", borderRadius:12, background:INDIGO_LIGHT, border:`1px solid #c7d2fe` }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:22, fontWeight:800, color:TEXT_MAIN }}>{event.seats.filled}</span>
                <span style={{ fontSize:11, color:TEXT_MUTED, alignSelf:"flex-end", marginBottom:2 }}>of {event.seats.total}</span>
              </div>
              <div style={{ height:6, borderRadius:999, background:"#c7d2fe", overflow:"hidden" }}>
                <div style={{ height:"100%", borderRadius:999, width:`${pct}%`, background:barColor }}/>
              </div>
            </div>
          </div>

          {/* Organizer */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
              <Star style={{ width:12, height:12, color:ACCENT_INDIGO }}/>
              <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:ACCENT_INDIGO }}>Organizer</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:12, background:INDIGO_LIGHT, border:`1px solid #c7d2fe` }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:GRAD, color:"white", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 2px 8px rgba(99,102,241,0.35)" }}>
                {initials(event.organizer)}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:TEXT_MAIN }}>{event.organizer}</div>
                <div style={{ fontSize:11, color:TEXT_MUTED }}>Event Organizer</div>
              </div>
            </div>
          </div>

          <div style={{ borderTop:`1px solid ${BORDER}` }}/>

          {isPending ? (
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => { onApprove(event.id); onClose(); }}
                style={{ flex:1, padding:"11px 0", borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"white", background:"linear-gradient(to right,#22c55e,#16a34a)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, boxShadow:"0 4px 14px rgba(34,197,94,0.3)", fontFamily:"inherit" }}>
                <CheckCircle2 style={{ width:15, height:15 }}/> Approve
              </button>
              <button onClick={() => { onReject(event.id); onClose(); }}
                style={{ flex:1, padding:"11px 0", borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"white", background:"linear-gradient(to right,#f43f5e,#e11d48)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, boxShadow:"0 4px 14px rgba(244,63,94,0.3)", fontFamily:"inherit" }}>
                <XCircle style={{ width:15, height:15 }}/> Reject
              </button>
            </div>
          ) : (
            <button onClick={onClose}
              style={{ width:"100%", padding:"11px 0", borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"white", background:GRAD, cursor:"pointer", boxShadow:"0 4px 14px rgba(99,102,241,0.3)", fontFamily:"inherit" }}>
              Close Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── MAIN ── */
export default function ViewEvents() {
  const [events,  setEvents]  = useState(SEED_EVENTS);
  const [filter,  setFilter]  = useState("all");
  const [search,  setSearch]  = useState("");
  const [sortKey, setSortKey] = useState("date");
  const [sortAsc, setSortAsc] = useState(true);
  const [modal,   setModal]   = useState(null);
  const [drawer,  setDrawer]  = useState(null);
  const [toast,   setToast]   = useState(null);

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const handleApprove = id => { const ev=events.find(e=>e.id===id); setEvents(p=>p.map(e=>e.id===id?{...e,status:"approved"}:e)); showToast(`"${ev.name}" approved`,"success"); };
  const handleReject  = id => { const ev=events.find(e=>e.id===id); setEvents(p=>p.map(e=>e.id===id?{...e,status:"rejected"}:e)); showToast(`"${ev.name}" rejected`,"warn"); };
  const handleDelete  = id => { const ev=events.find(e=>e.id===id); setEvents(p=>p.filter(e=>e.id!==id)); showToast(`"${ev.name}" deleted`,"error"); setModal(null); };

  const toggleSort = key => { if(sortKey===key) setSortAsc(a=>!a); else{setSortKey(key);setSortAsc(true);} };

  const filtered = useMemo(()=>{
    let list=events;
    if(filter!=="all") list=list.filter(e=>e.status===filter);
    if(search.trim()){const q=search.toLowerCase();list=list.filter(e=>e.name.toLowerCase().includes(q)||e.club.toLowerCase().includes(q)||e.organizer.toLowerCase().includes(q)||e.category.toLowerCase().includes(q));}
    return [...list].sort((a,b)=>{
      const va=sortKey==="seats"?a.seats.filled:a[sortKey];
      const vb=sortKey==="seats"?b.seats.filled:b[sortKey];
      return sortAsc?(typeof va==="string"?va.localeCompare(vb):va-vb):(typeof va==="string"?vb.localeCompare(va):vb-va);
    });
  },[events,filter,search,sortKey,sortAsc]);

  const stats={total:events.length,pending:events.filter(e=>e.status==="pending").length,approved:events.filter(e=>e.status==="approved").length,rejected:events.filter(e=>e.status==="rejected").length};

  const SortIcon=({k})=>sortKey===k?(sortAsc?<ChevronUp style={{width:11,height:11}}/>:<ChevronDown style={{width:11,height:11}}/>):<ChevronDown style={{width:11,height:11,opacity:.25}}/>;

  const TABS=[
    {key:"all",      label:"All",      count:stats.total   },
    {key:"pending",  label:"Pending",  count:stats.pending },
    {key:"approved", label:"Approved", count:stats.approved},
    {key:"rejected", label:"Rejected", count:stats.rejected},
  ];

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'DM Sans',system-ui,sans-serif", background:"linear-gradient(135deg,#eef2ff 0%,#ffffff 50%,#fdf2f8 100%)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box}
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .row-anim { animation: fadeUp .2s ease both; }
        .es-row:hover td { background:#f9fafb!important; }
        .sort-th { cursor:pointer; }
        .sort-th:hover { color:${ACCENT_INDIGO}!important; }
        .action-btn { background:transparent; border:none; cursor:pointer; width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; color:${TEXT_MUTED}; transition:background .15s,color .15s; font-family:inherit; }
        .action-btn:hover         { background:${INDIGO_LIGHT}; color:${ACCENT_INDIGO}; }
        .action-btn.approve:hover { background:#f0fdf4; color:#16a34a; }
        .action-btn.reject:hover  { background:#fff1f2; color:#f43f5e; }
        .action-btn.reset:hover   { background:#fffbeb; color:#d97706; }
        .action-btn.del:hover     { background:#fff1f2; color:#ef4444; }
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:4px}
      `}</style>

      <div style={{ padding:"24px", width:"100%" }}>

        {/* ── HEADER ── */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:22, gap:12, flexWrap:"wrap" }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", color:ACCENT_INDIGO, background:INDIGO_LIGHT, border:"1px solid #c7d2fe", borderRadius:999, padding:"3px 10px", marginBottom:8 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:ACCENT_INDIGO, display:"inline-block" }}/>
              Administration
            </div>
            <h1 style={{ fontSize:23, fontWeight:800, color:TEXT_MAIN, margin:0, letterSpacing:"-0.4px" }}>View Events</h1>
            <p style={{ fontSize:12, color:TEXT_MUTED, margin:"4px 0 0" }}>Manage and moderate all club events</p>
          </div>
          {stats.pending > 0 && (
            <div style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px", borderRadius:12, background:"#fffbeb", border:"1px solid #fde68a", color:"#b45309", fontSize:12, fontWeight:600, flexShrink:0 }}>
              <Zap style={{ width:14, height:14 }}/>{stats.pending} awaiting review
            </div>
          )}
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
          {[
            { label:"Total",    value:stats.total,    icon:Calendar,     accentBg:INDIGO_LIGHT, accentColor:ACCENT_INDIGO },
            { label:"Pending",  value:stats.pending,  icon:Clock,        accentBg:"#fffbeb",    accentColor:"#b45309"     },
            { label:"Approved", value:stats.approved, icon:CheckCircle2, accentBg:"#f0fdf4",    accentColor:"#15803d"     },
            { label:"Rejected", value:stats.rejected, icon:XCircle,      accentBg:PINK_LIGHT,   accentColor:ACCENT_PINK   },
          ].map(({ label, value, icon:Icon, accentBg, accentColor }, i) => (
            <div key={label} className="row-anim"
              style={{ background:"white", borderRadius:18, padding:"16px", boxShadow:"0 1px 6px rgba(0,0,0,0.06)", border:`1px solid ${BORDER}`, display:"flex", alignItems:"center", gap:12, animationDelay:`${i*50}ms`, transition:"transform .2s,box-shadow .2s" }}
              onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(99,102,241,0.12)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.boxShadow="0 1px 6px rgba(0,0,0,0.06)"; }}>
              <div style={{ width:42, height:42, borderRadius:13, background:accentBg, color:accentColor, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon style={{ width:19, height:19 }}/>
              </div>
              <div>
                <div style={{ fontSize:24, fontWeight:800, color:TEXT_MAIN, lineHeight:1, letterSpacing:"-0.4px" }}>{value}</div>
                <div style={{ fontSize:11, color:TEXT_MUTED, marginTop:2 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── TABLE CARD ── */}
        <div style={{ background:"white", borderRadius:20, boxShadow:"0 1px 6px rgba(0,0,0,0.06)", border:`1px solid ${BORDER}`, overflow:"hidden" }}>

          {/* Toolbar */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", borderBottom:`1px solid #f3f4f6`, gap:12, flexWrap:"wrap" }}>
            {/* Tabs */}
            <div style={{ display:"flex", alignItems:"center", gap:3, borderRadius:12, padding:4, background:"#f9fafb", border:`1px solid ${BORDER}` }}>
              {TABS.map(({ key, label, count }) => (
                <button key={key} onClick={() => setFilter(key)}
                  style={{ padding:"6px 12px", borderRadius:9, border:"none", fontSize:11, fontWeight: filter===key ? 700 : 500, color: filter===key ? ACCENT_INDIGO : TEXT_MUTED, background: filter===key ? "white" : "transparent", cursor:"pointer", boxShadow: filter===key ? "0 1px 4px rgba(99,102,241,0.15)" : "none", transition:"all .15s", whiteSpace:"nowrap", fontFamily:"inherit" }}>
                  {label}
                  <span style={{ marginLeft:5, padding:"1px 6px", borderRadius:6, fontSize:10, background: filter===key ? INDIGO_LIGHT : "transparent", color: filter===key ? ACCENT_INDIGO : "inherit" }}>{count}</span>
                </button>
              ))}
            </div>
            {/* Search */}
            <div style={{ display:"flex", alignItems:"center", gap:8, background:"#f9fafb", border:`1px solid ${BORDER}`, borderRadius:12, padding:"7px 12px", minWidth:200 }}>
              <Search style={{ width:13, height:13, color:TEXT_MUTED, flexShrink:0 }}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search events…"
                style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:TEXT_MAIN, width:"100%", fontFamily:"inherit" }}/>
              {search && <button onClick={()=>setSearch("")} style={{ border:"none", background:"none", cursor:"pointer", padding:0, display:"flex" }}><X style={{ width:12, height:12, color:TEXT_MUTED }}/></button>}
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#f9fafb", borderBottom:`1px solid ${BORDER}` }}>
                  {[
                    {key:"name",      label:"Event"    },
                    {key:"club",      label:"Club"     },
                    {key:"organizer", label:"Organizer"},
                    {key:"date",      label:"Date"     },
                    {key:"seats",     label:"Seats"    },
                    {key:"category",  label:"Category" },
                    {key:"status",    label:"Status"   },
                    {key:null,        label:"Actions"  },
                  ].map(({ key, label }) => (
                    <th key={label} onClick={() => key && toggleSort(key)}
                      className={key ? "sort-th" : ""}
                      style={{ textAlign:"left", padding:"11px 16px", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:ACCENT_INDIGO, whiteSpace:"nowrap", userSelect:"none" }}>
                      <span style={{ display:"flex", alignItems:"center", gap:4 }}>{label}{key && <SortIcon k={key}/>}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding:"52px 20px", textAlign:"center", color:TEXT_MUTED, fontSize:13 }}>
                    <Calendar style={{ width:32, height:32, margin:"0 auto 10px", color:"#c7d2fe", display:"block" }}/>No events found
                  </td></tr>
                ) : filtered.map((ev, i) => {
                  const sc   = STATUS_CONFIG[ev.status];
                  const pill = CATEGORY_PILL[ev.category] || { bg:"#f3f4f6", color:TEXT_SUB };
                  return (
                    <tr key={ev.id} className="row-anim es-row" style={{ animationDelay:`${i*35}ms`, borderBottom:`1px solid #f9fafb` }}>

                      {/* Event */}
                      <td style={{ padding:"11px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:34, height:34, borderRadius:10, background:AVATAR_PALETTE[i%AVATAR_PALETTE.length], color:"white", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 2px 8px rgba(0,0,0,0.12)" }}>
                            {ev.name.trim()[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize:13, fontWeight:700, color:TEXT_MAIN, whiteSpace:"nowrap" }}>{ev.name}</div>
                            <div style={{ fontSize:10, color:TEXT_MUTED, display:"flex", alignItems:"center", gap:3 }}>
                              <MapPin style={{ width:9, height:9 }}/>{ev.location}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Club */}
                      <td style={{ padding:"11px 16px" }}>
                        <span style={{ fontSize:12, color:TEXT_SUB, fontWeight:500, whiteSpace:"nowrap" }}>{ev.club}</span>
                      </td>

                      {/* Organizer */}
                      <td style={{ padding:"11px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:7, whiteSpace:"nowrap" }}>
                          <div style={{ width:26, height:26, borderRadius:"50%", background:AVATAR_PALETTE[(i+3)%AVATAR_PALETTE.length], color:"white", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            {initials(ev.organizer)}
                          </div>
                          <span style={{ fontSize:12, color:TEXT_SUB, fontWeight:500 }}>{ev.organizer}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td style={{ padding:"11px 16px", whiteSpace:"nowrap" }}>
                        <div style={{ fontSize:12, fontWeight:600, color:TEXT_MAIN }}>{new Date(ev.date).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</div>
                        <div style={{ fontSize:10, color:TEXT_MUTED }}>{new Date(ev.date).getFullYear()}</div>
                      </td>

                      {/* Seats */}
                      <td style={{ padding:"11px 16px", minWidth:90 }}>
                        <SeatsBar filled={ev.seats.filled} total={ev.seats.total}/>
                      </td>

                      {/* Category */}
                      <td style={{ padding:"11px 16px" }}>
                        <span style={{ display:"inline-block", padding:"4px 10px", borderRadius:999, fontSize:11, fontWeight:600, background:pill.bg, color:pill.color }}>
                          {ev.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding:"11px 16px" }}>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:999, fontSize:11, fontWeight:700, background:sc.bg, color:sc.color, border:`1px solid ${sc.border}` }}>
                          <span style={{ width:6, height:6, borderRadius:"50%", background:sc.dot, display:"inline-block", flexShrink:0 }}/>
                          {sc.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding:"11px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:2 }}>
                          <button className="action-btn" title="View details" onClick={()=>setDrawer(ev)}><Eye style={{width:14,height:14}}/></button>
                          {ev.status==="pending" && <>
                            <button className="action-btn approve" title="Approve" onClick={()=>setModal({event:ev,action:"approve"})}><CheckCircle2 style={{width:14,height:14}}/></button>
                            <button className="action-btn reject"  title="Reject"  onClick={()=>setModal({event:ev,action:"reject"})}><XCircle style={{width:14,height:14}}/></button>
                          </>}
                          {ev.status!=="pending" && (
                            <button className="action-btn reset" title="Move to pending" onClick={()=>{setEvents(p=>p.map(e=>e.id===ev.id?{...e,status:"pending"}:e));showToast(`"${ev.name}" moved to review`,"info");}}><RefreshCw style={{width:14,height:14}}/></button>
                          )}
                          <button className="action-btn del" title="Delete" onClick={()=>setModal({event:ev,action:"delete"})}><Trash2 style={{width:14,height:14}}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div style={{ padding:"11px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:`1px solid #f3f4f6`, background:"#fafafa" }}>
            <span style={{ fontSize:11, color:TEXT_MUTED }}>
              Showing <b style={{color:TEXT_MAIN}}>{filtered.length}</b> of <b style={{color:TEXT_MAIN}}>{events.length}</b> events
            </span>
            <button style={{ width:28, height:28, borderRadius:8, background:GRAD, border:"none", color:"white", fontSize:11, fontWeight:700, cursor:"pointer", boxShadow:"0 2px 8px rgba(99,102,241,0.28)" }}>1</button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <ConfirmModal
          event={modal.event} action={modal.action}
          onCancel={()=>setModal(null)}
          onConfirm={()=>{ if(modal.action==="approve") handleApprove(modal.event.id); else if(modal.action==="reject") handleReject(modal.event.id); else if(modal.action==="delete") handleDelete(modal.event.id); setModal(null); }}
        />
      )}

      <EventDrawer event={drawer} onClose={()=>setDrawer(null)} onApprove={handleApprove} onReject={handleReject}/>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, right:24, zIndex:200, display:"flex", alignItems:"center", gap:10, padding:"11px 18px", borderRadius:14, boxShadow:"0 8px 24px rgba(99,102,241,0.28)", fontSize:13, fontWeight:600, color:"white", animation:"toastIn .3s ease both",
          background: toast.type==="success" ? GRAD : toast.type==="warn" ? "linear-gradient(to right,#f59e0b,#d97706)" : toast.type==="info" ? "linear-gradient(to right,#6366f1,#4f46e5)" : "linear-gradient(to right,#ef4444,#dc2626)" }}>
          {toast.type==="success" ? <CheckCircle2 style={{width:15,height:15}}/> : toast.type==="warn" ? <XCircle style={{width:15,height:15}}/> : toast.type==="info" ? <RefreshCw style={{width:15,height:15}}/> : <Trash2 style={{width:15,height:15}}/>}
          {toast.msg}
        </div>
      )}
    </div>
  );
}