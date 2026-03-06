// ViewClubs.jsx
import { useState, useEffect, useCallback } from 'react';

const ViewClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  // Fetch clubs from backend
  const fetchClubs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter === 'all' ? '' : statusFilter
      });
      
      const res = await fetch(`/api/clubs?${params}`);
      const data = await res.json();
      setClubs(data);
    } catch (error) {
      console.error('Failed to fetch clubs:', error);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  // Load clubs on mount and filter changes
  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  // Toggle club status
  const toggleStatus = async (clubId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await fetch(`/api/clubs/${clubId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      setClubs(clubs.map(c => 
        c.id === clubId ? { ...c, status: newStatus } : c
      ));
      showToast(`"${clubs.find(c => c.id === clubId)?.name}" ${newStatus}d`);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // Delete club
  const deleteClub = async (clubId, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    
    try {
      await fetch(`/api/clubs/${clubId}`, { method: 'DELETE' });
      setClubs(clubs.filter(c => c.id !== clubId));
      showToast(`"${name}" deleted`);
    } catch (error) {
      console.error('Failed to delete club:', error);
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  // Filter clubs (client-side backup)
  const filteredClubs = clubs.filter(club => {
    const matchesSearch = !search || 
      club.name.toLowerCase().includes(search.toLowerCase()) ||
      club.organizer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || club.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: clubs.length,
    active: clubs.filter(c => c.status === 'active').length,
    inactive: clubs.filter(c => c.status === 'inactive').length,
    events: clubs.reduce((sum, c) => sum + c.events, 0)
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
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Manage Clubs</h1>
            <p className="text-sm text-gray-500">Monitor and manage all clubs</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 flex items-center gap-2 shadow-sm">
            👥 {stats.total} clubs
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: stats.total, bg: 'bg-indigo-100', color: 'text-indigo-700', icon: '👥' },
            { label: 'Active', value: stats.active, bg: 'bg-emerald-100', color: 'text-emerald-700', icon: '✅' },
            { label: 'Inactive', value: stats.inactive, bg: 'bg-red-100', color: 'text-red-700', icon: '⏸️' },
            { label: 'Events', value: stats.events, bg: 'bg-pink-100', color: 'text-pink-700', icon: '📅' }
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

        {/* Filters & Create */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 min-w-0">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clubs or organizers..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <span>Status:</span>
                {['all', 'active', 'inactive'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-2 rounded-full font-semibold text-xs transition-all ${
                      statusFilter === status
                        ? 'bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
              
              <button className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                + Create Club
              </button>
            </div>
          </div>
        </div>

        {/* Clubs List */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading clubs...</div>
          ) : filteredClubs.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 text-gray-300">👥</div>
              No clubs match your filters
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
              {filteredClubs.map(club => (
                <div key={club.id} className="p-6 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm uppercase flex-shrink-0 mt-1">
                      {club.name[0]}
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-xl text-gray-900 truncate">{club.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          club.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current inline-block mr-1" />
                          {club.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span>👤 {club.organizer}</span>
                        <span>📅 {new Date(club.created).toLocaleDateString('en-IN', { 
                          day: 'numeric', month: 'short', year: 'numeric' 
                        })}</span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{club.members.length}</div>
                          <div className="text-xs text-gray-500">Members</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{club.events}</div>
                          <div className="text-xs text-gray-500">Events</div>
                        </div>
                      </div>

                      {/* Category */}
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                        club.category === 'Technology' ? 'bg-indigo-100 text-indigo-800' :
                        club.category === 'Arts' ? 'bg-pink-100 text-pink-800' :
                        club.category === 'Sports' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {club.category}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-indigo-600"
                          title="View details"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => toggleStatus(club.id, club.status)}
                          className={`p-2 rounded-lg transition-colors text-sm font-bold ${
                            club.status === 'active'
                              ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                              : 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                          title={club.status === 'active' ? 'Deactivate' : 'Reactivate'}
                        >
                          {club.status === 'active' ? '⏸️' : '▶️'}
                        </button>
                        <button
                          onClick={() => deleteClub(club.id, club.name)}
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
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold z-50 animate-pulse">
          <div className="w-2 h-2 bg-white/70 rounded-full" />
          {toast}
        </div>
      )}
    </div>
  );
};

export default ViewClubs;
