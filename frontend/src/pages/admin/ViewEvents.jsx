// ViewEvents.jsx
import { useState, useEffect, useCallback, useRef } from 'react';

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [toast, setToast] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const loadTriggerRef = useRef(null);

  // Fetch initial events
  const fetchEvents = useCallback(async (append = false, page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter === 'all' ? '' : statusFilter,
        page: page.toString()
      });
      
      const res = await fetch(`/api/events?${params}`);
      const data = await res.json();
      
      if (append) {
        setEvents(prev => [...prev, ...data.events]);
      } else {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [search, statusFilter]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadingMore) {
          setLoadingMore(true);
          fetchEvents(true, Math.ceil(events.length / 10) + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loadTriggerRef.current) {
      observer.observe(loadTriggerRef.current);
    }

    return () => observer.disconnect();
  }, [events.length, loadingMore, fetchEvents]);

  // Load events on mount and filter changes
  useEffect(() => {
    fetchEvents(false, 1);
  }, [fetchEvents]);

  // Update event status
  const updateStatus = async (eventId, newStatus) => {
    try {
      await fetch(`/api/events/${eventId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      setEvents(events.map(e => 
        e.id === eventId ? { ...e, status: newStatus } : e
      ));
      showToast(`"${events.find(e => e.id === eventId)?.name}" ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Delete event
  const deleteEvent = async (eventId, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    
    try {
      await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
      setEvents(events.filter(e => e.id !== eventId));
      showToast(`"${name}" deleted`);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  // Filter events (client-side backup)
  const filteredEvents = events.filter(event => {
    const matchesSearch = !search || 
      event.name.toLowerCase().includes(search.toLowerCase()) ||
      event.club.toLowerCase().includes(search.toLowerCase()) ||
      event.organizer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: events.length,
    pending: events.filter(e => e.status === 'pending').length,
    approved: events.filter(e => e.status === 'approved').length,
    rejected: events.filter(e => e.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 py-8 px-4 font-sans">
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
              ⚡ {stats.pending} pending
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: stats.total, bg: 'bg-indigo-100', color: 'text-indigo-700', icon: '📅' },
            { label: 'Pending', value: stats.pending, bg: 'bg-yellow-100', color: 'text-yellow-700', icon: '⏳' },
            { label: 'Approved', value: stats.approved, bg: 'bg-emerald-100', color: 'text-emerald-700', icon: '✅' },
            { label: 'Rejected', value: stats.rejected, bg: 'bg-red-100', color: 'text-red-700', icon: '❌' }
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
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

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 min-w-0">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, clubs, organizers..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span>Status:</span>
              {['all', 'pending', 'approved', 'rejected'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    statusFilter === status
                      ? 'bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-300">📅</div>
              No events found
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
              {filteredEvents.map(event => (
                <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm uppercase flex-shrink-0 mt-1">
                      {event.name[0]}
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">{event.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <span className="font-medium">{event.club}</span>
                        <span>•</span>
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span>👤 {event.organizer}</span>
                        <span>📅 {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      </div>

                      {/* Seats */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1 text-sm font-semibold">
                          <span className="text-lg font-bold text-gray-900">{event.seats.filled}</span>
                          <span>/ {event.seats.total}</span>
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              event.seats.filled / event.seats.total > 0.9 ? 'bg-red-500' :
                              event.seats.filled / event.seats.total > 0.6 ? 'bg-yellow-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${(event.seats.filled / event.seats.total) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Category */}
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        event.category === 'Technology' ? 'bg-indigo-100 text-indigo-800' :
                        event.category === 'Arts' ? 'bg-pink-100 text-pink-800' :
                        event.category === 'Sports' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.category}
                      </span>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      {/* Status */}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                        event.status === 'approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        event.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        <div className="w-2 h-2 rounded-full bg-current" />
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-indigo-600"
                          title="View details"
                        >
                          👁️
                        </button>
                        {event.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(event.id, 'approved')}
                              className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600 hover:text-emerald-700"
                              title="Approve"
                            >
                              ✅
                            </button>
                            <button
                              onClick={() => updateStatus(event.id, 'rejected')}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 hover:text-red-700"
                              title="Reject"
                            >
                              ❌
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteEvent(event.id, event.name)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Load more trigger */}
              {loadingMore && (
                <div ref={loadTriggerRef} className="p-8 text-center text-gray-400">
                  Loading more events...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedEvent.name}</h3>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-2">Club</div>
                      <div className="font-semibold text-gray-900">{selectedEvent.club}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-2">Date</div>
                      <div className="font-semibold text-gray-900">{new Date(selectedEvent.date).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-3 flex items-center gap-2">
                      <span>📄</span> Description
                    </div>
                    <p className="text-gray-700 leading-relaxed">{selectedEvent.description}</p>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-pink-50 p-4 rounded-xl border">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-xs text-gray-500 uppercase font-bold tracking-wide">Capacity</div>
                      <span className="text-2xl font-bold text-gray-900">{selectedEvent.seats.filled}/{selectedEvent.seats.total}</span>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-3 rounded-full transition-all bg-gradient-to-r from-emerald-500 to-indigo-500"
                        style={{ width: `${(selectedEvent.seats.filled / selectedEvent.seats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold z-50 animate-pulse">
            <div className="w-2 h-2 bg-white/70 rounded-full" />
            {toast}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewEvents;
