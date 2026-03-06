import { useState, useRef, useEffect } from "react";
import { Users, Plus, Search, X, ChevronDown, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";

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

const AVATAR_PALETTE = [
  ACCENT_PINK, ACCENT_INDIGO, "#8b5cf6", "#7c3aed", "#db2777",
  "#4f46e5", "#c026d3", "#9333ea", "#6366f1", "#e11d48",
];

const DUMMY_ORGANIZERS = [
  { id:1,  name:"Aanya Sharma",    email:"aanya.sharma@gmail.com",  role:"Admin"     },
  { id:2,  name:"Rohan Mehta",     email:"rohan.mehta@outlook.com", role:"Organizer" },
  { id:3,  name:"Priya Nair",      email:"priya.nair@yahoo.com",    role:"User"      },
  { id:4,  name:"Dev Kapoor",      email:"dev.kapoor@gmail.com",    role:"Organizer" },
  { id:5,  name:"Simran Kaur",     email:"simran.kaur@hotmail.com", role:"User"      },
  { id:6,  name:"Neha Joshi",      email:"neha.joshi@gmail.com",    role:"Organizer" },
  { id:7,  name:"Karan Singh",     email:"karan.singh@icloud.com",  role:"User"      },
  { id:8,  name:"Meera Pillai",    email:"meera.pillai@gmail.com",  role:"Admin"     },
  { id:9,  name:"Tanya Gupta",     email:"tanya.gupta@gmail.com",   role:"User"      },
  { id:10, name:"Amit Chatterjee", email:"amit.chatt@gmail.com",    role:"Organizer" },
];

const ROLE_CONFIG = {
  Admin:     { bg: INDIGO_LIGHT, color: ACCENT_INDIGO },
  Organizer: { bg: PINK_LIGHT,   color: "#be185d"     },
  User:      { bg: "#f3f4f6",    color: "#374151"     },
};

function initials(name) {
  if (!name) return "?";
  return name.trim().split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
}

function OrgAvatar({ user, size = "md" }) {
  const sz = size === "sm" ? 28 : 36;
  return (
    <div style={{ width:sz, height:sz, borderRadius:"50%", background:AVATAR_PALETTE[user.id % AVATAR_PALETTE.length], color:"white", fontSize: size==="sm" ? 10 : 12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 2px 8px rgba(0,0,0,0.12)" }}>
      {initials(user.name)}
    </div>
  );
}

/* ── ORGANIZER SELECT ── */
function OrganizerSelect({ value, onChange, error }) {
  const [open,   setOpen]   = useState(false);
  const [search, setSearch] = useState("");
  const ref      = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);

  const filtered = DUMMY_ORGANIZERS.filter(u => {
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const selected = DUMMY_ORGANIZERS.find(u => u.id === value) || null;

  return (
    <div style={{ position:"relative" }} ref={ref}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{ width:"100%", borderRadius:12, padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"white", border: error ? "2px solid #fca5a5" : open ? `2px solid ${ACCENT_INDIGO}` : `2px solid ${BORDER}`, boxShadow: open ? `0 0 0 3px ${ACCENT_INDIGO}22` : "none", cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}>
        {selected ? (
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <OrgAvatar user={selected}/>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontSize:13, fontWeight:700, color:TEXT_MAIN }}>{selected.name}</div>
              <div style={{ fontSize:11, color:TEXT_MUTED }}>{selected.email}</div>
            </div>
            <span style={{ marginLeft:6, padding:"3px 9px", borderRadius:999, fontSize:10, fontWeight:700, background:ROLE_CONFIG[selected.role].bg, color:ROLE_CONFIG[selected.role].color }}>
              {selected.role}
            </span>
          </div>
        ) : (
          <span style={{ fontSize:13, color:TEXT_MUTED }}>Select an organizer…</span>
        )}
        <ChevronDown style={{ width:16, height:16, color:ACCENT_INDIGO, transform: open ? "rotate(180deg)" : "none", transition:"transform .2s", flexShrink:0 }}/>
      </button>

      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, width:"100%", background:"white", border:`2px solid ${BORDER}`, borderRadius:14, boxShadow:"0 8px 32px rgba(99,102,241,0.14)", zIndex:50, overflow:"hidden" }}>
          {/* Search input */}
          <div style={{ display:"flex", alignItems:"center", gap:8, borderBottom:`1px solid ${BORDER}`, padding:"10px 12px", background:"#f9fafb" }}>
            <Search style={{ width:14, height:14, color:ACCENT_INDIGO, flexShrink:0 }}/>
            <input ref={inputRef} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or email…"
              style={{ width:"100%", border:"none", outline:"none", background:"transparent", fontSize:12, color:TEXT_MAIN, fontFamily:"inherit" }}/>
            {search && (
              <button onClick={()=>setSearch("")} style={{ border:"none", background:"none", cursor:"pointer", padding:0, display:"flex" }}>
                <X style={{ width:12, height:12, color:TEXT_MUTED }}/>
              </button>
            )}
          </div>
          <div style={{ maxHeight:240, overflowY:"auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding:"28px 20px", textAlign:"center", color:TEXT_MUTED, fontSize:12 }}>No results found</div>
            ) : filtered.map(u => (
              <div key={u.id} onClick={() => { onChange(u.id); setOpen(false); setSearch(""); }}
                style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", cursor:"pointer", background: value===u.id ? INDIGO_LIGHT : "white", borderBottom:`1px solid #f9fafb`, transition:"background .12s" }}
                onMouseEnter={e=>{ if(value!==u.id) e.currentTarget.style.background="#f9fafb"; }}
                onMouseLeave={e=>{ if(value!==u.id) e.currentTarget.style.background="white"; }}>
                <OrgAvatar user={u}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:TEXT_MAIN }}>{u.name}</div>
                  <div style={{ fontSize:11, color:TEXT_MUTED }}>{u.email}</div>
                </div>
                <span style={{ padding:"3px 9px", borderRadius:999, fontSize:10, fontWeight:700, background:ROLE_CONFIG[u.role].bg, color:ROLE_CONFIG[u.role].color, flexShrink:0 }}>
                  {u.role}
                </span>
                {value===u.id && <CheckCircle2 style={{ width:14, height:14, color:ACCENT_INDIGO, flexShrink:0 }}/>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:6, fontSize:11, fontWeight:600, color:"#f43f5e" }}>
      <AlertCircle style={{ width:12, height:12, flexShrink:0 }}/>
      {message}
    </div>
  );
}

function CharCount({ value, min, max }) {
  const len = value.trim().length;
  const color = len < min ? TEXT_MUTED : len >= max * 0.9 ? "#f59e0b" : "#10b981";
  return <span style={{ fontSize:11, fontWeight:600, color, fontVariantNumeric:"tabular-nums" }}>{len}/{max}</span>;
}

export default function CreateClub() {
  const [name,        setName]        = useState("");
  const [description, setDescription] = useState("");
  const [organizerId, setOrganizerId] = useState(null);
  const [errors,      setErrors]      = useState({});
  const [success,     setSuccess]     = useState(false);
  const [submitting,  setSubmitting]  = useState(false);

  const validate = () => {
    const e = {};
    if (!name.trim() || name.trim().length < 3)                e.name        = "Club name must be at least 3 characters.";
    if (name.trim().length > 60)                               e.name        = "Club name must be under 60 characters.";
    if (!description.trim() || description.trim().length < 10) e.description = "Description must be at least 10 characters.";
    if (description.trim().length > 300)                       e.description = "Description must be under 300 characters.";
    if (!organizerId)                                          e.organizer   = "Please select an organizer.";
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true); setErrors({});
    setTimeout(() => {
      setSubmitting(false); setSuccess(true);
      setTimeout(() => { setName(""); setDescription(""); setOrganizerId(null); setSuccess(false); }, 3500);
    }, 900);
  };

  const handleReset = () => { setName(""); setDescription(""); setOrganizerId(null); setErrors({}); setSuccess(false); };

  const selectedOrg = DUMMY_ORGANIZERS.find(u => u.id === organizerId);
  const isClean = !name && !description && !organizerId;

  const inputStyle = hasErr => ({
    width:"100%", borderRadius:12, padding:"10px 14px", fontSize:13, color:TEXT_MAIN, fontFamily:"inherit",
    outline:"none", transition:"all .15s",
    background: hasErr ? "#fff1f2" : "white",
    border: hasErr ? "2px solid #fca5a5" : `2px solid ${BORDER}`,
  });

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'DM Sans',system-ui,sans-serif", background:"linear-gradient(135deg,#eef2ff 0%,#ffffff 50%,#fdf2f8 100%)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box}
        @keyframes fadeUp    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes successPop{ 0%{transform:scale(.97);opacity:0} 60%{transform:scale(1.01)} 100%{transform:scale(1);opacity:1} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        .fade-up     { animation: fadeUp .3s ease both; }
        .success-pop { animation: successPop .35s cubic-bezier(.34,1.56,.64,1) both; }
        .spinner     { animation: spin .8s linear infinite; }
        .es-input:focus { border-color:${ACCENT_INDIGO}!important; box-shadow:0 0 0 3px ${ACCENT_INDIGO}22!important; }
        textarea::-webkit-scrollbar{width:4px}
        textarea::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:4px}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:4px}
      `}</style>

      <div style={{ padding:"24px", width:"100%" }}>

        {/* ── HEADER ── */}
        <div className="fade-up" style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:22, gap:12, flexWrap:"wrap" }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", color:ACCENT_INDIGO, background:INDIGO_LIGHT, border:"1px solid #c7d2fe", borderRadius:999, padding:"3px 10px", marginBottom:8 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:ACCENT_INDIGO, display:"inline-block" }}/>
              Administration
            </div>
            <h1 style={{ fontSize:23, fontWeight:800, color:TEXT_MAIN, margin:0, letterSpacing:"-0.4px" }}>Create a New Club</h1>
            <p style={{ fontSize:12, color:TEXT_MUTED, margin:"4px 0 0" }}>Set up a new community space for your members</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px", borderRadius:12, background:"white", border:`1px solid ${BORDER}`, color:TEXT_SUB, fontSize:12, fontWeight:600, flexShrink:0, boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
            <Users style={{ width:14, height:14, color:ACCENT_PINK }}/>
            {DUMMY_ORGANIZERS.length} organizers available
          </div>
        </div>

        {/* ── SUCCESS BANNER ── */}
        {success && (
          <div className="success-pop" style={{ marginBottom:18, padding:"14px 18px", background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:14, display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#22c55e,#16a34a)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <CheckCircle2 style={{ width:17, height:17, color:"white" }}/>
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"#065f46" }}>Club created successfully!</div>
              <div style={{ fontSize:11, color:"#16a34a", marginTop:2 }}>The new club is now live. Form will reset shortly.</div>
            </div>
            <Sparkles style={{ width:15, height:15, color:"#4ade80", marginLeft:"auto" }}/>
          </div>
        )}

        {/* ── TWO COLUMN LAYOUT ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>

          {/* LEFT — FORM (2/3) */}
          <div style={{ gridColumn:"1 / 3", display:"flex", flexDirection:"column", gap:16 }}>

            {/* Club Details Card */}
            <div className="fade-up" style={{ background:"white", borderRadius:20, border:`1px solid ${BORDER}`, boxShadow:"0 1px 6px rgba(0,0,0,0.06)", overflow:"hidden" }}>
              <div style={{ padding:"15px 20px", borderBottom:`1px solid #f3f4f6` }}>
                <div style={{ fontSize:14, fontWeight:700, color:TEXT_MAIN }}>Club Details</div>
                <div style={{ fontSize:11, color:TEXT_MUTED, marginTop:2 }}>Basic information about your club</div>
              </div>
              <div style={{ padding:"20px", display:"flex", flexDirection:"column", gap:18 }}>

                {/* Club Name */}
                <div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:7 }}>
                    <label style={{ fontSize:12, fontWeight:600, color:TEXT_SUB }}>Club Name <span style={{color:"#f43f5e"}}>*</span></label>
                    <CharCount value={name} min={3} max={60}/>
                  </div>
                  <input value={name} onChange={e=>{setName(e.target.value);if(errors.name) setErrors(p=>({...p,name:""}));}}
                    maxLength={60} placeholder="e.g. Photography Enthusiasts"
                    className="es-input"
                    style={inputStyle(!!errors.name)}/>
                  <FieldError message={errors.name}/>
                </div>

                {/* Description */}
                <div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:7 }}>
                    <label style={{ fontSize:12, fontWeight:600, color:TEXT_SUB }}>Description <span style={{color:"#f43f5e"}}>*</span></label>
                    <CharCount value={description} min={10} max={300}/>
                  </div>
                  <textarea value={description} onChange={e=>{setDescription(e.target.value);if(errors.description) setErrors(p=>({...p,description:""}));}}
                    maxLength={300} rows={5} placeholder="Describe what this club is about, who should join, and what activities members will participate in…"
                    className="es-input"
                    style={{ ...inputStyle(!!errors.description), resize:"none" }}/>
                  <FieldError message={errors.description}/>
                </div>
              </div>
            </div>

            {/* Organizer Card */}
            <div className="fade-up" style={{ background:"white", borderRadius:20, border:`1px solid ${BORDER}`, boxShadow:"0 1px 6px rgba(0,0,0,0.06)", overflow:"hidden", animationDelay:".05s" }}>
              <div style={{ padding:"15px 20px", borderBottom:`1px solid #f3f4f6` }}>
                <div style={{ fontSize:14, fontWeight:700, color:TEXT_MAIN }}>Assign Organizer</div>
                <div style={{ fontSize:11, color:TEXT_MUTED, marginTop:2 }}>This person will manage and moderate the club</div>
              </div>
              <div style={{ padding:"20px" }}>
                <label style={{ fontSize:12, fontWeight:600, color:TEXT_SUB, display:"block", marginBottom:8 }}>Organizer <span style={{color:"#f43f5e"}}>*</span></label>
                <OrganizerSelect value={organizerId} onChange={id=>{setOrganizerId(id);if(errors.organizer) setErrors(p=>({...p,organizer:""}));}} error={!!errors.organizer}/>
                <FieldError message={errors.organizer}/>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="fade-up" style={{ display:"flex", alignItems:"center", gap:10, animationDelay:".1s" }}>
              <button type="button" onClick={handleSubmit} disabled={submitting || success}
                style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:"11px 24px", borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"white", cursor: submitting||success ? "not-allowed" : "pointer", fontFamily:"inherit", transition:"all .2s",
                  background: submitting||success ? "#c7d2fe" : GRAD,
                  boxShadow:  submitting||success ? "none" : "0 4px 14px rgba(99,102,241,0.3)" }}>
                {submitting ? (
                  <><svg className="spinner" viewBox="0 0 24 24" fill="none" style={{width:15,height:15}}><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" opacity=".25"/><path fill="white" opacity=".8" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/></svg>Creating Club…</>
                ) : success ? (
                  <><CheckCircle2 style={{width:15,height:15}}/> Club Created!</>
                ) : (
                  <><Plus style={{width:15,height:15}}/> Create Club</>
                )}
              </button>

              <button type="button" onClick={handleReset} disabled={isClean || submitting}
                style={{ padding:"11px 18px", borderRadius:12, fontSize:13, fontWeight:600, cursor: isClean||submitting ? "not-allowed" : "pointer", fontFamily:"inherit", transition:"all .15s",
                  background:"white", border:`1px solid ${BORDER}`,
                  color: isClean||submitting ? TEXT_MUTED : TEXT_SUB }}>
                Reset
              </button>

              <span style={{ fontSize:11, color:TEXT_MUTED, marginLeft:4 }}>* Required fields</span>
            </div>
          </div>

          {/* RIGHT — SIDEBAR (1/3) */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Live Preview */}
            <div className="fade-up" style={{ background:"white", borderRadius:20, border:`1px solid ${BORDER}`, boxShadow:"0 1px 6px rgba(0,0,0,0.06)", overflow:"hidden", animationDelay:".08s" }}>
              <div style={{ padding:"15px 18px", borderBottom:`1px solid #f3f4f6` }}>
                <div style={{ fontSize:14, fontWeight:700, color:TEXT_MAIN }}>Live Preview</div>
                <div style={{ fontSize:11, color:TEXT_MUTED, marginTop:2 }}>How your club card will appear</div>
              </div>
              <div style={{ padding:16 }}>
                <div style={{ borderRadius:14, border:`2px dashed ${BORDER}`, overflow:"hidden" }}>
                  {/* Card header band */}
                  <div style={{ height:56, background:GRAD, position:"relative" }}>
                    <div style={{ position:"absolute", bottom:-16, left:14, width:36, height:36, borderRadius:11, background:"white", boxShadow:"0 2px 10px rgba(0,0,0,0.1)", border:`1px solid ${BORDER}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:ACCENT_INDIGO }}>
                      {name.trim() ? name.trim()[0].toUpperCase() : <Users style={{width:14,height:14,color:TEXT_MUTED}}/>}
                    </div>
                  </div>
                  <div style={{ padding:"26px 14px 16px" }}>
                    <div style={{ fontSize:13, fontWeight:700, color:TEXT_MAIN, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {name.trim() || <span style={{color:TEXT_MUTED,fontWeight:400}}>Club name…</span>}
                    </div>
                    <div style={{ fontSize:11, color:TEXT_SUB, marginTop:5, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", minHeight:32, lineHeight:1.5 }}>
                      {description.trim() || <span style={{color:TEXT_MUTED}}>Description will appear here…</span>}
                    </div>
                    {selectedOrg && (
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:10, paddingTop:10, borderTop:`1px solid #f3f4f6` }}>
                        <OrgAvatar user={selectedOrg} size="sm"/>
                        <div>
                          <div style={{ fontSize:11, fontWeight:600, color:TEXT_MAIN }}>{selectedOrg.name}</div>
                          <div style={{ fontSize:10, color:TEXT_MUTED }}>Organizer</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="fade-up" style={{ borderRadius:18, border:`1px solid #c7d2fe`, padding:18, background:INDIGO_LIGHT, animationDelay:".12s" }}>
              <div style={{ fontSize:13, fontWeight:700, color:ACCENT_INDIGO, marginBottom:12, display:"flex", alignItems:"center", gap:7 }}>
                <Sparkles style={{ width:14, height:14, color:ACCENT_PINK }}/> Tips for a great club
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {[
                  "Use a clear, descriptive name that reflects the club's purpose",
                  "Write a welcoming description that explains what members will do",
                  "Choose an organizer who is active and responsive",
                ].map((tip, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                    <span style={{ width:18, height:18, borderRadius:"50%", background:GRAD, color:"white", fontSize:9, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>{i+1}</span>
                    <span style={{ fontSize:11, color:TEXT_SUB, lineHeight:1.5 }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="fade-up" style={{ background:"white", borderRadius:18, border:`1px solid ${BORDER}`, boxShadow:"0 1px 6px rgba(0,0,0,0.06)", overflow:"hidden", animationDelay:".16s" }}>
              {[
                { label:"Total Clubs",       value:"24", sub:"across platform"    },
                { label:"Active Organizers", value:"10", sub:"available to assign" },
              ].map(({ label, value, sub }, i) => (
                <div key={label} style={{ padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom: i===0 ? `1px solid #f3f4f6` : "none" }}>
                  <div>
                    <div style={{ fontSize:12, color:TEXT_MAIN, fontWeight:600 }}>{label}</div>
                    <div style={{ fontSize:10, color:TEXT_MUTED, marginTop:2 }}>{sub}</div>
                  </div>
                  <div style={{ fontSize:24, fontWeight:800, background:GRAD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"-0.4px" }}>{value}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}