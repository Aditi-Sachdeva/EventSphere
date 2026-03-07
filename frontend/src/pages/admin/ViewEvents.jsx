import { useState, useEffect } from 'react';
import API from '../../api/api';

const GRAD = "linear-gradient(to right, #ec4899, #6366f1)";

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: '' });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [actioningId, setActioningId] = useState(null); // eventId being approved/rejected

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/events');
      setEvents(res.data.events || []);
    } catch (err) {
      showToast('Failed to fetch events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const approveEvent = async (eventId) => {
    setActioningId(eventId);
    try {
      await API.put(`/admin/event/approve/${eventId}`);
      setEvents((prev) =>
        prev.map((e) => (e._id === eventId ? { ...e, status: 'approved' } : e))
      );
      showToast('Event approved successfully');
    } catch (err) {
      showToast(err?.response?.data?.msg || 'Failed to approve event', 'error');
    } finally {
      setActioningId(null);
    }
  };

  const rejectEvent = async (eventId) => {
    setActioningId(eventId);
    try {
      await API.put(`/admin/event/reject/${eventId}`);
      setEvents((prev) =>
        prev.map((e) => (e._id === eventId ? { ...e, status: 'rejected' } : e))
      );
      showToast('Event rejected');
    } catch (err) {
      showToast(err?.response?.data?.msg || 'Failed to reject event', 'error');
    } finally {
      setActioningId(null);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  // Client-side filtering
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      !search ||
      event.title?.toLowerCase().includes(search.toLowerCase()) ||
      event.club?.name?.toLowerCase().includes(search.toLowerCase()) ||
      event.createdBy?.name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || event.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total:    events.length,
    pending:  events.filter((e) => e.status === 'pending').length,
    approved: events.filter((e) => e.status === 'approved').length,
    rejected: events.filter((e) => e.status === 'rejected').length,
  };

  const statusStyle = (status) => {
    if (status === 'approved') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'pending')  return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    return 'bg-red-50 text-red-600 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              Administration
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Manage Events</h1>
            <p className="text-sm text-gray-500">Review and moderate club events</p>
          </div>
          {stats.pending > 0 && (
            <div className="bg-yellow-100 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
              ⚡ {stats.pending} pending review
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total',    value: stats.total,    bg: 'bg-indigo-100', color: 'text-indigo-700', icon: '📅' },
            { label: 'Pending',  value: stats.pending,  bg: 'bg-yellow-100', color: 'text-yellow-700', icon: '⏳' },
            { label: 'Approved', value: stats.approved, bg: 'bg-emerald-100',color: 'text-emerald-700',icon: '✅' },
            { label: 'Rejected', value: stats.rejected, bg: 'bg-red-100',    color: 'text-red-700',    icon: '❌' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, clubs, organizers..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400">Status:</span>
            {['all', 'pending', 'approved', 'rejected'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  statusFilter === s
                    ? 'text-white border-transparent shadow-md'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-indigo-50'
                }`}
                style={statusFilter === s ? { background: GRAD } : {}}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">

          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <div className="col-span-4">Event</div>
            <div className="col-span-3">Club / Organizer</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400 text-sm animate-pulse">Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">No events found</div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
              {filteredEvents.map((event) => (
                <div key={event._id} className="px-6 py-4 hover:bg-gray-50 transition-colors group">
                  <div className="grid grid-cols-12 items-center gap-2">

                    {/* Avatar + Title */}
                    <div className="col-span-12 md:col-span-4 flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm uppercase shrink-0"
                        style={{ background: GRAD }}
                      >
                        {event.title?.[0] || 'E'}
                      </div>
                      <div>
                        <div
                          className="font-semibold text-gray-900 text-sm cursor-pointer hover:text-indigo-600 transition-colors"
                          onClick={() => setSelectedEvent(event)}
                        >
                          {event.title}
                        </div>
                        <div className="text-xs text-gray-400">
                          by {event.createdBy?.name || '—'}
                        </div>
                      </div>
                    </div>

                    {/* Club */}
                    <div className="col-span-6 md:col-span-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-pink-100 flex items-center justify-center text-xs font-bold text-pink-600">
                          {event.club?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-700">{event.club?.name || '—'}</div>
                          <div className="text-xs text-gray-400">
                            {event.club?.isActive ? '● Active' : '● Inactive'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="col-span-3 md:col-span-2 text-xs text-gray-500">
                      {event.date
                        ? new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </div>

                    {/* Status */}
                    <div className="col-span-6 md:col-span-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyle(event.status)}`}>
                        {event.status === 'approved' ? '✅' : event.status === 'pending' ? '⏳' : '❌'}{' '}
                        {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-6 md:col-span-1 flex justify-end items-center gap-1">
                      {/* View */}
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-indigo-50 hover:text-indigo-500 border border-gray-200 transition-all text-xs"
                        title="View details"
                      >
                        👁️
                      </button>

                      {/* Approve — only for pending */}
                      {event.status === 'pending' && (
                        <>
                          <button
                            onClick={() => approveEvent(event._id)}
                            disabled={actioningId === event._id}
                            className="w-7 h-7 rounded-lg flex items-center justify-center bg-emerald-50 text-emerald-500 hover:bg-emerald-100 border border-emerald-100 transition-all text-xs disabled:opacity-50"
                            title="Approve"
                          >
                            {actioningId === event._id ? '⏳' : '✅'}
                          </button>
                          <button
                            onClick={() => rejectEvent(event._id)}
                            disabled={actioningId === event._id}
                            className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-100 border border-red-100 transition-all text-xs disabled:opacity-50"
                            title="Reject"
                          >
                            {actioningId === event._id ? '⏳' : '❌'}
                          </button>
                        </>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="p-6">

              {/* Modal Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: GRAD }}
                  >
                    {selectedEvent.title?.[0] || 'E'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base leading-tight">{selectedEvent.title}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusStyle(selectedEvent.status)}`}>
                      {selectedEvent.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">

                {/* Club + Organizer */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">Club</div>
                    <div className="text-sm font-semibold text-gray-800">{selectedEvent.club?.name || '—'}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">Organizer</div>
                    <div className="text-sm font-semibold text-gray-800">{selectedEvent.createdBy?.name || '—'}</div>
                    <div className="text-xs text-gray-400">{selectedEvent.createdBy?.email || ''}</div>
                  </div>
                </div>

                {/* Date */}
                {selectedEvent.date && (
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">Date</div>
                    <div className="text-sm font-semibold text-gray-800">
                      {new Date(selectedEvent.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                )}

                {/* Description */}
                {selectedEvent.description && (
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">Description</div>
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedEvent.description}</p>
                  </div>
                )}

                {/* Approve / Reject from modal if pending */}
                {selectedEvent.status === 'pending' && (
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => { approveEvent(selectedEvent._id); setSelectedEvent(null); }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => { rejectEvent(selectedEvent._id); setSelectedEvent(null); }}
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
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white flex items-center gap-2 z-50 ${
            toast.type === 'error' ? 'bg-red-500' : ''
          }`}
          style={toast.type !== 'error' ? { background: GRAD } : {}}
        >
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}
    </div>
  );
};

export default ViewEvents;
