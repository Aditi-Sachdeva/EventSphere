import { useState, useMemo } from "react";
import {
  Plus, Search, Users, CheckCircle, XCircle, RefreshCw,
  ChevronUp, ChevronDown,
  TrendingUp, Calendar, Eye, Trash2, X, Clock, Star
} from "lucide-react";

// ── THEME TOKENS (matches Dashboard & Login) ───────────────────────────────
const GRAD          = "linear-gradient(to right, #ec4899, #6366f1)";
const GRAD_DIAG     = "linear-gradient(135deg, #ec4899 0%, #6366f1 100%)";
const ACCENT_PINK   = "#ec4899";
const ACCENT_INDIGO = "#6366f1";
const PINK_LIGHT    = "#fdf2f8";
const INDIGO_LIGHT  = "#eef2ff";
const BORDER        = "#e5e7eb";
const TEXT_MAIN     = "#1f2937";
const TEXT_SUB      = "#6b7280";
const TEXT_MUTED    = "#9ca3af";
// ───────────────────────────────────────────────────────────────────────────

const SEED_CLUBS = [
  { id:1, name:"Coding Club",       organizer:"Rahul Sharma",    members:["Rahul","Priya","Dev"],       status:"active",   created:"2024-01-15", events:12, category:"Technology" },
  { id:2, name:"Music Club",        organizer:"Aman Verma",      members:["Aman"],                      status:"inactive", created:"2024-02-20", events:4,  category:"Arts"       },
  { id:3, name:"Photography Guild", organizer:"Neha Joshi",      members:["Neha","Karan","Tanya"],      status:"active",   created:"2024-03-05", events:8,  category:"Arts"       },
  { id:4, name:"Chess Society",     organizer:"Dev Kapoor",      members:["Dev","Amit"],                status:"active",   created:"2024-03-18", events:20, category:"Sports"     },
  { id:5, name:"Debate Forum",      organizer:"Priya Nair",      members:["Priya","Simran","Meera"],    status:"inactive", created:"2024-04-02", events:6,  category:"Academic"   },
  { id:6, name:"Film Appreciation", organizer:"Tanya Gupta",     members:["Tanya","Rohan"],             status:"active",   created:"2024-04-20", events:15, category:"Arts"       },
  { id:7, name:"Robotics Lab",      organizer:"Amit Chatterjee", members:["Amit","Dev","Karan","Neha"], status:"active",   created:"2024-05-01", events:9,  category:"Technology" },
  { id:8, name:"Book Circle",       organizer:"Simran Kaur",     members:["Simran","Aanya"],            status:"inactive", created:"2024-05-14", events:3,  category:"Academic"   },
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

const AVATAR_PALETTE = [
  ACCENT_PINK, ACCENT_INDIGO, "#8b5cf6", "#7c3aed", "#db2777",
  "#4f46e5", "#c026d3", "#9333ea", "#6366f1", "#e11d48",
];

function getColor(idx) { return AVATAR_PALETTE[Math.abs(idx) % AVATAR_PALETTE.length]; }
function initials(name) {
  if (!name) return "?";
  return name.trim().split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
}

/* ── CONFIRM MODAL ── */
function ConfirmModal({ club, action, onConfirm, onCancel }) {
  const isDeactivate = action === "deactivate";
  return (
    <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 16px" }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.35)", backdropFilter:"blur(4px)" }} onClick={onCancel}/>
      <div style={{ position:"relative", background:"white", borderRadius:24, boxShadow:"0 20px 60px rgba(0,0,0,0.18)", width:"100%", maxWidth:340, padding:26, animation:"modalIn .22s ease both" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
          <div style={{ width:44, height:44, borderRadius:14, background: isDeactivate ? "#fee2e2" : "#f0fdf4", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            {isDeactivate
              ? <XCircle style={{ width:21, height:21, color:"#ef4444" }}/>
              : <RefreshCw style={{ width:21, height:21, color:"#22c55e" }}/>}
          </div>
          <div style={{ fontSize:15, fontWeight:800, color:TEXT_MAIN }}>{isDeactivate ? "Deactivate Club?" : "Reactivate Club?"}</div>
        </div>
        <p style={{ fontSize:13, color:TEXT_SUB, marginBottom:22, lineHeight:1.6 }}>
          {isDeactivate
            ? `"${club.name}" will be hidden from members and events will be paused.`
            : `"${club.name}" will be restored and members can participate again.`}
        </p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:"11px 0", borderRadius:12, border:`1px solid ${BORDER}`, fontSize:13, fontWeight:600, color:TEXT_SUB, background:"white", cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, padding:"11px 0", borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"white", background: isDeactivate ? "#ef4444" : "#22c55e", cursor:"pointer", fontFamily:"inherit" }}>
            {isDeactivate ? "Deactivate" : "Reactivate"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── DETAIL DRAWER ── */
function ClubDrawer({ club, onClose, onToggleStatus }) {
  if (!club) return null;
  const isActive   = club.status === "active";
  const catGrad    = CATEGORY_GRAD[club.category] || GRAD_DIAG;
  const createdDate = new Date(club.created).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});

  return (
    <div style={{ position:"fixed", inset:0, top:64, zIndex:40, display:"flex", justifyContent:"flex-end" }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.28)", backdropFilter:"blur(4px)" }} onClick={onClose}/>
      <div style={{ position:"relative", background:"white", width:"100%", maxWidth:300, boxShadow:"-8px 0 40px rgba(0,0,0,0.1)", display:"flex", flexDirection:"column", animation:"slideIn .28s cubic-bezier(.22,1,.36,1) both", overflowY:"auto", overflowX:"hidden", height:"100%" }}>

        {/* Sticky close bar */}
        <div style={{ position:"sticky", top:0, zIndex:20, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:GRAD, flexShrink:0 }}>
          <span style={{ fontSize:13, fontWeight:700, color:"white" }}>Club Details</span>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:"50%", background:"rgba(255,255,255,0.25)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <X style={{ width:15, height:15, color:"white" }}/>
          </button>
        </div>

        {/* Header */}
        <div style={{ padding:"16px 20px 20px", background:GRAD, flexShrink:0 }}>
          <div style={{ display:"flex", gap:8, marginBottom:10 }}>
            <span style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 10px", borderRadius:999, background:"rgba(255,255,255,0.22)", color:"white", fontSize:11, fontWeight:700 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background: isActive ? "#86efac" : "rgba(255,255,255,0.5)", display:"inline-block" }}/>
              {isActive ? "Active" : "Inactive"}
            </span>
            <span style={{ padding:"4px 10px", borderRadius:999, background:"rgba(255,255,255,0.18)", color:"white", fontSize:11, fontWeight:700 }}>{club.category}</span>
          </div>
          <div style={{ fontSize:17, fontWeight:800, color:"white", lineHeight:1.3, marginBottom:4 }}>{club.name}</div>
          <div style={{ display:"flex", alignItems:"center", gap:5, color:"rgba(255,255,255,0.75)", fontSize:12 }}>
            <Clock style={{ width:12, height:12 }}/>Created {createdDate}
          </div>
        </div>

        {/* Info card */}
        <div style={{ padding:"14px 16px 0", marginBottom:16 }}>
          <div style={{ background:"white", borderRadius:18, boxShadow:"0 4px 20px rgba(99,102,241,0.13)", padding:14, border:`1px solid ${BORDER}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, paddingBottom:12, borderBottom:`1px solid #f3f4f6` }}>
              <div style={{ width:40, height:40, borderRadius:12, background:catGrad, color:"white", fontSize:15, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 4px 12px rgba(0,0,0,0.15)" }}>
                {club.name.trim()[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:TEXT_MAIN, lineHeight:1.2 }}>{club.name}</div>
                <div style={{ fontSize:11, color:TEXT_MUTED, marginTop:2 }}>Club · {club.category}</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[
                { icon:Users,    label:"Members", value:club.members.length, bg:INDIGO_LIGHT, grad:"linear-gradient(135deg,#6366f1,#818cf8)" },
                { icon:Calendar, label:"Events",  value:club.events,         bg:PINK_LIGHT,   grad:"linear-gradient(135deg,#ec4899,#f472b6)" },
              ].map(({ icon:Icon, label, value, bg, grad }) => (
                <div key={label} style={{ borderRadius:12, padding:10, background:bg, display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:28, height:28, borderRadius:8, background:grad, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon style={{ width:14, height:14, color:"white" }}/>
                  </div>
                  <div>
                    <div style={{ fontSize:18, fontWeight:800, color:TEXT_MAIN, lineHeight:1 }}>{value}</div>
                    <div style={{ fontSize:10, color:TEXT_MUTED, marginTop:2 }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex:1, padding:"0 16px 20px", display:"flex", flexDirection:"column", gap:16 }}>

          {/* Organizer */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
              <Star style={{ width:12, height:12, color:ACCENT_INDIGO }}/>
              <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:ACCENT_INDIGO }}>Organizer</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:12, background:INDIGO_LIGHT, border:`1px solid #c7d2fe` }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:GRAD, color:"white", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 2px 8px rgba(99,102,241,0.35)" }}>
                {initials(club.organizer)}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:TEXT_MAIN }}>{club.organizer}</div>
                <div style={{ fontSize:11, color:TEXT_MUTED }}>Club Lead</div>
              </div>
            </div>
          </div>

          {/* Members */}
          <div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <Users style={{ width:12, height:12, color:ACCENT_PINK }}/>
                <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:ACCENT_PINK }}>Members</span>
              </div>
              <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:999, background:PINK_LIGHT, color:ACCENT_PINK }}>{club.members.length}</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {club.members.map((m,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 10px", borderRadius:10, background:"#f9fafb" }}>
                  <div style={{ width:26, height:26, borderRadius:"50%", background:getColor(i+3), color:"white", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {initials(m)}
                  </div>
                  <span style={{ fontSize:12, fontWeight:500, color:TEXT_MAIN }}>{m}</span>
                  {i===0 && <span style={{ marginLeft:"auto", fontSize:10, padding:"2px 7px", borderRadius:999, fontWeight:600, background:INDIGO_LIGHT, color:ACCENT_INDIGO }}>Lead</span>}
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop:`1px solid ${BORDER}` }}/>

          <button
            onClick={() => { onToggleStatus(club.id); onClose(); }}
            style={{ width:"100%", padding:"11px 0", borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"white", background: isActive ? "linear-gradient(to right,#ef4444,#dc2626)" : GRAD, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, boxShadow: isActive ? "0 4px 14px rgba(239,68,68,0.3)" : "0 4px 14px rgba(99,102,241,0.3)", fontFamily:"inherit" }}>
            {isActive
              ? <><XCircle style={{width:15,height:15}}/> Deactivate Club</>
              : <><RefreshCw style={{width:15,height:15}}/> Reactivate Club</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN ── */
export default function ViewClubs() {
  const [clubs,setClubs]                 = useState(SEED_CLUBS);
  const [filter,setFilter]               = useState("all");
  const [search,setSearch]               = useState("");
  const [sortKey,setSortKey]             = useState("name");
  const [sortAsc,setSortAsc]             = useState(true);
  const [modal,setModal]                 = useState(null);
  const [deleteConfirm,setDeleteConfirm] = useState(null);
  const [drawer,setDrawer]               = useState(null);
  const [toast,setToast]                 = useState(null);

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const handleToggle = id => {
    const club = clubs.find(c=>c.id===id);
    setClubs(prev=>prev.map(c=>c.id===id?{...c,status:c.status==="active"?"inactive":"active"}:c));
    showToast(club.status==="active"?`"${club.name}" deactivated`:`"${club.name}" reactivated`, club.status==="active"?"warn":"success");
  };

  const handleDelete = id => setDeleteConfirm(clubs.find(c=>c.id===id));
  const confirmDelete = () => {
    setClubs(prev=>prev.filter(c=>c.id!==deleteConfirm.id));
    showToast(`"${deleteConfirm.name}" deleted`, "error");
    setDeleteConfirm(null);
  };

  const toggleSort = key => { if(sortKey===key) setSortAsc(a=>!a); else{setSortKey(key);setSortAsc(true);} };

  const filtered = useMemo(()=>{
    let list = clubs;
    if(filter!=="all") list=list.filter(c=>c.status===filter);
    if(search.trim()){const q=search.toLowerCase();list=list.filter(c=>c.name.toLowerCase().includes(q)||c.organizer.toLowerCase().includes(q)||c.category.toLowerCase().includes(q));}
    return [...list].sort((a,b)=>{
      const va=sortKey==="members"?a.members.length:sortKey==="events"?a.events:a[sortKey];
      const vb=sortKey==="members"?b.members.length:sortKey==="events"?b.events:b[sortKey];
      return sortAsc?(typeof va==="string"?va.localeCompare(vb):va-vb):(typeof va==="string"?vb.localeCompare(va):vb-va);
    });
  },[clubs,filter,search,sortKey,sortAsc]);

  const stats={total:clubs.length,active:clubs.filter(c=>c.status==="active").length,inactive:clubs.filter(c=>c.status==="inactive").length,events:clubs.reduce((s,c)=>s+c.events,0)};

  const SortIcon = ({k}) => sortKey===k
    ? (sortAsc ? <ChevronUp style={{width:11,height:11}}/> : <ChevronDown style={{width:11,height:11}}/>)
    : <ChevronDown style={{width:11,height:11,opacity:.25}}/>;

  const TABS = [
    { key:"all",      label:"All",      count:stats.total    },
    { key:"active",   label:"Active",   count:stats.active   },
    { key:"inactive", label:"Inactive", count:stats.inactive },
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
        .action-btn:hover     { background:${INDIGO_LIGHT}; color:${ACCENT_INDIGO}; }
        .action-btn.deact:hover { background:#fff1f2; color:#ef4444; }
        .action-btn.react:hover { background:#f0fdf4; color:#22c55e; }
        .action-btn.del:hover   { background:#fff1f2; color:#ef4444; }
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
            <h1 style={{ fontSize:23, fontWeight:800, color:TEXT_MAIN, margin:0, letterSpacing:"-0.4px" }}>View Clubs</h1>
            <p style={{ fontSize:12, color:TEXT_MUTED, margin:"4px 0 0" }}>Manage and monitor all clubs in the system</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px", borderRadius:12, background:"white", border:`1px solid ${BORDER}`, color:TEXT_SUB, fontSize:12, fontWeight:600, flexShrink:0, boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
            <Users style={{ width:14, height:14, color:ACCENT_PINK }}/>
            {clubs.length} clubs available
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
          {[
            { label:"Total Clubs",  value:stats.total,    icon:Users,       accentBg:INDIGO_LIGHT, accentColor:ACCENT_INDIGO, bar:"linear-gradient(to right,#6366f1,#818cf8)" },
            { label:"Active",       value:stats.active,   icon:CheckCircle, accentBg:"#f0fdf4",    accentColor:"#15803d",     bar:"linear-gradient(to right,#22c55e,#86efac)" },
            { label:"Inactive",     value:stats.inactive, icon:XCircle,     accentBg:"#fff1f2",    accentColor:"#be123c",     bar:"linear-gradient(to right,#f43f5e,#fda4af)" },
            { label:"Total Events", value:stats.events,   icon:TrendingUp,  accentBg:PINK_LIGHT,   accentColor:ACCENT_PINK,   bar:"linear-gradient(to right,#ec4899,#f472b6)" },
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
            {/* Tab pills */}
            <div style={{ display:"flex", alignItems:"center", gap:3, borderRadius:12, padding:4, background:"#f9fafb", border:`1px solid ${BORDER}` }}>
              {TABS.map(({ key, label, count }) => (
                <button key={key} onClick={() => setFilter(key)}
                  style={{ padding:"6px 12px", borderRadius:9, border:"none", fontSize:11, fontWeight: filter===key ? 700 : 500, color: filter===key ? ACCENT_INDIGO : TEXT_MUTED, background: filter===key ? "white" : "transparent", cursor:"pointer", boxShadow: filter===key ? "0 1px 4px rgba(99,102,241,0.15)" : "none", transition:"all .15s", whiteSpace:"nowrap", fontFamily:"inherit" }}>
                  {label}
                  <span style={{ marginLeft:5, padding:"1px 6px", borderRadius:6, fontSize:10, background: filter===key ? INDIGO_LIGHT : "transparent", color: filter===key ? ACCENT_INDIGO : "inherit" }}>{count}</span>
                </button>
              ))}
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              {/* Search */}
              <div style={{ display:"flex", alignItems:"center", gap:8, background:"#f9fafb", border:`1px solid ${BORDER}`, borderRadius:12, padding:"7px 12px", minWidth:190 }}>
                <Search style={{ width:13, height:13, color:TEXT_MUTED, flexShrink:0 }}/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clubs…"
                  style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:TEXT_MAIN, width:"100%", fontFamily:"inherit" }}/>
                {search && <button onClick={()=>setSearch("")} style={{ border:"none", background:"none", cursor:"pointer", padding:0, display:"flex" }}><X style={{ width:12, height:12, color:TEXT_MUTED }}/></button>}
              </div>
              {/* Create button */}
              <button style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:12, border:"none", background:GRAD, color:"white", fontSize:12, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 14px rgba(99,102,241,0.28)", whiteSpace:"nowrap", fontFamily:"inherit", transition:"opacity .15s" }}
                onMouseEnter={e=>e.currentTarget.style.opacity=".9"}
                onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                <Plus style={{ width:14, height:14 }}/> Create Club
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#f9fafb", borderBottom:`1px solid ${BORDER}` }}>
                  {[
                    { key:"name",      label:"Club Name"  },
                    { key:"organizer", label:"Organizer"  },
                    { key:"members",   label:"Members"    },
                    { key:"events",    label:"Events"     },
                    { key:"category",  label:"Category"   },
                    { key:null,        label:"Actions"    },
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
                  <tr><td colSpan={6} style={{ padding:"52px 20px", textAlign:"center", color:TEXT_MUTED, fontSize:13 }}>
                    <Users style={{ width:32, height:32, margin:"0 auto 10px", color:"#c7d2fe", display:"block" }}/>No clubs found
                  </td></tr>
                ) : filtered.map((club, i) => {
                  const isActive = club.status === "active";
                  const pill = CATEGORY_PILL[club.category] || { bg:"#f3f4f6", color:TEXT_SUB };
                  return (
                    <tr key={club.id} className="row-anim es-row" style={{ animationDelay:`${i*35}ms`, borderBottom:`1px solid #f9fafb` }}>

                      {/* Club name */}
                      <td style={{ padding:"11px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:34, height:34, borderRadius:10, background:AVATAR_PALETTE[i%AVATAR_PALETTE.length], color:"white", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 2px 8px rgba(0,0,0,0.12)" }}>
                            {club.name.trim()[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize:13, fontWeight:700, color:TEXT_MAIN }}>{club.name}</div>
                            <div style={{ fontSize:10, color:TEXT_MUTED }}>{new Date(club.created).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
                          </div>
                        </div>
                      </td>

                      {/* Organizer */}
                      <td style={{ padding:"11px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:26, height:26, borderRadius:"50%", background:AVATAR_PALETTE[(i+3)%AVATAR_PALETTE.length], color:"white", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            {initials(club.organizer)}
                          </div>
                          <span style={{ fontSize:12, color:TEXT_SUB, fontWeight:500, whiteSpace:"nowrap" }}>{club.organizer}</span>
                        </div>
                      </td>

                      {/* Members */}
                      <td style={{ padding:"11px 16px" }}>
                        <div style={{ display:"flex", marginBottom:3 }}>
                          {club.members.slice(0,3).map((m,j) => (
                            <div key={j} title={m} style={{ width:24, height:24, borderRadius:"50%", background:getColor(j), color:"white", fontSize:9, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", outline:"2px solid white", marginLeft: j>0 ? -6 : 0, flexShrink:0 }}>
                              {initials(m)}
                            </div>
                          ))}
                          {club.members.length > 3 && (
                            <div style={{ width:24, height:24, borderRadius:"50%", background:INDIGO_LIGHT, fontSize:9, fontWeight:600, color:ACCENT_INDIGO, display:"flex", alignItems:"center", justifyContent:"center", outline:"2px solid white", marginLeft:-6 }}>
                              +{club.members.length-3}
                            </div>
                          )}
                        </div>
                        <div style={{ fontSize:10, color:TEXT_MUTED }}>{club.members.length} member{club.members.length!==1?"s":""}</div>
                      </td>

                      {/* Events */}
                      <td style={{ padding:"11px 16px" }}>
                        <span style={{ fontSize:13, fontWeight:700, color:TEXT_MAIN }}>{club.events}</span>
                        <span style={{ fontSize:11, color:TEXT_MUTED, marginLeft:4 }}>events</span>
                      </td>

                      {/* Category */}
                      <td style={{ padding:"11px 16px" }}>
                        <span style={{ display:"inline-block", padding:"4px 10px", borderRadius:999, fontSize:11, fontWeight:600, background:pill.bg, color:pill.color }}>
                          {club.category}
                        </span>
                      </td>

                      {/* Status + Actions */}
                      <td style={{ padding:"11px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          {/* Status dot */}
                          <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"3px 8px", borderRadius:999, fontSize:10, fontWeight:700,
                            background: isActive ? "#f0fdf4" : "#fff1f2",
                            color:       isActive ? "#15803d"  : "#be123c",
                            border: `1px solid ${isActive ? "#bbf7d0" : "#fecdd3"}`,
                            marginRight:4 }}>
                            <span style={{ width:5, height:5, borderRadius:"50%", background: isActive ? "#22c55e" : "#f43f5e", display:"inline-block" }}/>
                            {isActive ? "Active" : "Inactive"}
                          </span>
                          <button className="action-btn" title="View details" onClick={()=>setDrawer(club)}><Eye style={{width:14,height:14}}/></button>
                          <button className={`action-btn ${isActive?"deact":"react"}`} title={isActive?"Deactivate":"Reactivate"} onClick={()=>setModal({club,action:isActive?"deactivate":"reactivate"})}>
                            {isActive ? <XCircle style={{width:14,height:14}}/> : <RefreshCw style={{width:14,height:14}}/>}
                          </button>
                          <button className="action-btn del" title="Delete" onClick={()=>handleDelete(club.id)}><Trash2 style={{width:14,height:14}}/></button>
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
              Showing <b style={{color:TEXT_MAIN}}>{filtered.length}</b> of <b style={{color:TEXT_MAIN}}>{clubs.length}</b> clubs
            </span>
            <button style={{ width:28, height:28, borderRadius:8, background:GRAD, border:"none", color:"white", fontSize:11, fontWeight:700, cursor:"pointer", boxShadow:"0 2px 8px rgba(99,102,241,0.28)" }}>1</button>
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      {modal && (
        <ConfirmModal club={modal.club} action={modal.action} onCancel={()=>setModal(null)} onConfirm={()=>{handleToggle(modal.club.id);setModal(null);}}/>
      )}

      {deleteConfirm && (
        <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 16px" }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.35)", backdropFilter:"blur(4px)" }} onClick={()=>setDeleteConfirm(null)}/>
          <div style={{ position:"relative", background:"white", borderRadius:24, boxShadow:"0 20px 60px rgba(0,0,0,0.18)", width:"100%", maxWidth:340, padding:26, animation:"modalIn .22s ease both" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
              <div style={{ width:44, height:44, borderRadius:14, background:"#fee2e2", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Trash2 style={{ width:20, height:20, color:"#ef4444" }}/>
              </div>
              <div style={{ fontSize:15, fontWeight:800, color:TEXT_MAIN }}>Delete Club?</div>
            </div>
            <p style={{ fontSize:13, color:TEXT_SUB, marginBottom:22, lineHeight:1.6 }}>
              Are you sure you want to delete <b style={{color:TEXT_MAIN}}>"{deleteConfirm.name}"</b>? This action cannot be undone.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setDeleteConfirm(null)} style={{ flex:1, padding:"11px 0", borderRadius:12, border:`1px solid ${BORDER}`, fontSize:13, fontWeight:600, color:TEXT_SUB, background:"white", cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
              <button onClick={confirmDelete} style={{ flex:1, padding:"11px 0", borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"white", background:"linear-gradient(to right,#ef4444,#dc2626)", cursor:"pointer", fontFamily:"inherit" }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <ClubDrawer club={drawer} onClose={()=>setDrawer(null)} onToggleStatus={handleToggle}/>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, right:24, zIndex:200, display:"flex", alignItems:"center", gap:10, padding:"11px 18px", borderRadius:14, boxShadow:"0 8px 24px rgba(99,102,241,0.28)", fontSize:13, fontWeight:600, color:"white", animation:"toastIn .3s ease both",
          background: toast.type==="success" ? GRAD : toast.type==="warn" ? "linear-gradient(to right,#f59e0b,#d97706)" : "linear-gradient(to right,#ef4444,#dc2626)" }}>
          {toast.type==="success" ? <CheckCircle style={{width:15,height:15}}/> : toast.type==="warn" ? <XCircle style={{width:15,height:15}}/> : <Trash2 style={{width:15,height:15}}/>}
          {toast.msg}
        </div>
      )}
    </div>
  );
}