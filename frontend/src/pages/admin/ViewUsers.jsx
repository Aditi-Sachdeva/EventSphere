import { useState, useRef, useEffect } from "react";

// ── THEME TOKENS (matches Dashboard & Login) ───────────────────────────────
const GRAD        = "linear-gradient(to right, #ec4899, #6366f1)";
const ACCENT_PINK   = "#ec4899";
const ACCENT_INDIGO = "#6366f1";
const PINK_LIGHT    = "#fdf2f8";
const INDIGO_LIGHT  = "#eef2ff";
const BORDER        = "#e5e7eb";
const TEXT_MAIN     = "#1f2937";
const TEXT_SUB      = "#6b7280";
const TEXT_MUTED    = "#9ca3af";
// ───────────────────────────────────────────────────────────────────────────

const DUMMY_USERS = [
  { id:1,  name:"Aanya Sharma",    email:"aanya.sharma@gmail.com",     role:"Admin",     status:"Active",   joined:"Jan 12, 2025" },
  { id:2,  name:"Rohan Mehta",     email:"rohan.mehta@outlook.com",    role:"Organizer", status:"Active",   joined:"Feb 3, 2025"  },
  { id:3,  name:"Priya Nair",      email:"priya.nair@yahoo.com",       role:"User",      status:"Active",   joined:"Feb 18, 2025" },
  { id:4,  name:"Dev Kapoor",      email:"dev.kapoor@gmail.com",       role:"Organizer", status:"Inactive", joined:"Mar 1, 2025"  },
  { id:5,  name:"Simran Kaur",     email:"simran.kaur@hotmail.com",    role:"User",      status:"Active",   joined:"Mar 9, 2025"  },
  { id:6,  name:"Arjun Verma",     email:"arjun.verma@gmail.com",      role:"User",      status:"Banned",   joined:"Apr 2, 2025"  },
  { id:7,  name:"Neha Joshi",      email:"neha.joshi@gmail.com",       role:"Organizer", status:"Active",   joined:"Apr 14, 2025" },
  { id:8,  name:"Karan Singh",     email:"karan.singh@icloud.com",     role:"User",      status:"Active",   joined:"May 5, 2025"  },
  { id:9,  name:"Meera Pillai",    email:"meera.pillai@gmail.com",     role:"Admin",     status:"Active",   joined:"May 20, 2025" },
  { id:10, name:"Rahul Bose",      email:"rahul.bose@outlook.com",     role:"User",      status:"Inactive", joined:"Jun 8, 2025"  },
  { id:11, name:"Tanya Gupta",     email:"tanya.gupta@gmail.com",      role:"User",      status:"Active",   joined:"Jul 1, 2025"  },
  { id:12, name:"Amit Chatterjee", email:"amit.chatt@gmail.com",       role:"Organizer", status:"Active",   joined:"Jul 19, 2025" },
  { id:13, name:"Divya Reddy",     email:"divya.reddy@yahoo.com",      role:"User",      status:"Banned",   joined:"Aug 3, 2025"  },
  { id:14, name:"Nikhil Pandey",   email:"nikhil.pandey@gmail.com",    role:"User",      status:"Active",   joined:"Aug 22, 2025" },
  { id:15, name:"Ishaan Roy",      email:"ishaan.roy@hotmail.com",     role:"Organizer", status:"Active",   joined:"Sep 10, 2025" },
];

const AVATAR_PALETTE = [
  ACCENT_PINK, ACCENT_INDIGO, "#8b5cf6", "#7c3aed", "#db2777",
  "#4f46e5", "#c026d3", "#9333ea", "#6366f1", "#e11d48",
];

const ROLE_CONFIG = {
  Admin:     { bg: INDIGO_LIGHT,  color: ACCENT_INDIGO },
  Organizer: { bg: PINK_LIGHT,    color: "#be185d"     },
  User:      { bg: "#f3f4f6",     color: "#374151"     },
};

const STATUS_CONFIG = {
  Active:   { bg:"#f0fdf4", color:"#15803d", dot:"#22c55e" },
  Inactive: { bg:"#fffbeb", color:"#b45309", dot:"#f59e0b" },
  Banned:   { bg:"#fff1f2", color:"#be123c", dot:"#f43f5e" },
};

function initials(name) {
  if (!name) return "?";
  return name.trim().split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
}

/* ── ROLE DROPDOWN ── */
function RoleDropdown({ userId, currentRole, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const cfg = ROLE_CONFIG[currentRole];
  return (
    <div style={{ position:"relative" }} ref={ref}>
      <button onClick={() => setOpen(!open)}
        style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:999, background:cfg.bg, color:cfg.color, border:`1px solid ${BORDER}`, cursor:"pointer", fontFamily:"inherit", transition:"box-shadow .15s" }}
        onMouseEnter={e => e.currentTarget.style.boxShadow=`0 0 0 2px ${ACCENT_INDIGO}44`}
        onMouseLeave={e => e.currentTarget.style.boxShadow="none"}>
        {currentRole}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:10,height:10}}>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div style={{ position:"absolute", zIndex:50, top:"calc(100% + 6px)", left:0, background:"white", border:`1px solid ${BORDER}`, borderRadius:14, boxShadow:"0 8px 24px rgba(99,102,241,0.14)", overflow:"hidden", width:140, padding:"4px 0" }}>
          {["User","Organizer","Admin"].map(r => (
            <button key={r} onClick={() => { onChange(userId, r); setOpen(false); }}
              style={{ width:"100%", textAlign:"left", padding:"8px 12px", fontSize:12, fontWeight: r===currentRole ? 700 : 500, background: r===currentRole ? INDIGO_LIGHT : "white", color: r===currentRole ? ACCENT_INDIGO : TEXT_MAIN, border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:8, fontFamily:"inherit", transition:"background .12s" }}
              onMouseEnter={e => { if(r!==currentRole) e.currentTarget.style.background="#f9fafb"; }}
              onMouseLeave={e => { if(r!==currentRole) e.currentTarget.style.background="white"; }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background: r==="Admin" ? ACCENT_INDIGO : r==="Organizer" ? ACCENT_PINK : "#d1d5db", flexShrink:0, display:"inline-block" }}/>
              {r}
              {r === currentRole && <span style={{ marginLeft:"auto", color: ACCENT_INDIGO, fontSize:10 }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── DELETE MODAL ── */
function DeleteModal({ user, onConfirm, onCancel }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 16px" }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.35)", backdropFilter:"blur(4px)" }} onClick={onCancel}/>
      <div style={{ position:"relative", background:"white", borderRadius:24, boxShadow:"0 20px 60px rgba(0,0,0,0.18)", width:"100%", maxWidth:340, padding:28, animation:"modalIn .22s ease both" }}>
        <div style={{ width:48, height:48, borderRadius:16, background:"#fff1f2", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="1.8" style={{width:22,height:22}}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div style={{ fontSize:16, fontWeight:800, color:TEXT_MAIN, textAlign:"center", marginBottom:8 }}>Delete User?</div>
        <p style={{ fontSize:13, color:TEXT_SUB, textAlign:"center", marginBottom:24, lineHeight:1.6 }}>
          <b style={{color:TEXT_MAIN}}>{user?.name}</b> will be permanently removed. This cannot be undone.
        </p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:"11px 0", borderRadius:12, border:`1px solid ${BORDER}`, fontSize:13, fontWeight:600, color:TEXT_SUB, background:"white", cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, padding:"11px 0", borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"white", background:"linear-gradient(to right,#f43f5e,#e11d48)", cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 14px rgba(244,63,94,0.3)" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ── TOAST ── */
function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:200, display:"flex", alignItems:"center", gap:10, padding:"11px 18px", borderRadius:14, background:GRAD, boxShadow:"0 8px 24px rgba(99,102,241,0.3)", fontSize:13, fontWeight:600, color:"white", animation:"toastIn .3s ease both" }}>
      <span style={{ width:7, height:7, borderRadius:"50%", background:"rgba(255,255,255,0.7)", display:"inline-block" }}/>
      {msg}
    </div>
  );
}

/* ── MAIN ── */
export default function ViewUsers() {
  const [users,        setUsers]        = useState(DUMMY_USERS);
  const [search,       setSearch]       = useState("");
  const [roleFilter,   setRoleFilter]   = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField,    setSortField]    = useState("name");
  const [sortDir,      setSortDir]      = useState("asc");
  const [currentPage,  setCurrentPage]  = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast,        setToast]        = useState(null);
  const PER_PAGE = 8;

  const handleRoleChange = (userId, newRole) => {
    setUsers(u => u.map(x => x.id===userId ? {...x, role:newRole} : x));
    setToast(`Role updated to ${newRole}`);
  };

  const handleDeleteConfirm = () => {
    setUsers(u => u.filter(x => x.id !== deleteTarget.id));
    setToast(`${deleteTarget.name} removed`);
    setDeleteTarget(null);
  };

  const handleSort = field => {
    if (sortField===field) setSortDir(d => d==="asc"?"desc":"asc");
    else { setSortField(field); setSortDir("asc"); }
    setCurrentPage(1);
  };

  const filtered = users
    .filter(u => {
      const q = search.toLowerCase();
      return (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
        && (roleFilter==="All"   || u.role===roleFilter)
        && (statusFilter==="All" || u.status===statusFilter);
    })
    .sort((a,b) => {
      const av = (a[sortField]||"").toLowerCase();
      const bv = (b[sortField]||"").toLowerCase();
      return sortDir==="asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page        = Math.min(currentPage, totalPages);
  const paginated   = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const pageBtns = Array.from({ length:totalPages },(_,i)=>i+1)
    .filter(p => p===1||p===totalPages||Math.abs(p-page)<=1)
    .reduce((acc,p,i,arr) => { if(i>0&&p-arr[i-1]>1) acc.push("…"); acc.push(p); return acc; }, []);

  const counts = {
    total:      users.length,
    active:     users.filter(u=>u.status==="Active").length,
    organizers: users.filter(u=>u.role==="Organizer").length,
    banned:     users.filter(u=>u.status==="Banned").length,
  };

  const SortIcon = ({ field }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      style={{ width:10, height:10, opacity: sortField===field ? 1 : 0.3 }}>
      {sortField===field && sortDir==="asc"
        ? <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
        : <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round"/>}
    </svg>
  );

  const filterBtn = (active, onClick, label) => (
    <button onClick={onClick}
      style={{ padding:"5px 12px", borderRadius:999, border: active ? "none" : `1px solid ${BORDER}`, fontSize:11, fontWeight: active ? 700 : 500, cursor:"pointer", fontFamily:"inherit", transition:"all .15s",
        background: active ? GRAD : "white",
        color:       active ? "white" : TEXT_SUB,
        boxShadow:   active ? "0 2px 8px rgba(99,102,241,0.25)" : "none" }}>
      {label}
    </button>
  );

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'DM Sans',system-ui,sans-serif", background:"linear-gradient(135deg,#eef2ff 0%,#ffffff 50%,#fdf2f8 100%)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box}
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .row-anim { animation: fadeUp .22s ease both; }
        .es-row:hover td { background:#f9fafb!important; }
        .sort-th { cursor:pointer; }
        .sort-th:hover span { color:${ACCENT_INDIGO}!important; }
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:4px}
      `}</style>

      <div style={{ padding:"24px", width:"100%" }}>

        {/* ── HEADER ── */}
        <div className="row-anim" style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:22, gap:12, flexWrap:"wrap" }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", color:ACCENT_INDIGO, background:INDIGO_LIGHT, border:"1px solid #c7d2fe", borderRadius:999, padding:"3px 10px", marginBottom:8 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:ACCENT_INDIGO, display:"inline-block" }}/>
              Administration
            </div>
            <h1 style={{ fontSize:23, fontWeight:800, color:TEXT_MAIN, margin:0, letterSpacing:"-0.4px" }}>Manage Users</h1>
            <p style={{ fontSize:12, color:TEXT_MUTED, margin:"4px 0 0" }}>View, filter and manage all registered users</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:12, background:"white", border:`1px solid ${BORDER}`, color:TEXT_SUB, fontSize:11, fontWeight:600, boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={TEXT_MUTED} strokeWidth="2" style={{width:13,height:13}}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round"/></svg>
            March 6, 2026
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
          {[
            { label:"Total Users",  value:counts.total,      accentBg:INDIGO_LIGHT, accentColor:ACCENT_INDIGO, bar:"linear-gradient(to right,#6366f1,#818cf8)",
              icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/><path d="M21 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round"/></svg> },
            { label:"Active",       value:counts.active,     accentBg:"#f0fdf4",    accentColor:"#15803d",     bar:"linear-gradient(to right,#22c55e,#86efac)",
              icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
            { label:"Organizers",   value:counts.organizers, accentBg:PINK_LIGHT,   accentColor:ACCENT_PINK,   bar:"linear-gradient(to right,#ec4899,#f472b6)",
              icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/></svg> },
            { label:"Banned",       value:counts.banned,     accentBg:"#fff1f2",    accentColor:"#be123c",     bar:"linear-gradient(to right,#f43f5e,#fda4af)",
              icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> },
          ].map(({ label, value, accentBg, accentColor, icon }, i) => (
            <div key={label} className="row-anim"
              style={{ background:"white", borderRadius:18, padding:"16px", boxShadow:"0 1px 6px rgba(0,0,0,0.06)", border:`1px solid ${BORDER}`, display:"flex", alignItems:"center", gap:12, animationDelay:`${i*50}ms`, transition:"transform .2s,box-shadow .2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(99,102,241,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.boxShadow="0 1px 6px rgba(0,0,0,0.06)"; }}>
              <div style={{ width:40, height:40, borderRadius:13, background:accentBg, color:accentColor, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {icon}
              </div>
              <div>
                <div style={{ fontSize:24, fontWeight:800, color:TEXT_MAIN, lineHeight:1, letterSpacing:"-0.4px" }}>{value}</div>
                <div style={{ fontSize:11, color:TEXT_MUTED, marginTop:2 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── CONTROLS ── */}
        <div className="row-anim" style={{ background:"white", borderRadius:16, border:`1px solid ${BORDER}`, padding:"12px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}>

          {/* Search */}
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"#f9fafb", border:`1px solid ${BORDER}`, borderRadius:12, padding:"8px 12px", flex:"1 1 200px", minWidth:180 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke={TEXT_MUTED} strokeWidth="2" style={{width:13,height:13,flexShrink:0}}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/></svg>
            <input value={search} onChange={e=>{setSearch(e.target.value);setCurrentPage(1);}} placeholder="Search by name or email…"
              style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:TEXT_MAIN, width:"100%", fontFamily:"inherit" }}/>
            {search && (
              <button onClick={()=>setSearch("")} style={{ border:"none", background:"none", cursor:"pointer", padding:0, display:"flex", color:TEXT_MUTED }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:12,height:12}}><path d="M18 6 6 18M6 6l12 12" strokeLinecap="round"/></svg>
              </button>
            )}
          </div>

          {/* Role filter */}
          <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap" }}>
            <span style={{ fontSize:11, color:TEXT_MUTED, fontWeight:600, marginRight:2 }}>Role:</span>
            {["All","User","Organizer","Admin"].map(r =>
              filterBtn(roleFilter===r, ()=>{setRoleFilter(r);setCurrentPage(1);}, r)
            )}
          </div>

          {/* Status filter */}
          <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap" }}>
            <span style={{ fontSize:11, color:TEXT_MUTED, fontWeight:600, marginRight:2 }}>Status:</span>
            {["All","Active","Inactive","Banned"].map(s =>
              filterBtn(statusFilter===s, ()=>{setStatusFilter(s);setCurrentPage(1);}, s)
            )}
          </div>
        </div>

        {/* ── TABLE ── */}
        <div style={{ background:"white", borderRadius:20, boxShadow:"0 1px 6px rgba(0,0,0,0.06)", border:`1px solid ${BORDER}`, overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#f9fafb", borderBottom:`1px solid ${BORDER}` }}>
                  {[
                    { key:null,     label:"#"       },
                    { key:"name",   label:"User"    },
                    { key:"email",  label:"Email"   },
                    { key:"role",   label:"Role"    },
                    { key:"status", label:"Status"  },
                    { key:"joined", label:"Joined"  },
                    { key:null,     label:"Actions" },
                  ].map(({ key, label }) => (
                    <th key={label} onClick={() => key && handleSort(key)}
                      className={key ? "sort-th" : ""}
                      style={{ textAlign:"left", padding:"11px 16px", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:ACCENT_INDIGO, whiteSpace:"nowrap", userSelect:"none" }}>
                      <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                        {label}
                        {key && <SortIcon field={key}/>}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding:"52px 20px", textAlign:"center", color:TEXT_MUTED, fontSize:13 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#c7d2fe" strokeWidth="1.5" style={{width:36,height:36,margin:"0 auto 10px",display:"block"}}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/></svg>
                    No users match your filters
                  </td></tr>
                ) : paginated.map((user, i) => {
                  const sc = STATUS_CONFIG[user.status];
                  return (
                    <tr key={user.id} className="row-anim es-row"
                      style={{ animationDelay:`${i*25}ms`, borderBottom:`1px solid #f9fafb` }}>

                      {/* # */}
                      <td style={{ padding:"11px 16px", fontSize:11, color:TEXT_MUTED, fontWeight:600 }}>
                        {(page-1)*PER_PAGE+i+1}
                      </td>

                      {/* User */}
                      <td style={{ padding:"11px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:34, height:34, borderRadius:"50%", background:AVATAR_PALETTE[user.id % AVATAR_PALETTE.length], color:"white", fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 2px 8px rgba(0,0,0,0.12)" }}>
                            {initials(user.name)}
                          </div>
                          <span style={{ fontSize:13, fontWeight:700, color:TEXT_MAIN, whiteSpace:"nowrap" }}>{user.name}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding:"11px 16px" }}>
                        <span style={{ fontSize:12, color:TEXT_SUB }}>{user.email}</span>
                      </td>

                      {/* Role */}
                      <td style={{ padding:"11px 16px" }}>
                        <RoleDropdown userId={user.id} currentRole={user.role} onChange={handleRoleChange}/>
                      </td>

                      {/* Status */}
                      <td style={{ padding:"11px 16px" }}>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:999, fontSize:11, fontWeight:700, background:sc.bg, color:sc.color, border:`1px solid ${sc.bg}` }}>
                          <span style={{ width:6, height:6, borderRadius:"50%", background:sc.dot, display:"inline-block", flexShrink:0 }}/>
                          {user.status}
                        </span>
                      </td>

                      {/* Joined */}
                      <td style={{ padding:"11px 16px" }}>
                        <span style={{ fontSize:11, color:TEXT_MUTED, whiteSpace:"nowrap" }}>{user.joined}</span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding:"11px 16px" }}>
                        <button onClick={() => setDeleteTarget(user)} title="Delete user"
                          style={{ width:32, height:32, borderRadius:9, border:"none", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:TEXT_MUTED, transition:"all .15s" }}
                          onMouseEnter={e => { e.currentTarget.style.background="#fff1f2"; e.currentTarget.style.color="#f43f5e"; }}
                          onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color=TEXT_MUTED; }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:14,height:14}}>
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── PAGINATION FOOTER ── */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 18px", borderTop:`1px solid #f3f4f6`, background:"#fafafa" }}>
            <span style={{ fontSize:11, color:TEXT_MUTED }}>
              Showing{" "}
              <b style={{color:TEXT_MAIN}}>{filtered.length===0?0:(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE,filtered.length)}</b>
              {" "}of{" "}
              <b style={{color:TEXT_MAIN}}>{filtered.length}</b> users
            </span>
            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              {/* Prev */}
              <button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={page===1}
                style={{ width:30, height:30, borderRadius:9, border:"none", background:"transparent", cursor:page===1?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:page===1?"#d1d5db":TEXT_MUTED, transition:"all .15s" }}
                onMouseEnter={e=>{ if(page>1){ e.currentTarget.style.background=INDIGO_LIGHT; e.currentTarget.style.color=ACCENT_INDIGO; }}}
                onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=page===1?"#d1d5db":TEXT_MUTED; }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14}}><path d="M15 18l-6-6 6-6" strokeLinecap="round"/></svg>
              </button>

              {pageBtns.map((p, i) =>
                p === "…"
                  ? <span key={`e${i}`} style={{ width:24, textAlign:"center", fontSize:11, color:TEXT_MUTED }}>…</span>
                  : <button key={p} onClick={()=>setCurrentPage(p)}
                      style={{ width:30, height:30, borderRadius:9, border:"none", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all .15s",
                        background: page===p ? GRAD   : "transparent",
                        color:       page===p ? "white" : TEXT_SUB,
                        boxShadow:   page===p ? "0 2px 8px rgba(99,102,241,0.28)" : "none" }}>
                      {p}
                    </button>
              )}

              {/* Next */}
              <button onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                style={{ width:30, height:30, borderRadius:9, border:"none", background:"transparent", cursor:page===totalPages?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:page===totalPages?"#d1d5db":TEXT_MUTED, transition:"all .15s" }}
                onMouseEnter={e=>{ if(page<totalPages){ e.currentTarget.style.background=INDIGO_LIGHT; e.currentTarget.style.color=ACCENT_INDIGO; }}}
                onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=page===totalPages?"#d1d5db":TEXT_MUTED; }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14}}><path d="M9 18l6-6-6-6" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {deleteTarget && <DeleteModal user={deleteTarget} onConfirm={handleDeleteConfirm} onCancel={()=>setDeleteTarget(null)}/>}
      {toast && <Toast msg={toast} onDone={()=>setToast(null)}/>}
    </div>
  );
}