import { useState, useEffect } from "react";
import { Users, Plus, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import API from "../../api/api";

const GRAD = "linear-gradient(to right, #ec4899, #6366f1)";

export default function CreateClub() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [organizerId, setOrganizerId] = useState("");

  const [organizers, setOrganizers] = useState([]);
  const [loadingOrganizers, setLoadingOrganizers] = useState(true);

  const [totalClubs, setTotalClubs] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });

  // Fetch organizers (users with role === "organizer") and total clubs count
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, clubsRes] = await Promise.all([
          API.get("/admin/users"),
          API.get("/admin/clubs"),
        ]);

        const allUsers = usersRes.data.users || [];
        setOrganizers(allUsers);
        setTotalClubs(clubsRes.data.clubs?.length || 0);
      } catch (err) {
        showToast("Failed to load data", "error");
      } finally {
        setLoadingOrganizers(false);
      }
    };

    fetchData();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim() || !organizerId) {
      showToast("Please fill in all fields", "error");
      return;
    }

    setSubmitting(true);
    try {
      await API.post("/admin/club/create", {
        name: name.trim(),
        description: description.trim(),
        mainOrganizerId: organizerId,
      });

      showToast("Club created successfully!");
      setTotalClubs((prev) => prev + 1);
      setName("");
      setDescription("");
      setOrganizerId("");
    } catch (err) {
      const msg = err?.response?.data?.msg || "Failed to create club";
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setDescription("");
    setOrganizerId("");
  };

  const selectedOrganizer = organizers.find((o) => o._id === organizerId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">

      {/* Header */}
      <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full" />
            Administration
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800 mt-1">Create a New Club</h1>
          <p className="text-sm text-gray-500">Set up a new community space for your members</p>
        </div>

        <div className="flex items-center gap-2 bg-white border px-4 py-2 rounded-xl text-sm text-gray-600 shadow-sm">
          <Users size={16} className="text-pink-500" />
          {loadingOrganizers ? "Loading..." : `${organizers.length} organizers available`}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* LEFT — Form */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border shadow-sm">

            <div className="border-b p-4">
              <h2 className="font-semibold text-gray-800">Club Details</h2>
              <p className="text-xs text-gray-500">Basic information about your club</p>
            </div>

            <div className="p-6 space-y-5">

              {/* Club Name */}
              <div>
                <label className="text-sm font-semibold text-gray-600">Club Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Photography Enthusiasts"
                  className="w-full mt-1 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-gray-600">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this club is about..."
                  className="w-full mt-1 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                />
              </div>

              {/* Organizer */}
              <div>
                <label className="text-sm font-semibold text-gray-600">Organizer</label>
                {loadingOrganizers ? (
                  <div className="mt-1 border rounded-lg px-4 py-2.5 text-sm text-gray-400 bg-gray-50 animate-pulse">
                    Loading organizers...
                  </div>
                ) : organizers.length === 0 ? (
                  <div className="mt-1 border border-amber-200 rounded-lg px-4 py-2.5 text-sm text-amber-600 bg-amber-50 flex items-center gap-2">
                    <AlertCircle size={14} />
                    No organizers found. Assign the Organizer role to users first.
                  </div>
                ) : (
                  <select
                    value={organizerId}
                    onChange={(e) => setOrganizerId(e.target.value)}
                    className="w-full mt-1 border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="">Select an organizer</option>
                    {organizers.map((o) => (
                      <option key={o._id} value={o._id}>
                        {o.name} — {o.email}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Selected organizer info */}
              {selectedOrganizer && (
                <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ background: GRAD }}
                  >
                    {selectedOrganizer.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{selectedOrganizer.name}</div>
                    <div className="text-xs text-gray-400">{selectedOrganizer.email}</div>
                  </div>
                  <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-600 border border-indigo-200">
                    Organizer
                  </span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 items-center pt-1">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: GRAD }}
                >
                  <Plus size={16} />
                  {submitting ? "Creating..." : "Create Club"}
                </button>

                <button
                  onClick={handleReset}
                  disabled={submitting}
                  className="px-4 py-2.5 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
                >
                  Reset
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT — Stats + Tips only */}
        <div className="space-y-6">

          {/* Tips */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
            <h3 className="flex items-center gap-2 font-semibold text-indigo-600 mb-3">
              <Sparkles size={16} />
              Tips for a great club
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>✦ Use a clear and descriptive name.</li>
              <li>✦ Explain what members will do.</li>
              <li>✦ Choose an active organizer.</li>
            </ul>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <p className="text-sm font-semibold text-gray-800">Total Clubs</p>
                <p className="text-xs text-gray-400">across platform</p>
              </div>
              <p
                className="text-2xl font-extrabold bg-clip-text text-transparent"
                style={{ backgroundImage: GRAD }}
              >
                {totalClubs}
              </p>
            </div>

            <div className="flex justify-between items-center p-4">
              <div>
                <p className="text-sm font-semibold text-gray-800">Active Organizers</p>
                <p className="text-xs text-gray-400">available to assign</p>
              </div>
              <p
                className="text-2xl font-extrabold bg-clip-text text-transparent"
                style={{ backgroundImage: GRAD }}
              >
                {loadingOrganizers ? "—" : organizers.length}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Toast */}
      {toast.msg && (
        <div
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white flex items-center gap-2 transition-all ${
            toast.type === "error" ? "bg-red-500" : ""
          }`}
          style={toast.type !== "error" ? { background: GRAD } : {}}
        >
          {toast.type === "error" ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
          {toast.msg}
        </div>
      )}

    </div>
  );
}