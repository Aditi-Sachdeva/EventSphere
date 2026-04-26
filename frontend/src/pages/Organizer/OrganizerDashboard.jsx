import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";

const API  = "http://localhost:5000/api";
const GRAD = "linear-gradient(to right, #ec4899, #6366f1)";
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

const EMPTY_FORM = {
  title: "", description: "", clubId: "",
  eventDate: "", location: "", totalSeats: "", image: ""
};

const inp = "w-full mt-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50";

function fmt(dateStr) {
  if (!dateStr) return "Date not set";
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function getInitials(name = "") {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

const AVATAR_GRADS = [
  "from-pink-500 to-indigo-600",
  "from-indigo-500 to-purple-600",
  "from-pink-400 to-rose-500",
  "from-violet-500 to-indigo-500",
  "from-fuchsia-500 to-pink-500",
];

function avatarGrad(name = "") {
  return AVATAR_GRADS[(name.charCodeAt(0) || 0) % AVATAR_GRADS.length];
}

function statusPill(status) {
  switch ((status || "upcoming").toLowerCase()) {
    case "ongoing":   return "bg-green-100 text-green-700";
    case "cancelled": return "bg-red-100 text-red-600";
    default:          return "bg-indigo-100 text-indigo-700";
  }
}

function Toast({ toast }) {
  if (!toast?.msg) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2 transition-all
      ${toast.type === "error"
        ? "bg-red-50 border border-red-200 text-red-700"
        : "bg-white border border-gray-200 text-gray-800"}`}>
      {toast.type === "error"
        ? <AlertCircle size={15} className="text-red-500" />
        : <CheckCircle2 size={15} className="text-green-500" />}
      {toast.msg}
    </div>
  );
}

function CalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round"/>
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <circle cx="9" cy="7" r="4"/>
      <path d="M3 21c0-4 2.7-7 6-7M15 14l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PlusCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 8v8M8 12h8" strokeLinecap="round"/>
    </svg>
  );
}

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const [user, setUser]                     = useState(null);
  const [activePage, setActivePage]         = useState("events");
  const [dropdownOpen, setDropdownOpen]     = useState(false);
  const [toast, setToast]                   = useState({ msg: "", type: "" });

  // Club Events
  const [clubEvents, setClubEvents]         = useState([]);
  const [eventsLoading, setEventsLoading]   = useState(true);
  const [eventFilter, setEventFilter]       = useState("all");

  // Member Approvals
  // Each member shape from backend: { user: { _id, name, email }, status, _id }
  const [pendingMembers, setPendingMembers]   = useState([]);
  const [approvedMembers, setApprovedMembers] = useState([]);
  const [approvalsLoading, setApprovalsLoading] = useState(true);
  const [actionLoading, setActionLoading]     = useState(null);
  const [clubName, setClubName]               = useState("");

  // Create Event
  const [form, setForm]   = useState(EMPTY_FORM);
  const [clubs, setClubs] = useState([]);
  const [busy, setBusy]   = useState(false);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  }

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/login"); return; }
    const parsed = JSON.parse(stored);
    setUser(parsed);

    // clubId may be stored directly or nested under club
    const clubId = parsed?.clubId || parsed?.club?._id || parsed?.club;
    if (clubId) {
      fetchClubEvents(clubId);
      fetchPendingMembers(clubId);
    } else {
      setEventsLoading(false);
      setApprovalsLoading(false);
    }

    // Fetch clubs for Create Event dropdown (all active clubs)
    axios.get(`${API}/club/allClubs`, auth())
      .then(r => setClubs((r.data.clubs || []).filter(c => c.isActive)))
      .catch(console.error);
  }, []);

  // GET /api/event/club/:clubId
  async function fetchClubEvents(clubId) {
    setEventsLoading(true);
    try {
      const res = await axios.get(`${API}/event/club/${clubId}`, auth());
      setClubEvents(res.data.events || res.data || []);
    } catch (e) {
      console.error(e);
      showToast("Failed to load club events", "error");
    } finally {
      setEventsLoading(false);
    }
  }

  // GET /api/club/:clubId/pending
  // Response: { pending: [{user:{_id,name,email}, status}], approved: [...], clubName }
  async function fetchPendingMembers(clubId) {
    setApprovalsLoading(true);
    try {
      const res = await axios.get(`${API}/club/${clubId}/pending`, auth());
      setPendingMembers(res.data.pending   || []);
      setApprovedMembers(res.data.approved || []);
      setClubName(res.data.clubName || "");
    } catch (e) {
      console.error(e);
      showToast("Failed to load member requests", "error");
    } finally {
      setApprovalsLoading(false);
    }
  }

  // POST /api/club/approve  { clubId, userId }
  async function handleApprove(userId) {
    const clubId = user?.clubId || user?.club?._id || user?.club;
    setActionLoading(userId);
    try {
      await axios.post(`${API}/club/approve`, { clubId, userId }, auth());
      const moved = pendingMembers.find(m => (m.user?._id || m.user) === userId);
      setPendingMembers(prev => prev.filter(m => (m.user?._id || m.user) !== userId));
      if (moved) setApprovedMembers(prev => [{ ...moved, status: "approved" }, ...prev]);
      showToast(`${moved?.user?.name || "Member"} approved successfully`);
    } catch (e) {
      showToast(e?.response?.data?.msg || "Failed to approve member", "error");
    } finally {
      setActionLoading(null);
    }
  }

  // POST /api/club/remove  { clubId, userId }
  async function handleReject(userId) {
    const clubId = user?.clubId || user?.club?._id || user?.club;
    setActionLoading(userId + "_r");
    try {
      await axios.post(`${API}/club/remove`, { clubId, userId }, auth());
      const removed = pendingMembers.find(m => (m.user?._id || m.user) === userId);
      setPendingMembers(prev => prev.filter(m => (m.user?._id || m.user) !== userId));
      showToast(`${removed?.user?.name || "Request"} rejected`);
    } catch (e) {
      showToast(e?.response?.data?.msg || "Failed to reject request", "error");
    } finally {
      setActionLoading(null);
    }
  }

  // POST /api/event  (requires admin role per your route middleware)
  async function handleCreateEvent() {
    const { title, description, clubId, eventDate, location, totalSeats } = form;
    if (!title || !description || !clubId || !eventDate || !location || !totalSeats)
      return showToast("Please fill in all required fields", "error");

    setBusy(true);
    try {
      await axios.post(`${API}/event`, form, auth());
      showToast("Event created successfully!");
      setForm(EMPTY_FORM);
      // refresh events if same club
      const myClubId = user?.clubId || user?.club?._id || user?.club;
      if (myClubId && form.clubId === myClubId) fetchClubEvents(myClubId);
    } catch (e) {
      showToast(e?.response?.data?.msg || "Failed to create event", "error");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    try { await axios.post(`${API}/auth/logout`, {}, auth()); } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const filteredEvents = eventFilter === "all"
    ? clubEvents
    : clubEvents.filter(e => (e.status || "upcoming").toLowerCase() === eventFilter);

  const setField = key => e => setForm(p => ({ ...p, [key]: e.target.value }));

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow border-b border-gray-200 h-16">
        <div className="max-w-7xl mx-auto px-5 h-full flex justify-between items-center">
          <Link to="/mainpage" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-indigo-600 text-white flex items-center justify-center rounded-lg font-bold shadow-md text-xs">ES</div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">EventSphere</h1>
          </Link>

          <div className="hidden md:flex gap-6">
            {[["Home", "/mainpage"], ["Events", "/events"], ["Clubs", "/clubs"]].map(([label, path]) => (
              <Link key={path} to={path}
                className="px-3 py-1 text-sm rounded-md text-gray-600 hover:text-transparent hover:bg-gradient-to-r hover:from-pink-500 hover:to-indigo-600 bg-clip-text transition">
                {label}
              </Link>
            ))}
            <span className="px-3 py-1 text-sm bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-md font-semibold shadow-sm">Dashboard</span>
          </div>

          <div className="relative">
            <button onClick={() => setDropdownOpen(o => !o)}
              className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md shadow border border-gray-300 hover:shadow-lg transition">
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-indigo-600 text-white font-bold text-xs">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-sm text-gray-800">{user.name}</span>
              <span className="text-gray-500 text-xs">▼</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
                {user.role === "admin" && (
                  <button onClick={() => navigate("/admin")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Admin Dashboard</button>
                )}
                <button onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="pt-16 flex min-h-screen">

        {/* ── Sidebar ── */}
        <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-56 bg-white border-r border-gray-200 flex flex-col z-40">
          <div className="px-5 py-5 border-b border-gray-100">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Organizer</p>
            <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
            {clubName && <p className="text-xs text-indigo-500 mt-0.5 truncate">{clubName}</p>}
          </div>

          <nav className="flex-1 py-4 space-y-1 px-3">
            {[
              { id: "events",    label: "Club Events",      Icon: CalIcon },
              { id: "approvals", label: "Member Approvals", Icon: PeopleIcon, badge: pendingMembers.length },
              { id: "create",    label: "Create Event",     Icon: PlusCircleIcon },
            ].map(({ id, label, Icon, badge }) => (
              <button key={id} onClick={() => setActivePage(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition
                  ${activePage === id
                    ? "bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"}`}>
                <Icon />
                {label}
                {badge > 0 && (
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-semibold
                    ${activePage === id ? "bg-white/30 text-white" : "bg-red-100 text-red-600"}`}>
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="px-5 py-4 border-t border-gray-100">
            <Link to="/mainpage" className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-700 transition">
              ← Back to Home
            </Link>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="ml-56 flex-1 p-8 bg-gradient-to-b from-gray-50 via-pink-50/20 to-indigo-50/20 min-h-[calc(100vh-4rem)]">

          {/* ════ CLUB EVENTS ════ */}
          {activePage === "events" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">Club Events</h2>
                <p className="text-gray-500 text-sm mt-1">All events organized by {clubName || "your club"}</p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-5 mb-8">
                {[
                  { label: "Total Events",       value: clubEvents.length },
                  { label: "Upcoming",            value: clubEvents.filter(e => (e.status || "upcoming") === "upcoming").length },
                  { label: "Total Registrations", value: clubEvents.reduce((s, e) => s + (e.registrations?.length ?? 0), 0) },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">{value}</p>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {["all", "upcoming", "ongoing", "cancelled"].map(f => (
                  <button key={f} onClick={() => setEventFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition
                      ${eventFilter === f
                        ? "bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-sm"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-pink-300"}`}>
                    {f}
                  </button>
                ))}
              </div>

              {/* Events grid */}
              {eventsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1,2,3].map(i => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                      <div className="h-36 bg-gray-100 rounded-xl mb-4"/>
                      <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"/>
                      <div className="h-3 bg-gray-100 rounded w-1/2"/>
                    </div>
                  ))}
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4 text-2xl">📅</div>
                  <p className="text-gray-500 text-sm">No {eventFilter !== "all" ? eventFilter : ""} events found.</p>
                  <button onClick={() => setActivePage("create")}
                    className="mt-3 text-sm font-semibold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
                    Create your first event →
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map(event => (
                    <div key={event._id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden">
                      {event.image
                        ? <img src={event.image} alt={event.title} className="h-36 w-full object-cover" />
                        : <div className="h-36 bg-gradient-to-br from-pink-100 to-indigo-100 flex items-center justify-center px-4">
                            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent text-center line-clamp-2">{event.title}</span>
                          </div>
                      }
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <h4 className="font-semibold text-gray-800 text-base leading-snug">{event.title}</h4>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap flex-shrink-0 capitalize ${statusPill(event.status)}`}>
                            {event.status || "upcoming"}
                          </span>
                        </div>
                        <div className="space-y-1.5 mb-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1.5">📅 {fmt(event.eventDate)}</div>
                          {event.location  && <div className="flex items-center gap-1.5">📍 {event.location}</div>}
                          <div className="flex items-center gap-1.5">
                            👥 {event.registrations?.length ?? 0} / {event.totalSeats ?? "∞"} registered
                          </div>
                        </div>
                        <div className="mt-auto flex gap-2">
                          <Link to={`/events/${event._id}`}
                            className="flex-1 text-center py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:border-pink-300 hover:text-pink-600 transition">
                            View
                          </Link>
                          <Link to={`/events/${event._id}/edit`}
                            className="flex-1 text-center py-2 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition"
                            style={{ background: GRAD }}>
                            Manage
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ════ MEMBER APPROVALS ════ */}
          {activePage === "approvals" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">Member Approvals</h2>
                <p className="text-gray-500 text-sm mt-1">Review join requests for {clubName || "your club"}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-5 mb-8">
                {[
                  { label: "Pending Requests", value: pendingMembers.length },
                  { label: "Approved Members", value: approvedMembers.length },
                  { label: "Club",             value: clubName || "—", large: false },
                ].map(({ label, value, large = true }) => (
                  <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{label}</p>
                    <p className={`font-extrabold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent ${large ? "text-3xl" : "text-lg truncate"}`}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pending requests */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  Pending Requests
                  {pendingMembers.length > 0 && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">{pendingMembers.length}</span>
                  )}
                </h3>

                {approvalsLoading ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0"/>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-100 rounded w-1/3 mb-2"/>
                          <div className="h-3 bg-gray-100 rounded w-1/2"/>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : pendingMembers.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                    <div className="w-14 h-14 mx-auto bg-gradient-to-br from-pink-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4 text-2xl">✓</div>
                    <p className="text-gray-500 text-sm font-medium">All caught up!</p>
                    <p className="text-gray-400 text-xs mt-1">No pending join requests at the moment.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingMembers.map(member => {
                      // member.user is populated: { _id, name, email }
                      const uid   = member.user?._id;
                      const name  = member.user?.name  || "Unknown";
                      const email = member.user?.email || "";
                      return (
                        <div key={uid} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarGrad(name)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                            {getInitials(name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 text-sm">{name}</p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{email}</p>
                            <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full mt-1.5 inline-block font-medium">Pending</span>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => handleApprove(uid)} disabled={actionLoading === uid}
                              className="px-4 py-2 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
                              style={{ background: GRAD }}>
                              {actionLoading === uid ? "..." : "Approve"}
                            </button>
                            <button onClick={() => handleReject(uid)} disabled={actionLoading === uid + "_r"}
                              className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-50">
                              {actionLoading === uid + "_r" ? "..." : "Reject"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Approved members */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  Approved Members
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">{approvedMembers.length}</span>
                </h3>
                {approvedMembers.length === 0 ? (
                  <p className="text-gray-400 text-sm">No approved members yet.</p>
                ) : (
                  <div className="space-y-3">
                    {approvedMembers.map(member => {
                      const uid   = member.user?._id;
                      const name  = member.user?.name  || "Unknown";
                      const email = member.user?.email || "";
                      return (
                        <div key={uid} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 opacity-75">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarGrad(name)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                            {getInitials(name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 text-sm">{name}</p>
                            <p className="text-xs text-gray-500 truncate">{email}</p>
                          </div>
                          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold flex-shrink-0">✓ Member</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════ CREATE EVENT ════ */}
          {activePage === "create" && (
            <div>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold mb-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full" /> Organizer
                </div>
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">Create a New Event</h2>
                <p className="text-gray-500 text-sm mt-1">Fill in the details to publish your event</p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* ── Form ── */}
                <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="border-b border-gray-100 px-6 py-4">
                    <h3 className="font-semibold text-gray-800">Event Details</h3>
                    <p className="text-xs text-gray-400 mt-0.5">All fields required except image URL</p>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Club */}
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Club</label>
                      <select value={form.clubId} onChange={setField("clubId")} className={inp}>
                        <option value="">Select a club</option>
                        {clubs.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Event Title</label>
                      <input type="text" value={form.title} placeholder="e.g. Annual Tech Meetup"
                        onChange={setField("title")} className={inp} />
                    </div>

                    {/* 2-col row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Date &amp; Time</label>
                        <input type="datetime-local" value={form.eventDate} onChange={setField("eventDate")} className={inp} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Location</label>
                        <input type="text" value={form.location} placeholder="e.g. Main Auditorium"
                          onChange={setField("location")} className={inp} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">Total Seats</label>
                        <input type="number" value={form.totalSeats} placeholder="e.g. 100"
                          onChange={setField("totalSeats")} className={inp} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-600">
                          Image URL <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <input type="text" value={form.image} placeholder="https://..."
                          onChange={setField("image")} className={inp} />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Description</label>
                      <textarea rows={4} value={form.description}
                        placeholder="Describe what this event is about..."
                        onChange={setField("description")}
                        className={`${inp} resize-none`} />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                      <button onClick={handleCreateEvent} disabled={busy}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
                        style={{ background: GRAD }}>
                        <Plus size={16} />
                        {busy ? "Creating..." : "Create Event"}
                      </button>
                      <button onClick={() => setForm(EMPTY_FORM)}
                        className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── Side panel ── */}
                <div className="space-y-5">
                  {/* Tips */}
                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
                    <h4 className="flex items-center gap-2 font-semibold text-indigo-600 mb-3 text-sm">
                      <Sparkles size={15} /> Tips for a great event
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-2.5">
                      <li className="flex gap-2"><span className="text-indigo-400">✦</span>Use a clear and descriptive title.</li>
                      <li className="flex gap-2"><span className="text-indigo-400">✦</span>Pick a date well in advance.</li>
                      <li className="flex gap-2"><span className="text-indigo-400">✦</span>Describe what attendees will experience.</li>
                      <li className="flex gap-2"><span className="text-indigo-400">✦</span>Add a banner image to attract sign-ups.</li>
                    </ul>
                  </div>

                  {/* Live preview — only show when user has typed something */}
                  {(form.title || form.eventDate || form.location) && (
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">Live Preview</p>
                      <div className="h-24 bg-gradient-to-br from-pink-100 to-indigo-100 rounded-xl flex items-center justify-center mb-3 overflow-hidden">
                        {form.image
                          ? <img src={form.image} alt="preview" className="w-full h-full object-cover rounded-xl"
                              onError={e => { e.target.style.display = "none"; }} />
                          : <span className="text-sm font-bold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent px-3 text-center line-clamp-2">
                              {form.title || "Event Title"}
                            </span>
                        }
                      </div>
                      <p className="font-semibold text-sm text-gray-800 line-clamp-1">{form.title || "—"}</p>
                      {form.eventDate  && <p className="text-xs text-gray-500 mt-1">📅 {fmt(form.eventDate)}</p>}
                      {form.location   && <p className="text-xs text-gray-500 mt-0.5">📍 {form.location}</p>}
                      {form.totalSeats && <p className="text-xs text-gray-500 mt-0.5">👥 {form.totalSeats} seats</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      <Toast toast={toast} />
    </div>
  );
}