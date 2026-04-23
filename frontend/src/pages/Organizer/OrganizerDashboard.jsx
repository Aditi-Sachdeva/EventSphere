import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Plus, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";

const GRAD = "linear-gradient(to right, #ec4899, #6366f1)";
const API  = "http://localhost:5000/api";
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
const EMPTY = { title: "", description: "", clubId: "", eventDate: "", location: "", totalSeats: "", image: "" };
const inp  = "w-full mt-1 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";

export default function OrganizerDashboard() {
  const [page, setPage]     = useState("dashboard");
  const [open, setOpen]     = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get(`${API}/event`, auth())
      .then(r => setEvents(r.data.events || []))
      .catch(console.error);
  }, []);

  const stats = {
    total:     events.length,
    upcoming:  events.filter(e => e.status === "upcoming").length,
    cancelled: events.filter(e => e.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-pink-50">

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 bg-white border-b flex items-center justify-between px-5 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(o => !o)} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-indigo-50">☰</button>
          <Link to="/mainpage">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black" style={{ background: GRAD }}>ES</div>
          </Link>
          <h1 className="text-lg font-bold">
            Event<span style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Sphere</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 mr-16">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: GRAD }}>O</div>
          <span className="text-sm font-bold text-gray-800">Organizer</span>
        </div>
      </header>

      <div className="flex pt-16 flex-1">
        {/* Sidebar */}
        <aside className={`fixed top-16 left-0 bg-white border-r transition-all duration-300 ${open ? "w-56" : "w-16"}`} style={{ height: "calc(100vh - 64px)" }}>
          <nav className="p-2.5 flex flex-col gap-1">
            {[{ id: "dashboard", label: "Dashboard", icon: "⊞" }, { id: "create-event", label: "Create Event", icon: "＋" }].map(n => (
              <button key={n.id} onClick={() => setPage(n.id)}
                className={`w-full flex items-center gap-2.5 rounded-xl py-2.5 text-sm transition-all ${open ? "px-3" : "justify-center"} ${page === n.id ? "text-white font-bold shadow-lg" : "text-gray-500 hover:bg-indigo-50"}`}
                style={page === n.id ? { background: GRAD } : {}}>
                <span>{n.icon}</span>
                {open && <span>{n.label}</span>}
              </button>
            ))}
          </nav>
        </aside>

        <main className={`flex-1 transition-all duration-300 ${open ? "ml-56" : "ml-16"}`}>
          {page === "dashboard"    && <Dashboard stats={stats} events={events} />}
          {page === "create-event" && <CreateEvent onSuccess={() => axios.get(`${API}/event`, auth()).then(r => setEvents(r.data.events || []))} totalEvents={stats.total} />}
        </main>
      </div>
    </div>
  );
}

function Dashboard({ stats, events }) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full" /> Organizer
        </div>
        <h1 className="text-2xl font-extrabold text-gray-800">Organizer Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your events and activity</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total",     value: stats.total,     icon: "📅", bg: "bg-indigo-50", text: "text-indigo-500" },
          { label: "Upcoming",  value: stats.upcoming,  icon: "✅", bg: "bg-green-50",  text: "text-green-500"  },
          { label: "Cancelled", value: stats.cancelled, icon: "⏳", bg: "bg-yellow-50", text: "text-yellow-600" },
        ].map(c => (
          <div key={c.label} className="bg-white p-5 rounded-2xl border shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.text} flex items-center justify-center text-xl mb-3`}>{c.icon}</div>
            <p className="text-gray-400 text-sm">{c.label}</p>
            <p className="text-3xl font-black">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm">
        <div className="px-4 py-3 border-b rounded-t-2xl" style={{ background: "linear-gradient(to right, #eef2ff, #fdf2f8)" }}>
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" /> Recent Events
          </h2>
          <p className="text-xs text-gray-500 ml-4">Latest upcoming events</p>
        </div>
        {events.length === 0
          ? <p className="p-4 text-sm text-gray-400">No events yet</p>
          : events.slice(0, 5).map(ev => (
            <div key={ev._id} className="flex justify-between items-center px-4 py-3 border-b last:border-0">
              <div>
                <p className="font-semibold text-gray-800">{ev.title}</p>
                <p className="text-xs text-gray-400">{new Date(ev.eventDate).toLocaleDateString()} · {ev.location} · {ev.club?.name || ""}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${ev.status === "upcoming" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {ev.status}
              </span>
            </div>
          ))
        }
      </div>
    </div>
  );
}

function CreateEvent({ onSuccess, totalEvents }) {
  const [form, setForm]   = useState(EMPTY);
  const [clubs, setClubs] = useState([]);
  const [busy, setBusy]   = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });

  useEffect(() => {
    axios.get(`${API}/club/allClubs`)
      .then(r => setClubs((r.data.clubs || []).filter(c => c.isActive)))
      .catch(console.error);
  }, []);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  }

  async function submit() {
    const { title, description, clubId, eventDate, location, totalSeats } = form;
    if (!title || !description || !clubId || !eventDate || !location || !totalSeats)
      return showToast("Please fill in all fields", "error");
    setBusy(true);
    try {
      await axios.post(`${API}/event`, form, auth());
      showToast("Event created successfully!");
      onSuccess();
      setForm(EMPTY);
    } catch (e) {
      showToast(e?.response?.data?.msg || "Failed to create event", "error");
    } finally {
      setBusy(false);
    }
  }

  const fields = [
    { label: "Event Title", key: "title", placeholder: "e.g. Annual Tech Meetup" },
    { label: "Date & Time", key: "eventDate", type: "datetime-local" },
    { label: "Location",    key: "location",  placeholder: "e.g. Main Auditorium" },
    { label: "Total Seats", key: "totalSeats", type: "number", placeholder: "e.g. 100" },
    { label: "Image URL",   key: "image",     placeholder: "https://...", optional: true },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full" /> Organizer
        </div>
        <h1 className="text-2xl font-extrabold text-gray-800">Create a New Event</h1>
        <p className="text-sm text-gray-500">Fill in the details to submit your event</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl border shadow-sm">
          <div className="border-b p-4">
            <h2 className="font-semibold text-gray-800">Event Details</h2>
            <p className="text-xs text-gray-500">All fields required except image</p>
          </div>
          <div className="p-6 space-y-5">

            {/* Club select */}
            <div>
              <label className="text-sm font-semibold text-gray-600">Club</label>
              <select value={form.clubId} onChange={e => set("clubId", e.target.value)} className={inp}>
                <option value="">Select a club</option>
                {clubs.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            {/* Dynamic fields */}
            <div className="grid grid-cols-2 gap-4">
              {fields.map(f => (
                <div key={f.key} className={f.key === "title" ? "col-span-2" : ""}>
                  <label className="text-sm font-semibold text-gray-600">
                    {f.label} {f.optional && <span className="font-normal text-gray-400">(optional)</span>}
                  </label>
                  <input type={f.type || "text"} value={form[f.key]} placeholder={f.placeholder}
                    onChange={e => set(f.key, e.target.value)} className={inp} />
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-gray-600">Description</label>
              <textarea rows={4} value={form.description} onChange={e => set("description", e.target.value)}
                placeholder="Describe what this event is about..." className={`${inp} resize-none`} />
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={submit} disabled={busy}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60"
                style={{ background: GRAD }}>
                <Plus size={16} /> {busy ? "Creating..." : "Create Event"}
              </button>
              <button onClick={() => setForm(EMPTY)} className="px-4 py-2.5 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
            <h3 className="flex items-center gap-2 font-semibold text-indigo-600 mb-3"><Sparkles size={16} /> Tips</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              {["Use a clear and descriptive title.", "Pick a date well in advance.", "Explain what attendees will experience."].map(t => (
                <li key={t}>✦ {t}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl border shadow-sm p-4 flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-gray-800">My Events</p>
              <p className="text-xs text-gray-400">submitted so far</p>
            </div>
            <p className="text-2xl font-extrabold bg-clip-text text-transparent" style={{ backgroundImage: GRAD }}>{totalEvents}</p>
          </div>
        </div>
      </div>

      {toast.msg && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white flex items-center gap-2 ${toast.type === "error" ? "bg-red-500" : ""}`}
          style={toast.type !== "error" ? { background: GRAD } : {}}>
          {toast.type === "error" ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}