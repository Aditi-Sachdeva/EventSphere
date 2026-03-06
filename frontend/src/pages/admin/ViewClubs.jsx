// import { useState, useMemo } from "react";
// import {
//   Plus, Search, Users, CheckCircle, XCircle, RefreshCw,
//   ChevronUp, ChevronDown, MoreHorizontal, Filter,
//   TrendingUp, Shield, Calendar, Eye, Trash2, Edit3, X
// } from "lucide-react";

// /* ─────────────── SEED DATA ─────────────── */
// const SEED_CLUBS = [
//   { id:1,  name:"Coding Club",       organizer:"Rahul Sharma",   members:["Rahul","Priya","Dev"],       status:"active",   created:"2024-01-15", events:12, category:"Technology" },
//   { id:2,  name:"Music Club",        organizer:"Aman Verma",     members:["Aman"],                      status:"inactive", created:"2024-02-20", events:4,  category:"Arts"       },
//   { id:3,  name:"Photography Guild", organizer:"Neha Joshi",     members:["Neha","Karan","Tanya"],      status:"active",   created:"2024-03-05", events:8,  category:"Arts"       },
//   { id:4,  name:"Chess Society",     organizer:"Dev Kapoor",     members:["Dev","Amit"],                status:"active",   created:"2024-03-18", events:20, category:"Sports"     },
//   { id:5,  name:"Debate Forum",      organizer:"Priya Nair",     members:["Priya","Simran","Meera"],    status:"inactive", created:"2024-04-02", events:6,  category:"Academic"   },
//   { id:6,  name:"Film Appreciation", organizer:"Tanya Gupta",    members:["Tanya","Rohan"],             status:"active",   created:"2024-04-20", events:15, category:"Arts"       },
//   { id:7,  name:"Robotics Lab",      organizer:"Amit Chatterjee",members:["Amit","Dev","Karan","Neha"], status:"active",   created:"2024-05-01", events:9,  category:"Technology" },
//   { id:8,  name:"Book Circle",       organizer:"Simran Kaur",    members:["Simran","Aanya"],            status:"inactive", created:"2024-05-14", events:3,  category:"Academic"   },
// ];

// const CATEGORY_COLORS = {
//   Technology: "bg-sky-100 text-sky-700",
//   Arts:       "bg-rose-100 text-rose-700",
//   Sports:     "bg-emerald-100 text-emerald-700",
//   Academic:   "bg-amber-100 text-amber-700",
// };

// const AVATAR_COLORS = [
//   "bg-blue-500",
//   "bg-purple-500",
//   "bg-pink-500",
//   "bg-green-500",
//   "bg-orange-500",
//   "bg-red-500",
//   "bg-indigo-500",
// ];

// const AVATAR_GRADIENTS = [
//   "from-orange-400 to-rose-500",
//   "from-sky-400 to-blue-600",
//   "from-emerald-400 to-teal-600",
//   "from-violet-400 to-purple-600",
//   "from-amber-400 to-orange-500",
//   "from-pink-400 to-rose-600",
//   "from-cyan-400 to-sky-600",
//   "from-indigo-400 to-blue-600",
// ];

// function initials(name) {
//   if (!name) return "?";
//   return name
//     .trim()
//     .split(" ")
//     .map(word => word[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();
// }

// const BG_COLORS = [
//   "#6366f1","#8b5cf6","#ec4899","#10b981","#f59e0b","#ef4444","#3b82f6",
//   "#06b6d4","#84cc16","#f97316","#14b8a6","#a855f7","#e11d48","#0ea5e9",
// ];

// function getColor(idx) {
//   return BG_COLORS[Math.abs(idx) % BG_COLORS.length];
// }

// function OrgAvatar({ name, idx, size="sm" }) {
//   const sz = size === "lg" ? { width:40, height:40, fontSize:14 } : { width:28, height:28, fontSize:11 };
//   const text = name
//     ? name.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
//     : "?";
//   return (
//     <div
//       style={{ ...sz, background: getColor(idx), borderRadius:"50%", color:"#fff", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }}
//     >
//       {text}
//     </div>
//   );
// }

// /* ─────────────── CONFIRM MODAL ─────────────── */
// function ConfirmModal({ club, action, onConfirm, onCancel }) {
//   const isDeactivate = action === "deactivate";
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
//       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
//       <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-modal" style={{padding:"24px"}}>
//         <div className="flex items-center gap-3 mb-3">
//           <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
//             style={{background: isDeactivate ? "#fee2e2" : "#d1fae5"}}>
//             {isDeactivate
//               ? <XCircle className="w-5 h-5" style={{color:"#ef4444"}} />
//               : <RefreshCw className="w-5 h-5" style={{color:"#10b981"}} />}
//           </div>
//           <h3 className="text-base font-bold text-slate-900">
//             {isDeactivate ? "Deactivate Club?" : "Reactivate Club?"}
//           </h3>
//         </div>
//         <p className="text-sm text-slate-500 mb-5">
//           {isDeactivate
//             ? `"${club.name}" will be hidden from members and events will be paused.`
//             : `"${club.name}" will be restored and members can participate again.`}
//         </p>
//         <div className="flex gap-3">
//           <button onClick={onCancel}
//             className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
//             Cancel
//           </button>
//           <button onClick={onConfirm}
//             className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
//             style={{background: isDeactivate ? "#ef4444" : "#10b981"}}>
//             {isDeactivate ? "Deactivate" : "Reactivate"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─────────────── DETAIL DRAWER ─────────────── */
// function ClubDrawer({ club, onClose, onToggleStatus }) {
//   if (!club) return null;
//   const isActive = club.status === "active";
//   return (
//     <div className="fixed inset-0 z-40 flex justify-end">
//       <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative bg-white w-full max-w-sm shadow-2xl flex flex-col animate-drawer">
//         <div className={`h-24 ${isActive ? "bg-gradient-to-r from-emerald-500 to-teal-600" : "bg-gradient-to-r from-slate-400 to-slate-500"} flex-shrink-0 relative`}>
//           <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
//             <X className="w-4 h-4 text-white" />
//           </button>
//           <div className="absolute -bottom-6 left-6">
//             <OrgAvatar name={club.name} idx={club.id} size="lg" />
//           </div>
//         </div>

//         <div className="pt-10 px-6 pb-6 flex-1 overflow-y-auto">
//           <div className="flex items-start justify-between mb-1">
//             <h2 className="text-xl font-bold text-slate-900">{club.name}</h2>
//             <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
//               {isActive ? "Active" : "Inactive"}
//             </span>
//           </div>
//           <p className="text-sm text-slate-500 mb-6">Created {new Date(club.created).toLocaleDateString("en-IN", {day:"numeric",month:"short",year:"numeric"})}</p>

//           <div className="grid grid-cols-2 gap-3 mb-6">
//             {[
//               { label:"Members", value: club.members.length, icon: Users },
//               { label:"Events",  value: club.events,          icon: Calendar },
//             ].map(({ label, value, icon: Icon }) => (
//               <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
//                 <Icon className="w-4 h-4 text-slate-400 mx-auto mb-1" />
//                 <div className="text-xl font-bold text-slate-900">{value}</div>
//                 <div className="text-xs text-slate-500">{label}</div>
//               </div>
//             ))}
//           </div>

//           <div className="mb-4">
//             <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Organizer</div>
//             <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
//               <OrgAvatar name={club.organizer} idx={club.id + 1} />
//               <span className="text-sm font-semibold text-slate-800">{club.organizer}</span>
//             </div>
//           </div>

//           <div className="mb-6">
//             <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Members ({club.members.length})</div>
//             <div className="flex flex-wrap gap-2">
//               {club.members.map((m,i) => (
//                 <div key={i} className="flex items-center gap-1.5 bg-slate-50 rounded-full px-2.5 py-1">
//                   <div style={{width:24,height:24,borderRadius:"50%",background:getColor(i+3),color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
//                     {m.trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
//                   </div>
//                   <span className="text-xs font-medium text-slate-700">{m}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="mb-6">
//             <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</div>
//             <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[club.category]}`}>{club.category}</span>
//           </div>

//           <button
//             onClick={() => { onToggleStatus(club.id); onClose(); }}
//             className={`w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 ${
//               isActive ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-500 hover:bg-emerald-600"}`}>
//             {isActive ? "Deactivate Club" : "Reactivate Club"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─────────────── MAIN PAGE ─────────────── */
// export default function ViewClubs() {
//   const [clubs,       setClubs]       = useState(SEED_CLUBS);
//   const [filter,      setFilter]      = useState("all");
//   const [search,      setSearch]      = useState("");
//   const [sortKey,     setSortKey]     = useState("name");
//   const [sortAsc,     setSortAsc]     = useState(true);
//   const [modal,       setModal]       = useState(null);
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
//   const [drawer,      setDrawer]      = useState(null);
//   const [toast,       setToast]       = useState(null);

//   const showToast = (msg, type="success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const handleToggle = (id) => {
//     setClubs(prev => prev.map(c =>
//       c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c
//     ));
//     const club = clubs.find(c => c.id === id);
//     showToast(
//       club.status === "active" ? `"${club.name}" deactivated` : `"${club.name}" reactivated`,
//       club.status === "active" ? "warn" : "success"
//     );
//   };

//   const handleDelete = (id) => {
//     const club = clubs.find(c => c.id === id);
//     setDeleteConfirm(club);
//   };

//   const confirmDelete = () => {
//     setClubs(prev => prev.filter(c => c.id !== deleteConfirm.id));
//     showToast(`"${deleteConfirm.name}" deleted`, "error");
//     setDeleteConfirm(null);
//   };

//   const toggleSort = (key) => {
//     if (sortKey === key) setSortAsc(a => !a);
//     else { setSortKey(key); setSortAsc(true); }
//   };

//   const filtered = useMemo(() => {
//     let list = clubs;
//     if (filter !== "all") list = list.filter(c => c.status === filter);
//     if (search.trim()) {
//       const q = search.toLowerCase();
//       list = list.filter(c =>
//         c.name.toLowerCase().includes(q) ||
//         c.organizer.toLowerCase().includes(q) ||
//         c.category.toLowerCase().includes(q)
//       );
//     }
//     list = [...list].sort((a, b) => {
//       const va = sortKey === "members" ? a.members.length : sortKey === "events" ? a.events : a[sortKey];
//       const vb = sortKey === "members" ? b.members.length : sortKey === "events" ? b.events : b[sortKey];
//       return sortAsc
//         ? (typeof va === "string" ? va.localeCompare(vb) : va - vb)
//         : (typeof va === "string" ? vb.localeCompare(va) : vb - va);
//     });
//     return list;
//   }, [clubs, filter, search, sortKey, sortAsc]);

//   const stats = {
//     total:    clubs.length,
//     active:   clubs.filter(c => c.status === "active").length,
//     inactive: clubs.filter(c => c.status === "inactive").length,
//     events:   clubs.reduce((s, c) => s + c.events, 0),
//   };

//   const SortIcon = ({ k }) => sortKey === k
//     ? (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
//     : <ChevronDown className="w-3 h-3 opacity-30" />;

//   return (
//     <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
//         @keyframes fadeUp   { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
//         @keyframes slideIn  { from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }
//         @keyframes modalIn  { from { opacity:0; transform:scale(0.95) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
//         @keyframes toastIn  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
//         .row-enter   { animation: fadeUp  0.25s ease both; }
//         .animate-drawer { animation: slideIn 0.28s cubic-bezier(.22,1,.36,1) both; }
//         .animate-modal  { animation: modalIn 0.22s ease both; }
//         .toast-anim     { animation: toastIn 0.3s ease both; }
//         tr:hover td { background: #f8fafc; }
//       `}</style>

//       <div className="px-8 py-7 w-full">

//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">View Clubs</h1>
//             <p className="text-sm text-gray-500 mt-1">Manage and monitor all clubs in the system</p>
//           </div>
//           <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2">
//             <Users className="w-4 h-4 text-blue-500" />
//             <span>{clubs.length} clubs available</span>
//           </div>
//         </div>

//         {/* ── STAT CARDS ── */}
//         <div className="grid grid-cols-4 gap-4 mb-7">
//           {[
//             { label:"Total Clubs",  value: stats.total,    icon: Users,       bg:"#6366f1" },
//             { label:"Active",       value: stats.active,   icon: CheckCircle, bg:"#10b981" },
//             { label:"Inactive",     value: stats.inactive, icon: XCircle,     bg:"#ef4444" },
//             { label:"Total Events", value: stats.events,   icon: TrendingUp,  bg:"#f59e0b" },
//           ].map(({ label, value, icon: Icon, bg }, i) => (
//             <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm row-enter flex items-center gap-4"
//               style={{ animationDelay: `${i * 60}ms` }}>
//               <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md flex-shrink-0" style={{ background: bg }}>
//                 <Icon className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <div className="text-2xl font-extrabold text-slate-900">{value}</div>
//                 <div className="text-xs text-slate-500 font-medium">{label}</div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ── TOOLBAR ── */}
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

//           <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
//             <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
//               {["all","active","inactive"].map(f => (
//                 <button key={f} onClick={() => setFilter(f)}
//                   className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all duration-150 ${
//                     filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
//                   {f}
//                   <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${filter === f ? "bg-slate-100" : "bg-transparent"}`}>
//                     {f === "all" ? stats.total : f === "active" ? stats.active : stats.inactive}
//                   </span>
//                 </button>
//               ))}
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-56 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
//                 <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
//                 <input value={search} onChange={e => setSearch(e.target.value)}
//                   placeholder="Search clubs…"
//                   className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400" />
//                 {search && <button onClick={() => setSearch("")}><X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" /></button>}
//               </div>
//               <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 transition-all active:scale-95">
//                 <Plus className="w-4 h-4" /> Create Club
//               </button>
//             </div>
//           </div>

//           {/* ── TABLE ── */}
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-slate-50 border-b border-slate-100">
//                   {[
//                     { key:"name",     label:"Club Name"  },
//                     { key:"organizer",label:"Organizer"  },
//                     { key:"members",  label:"Members"    },
//                     { key:"events",   label:"Events"     },
//                     { key:"category", label:"Category"   },
//                     { key:null,       label:"Actions"    },
//                   ].map(({ key, label }) => (
//                     <th key={label}
//                       onClick={() => key && toggleSort(key)}
//                       className={`text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider select-none ${key ? "cursor-pointer hover:text-slate-700" : ""}`}>
//                       <span className="flex items-center gap-1">
//                         {label}
//                         {key && <SortIcon k={key} />}
//                       </span>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {filtered.length === 0 ? (
//                   <tr>
//                     <td colSpan={6} className="py-16 text-center text-slate-400 text-sm">
//                       <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
//                       No clubs found
//                     </td>
//                   </tr>
//                 ) : filtered.map((club, i) => {
//                   const isActive = club.status === "active";
//                   return (
//                     <tr key={club.id} className="row-enter group" style={{ animationDelay: `${i * 40}ms` }}>

//                       {/* ── CLUB NAME — single avatar ── */}
//                       <td className="px-5 py-4">
//                         <div className="flex items-center gap-3">
//                           <div
//                             style={{ background: ["#6366f1","#8b5cf6","#ec4899","#10b981","#f59e0b","#ef4444","#3b82f6"][i % 7] }}
//                             className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-sm"
//                           >
//                             {club.name.trim()[0].toUpperCase()}
//                           </div>
//                           <div>
//                             <div className="text-sm font-bold text-slate-900">{club.name}</div>
//                             <div className="text-xs text-slate-400">{new Date(club.created).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
//                           </div>
//                         </div>
//                       </td>

//                       {/* ── ORGANIZER — single avatar ── */}
//                       <td className="px-5 py-4">
//                         <div className="flex items-center gap-3">
//                           <div
//                             style={{ background: ["#8b5cf6","#6366f1","#3b82f6","#ec4899","#10b981","#f59e0b","#ef4444"][(i + 2) % 7] }}
//                             className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0 ring-2 ring-white shadow-sm"
//                           >
//                             {club.organizer.trim()[0].toUpperCase()}
//                           </div>
//                           <div className="text-sm text-slate-700 font-medium">{club.organizer}</div>
//                         </div>
//                       </td>

//                       {/* ── MEMBERS ── */}
//                       <td className="px-5 py-4">
//                         <div className="flex -space-x-2">
//                           {club.members.slice(0,3).map((m,j) => (
//                             <div
//                               key={j}
//                               title={m}
//                               style={{width:28,height:28,borderRadius:"50%",background:getColor(j),color:"#fff",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",outline:"2px solid #fff",flexShrink:0}}
//                             >
//                               {initials(m)}
//                             </div>
//                           ))}
//                           {club.members.length > 3 && (
//                             <div style={{width:28,height:28,borderRadius:"50%",background:"#d1d5db",fontSize:11,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",outline:"2px solid #fff"}}>
//                               +{club.members.length - 3}
//                             </div>
//                           )}
//                         </div>
//                         <div className="text-xs text-slate-400 mt-1">
//                           {club.members.length} member{club.members.length !== 1 ? "s" : ""}
//                         </div>
//                       </td>

//                       <td className="px-5 py-4">
//                         <span className="text-sm font-bold text-slate-800">{club.events}</span>
//                         <span className="text-xs text-slate-400 ml-1">events</span>
//                       </td>

//                       <td className="px-5 py-4">
//                         <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[club.category]}`}>
//                           {club.category}
//                         </span>
//                       </td>

//                       <td className="px-5 py-4">
//                         <div className="flex items-center gap-1.5">
//                           <button onClick={() => setDrawer(club)}
//                             title="View details"
//                             className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors">
//                             <Eye className="w-4 h-4" />
//                           </button>
//                           <button
//                             title={isActive ? "Deactivate" : "Reactivate"}
//                             onClick={() => setModal({ club, action: isActive ? "deactivate" : "reactivate" })}
//                             className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
//                               isActive
//                                 ? "hover:bg-rose-50 text-slate-400 hover:text-rose-500"
//                                 : "hover:bg-emerald-50 text-slate-400 hover:text-emerald-500"}`}>
//                             {isActive ? <XCircle className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
//                           </button>
//                           <button
//                             title="Delete"
//                             onClick={() => handleDelete(club.id)}
//                             className="w-8 h-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* TABLE FOOTER */}
//           <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
//             <span className="text-xs text-slate-500 font-medium">
//               Showing <span className="text-slate-800 font-bold">{filtered.length}</span> of <span className="text-slate-800 font-bold">{clubs.length}</span> clubs
//             </span>
//             <div className="flex items-center gap-1">
//               <button className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-xs font-bold">1</button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── MODALS & OVERLAYS ── */}
//       {modal && (
//         <ConfirmModal
//           club={modal.club}
//           action={modal.action}
//           onCancel={() => setModal(null)}
//           onConfirm={() => { handleToggle(modal.club.id); setModal(null); }}
//         />
//       )}

//       {/* ── DELETE CONFIRM MODAL ── */}
//       {deleteConfirm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
//           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
//           <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-modal" style={{padding:"24px"}}>
//             <div className="flex items-center gap-3 mb-3">
//               <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"#fee2e2"}}>
//                 <Trash2 className="w-5 h-5" style={{color:"#ef4444"}} />
//               </div>
//               <h3 className="text-base font-bold text-slate-900">Delete Club?</h3>
//             </div>
//             <p className="text-sm text-slate-500 mb-5">
//               Are you sure you want to delete <span className="font-semibold text-slate-800">"{deleteConfirm.name}"</span>? This action cannot be undone.
//             </p>
//             <div className="flex gap-3">
//               <button onClick={() => setDeleteConfirm(null)}
//                 className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
//                 Cancel
//               </button>
//               <button onClick={confirmDelete}
//                 className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
//                 style={{background:"#ef4444"}}>
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <ClubDrawer
//         club={drawer}
//         onClose={() => setDrawer(null)}
//         onToggleStatus={(id) => { handleToggle(id); }}
//       />

//       {/* ── TOAST ── */}
//       {toast && (
//         <div className={`fixed bottom-6 right-6 z-50 toast-anim flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold ${
//           toast.type === "success" ? "bg-emerald-600 text-white" :
//           toast.type === "warn"    ? "bg-amber-500 text-white"   :
//                                      "bg-rose-600 text-white"}`}>
//           {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> :
//            toast.type === "warn"    ? <XCircle className="w-4 h-4" />     :
//                                       <Trash2 className="w-4 h-4" />}
//           {toast.msg}
//         </div>
//       )}
//     </div>
//   );
// }





import { useState, useMemo } from "react";
import {
  Plus, Search, Users, CheckCircle, XCircle, RefreshCw,
  ChevronUp, ChevronDown,
  TrendingUp, Calendar, Eye, Trash2, X, Clock, Star
} from "lucide-react";

const SEED_CLUBS = [
  { id:1,  name:"Coding Club",       organizer:"Rahul Sharma",    members:["Rahul","Priya","Dev"],       status:"active",   created:"2024-01-15", events:12, category:"Technology" },
  { id:2,  name:"Music Club",        organizer:"Aman Verma",      members:["Aman"],                      status:"inactive", created:"2024-02-20", events:4,  category:"Arts"       },
  { id:3,  name:"Photography Guild", organizer:"Neha Joshi",      members:["Neha","Karan","Tanya"],      status:"active",   created:"2024-03-05", events:8,  category:"Arts"       },
  { id:4,  name:"Chess Society",     organizer:"Dev Kapoor",      members:["Dev","Amit"],                status:"active",   created:"2024-03-18", events:20, category:"Sports"     },
  { id:5,  name:"Debate Forum",      organizer:"Priya Nair",      members:["Priya","Simran","Meera"],    status:"inactive", created:"2024-04-02", events:6,  category:"Academic"   },
  { id:6,  name:"Film Appreciation", organizer:"Tanya Gupta",     members:["Tanya","Rohan"],             status:"active",   created:"2024-04-20", events:15, category:"Arts"       },
  { id:7,  name:"Robotics Lab",      organizer:"Amit Chatterjee", members:["Amit","Dev","Karan","Neha"], status:"active",   created:"2024-05-01", events:9,  category:"Technology" },
  { id:8,  name:"Book Circle",       organizer:"Simran Kaur",     members:["Simran","Aanya"],            status:"inactive", created:"2024-05-14", events:3,  category:"Academic"   },
];

const ES_GRAD = "linear-gradient(135deg,#ec4899 0%,#a855f7 50%,#6366f1 100%)";

const CATEGORY_PILL = {
  Technology: { bg:"#eef2ff", color:"#4f46e5" },
  Arts:       { bg:"#fdf2f8", color:"#be185d" },
  Sports:     { bg:"#f0fdf4", color:"#15803d" },
  Academic:   { bg:"#fffbeb", color:"#b45309" },
};

const CATEGORY_GRAD = {
  Technology: "linear-gradient(135deg,#6366f1,#818cf8)",
  Arts:       "linear-gradient(135deg,#ec4899,#f472b6)",
  Sports:     "linear-gradient(135deg,#10b981,#34d399)",
  Academic:   "linear-gradient(135deg,#f59e0b,#fbbf24)",
};

const AVATAR_PALETTE = [
  "#ec4899","#a855f7","#6366f1","#8b5cf6","#db2777",
  "#7c3aed","#4f46e5","#c026d3","#9333ea","#e11d48",
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
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)", backdropFilter:"blur(4px)" }} onClick={onCancel}/>
      <div style={{ position:"relative", background:"white", borderRadius:20, boxShadow:"0 20px 60px rgba(0,0,0,0.2)", width:"100%", maxWidth:340, padding:24, animation:"modalIn .22s ease both" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
          <div style={{ width:40, height:40, borderRadius:12, background: isDeactivate ? "#fee2e2" : "#f0fdf4", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            {isDeactivate ? <XCircle style={{ width:20, height:20, color:"#ef4444" }}/> : <RefreshCw style={{ width:20, height:20, color:"#10b981" }}/>}
          </div>
          <div style={{ fontSize:15, fontWeight:800, color:"#111827" }}>{isDeactivate ? "Deactivate Club?" : "Reactivate Club?"}</div>
        </div>
        <p style={{ fontSize:13, color:"#6b7280", marginBottom:20, lineHeight:1.5 }}>
          {isDeactivate ? `"${club.name}" will be hidden from members and events will be paused.` : `"${club.name}" will be restored and members can participate again.`}
        </p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:"10px 0", borderRadius:12, border:"1px solid #e5e7eb", fontSize:13, fontWeight:600, color:"#4b5563", background:"white", cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, padding:"10px 0", borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"white", background: isDeactivate ? "#ef4444" : "#10b981", cursor:"pointer", fontFamily:"inherit" }}>
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
  const isActive = club.status === "active";
  const catGrad = CATEGORY_GRAD[club.category] || ES_GRAD;
  const createdDate = new Date(club.created).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"});

  return (
    <div style={{ position:"fixed", inset:0, zIndex:40, display:"flex", justifyContent:"flex-end" }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.3)", backdropFilter:"blur(4px)" }} onClick={onClose}/>
      <div style={{ position:"relative", background:"white", width:"100%", maxWidth:300, boxShadow:"-8px 0 40px rgba(0,0,0,0.12)", display:"flex", flexDirection:"column", animation:"slideIn .28s cubic-bezier(.22,1,.36,1) both", overflowY:"auto" }}>

        {/* Header */}
        <div style={{ padding:"20px 20px 52px", background:ES_GRAD, position:"relative", flexShrink:0 }}>
          <button onClick={onClose} style={{ position:"absolute", top:14, right:14, width:30, height:30, borderRadius:"50%", background:"rgba(255,255,255,0.2)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <X style={{ width:15, height:15, color:"white" }}/>
          </button>
          <div style={{ display:"flex", gap:8, marginBottom:12 }}>
            <span style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 10px", borderRadius:999, background:"rgba(255,255,255,0.22)", color:"white", fontSize:11, fontWeight:700 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background: isActive ? "#86efac" : "rgba(255,255,255,0.5)", display:"inline-block" }}/>
              {isActive ? "Active" : "Inactive"}
            </span>
            <span style={{ padding:"4px 10px", borderRadius:999, background:"rgba(255,255,255,0.18)", color:"white", fontSize:11, fontWeight:700 }}>{club.category}</span>
          </div>
          <div style={{ fontSize:18, fontWeight:800, color:"white", lineHeight:1.3, marginBottom:4 }}>{club.name}</div>
          <div style={{ display:"flex", alignItems:"center", gap:5, color:"rgba(255,255,255,0.75)", fontSize:12 }}>
            <Clock style={{ width:12, height:12 }}/>Created {createdDate}
          </div>
        </div>

        {/* Floating card */}
        <div style={{ padding:"0 16px", marginTop:-36, marginBottom:16, position:"relative", zIndex:10 }}>
          <div style={{ background:"white", borderRadius:16, boxShadow:"0 4px 20px rgba(168,85,247,0.15)", padding:14, border:"1px solid #f3e8ff" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, paddingBottom:12, borderBottom:"1px solid #faf5ff" }}>
              <div style={{ width:40, height:40, borderRadius:12, background:catGrad, color:"white", fontSize:15, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 4px 12px rgba(168,85,247,0.3)" }}>
                {club.name.trim()[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:"#111827", lineHeight:1.2 }}>{club.name}</div>
                <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>Club · {club.category}</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[
                { icon:Users,    label:"Members", value:club.members.length, bg:"#faf5ff", grad:"linear-gradient(135deg,#a855f7,#6366f1)" },
                { icon:Calendar, label:"Events",  value:club.events,         bg:"#fdf2f8", grad:"linear-gradient(135deg,#ec4899,#a855f7)" },
              ].map(({ icon:Icon, label, value, bg, grad }) => (
                <div key={label} style={{ borderRadius:12, padding:10, background:bg, display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:28, height:28, borderRadius:8, background:grad, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon style={{ width:14, height:14, color:"white" }}/>
                  </div>
                  <div>
                    <div style={{ fontSize:18, fontWeight:800, color:"#111827", lineHeight:1 }}>{value}</div>
                    <div style={{ fontSize:10, color:"#9ca3af", marginTop:2 }}>{label}</div>
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
              <Star style={{ width:12, height:12, color:"#a855f7" }}/>
              <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:"#a855f7" }}>Organizer</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:12, background:"#faf5ff", border:"1px solid #e9d5ff" }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:ES_GRAD, color:"white", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 2px 8px rgba(168,85,247,0.4)" }}>
                {initials(club.organizer)}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"#1f2937" }}>{club.organizer}</div>
                <div style={{ fontSize:11, color:"#9ca3af" }}>Club Lead</div>
              </div>
            </div>
          </div>

          {/* Members */}
          <div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <Users style={{ width:12, height:12, color:"#ec4899" }}/>
                <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:"#ec4899" }}>Members</span>
              </div>
              <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:999, background:"#fdf2f8", color:"#ec4899" }}>{club.members.length}</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {club.members.map((m,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 10px", borderRadius:10, background:"#fafafa", transition:"background .15s" }}>
                  <div style={{ width:26, height:26, borderRadius:"50%", background:getColor(i+3), color:"white", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {initials(m)}
                  </div>
                  <span style={{ fontSize:12, fontWeight:500, color:"#374151" }}>{m}</span>
                  {i===0 && <span style={{ marginLeft:"auto", fontSize:10, padding:"2px 7px", borderRadius:999, fontWeight:600, background:"#faf5ff", color:"#a855f7" }}>Lead</span>}
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop:"1px solid #fdf4ff" }}/>

          <button
            onClick={() => { onToggleStatus(club.id); onClose(); }}
            style={{ width:"100%", padding:"11px 0", borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"white", background: isActive ? "linear-gradient(135deg,#ef4444,#dc2626)" : ES_GRAD, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, boxShadow: isActive ? "0 4px 14px rgba(239,68,68,0.3)" : "0 4px 14px rgba(168,85,247,0.3)", fontFamily:"inherit" }}>
            {isActive ? <><XCircle style={{width:15,height:15}}/> Deactivate Club</> : <><RefreshCw style={{width:15,height:15}}/> Reactivate Club</>}
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

  const showToast = (msg,type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const handleToggle = (id) => {
    const club = clubs.find(c=>c.id===id);
    setClubs(prev=>prev.map(c=>c.id===id?{...c,status:c.status==="active"?"inactive":"active"}:c));
    showToast(club.status==="active"?`"${club.name}" deactivated`:`"${club.name}" reactivated`, club.status==="active"?"warn":"success");
  };

  const handleDelete = (id) => setDeleteConfirm(clubs.find(c=>c.id===id));
  const confirmDelete = () => {
    setClubs(prev=>prev.filter(c=>c.id!==deleteConfirm.id));
    showToast(`"${deleteConfirm.name}" deleted`,"error");
    setDeleteConfirm(null);
  };

  const toggleSort = (key) => { if(sortKey===key) setSortAsc(a=>!a); else{setSortKey(key);setSortAsc(true);} };

  const filtered = useMemo(()=>{
    let list=clubs;
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
    <div style={{ minHeight:"100vh", fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", background:"linear-gradient(135deg,#fdf2f8 0%,#faf5ff 40%,#eef2ff 100%)", boxSizing:"border-box" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box}
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .row-anim { animation: fadeUp .2s ease both; }
        .es-row:hover td { background:#fdf4ff!important; }
        .sort-th { cursor:pointer; }
        .sort-th:hover { color:#7c3aed!important; }
        .action-btn { background:transparent; border:none; cursor:pointer; width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#d8b4fe; transition:background .15s,color .15s; }
        .action-btn:hover { background:#faf5ff; color:#a855f7; }
        .action-btn.deact:hover { background:#fff1f2; color:#f43f5e; }
        .action-btn.react:hover { background:#f0fdf4; color:#10b981; }
        .action-btn.del:hover   { background:#fff1f2; color:#f43f5e; }
        ::-webkit-scrollbar{width:4px;height:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:#e9d5ff;border-radius:4px}
      `}</style>

      <div style={{ padding:"20px 20px 24px", width:"100%" }}>

        {/* ── HEADER ── */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20, gap:12, flexWrap:"wrap" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:4 }}>
              <div style={{ width:26, height:26, borderRadius:8, background:ES_GRAD, color:"white", fontSize:10, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>ES</div>
              <span style={{ fontSize:11, fontWeight:600, color:"#a855f7" }}>EventSphere</span>
            </div>
            <h1 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:0, lineHeight:1.2 }}>View Clubs</h1>
            <p style={{ fontSize:12, color:"#9ca3af", margin:"3px 0 0" }}>Manage and monitor all clubs in the system</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px", borderRadius:12, background:"white", border:"1px solid #f3e8ff", color:"#a855f7", fontSize:12, fontWeight:600, flexShrink:0, boxShadow:"0 1px 4px rgba(168,85,247,0.08)" }}>
            <Users style={{ width:14, height:14, color:"#ec4899" }}/>
            {clubs.length} clubs available
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
          {[
            { label:"Total Clubs", value:stats.total,    icon:Users,       grad:"linear-gradient(135deg,#6366f1,#818cf8)" },
            { label:"Active",      value:stats.active,   icon:CheckCircle, grad:"linear-gradient(135deg,#10b981,#34d399)" },
            { label:"Inactive",    value:stats.inactive, icon:XCircle,     grad:"linear-gradient(135deg,#f43f5e,#fb7185)" },
            { label:"Total Events",value:stats.events,   icon:TrendingUp,  grad:ES_GRAD },
          ].map(({ label, value, icon:Icon, grad }, i) => (
            <div key={label} className="row-anim" style={{ background:"white", borderRadius:16, padding:"14px 16px", boxShadow:"0 1px 8px rgba(168,85,247,0.07)", border:"1px solid rgba(236,72,153,0.1)", display:"flex", alignItems:"center", gap:12, animationDelay:`${i*50}ms` }}>
              <div style={{ width:38, height:38, borderRadius:12, background:grad, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 4px 12px rgba(168,85,247,0.2)" }}>
                <Icon style={{ width:18, height:18, color:"white" }}/>
              </div>
              <div>
                <div style={{ fontSize:22, fontWeight:800, color:"#111827", lineHeight:1 }}>{value}</div>
                <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── TABLE CARD ── */}
        <div style={{ background:"white", borderRadius:18, boxShadow:"0 1px 8px rgba(168,85,247,0.07)", border:"1px solid rgba(236,72,153,0.1)", overflow:"hidden" }}>

          {/* Toolbar */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", borderBottom:"1px solid #fdf4ff", gap:12, flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:3, borderRadius:12, padding:4, background:"#faf5ff" }}>
              {TABS.map(({ key, label, count }) => (
                <button key={key} onClick={() => setFilter(key)}
                  style={{ padding:"6px 12px", borderRadius:9, border:"none", fontSize:11, fontWeight: filter===key ? 700 : 500, color: filter===key ? "#7c3aed" : "#9ca3af", background: filter===key ? "white" : "transparent", cursor:"pointer", boxShadow: filter===key ? "0 1px 4px rgba(168,85,247,0.15)" : "none", transition:"all .15s", whiteSpace:"nowrap", fontFamily:"inherit" }}>
                  {label}
                  <span style={{ marginLeft:5, padding:"1px 6px", borderRadius:6, fontSize:11, background: filter===key ? "#f3e8ff" : "transparent", color: filter===key ? "#7c3aed" : "inherit" }}>{count}</span>
                </button>
              ))}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, background:"white", border:"1px solid #e9d5ff", borderRadius:12, padding:"7px 12px", minWidth:190, flex:"0 1 200px" }}>
                <Search style={{ width:14, height:14, color:"#a855f7", flexShrink:0 }}/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clubs…"
                  style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:"#374151", width:"100%", fontFamily:"inherit" }}/>
                {search && <button onClick={()=>setSearch("")} style={{ border:"none", background:"none", cursor:"pointer", padding:0, display:"flex" }}><X style={{ width:12, height:12, color:"#9ca3af" }}/></button>}
              </div>
              <button style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:12, border:"none", background:ES_GRAD, color:"white", fontSize:12, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 14px rgba(168,85,247,0.3)", whiteSpace:"nowrap", fontFamily:"inherit" }}>
                <Plus style={{ width:14, height:14 }}/> Create Club
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#fdf4ff", borderBottom:"1px solid #f3e8ff" }}>
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
                      style={{ textAlign:"left", padding:"10px 14px", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".07em", color:"#a855f7", whiteSpace:"nowrap", userSelect:"none" }}>
                      <span style={{ display:"flex", alignItems:"center", gap:4 }}>{label}{key && <SortIcon k={key}/>}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding:"48px 20px", textAlign:"center", color:"#9ca3af", fontSize:13 }}>
                    <Users style={{ width:32, height:32, margin:"0 auto 8px", opacity:.3, display:"block" }}/>No clubs found
                  </td></tr>
                ) : filtered.map((club, i) => {
                  const isActive = club.status === "active";
                  const pill = CATEGORY_PILL[club.category] || { bg:"#f3f4f6", color:"#374151" };
                  return (
                    <tr key={club.id} className="row-anim es-row" style={{ animationDelay:`${i*35}ms`, borderBottom:"1px solid #fdf4ff" }}>

                      {/* Club name */}
                      <td style={{ padding:"10px 14px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:32, height:32, borderRadius:9, background:AVATAR_PALETTE[i%AVATAR_PALETTE.length], color:"white", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 2px 8px rgba(168,85,247,0.25)" }}>
                            {club.name.trim()[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize:12, fontWeight:700, color:"#111827" }}>{club.name}</div>
                            <div style={{ fontSize:10, color:"#9ca3af" }}>{new Date(club.created).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
                          </div>
                        </div>
                      </td>

                      {/* Organizer */}
                      <td style={{ padding:"10px 14px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:26, height:26, borderRadius:"50%", background:AVATAR_PALETTE[(i+3)%AVATAR_PALETTE.length], color:"white", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            {initials(club.organizer)}
                          </div>
                          <span style={{ fontSize:12, color:"#374151", fontWeight:500, whiteSpace:"nowrap" }}>{club.organizer}</span>
                        </div>
                      </td>

                      {/* Members */}
                      <td style={{ padding:"10px 14px" }}>
                        <div style={{ display:"flex", marginBottom:3 }}>
                          {club.members.slice(0,3).map((m,j) => (
                            <div key={j} title={m} style={{ width:24, height:24, borderRadius:"50%", background:getColor(j), color:"white", fontSize:9, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", outline:"2px solid white", marginLeft: j>0 ? -6 : 0, flexShrink:0 }}>
                              {initials(m)}
                            </div>
                          ))}
                          {club.members.length > 3 && (
                            <div style={{ width:24, height:24, borderRadius:"50%", background:"#f3e8ff", fontSize:9, fontWeight:600, color:"#a855f7", display:"flex", alignItems:"center", justifyContent:"center", outline:"2px solid white", marginLeft:-6 }}>
                              +{club.members.length-3}
                            </div>
                          )}
                        </div>
                        <div style={{ fontSize:10, color:"#9ca3af" }}>{club.members.length} member{club.members.length!==1?"s":""}</div>
                      </td>

                      {/* Events */}
                      <td style={{ padding:"10px 14px" }}>
                        <span style={{ fontSize:13, fontWeight:700, color:"#111827" }}>{club.events}</span>
                        <span style={{ fontSize:11, color:"#9ca3af", marginLeft:4 }}>events</span>
                      </td>

                      {/* Category */}
                      <td style={{ padding:"10px 14px" }}>
                        <span style={{ display:"inline-block", padding:"4px 10px", borderRadius:999, fontSize:11, fontWeight:600, background:pill.bg, color:pill.color }}>
                          {club.category}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding:"10px 14px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:2 }}>
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
          <div style={{ padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:"1px solid #fdf4ff", background:"#fdf9ff" }}>
            <span style={{ fontSize:11, color:"#9ca3af" }}>
              Showing <b style={{color:"#374151"}}>{filtered.length}</b> of <b style={{color:"#374151"}}>{clubs.length}</b> clubs
            </span>
            <button style={{ width:26, height:26, borderRadius:8, background:ES_GRAD, border:"none", color:"white", fontSize:11, fontWeight:700, cursor:"pointer" }}>1</button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <ConfirmModal club={modal.club} action={modal.action} onCancel={()=>setModal(null)} onConfirm={()=>{handleToggle(modal.club.id);setModal(null);}}/>
      )}

      {deleteConfirm && (
        <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 16px" }}>
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)", backdropFilter:"blur(4px)" }} onClick={()=>setDeleteConfirm(null)}/>
          <div style={{ position:"relative", background:"white", borderRadius:20, boxShadow:"0 20px 60px rgba(0,0,0,0.2)", width:"100%", maxWidth:340, padding:24, animation:"modalIn .22s ease both" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"#fee2e2", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Trash2 style={{ width:20, height:20, color:"#ef4444" }}/>
              </div>
              <div style={{ fontSize:15, fontWeight:800, color:"#111827" }}>Delete Club?</div>
            </div>
            <p style={{ fontSize:13, color:"#6b7280", marginBottom:20, lineHeight:1.5 }}>
              Are you sure you want to delete <b style={{color:"#111827"}}>"{deleteConfirm.name}"</b>? This action cannot be undone.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setDeleteConfirm(null)} style={{ flex:1, padding:"10px 0", borderRadius:12, border:"1px solid #e5e7eb", fontSize:13, fontWeight:600, color:"#4b5563", background:"white", cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
              <button onClick={confirmDelete} style={{ flex:1, padding:"10px 0", borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"white", background:"#ef4444", cursor:"pointer", fontFamily:"inherit" }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <ClubDrawer club={drawer} onClose={()=>setDrawer(null)} onToggleStatus={handleToggle}/>

      {toast && (
        <div style={{ position:"fixed", bottom:20, right:20, zIndex:50, display:"flex", alignItems:"center", gap:10, padding:"10px 16px", borderRadius:14, boxShadow:"0 8px 24px rgba(168,85,247,0.3)", fontSize:13, fontWeight:600, color:"white", animation:"toastIn .3s ease both",
          background: toast.type==="success" ? ES_GRAD : toast.type==="warn" ? "linear-gradient(135deg,#f59e0b,#d97706)" : "linear-gradient(135deg,#ef4444,#dc2626)" }}>
          {toast.type==="success" ? <CheckCircle style={{width:15,height:15}}/> : toast.type==="warn" ? <XCircle style={{width:15,height:15}}/> : <Trash2 style={{width:15,height:15}}/>}
          {toast.msg}
        </div>
      )}
    </div>
  );
}