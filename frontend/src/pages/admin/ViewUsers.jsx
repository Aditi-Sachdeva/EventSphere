// // import { useState, useRef, useEffect } from "react";

// // // ─── DUMMY DATA ────────────────────────────────────────────────
// // const DUMMY_USERS = [
// //   { id: 1,  name: "Aanya Sharma",    email: "aanya.sharma@gmail.com",     role: "Admin",     status: "Active",   joined: "Jan 12, 2025", avatar: "AS" },
// //   { id: 2,  name: "Rohan Mehta",     email: "rohan.mehta@outlook.com",    role: "Organizer", status: "Active",   joined: "Feb 3, 2025",  avatar: "RM" },
// //   { id: 3,  name: "Priya Nair",      email: "priya.nair@yahoo.com",       role: "User",      status: "Active",   joined: "Feb 18, 2025", avatar: "PN" },
// //   { id: 4,  name: "Dev Kapoor",      email: "dev.kapoor@gmail.com",       role: "Organizer", status: "Inactive", joined: "Mar 1, 2025",  avatar: "DK" },
// //   { id: 5,  name: "Simran Kaur",     email: "simran.kaur@hotmail.com",    role: "User",      status: "Active",   joined: "Mar 9, 2025",  avatar: "SK" },
// //   { id: 6,  name: "Arjun Verma",     email: "arjun.verma@gmail.com",      role: "User",      status: "Banned",   joined: "Apr 2, 2025",  avatar: "AV" },
// //   { id: 7,  name: "Neha Joshi",      email: "neha.joshi@gmail.com",       role: "Organizer", status: "Active",   joined: "Apr 14, 2025", avatar: "NJ" },
// //   { id: 8,  name: "Karan Singh",     email: "karan.singh@icloud.com",     role: "User",      status: "Active",   joined: "May 5, 2025",  avatar: "KS" },
// //   { id: 9,  name: "Meera Pillai",    email: "meera.pillai@gmail.com",     role: "Admin",     status: "Active",   joined: "May 20, 2025", avatar: "MP" },
// //   { id: 10, name: "Rahul Bose",      email: "rahul.bose@outlook.com",     role: "User",      status: "Inactive", joined: "Jun 8, 2025",  avatar: "RB" },
// //   { id: 11, name: "Tanya Gupta",     email: "tanya.gupta@gmail.com",      role: "User",      status: "Active",   joined: "Jul 1, 2025",  avatar: "TG" },
// //   { id: 12, name: "Amit Chatterjee", email: "amit.chatt@gmail.com",       role: "Organizer", status: "Active",   joined: "Jul 19, 2025", avatar: "AC" },
// //   { id: 13, name: "Divya Reddy",     email: "divya.reddy@yahoo.com",      role: "User",      status: "Banned",   joined: "Aug 3, 2025",  avatar: "DR" },
// //   { id: 14, name: "Nikhil Pandey",   email: "nikhil.pandey@gmail.com",    role: "User",      status: "Active",   joined: "Aug 22, 2025", avatar: "NP" },
// //   { id: 15, name: "Ishaan Roy",      email: "ishaan.roy@hotmail.com",     role: "Organizer", status: "Active",   joined: "Sep 10, 2025", avatar: "IR" },
// // ];

// // const SIDEBAR_LINKS = [
// //   { id: "dashboard",   label: "Dashboard",   icon: "grid" },
// //   { id: "view-users",  label: "View Users",  icon: "users" },
// //   { id: "create-club", label: "Create Club", icon: "plus" },
// //   { id: "view-clubs",  label: "View Clubs",  icon: "clubs" },
// //   { id: "view-events", label: "View Events", icon: "cal" },
// // ];

// // const STATS = [
// //   { id: "users",  label: "Total Users",  value: "4,821", change: "+12%", gradient: "from-violet-500 to-purple-600",  accent: "bg-violet-100",  text: "text-violet-600" },
// //   { id: "clubs",  label: "Total Clubs",  value: "138",   change: "+5%",  gradient: "from-fuchsia-500 to-pink-500",  accent: "bg-fuchsia-100", text: "text-fuchsia-600" },
// //   { id: "events", label: "Total Events", value: "2,047", change: "+18%", gradient: "from-indigo-500 to-violet-500", accent: "bg-indigo-100",  text: "text-indigo-600" },
// // ];

// // const RECENT_EVENTS = [
// //   { name: "Tech Symposium 2026", club: "Tech Club",     date: "Mar 10", attendees: 340, status: "Upcoming" },
// //   { name: "Cultural Fest Night", club: "Arts Society",  date: "Mar 7",  attendees: 210, status: "Upcoming" },
// //   { name: "Hackathon Spring",    club: "Dev Guild",     date: "Feb 28", attendees: 180, status: "Done" },
// //   { name: "Leadership Summit",   club: "Business Club", date: "Feb 22", attendees: 95,  status: "Done" },
// //   { name: "Photography Walk",    club: "Lens Club",     date: "Feb 18", attendees: 60,  status: "Done" },
// // ];

// // const TOP_CLUBS = [
// //   { name: "Tech Club",     members: 420, color: "bg-violet-500" },
// //   { name: "Arts Society",  members: 310, color: "bg-fuchsia-500" },
// //   { name: "Dev Guild",     members: 275, color: "bg-indigo-500" },
// //   { name: "Business Club", members: 230, color: "bg-purple-500" },
// // ];

// // const ROLE_COLORS = {
// //   Admin:     "bg-violet-100 text-violet-700",
// //   Organizer: "bg-indigo-100 text-indigo-700",
// //   User:      "bg-gray-100 text-gray-600",
// // };

// // const STATUS_COLORS = {
// //   Active:   "bg-emerald-50 text-emerald-600",
// //   Inactive: "bg-amber-50 text-amber-600",
// //   Banned:   "bg-red-50 text-red-500",
// // };

// // const AVATAR_COLORS = [
// //   "bg-violet-500","bg-fuchsia-500","bg-indigo-500","bg-purple-500",
// //   "bg-pink-500","bg-sky-500","bg-teal-500","bg-orange-400",
// // ];

// // // ─── SVG ICONS ────────────────────────────────────────────────
// // const Icon = ({ name, className = "w-5 h-5" }) => {
// //   const icons = {
// //     grid:    <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
// //     users:   <><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/><path d="M21 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round"/></>,
// //     plus:    <><path d="M12 5v14M5 12h14" strokeLinecap="round"/></>,
// //     clubs:   <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/></>,
// //     cal:     <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round"/></>,
// //     trash:   <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" strokeLinecap="round"/></>,
// //     search:  <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/></>,
// //     chevron: <><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/></>,
// //     bell:    <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round"/></>,
// //     menu:    <><path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round"/></>,
// //     prev:    <><path d="M15 18l-6-6 6-6" strokeLinecap="round"/></>,
// //     next:    <><path d="M9 18l6-6-6-6" strokeLinecap="round"/></>,
// //     close:   <><path d="M18 6 6 18M6 6l12 12" strokeLinecap="round"/></>,
// //     warn:    <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
// //     sphere:  <><circle cx="12" cy="12" r="3"/><path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round"/><path d="M12 6V2M18 6l2.5-2.5M22 12h-4" strokeLinecap="round"/></>,
// //   };
// //   return (
// //     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
// //       {icons[name]}
// //     </svg>
// //   );
// // };

// // // ─── ROLE DROPDOWN ─────────────────────────────────────────────
// // function RoleDropdown({ userId, currentRole, onChange }) {
// //   const [open, setOpen] = useState(false);
// //   const ref = useRef();
// //   useEffect(() => {
// //     const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
// //     document.addEventListener("mousedown", h);
// //     return () => document.removeEventListener("mousedown", h);
// //   }, []);

// //   return (
// //     <div className="relative" ref={ref}>
// //       <button
// //         onClick={() => setOpen(!open)}
// //         className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${ROLE_COLORS[currentRole]} border-transparent hover:border-violet-200 hover:shadow-sm`}
// //       >
// //         {currentRole}
// //         <Icon name="chevron" className="w-3 h-3" />
// //       </button>
// //       {open && (
// //         <div className="absolute z-50 top-full mt-1 left-0 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden w-36 py-1">
// //           {["User","Organizer","Admin"].map(r => (
// //             <button key={r} onClick={() => { onChange(userId, r); setOpen(false); }}
// //               className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors flex items-center gap-2 ${r === currentRole ? "bg-violet-50 text-violet-700" : "text-gray-600 hover:bg-gray-50"}`}>
// //               <span className={`w-2 h-2 rounded-full flex-shrink-0 ${r === "Admin" ? "bg-violet-500" : r === "Organizer" ? "bg-indigo-400" : "bg-gray-300"}`}></span>
// //               {r}
// //               {r === currentRole && <span className="ml-auto text-violet-400 text-[10px]">✓</span>}
// //             </button>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // // ─── DELETE MODAL ──────────────────────────────────────────────
// // function DeleteModal({ user, onConfirm, onCancel }) {
// //   return (
// //     <div className="fixed inset-0 z-[100] flex items-center justify-center">
// //       <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onCancel} />
// //       <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 border border-gray-100" style={{ animation: "modalIn .22s ease both" }}>
// //         <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
// //           <Icon name="warn" className="w-6 h-6 text-red-500" />
// //         </div>
// //         <h3 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700 }} className="text-center text-gray-900 text-lg mb-1">Delete User?</h3>
// //         <p className="text-center text-sm text-gray-500 mb-5">
// //           <span className="font-semibold text-gray-700">{user?.name}</span> will be permanently removed. This cannot be undone.
// //         </p>
// //         <div className="flex gap-2">
// //           <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
// //           <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors shadow-md shadow-red-100">Delete</button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── TOAST ─────────────────────────────────────────────────────
// // function Toast({ msg, onDone }) {
// //   useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
// //   return (
// //     <div className="fixed bottom-6 right-6 z-[200] bg-gray-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5" style={{ animation: "toastIn .25s ease both" }}>
// //       <span className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0"></span>
// //       {msg}
// //     </div>
// //   );
// // }

// // // ══════════════════════════════════════════════════════════════
// // //  ROOT APP
// // // ══════════════════════════════════════════════════════════════
// // export default function AdminDashboard() {
// //   const [activePage,   setActivePage]   = useState("dashboard");
// //   const [sidebarOpen,  setSidebarOpen]  = useState(true);
// //   const [users,        setUsers]        = useState(DUMMY_USERS);
// //   const [toast,        setToast]        = useState(null);
// //   const [deleteTarget, setDeleteTarget] = useState(null);

// //   const handleRoleChange = (userId, newRole) => {
// //     setUsers(u => u.map(x => x.id === userId ? { ...x, role: newRole } : x));
// //     setToast(`Role updated to ${newRole}`);
// //   };

// //   const handleDeleteConfirm = () => {
// //     setUsers(u => u.filter(x => x.id !== deleteTarget.id));
// //     setToast(`${deleteTarget.name} removed`);
// //     setDeleteTarget(null);
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
// //       <style>{`
// //         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Sora:wght@600;700;800&display=swap');
// //         *,*::before,*::after{box-sizing:border-box}
// //         .shimmer{background:linear-gradient(135deg,#7c3aed 0%,#a855f7 50%,#6d28d9 100%)}
// //         .sl{transition:all .18s ease}.sl:hover{transform:translateX(3px)}
// //         .sc{transition:all .22s ease}.sc:hover{transform:translateY(-3px);box-shadow:0 14px 36px -8px rgba(124,58,237,.15)}
// //         .fi  {animation:fu .45s ease both}
// //         .fi1 {animation:fu .45s .06s ease both}
// //         .fi2 {animation:fu .45s .12s ease both}
// //         .fi3 {animation:fu .45s .18s ease both}
// //         .fi4 {animation:fu .45s .24s ease both}
// //         @keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
// //         .tr{transition:background .14s}.tr:hover{background:#faf8ff}
// //         @keyframes modalIn{from{opacity:0;transform:scale(.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
// //         @keyframes toastIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
// //         .sa::-webkit-scrollbar{width:4px}.sa::-webkit-scrollbar-track{background:transparent}.sa::-webkit-scrollbar-thumb{background:#ddd6fe;border-radius:4px}
// //       `}</style>

// //       {/* NAVBAR */}
// //       <header className="h-16 bg-white border-b border-gray-100 flex items-center px-5 justify-between fixed top-0 left-0 right-0 z-40 shadow-sm">
// //         <div className="flex items-center gap-3">
// //           <button onClick={() => setSidebarOpen(o => !o)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-violet-50 text-gray-500 hover:text-violet-600 transition-colors">
// //             <Icon name="menu" />
// //           </button>
// //           <div className="flex items-center gap-2.5">
// //             <div className="w-8 h-8 shimmer rounded-lg flex items-center justify-center shadow-md shadow-violet-200">
// //               <Icon name="sphere" className="w-4 h-4 text-white" />
// //             </div>
// //             <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:800 }} className="text-gray-900 text-lg tracking-tight">
// //               Event<span className="text-violet-600">Sphere</span>
// //             </span>
// //           </div>
// //         </div>
// //         <div className="flex items-center gap-3">
// //           <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-56">
// //             <Icon name="search" className="w-4 h-4 text-gray-400" />
// //             <input placeholder="Search…" className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full" />
// //           </div>
// //           <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-violet-50 text-gray-500 hover:text-violet-600 transition-colors">
// //             <Icon name="bell" />
// //             <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full ring-2 ring-white"></span>
// //           </button>
// //           <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
// //             <div className="w-8 h-8 shimmer rounded-full flex items-center justify-center shadow-md shadow-violet-200 text-white text-xs font-bold">A</div>
// //             <div className="hidden md:block">
// //               <p className="text-sm text-gray-800 leading-none mb-0.5" style={{ fontWeight:600 }}>Admin</p>
// //               <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700">● Logged in</span>
// //             </div>
// //           </div>
// //         </div>
// //       </header>

// //       <div className="flex pt-16 flex-1">
// //         {/* SIDEBAR */}
// //         <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-100 z-30 flex flex-col transition-all duration-300 shadow-sm ${sidebarOpen ? "w-60" : "w-16"}`}>
// //           <nav className="flex-1 py-5 px-3 space-y-1 sa overflow-y-auto">
// //             {SIDEBAR_LINKS.map(link => {
// //               const active = activePage === link.id;
// //               return (
// //                 <button key={link.id} onClick={() => setActivePage(link.id)}
// //                   className={`sl w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-medium text-sm transition-all ${active ? "bg-violet-600 text-white shadow-md shadow-violet-200" : "text-gray-500 hover:bg-violet-50 hover:text-violet-700"}`}>
// //                   <span className="flex-shrink-0"><Icon name={link.icon} /></span>
// //                   {sidebarOpen && <span className="truncate">{link.label}</span>}
// //                   {sidebarOpen && active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80"></span>}
// //                 </button>
// //               );
// //             })}
// //           </nav>
// //           {sidebarOpen && (
// //             <div className="p-4 border-t border-gray-100">
// //               <div className="bg-violet-50 rounded-xl p-3">
// //                 <p className="text-xs font-semibold text-violet-700 mb-1">Need help?</p>
// //                 <p className="text-xs text-violet-500 leading-snug">Check docs or contact support team.</p>
// //               </div>
// //             </div>
// //           )}
// //         </aside>

// //         {/* MAIN */}
// //         <main className={`flex-1 transition-all duration-300 min-h-screen ${sidebarOpen ? "ml-60" : "ml-16"}`}>
// //           {activePage === "dashboard"  && <DashboardPage />}
// //           {activePage === "view-users" && <ViewUsersPage users={users} onRoleChange={handleRoleChange} onDeleteRequest={setDeleteTarget} />}
// //           {!["dashboard","view-users"].includes(activePage) && (
// //             <PlaceholderPage name={SIDEBAR_LINKS.find(l => l.id === activePage)?.label} />
// //           )}
// //         </main>
// //       </div>

// //       {deleteTarget && <DeleteModal user={deleteTarget} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} />}
// //       {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
// //     </div>
// //   );
// // }

// // // ══════════════════════════════════════════════════════════════
// // //  VIEW USERS
// // // ══════════════════════════════════════════════════════════════
// // function ViewUsersPage({ users, onRoleChange, onDeleteRequest }) {
// //   const [search,       setSearch]       = useState("");
// //   const [roleFilter,   setRoleFilter]   = useState("All");
// //   const [statusFilter, setStatusFilter] = useState("All");
// //   const [sortField,    setSortField]    = useState("name");
// //   const [sortDir,      setSortDir]      = useState("asc");
// //   const [currentPage,  setCurrentPage]  = useState(1);
// //   const PER_PAGE = 8;

// //   const filtered = users
// //     .filter(u => {
// //       const q = search.toLowerCase();
// //       return (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
// //         && (roleFilter === "All"   || u.role === roleFilter)
// //         && (statusFilter === "All" || u.status === statusFilter);
// //     })
// //     .sort((a, b) => {
// //       const av = (a[sortField] || "").toLowerCase();
// //       const bv = (b[sortField] || "").toLowerCase();
// //       return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
// //     });

// //   const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
// //   const page = Math.min(currentPage, totalPages);
// //   const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

// //   const handleSort = (field) => {
// //     if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
// //     else { setSortField(field); setSortDir("asc"); }
// //     setCurrentPage(1);
// //   };

// //   const SortBtn = ({ field, label }) => (
// //     <button onClick={() => handleSort(field)}
// //       className={`flex items-center gap-0.5 text-xs font-semibold uppercase tracking-wide hover:text-violet-600 transition-colors ${sortField === field ? "text-violet-600" : "text-gray-500"}`}>
// //       {label}
// //       <span className="ml-0.5 text-[10px]">{sortField === field ? (sortDir === "asc" ? " ↑" : " ↓") : " ↕"}</span>
// //     </button>
// //   );

// //   const counts = {
// //     total:      users.length,
// //     active:     users.filter(u => u.status === "Active").length,
// //     organizers: users.filter(u => u.role === "Organizer").length,
// //     banned:     users.filter(u => u.status === "Banned").length,
// //   };

// //   const pageBtns = Array.from({ length: totalPages }, (_, i) => i + 1)
// //     .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
// //     .reduce((acc, p, i, arr) => { if (i > 0 && p - arr[i-1] > 1) acc.push("…"); acc.push(p); return acc; }, []);

// //   return (
// //     <div className="p-6 space-y-5 max-w-7xl">

// //       {/* Header */}
// //       <div className="fi flex flex-col sm:flex-row sm:items-end justify-between gap-3">
// //         <div>
// //           <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-1">Administration</p>
// //           <h1 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700 }} className="text-2xl text-gray-900">Manage Users</h1>
// //         </div>
// //         <p className="text-xs text-gray-400 bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-sm flex items-center gap-1.5">
// //           <Icon name="cal" className="w-3.5 h-3.5" /> March 4, 2026
// //         </p>
// //       </div>

// //       {/* Summary pills */}
// //       <div className="fi1 grid grid-cols-2 sm:grid-cols-4 gap-3">
// //         {[
// //           { label:"Total Users",  val: counts.total,      border:"border-violet-200", bg:"bg-violet-50",  text:"text-violet-700" },
// //           { label:"Active",       val: counts.active,     border:"border-emerald-200",bg:"bg-emerald-50", text:"text-emerald-700" },
// //           { label:"Organizers",   val: counts.organizers, border:"border-indigo-200", bg:"bg-indigo-50",  text:"text-indigo-700" },
// //           { label:"Banned",       val: counts.banned,     border:"border-red-200",    bg:"bg-red-50",     text:"text-red-600" },
// //         ].map(s => (
// //           <div key={s.label} className={`rounded-xl border ${s.border} ${s.bg} px-4 py-3 flex items-center gap-3`}>
// //             <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:700 }} className={`text-2xl ${s.text}`}>{s.val}</span>
// //             <span className={`text-xs font-medium ${s.text} opacity-80 leading-tight`}>{s.label}</span>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Controls */}
// //       <div className="fi2 bg-white border border-gray-100 rounded-2xl shadow-sm p-4 flex flex-wrap gap-3 items-center">
// //         {/* Search */}
// //         <div className="flex items-center gap-2 flex-1 min-w-52 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5">
// //           <Icon name="search" className="w-4 h-4 text-gray-400 flex-shrink-0" />
// //           <input value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
// //             placeholder="Search by name or email…"
// //             className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full" />
// //           {search && (
// //             <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
// //               <Icon name="close" className="w-3.5 h-3.5" />
// //             </button>
// //           )}
// //         </div>

// //         {/* Role filter */}
// //         <div className="flex items-center gap-1.5 flex-wrap">
// //           <span className="text-xs text-gray-400 font-medium">Role:</span>
// //           {["All","User","Organizer","Admin"].map(r => (
// //             <button key={r} onClick={() => { setRoleFilter(r); setCurrentPage(1); }}
// //               className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${roleFilter === r ? "bg-violet-600 text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-violet-50 hover:text-violet-600"}`}>
// //               {r}
// //             </button>
// //           ))}
// //         </div>

// //         {/* Status filter */}
// //         <div className="flex items-center gap-1.5 flex-wrap">
// //           <span className="text-xs text-gray-400 font-medium">Status:</span>
// //           {["All","Active","Inactive","Banned"].map(s => (
// //             <button key={s} onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
// //               className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${statusFilter === s ? "bg-violet-600 text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-violet-50 hover:text-violet-600"}`}>
// //               {s}
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Table */}
// //       <div className="fi3 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
// //         <div className="overflow-x-auto">
// //           <table className="w-full text-sm">
// //             <thead>
// //               <tr className="bg-gray-50/80 border-b border-gray-100">
// //                 <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 w-10">#</th>
// //                 <th className="text-left px-4 py-3"><SortBtn field="name" label="User" /></th>
// //                 <th className="text-left px-4 py-3 hidden md:table-cell"><SortBtn field="email" label="Email" /></th>
// //                 <th className="text-left px-4 py-3"><SortBtn field="role" label="Role" /></th>
// //                 <th className="text-left px-4 py-3 hidden sm:table-cell"><SortBtn field="status" label="Status" /></th>
// //                 <th className="text-left px-4 py-3 hidden lg:table-cell"><SortBtn field="joined" label="Joined" /></th>
// //                 <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody className="divide-y divide-gray-50">
// //               {paginated.length === 0 ? (
// //                 <tr>
// //                   <td colSpan={7} className="text-center py-14 text-gray-400 text-sm">
// //                     <div className="flex flex-col items-center gap-2">
// //                       <Icon name="search" className="w-10 h-10 text-gray-200" />
// //                       No users match your current filters.
// //                     </div>
// //                   </td>
// //                 </tr>
// //               ) : paginated.map((user, idx) => {
// //                 const aColor = AVATAR_COLORS[user.id % AVATAR_COLORS.length];
// //                 return (
// //                   <tr key={user.id} className="tr">
// //                     <td className="px-4 py-3.5 text-xs text-gray-300 font-medium">{(page-1)*PER_PAGE+idx+1}</td>
// //                     <td className="px-4 py-3.5">
// //                       <div className="flex items-center gap-3">
// //                         <div className={`w-8 h-8 rounded-full ${aColor} flex items-center justify-center text-white flex-shrink-0`} style={{ fontSize:11, fontWeight:700, letterSpacing:".02em" }}>
// //                           {user.avatar}
// //                         </div>
// //                         <span className="font-medium text-gray-800 truncate max-w-[140px]">{user.name}</span>
// //                       </div>
// //                     </td>
// //                     <td className="px-4 py-3.5 text-gray-400 text-xs hidden md:table-cell truncate max-w-[200px]">{user.email}</td>
// //                     <td className="px-4 py-3.5">
// //                       <RoleDropdown userId={user.id} currentRole={user.role} onChange={onRoleChange} />
// //                     </td>
// //                     <td className="px-4 py-3.5 hidden sm:table-cell">
// //                       <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[user.status]}`}>
// //                         {user.status === "Active" ? "● " : user.status === "Inactive" ? "○ " : "✕ "}{user.status}
// //                       </span>
// //                     </td>
// //                     <td className="px-4 py-3.5 text-gray-400 text-xs hidden lg:table-cell">{user.joined}</td>
// //                     <td className="px-4 py-3.5">
// //                       <button onClick={() => onDeleteRequest(user)}
// //                         className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
// //                         title="Delete user">
// //                         <Icon name="trash" className="w-4 h-4" />
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 );
// //               })}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* Pagination */}
// //         <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/50">
// //           <p className="text-xs text-gray-400">
// //             Showing <span className="font-semibold text-gray-700">{filtered.length === 0 ? 0 : (page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)}</span> of <span className="font-semibold text-gray-700">{filtered.length}</span> users
// //           </p>
// //           <div className="flex items-center gap-1">
// //             <button onClick={() => setCurrentPage(p => Math.max(1,p-1))} disabled={page===1}
// //               className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-violet-50 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
// //               <Icon name="prev" className="w-4 h-4" />
// //             </button>
// //             {pageBtns.map((p, i) =>
// //               p === "…"
// //                 ? <span key={`e${i}`} className="w-7 text-center text-xs text-gray-400">…</span>
// //                 : <button key={p} onClick={() => setCurrentPage(p)}
// //                     className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${page===p ? "bg-violet-600 text-white shadow-sm" : "text-gray-500 hover:bg-violet-50 hover:text-violet-600"}`}>
// //                     {p}
// //                   </button>
// //             )}
// //             <button onClick={() => setCurrentPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
// //               className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-violet-50 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
// //               <Icon name="next" className="w-4 h-4" />
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // ══════════════════════════════════════════════════════════════
// // //  DASHBOARD PAGE
// // // ══════════════════════════════════════════════════════════════
// // function DashboardPage() {
// //   return (
// //     <div className="p-6 space-y-6 max-w-7xl">
// //       <div className="fi flex items-end justify-between">
// //         <div>
// //           <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-1">Overview</p>
// //           <h1 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700 }} className="text-2xl text-gray-900">Dashboard</h1>
// //         </div>
// //         <p className="text-xs text-gray-400 bg-white border border-gray-100 rounded-lg px-3 py-2 shadow-sm flex items-center gap-1.5">
// //           <Icon name="cal" className="w-3.5 h-3.5" /> March 4, 2026
// //         </p>
// //       </div>

// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
// //         {STATS.map((s, i) => (
// //           <div key={s.id} className={`sc bg-white rounded-2xl border border-gray-100 p-5 shadow-sm fi${i+1}`}>
// //             <div className="flex items-start justify-between mb-4">
// //               <div className={`w-11 h-11 rounded-xl ${s.accent} ${s.text} flex items-center justify-center`}>
// //                 <Icon name={s.id === "users" ? "users" : s.id === "clubs" ? "clubs" : "cal"} />
// //               </div>
// //               <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">{s.change} ↑</span>
// //             </div>
// //             <p className="text-sm text-gray-400 font-medium mb-1">{s.label}</p>
// //             <p style={{ fontFamily:"'Sora',sans-serif", fontWeight:700 }} className="text-3xl text-gray-900">{s.value}</p>
// //             <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
// //               <div className={`h-full rounded-full bg-gradient-to-r ${s.gradient}`}
// //                 style={{ width: s.id==="users"?"72%":s.id==="clubs"?"48%":"65%" }}></div>
// //             </div>
// //             <p className="text-[11px] text-gray-400 mt-1.5">vs last month</p>
// //           </div>
// //         ))}
// //       </div>

// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 fi4">
// //         <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
// //           <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
// //             <h2 className="text-sm font-semibold text-gray-800">Recent Events</h2>
// //             <button className="text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors">View all →</button>
// //           </div>
// //           <div className="divide-y divide-gray-50">
// //             {RECENT_EVENTS.map(ev => (
// //               <div key={ev.name} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/60 transition-colors">
// //                 <div className="flex items-center gap-3">
// //                   <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 flex-shrink-0">
// //                     <Icon name="cal" className="w-4 h-4" />
// //                   </div>
// //                   <div>
// //                     <p className="text-sm font-medium text-gray-800 leading-tight">{ev.name}</p>
// //                     <p className="text-[11px] text-gray-400">{ev.club} · {ev.date}</p>
// //                   </div>
// //                 </div>
// //                 <div className="flex items-center gap-4">
// //                   <span className="text-xs text-gray-500 hidden sm:block">{ev.attendees} attendees</span>
// //                   <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ev.status==="Upcoming"?"bg-violet-100 text-violet-700":"bg-emerald-50 text-emerald-600"}`}>{ev.status}</span>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
// //           <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
// //             <h2 className="text-sm font-semibold text-gray-800">Top Clubs</h2>
// //             <button className="text-xs font-medium text-violet-600 hover:text-violet-700">View all →</button>
// //           </div>
// //           <div className="p-4 space-y-3">
// //             {TOP_CLUBS.map((club, idx) => (
// //               <div key={club.name} className="flex items-center gap-3">
// //                 <span className="text-xs font-bold text-gray-300 w-4 text-center">{idx+1}</span>
// //                 <div className={`w-8 h-8 rounded-xl ${club.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>{club.name[0]}</div>
// //                 <div className="flex-1 min-w-0">
// //                   <p className="text-sm font-medium text-gray-800 truncate">{club.name}</p>
// //                   <div className="flex items-center gap-2 mt-0.5">
// //                     <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
// //                       <div className={`h-full rounded-full ${club.color}`} style={{ width:`${(club.members/420)*100}%`, opacity:.7 }}></div>
// //                     </div>
// //                     <span className="text-[10px] text-gray-400 flex-shrink-0">{club.members}</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //           <div className="mx-4 mb-4 rounded-xl p-3 shimmer">
// //             <p className="text-xs text-violet-200 mb-2 font-medium">Platform Activity</p>
// //             <div className="grid grid-cols-2 gap-2">
// //               <div className="bg-white/10 rounded-lg p-2 text-center">
// //                 <p className="text-white font-bold text-lg" style={{ fontFamily:"'Sora',sans-serif" }}>92%</p>
// //                 <p className="text-[10px] text-violet-200">Active Rate</p>
// //               </div>
// //               <div className="bg-white/10 rounded-lg p-2 text-center">
// //                 <p className="text-white font-bold text-lg" style={{ fontFamily:"'Sora',sans-serif" }}>4.8★</p>
// //                 <p className="text-[10px] text-violet-200">Avg Rating</p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // ── PLACEHOLDER ───────────────────────────────────────────────
// // function PlaceholderPage({ name }) {
// //   return (
// //     <div className="p-6 flex items-center justify-center min-h-[80vh]">
// //       <div className="text-center fi">
// //         <div className="w-16 h-16 shimmer rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-200">
// //           <Icon name="grid" className="w-8 h-8 text-white" />
// //         </div>
// //         <h2 style={{ fontFamily:"'Sora',sans-serif", fontWeight:700 }} className="text-xl text-gray-800 mb-2">{name}</h2>
// //         <p className="text-sm text-gray-400">This page will be connected to the backend.</p>
// //         <div className="mt-5 inline-flex items-center gap-2 bg-violet-50 text-violet-600 text-xs font-medium px-4 py-2 rounded-full">
// //           <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
// //           Coming soon
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }












































// // import React, { useState } from "react";
// // import {
// //   Menu,
// //   Users,
// //   Calendar,
// //   Plus,
// //   LayoutDashboard,
// //   Search,
// //   Bell
// // } from "lucide-react";

// // export default function AdminDashboard() {

// // const [activePage,setActivePage] = useState("users")

// // const menuItems = [
// // { id:"dashboard", label:"Dashboard", icon:<LayoutDashboard size={20}/> },
// // { id:"createClub", label:"Create Club", icon:<Plus size={20}/> },
// // { id:"clubs", label:"View Clubs", icon:<Users size={20}/> },
// // { id:"events", label:"View Events", icon:<Calendar size={20}/> },
// // { id:"users", label:"Manage Users", icon:<Users size={20}/> },
// // ]

// // return (

// // <div className="flex h-screen bg-gray-50">




// // {/* MAIN SECTION */}

// // <div className="flex-1 flex flex-col">



// // {/* PAGE CONTENT */}

// // <div className="p-8 overflow-y-auto">

// // {activePage==="users" && (

// // <div>

// // <p className="text-xs tracking-widest text-gray-500 mb-2">
// // ADMINISTRATION
// // </p>

// // <h2 className="text-3xl font-bold mb-6">
// // Manage Users
// // </h2>


// // {/* STATS */}

// // <div className="grid grid-cols-4 gap-6 mb-8">

// // <div className="bg-white border p-5 rounded-xl">
// // <p className="text-gray-500 text-sm">Total Users</p>
// // <p className="text-2xl font-bold">15</p>
// // </div>

// // <div className="bg-white border p-5 rounded-xl">
// // <p className="text-gray-500 text-sm">Active</p>
// // <p className="text-2xl font-bold">11</p>
// // </div>

// // <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-xl">
// // <p className="text-indigo-500 text-sm">Organizers</p>
// // <p className="text-2xl font-bold text-indigo-600">5</p>
// // </div>

// // <div className="bg-red-50 border border-red-200 p-5 rounded-xl">
// // <p className="text-red-500 text-sm">Banned</p>
// // <p className="text-2xl font-bold text-red-600">2</p>
// // </div>

// // </div>


// // {/* SEARCH + FILTER */}

// // <div className="bg-white border rounded-xl p-4 mb-6 flex items-center justify-between">

// // <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-1/3">
// // <Search size={16} className="text-gray-500"/>
// // <input
// // placeholder="Search by name or email..."
// // className="bg-transparent outline-none ml-2 text-sm w-full"
// // />
// // </div>

// // <div className="flex gap-3 text-sm">

// // <span className="px-3 py-1 bg-gray-100 rounded-full cursor-pointer">
// // User
// // </span>

// // <span className="px-3 py-1 bg-gray-100 rounded-full cursor-pointer">
// // Organizer
// // </span>

// // <span className="px-3 py-1 bg-gray-100 rounded-full cursor-pointer">
// // Admin
// // </span>

// // </div>

// // </div>


// // {/* USERS TABLE */}

// // <div className="bg-white border rounded-xl overflow-hidden">

// // <table className="w-full text-sm">

// // <thead className="bg-gray-50 text-gray-600">

// // <tr>

// // <th className="p-4 text-left">#</th>
// // <th className="p-4 text-left">User</th>
// // <th className="p-4 text-left">Email</th>
// // <th className="p-4 text-left">Role</th>
// // <th className="p-4 text-left">Status</th>
// // <th className="p-4 text-left">Joined</th>
// // <th className="p-4 text-left">Actions</th>

// // </tr>

// // </thead>


// // <tbody>

// // <tr className="border-t">

// // <td className="p-4">1</td>
// // <td className="p-4 font-medium">Aanya Sharma</td>
// // <td className="p-4 text-gray-500">
// // aanya.sharma@gmail.com
// // </td>
// // <td className="p-4">Admin</td>
// // <td className="p-4 text-green-600">● Active</td>
// // <td className="p-4 text-gray-500">Jan 12, 2025</td>
// // <td className="p-4">🗑</td>

// // </tr>

// // <tr className="border-t bg-gray-50">

// // <td className="p-4">2</td>
// // <td className="p-4 font-medium">Amit Chatterjee</td>
// // <td className="p-4 text-gray-500">
// // amit.chatt@gmail.com
// // </td>
// // <td className="p-4 text-indigo-600">Organizer</td>
// // <td className="p-4 text-green-600">● Active</td>
// // <td className="p-4 text-gray-500">Jul 19, 2025</td>
// // <td className="p-4">🗑</td>

// // </tr>

// // <tr className="border-t">

// // <td className="p-4">3</td>
// // <td className="p-4 font-medium">Arjun Verma</td>
// // <td className="p-4 text-gray-500">
// // arjun.verma@gmail.com
// // </td>
// // <td className="p-4">User</td>
// // <td className="p-4 text-red-500">✕ Banned</td>
// // <td className="p-4 text-gray-500">Apr 2, 2025</td>
// // <td className="p-4">🗑</td>

// // </tr>

// // </tbody>

// // </table>

// // </div>

// // </div>

// // )}

// // </div>

// // </div>

// // </div>

// // )

// // }








// import React, { useState } from "react";
// import {
//   Menu,
//   Users,
//   Calendar,
//   Plus,
//   LayoutDashboard,
//   Search,
//   Bell
// } from "lucide-react";

// export default function AdminDashboard() {

// const [activePage,setActivePage] = useState("users")

// const menuItems = [
// { id:"dashboard", label:"Dashboard", icon:<LayoutDashboard size={20}/> },
// { id:"createClub", label:"Create Club", icon:<Plus size={20}/> },
// { id:"clubs", label:"View Clubs", icon:<Users size={20}/> },
// { id:"events", label:"View Events", icon:<Calendar size={20}/> },
// { id:"users", label:"Manage Users", icon:<Users size={20}/> },
// ]

// return (

// <div className="flex h-screen bg-gray-50">

// {/* MAIN SECTION */}

// <div className="flex-1 flex flex-col">

// {/* PAGE CONTENT */}

// <div className="p-8 overflow-y-auto">

// {activePage==="users" && (

// <div className="fade-in">

// <p className="text-xs tracking-widest text-gray-500 mb-2">
// ADMINISTRATION
// </p>

// <h2 className="text-3xl font-bold mb-6">
// Manage Users
// </h2>


// {/* STATS */}

// <div className="grid grid-cols-4 gap-6 mb-8">

// <div className="bg-white border p-5 rounded-xl card-hover fade-in-1">
// <p className="text-gray-500 text-sm">Total Users</p>
// <p className="text-2xl font-bold">15</p>
// </div>

// <div className="bg-white border p-5 rounded-xl card-hover fade-in-2">
// <p className="text-gray-500 text-sm">Active</p>
// <p className="text-2xl font-bold">11</p>
// </div>

// <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-xl card-hover fade-in-3">
// <p className="text-indigo-500 text-sm">Organizers</p>
// <p className="text-2xl font-bold text-indigo-600">5</p>
// </div>

// <div className="bg-red-50 border border-red-200 p-5 rounded-xl card-hover fade-in-3">
// <p className="text-red-500 text-sm">Banned</p>
// <p className="text-2xl font-bold text-red-600">2</p>
// </div>

// </div>


// {/* SEARCH + FILTER */}

// <div className="bg-white border rounded-xl p-4 mb-6 flex items-center justify-between fade-in-2">

// <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-1/3">
// <Search size={16} className="text-gray-500"/>
// <input
// placeholder="Search by name or email..."
// className="bg-transparent outline-none ml-2 text-sm w-full"
// />
// </div>

// <div className="flex gap-3 text-sm">

// <span className="px-3 py-1 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition">
// User
// </span>

// <span className="px-3 py-1 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition">
// Organizer
// </span>

// <span className="px-3 py-1 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition">
// Admin
// </span>

// </div>

// </div>


// {/* USERS TABLE */}

// <div className="bg-white border rounded-xl overflow-hidden fade-in-3">

// <table className="w-full text-sm">

// <thead className="bg-gray-50 text-gray-600">

// <tr>

// <th className="p-4 text-left">#</th>
// <th className="p-4 text-left">User</th>
// <th className="p-4 text-left">Email</th>
// <th className="p-4 text-left">Role</th>
// <th className="p-4 text-left">Status</th>
// <th className="p-4 text-left">Joined</th>
// <th className="p-4 text-left">Actions</th>

// </tr>

// </thead>

// <tbody>

// <tr className="border-t hover:bg-gray-50 transition">

// <td className="p-4">1</td>
// <td className="p-4 font-medium">Aanya Sharma</td>
// <td className="p-4 text-gray-500">
// aanya.sharma@gmail.com
// </td>
// <td className="p-4">Admin</td>
// <td className="p-4 text-green-600">● Active</td>
// <td className="p-4 text-gray-500">Jan 12, 2025</td>
// <td className="p-4 cursor-pointer hover:text-red-500">🗑</td>

// </tr>

// <tr className="border-t bg-gray-50 hover:bg-gray-100 transition">

// <td className="p-4">2</td>
// <td className="p-4 font-medium">Amit Chatterjee</td>
// <td className="p-4 text-gray-500">
// amit.chatt@gmail.com
// </td>
// <td className="p-4 text-indigo-600">Organizer</td>
// <td className="p-4 text-green-600">● Active</td>
// <td className="p-4 text-gray-500">Jul 19, 2025</td>
// <td className="p-4 cursor-pointer hover:text-red-500">🗑</td>

// </tr>

// <tr className="border-t hover:bg-gray-50 transition">

// <td className="p-4">3</td>
// <td className="p-4 font-medium">Arjun Verma</td>
// <td className="p-4 text-gray-500">
// arjun.verma@gmail.com
// </td>
// <td className="p-4">User</td>
// <td className="p-4 text-red-500">✕ Banned</td>
// <td className="p-4 text-gray-500">Apr 2, 2025</td>
// <td className="p-4 cursor-pointer hover:text-red-500">🗑</td>

// </tr>

// </tbody>

// </table>

// </div>

// </div>

// )}

// </div>

// </div>


// {/* ANIMATION STYLES */}

// <style>{`

// .card-hover {
// transition: all 0.25s ease;
// }

// .card-hover:hover {
// transform: translateY(-4px);
// box-shadow: 0 10px 25px rgba(0,0,0,0.08);
// }

// .fade-in {
// animation: fadeIn 0.5s ease both;
// }

// .fade-in-1 { animation: fadeIn 0.5s 0.05s ease both; }
// .fade-in-2 { animation: fadeIn 0.5s 0.1s ease both; }
// .fade-in-3 { animation: fadeIn 0.5s 0.15s ease both; }

// @keyframes fadeIn {
// from {
// opacity:0;
// transform:translateY(12px);
// }
// to {
// opacity:1;
// transform:translateY(0);
// }
// }

// `}</style>

// </div>

// )

// }





import { useState, useRef, useEffect } from "react";

const ES_GRAD = "linear-gradient(135deg,#ec4899 0%,#a855f7 50%,#6366f1 100%)";

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
  "#ec4899","#a855f7","#6366f1","#8b5cf6","#db2777",
  "#7c3aed","#4f46e5","#c026d3","#9333ea","#e11d48",
];

const ROLE_CONFIG = {
  Admin:     { bg:"#f3e8ff", color:"#7c3aed" },
  Organizer: { bg:"#eef2ff", color:"#4f46e5" },
  User:      { bg:"#f3f4f6", color:"#374151" },
};

const STATUS_CONFIG = {
  Active:   { bg:"#f0fdf4", color:"#15803d", dot:"#10b981" },
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
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const cfg = ROLE_CONFIG[currentRole];
  return (
    <div style={{ position:"relative" }} ref={ref}>
      <button onClick={() => setOpen(!open)}
        style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:999, background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.bg}`, cursor:"pointer", fontFamily:"inherit", transition:"box-shadow .15s" }}
        onMouseEnter={e=>e.currentTarget.style.boxShadow="0 0 0 2px #e9d5ff"}
        onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
        {currentRole}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:10,height:10}}>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div style={{ position:"absolute", zIndex:50, top:"calc(100% + 6px)", left:0, background:"white", border:"1px solid #f3e8ff", borderRadius:14, boxShadow:"0 8px 24px rgba(168,85,247,0.15)", overflow:"hidden", width:140, padding:"4px 0" }}>
          {["User","Organizer","Admin"].map(r => {
            const rc = ROLE_CONFIG[r];
            return (
              <button key={r} onClick={() => { onChange(userId, r); setOpen(false); }}
                style={{ width:"100%", textAlign:"left", padding:"8px 12px", fontSize:12, fontWeight: r===currentRole ? 700 : 500, background: r===currentRole ? "#faf5ff" : "white", color: r===currentRole ? "#7c3aed" : "#374151", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:8, fontFamily:"inherit", transition:"background .12s" }}
                onMouseEnter={e=>{ if(r!==currentRole) e.currentTarget.style.background="#fdf4ff"; }}
                onMouseLeave={e=>{ if(r!==currentRole) e.currentTarget.style.background="white"; }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background: r==="Admin" ? "#a855f7" : r==="Organizer" ? "#6366f1" : "#d1d5db", flexShrink:0, display:"inline-block" }}/>
                {r}
                {r === currentRole && <span style={{ marginLeft:"auto", color:"#a855f7", fontSize:10 }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── DELETE MODAL ── */
function DeleteModal({ user, onConfirm, onCancel }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 16px" }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)", backdropFilter:"blur(4px)" }} onClick={onCancel}/>
      <div style={{ position:"relative", background:"white", borderRadius:20, boxShadow:"0 20px 60px rgba(0,0,0,0.2)", width:"100%", maxWidth:340, padding:24, animation:"modalIn .22s ease both" }}>
        <div style={{ width:44, height:44, borderRadius:14, background:"#fff1f2", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="1.8" style={{width:22,height:22}}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div style={{ fontSize:15, fontWeight:800, color:"#111827", textAlign:"center", marginBottom:8 }}>Delete User?</div>
        <p style={{ fontSize:13, color:"#6b7280", textAlign:"center", marginBottom:22, lineHeight:1.5 }}>
          <b style={{color:"#111827"}}>{user?.name}</b> will be permanently removed. This cannot be undone.
        </p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:"10px 0", borderRadius:12, border:"1px solid #e5e7eb", fontSize:13, fontWeight:600, color:"#4b5563", background:"white", cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, padding:"10px 0", borderRadius:12, border:"none", fontSize:13, fontWeight:700, color:"white", background:"linear-gradient(135deg,#f43f5e,#e11d48)", cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 14px rgba(244,63,94,0.3)" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ── TOAST ── */
function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position:"fixed", bottom:20, right:20, zIndex:200, display:"flex", alignItems:"center", gap:10, padding:"10px 16px", borderRadius:14, background:ES_GRAD, boxShadow:"0 8px 24px rgba(168,85,247,0.3)", fontSize:13, fontWeight:600, color:"white", animation:"toastIn .3s ease both" }}>
      <span style={{ width:7, height:7, borderRadius:"50%", background:"rgba(255,255,255,0.7)", flexShrink:0, display:"inline-block" }}/>
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

  const handleSort = (field) => {
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

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
      style={{ width:10, height:10, opacity: sortField===field ? 1 : 0.35 }}>
      {sortField===field && sortDir==="asc"
        ? <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
        : <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round"/>}
    </svg>
  );

  return (
    <div style={{ minHeight:"100vh", fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", background:"linear-gradient(135deg,#fdf2f8 0%,#faf5ff 40%,#eef2ff 100%)", boxSizing:"border-box" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box}
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .row-anim { animation: fadeUp .2s ease both; }
        .es-row:hover td { background:#fdf4ff!important; }
        .sort-th { cursor:pointer; }
        .sort-th:hover span { color:#7c3aed!important; }
        ::-webkit-scrollbar{width:4px;height:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:#e9d5ff;border-radius:4px}
      `}</style>

      <div style={{ padding:"20px 20px 24px", width:"100%" }}>

        {/* ── HEADER ── */}
        <div className="row-anim" style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20, gap:12, flexWrap:"wrap" }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".1em", color:"#a855f7", marginBottom:4 }}>Administration</div>
            <h1 style={{ fontSize:22, fontWeight:800, color:"#111827", margin:0, lineHeight:1.2 }}>Manage Users</h1>
            <p style={{ fontSize:12, color:"#9ca3af", margin:"3px 0 0" }}>View, filter and manage all registered users</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px", borderRadius:12, background:"white", border:"1px solid #f3e8ff", color:"#a855f7", fontSize:12, fontWeight:600, flexShrink:0, boxShadow:"0 1px 4px rgba(168,85,247,0.08)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" style={{width:14,height:14}}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round"/></svg>
            March 4, 2026
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
          {[
            { label:"Total Users",  value:counts.total,      grad:"linear-gradient(135deg,#a855f7,#6366f1)", accentBg:"#f3e8ff", accentColor:"#7c3aed",
              icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/><path d="M21 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round"/></svg> },
            { label:"Active",       value:counts.active,     grad:"linear-gradient(135deg,#10b981,#34d399)", accentBg:"#f0fdf4", accentColor:"#15803d",
              icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
            { label:"Organizers",   value:counts.organizers, grad:"linear-gradient(135deg,#6366f1,#818cf8)", accentBg:"#eef2ff", accentColor:"#4f46e5",
              icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round"/><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/></svg> },
            { label:"Banned",       value:counts.banned,     grad:"linear-gradient(135deg,#f43f5e,#e11d48)", accentBg:"#fff1f2", accentColor:"#be123c",
              icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:18,height:18}}><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> },
          ].map(({ label, value, grad, accentBg, accentColor, icon }, i) => (
            <div key={label} className="row-anim" style={{ background:"white", borderRadius:16, padding:"14px 16px", boxShadow:"0 1px 8px rgba(168,85,247,0.07)", border:"1px solid rgba(236,72,153,0.1)", display:"flex", alignItems:"center", gap:12, animationDelay:`${i*50}ms` }}>
              <div style={{ width:38, height:38, borderRadius:12, background:accentBg, color:accentColor, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {icon}
              </div>
              <div>
                <div style={{ fontSize:22, fontWeight:800, color:"#111827", lineHeight:1 }}>{value}</div>
                <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── CONTROLS ── */}
        <div className="row-anim" style={{ background:"white", borderRadius:16, border:"1px solid rgba(236,72,153,0.1)", padding:"12px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", boxShadow:"0 1px 8px rgba(168,85,247,0.07)" }}>

          {/* Search */}
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"#faf5ff", border:"1px solid #e9d5ff", borderRadius:12, padding:"7px 12px", flex:"1 1 200px", minWidth:180 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" style={{width:14,height:14,flexShrink:0}}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/></svg>
            <input value={search} onChange={e=>{setSearch(e.target.value);setCurrentPage(1);}} placeholder="Search by name or email…"
              style={{ border:"none", outline:"none", background:"transparent", fontSize:12, color:"#374151", width:"100%", fontFamily:"inherit" }}/>
            {search && <button onClick={()=>setSearch("")} style={{ border:"none", background:"none", cursor:"pointer", padding:0, display:"flex" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" style={{width:12,height:12}}><path d="M18 6 6 18M6 6l12 12" strokeLinecap="round"/></svg>
            </button>}
          </div>

          {/* Role filter */}
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
            <span style={{ fontSize:11, color:"#9ca3af", fontWeight:600 }}>Role:</span>
            {["All","User","Organizer","Admin"].map(r => (
              <button key={r} onClick={()=>{setRoleFilter(r);setCurrentPage(1);}}
                style={{ padding:"5px 11px", borderRadius:999, border:"none", fontSize:11, fontWeight: roleFilter===r ? 700 : 500, cursor:"pointer", fontFamily:"inherit", transition:"all .15s",
                  background: roleFilter===r ? ES_GRAD : "#faf5ff",
                  color:       roleFilter===r ? "white"  : "#6b7280",
                  boxShadow:   roleFilter===r ? "0 2px 8px rgba(168,85,247,0.25)" : "none" }}>
                {r}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
            <span style={{ fontSize:11, color:"#9ca3af", fontWeight:600 }}>Status:</span>
            {["All","Active","Inactive","Banned"].map(s => (
              <button key={s} onClick={()=>{setStatusFilter(s);setCurrentPage(1);}}
                style={{ padding:"5px 11px", borderRadius:999, border:"none", fontSize:11, fontWeight: statusFilter===s ? 700 : 500, cursor:"pointer", fontFamily:"inherit", transition:"all .15s",
                  background: statusFilter===s ? ES_GRAD : "#faf5ff",
                  color:       statusFilter===s ? "white"  : "#6b7280",
                  boxShadow:   statusFilter===s ? "0 2px 8px rgba(168,85,247,0.25)" : "none" }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ── TABLE ── */}
        <div style={{ background:"white", borderRadius:18, boxShadow:"0 1px 8px rgba(168,85,247,0.07)", border:"1px solid rgba(236,72,153,0.1)", overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#fdf4ff", borderBottom:"1px solid #f3e8ff" }}>
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
                      style={{ textAlign:"left", padding:"10px 14px", fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".07em", color:"#a855f7", whiteSpace:"nowrap", userSelect:"none" }}>
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
                  <tr><td colSpan={7} style={{ padding:"48px 20px", textAlign:"center", color:"#9ca3af", fontSize:13 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#d8b4fe" strokeWidth="1.5" style={{width:36,height:36,margin:"0 auto 8px",display:"block"}}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/></svg>
                    No users match your filters
                  </td></tr>
                ) : paginated.map((user, i) => {
                  const sc = STATUS_CONFIG[user.status];
                  return (
                    <tr key={user.id} className="row-anim es-row" style={{ animationDelay:`${i*30}ms`, borderBottom:"1px solid #fdf4ff" }}>

                      {/* # */}
                      <td style={{ padding:"10px 14px", fontSize:11, color:"#d8b4fe", fontWeight:600 }}>
                        {(page-1)*PER_PAGE+i+1}
                      </td>

                      {/* User */}
                      <td style={{ padding:"10px 14px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:32, height:32, borderRadius:"50%", background:AVATAR_PALETTE[user.id%AVATAR_PALETTE.length], color:"white", fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 2px 8px rgba(168,85,247,0.25)" }}>
                            {initials(user.name)}
                          </div>
                          <span style={{ fontSize:12, fontWeight:700, color:"#111827", whiteSpace:"nowrap" }}>{user.name}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding:"10px 14px" }}>
                        <span style={{ fontSize:11, color:"#6b7280" }}>{user.email}</span>
                      </td>

                      {/* Role */}
                      <td style={{ padding:"10px 14px" }}>
                        <RoleDropdown userId={user.id} currentRole={user.role} onChange={handleRoleChange}/>
                      </td>

                      {/* Status */}
                      <td style={{ padding:"10px 14px" }}>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:999, fontSize:11, fontWeight:700, background:sc.bg, color:sc.color }}>
                          <span style={{ width:6, height:6, borderRadius:"50%", background:sc.dot, display:"inline-block", flexShrink:0 }}/>
                          {user.status}
                        </span>
                      </td>

                      {/* Joined */}
                      <td style={{ padding:"10px 14px" }}>
                        <span style={{ fontSize:11, color:"#9ca3af", whiteSpace:"nowrap" }}>{user.joined}</span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding:"10px 14px" }}>
                        <button onClick={() => setDeleteTarget(user)} title="Delete user"
                          style={{ width:30, height:30, borderRadius:8, border:"none", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#d8b4fe", transition:"background .15s,color .15s" }}
                          onMouseEnter={e=>{e.currentTarget.style.background="#fff1f2";e.currentTarget.style.color="#f43f5e";}}
                          onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#d8b4fe";}}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{width:14,height:14}}>
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 16px", borderTop:"1px solid #fdf4ff", background:"#fdf9ff" }}>
            <span style={{ fontSize:11, color:"#9ca3af" }}>
              Showing <b style={{color:"#374151"}}>{filtered.length===0?0:(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE,filtered.length)}</b> of <b style={{color:"#374151"}}>{filtered.length}</b> users
            </span>
            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              <button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={page===1}
                style={{ width:28, height:28, borderRadius:8, border:"none", background:"transparent", cursor:page===1?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:page===1?"#e9d5ff":"#9ca3af", transition:"background .15s" }}
                onMouseEnter={e=>{ if(page>1){ e.currentTarget.style.background="#faf5ff"; e.currentTarget.style.color="#a855f7"; }}}
                onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=page===1?"#e9d5ff":"#9ca3af"; }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14}}><path d="M15 18l-6-6 6-6" strokeLinecap="round"/></svg>
              </button>

              {pageBtns.map((p, i) =>
                p === "…"
                  ? <span key={`e${i}`} style={{ width:24, textAlign:"center", fontSize:11, color:"#9ca3af" }}>…</span>
                  : <button key={p} onClick={()=>setCurrentPage(p)}
                      style={{ width:28, height:28, borderRadius:8, border:"none", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"all .15s",
                        background: page===p ? ES_GRAD : "transparent",
                        color:       page===p ? "white"  : "#6b7280",
                        boxShadow:   page===p ? "0 2px 8px rgba(168,85,247,0.25)" : "none" }}>
                      {p}
                    </button>
              )}

              <button onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                style={{ width:28, height:28, borderRadius:8, border:"none", background:"transparent", cursor:page===totalPages?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:page===totalPages?"#e9d5ff":"#9ca3af", transition:"background .15s" }}
                onMouseEnter={e=>{ if(page<totalPages){ e.currentTarget.style.background="#faf5ff"; e.currentTarget.style.color="#a855f7"; }}}
                onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=page===totalPages?"#e9d5ff":"#9ca3af"; }}>
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