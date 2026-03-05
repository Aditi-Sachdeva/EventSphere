import { useState, useRef, useEffect } from "react";
import { Users, Plus, Search, X, ChevronDown, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";

const AVATAR_COLORS = [
  "from-blue-500 to-blue-700",
  "from-cyan-500 to-teal-600",
  "from-emerald-500 to-green-600",
  "from-sky-500 to-blue-600",
  "from-indigo-500 to-indigo-700",
  "from-teal-500 to-cyan-600",
  "from-blue-400 to-sky-600",
  "from-green-500 to-emerald-600",
];

const DUMMY_ORGANIZERS = [
  { id:1, name:"Aanya Sharma",  email:"aanya.sharma@gmail.com",  avatar:"AS", role:"Admin"     },
  { id:2, name:"Rohan Mehta",   email:"rohan.mehta@outlook.com", avatar:"RM", role:"Organizer" },
  { id:3, name:"Priya Nair",    email:"priya.nair@yahoo.com",    avatar:"PN", role:"User"      },
  { id:4, name:"Dev Kapoor",    email:"dev.kapoor@gmail.com",    avatar:"DK", role:"Organizer" },
  { id:5, name:"Simran Kaur",   email:"simran.kaur@hotmail.com", avatar:"SK", role:"User"      },
  { id:6, name:"Neha Joshi",    email:"neha.joshi@gmail.com",    avatar:"NJ", role:"Organizer" },
  { id:7, name:"Karan Singh",   email:"karan.singh@icloud.com",  avatar:"KS", role:"User"      },
  { id:8, name:"Meera Pillai",  email:"meera.pillai@gmail.com",  avatar:"MP", role:"Admin"     },
  { id:9, name:"Tanya Gupta",   email:"tanya.gupta@gmail.com",   avatar:"TG", role:"User"      },
  { id:10,name:"Amit Chatterjee",email:"amit.chatt@gmail.com",   avatar:"AC", role:"Organizer" },
];

const ROLE_STYLES = {
  Admin:     "bg-blue-50 text-blue-700 border border-blue-200",
  Organizer: "bg-teal-50 text-teal-700 border border-teal-200",
  User:      "bg-gray-100 text-gray-600 border border-gray-200",
};

function Avatar({ user, size = "md" }) {
  const sz = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br ${AVATAR_COLORS[user.id % AVATAR_COLORS.length]} text-white flex items-center justify-center font-semibold flex-shrink-0 shadow-sm`}>
      {user.avatar}
    </div>
  );
}

function OrganizerSelect({ value, onChange, error }) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const ref      = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);

  const filtered = DUMMY_ORGANIZERS.filter((u) => {
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const selected = DUMMY_ORGANIZERS.find((u) => u.id === value) || null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full rounded-xl px-4 py-3 flex items-center justify-between bg-white transition-all duration-200 ${
          error
            ? "border-2 border-red-300 shadow-sm"
            : open
            ? "border-2 border-blue-400 shadow-md shadow-blue-100"
            : "border-2 border-gray-200 hover:border-gray-300"
        }`}
      >
        {selected ? (
          <div className="flex items-center gap-3">
            <Avatar user={selected} />
            <div className="text-left">
              <div className="text-sm font-semibold text-slate-800">{selected.name}</div>
              <div className="text-xs text-slate-400">{selected.email}</div>
            </div>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_STYLES[selected.role]}`}>
              {selected.role}
            </span>
          </div>
        ) : (
          <span className="text-slate-400 text-sm">Select an organizer…</span>
        )}
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute mt-2 w-full bg-white border-2 border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center gap-2 border-b-2 border-slate-100 px-3 py-2.5 bg-slate-50">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full outline-none text-sm bg-transparent text-slate-700 placeholder-slate-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">No results found</div>
            ) : (
              filtered.map((u) => (
                <div
                  key={u.id}
                  onClick={() => { onChange(u.id); setOpen(false); setSearch(""); }}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 ${
                    value === u.id ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  <Avatar user={u} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{u.name}</div>
                    <div className="text-xs text-slate-400 truncate">{u.email}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${ROLE_STYLES[u.role]}`}>
                    {u.role}
                  </span>
                  {value === u.id && <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1.5 font-medium">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {message}
    </p>
  );
}

function CharCount({ value, min, max }) {
  const len = value.trim().length;
  const pct = Math.min(len / max, 1);
  const color = len < min ? "text-slate-400" : len >= max * 0.9 ? "text-amber-500" : "text-emerald-500";
  return (
    <span className={`text-xs ${color} font-medium tabular-nums`}>
      {len}/{max}
    </span>
  );
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
    if (!name.trim() || name.trim().length < 3)        e.name        = "Club name must be at least 3 characters.";
    if (name.trim().length > 60)                        e.name        = "Club name must be under 60 characters.";
    if (!description.trim() || description.trim().length < 10) e.description = "Description must be at least 10 characters.";
    if (description.trim().length > 300)               e.description = "Description must be under 300 characters.";
    if (!organizerId)                                   e.organizer   = "Please select an organizer.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    setErrors({});

    // Simulate async submission
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setName(""); setDescription(""); setOrganizerId(null); setSuccess(false);
      }, 3500);
    }, 900);
  };

  const handleReset = () => {
    setName(""); setDescription(""); setOrganizerId(null);
    setErrors({}); setSuccess(false);
  };

  const selectedOrg = DUMMY_ORGANIZERS.find(u => u.id === organizerId);
  const isClean = !name && !description && !organizerId;

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes successPop {
          0%   { transform: scale(0.97); opacity: 0; }
          60%  { transform: scale(1.01); }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .slide-down  { animation: slideDown 0.2s ease; }
        .fade-in     { animation: fadeIn 0.3s ease both; }
        .success-pop { animation: successPop 0.35s cubic-bezier(.34,1.56,.64,1) both; }
        .spinner     { animation: spin 0.8s linear infinite; }

        textarea::-webkit-scrollbar { width: 4px; }
        textarea::-webkit-scrollbar-track { background: transparent; }
        textarea::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
      `}</style>

      {/* ── PAGE HEADER BREADCRUMB ── */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="hover:text-gray-700 cursor-pointer">Clubs</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">Create New Club</span>
        </div>
      </div>

      <div className="px-8 py-8 max-w-7xl mx-auto fade-in">

        {/* ── PAGE TITLE ROW ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create a New Club</h1>
            <p className="text-sm text-gray-500 mt-1">Set up a new community space for your members</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span>{DUMMY_ORGANIZERS.length} organizers available</span>
          </div>
        </div>

        {/* ── SUCCESS BANNER ── */}
        {success && (
          <div className="success-pop mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-emerald-800">Club created successfully!</div>
              <div className="text-xs text-emerald-600 mt-0.5">The new club is now live. Form will reset shortly.</div>
            </div>
            <Sparkles className="w-4 h-4 text-emerald-400 ml-auto" />
          </div>
        )}

        {/* ── TWO COLUMN LAYOUT ── */}
        <div className="grid grid-cols-3 gap-6">

          {/* LEFT — FORM (2/3) */}
          <div className="col-span-2 space-y-5">

            {/* Club Details Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900">Club Details</h2>
                <p className="text-xs text-gray-500 mt-0.5">Basic information about your club</p>
              </div>
              <div className="p-6 space-y-5">

                {/* Club Name */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-gray-700">Club Name <span className="text-red-400">*</span></label>
                    <CharCount value={name} min={3} max={60} />
                  </div>
                  <input
                    value={name}
                    onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(p => ({...p, name: ""})); }}
                    maxLength={60}
                    className={`w-full rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-150 ${
                      errors.name
                        ? "border border-red-300 bg-red-50 focus:border-red-400"
                        : "border border-gray-200 focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
                    }`}
                    placeholder="e.g. Photography Enthusiasts"
                  />
                  <FieldError message={errors.name} />
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-gray-700">Description <span className="text-red-400">*</span></label>
                    <CharCount value={description} min={10} max={300} />
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); if (errors.description) setErrors(p => ({...p, description: ""})); }}
                    maxLength={300}
                    rows={5}
                    className={`w-full rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-150 resize-none ${
                      errors.description
                        ? "border border-red-300 bg-red-50 focus:border-red-400"
                        : "border border-gray-200 focus:border-blue-500 focus:ring-3 focus:ring-blue-100"
                    }`}
                    placeholder="Describe what this club is about, who should join, and what activities members will participate in…"
                  />
                  <FieldError message={errors.description} />
                </div>
              </div>
            </div>

            {/* Organizer Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900">Assign Organizer</h2>
                <p className="text-xs text-gray-500 mt-0.5">This person will manage and moderate the club</p>
              </div>
              <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Organizer <span className="text-red-400">*</span></label>
                <OrganizerSelect
                  value={organizerId}
                  onChange={(id) => { setOrganizerId(id); if (errors.organizer) setErrors(p => ({...p, organizer: ""})); }}
                  error={!!errors.organizer}
                />
                <FieldError message={errors.organizer} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || success}
                className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-150 ${
                  submitting || success
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md active:scale-95"
                }`}
              >
                {submitting ? (
                  <>
                    <svg className="spinner w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                    </svg>
                    Creating Club…
                  </>
                ) : success ? (
                  <><CheckCircle2 className="w-4 h-4" /> Club Created!</>
                ) : (
                  <><Plus className="w-4 h-4" /> Create Club</>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={isClean || submitting}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold border transition-all duration-150 ${
                  isClean || submitting
                    ? "border-gray-100 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 active:scale-95"
                }`}
              >
                Reset
              </button>

              <span className="text-xs text-gray-400 ml-2">* Required fields</span>
            </div>
          </div>

          {/* RIGHT — SIDEBAR (1/3) */}
          <div className="space-y-5">

            {/* Live Preview */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900">Live Preview</h2>
                <p className="text-xs text-gray-500 mt-0.5">How your club card will appear</p>
              </div>
              <div className="p-5">
                <div className="rounded-xl border-2 border-dashed border-gray-200 overflow-hidden">
                  {/* Card header band */}
                  <div className="h-16 bg-gradient-to-r from-blue-500 to-blue-700 relative">
                    <div className="absolute -bottom-5 left-4 w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center border border-gray-100 text-blue-600 font-bold text-sm">
                      {name.trim() ? name.trim()[0].toUpperCase() : <Users className="w-4 h-4 text-gray-300" />}
                    </div>
                  </div>
                  <div className="pt-7 px-4 pb-4">
                    <div className="text-sm font-bold text-gray-900 truncate">
                      {name.trim() || <span className="text-gray-300 font-normal">Club name…</span>}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2 min-h-8">
                      {description.trim() || <span className="text-gray-300">Description will appear here…</span>}
                    </div>
                    {selectedOrg && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                        <Avatar user={selectedOrg} size="sm" />
                        <div>
                          <div className="text-xs font-medium text-gray-700">{selectedOrg.name}</div>
                          <div className="text-xs text-gray-400">Organizer</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
              <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" /> Tips for a great club
              </h3>
              <ul className="space-y-2.5 text-xs text-blue-800">
                {[
                  "Use a clear, descriptive name that reflects the club's purpose",
                  "Write a welcoming description that explains what members will do",
                  "Choose an organizer who is active and responsive",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-700 font-bold flex items-center justify-center flex-shrink-0 text-xs mt-0.5">{i+1}</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
              {[
                { label: "Total Clubs",     value: "24",  sub: "across platform" },
                { label: "Active Organizers", value: "10", sub: "available to assign" },
              ].map(({ label, value, sub }) => (
                <div key={label} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500">{label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
                  </div>
                  <div className="text-xl font-bold text-gray-900">{value}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}