import { useState, useEffect } from 'react';
import axios from "axios";

const GRAD = "linear-gradient(to right, #ec4899, #6366f1)";

const ViewClubs = () => {
  const [clubs, setClubs]                     = useState([]);
  const [search, setSearch]                   = useState('');
  const [statusFilter, setStatusFilter]       = useState('all');
  const [loading, setLoading]                 = useState(false);
  const [toast, setToast]                     = useState({ msg: '', type: '' });
  const [confirmDeactivate, setConfirmDeactivate] = useState(null);
  const [togglingId, setTogglingId]           = useState(null);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/clubs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClubs(res.data.clubs || []);
    } catch {
      showToast('Failed to fetch clubs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClubs(); }, []);

  const toggleStatus = async (club) => {
    if (club.isActive) { setConfirmDeactivate(club); return; }
    await doToggle(club);
  };

  const doToggle = async (club) => {
    setTogglingId(club._id);
    setConfirmDeactivate(null);
    try {
      const token = localStorage.getItem("token");
      if (club.isActive) {
        await axios.put(`http://localhost:5000/api/admin/club/deactivate/${club._id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.put(`http://localhost:5000/api/admin/club/reactivate/${club._id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      }
      setClubs(prev => prev.map(c => c._id === club._id ? { ...c, isActive: !c.isActive } : c));
      showToast(`"${club.name}" ${club.isActive ? 'deactivated' : 'reactivated'} successfully`);
    } catch (err) {
      showToast(err?.response?.data?.msg || 'Failed to update club status', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  const filteredClubs = clubs.filter(club => {
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
    total:    clubs.length,
    active:   clubs.filter(c => c.isActive).length,
    inactive: clubs.filter(c => !c.isActive).length,
  };

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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Manage Clubs</h1>
            <p className="text-sm text-gray-500">Monitor and manage all clubs</p>
          </div>
          <div className="self-start sm:self-auto bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 flex items-center gap-2 shadow-sm whitespace-nowrap">
            🏛 {stats.total} clubs
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
          {[
            { label: 'Total',    value: stats.total,    bg: 'bg-indigo-100',  color: 'text-indigo-700',  icon: '🏛' },
            { label: 'Active',   value: stats.active,   bg: 'bg-emerald-100', color: 'text-emerald-700', icon: '✅' },
            { label: 'Inactive', value: stats.inactive, bg: 'bg-red-100',     color: 'text-red-700',     icon: '⏸️' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-sm flex items-center gap-2 sm:gap-4 hover:shadow-md transition-all">
              <div className={`w-9 h-9 sm:w-12 sm:h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center text-lg sm:text-2xl shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 mb-5 sm:mb-6 shadow-sm flex flex-col gap-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clubs or organizers..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-400">Status:</span>
            {['all', 'active', 'inactive'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
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

          {/* Desktop header row */}
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
              {filteredClubs.map(club => (
                <div key={club._id} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors group">

                  {/* ── Desktop row ── */}
                  <div className="hidden md:grid grid-cols-12 items-center gap-2">
                    {/* Club */}
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm uppercase shrink-0" style={{ background: GRAD }}>
                        {club.name[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 text-sm truncate">{club.name}</div>
                        <div className="text-xs text-gray-400">
                          Created {new Date(club.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    {/* Main Organizer */}
                    <div className="col-span-3">
                      {club.mainOrganizer ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                            {club.mainOrganizer.name?.[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-gray-700 truncate">{club.mainOrganizer.name}</div>
                            <div className="text-xs text-gray-400 truncate">{club.mainOrganizer.email}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </div>

                    {/* Organizers count */}
                    <div className="col-span-2">
                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                        👥 {club.organizers?.length || 0}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        club.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {club.isActive ? '● Active' : '● Inactive'}
                      </span>
                    </div>

                    {/* Action */}
                    <div className="col-span-1 flex justify-end">
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

                  {/* ── Mobile card ── */}
                  <div className="md:hidden flex flex-col gap-3">
                    {/* Top row: avatar + name + action btn */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm uppercase shrink-0" style={{ background: GRAD }}>
                        {club.name[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 text-sm truncate">{club.name}</div>
                        <div className="text-xs text-gray-400">
                          Created {new Date(club.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleStatus(club)}
                        disabled={togglingId === club._id}
                        title={club.isActive ? 'Deactivate' : 'Reactivate'}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all text-sm disabled:opacity-50 shrink-0 ${
                          club.isActive
                            ? 'bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 border-red-100'
                            : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700 border-emerald-100'
                        }`}
                      >
                        {togglingId === club._id ? '⏳' : club.isActive ? '⏸️' : '▶️'}
                      </button>
                    </div>

                    {/* Bottom row: organizer + count + status */}
                    <div className="flex items-center gap-2 flex-wrap pl-1">
                      {club.mainOrganizer ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                            {club.mainOrganizer.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="text-xs font-semibold text-gray-700 truncate max-w-[120px]">{club.mainOrganizer.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No organizer</span>
                      )}
                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                        👥 {club.organizers?.length || 0}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        club.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'
                      }`}>
                        {club.isActive ? '● Active' : '● Inactive'}
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Deactivate confirm modal */}
      {confirmDeactivate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-gray-100">
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
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 px-4 sm:px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white flex items-center gap-2 max-w-[calc(100vw-2rem)] ${
            toast.type === 'error' ? 'bg-red-500' : ''
          }`}
          style={toast.type !== 'error' ? { background: GRAD } : {}}
        >
          {toast.type === 'error' ? '❌' : '✅'}
          <span className="truncate">{toast.msg}</span>
        </div>
      )}
    </div>
  );
};

export default ViewClubs;