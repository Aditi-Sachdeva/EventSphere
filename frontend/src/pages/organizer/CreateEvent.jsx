import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import OrganizerLayout from "./OrganizerLayout";

const API = "http://localhost:5000/api";
const GRAD = "linear-gradient(to right, #ec4899, #6366f1)";
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

const EMPTY_FORM = { title: "", description: "", eventDate: "", location: "", totalSeats: "", image: "" };
const inp = "w-full mt-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50";

function fmt(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm]   = useState(EMPTY_FORM);
  const [busy, setBusy]   = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  }

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/login"); return; }
  }, []);

  async function handleCreateEvent() {
    const { title, description, eventDate, location, totalSeats } = form;
    if (!title || !description || !eventDate || !location || !totalSeats)
      return showToast("Please fill in all required fields", "error");
    setBusy(true);
    try {
      await axios.post(`${API}/event`, form, auth());
      showToast("Event created successfully!");
      setForm(EMPTY_FORM);
    } catch (e) {
      console.error(e.response?.data);
      showToast(e?.response?.data?.msg || "Failed to create event", "error");
    } finally {
      setBusy(false);
    }
  }

  const setField = key => e => setForm(p => ({ ...p, [key]: e.target.value }));

  const hasPreview = form.title || form.eventDate || form.location;

  return (
    <OrganizerLayout>
      {() => (
        <>
          {/* Page header */}
          <div className="mb-5 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
              Create a New Event
            </h2>
            <p className="text-gray-500 text-sm mt-1">Fill in the details to publish your event</p>
          </div>

          {/* Main layout: stacked on mobile, 3-col grid on lg */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">

            {/* Form — full width on mobile, 2 cols on lg */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-4 sm:px-6 py-4">
                <h3 className="font-semibold text-gray-800">Event Details</h3>
                <p className="text-xs text-gray-400 mt-0.5">All fields required except image URL</p>
              </div>

              <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                {/* Title */}
                <div>
                  <label className="text-sm font-semibold text-gray-600">Event Title</label>
                  <input
                    type="text"
                    value={form.title}
                    placeholder="e.g. Annual Tech Meetup"
                    onChange={setField("title")}
                    className={inp}
                  />
                </div>

                {/* Date/Time + Location — stacked on mobile, 2-col on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Date &amp; Time</label>
                    <input
                      type="datetime-local"
                      value={form.eventDate}
                      onChange={setField("eventDate")}
                      className={inp}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Location</label>
                    <input
                      type="text"
                      value={form.location}
                      placeholder="e.g. Main Auditorium"
                      onChange={setField("location")}
                      className={inp}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Total Seats</label>
                    <input
                      type="number"
                      value={form.totalSeats}
                      placeholder="e.g. 100"
                      onChange={setField("totalSeats")}
                      className={inp}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Image URL <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.image}
                      placeholder="https://..."
                      onChange={setField("image")}
                      className={inp}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-semibold text-gray-600">Description</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    placeholder="Describe what this event is about..."
                    onChange={setField("description")}
                    className={`${inp} resize-none`}
                  />
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    onClick={handleCreateEvent}
                    disabled={busy}
                    className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
                    style={{ background: GRAD }}
                  >
                    <Plus size={16} />
                    {busy ? "Creating..." : "Create Event"}
                  </button>
                  <button
                    onClick={() => setForm(EMPTY_FORM)}
                    className="px-4 sm:px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Side panel */}
            <div className="space-y-4 sm:space-y-5">
              {/* Tips */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 sm:p-5">
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

              {/* Live preview — only shown when form has content */}
              {hasPreview && (
                <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">Live Preview</p>
                  <div className="h-20 sm:h-24 bg-gradient-to-br from-pink-100 to-indigo-100 rounded-xl flex items-center justify-center mb-3 overflow-hidden">
                    {form.image
                      ? <img
                          src={form.image}
                          alt="preview"
                          className="w-full h-full object-cover rounded-xl"
                          onError={e => { e.target.style.display = "none"; }}
                        />
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

          {/* Toast */}
          {toast.msg && (
            <div className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 px-4 sm:px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2 max-w-[calc(100vw-2rem)]
              ${toast.type === "error"
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-white border border-gray-200 text-gray-800"}`}>
              {toast.type === "error"
                ? <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
                : <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />}
              <span className="truncate">{toast.msg}</span>
            </div>
          )}
        </>
      )}
    </OrganizerLayout>
  );
}