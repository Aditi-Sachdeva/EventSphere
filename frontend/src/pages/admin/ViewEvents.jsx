
import  { useState } from "react";

export default function ViewEventsPage() {
  const [events] = useState([
    {
      id: 1,
      event: "Hackathon",
      club: "Coding Club",
      organizer: "Rahul Sharma",
      date: "12 May",
      seats: "30/50",
      status: "Pending",
    },
    {
      id: 2,
      event: "Dance Fest",
      club: "Dance Club",
      organizer: "Priya Gupta",
      date: "15 May",
      seats: "20/40",
      status: "Approved",
    },
    {
      id: 3,
      event: "Music Night",
      club: "Music Club",
      organizer: "Aman Singh",
      date: "18 May",
      seats: "10/30",
      status: "Rejected",
    },
  ]);

  const handleAction = (event, action) => {
    alert(`${action} clicked for ${event.event}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-purple-200 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">View Events</h1>
        <input
          type="text"
          placeholder="🔍 Search events..."
          className="border rounded-md px-3 py-2 shadow-sm focus:ring-pink-500 focus:border-pink-500"
        />
      </div>

      {/* Events Table */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-8">
        <table className="min-w-full text-sm">
          <thead className="bg-pink-100 text-purple-700">
            <tr>
              <th className="px-4 py-2 text-left">Event</th>
              <th className="px-4 py-2 text-left">Club</th>
              <th className="px-4 py-2 text-left">Organizer</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Seats</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id} className="border-t hover:bg-purple-50">
                <td className="px-4 py-2">{ev.event}</td>
                <td className="px-4 py-2">{ev.club}</td>
                <td className="px-4 py-2">{ev.organizer}</td>
                <td className="px-4 py-2">{ev.date}</td>
                <td className="px-4 py-2">{ev.seats}</td>
                <td className="px-4 py-2">
                  {ev.status === "Pending" && (
                    <span className="text-yellow-600 font-medium">⏳ Pending</span>
                  )}
                  {ev.status === "Approved" && (
                    <span className="text-green-600 font-medium">✅ Approved</span>
                  )}
                  {ev.status === "Rejected" && (
                    <span className="text-red-600 font-medium">❌ Rejected</span>
                  )}
                </td>
                <td className="px-4 py-2 space-x-2">
                  {ev.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleAction(ev, "Approve")}
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(ev, "Reject")}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {ev.status !== "Pending" && (
                    <button
                      onClick={() => handleAction(ev, "View")}
                      className="px-3 py-1 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     
    </div>
  );
}

