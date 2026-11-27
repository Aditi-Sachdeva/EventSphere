
import { useState, useEffect, useCallback } from "react";
import axios from "../../api/axios";

const GRAD = "linear-gradient(to right, #ec4899, #6366f1)";

const ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "organizer", label: "Organizer" },
  { value: "admin", label: "Admin" },
];

const roleLabel = (role) => {
  return ROLE_OPTIONS.find((item) => item.value === role)?.label || role;
};

const roleColor = (role) => {
  if (role === "admin") {
    return "bg-violet-100 text-violet-700 border-violet-200";
  }

  if (role === "organizer") {
    return "bg-pink-100 text-pink-700 border-pink-200";
  }

  return "bg-gray-100 text-gray-600 border-gray-200";
};

const getInitials = (name = "") => {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
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

const ViewUsers = () => {
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [toast, setToast] = useState({
    msg: "",
    type: "success",
  });

  const [confirmDelete, setConfirmDelete] = useState(null);

  const [updatingRole, setUpdatingRole] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const [currentUserId, setCurrentUserId] = useState(null);

  // Get logged-in admin ID
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUserId(parsedUser._id || parsedUser.id || null);
      }
    } catch (error) {
      console.error("Unable to read logged-in user:", error);
    }
  }, []);

  // Toast notification
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
  }, []);

  useEffect(() => {
    if (!toast.msg) return;

    const timer = setTimeout(() => {
      setToast({ msg: "", type: "success" });
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const response = await axios.get("/api/admin/users");

      const fetchedUsers = response.data?.users;

      if (!Array.isArray(fetchedUsers)) {
        throw new Error("Invalid user data received from server.");
      }

      const formattedUsers = fetchedUsers.map((user) => ({
        id: user._id,
        name: user.name || "Unknown",
        email: user.email || "",
        role: user.role,
        club: user.club,
        joined: user.createdAt,
      }));

      setUsers(formattedUsers);

    } catch (error) {
      console.error(
        "Failed to fetch users:",
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
        "Failed to fetch users."
      );

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Update user role
  const updateRole = async (userId, newRole) => {
    if (!userId || updatingRole !== null) return;

    const existingUser = users.find(
      (user) => user.id === userId
    );

    if (!existingUser || existingUser.role === newRole) {
      return;
    }

    setUpdatingRole(userId);

    try {
      const response = await axios.put(
        "/api/admin/user/role",
        {
          userId,
          newRole,
        }
      );

      const updatedRole = response.data?.user?.role || newRole;

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, role: updatedRole }
            : user
        )
      );

      showToast(
        response.data?.msg ||
        `Role updated to ${roleLabel(updatedRole)}`
      );

    } catch (error) {
      console.error(
        "Role update failed:",
        error.response?.data || error
      );

      showToast(
        error.response?.data?.msg ||
        "Failed to update user role.",
        "error"
      );

    } finally {
      setUpdatingRole(null);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!userId || deleting !== null) return;

    if (userId === currentUserId) {
      showToast("You cannot delete your own account.", "error");
      setConfirmDelete(null);
      return;
    }

    setDeleting(userId);

    try {
      const response = await axios.delete(
        `/api/admin/user/${userId}`
      );

      setUsers((prev) =>
        prev.filter((user) => user.id !== userId)
      );

      showToast(
        response.data?.msg ||
        "User deleted successfully."
      );

    } catch (error) {
      console.error(
        "Delete user failed:",
        error.response?.data || error
      );

      showToast(
        error.response?.data?.msg ||
        "Failed to delete user.",
        "error"
      );

    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  };

  // Search and role filtering
  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase();

    const matchesSearch =
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.club?.name || "").toLowerCase().includes(query);

    const matchesRole =
      roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Statistics
  const stats = [
    {
      label: "Total Users",
      value: users.length,
      bg: "bg-indigo-100",
      color: "text-indigo-700",
      icon: "👥",
    },
    {
      label: "Regular Users",
      value: users.filter((user) => user.role === "user").length,
      bg: "bg-gray-100",
      color: "text-gray-700",
      icon: "👤",
    },
    {
      label: "Organizers",
      value: users.filter((user) => user.role === "organizer").length,
      bg: "bg-pink-100",
      color: "text-pink-700",
      icon: "🧑‍💼",
    },
    {
      label: "Admins",
      value: users.filter((user) => user.role === "admin").length,
      bg: "bg-violet-100",
      color: "text-violet-700",
      icon: "⭐",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 py-6 px-3 sm:py-8 sm:px-4">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-3">

          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold mb-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full" />
              Administration
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Manage Users
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              View users, update roles, and remove registered accounts
            </p>
          </div>

        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">

          {stats.map((stat) => (

            <div
              key={stat.label}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4"
            >

              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center text-xl sm:text-2xl shrink-0`}
              >
                {stat.icon}
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>

                <div className="text-xs text-gray-500 mt-0.5">
                  {stat.label}
                </div>
              </div>

            </div>

          ))}

        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 mb-6 shadow-sm flex flex-col gap-3">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or club..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">

            {[
              { value: "all", label: "All" },
              { value: "user", label: "User" },
              { value: "organizer", label: "Organizer" },
              { value: "admin", label: "Admin" },
            ].map((role) => (

              <button
                key={role.value}
                onClick={() => setRoleFilter(role.value)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap shrink-0 ${
                  roleFilter === role.value
                    ? "text-white border-transparent shadow-md"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-indigo-50"
                }`}
                style={
                  roleFilter === role.value
                    ? { background: GRAD }
                    : {}
                }
              >
                {role.label}
              </button>

            ))}

          </div>

        </div>

        {/* Users List */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">

          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-12 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">

            <div className="col-span-4">
              User
            </div>

            <div className="col-span-3">
              Role
            </div>

            <div className="col-span-2">
              Club
            </div>

            <div className="col-span-2">
              Joined
            </div>

            <div className="col-span-1 text-right">
              Action
            </div>

          </div>

          {/* Loading */}
          {loading ? (

            <div className="p-12 text-center text-gray-400 text-sm">
              <div className="animate-pulse">
                Loading users...
              </div>
            </div>

          ) : loadError ? (

            <div className="p-8 sm:p-12 text-center">

              <p className="text-red-500 text-sm font-semibold mb-2">
                Unable to load users
              </p>

              <p className="text-gray-500 text-sm mb-4">
                {loadError}
              </p>

              <button
                onClick={fetchUsers}
                className="px-5 py-2 rounded-xl text-white text-sm font-semibold"
                style={{ background: GRAD }}
              >
                Try Again
              </button>

            </div>

          ) : filteredUsers.length === 0 ? (

            <div className="p-12 text-center text-gray-400 text-sm">
              No users found
            </div>

          ) : (

            <div className="divide-y divide-gray-100">

              {filteredUsers.map((user) => {

                const isCurrentUser = user.id === currentUserId;

                return (

                  <div
                    key={user.id}
                    className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
                  >

                    {/* Desktop Row */}
                    <div className="hidden md:grid grid-cols-12 items-center gap-2">

                      {/* User */}
                      <div className="col-span-4 flex items-center gap-3">

                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-xs uppercase shrink-0"
                          style={{ background: GRAD }}
                        >
                          {getInitials(user.name)}
                        </div>

                        <div className="min-w-0">

                          <div className="font-semibold text-gray-900 text-sm truncate">
                            {user.name}

                            {isCurrentUser && (
                              <span className="text-xs text-indigo-500 ml-2">
                                You
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-gray-400 truncate">
                            {user.email}
                          </div>

                        </div>

                      </div>

                      {/* Role Selector */}
                      <div className="col-span-3">

                        <div className="relative inline-flex items-center">

                          <select
                            value={user.role}
                            onChange={(e) =>
                              updateRole(user.id, e.target.value)
                            }
                            disabled={
                              updatingRole !== null ||
                              (isCurrentUser && user.role === "admin")
                            }
                            className={`appearance-none pl-3 pr-7 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 ${roleColor(user.role)} ${
                              updatingRole === user.id
                                ? "opacity-50 cursor-wait"
                                : ""
                            }`}
                          >
                            {ROLE_OPTIONS.map((role) => (

                              <option
                                key={role.value}
                                value={role.value}
                              >
                                {role.label}
                              </option>

                            ))}

                          </select>

                          <span className="pointer-events-none absolute right-2 text-xs">
                            {updatingRole === user.id ? "⏳" : "▾"}
                          </span>

                        </div>

                      </div>

                      {/* Club */}
                      <div className="col-span-2 text-xs text-gray-600 truncate">
                        {user.club?.name || "—"}
                      </div>

                      {/* Joined */}
                      <div className="col-span-2 text-xs text-gray-400">
                        {formatDate(user.joined)}
                      </div>

                      {/* Delete */}
                      <div className="col-span-1 flex justify-end">

                        <button
                          onClick={() => setConfirmDelete(user)}
                          disabled={
                            deleting !== null || isCurrentUser
                          }
                          title={
                            isCurrentUser
                              ? "You cannot delete your own account"
                              : "Delete user"
                          }
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all border border-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {deleting === user.id ? (
                            <span className="text-xs">⏳</span>
                          ) : (
                            <span className="text-sm">🗑</span>
                          )}
                        </button>

                      </div>

                    </div>

                    {/* Mobile Card */}
                    <div className="flex md:hidden items-start gap-3">

                      {/* Avatar */}
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-xs uppercase shrink-0 mt-0.5"
                        style={{ background: GRAD }}
                      >
                        {getInitials(user.name)}
                      </div>

                      {/* Information */}
                      <div className="flex-1 min-w-0">

                        <div className="flex items-center justify-between gap-2 flex-wrap">

                          <div className="font-semibold text-gray-900 text-sm truncate">
                            {user.name}

                            {isCurrentUser && (
                              <span className="text-xs text-indigo-500 ml-2">
                                You
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => setConfirmDelete(user)}
                            disabled={
                              deleting !== null || isCurrentUser
                            }
                            title={
                              isCurrentUser
                                ? "You cannot delete your own account"
                                : "Delete user"
                            }
                            className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all border border-red-100 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {deleting === user.id ? "⏳" : "🗑"}
                          </button>

                        </div>

                        <div className="text-xs text-gray-400 truncate mb-2">
                          {user.email}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">

                          {/* Role */}
                          <div className="relative inline-flex items-center">

                            <select
                              value={user.role}
                              onChange={(e) =>
                                updateRole(user.id, e.target.value)
                              }
                              disabled={
                                updatingRole !== null ||
                                (isCurrentUser && user.role === "admin")
                              }
                              className={`appearance-none pl-2.5 pr-6 py-1 rounded-lg text-xs font-bold border cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 ${roleColor(user.role)} ${
                                updatingRole === user.id
                                  ? "opacity-50 cursor-wait"
                                  : ""
                              }`}
                            >
                              {ROLE_OPTIONS.map((role) => (

                                <option
                                  key={role.value}
                                  value={role.value}
                                >
                                  {role.label}
                                </option>

                              ))}

                            </select>

                            <span className="pointer-events-none absolute right-1.5 text-xs">
                              {updatingRole === user.id ? "⏳" : "▾"}
                            </span>

                          </div>

                          {/* Club */}
                          {user.club?.name && (
                            <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                              🏛 {user.club.name}
                            </span>
                          )}

                          {/* Joined */}
                          <span className="text-xs text-gray-400">
                            Joined {formatDate(user.joined)}
                          </span>

                        </div>

                      </div>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget && deleting === null) {
              setConfirmDelete(null);
            }
          }}
        >

          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-gray-100">

            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-2xl mb-4 mx-auto">
              🗑
            </div>

            <h3 className="text-lg font-black text-gray-900 text-center mb-1">
              Delete User?
            </h3>

            <p className="text-sm text-gray-500 text-center mb-1">
              You're about to permanently delete
            </p>

            <p className="text-sm font-bold text-gray-800 text-center mb-5">
              {confirmDelete.name}
            </p>

            <p className="text-xs text-red-500 text-center mb-6 bg-red-50 rounded-xl px-3 py-3 border border-red-100">
              ⚠️ This action cannot be undone. Their club memberships and event registrations will also be removed.
            </p>

            <div className="flex gap-3">

              <button
                onClick={() => setConfirmDelete(null)}
                disabled={deleting !== null}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={() => deleteUser(confirmDelete.id)}
                disabled={deleting !== null}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-60"
              >
                {deleting === confirmDelete.id
                  ? "Deleting..."
                  : "Delete"}
              </button>

            </div>

          </div>

        </div>

      )}

      {/* Toast */}
      {toast.msg && (

        <div
          role="alert"
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white max-w-[calc(100vw-2rem)] z-50 ${
            toast.type === "error" ? "bg-red-500" : ""
          }`}
          style={
            toast.type !== "error"
              ? { background: GRAD }
              : {}
          }
        >
          {toast.type === "error" ? "❌" : "✅"} {toast.msg}
        </div>

      )}

    </div>
  );
};

export default ViewUsers;
