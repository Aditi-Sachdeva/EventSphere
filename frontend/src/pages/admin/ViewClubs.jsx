
import  { useState } from "react";

export default function ViewClubsPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const clubs = [
    {
      id: 1,
      name: "Coding Club",
      organizer: "Rahul",
      organizers: "Rahul, Priya",
      status: "Active",
    },
    {
      id: 2,
      name: "Music Club",
      organizer: "Aman",
      organizers: "Aman",
      status: "Inactive",
    },
  ];

  const filteredClubs = clubs.filter((club) => {
    const matchesFilter =
      filter === "All" || club.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = club.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAction = (club) => {
    alert(
      club.status === "Active"
        ? `Deactivated ${club.name}`
        : `Reactivated ${club.name}`
    );
  };

  return (
    <div className="min-h-screen bg-purple-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => alert("Navigate to Create Club page")}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          + Create Club
        </button>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-3 py-2 shadow-sm focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      {/* Filter */}
      <div className="flex space-x-4 mb-4">
        {["All", "Active", "Inactive"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-md ${
              filter === f
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-purple-100 text-purple-700">
            <tr>
              <th className="px-4 py-2 text-left">Club Name</th>
              <th className="px-4 py-2 text-left">Organizer</th>
              <th className="px-4 py-2 text-left">Organizers</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClubs.map((club) => (
              <tr key={club.id} className="border-t">
                <td className="px-4 py-2">{club.name}</td>
                <td className="px-4 py-2">{club.organizer}</td>
                <td className="px-4 py-2">{club.organizers}</td>
                <td className="px-4 py-2">
                  {club.status === "Active" ? (
                    <span className="text-green-600">🟢 Active</span>
                  ) : (
                    <span className="text-red-600">🔴 Inactive</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleAction(club)}
                    className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    {club.status === "Active" ? "Deactivate" : "Reactivate"}
                  </button>
                </td>
              </tr>
            ))}
            {filteredClubs.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-6 text-center text-gray-500 italic"
                >
                  No clubs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

