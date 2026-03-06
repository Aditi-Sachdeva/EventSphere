// import { useState, useMemo } from "react";
// import {
//   Search, X, Eye, CheckCircle2, XCircle, Clock, Calendar,
//   Users, TrendingUp, ChevronUp, ChevronDown, Trash2,
//   MapPin, Tag, RefreshCw, Filter, Star, Zap
// } from "lucide-react";

// /* ─────────────── SEED DATA ─────────────── */
// const SEED_EVENTS = [
//   { id:1,  name:"Hackathon 2024",      club:"Coding Club",      organizer:"Rahul Sharma",    date:"2024-05-12", seats:{ filled:30, total:50 }, status:"pending",  category:"Technology", location:"Hall A",      description:"A 24-hour coding marathon where participants build innovative solutions to real-world problems." },
//   { id:2,  name:"Dance Fest",          club:"Dance Club",        organizer:"Priya Gupta",     date:"2024-05-15", seats:{ filled:20, total:40 }, status:"approved", category:"Arts",       location:"Auditorium",  description:"Annual dance festival featuring classical, contemporary, and folk performances." },
//   { id:3,  name:"Music Night",         club:"Music Club",        organizer:"Aman Singh",      date:"2024-05-18", seats:{ filled:10, total:30 }, status:"rejected", category:"Arts",       location:"Open Air",    description:"An evening of live music performances spanning multiple genres." },
//   { id:4,  name:"Photography Walk",    club:"Photography Guild", organizer:"Neha Joshi",      date:"2024-05-22", seats:{ filled:12, total:20 }, status:"pending",  category:"Arts",       location:"Campus",      description:"Guided photography walk to explore architecture and nature on campus." },
//   { id:5,  name:"Chess Tournament",    club:"Chess Society",     organizer:"Dev Kapoor",      date:"2024-05-25", seats:{ filled:32, total:32 }, status:"approved", category:"Sports",     location:"Room 204",    description:"Inter-college chess championship with prizes for top 3 winners." },
//   { id:6,  name:"Debate Championship", club:"Debate Forum",      organizer:"Priya Nair",      date:"2024-06-02", seats:{ filled:18, total:60 }, status:"pending",  category:"Academic",   location:"Seminar Hall","description":"Annual debate competition on topics of national and international importance." },
//   { id:7,  name:"Film Screening",      club:"Film Appreciation", organizer:"Tanya Gupta",     date:"2024-06-08", seats:{ filled:45, total:60 }, status:"approved", category:"Arts",       location:"Mini Theater","description":"Curated selection of award-winning international short films followed by discussion." },
//   { id:8,  name:"Robotics Expo",       club:"Robotics Lab",      organizer:"Amit Chatterjee", date:"2024-06-15", seats:{ filled:8,  total:40 }, status:"rejected", category:"Technology", location:"Lab Complex",  description:"Showcase of student-built robots and automation projects." },
// ];

// const CATEGORY_COLORS = {
//   Technology: { bg:"bg-sky-100",     text:"text-sky-700",     dot:"bg-sky-500"     },
//   Arts:       { bg:"bg-pink-100",    text:"text-pink-700",    dot:"bg-pink-500"    },
//   Sports:     { bg:"bg-emerald-100", text:"text-emerald-700", dot:"bg-emerald-500" },
//   Academic:   { bg:"bg-amber-100",   text:"text-amber-700",   dot:"bg-amber-500"   },
// };

// const STATUS_CONFIG = {
//   pending:  { bg:"bg-amber-50",   text:"text-amber-700",  border:"border-amber-200",  dot:"bg-amber-400",  label:"Pending"  },
//   approved: { bg:"bg-emerald-50", text:"text-emerald-700",border:"border-emerald-200",dot:"bg-emerald-500",label:"Approved" },
//   rejected: { bg:"bg-rose-50",    text:"text-rose-700",   border:"border-rose-200",   dot:"bg-rose-500",   label:"Rejected" },
// };

// const AVATAR_GRADIENTS = [
//   "from-orange-400 to-rose-500","from-sky-400 to-blue-600","from-emerald-400 to-teal-600",
//   "from-violet-400 to-purple-600","from-amber-400 to-orange-500","from-pink-400 to-rose-600",
//   "from-cyan-400 to-sky-600","from-indigo-400 to-blue-600",
// ];

// function initials(name) {
//   return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
// }

// function Avatar({ name, idx, size = "sm" }) {
//   const sz = size === "lg" ? "w-11 h-11 text-sm" : "w-7 h-7 text-xs";
//   return (
//     <div className={`${sz} rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length]} text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm`}>
//       {initials(name)}
//     </div>
//   );
// }

// function SeatsBar({ filled, total }) {
//   const pct = Math.round((filled / total) * 100);
//   const color = pct >= 90 ? "bg-rose-500" : pct >= 60 ? "bg-amber-400" : "bg-emerald-500";
//   return (
//     <div>
//       <div className="flex items-center justify-between mb-1">
//         <span className="text-xs font-bold text-slate-700">{filled}<span className="text-slate-400 font-normal">/{total}</span></span>
//         <span className="text-xs text-slate-400">{pct}%</span>
//       </div>
//       <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
//         <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
//       </div>
//     </div>
//   );
// }

// /* ─────────────── CONFIRM MODAL ─────────────── */
// function ConfirmModal({ event, action, onConfirm, onCancel }) {
//   const cfg = {
//     approve: { icon: CheckCircle2, iconBg:"bg-emerald-100", iconColor:"text-emerald-600", btnBg:"bg-emerald-600 hover:bg-emerald-700", label:"Approve Event", msg:`"${event?.name}" will be published and members can register.` },
//     reject:  { icon: XCircle,      iconBg:"bg-rose-100",    iconColor:"text-rose-600",    btnBg:"bg-rose-600 hover:bg-rose-700",       label:"Reject Event",  msg:`"${event?.name}" will be marked as rejected and hidden from listings.` },
//     delete:  { icon: Trash2,       iconBg:"bg-slate-100",   iconColor:"text-slate-600",   btnBg:"bg-slate-700 hover:bg-slate-800",     label:"Delete Event",  msg:`This will permanently delete "${event?.name}". This cannot be undone.` },
//   }[action];
//   if (!cfg) return null;
//   const Icon = cfg.icon;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
//       <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-modal">
//         <div className={`w-12 h-12 rounded-2xl ${cfg.iconBg} flex items-center justify-center mb-4`}>
//           <Icon className={`w-6 h-6 ${cfg.iconColor}`} />
//         </div>
//         <h3 className="text-base font-bold text-slate-900 mb-1">{cfg.label}</h3>
//         <p className="text-sm text-slate-500 mb-6">{cfg.msg}</p>
//         <div className="flex gap-3">
//           <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
//           <button onClick={onConfirm} className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 ${cfg.btnBg}`}>{cfg.label}</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─────────────── DETAIL DRAWER ─────────────── */
// function EventDrawer({ event, onClose, onApprove, onReject }) {
//   if (!event) return null;
//   const sc = STATUS_CONFIG[event.status];
//   const cat = CATEGORY_COLORS[event.category];
//   const isPending = event.status === "pending";
//   const pct = Math.round((event.seats.filled / event.seats.total) * 100);

//   return (
//     <div className="fixed inset-0 z-40 flex justify-end">
//       <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative bg-white w-full max-w-md shadow-2xl flex flex-col animate-drawer overflow-hidden">

//         {/* Banner */}
//         <div className="h-28 bg-gradient-to-r from-indigo-600 to-violet-600 flex-shrink-0 relative p-6">
//           <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center">
//             <X className="w-4 h-4 text-white" />
//           </button>
//           <div className="absolute -bottom-5 left-6">
//             <Avatar name={event.name} idx={event.id} size="lg" />
//           </div>
//         </div>

//         <div className="pt-9 px-6 pb-6 flex-1 overflow-y-auto space-y-5">
//           <div>
//             <div className="flex items-start justify-between gap-3">
//               <h2 className="text-xl font-bold text-slate-900">{event.name}</h2>
//               <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${sc.bg} ${sc.text} ${sc.border} flex-shrink-0`}>
//                 {sc.label}
//               </span>
//             </div>
//             <p className="text-sm text-slate-500 mt-2 leading-relaxed">{event.description}</p>
//           </div>

//           {/* Meta grid */}
//           <div className="grid grid-cols-2 gap-3">
//             {[
//               { icon: Calendar, label:"Date",     value: new Date(event.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) },
//               { icon: MapPin,   label:"Location",  value: event.location },
//               { icon: Users,    label:"Club",      value: event.club },
//               { icon: Tag,      label:"Category",  value: event.category },
//             ].map(({ icon: Icon, label, value }) => (
//               <div key={label} className="bg-slate-50 rounded-xl p-3">
//                 <div className="flex items-center gap-1.5 mb-1">
//                   <Icon className="w-3.5 h-3.5 text-slate-400" />
//                   <span className="text-xs text-slate-400 font-medium">{label}</span>
//                 </div>
//                 <span className="text-sm font-semibold text-slate-800">{value}</span>
//               </div>
//             ))}
//           </div>

//           {/* Seats */}
//           <div className="bg-slate-50 rounded-xl p-4">
//             <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Seat Capacity</div>
//             <div className="flex items-end justify-between mb-2">
//               <span className="text-3xl font-extrabold text-slate-900">{event.seats.filled}</span>
//               <span className="text-sm text-slate-400 mb-1">of {event.seats.total} seats filled</span>
//             </div>
//             <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
//               <div className={`h-full rounded-full ${pct>=90?"bg-rose-500":pct>=60?"bg-amber-400":"bg-emerald-500"}`} style={{width:`${pct}%`}} />
//             </div>
//           </div>

//           {/* Organizer */}
//           <div>
//             <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Organizer</div>
//             <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
//               <Avatar name={event.organizer} idx={event.id + 3} />
//               <span className="text-sm font-semibold text-slate-800">{event.organizer}</span>
//             </div>
//           </div>

//           {/* Actions */}
//           {isPending && (
//             <div className="flex gap-3 pt-1">
//               <button onClick={() => { onApprove(event.id); onClose(); }}
//                 className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2">
//                 <CheckCircle2 className="w-4 h-4" /> Approve
//               </button>
//               <button onClick={() => { onReject(event.id); onClose(); }}
//                 className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2">
//                 <XCircle className="w-4 h-4" /> Reject
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ─────────────── MAIN PAGE ─────────────── */
// export default function ViewEvents() {
//   const [events,   setEvents]   = useState(SEED_EVENTS);
//   const [filter,   setFilter]   = useState("all");
//   const [search,   setSearch]   = useState("");
//   const [sortKey,  setSortKey]  = useState("date");
//   const [sortAsc,  setSortAsc]  = useState(true);
//   const [modal,    setModal]    = useState(null);
//   const [drawer,   setDrawer]   = useState(null);
//   const [toast,    setToast]    = useState(null);

//   const showToast = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const handleApprove = (id) => {
//     const ev = events.find(e => e.id === id);
//     setEvents(prev => prev.map(e => e.id === id ? { ...e, status:"approved" } : e));
//     showToast(`"${ev.name}" approved`, "success");
//   };

//   const handleReject = (id) => {
//     const ev = events.find(e => e.id === id);
//     setEvents(prev => prev.map(e => e.id === id ? { ...e, status:"rejected" } : e));
//     showToast(`"${ev.name}" rejected`, "warn");
//   };

//   const handleDelete = (id) => {
//     const ev = events.find(e => e.id === id);
//     setEvents(prev => prev.filter(e => e.id !== id));
//     showToast(`"${ev.name}" deleted`, "error");
//     setModal(null);
//   };

//   const toggleSort = (key) => {
//     if (sortKey === key) setSortAsc(a => !a);
//     else { setSortKey(key); setSortAsc(true); }
//   };

//   const filtered = useMemo(() => {
//     let list = events;
//     if (filter !== "all") list = list.filter(e => e.status === filter);
//     if (search.trim()) {
//       const q = search.toLowerCase();
//       list = list.filter(e =>
//         e.name.toLowerCase().includes(q) ||
//         e.club.toLowerCase().includes(q) ||
//         e.organizer.toLowerCase().includes(q) ||
//         e.category.toLowerCase().includes(q)
//       );
//     }
//     return [...list].sort((a, b) => {
//       const va = sortKey === "seats" ? a.seats.filled : a[sortKey];
//       const vb = sortKey === "seats" ? b.seats.filled : b[sortKey];
//       return sortAsc
//         ? (typeof va === "string" ? va.localeCompare(vb) : va - vb)
//         : (typeof va === "string" ? vb.localeCompare(va) : vb - va);
//     });
//   }, [events, filter, search, sortKey, sortAsc]);

//   const stats = {
//     total:    events.length,
//     pending:  events.filter(e => e.status === "pending").length,
//     approved: events.filter(e => e.status === "approved").length,
//     rejected: events.filter(e => e.status === "rejected").length,
//   };

//   const SortIcon = ({ k }) => sortKey === k
//     ? (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
//     : <ChevronDown className="w-3 h-3 opacity-25" />;

//   const TABS = [
//     { key:"all",      label:"All",      count: stats.total    },
//     { key:"pending",  label:"Pending",  count: stats.pending  },
//     { key:"approved", label:"Approved", count: stats.approved },
//     { key:"rejected", label:"Rejected", count: stats.rejected },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
//         @keyframes fadeUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
//         @keyframes slideIn { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
//         @keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
//         @keyframes toastIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
//         .row-enter      { animation: fadeUp  0.22s ease both; }
//         .animate-drawer { animation: slideIn 0.28s cubic-bezier(.22,1,.36,1) both; }
//         .animate-modal  { animation: modalIn 0.22s ease both; }
//         .toast-anim     { animation: toastIn 0.3s ease both; }
//         tbody tr:hover td { background: #f8fafc; }
//       `}</style>

//       <div className="px-8 py-7 w-full">

//         {/* Title row */}
//         <div className="flex items-center justify-between mb-7">
//           <div>
//             <h1 className="text-2xl font-extrabold text-slate-900">View Events</h1>
//             <p className="text-sm text-slate-500 mt-0.5">Manage and moderate all club events</p>
//           </div>
//           {stats.pending > 0 && (
//             <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-2 text-sm font-semibold">
//               <Zap className="w-4 h-4" />
//               {stats.pending} event{stats.pending > 1 ? "s" : ""} awaiting review
//             </div>
//           )}
//         </div>

//         {/* Stat Cards */}
//         <div className="grid grid-cols-4 gap-4 mb-7">
//           {[
//             { label:"Total Events",   value: stats.total,    icon: Calendar,    grad:"from-indigo-500 to-violet-600", shadow:"shadow-indigo-200" },
//             { label:"Pending Review", value: stats.pending,  icon: Clock,       grad:"from-amber-400 to-orange-500",  shadow:"shadow-amber-200"  },
//             { label:"Approved",       value: stats.approved, icon: CheckCircle2,grad:"from-emerald-500 to-teal-600",  shadow:"shadow-emerald-200"},
//             { label:"Rejected",       value: stats.rejected, icon: XCircle,     grad:"from-rose-500 to-pink-600",     shadow:"shadow-rose-200"   },
//           ].map(({ label, value, icon: Icon, grad, shadow }, i) => (
//             <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm row-enter flex items-center gap-4"
//               style={{ animationDelay:`${i*60}ms` }}>
//               <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-lg ${shadow}`}>
//                 <Icon className="w-5 h-5 text-white" />
//               </div>
//               <div>
//                 <div className="text-2xl font-extrabold text-slate-900">{value}</div>
//                 <div className="text-xs text-slate-500 font-medium">{label}</div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Main table card */}
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

//           {/* Toolbar */}
//           <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 gap-4 flex-wrap">
//             {/* Filter tabs */}
//             <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
//               {TABS.map(({ key, label, count }) => (
//                 <button key={key} onClick={() => setFilter(key)}
//                   className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
//                     filter === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
//                   }`}>
//                   {label}
//                   <span className={`ml-1.5 px-1.5 py-0.5 rounded-md text-xs ${
//                     filter === key
//                       ? key === "pending"  ? "bg-amber-100 text-amber-700"
//                       : key === "approved" ? "bg-emerald-100 text-emerald-700"
//                       : key === "rejected" ? "bg-rose-100 text-rose-700"
//                       : "bg-slate-100 text-slate-600"
//                       : "bg-transparent"
//                   }`}>{count}</span>
//                 </button>
//               ))}
//             </div>

//             {/* Search */}
//             <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 w-60 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
//               <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
//               <input value={search} onChange={e => setSearch(e.target.value)}
//                 placeholder="Search events…"
//                 className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400" />
//               {search && <button onClick={() => setSearch("")}><X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" /></button>}
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-slate-50 border-b border-slate-100">
//                   {[
//                     { key:"name",      label:"Event"      },
//                     { key:"club",      label:"Club"       },
//                     { key:"organizer", label:"Organizer"  },
//                     { key:"date",      label:"Date"       },
//                     { key:"seats",     label:"Seats"      },
//                     { key:"category",  label:"Category"   },
//                     { key:"status",    label:"Status"     },
//                     { key:null,        label:"Actions"    },
//                   ].map(({ key, label }) => (
//                     <th key={label} onClick={() => key && toggleSort(key)}
//                       className={`text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider select-none whitespace-nowrap ${key ? "cursor-pointer hover:text-slate-700" : ""}`}>
//                       <span className="flex items-center gap-1">{label}{key && <SortIcon k={key} />}</span>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {filtered.length === 0 ? (
//                   <tr>
//                     <td colSpan={8} className="py-16 text-center text-slate-400 text-sm">
//                       <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
//                       No events found
//                     </td>
//                   </tr>
//                 ) : filtered.map((ev, i) => {
//                   const sc  = STATUS_CONFIG[ev.status];
//                   const cat = CATEGORY_COLORS[ev.category];
//                   return (
//                     <tr key={ev.id} className="row-enter" style={{ animationDelay:`${i*40}ms` }}>

//                       {/* Event name */}
//                       <td className="px-5 py-4">
//                         <div className="flex items-center gap-3">
//                           <Avatar name={ev.name} idx={ev.id} />
//                           <div>
//                             <div className="text-sm font-bold text-slate-900 whitespace-nowrap">{ev.name}</div>
//                             <div className="text-xs text-slate-400 flex items-center gap-1">
//                               <MapPin className="w-3 h-3" />{ev.location}
//                             </div>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Club */}
//                       <td className="px-5 py-4">
//                         <span className="text-sm text-slate-700 font-medium whitespace-nowrap">{ev.club}</span>
//                       </td>

//                       {/* Organizer */}
//                       <td className="px-5 py-4">
//                         <div className="flex items-center gap-2 whitespace-nowrap">
//                           <Avatar name={ev.organizer} idx={ev.id + 2} />
//                           <span className="text-sm text-slate-700 font-medium">{ev.organizer}</span>
//                         </div>
//                       </td>

//                       {/* Date */}
//                       <td className="px-5 py-4 whitespace-nowrap">
//                         <div className="text-sm font-semibold text-slate-800">
//                           {new Date(ev.date).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}
//                         </div>
//                         <div className="text-xs text-slate-400">
//                           {new Date(ev.date).getFullYear()}
//                         </div>
//                       </td>

//                       {/* Seats */}
//                       <td className="px-5 py-4 min-w-28">
//                         <SeatsBar filled={ev.seats.filled} total={ev.seats.total} />
//                       </td>

//                       {/* Category */}
//                       <td className="px-5 py-4">
//                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cat.bg} ${cat.text}`}>
//                           <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
//                           {ev.category}
//                         </span>
//                       </td>

//                       {/* Status */}
//                       <td className="px-5 py-4">
//                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${sc.bg} ${sc.text} ${sc.border}`}>
//                           <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
//                           {sc.label}
//                         </span>
//                       </td>

//                       {/* Actions */}
//                       <td className="px-5 py-4">
//                         <div className="flex items-center gap-1">
//                           {/* View */}
//                           <button onClick={() => setDrawer(ev)} title="View details"
//                             className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors">
//                             <Eye className="w-4 h-4" />
//                           </button>

//                           {/* Approve — only for pending */}
//                           {ev.status === "pending" && (
//                             <button onClick={() => setModal({ event: ev, action:"approve" })} title="Approve"
//                               className="w-8 h-8 rounded-lg hover:bg-emerald-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors">
//                               <CheckCircle2 className="w-4 h-4" />
//                             </button>
//                           )}

//                           {/* Reject — only for pending */}
//                           {ev.status === "pending" && (
//                             <button onClick={() => setModal({ event: ev, action:"reject" })} title="Reject"
//                               className="w-8 h-8 rounded-lg hover:bg-rose-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">
//                               <XCircle className="w-4 h-4" />
//                             </button>
//                           )}

//                           {/* Re-review approved/rejected back to pending */}
//                           {ev.status !== "pending" && (
//                             <button onClick={() => { setEvents(prev => prev.map(e => e.id === ev.id ? {...e, status:"pending"} : e)); showToast(`"${ev.name}" moved back to review`, "info"); }} title="Move to pending"
//                               className="w-8 h-8 rounded-lg hover:bg-amber-50 flex items-center justify-center text-slate-400 hover:text-amber-500 transition-colors">
//                               <RefreshCw className="w-4 h-4" />
//                             </button>
//                           )}

//                           {/* Delete */}
//                           <button onClick={() => setModal({ event: ev, action:"delete" })} title="Delete"
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

//           {/* Footer */}
//           <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
//             <span className="text-xs text-slate-500 font-medium">
//               Showing <span className="text-slate-800 font-bold">{filtered.length}</span> of <span className="text-slate-800 font-bold">{events.length}</span> events
//             </span>
//             <button className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-xs font-bold">1</button>
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       {modal && (
//         <ConfirmModal
//           event={modal.event}
//           action={modal.action}
//           onCancel={() => setModal(null)}
//           onConfirm={() => {
//             if (modal.action === "approve") handleApprove(modal.event.id);
//             else if (modal.action === "reject") handleReject(modal.event.id);
//             else if (modal.action === "delete") handleDelete(modal.event.id);
//             setModal(null);
//           }}
//         />
//       )}

//       <EventDrawer
//         event={drawer}
//         onClose={() => setDrawer(null)}
//         onApprove={handleApprove}
//         onReject={handleReject}
//       />

//       {/* Toast */}
//       {toast && (
//         <div className={`fixed bottom-6 right-6 z-50 toast-anim flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-bold ${
//           toast.type === "success" ? "bg-emerald-600 text-white" :
//           toast.type === "warn"    ? "bg-amber-500 text-white"   :
//           toast.type === "info"    ? "bg-indigo-600 text-white"  :
//                                      "bg-rose-600 text-white"}`}>
//           {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> :
//            toast.type === "warn"    ? <XCircle className="w-4 h-4" />      :
//            toast.type === "info"    ? <RefreshCw className="w-4 h-4" />    :
//                                       <Trash2 className="w-4 h-4" />}
//           {toast.msg}
//         </div>
//       )}
//     </div>
//   );
// }














































import { useState, useMemo } from "react";
import {
  Search, X, Eye, CheckCircle2, XCircle, Clock, Calendar,
  Users, ChevronUp, ChevronDown, Trash2,
  MapPin, Tag, RefreshCw, Star, Zap
} from "lucide-react";

const SEED_EVENTS = [
  { id:1,  name:"Hackathon 2024",      club:"Coding Club",       organizer:"Rahul Sharma",    date:"2024-05-12", seats:{ filled:30, total:50 }, status:"pending",  category:"Technology", location:"Hall A",       description:"A 24-hour coding marathon where participants build innovative solutions to real-world problems." },
  { id:2,  name:"Dance Fest",          club:"Dance Club",         organizer:"Priya Gupta",     date:"2024-05-15", seats:{ filled:20, total:40 }, status:"approved", category:"Arts",       location:"Auditorium",   description:"Annual dance festival featuring classical, contemporary, and folk performances." },
  { id:3,  name:"Music Night",         club:"Music Club",         organizer:"Aman Singh",      date:"2024-05-18", seats:{ filled:10, total:30 }, status:"rejected", category:"Arts",       location:"Open Air",     description:"An evening of live music performances spanning multiple genres." },
  { id:4,  name:"Photography Walk",    club:"Photography Guild",  organizer:"Neha Joshi",      date:"2024-05-22", seats:{ filled:12, total:20 }, status:"pending",  category:"Arts",       location:"Campus",       description:"Guided photography walk to explore architecture and nature on campus." },
  { id:5,  name:"Chess Tournament",    club:"Chess Society",      organizer:"Dev Kapoor",      date:"2024-05-25", seats:{ filled:32, total:32 }, status:"approved", category:"Sports",     location:"Room 204",     description:"Inter-college chess championship with prizes for top 3 winners." },
  { id:6,  name:"Debate Championship", club:"Debate Forum",       organizer:"Priya Nair",      date:"2024-06-02", seats:{ filled:18, total:60 }, status:"pending",  category:"Academic",   location:"Seminar Hall", description:"Annual debate competition on topics of national and international importance." },
  { id:7,  name:"Film Screening",      club:"Film Appreciation",  organizer:"Tanya Gupta",     date:"2024-06-08", seats:{ filled:45, total:60 }, status:"approved", category:"Arts",       location:"Mini Theater", description:"Curated selection of award-winning international short films followed by discussion." },
  { id:8,  name:"Robotics Expo",       club:"Robotics Lab",       organizer:"Amit Chatterjee", date:"2024-06-15", seats:{ filled:8,  total:40 }, status:"rejected", category:"Technology", location:"Lab Complex",  description:"Showcase of student-built robots and automation projects." },
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

const STATUS_CONFIG = {
  pending:  { bg:"#fffbeb", color:"#b45309", border:"#fde68a", dot:"#f59e0b", label:"Pending"  },
  approved: { bg:"#f0fdf4", color:"#15803d", border:"#bbf7d0", dot:"#10b981", label:"Approved" },
  rejected: { bg:"#fff1f2", color:"#be123c", border:"#fecdd3", dot:"#f43f5e", label:"Rejected" },
};

const AVATAR_PALETTE = [
  "#ec4899","#a855f7","#6366f1","#8b5cf6","#db2777",
  "#7c3aed","#4f46e5","#c026d3","#9333ea","#e11d48",
];

function initials(name) {
  if (!name) return "?";
  return name.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function SeatsBar({ filled, total }) {
  const pct = Math.round((filled / total) * 100);
  const barColor = pct >= 90 ? "#f43f5e" : pct >= 60 ? "#f59e0b" : "#10b981";
  return (
    <div style={{ minWidth: 80 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
        <span style={{ fontSize:11, fontWeight:700, color:"#374151" }}>{filled}<span style={{ color:"#9ca3af", fontWeight:400 }}>/{total}</span></span>
        <span style={{ fontSize:11, color:"#9ca3af" }}>{pct}%</span>
      </div>
      <div style={{ width:"100%", height:5, borderRadius:999, background:"#f3e8ff", overflow:"hidden" }}>
        <div style={{ height:"100%", borderRadius:999, width:`${pct}%`, background:barColor, transition:"width .3s" }}/>
      </div>
    </div>
  );
}

function ConfirmModal({ event, action, onConfirm, onCancel }) {
  const cfg = {
    approve: { icon:CheckCircle2, iconBg:"#f0fdf4", iconColor:"#10b981", btnBg:"linear-gradient(135deg,#10b981,#059669)", label:"Approve Event",  msg:`"${event?.name}" will be published.` },
    reject:  { icon:XCircle,      iconBg:"#fff1f2", iconColor:"#f43f5e", btnBg:"linear-gradient(135deg,#f43f5e,#e11d48)", label:"Reject Event",   msg:`"${event?.name}" will be marked as rejected.` },
    delete:  { icon:Trash2,       iconBg:"#fff1f2", iconColor:"#f43f5e", btnBg:"linear-gradient(135deg,#ef4444,#dc2626)", label:"Delete Event",   msg:`Permanently delete "${event?.name}"? Cannot be undone.` },
  }[action];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)", backdropFilter:"blur(4px)" }} onClick={onCancel}/>
      <div style={{ position:"relative", background:"white", borderRadius:20, boxShadow:"0 20px 60px rgba(0,0,0,0.2)", width:"100%", maxWidth:340, margin:"0 16px", padding:24, animation:"modalIn .22s ease both" }}>
        <div style={{ width:44, height:44, borderRadius:14, background:cfg.iconBg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
          <Icon style={{ width:22, height:22, color:cfg.iconColor }}/>
        </div>
        <div style={{ fontSize:15, fontWeight:800, color:"#111827", marginBottom:6 }}>{cfg.label}</div>
        <div style={{ fontSize:13, color:"#6b7280", marginBottom:22, lineHeight:1.5 }}>{cfg.msg}</div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:"10px 0", borderRadius:12, border:"1px solid #e5e7eb", fontSize:13, fontWeight:600, color:"#4b5563", background:"white", cursor:"pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, padding:"10px 0", borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"white", background:cfg.btnBg, cursor:"pointer", boxShadow:"0 4px 14px rgba(168,85,247,0.25)" }}>{cfg.label}</button>
        </div>
      </div>
    </div>
  );
}

function EventDrawer({ event, onClose, onApprove, onReject }) {
  if (!event) return null;
  const sc = STATUS_CONFIG[event.status];
  const catGrad = CATEGORY_GRAD[event.category] || ES_GRAD;
  const isPending = event.status === "pending";
  const pct = Math.round((event.seats.filled / event.seats.total) * 100);
  const barColor = pct >= 90 ? "#f43f5e" : pct >= 60 ? "#f59e0b" : "#10b981";

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
              <span style={{ width:6, height:6, borderRadius:"50%", background:sc.dot, display:"inline-block" }}/>{sc.label}
            </span>
            <span style={{ padding:"4px 10px", borderRadius:999, background:"rgba(255,255,255,0.18)", color:"white", fontSize:11, fontWeight:700 }}>{event.category}</span>
          </div>
          <div style={{ fontSize:18, fontWeight:800, color:"white", lineHeight:1.3, marginBottom:4 }}>{event.name}</div>
          <div style={{ display:"flex", alignItems:"center", gap:5, color:"rgba(255,255,255,0.75)", fontSize:12 }}>
            <MapPin style={{ width:12, height:12 }}/>{event.location}
          </div>
        </div>

        {/* Floating card */}
        <div style={{ padding:"0 16px", marginTop:-36, marginBottom:16, position:"relative", zIndex:10 }}>
          <div style={{ background:"white", borderRadius:16, boxShadow:"0 4px 20px rgba(168,85,247,0.15)", padding:14, border:"1px solid #f3e8ff" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, paddingBottom:12, borderBottom:"1px solid #faf5ff" }}>
              <div style={{ width:40, height:40, borderRadius:12, background:catGrad, color:"white", fontSize:15, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 4px 12px rgba(168,85,247,0.3)" }}>
                {event.name.trim()[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:"#111827", lineHeight:1.2 }}>{event.name}</div>
                <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{event.club}</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[
                { icon:Users, label:"Seats", value:`${event.seats.filled}/${event.seats.total}`, bg:"#faf5ff", grad:"linear-gradient(135deg,#a855f7,#6366f1)" },
                { icon:Calendar, label:"Date", value:new Date(event.date).toLocaleDateString("en-IN",{day:"numeric",month:"short"}), bg:"#fdf2f8", grad:"linear-gradient(135deg,#ec4899,#a855f7)" },
              ].map(({ icon:Icon, label, value, bg, grad }) => (
                <div key={label} style={{ borderRadius:12, padding:"10px", background:bg, display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:28, height:28, borderRadius:8, background:grad, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon style={{ width:14, height:14, color:"white" }}/>
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:800, color:"#111827", lineHeight:1 }}>{value}</div>
                    <div style={{ fontSize:10, color:"#9ca3af", marginTop:2 }}>{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex:1, padding:"0 16px 20px", display:"flex", flexDirection:"column", gap:16 }}>

          <div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
              <Star style={{ width:12, height:12, color:"#a855f7" }}/>
              <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:"#a855f7" }}>About</span>
            </div>
            <p style={{ fontSize:12, color:"#4b5563", lineHeight:1.6, margin:0 }}>{event.description}</p>
          </div>

          <div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
              <Tag style={{ width:12, height:12, color:"#ec4899" }}/>
              <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:"#ec4899" }}>Details</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {[
                { icon:MapPin, label:"Location", value: event.location },
                { icon:Users,  label:"Club",     value: event.club     },
                { icon:Tag,    label:"Category", value: event.category },
              ].map(({ icon:Icon, label, value }) => (
                <div key={label} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 10px", borderRadius:10, background:"#faf5ff" }}>
                  <div style={{ width:26, height:26, borderRadius:8, background:"linear-gradient(135deg,#a855f7,#6366f1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Icon style={{ width:12, height:12, color:"white" }}/>
                  </div>
                  <div>
                    <div style={{ fontSize:10, color:"#9ca3af" }}>{label}</div>
                    <div style={{ fontSize:12, fontWeight:600, color:"#1f2937" }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Capacity */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
              <Users style={{ width:12, height:12, color:"#a855f7" }}/>
              <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:"#a855f7" }}>Capacity</span>
              <span style={{ marginLeft:"auto", fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:999, background:"#fdf2f8", color:"#ec4899" }}>{pct}%</span>
            </div>
            <div style={{ padding:"10px 12px", borderRadius:12, background:"#faf5ff", border:"1px solid #e9d5ff" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:20, fontWeight:800, color:"#111827" }}>{event.seats.filled}</span>
                <span style={{ fontSize:11, color:"#9ca3af", alignSelf:"flex-end", marginBottom:2 }}>of {event.seats.total}</span>
              </div>
              <div style={{ height:6, borderRadius:999, background:"#e9d5ff", overflow:"hidden" }}>
                <div style={{ height:"100%", borderRadius:999, width:`${pct}%`, background:barColor }}/>
              </div>
            </div>
          </div>

          {/* Organizer */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
              <Star style={{ width:12, height:12, color:"#a855f7" }}/>
              <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:"#a855f7" }}>Organizer</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:12, background:"#faf5ff", border:"1px solid #e9d5ff" }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:ES_GRAD, color:"white", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 2px 8px rgba(168,85,247,0.4)" }}>
                {initials(event.organizer)}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"#1f2937" }}>{event.organizer}</div>
                <div style={{ fontSize:11, color:"#9ca3af" }}>Event Organizer</div>
              </div>
            </div>
          </div>

          <div style={{ borderTop:"1px solid #fdf4ff" }}/>

          {isPending ? (
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => { onApprove(event.id); onClose(); }}
                style={{ flex:1, padding:"11px 0", borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"white", background:"linear-gradient(135deg,#10b981,#059669)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, boxShadow:"0 4px 14px rgba(16,185,129,0.3)" }}>
                <CheckCircle2 style={{ width:15, height:15 }}/> Approve
              </button>
              <button onClick={() => { onReject(event.id); onClose(); }}
                style={{ flex:1, padding:"11px 0", borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"white", background:"linear-gradient(135deg,#f43f5e,#e11d48)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, boxShadow:"0 4px 14px rgba(244,63,94,0.3)" }}>
                <XCircle style={{ width:15, height:15 }}/> Reject
              </button>
            </div>
          ) : (
            <button onClick={onClose}
              style={{ width:"100%", padding:"11px 0", borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"white", background:ES_GRAD, cursor:"pointer", boxShadow:"0 4px 14px rgba(168,85,247,0.3)" }}>
              Close Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ViewEvents() {
  const [events,  setEvents]  = useState(SEED_EVENTS);
  const [filter,  setFilter]  = useState("all");
  const [search,  setSearch]  = useState("");
  const [sortKey, setSortKey] = useState("date");
  const [sortAsc, setSortAsc] = useState(true);
  const [modal,   setModal]   = useState(null);
  const [drawer,  setDrawer]  = useState(null);
  const [toast,   setToast]   = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const handleApprove = (id) => { const ev = events.find(e=>e.id===id); setEvents(p=>p.map(e=>e.id===id?{...e,status:"approved"}:e)); showToast(`"${ev.name}" approved`,"success"); };
  const handleReject  = (id) => { const ev = events.find(e=>e.id===id); setEvents(p=>p.map(e=>e.id===id?{...e,status:"rejected"}:e)); showToast(`"${ev.name}" rejected`,"warn"); };
  const handleDelete  = (id) => { const ev = events.find(e=>e.id===id); setEvents(p=>p.filter(e=>e.id!==id)); showToast(`"${ev.name}" deleted`,"error"); setModal(null); };

  const toggleSort = (key) => { if(sortKey===key) setSortAsc(a=>!a); else { setSortKey(key); setSortAsc(true); } };

  const filtered = useMemo(() => {
    let list = events;
    if (filter !== "all") list = list.filter(e => e.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q) || e.club.toLowerCase().includes(q) || e.organizer.toLowerCase().includes(q) || e.category.toLowerCase().includes(q));
    }
    return [...list].sort((a,b) => {
      const va = sortKey==="seats" ? a.seats.filled : a[sortKey];
      const vb = sortKey==="seats" ? b.seats.filled : b[sortKey];
      return sortAsc ? (typeof va==="string" ? va.localeCompare(vb) : va-vb) : (typeof va==="string" ? vb.localeCompare(va) : vb-va);
    });
  }, [events, filter, search, sortKey, sortAsc]);

  const stats = {
    total:    events.length,
    pending:  events.filter(e=>e.status==="pending").length,
    approved: events.filter(e=>e.status==="approved").length,
    rejected: events.filter(e=>e.status==="rejected").length,
  };

  const SortIcon = ({ k }) => sortKey===k ? (sortAsc ? <ChevronUp style={{width:11,height:11}}/> : <ChevronDown style={{width:11,height:11}}/>) : <ChevronDown style={{width:11,height:11,opacity:.25}}/>;

  const TABS = [
    { key:"all",      label:"All",      count:stats.total    },
    { key:"pending",  label:"Pending",  count:stats.pending  },
    { key:"approved", label:"Approved", count:stats.approved },
    { key:"rejected", label:"Rejected", count:stats.rejected },
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
        .action-btn.approve:hover { background:#f0fdf4; color:#10b981; }
        .action-btn.reject:hover  { background:#fff1f2; color:#f43f5e; }
        .action-btn.reset:hover   { background:#fffbeb; color:#f59e0b; }
        .action-btn.del:hover     { background:#fff1f2; color:#f43f5e; }
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
            <h1 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:0, lineHeight:1.2 }}>View Events</h1>
            <p style={{ fontSize:12, color:"#9ca3af", margin:"3px 0 0" }}>Manage and moderate all club events</p>
          </div>
          {stats.pending > 0 && (
            <div style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px", borderRadius:12, background:"#fffbeb", border:"1px solid #fde68a", color:"#b45309", fontSize:12, fontWeight:600, flexShrink:0 }}>
              <Zap style={{ width:14, height:14 }}/>
              {stats.pending} awaiting review
            </div>
          )}
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
          {[
            { label:"Total",    value:stats.total,    icon:Calendar,     grad:"linear-gradient(135deg,#6366f1,#818cf8)" },
            { label:"Pending",  value:stats.pending,  icon:Clock,        grad:"linear-gradient(135deg,#f59e0b,#f97316)" },
            { label:"Approved", value:stats.approved, icon:CheckCircle2, grad:"linear-gradient(135deg,#10b981,#34d399)" },
            { label:"Rejected", value:stats.rejected, icon:XCircle,      grad:ES_GRAD },
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
                  style={{ padding:"6px 12px", borderRadius:9, border:"none", fontSize:11, fontWeight: filter===key ? 700 : 500, color: filter===key ? "#7c3aed" : "#9ca3af", background: filter===key ? "white" : "transparent", cursor:"pointer", boxShadow: filter===key ? "0 1px 4px rgba(168,85,247,0.15)" : "none", transition:"all .15s", whiteSpace:"nowrap" }}>
                  {label}
                  <span style={{ marginLeft:5, padding:"1px 6px", borderRadius:6, fontSize:11, background: filter===key ? "#f3e8ff" : "transparent", color: filter===key ? "#7c3aed" : "inherit" }}>{count}</span>
                </button>
              ))}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, background:"white", border:"1px solid #e9d5ff", borderRadius:12, padding:"7px 12px", minWidth:200, flex:"0 1 220px" }}>
              <Search style={{ width:14, height:14, color:"#a855f7", flexShrink:0 }}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search events…"
                style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:"#374151", width:"100%", fontFamily:"inherit" }}/>
              {search && <button onClick={()=>setSearch("")} style={{ border:"none", background:"none", cursor:"pointer", padding:0, display:"flex" }}><X style={{ width:12, height:12, color:"#9ca3af" }}/></button>}
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#fdf4ff", borderBottom:"1px solid #f3e8ff" }}>
                  {[
                    { key:"name",      label:"Event"     },
                    { key:"club",      label:"Club"      },
                    { key:"organizer", label:"Organizer" },
                    { key:"date",      label:"Date"      },
                    { key:"seats",     label:"Seats"     },
                    { key:"category",  label:"Category"  },
                    { key:"status",    label:"Status"    },
                    { key:null,        label:"Actions"   },
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
                  <tr><td colSpan={8} style={{ padding:"48px 20px", textAlign:"center", color:"#9ca3af", fontSize:13 }}>
                    <Calendar style={{ width:32, height:32, margin:"0 auto 8px", opacity:.3, display:"block" }}/>No events found
                  </td></tr>
                ) : filtered.map((ev, i) => {
                  const sc   = STATUS_CONFIG[ev.status];
                  const pill = CATEGORY_PILL[ev.category] || { bg:"#f3f4f6", color:"#374151" };
                  return (
                    <tr key={ev.id} className="row-anim es-row" style={{ animationDelay:`${i*35}ms`, borderBottom:"1px solid #fdf4ff" }}>
                      <td style={{ padding:"10px 14px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:32, height:32, borderRadius:9, background:AVATAR_PALETTE[i%AVATAR_PALETTE.length], color:"white", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 2px 8px rgba(168,85,247,0.25)" }}>
                            {ev.name.trim()[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize:12, fontWeight:700, color:"#111827", whiteSpace:"nowrap" }}>{ev.name}</div>
                            <div style={{ fontSize:10, color:"#9ca3af", display:"flex", alignItems:"center", gap:3 }}>
                              <MapPin style={{ width:10, height:10 }}/>{ev.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"10px 14px" }}>
                        <span style={{ fontSize:12, color:"#374151", fontWeight:500, whiteSpace:"nowrap" }}>{ev.club}</span>
                      </td>
                      <td style={{ padding:"10px 14px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:7, whiteSpace:"nowrap" }}>
                          <div style={{ width:26, height:26, borderRadius:"50%", background:AVATAR_PALETTE[(i+3)%AVATAR_PALETTE.length], color:"white", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            {initials(ev.organizer)}
                          </div>
                          <span style={{ fontSize:12, color:"#374151", fontWeight:500 }}>{ev.organizer}</span>
                        </div>
                      </td>
                      <td style={{ padding:"10px 14px", whiteSpace:"nowrap" }}>
                        <div style={{ fontSize:12, fontWeight:600, color:"#1f2937" }}>{new Date(ev.date).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</div>
                        <div style={{ fontSize:10, color:"#9ca3af" }}>{new Date(ev.date).getFullYear()}</div>
                      </td>
                      <td style={{ padding:"10px 14px", minWidth:90 }}>
                        <SeatsBar filled={ev.seats.filled} total={ev.seats.total}/>
                      </td>
                      <td style={{ padding:"10px 14px" }}>
                        <span style={{ display:"inline-block", padding:"4px 10px", borderRadius:999, fontSize:11, fontWeight:600, background:pill.bg, color:pill.color }}>
                          {ev.category}
                        </span>
                      </td>
                      <td style={{ padding:"10px 14px" }}>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:999, fontSize:11, fontWeight:700, background:sc.bg, color:sc.color, border:`1px solid ${sc.border}` }}>
                          <span style={{ width:6, height:6, borderRadius:"50%", background:sc.dot, display:"inline-block", flexShrink:0 }}/>
                          {sc.label}
                        </span>
                      </td>
                      <td style={{ padding:"10px 14px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:2 }}>
                          <button className="action-btn" title="View details" onClick={()=>setDrawer(ev)}><Eye style={{width:14,height:14}}/></button>
                          {ev.status==="pending" && <>
                            <button className="action-btn approve" title="Approve" onClick={()=>setModal({event:ev,action:"approve"})}><CheckCircle2 style={{width:14,height:14}}/></button>
                            <button className="action-btn reject"  title="Reject"  onClick={()=>setModal({event:ev,action:"reject"})}><XCircle style={{width:14,height:14}}/></button>
                          </>}
                          {ev.status!=="pending" && (
                            <button className="action-btn reset" title="Move to pending" onClick={()=>{ setEvents(p=>p.map(e=>e.id===ev.id?{...e,status:"pending"}:e)); showToast(`"${ev.name}" moved to review`,"info"); }}><RefreshCw style={{width:14,height:14}}/></button>
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
          <div style={{ padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:"1px solid #fdf4ff", background:"#fdf9ff" }}>
            <span style={{ fontSize:11, color:"#9ca3af" }}>
              Showing <b style={{color:"#374151"}}>{filtered.length}</b> of <b style={{color:"#374151"}}>{events.length}</b> events
            </span>
            <button style={{ width:26, height:26, borderRadius:8, background:ES_GRAD, border:"none", color:"white", fontSize:11, fontWeight:700, cursor:"pointer" }}>1</button>
          </div>
        </div>
      </div>

      {modal && (
        <ConfirmModal
          event={modal.event} action={modal.action}
          onCancel={()=>setModal(null)}
          onConfirm={()=>{ if(modal.action==="approve") handleApprove(modal.event.id); else if(modal.action==="reject") handleReject(modal.event.id); else if(modal.action==="delete") handleDelete(modal.event.id); setModal(null); }}
        />
      )}

      <EventDrawer event={drawer} onClose={()=>setDrawer(null)} onApprove={handleApprove} onReject={handleReject}/>

      {toast && (
        <div style={{ position:"fixed", bottom:20, right:20, zIndex:50, display:"flex", alignItems:"center", gap:10, padding:"10px 16px", borderRadius:14, boxShadow:"0 8px 24px rgba(168,85,247,0.3)", fontSize:13, fontWeight:600, color:"white", animation:"toastIn .3s ease both",
          background: toast.type==="success" ? ES_GRAD : toast.type==="warn" ? "linear-gradient(135deg,#f59e0b,#d97706)" : toast.type==="info" ? "linear-gradient(135deg,#6366f1,#4f46e5)" : "linear-gradient(135deg,#ef4444,#dc2626)" }}>
          {toast.type==="success" ? <CheckCircle2 style={{width:15,height:15}}/> : toast.type==="warn" ? <XCircle style={{width:15,height:15}}/> : toast.type==="info" ? <RefreshCw style={{width:15,height:15}}/> : <Trash2 style={{width:15,height:15}}/>}
          {toast.msg}
        </div>
      )}
    </div>
  );
}