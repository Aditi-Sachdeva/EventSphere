import { useState } from "react";
import { Users, Plus, CheckCircle2, Sparkles } from "lucide-react";

const organizers = [
  { id: 1, name: "Aanya Sharma", email: "aanya@gmail.com" },
  { id: 2, name: "Rohan Mehta", email: "rohan@gmail.com" },
  { id: 3, name: "Priya Nair", email: "priya@gmail.com" },
];

export default function CreateClub() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !description || !organizer) return;

    setSuccess(true);

    setTimeout(() => {
      setName("");
      setDescription("");
      setOrganizer("");
      setSuccess(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6 font-sans">

      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
  <div>

    <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
      <div className="w-2 h-2 bg-indigo-500 rounded-full" />
      Administration
    </div>

    <h1 className="text-2xl font-extrabold text-gray-800 mt-1">
      Create a New Club
    </h1>

    <p className="text-sm text-gray-500">
      Set up a new community space for your members
    </p>

  </div>

  <div className="flex items-center gap-2 bg-white border px-4 py-2 rounded-xl text-sm text-gray-600 shadow-sm">
    <Users size={16} className="text-pink-500" />
    {organizers.length} organizers available
  </div>
</div>
      {/* Success */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 mb-6">
          <CheckCircle2 className="text-green-600" size={18} />
          <div>
            <p className="text-sm font-semibold text-green-800">
              Club created successfully!
            </p>
            <p className="text-xs text-green-600">
              The new club is now live.
            </p>
          </div>
          <Sparkles className="ml-auto text-green-400" size={16} />
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">

        {/* LEFT FORM */}
        <div className="col-span-2 space-y-6">

          {/* Club Details */}
          <div className="bg-white rounded-2xl border shadow-sm">

            <div className="border-b p-4">
              <h2 className="font-semibold text-gray-800">Club Details</h2>
              <p className="text-xs text-gray-500">
                Basic information about your club
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">

              {/* Name */}
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Club Name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Photography Enthusiasts"
                  className="w-full mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Description
                </label>

                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this club is about..."
                  className="w-full mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>

              {/* Organizer */}
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Organizer
                </label>

                <select
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  className="w-full mt-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">Select organizer</option>

                  {organizers.map((o) => (
                    <option key={o.id} value={o.name}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 items-center pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-pink-500 to-indigo-500 hover:opacity-90"
                >
                  <Plus size={16} />
                  Create Club
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setName("");
                    setDescription("");
                    setOrganizer("");
                  }}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Reset
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">

          {/* Live Preview */}
          <div className="bg-white rounded-2xl border shadow-sm">

            <div className="border-b p-4">
              <h2 className="font-semibold text-gray-800">
                Live Preview
              </h2>
              <p className="text-xs text-gray-500">
                How your club will appear
              </p>
            </div>

            <div className="p-4">

              <div className="border-2 border-dashed rounded-xl overflow-hidden">

                <div className="h-14 bg-gradient-to-r from-pink-500 to-indigo-500"></div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-800">
                    {name || "Club name"}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {description || "Description will appear here"}
                  </p>

                  {organizer && (
                    <p className="text-xs mt-3 text-gray-600">
                      Organizer: {organizer}
                    </p>
                  )}
                </div>

              </div>

            </div>
          </div>

          {/* Tips */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">

            <h3 className="flex items-center gap-2 font-semibold text-indigo-600 mb-3">
              <Sparkles size={16} />
              Tips for a great club
            </h3>

            <ul className="text-sm text-gray-600 space-y-2">
              <li>Use a clear and descriptive name.</li>
              <li>Explain what members will do.</li>
              <li>Choose an active organizer.</li>
            </ul>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl border shadow-sm">

            <div className="flex justify-between p-4 border-b">
              <div>
                <p className="text-sm font-semibold">Total Clubs</p>
                <p className="text-xs text-gray-500">
                  across platform
                </p>
              </div>

              <p className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 to-indigo-500 text-transparent bg-clip-text">
                24
              </p>
            </div>

            <div className="flex justify-between p-4">
              <div>
                <p className="text-sm font-semibold">
                  Active Organizers
                </p>
                <p className="text-xs text-gray-500">
                  available to assign
                </p>
              </div>

              <p className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 to-indigo-500 text-transparent bg-clip-text">
                10
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}