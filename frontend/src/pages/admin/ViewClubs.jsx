import { useState, useMemo } from "react";
import {
  Plus, Search, Users, CheckCircle, XCircle, RefreshCw,
  ChevronUp, ChevronDown, MoreHorizontal, Filter,
  TrendingUp, Shield, Calendar, Eye, Trash2, Edit3, X
} from "lucide-react";

/* ─────────────── SEED DATA ─────────────── */
const SEED_CLUBS = [
  { id:1,  name:"Coding Club",       organizer:"Rahul Sharma",   members:["Rahul","Priya","Dev"],       status:"active",   created:"2024-01-15", events:12, category:"Technology" },
  { id:2,  name:"Music Club",        organizer:"Aman Verma",     members:["Aman"],                      status:"inactive", created:"2024-02-20", events:4,  category:"Arts"       },
  { id:3,  name:"Photography Guild", organizer:"Neha Joshi",     members:["Neha","Karan","Tanya"],      status:"active",   created:"2024-03-05", events:8,  category:"Arts"       },
  { id:4,  name:"Chess Society",     organizer:"Dev Kapoor",     members:["Dev","Amit"],                status:"active",   created:"2024-03-18", events:20, category:"Sports"     },
  { id:5,  name:"Debate Forum",      organizer:"Priya Nair",     members:["Priya","Simran","Meera"],    status:"inactive", created:"2024-04-02", events:6,  category:"Academic"   },
  { id:6,  name:"Film Appreciation", organizer:"Tanya Gupta",    members:["Tanya","Rohan"],             status:"active",   created:"2024-04-20", events:15, category:"Arts"       },
  { id:7,  name:"Robotics Lab",      organizer:"Amit Chatterjee",members:["Amit","Dev","Karan","Neha"], status:"active",   created:"2024-05-01", events:9,  category:"Technology" },
  { id:8,  name:"Book Circle",       organizer:"Simran Kaur",    members:["Simran","Aanya"],            status:"inactive", created:"2024-05-14", events:3,  category:"Academic"   },
];

const CATEGORY_COLORS = {
  Technology: "bg-sky-100 text-sky-700",
  Arts:       "bg-rose-100 text-rose-700",
  Sports:     "bg-emerald-100 text-emerald-700",
  Academic:   "bg-amber-100 text-amber-700",
};

const AVATAR_GRADIENTS = [
  "from-orange-400 to-rose-500",
  "from-sky-400 to-blue-600",
  "from-emerald-400 to-teal-600",
  "from-violet-400 to-purple-600",
  "from-amber-400 to-orange-500",
  "from-pink-400 to-rose-600",
  "from-cyan-400 to-sky-600",
  "from-indigo-400 to-blue-600",
];

function initials(name) {
  return name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
}

function OrgAvatar({ name, idx, size="sm" }) {
  const sz = size === "lg" ? "w-10 h-10 text-sm" : "w-7 h-7 text-xs";
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]} text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm`}>
      {initials(name)}
    </div>
  );
}

/* ─────────────── CONFIRM MODAL ─────────────── */
function ConfirmModal({ club, action, onConfirm, onCancel }) {
  const isDeactivate = action === "deactivate";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-modal">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${isDeactivate ? "bg-rose-100" : "bg-emerald-100"}`}>
          {isDeactivate
            ? <XCircle className="w-6 h-6 text-rose-500" />
            : <RefreshCw className="w-6 h-6 text-emerald-500" />}
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          {isDeactivate ? "Deactivate Club?" : "Reactivate Club?"}
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          {isDeactivate
            ? `"${club.name}" will be hidden from members and events will be paused.`
            : `"${club.name}" will be restored and members can participate again.`}
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 ${
              isDeactivate ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-500 hover:bg-emerald-600"}`}>
            {isDeactivate ? "Deactivate" : "Reactivate"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── DETAIL DRAWER ─────────────── */
function ClubDrawer({ club, onClose, onToggleStatus }) {
  if (!club) return null;
  const isActive = club.status === "active";
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm shadow-2xl flex flex-col animate-drawer">
        {/* Header band */}
        <div className={`h-24 ${isActive ? "bg-gradient-to-r from-emerald-500 to-teal-600" : "bg-gradient-to-r from-slate-400 to-slate-500"} flex-shrink-0 relative`}>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="absolute -bottom-6 left-6">
            <OrgAvatar name={club.name} idx={club.id} size="lg" />
          </div>
        </div>

        <div className="pt-10 px-6 pb-6 flex-1 overflow-y-auto">
          <div className="flex items-start justify-between mb-1">
            <h2 className="text-xl font-bold text-slate-900">{club.name}</h2>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-6">Created {new Date(club.created).toLocaleDateString("en-IN", {day:"numeric",month:"short",year:"numeric"})}</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label:"Members", value: club.members.length, icon: Users },
              { label:"Events",  value: club.events,          icon: Calendar },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                <Icon className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                <div className="text-xl font-bold text-slate-900">{value}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Organizer</div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
              <OrgAvatar name={club.organizer} idx={club.id + 1} />
              <span className="text-sm font-semibold text-slate-800">{club.organizer}</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Members ({club.members.length})</div>
            <div className="flex flex-wrap gap-2">
              {club.members.map((m,i) => (
                <div key={i} className="flex items-center gap-1.5 bg-slate-50 rounded-full px-2.5 py-1">
                  <OrgAvatar name={m} idx={i+3} />
                  <span className="text-xs font-medium text-slate-700">{m}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[club.category]}`}>{club.category}</span>
          </div>

          <button
            onClick={() => { onToggleStatus(club.id); onClose(); }}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 ${
              isActive ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-500 hover:bg-emerald-600"}`}>
            {isActive ? "Deactivate Club" : "Reactivate Club"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── MAIN PAGE ─────────────── */
export default function ViewClubs() {
  const [clubs,       setClubs]       = useState(SEED_CLUBS);
  const [filter,      setFilter]      = useState("all");
  const [search,      setSearch]      = useState("");
  const [sortKey,     setSortKey]     = useState("name");
  const [sortAsc,     setSortAsc]     = useState(true);
  const [modal,       setModal]       = useState(null);   // { club, action }
  const [drawer,      setDrawer]      = useState(null);   // club
  const [toast,       setToast]       = useState(null);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggle = (id) => {
    setClubs(prev => prev.map(c =>
      c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c
    ));
    const club = clubs.find(c => c.id === id);
    showToast(
      club.status === "active" ? `"${club.name}" deactivated` : `"${club.name}" reactivated`,
      club.status === "active" ? "warn" : "success"
    );
  };

  const handleDelete = (id) => {
    const club = clubs.find(c => c.id === id);
    setClubs(prev => prev.filter(c => c.id !== id));
    showToast(`"${club.name}" deleted`, "error");
  };

  const toggleSort = (key) => {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
  };

  const filtered = useMemo(() => {
    let list = clubs;
    if (filter !== "all") list = list.filter(c => c.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.organizer.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    list = [...list].sort((a, b) => {
      const va = sortKey === "members" ? a.members.length : sortKey === "events" ? a.events : a[sortKey];
      const vb = sortKey === "members" ? b.members.length : sortKey === "events" ? b.events : b[sortKey];
      return sortAsc
        ? (typeof va === "string" ? va.localeCompare(vb) : va - vb)
        : (typeof va === "string" ? vb.localeCompare(va) : vb - va);
    });
    return list;
  }, [clubs, filter, search, sortKey, sortAsc]);

  const stats = {
    total:    clubs.length,
    active:   clubs.filter(c => c.status === "active").length,
    inactive: clubs.filter(c => c.status === "inactive").length,
    events:   clubs.reduce((s, c) => s + c.events, 0),
  };

  const SortIcon = ({ k }) => sortKey === k
    ? (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
    : <ChevronDown className="w-3 h-3 opacity-30" />;

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp   { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn  { from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }
        @keyframes modalIn  { from { opacity:0; transform:scale(0.95) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes toastIn  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .row-enter   { animation: fadeUp  0.25s ease both; }
        .animate-drawer { animation: slideIn 0.28s cubic-bezier(.22,1,.36,1) both; }
        .animate-modal  { animation: modalIn 0.22s ease both; }
        .toast-anim     { animation: toastIn 0.3s ease both; }
        tr:hover td { background: #f8fafc; }
      `}</style>

      {/* ── BREADCRUMB ── */}
      <div className="bg-white border-b border-slate-200 px-8 py-3.5 flex items-center gap-2 text-sm text-slate-500">
        <span className="hover:text-slate-700 cursor-pointer">Dashboard</span>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Clubs</span>
      </div>

      <div className="px-8 py-7 max-w-7xl mx-auto">

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-4 gap-4 mb-7">
          {[
            { label:"Total Clubs",    value: stats.total,    icon: Users,       color:"bg-indigo-500",  light:"bg-indigo-50  text-indigo-600"  },
            { label:"Active",         value: stats.active,   icon: CheckCircle, color:"bg-emerald-500", light:"bg-emerald-50 text-emerald-600" },
            { label:"Inactive",       value: stats.inactive, icon: XCircle,     color:"bg-rose-500",    light:"bg-rose-50    text-rose-600"    },
            { label:"Total Events",   value: stats.events,   icon: TrendingUp,  color:"bg-amber-500",   light:"bg-amber-50   text-amber-600"   },
          ].map(({ label, value, icon: Icon, color, light }, i) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm row-enter flex items-center gap-4"
              style={{ animationDelay: `${i * 60}ms` }}>
              <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shadow-md`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{value}</div>
                <div className="text-xs text-slate-500 font-medium">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── TOOLBAR ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              {["all","active","inactive"].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all duration-150 ${
                    filter === f
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}>
                  {f}
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${filter === f ? "bg-slate-100" : "bg-transparent"}`}>
                    {f === "all" ? stats.total : f === "active" ? stats.active : stats.inactive}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-56 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search clubs…"
                  className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400" />
                {search && <button onClick={() => setSearch("")}><X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" /></button>}
              </div>

              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 transition-all active:scale-95">
                <Plus className="w-4 h-4" /> Create Club
              </button>
            </div>
          </div>

          {/* ── TABLE ── */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {[
                    { key:"name",     label:"Club Name"  },
                    { key:"organizer",label:"Organizer"  },
                    { key:"members",  label:"Members"    },
                    { key:"events",   label:"Events"     },
                    { key:"category", label:"Category"   },
                    { key:"status",   label:"Status"     },
                    { key:null,       label:"Actions"    },
                  ].map(({ key, label }) => (
                    <th key={label}
                      onClick={() => key && toggleSort(key)}
                      className={`text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider select-none ${key ? "cursor-pointer hover:text-slate-700" : ""}`}>
                      <span className="flex items-center gap-1">
                        {label}
                        {key && <SortIcon k={key} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400 text-sm">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      No clubs found
                    </td>
                  </tr>
                ) : filtered.map((club, i) => {
                  const isActive = club.status === "active";
                  return (
                    <tr key={club.id} className="row-enter group" style={{ animationDelay: `${i * 40}ms` }}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <OrgAvatar name={club.name} idx={club.id} />
                          <div>
                            <div className="text-sm font-bold text-slate-900">{club.name}</div>
                            <div className="text-xs text-slate-400">{new Date(club.created).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <OrgAvatar name={club.organizer} idx={club.id + 2} />
                          <span className="text-sm text-slate-700 font-medium">{club.organizer}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center -space-x-2">
                          {club.members.slice(0,3).map((m,j) => (
                            <div key={j} title={m}
                              className={`w-6 h-6 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[(j+club.id)%AVATAR_GRADIENTS.length]} text-white text-xs font-bold flex items-center justify-center ring-2 ring-white`}>
                              {m[0]}
                            </div>
                          ))}
                          {club.members.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center ring-2 ring-white">
                              +{club.members.length - 3}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">{club.members.length} member{club.members.length !== 1 ? "s":""}</div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-slate-800">{club.events}</span>
                        <span className="text-xs text-slate-400 ml-1">events</span>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[club.category]}`}>
                          {club.category}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setDrawer(club)}
                            title="View details"
                            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            title={isActive ? "Deactivate" : "Reactivate"}
                            onClick={() => setModal({ club, action: isActive ? "deactivate" : "reactivate" })}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              isActive
                                ? "hover:bg-rose-50 text-slate-400 hover:text-rose-500"
                                : "hover:bg-emerald-50 text-slate-400 hover:text-emerald-500"}`}>
                            {isActive ? <XCircle className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                          </button>

                          <button
                            title="Delete"
                            onClick={() => handleDelete(club.id)}
                            className="w-8 h-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER */}
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Showing <span className="text-slate-800 font-bold">{filtered.length}</span> of <span className="text-slate-800 font-bold">{clubs.length}</span> clubs
            </span>
            <div className="flex items-center gap-1">
              {["1"].map(p => (
                <button key={p} className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-xs font-bold">{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MODALS & OVERLAYS ── */}
      {modal && (
        <ConfirmModal
          club={modal.club}
          action={modal.action}
          onCancel={() => setModal(null)}
          onConfirm={() => { handleToggle(modal.club.id); setModal(null); }}
        />
      )}

      <ClubDrawer
        club={drawer}
        onClose={() => setDrawer(null)}
        onToggleStatus={(id) => { handleToggle(id); }}
      />

      {/* ── TOAST ── */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 toast-anim flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold ${
          toast.type === "success" ? "bg-emerald-600 text-white" :
          toast.type === "warn"    ? "bg-amber-500 text-white"   :
                                     "bg-rose-600 text-white"}`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> :
           toast.type === "warn"    ? <XCircle className="w-4 h-4" />     :
                                      <Trash2 className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

