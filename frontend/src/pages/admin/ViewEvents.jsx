
import { useState, useEffect, useCallback } from "react";
import axios from "../../api/axios";

const GRAD = "linear-gradient(to right, #ec4899, #6366f1)";

const statusStyle = (status) => {
  switch (status) {
    case "approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "pending":
    case "upcoming":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";

    case "rejected":
      return "bg-red-50 text-red-600 border-red-200";

    case "cancelled":
      return "bg-gray-100 text-gray-600 border-gray-200";

    case "completed":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";

    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

const normalizeStatus = (status) => {
  return status === "upcoming" ? "pending" : status;
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function ViewEvents() {
  const [events, setEvents] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [toast, setToast] = useState({
    msg: "",
    type: "",
  });

  const [selectedEvent, setSelected] = useState(null);
  const [actioningId, setActioning] = useState(null);
  const [confirm, setConfirm] = useState(null);

  // Toast notification
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
  }, []);

  useEffect(() => {
    if (!toast.msg) return;

    const timer = setTimeout(() => {
      setToast({ msg: "", type: "" });
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  // Fetch all events
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const response = await axios.get("/api/admin/events");

      const fetchedEvents = response.data?.events;

      if (!Array.isArray(fetchedEvents)) {
        throw new Error("Invalid event data received from server.");
      }

      setEvents(fetchedEvents);

    } catch (error) {
      console.error(
        "Failed to fetch events:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      setLoadError(
        error.response?.data?.msg ||
        error.message ||
        "Failed to fetch events."
      );

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Approve or reject event
  const updateStatus = async (eventId, action) => {
    if (!eventId || actioningId !== null) return;

    const event = events.find((item) => item._id === eventId);

    if (!event || normalizeStatus(event.status) !== "pending") {
      showToast(
        "Only pending events can be approved or rejected.",
        "error"
      );
      setConfirm(null);
      return;
    }

    setActioning(eventId);
    setConfirm(null);

    try {
      const response = await axios.put(
        `/api/admin/event/${action}/${eventId}`
      );

      const updatedEvent = response.data?.event;

      const newStatus =
        action === "approve" ? "approved" : "rejected";

      setEvents((prev) =>
        prev.map((item) =>
          item._id === eventId
            ? {
                ...item,
                ...(updatedEvent || {}),
                status: newStatus,
              }
            : item
        )
      );

      setSelected((prev) =>
        prev?._id === eventId
          ? {
              ...prev,
              ...(updatedEvent || {}),
              status: newStatus,
            }
          : prev
      );

      showToast(
        response.data?.msg ||
        `Event ${newStatus} successfully`
      );

    } catch (error) {
      console.error(
        "Event status update failed:",
        error.response?.data || error
      );

      showToast(
        error.response?.data?.msg ||
        `Failed to ${action} event.`,
        "error"
      );

    } finally {
      setActioning(null);
    }
  };

  // Statistics
  const stats = {
    total: events.length,

    pending: events.filter(
      (event) => normalizeStatus(event.status) === "pending"
    ).length,

    approved: events.filter(
      (event) => event.status === "approved"
    ).length,

    rejected: events.filter(
      (event) => event.status === "rejected"
    ).length,
  };

  // Search and filter
  const filtered = events.filter((event) => {
    const q = search.toLowerCase();

    const matchSearch =
      !search ||
      event.title?.toLowerCase().includes(q) ||
      event.club?.name?.toLowerCase().includes(q) ||
      event.createdBy?.name?.toLowerCase().includes(q);

    const normalizedStatus = normalizeStatus(event.status);

    const matchStatus =
      statusFilter === "all" ||
      normalizedStatus === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 py-6 sm:py-8 px-3 sm:px-4">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-5 sm:mb-6">

          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              Administration
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              Manage Events
            </h1>

            <p className="text-sm text-gray-500">
              Review and moderate club events
            </p>
          </div>

          {stats.pending > 0 && (
            <div className="self-start sm:self-auto bg-yellow-100 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 whitespace-nowrap">
              ⚡ {stats.pending} pending review
            </div>
          )}

        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">

          {[
            {
              label: "Total",
              value: stats.total,
              bg: "bg-indigo-100",
              color: "text-indigo-700",
              icon: "📅",
            },
            {
              label: "Pending",
              value: stats.pending,
              bg: "bg-yellow-100",
              color: "text-yellow-700",
              icon: "⏳",
            },
            {
              label: "Approved",
              value: stats.approved,
              bg: "bg-emerald-100",
              color: "text-emerald-700",
              icon: "✅",
            },
            {
              label: "Rejected",
              value: stats.rejected,
              bg: "bg-red-100",
              color: "text-red-700",
              icon: "❌",
            },
          ].map((item) => (

            <div
              key={item.label}
              className="bg-white rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4 hover:shadow-md transition-all"
            >
              <div
                className={`w-9 h-9 sm:w-12 sm:h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center text-lg sm:text-2xl shrink-0`}
              >
                {item.icon}
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {item.value}
                </div>

                <div className="text-xs text-gray-500 mt-0.5">
                  {item.label}
                </div>
              </div>
            </div>

          ))}

        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 mb-5 sm:mb-6 shadow-sm flex flex-col gap-3">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, clubs, organizers..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <div className="flex items-center gap-2 flex-wrap">

            <span className="text-xs font-semibold text-gray-400">
              Status:
            </span>

            {["all", "pending", "approved", "rejected"].map((status) => (

              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  statusFilter === status
                    ? "text-white border-transparent shadow-md"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-indigo-50"
                }`}
                style={
                  statusFilter === status
                    ? { background: GRAD }
                    : {}
                }
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>

            ))}

          </div>

        </div>

        {/* Events Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">

          {/* Desktop Header */}
          <div className="hidden md:grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">

            <div className="col-span-4">
              Event
            </div>

            <div className="col-span-3">
              Club / Organizer
            </div>

            <div className="col-span-2">
              Date
            </div>

            <div className="col-span-2">
              Status
            </div>

            <div className="col-span-1 text-right">
              Actions
            </div>

          </div>

          {/* Loading */}
          {loading ? (

            <div className="p-12 text-center text-gray-400 text-sm animate-pulse">
              Loading events...
            </div>

          ) : loadError ? (

            <div className="p-8 sm:p-12 text-center">

              <p className="text-red-500 text-sm font-semibold mb-2">
                Unable to load events
              </p>

              <p className="text-gray-500 text-sm mb-4">
                {loadError}
              </p>

              <button
                onClick={fetchEvents}
                className="px-5 py-2 rounded-xl text-white text-sm font-semibold"
                style={{ background: GRAD }}
              >
                Try Again
              </button>

            </div>

          ) : filtered.length === 0 ? (

            <div className="p-12 text-center text-gray-400 text-sm">
              No events found
            </div>

          ) : (

            <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">

              {filtered.map((event) => {

                const normalizedStatus = normalizeStatus(event.status);

                const canModerate =
                  normalizedStatus === "pending";

                const busy = actioningId === event._id;

                return (

                  <div
                    key={event._id}
                    className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
                  >

                    {/* Desktop Row */}
                    <div className="hidden md:grid grid-cols-12 items-center gap-2">

                      {/* Event */}
                      <div className="col-span-4 flex items-center gap-3">

                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm uppercase shrink-0"
                          style={{ background: GRAD }}
                        >
                          {event.title?.[0] || "E"}
                        </div>

                        <div className="min-w-0">

                          <div
                            className="font-semibold text-gray-900 text-sm cursor-pointer hover:text-indigo-600 truncate"
                            onClick={() => setSelected(event)}
                          >
                            {event.title}
                          </div>

                          <div className="text-xs text-gray-400 truncate">
                            by {event.createdBy?.name || "—"}
                          </div>

                        </div>

                      </div>

                      {/* Club */}
                      <div className="col-span-3 flex items-center gap-2">

                        <div className="w-6 h-6 rounded-lg bg-pink-100 flex items-center justify-center text-xs font-bold text-pink-600 shrink-0">
                          {event.club?.name?.[0]?.toUpperCase() || "?"}
                        </div>

                        <div className="min-w-0">

                          <div className="text-xs font-semibold text-gray-700 truncate">
                            {event.club?.name || "—"}
                          </div>

                          <div className="text-xs text-gray-400">
                            {event.club?.isActive
                              ? "● Active"
                              : "● Inactive"}
                          </div>

                        </div>

                      </div>

                      {/* Date */}
                      <div className="col-span-2 text-xs text-gray-500">
                        {formatDate(event.eventDate)}
                      </div>

                      {/* Status */}
                      <div className="col-span-2">

                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyle(normalizedStatus)}`}
                        >
                          {normalizedStatus}
                        </span>

                      </div>

                      {/* Actions */}
                      <div className="col-span-1 flex justify-end gap-1">

                        {canModerate ? (

                          <>
                            <button
                              onClick={() =>
                                setConfirm({
                                  event,
                                  action: "approve",
                                })
                              }
                              disabled={busy || actioningId !== null}
                              title="Approve"
                              className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all disabled:opacity-50 text-sm"
                              style={{
                                backgroundColor: "#dcfce7",
                                color: "#16a34a",
                                borderColor: "#bbf7d0",
                              }}
                            >
                              ✅
                            </button>

                            <button
                              onClick={() =>
                                setConfirm({
                                  event,
                                  action: "reject",
                                })
                              }
                              disabled={busy || actioningId !== null}
                              title="Reject"
                              className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 border border-red-200 transition-all disabled:opacity-50 text-sm"
                            >
                              ❌
                            </button>
                          </>

                        ) : (

                          <span className="text-xs font-semibold text-gray-400">
                            No Action
                          </span>

                        )}

                      </div>

                    </div>

                    {/* Mobile Card */}
                    <div className="md:hidden flex flex-col gap-2.5">

                      {/* Title and Actions */}
                      <div className="flex items-start gap-3">

                        <div
                          className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-bold text-sm uppercase shrink-0"
                          style={{ background: GRAD }}
                        >
                          {event.title?.[0] || "E"}
                        </div>

                        <div className="flex-1 min-w-0">

                          <div
                            className="font-semibold text-gray-900 text-sm cursor-pointer hover:text-indigo-600 truncate"
                            onClick={() => setSelected(event)}
                          >
                            {event.title}
                          </div>

                          <div className="text-xs text-gray-400 truncate">
                            by {event.createdBy?.name || "—"}
                          </div>

                        </div>

                        <div className="flex gap-1 shrink-0">

                          {canModerate ? (

                            <>
                              <button
                                onClick={() =>
                                  setConfirm({
                                    event,
                                    action: "approve",
                                  })
                                }
                                disabled={busy || actioningId !== null}
                                className="w-8 h-8 rounded-lg flex items-center justify-center border text-sm disabled:opacity-50"
                                style={{
                                  backgroundColor: "#dcfce7",
                                  color: "#16a34a",
                                  borderColor: "#bbf7d0",
                                }}
                              >
                                ✅
                              </button>

                              <button
                                onClick={() =>
                                  setConfirm({
                                    event,
                                    action: "reject",
                                  })
                                }
                                disabled={busy || actioningId !== null}
                                className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 border border-red-200 text-sm disabled:opacity-50"
                              >
                                ❌
                              </button>
                            </>

                          ) : (

                            <span className="text-xs text-gray-400 self-center">
                              No Action
                            </span>

                          )}

                        </div>

                      </div>

                      {/* Club, Date and Status */}
                      <div className="flex items-center gap-2 flex-wrap pl-1">

                        <div className="flex items-center gap-1.5">

                          <div className="w-5 h-5 rounded-md bg-pink-100 flex items-center justify-center text-xs font-bold text-pink-600 shrink-0">
                            {event.club?.name?.[0]?.toUpperCase() || "?"}
                          </div>

                          <span className="text-xs font-semibold text-gray-700 truncate max-w-[90px]">
                            {event.club?.name || "—"}
                          </span>

                        </div>

                        {event.eventDate && (
                          <span className="text-xs text-gray-400">
                            📅 {formatDate(event.eventDate)}
                          </span>
                        )}

                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold border ${statusStyle(normalizedStatus)}`}
                        >
                          {normalizedStatus}
                        </span>

                      </div>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </div>

      </div>

      {/* Confirmation Modal */}
      {confirm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">

          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm border border-gray-100 p-6 text-center overflow-y-auto max-h-[90vh]">

            <div
              className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center text-2xl ${
                confirm.action === "approve"
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >
              {confirm.action === "approve" ? "✅" : "❌"}
            </div>

            <h2 className="text-lg font-bold text-gray-900 mb-1">
              {confirm.action === "approve"
                ? "Approve Event?"
                : "Reject Event?"}
            </h2>

            <p className="text-sm text-gray-500 mb-1">
              You're about to {confirm.action}
            </p>

            <p className="text-sm font-bold text-gray-800 mb-4">
              "{confirm.event.title}"
            </p>

            <div
              className={`text-xs px-4 py-3 rounded-xl mb-6 text-left border ${
                confirm.action === "approve"
                  ? "bg-green-50 border-green-100 text-green-700"
                  : "bg-yellow-50 border-yellow-100 text-yellow-700"
              }`}
            >
              {confirm.action === "approve"
                ? "⚡ This event will be visible to users."
                : "⚠️ This event will be marked as rejected."}
            </div>

            <div className="flex gap-3">

              <button
                onClick={() => setConfirm(null)}
                disabled={actioningId !== null}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  updateStatus(
                    confirm.event._id,
                    confirm.action
                  )
                }
                disabled={actioningId !== null}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition disabled:opacity-50"
                style={{
                  backgroundColor:
                    confirm.action === "approve"
                      ? "#22c55e"
                      : "#ef4444",
                }}
              >
                {actioningId !== null
                  ? "Processing..."
                  : confirm.action === "approve"
                    ? "Approve"
                    : "Reject"}
              </button>

            </div>

          </div>

        </div>

      )}

      {/* Event Details Modal */}
      {selectedEvent && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelected(null);
            }
          }}
        >

          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-100">

            <div className="p-5 sm:p-6">

              {/* Modal Header */}
              <div className="flex items-start justify-between gap-3 mb-5">

                <div className="flex items-center gap-3 min-w-0">

                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ background: GRAD }}
                  >
                    {selectedEvent.title?.[0] || "E"}
                  </div>

                  <div className="min-w-0">

                    <h3 className="font-bold text-gray-900 text-base truncate">
                      {selectedEvent.title}
                    </h3>

                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusStyle(normalizeStatus(selectedEvent.status))}`}
                    >
                      {selectedEvent.status}
                    </span>

                  </div>

                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition shrink-0"
                >
                  ✕
                </button>

              </div>

              {/* Event Information */}
              <div className="space-y-3">

                <div className="grid grid-cols-2 gap-3">

                  {[
                    {
                      label: "Club",
                      value: selectedEvent.club?.name,
                    },
                    {
                      label: "Organizer",
                      value: selectedEvent.createdBy?.name,
                      sub: selectedEvent.createdBy?.email,
                    },
                  ].map((item) => (

                    <div
                      key={item.label}
                      className="bg-gray-50 rounded-xl p-3 border border-gray-100"
                    >

                      <div className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">
                        {item.label}
                      </div>

                      <div className="text-sm font-semibold text-gray-800 truncate">
                        {item.value || "—"}
                      </div>

                      {item.sub && (
                        <div className="text-xs text-gray-400 truncate">
                          {item.sub}
                        </div>
                      )}

                    </div>

                  ))}

                </div>

                {/* Event Date */}
                {selectedEvent.eventDate && (

                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">

                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">
                      Date
                    </div>

                    <div className="text-sm font-semibold text-gray-800">
                      {new Date(
                        selectedEvent.eventDate
                      ).toLocaleDateString("en-IN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>

                  </div>

                )}

                {/* Location */}
                {selectedEvent.location && (

                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">

                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">
                      Location
                    </div>

                    <div className="text-sm font-semibold text-gray-800">
                      {selectedEvent.location}
                    </div>

                  </div>

                )}

                {/* Description */}
                {selectedEvent.description && (

                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">

                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">
                      Description
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedEvent.description}
                    </p>

                  </div>

                )}

                {/* Registration Statistics */}
                <div className="grid grid-cols-2 gap-3">

                  <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">

                    <div className="text-xs text-indigo-500 font-bold uppercase tracking-wide mb-1">
                      Registrations
                    </div>

                    <div className="text-xl font-bold text-indigo-700">
                      {typeof selectedEvent.registrationCount === "number"
                        ? selectedEvent.registrationCount
                        : "—"}
                    </div>

                  </div>

                  <div className="bg-green-50 rounded-xl p-3 border border-green-100">

                    <div className="text-xs text-green-600 font-bold uppercase tracking-wide mb-1">
                      Attended
                    </div>

                    <div className="text-xl font-bold text-green-700">
                      {typeof selectedEvent.attendedCount === "number"
                        ? selectedEvent.attendedCount
                        : "—"}
                    </div>

                  </div>

                </div>

                {typeof selectedEvent.totalSeats === "number" && (

                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">

                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">
                      Seat Availability
                    </div>

                    <div className="text-sm font-semibold text-gray-800">
                      {selectedEvent.availableSeats ?? "—"} available out of{" "}
                      {selectedEvent.totalSeats}
                    </div>

                  </div>

                )}

                {/* Approval Actions */}
                {normalizeStatus(selectedEvent.status) === "pending" && (

                  <div className="flex gap-3 pt-1">

                    <button
                      onClick={() => {
                        setSelected(null);
                        setConfirm({
                          event: selectedEvent,
                          action: "approve",
                        });
                      }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition"
                      style={{ backgroundColor: "#22c55e" }}
                    >
                      ✅ Approve
                    </button>

                    <button
                      onClick={() => {
                        setSelected(null);
                        setConfirm({
                          event: selectedEvent,
                          action: "reject",
                        });
                      }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition"
                    >
                      ❌ Reject
                    </button>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      )}

      {/* Toast */}
      {toast.msg && (

        <div
          role="alert"
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 px-4 sm:px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white flex items-center gap-2 z-50 max-w-[calc(100vw-2rem)] ${
            toast.type === "error" ? "bg-red-500" : ""
          }`}
          style={
            toast.type !== "error"
              ? { background: GRAD }
              : {}
          }
        >
          {toast.type === "error" ? "❌" : "✅"}

          <span className="truncate">
            {toast.msg}
          </span>

        </div>

      )}

    </div>
  );
}
