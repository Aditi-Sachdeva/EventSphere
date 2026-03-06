// ViewUsers.jsx
import { useState, useEffect, useCallback } from 'react';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  // Fetch users from backend
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        role: roleFilter === 'All' ? '' : roleFilter,
        status: statusFilter === 'All' ? '' : statusFilter
      });
      
      const res = await fetch(`/api/users?${params}`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter]);

  // Load users on mount and filter changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Update role
  const updateRole = async (userId, newRole) => {
    try {
      await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      showToast(`Role updated to ${newRole}`);
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  // Delete user
  const deleteUser = async (userId, name) => {
    if (!confirm(`Delete ${name}?`)) return;
    
    try {
      await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      setUsers(users.filter(u => u.id !== userId));
      showToast(`${name} deleted`);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  // Filter users (client-side backup)
  const filteredUsers = users.filter(user => {
    const matchesSearch = !search || 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 py-8 px-4 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              Administration
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage all registered users</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-semibold text-gray-600">
            📅 March 6, 2026
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: users.length, bg: 'bg-indigo-100', color: 'text-indigo-700', icon: '👥' },
            { label: 'Active', value: users.filter(u => u.status === 'Active').length, bg: 'bg-emerald-100', color: 'text-emerald-700', icon: '✅' },
            { label: 'Organizers', value: users.filter(u => u.role === 'Organizer').length, bg: 'bg-pink-100', color: 'text-pink-700', icon: '🧑‍💼' },
            { label: 'Banned', value: users.filter(u => u.status === 'Banned').length, bg: 'bg-red-100', color: 'text-red-700', icon: '🚫' }
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
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
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span>Role:</span>
              {['All', 'User', 'Organizer', 'Admin'].map(role => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    roleFilter === role
                      ? 'bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span>Status:</span>
              {['All', 'Active', 'Inactive', 'Banned'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    statusFilter === status
                      ? 'bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              No users match your filters
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredUsers.map(user => (
                <div key={user.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm uppercase">
                      {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-base truncate">{user.name}</div>
                      <div className="text-sm text-gray-500 truncate">{user.email}</div>
                    </div>

                    {/* Role Dropdown */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border">
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user.id, e.target.value)}
                        className="bg-transparent border-none text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg px-2 py-1"
                      >
                        <option value="User">User</option>
                        <option value="Organizer">Organizer</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>

                    {/* Status */}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                      user.status === 'Inactive' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      <div className="w-2 h-2 rounded-full bg-current" />
                      {user.status}
                    </span>

                    {/* Joined */}
                    <div className="text-sm text-gray-500 text-right min-w-[100px]">
                      {user.joined}
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => deleteUser(user.id, user.name)}
                      className="p-2 hover:bg-red-50 rounded-xl transition-colors text-red-500 hover:text-red-700"
                      title="Delete user"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold z-50 animate-in slide-in-from-bottom-2 duration-300">
          <div className="w-2 h-2 bg-white/70 rounded-full" />
          {toast}
        </div>
      )}
    </div>
  );
};

export default ViewUsers;


