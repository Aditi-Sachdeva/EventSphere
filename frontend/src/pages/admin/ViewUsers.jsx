import { useState, useEffect } from "react";
import axios from "axios";

const GRAD = "linear-gradient(to right, #ec4899, #6366f1)";

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const [confirmDelete, setConfirmDelete] = useState(null); 
  const [updatingRole, setUpdatingRole] = useState(null);  
  const [deleting, setDeleting] = useState(null);     


  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedUsers = res.data.users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
        status: "Active",
        joined: new Date(user.createdAt).toLocaleDateString(),
      }));
      setUsers(formattedUsers);
    } catch (error) {
      showToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const updateRole = async (userId, newRole) => {
    setUpdatingRole(userId);
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/api/admin/user/role",
        { userId, newRole: newRole.toLowerCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      showToast(`Role updated to ${newRole}`);
    } catch (error) {
      showToast("Failed to update role", "error");
    } finally {
      setUpdatingRole(null);
    }
  };

  const deleteUser = async (userId) => {
    setDeleting(userId);
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/admin/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast("User deleted successfully");
    } catch (error) {
      showToast("Failed to delete user", "error");
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  };




  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleColor = (role) => {
    if (role === "Admin") return "bg-violet-100 text-violet-700 border-violet-200";
    if (role === "Organizer") return "bg-pink-100 text-pink-700 border-pink-200";
    return "bg-gray-100 text-gray-600 border-gray-200";
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
            <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
            <p className="text-sm text-gray-500 mt-1">View, update roles, and remove registered users</p>
          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total", value: users.length, bg: "bg-indigo-100", color: "text-indigo-700", icon: "👥" },
            { label: "Active", value: users.length, bg: "bg-emerald-100", color: "text-emerald-700", icon: "✅" },
            { label: "Organizers", value: users.filter(u => u.role === "Organizer").length, bg: "bg-pink-100", color: "text-pink-700", icon: "🧑‍💼" },
            { label: "Admins", value: users.filter(u => u.role === "Admin").length, bg: "bg-violet-100", color: "text-violet-700", icon: "⭐" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6 shadow-sm flex flex-col sm:flex-row gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <div className="flex gap-2">
            {["All", "User", "Organizer", "Admin"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${roleFilter === r
                    ? "text-white border-transparent shadow-md"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-indigo-50"
                  }`}
                style={roleFilter === r ? { background: GRAD } : {}}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">

          <div className="hidden md:grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <div className="col-span-4">User</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Joined</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400 text-sm">
              <div className="animate-pulse">Loading users...</div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">No users found</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <div key={user.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 items-center gap-2">

                    {/* Name */}
                    <div className="col-span-12 md:col-span-4 flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-xs uppercase shrink-0"
                        style={{ background: GRAD }}
                      >
                        {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{user.name}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                    </div>

                    {/* Role Selector */}
                    <div className="col-span-6 md:col-span-3">
                      <div className="relative inline-flex items-center">
                        <select
                          value={user.role}
                          onChange={(e) => updateRole(user.id, e.target.value)}
                          disabled={updatingRole === user.id}
                          className={`appearance-none pl-3 pr-7 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 ${roleColor(user.role)} ${updatingRole === user.id ? "opacity-50 cursor-wait" : ""}`}
                        >
                          <option value="User">User</option>
                          <option value="Organizer">Organizer</option>
                          <option value="Admin">Admin</option>
                        </select>
                        <span className="pointer-events-none absolute right-2 text-xs">
                          {updatingRole === user.id ? "⏳" : "▾"}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-3 md:col-span-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        ● Active
                      </span>
                    </div>

                    {/* Joined */}
                    <div className="col-span-6 md:col-span-2 text-xs text-gray-400">
                      {user.joined}
                    </div>

                    {/* Delete */}
                    <div className="col-span-3 md:col-span-1 flex justify-end">
                      <button
                        onClick={() => setConfirmDelete(user)}
                        disabled={deleting === user.id}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all border border-red-100"
                        title="Delete user"
                      >
                        {deleting === user.id ? (
                          <span className="text-xs">⏳</span>
                        ) : (
                          <span className="text-sm">🗑</span>
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Delete*/}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm mx-4 border border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-2xl mb-4 mx-auto">
              🗑
            </div>
            <h3 className="text-lg font-black text-gray-900 text-center mb-1">Delete User?</h3>
            <p className="text-sm text-gray-500 text-center mb-1">
              You're about to permanently delete
            </p>
            <p className="text-sm font-bold text-gray-800 text-center mb-5">
              {confirmDelete.name}
            </p>
            <p className="text-xs text-red-400 text-center mb-6 bg-red-50 rounded-xl px-3 py-2 border border-red-100">
              ⚠️ This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteUser(confirmDelete.id)}
                disabled={deleting === confirmDelete.id}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-60"
              >
                {deleting === confirmDelete.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.msg && (
        <div
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white transition-all ${toast.type === "error" ? "bg-red-500" : ""
            }`}
          style={toast.type !== "error" ? { background: GRAD } : {}}
        >
          {toast.type === "error" ? "❌" : "✅"} {toast.msg}
        </div>
      )}

    </div>
  );
};

export default ViewUsers;