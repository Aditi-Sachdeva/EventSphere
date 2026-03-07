import { useState, useEffect } from 'react';
import API from '../../api/api';

const GRAD = "linear-gradient(to right, #ec4899, #6366f1)";

const ViewClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: '' });
  const [confirmDeactivate, setConfirmDeactivate] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/clubs');
      setClubs(res.data.clubs || []);
    } catch (err) {
      showToast('Failed to fetch clubs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const toggleStatus = async (club) => {
    // If active, show confirmation before deactivating
    if (club.isActive) {
      setConfirmDeactivate(club);
      return;
    }
    // Reactivate directly
    await doToggle(club);
  };

  const doToggle = async (club) => {
    setTogglingId(club._id);
    setConfirmDeactivate(null);
    try {
      if (club.isActive) {
        await API.put(`/admin/club/deactivate/${club._id}`);
      } else {
        await API.put(`/admin/club/reactivate/${club._id}`);
      }
      setClubs((prev) =>
        prev.map((c) =>
          c._id === club._id ? { ...c, isActive: !c.isActive } : c
        )
      );
      showToast(`"${club.name}" ${club.isActive ? 'deactivated' : 'reactivated'} successfully`);
    } catch (err) {
      const msg = err?.response?.data?.msg || 'Failed to update club status';
      showToast(msg, 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  // Client-side filtering
  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      !search ||
      club.name.toLowerCase().includes(search.toLowerCase()) ||
      club.mainOrganizer?.name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && club.isActive) ||
      (statusFilter === 'inactive' && !club.isActive);

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: clubs.length,
    active: clubs.filter((c) => c.isActive).length,
    inactive: clubs.filter((c) => !c.isActive).length,
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
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Manage Clubs</h1>
            <p className="text-sm text-gray-500">Monitor and manage all clubs</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 flex items-center gap-2 shadow-sm">
            🏛 {stats.total} clubs
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total',    value: stats.total,    bg: 'bg-indigo-100', color: 'text-indigo-700', icon: '🏛' },
            { label: 'Active',   value: stats.active,   bg: 'bg-emerald-100',color: 'text-emerald-700',icon: '✅' },
            { label: 'Inactive', value: stats.inactive, bg: 'bg-red-100',    color: 'text-red-700',    icon: '⏸️' },
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
            placeholder="Search clubs or organizers..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400">Status:</span>
            {['all', 'active', 'inactive'].map((s) => (
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

        {/* Clubs List */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">

          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <div className="col-span-4">Club</div>
            <div className="col-span-3">Main Organizer</div>
            <div className="col-span-2">Organizers</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400 text-sm animate-pulse">Loading clubs...</div>
          ) : filteredClubs.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">No clubs match your filters</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredClubs.map((club) => (
                <div key={club._id} className="px-6 py-4 hover:bg-gray-50 transition-colors group">
                  <div className="grid grid-cols-12 items-center gap-2">

                    {/* Avatar + Name */}
                    <div className="col-span-12 md:col-span-4 flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm uppercase shrink-0"
                        style={{ background: GRAD }}
                      >
                        {club.name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{club.name}</div>
                        <div className="text-xs text-gray-400">
                          Created {new Date(club.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    {/* Main Organizer */}
                    <div className="col-span-6 md:col-span-3">
                      {club.mainOrganizer ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                            {club.mainOrganizer.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-700">{club.mainOrganizer.name}</div>
                            <div className="text-xs text-gray-400">{club.mainOrganizer.email}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </div>

                    {/* Organizers count */}
                    <div className="col-span-3 md:col-span-2">
                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                        👥 {club.organizers?.length || 0}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="col-span-6 md:col-span-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        club.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {club.isActive ? '● Active' : '● Inactive'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-3 md:col-span-1 flex justify-end">
                      <button
                        onClick={() => toggleStatus(club)}
                        disabled={togglingId === club._id}
                        title={club.isActive ? 'Deactivate' : 'Reactivate'}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all text-sm disabled:opacity-50 ${
                          club.isActive
                            ? 'bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 border-red-100'
                            : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700 border-emerald-100'
                        }`}
                      >
                        {togglingId === club._id ? '⏳' : club.isActive ? '⏸️' : '▶️'}
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Deactivate Confirmation Modal */}
      {confirmDeactivate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm mx-4 border border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-2xl mb-4 mx-auto">⏸️</div>
            <h3 className="text-lg font-black text-gray-900 text-center mb-1">Deactivate Club?</h3>
            <p className="text-sm text-gray-500 text-center mb-1">You're about to deactivate</p>
            <p className="text-sm font-bold text-gray-800 text-center mb-5">"{confirmDeactivate.name}"</p>
            <p className="text-xs text-amber-600 text-center mb-6 bg-amber-50 rounded-xl px-3 py-2 border border-amber-100">
              ⚠️ Members won't be able to join or create events under this club.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeactivate(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => doToggle(confirmDeactivate)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.msg && (
        <div
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white flex items-center gap-2 ${
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

export default ViewClubs;