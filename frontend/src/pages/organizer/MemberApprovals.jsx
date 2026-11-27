
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import OrganizerLayout from "./OrganizerLayout";

const GRAD = "linear-gradient(to right, #ec4899, #6366f1)";

const AVATAR_GRADS = [
  "from-pink-500 to-indigo-600",
  "from-indigo-500 to-purple-600",
  "from-pink-400 to-rose-500",
  "from-violet-500 to-indigo-500",
  "from-fuchsia-500 to-pink-500",
];

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function avatarGrad(name = "") {
  return AVATAR_GRADS[
    (name.charCodeAt(0) || 0) % AVATAR_GRADS.length
  ];
}

function getMemberUserId(member) {
  const user = member?.user;

  if (typeof user === "string") {
    return user;
  }

  return user?._id || null;
}

function getMemberName(member) {
  return member?.user?.name || "Unknown";
}

function getClubId(user) {
  const club =
    user?.clubId ||
    user?.club?._id ||
    user?.club?.id ||
    user?.club;

  if (typeof club === "string") {
    return club;
  }

  return club?._id || club?.id || null;
}

export default function MemberApprovals() {
  const navigate = useNavigate();

  const [pendingMembers, setPendingMembers] = useState([]);
  const [approvedMembers, setApprovedMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [actionLoading, setActionLoading] = useState(null);

  const [toast, setToast] = useState({
    msg: "",
    type: "",
  });

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    userId: null,
    name: "",
  });

  const [clubId, setClubId] = useState(null);

  // Show notification
  function showToast(msg, type = "success") {
    setToast({ msg, type });
  }

  // Automatically clear notification
  useEffect(() => {
    if (!toast.msg) return;

    const timer = setTimeout(() => {
      setToast({ msg: "", type: "" });
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  // Fetch club members
  const fetchMembers = useCallback(async (id) => {
    if (!id) {
      setLoading(false);
      setLoadError(
        "No club is associated with this organizer account."
      );
      return;
    }

    setLoading(true);
    setLoadError("");

    try {
      const response = await axios.get(
        `/api/club/${encodeURIComponent(id)}/pending`
      );

      const pending = response.data?.pending;
      const approved = response.data?.approved;

      if (!Array.isArray(pending) || !Array.isArray(approved)) {
        throw new Error(
          "Invalid member data received from server."
        );
      }

      setPendingMembers(pending);
      setApprovedMembers(approved);

    } catch (error) {
      console.error(
        "Failed to fetch club members:",
        error.response?.data || error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setLoadError(
        error.response?.data?.msg ||
        error.message ||
        "Failed to load member requests."
      );

    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Get organizer and club information
  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!stored || !token) {
      navigate("/login");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      const id = getClubId(parsed);

      if (!id) {
        setLoading(false);
        setLoadError(
          "No club is associated with this organizer account."
        );
        return;
      }

      setClubId(id);
      fetchMembers(id);

    } catch (error) {
      console.error("Invalid user data:", error);

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      navigate("/login");
    }
  }, [navigate, fetchMembers]);

  // Approve member
  async function handleApprove(userId) {
    if (!userId || !clubId || actionLoading !== null) {
      return;
    }

    const member = pendingMembers.find(
      (item) => getMemberUserId(item) === userId
    );

    if (!member) return;

    setActionLoading(userId);

    try {
      const response = await axios.post(
        "/api/club/approve",
        {
          clubId,
          userId,
        }
      );

      setPendingMembers((prev) =>
        prev.filter(
          (item) => getMemberUserId(item) !== userId
        )
      );

      setApprovedMembers((prev) => [
        {
          ...member,
          status: "approved",
        },
        ...prev.filter(
          (item) => getMemberUserId(item) !== userId
        ),
      ]);

      showToast(
        response.data?.msg ||
        `${getMemberName(member)} approved successfully`
      );

    } catch (error) {
      console.error("Approve member error:", error);

      showToast(
        error.response?.data?.msg ||
        "Failed to approve member.",
        "error"
      );

    } finally {
      setActionLoading(null);
    }
  }

  // Reject pending request
  async function handleReject(userId) {
    if (!userId || !clubId || actionLoading !== null) {
      return;
    }

    const member = pendingMembers.find(
      (item) => getMemberUserId(item) === userId
    );

    if (!member) return;

    setActionLoading(userId);

    try {
      const response = await axios.post(
        "/api/club/remove",
        {
          clubId,
          userId,
        }
      );

      setPendingMembers((prev) =>
        prev.filter(
          (item) => getMemberUserId(item) !== userId
        )
      );

      showToast(
        response.data?.msg ||
        `${getMemberName(member)}'s request rejected`
      );

    } catch (error) {
      console.error("Reject member error:", error);

      showToast(
        error.response?.data?.msg ||
        "Failed to reject request.",
        "error"
      );

    } finally {
      setActionLoading(null);
    }
  }

  // Remove approved member
  async function confirmRemove() {
    const { userId, name } = confirmDialog;

    if (!userId || !clubId || actionLoading !== null) {
      return;
    }

    setActionLoading(userId);

    try {
      const response = await axios.post(
        "/api/club/remove",
        {
          clubId,
          userId,
        }
      );

      setApprovedMembers((prev) =>
        prev.filter(
          (item) => getMemberUserId(item) !== userId
        )
      );

      showToast(
        response.data?.msg ||
        `${name || "Member"} removed successfully`
      );

    } catch (error) {
      console.error("Remove member error:", error);

      showToast(
        error.response?.data?.msg ||
        "Failed to remove member.",
        "error"
      );

    } finally {
      setActionLoading(null);

      setConfirmDialog({
        open: false,
        userId: null,
        name: "",
      });
    }
  }

  return (
    <OrganizerLayout>
      {({ clubName }) => (
        <>

          {/* Page Header */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
              Member Approvals
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Review join requests for{" "}
              {clubName || "your club"}
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-6 sm:mb-8">

            {[
              {
                label: "Pending",
                value: pendingMembers.length,
                large: true,
              },
              {
                label: "Approved",
                value: approvedMembers.length,
                large: true,
              },
              {
                label: "Club",
                value: clubName || "—",
                large: false,
              },
            ].map(({ label, value, large }) => (

              <div
                key={label}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-5"
              >
                <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider mb-1 truncate">
                  {label}
                </p>

                <p
                  className={`font-extrabold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent truncate ${
                    large
                      ? "text-xl sm:text-3xl"
                      : "text-sm sm:text-lg"
                  }`}
                >
                  {value}
                </p>
              </div>

            ))}

          </div>

          {/* Pending Requests */}
          <div className="mb-6 sm:mb-8">

            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              Pending Requests

              {pendingMembers.length > 0 && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                  {pendingMembers.length}
                </span>
              )}
            </h3>

            {/* Loading */}
            {loading ? (

              <div className="space-y-3">

                {[1, 2, 3].map((i) => (

                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 animate-pulse flex items-center gap-3 sm:gap-4"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex-shrink-0" />

                    <div className="flex-1">
                      <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>

                ))}

              </div>

            ) : loadError ? (

              /* Error */
              <div className="bg-white rounded-2xl border border-red-100 p-6 sm:p-8 text-center">

                <AlertCircle
                  size={32}
                  className="text-red-500 mx-auto mb-3"
                />

                <p className="text-gray-700 font-semibold">
                  Unable to load members
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  {loadError}
                </p>

                <button
                  onClick={() => fetchMembers(clubId)}
                  className="mt-4 px-5 py-2 rounded-full text-sm font-semibold text-white"
                  style={{ background: GRAD }}
                >
                  Try Again
                </button>

              </div>

            ) : pendingMembers.length === 0 ? (

              /* Empty State */
              <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-10 text-center">

                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-gradient-to-br from-pink-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4 text-2xl">
                  ✓
                </div>

                <p className="text-gray-500 text-sm font-medium">
                  All caught up!
                </p>

                <p className="text-gray-400 text-xs mt-1">
                  No pending join requests at the moment.
                </p>

              </div>

            ) : (

              /* Pending Members */
              <div className="space-y-3">

                {pendingMembers.map((member) => {

                  const uid = getMemberUserId(member);
                  const name = getMemberName(member);
                  const email = member.user?.email || "";

                  return (

                    <div
                      key={uid}
                      className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-shadow"
                    >

                      <div className="flex items-center gap-3">

                        {/* Avatar */}
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${avatarGrad(name)} flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0`}
                        >
                          {getInitials(name)}
                        </div>

                        {/* Member Information */}
                        <div className="flex-1 min-w-0">

                          <p className="font-semibold text-gray-800 text-sm truncate">
                            {name}
                          </p>

                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {email}
                          </p>

                          <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full mt-1.5 inline-block font-medium">
                            Pending
                          </span>

                        </div>

                        {/* Desktop Buttons */}
                        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">

                          <button
                            onClick={() => handleApprove(uid)}
                            disabled={actionLoading !== null || !uid}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
                            style={{ background: GRAD }}
                          >
                            {actionLoading === uid
                              ? "Processing..."
                              : "Approve"}
                          </button>

                          <button
                            onClick={() => handleReject(uid)}
                            disabled={actionLoading !== null || !uid}
                            className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                          >
                            {actionLoading === uid
                              ? "Processing..."
                              : "Reject"}
                          </button>

                        </div>

                      </div>

                      {/* Mobile Buttons */}
                      <div className="sm:hidden flex gap-2 mt-3">

                        <button
                          onClick={() => handleApprove(uid)}
                          disabled={actionLoading !== null || !uid}
                          className="flex-1 py-2 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
                          style={{ background: GRAD }}
                        >
                          {actionLoading === uid
                            ? "Processing..."
                            : "Approve"}
                        </button>

                        <button
                          onClick={() => handleReject(uid)}
                          disabled={actionLoading !== null || !uid}
                          className="flex-1 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                        >
                          {actionLoading === uid
                            ? "Processing..."
                            : "Reject"}
                        </button>

                      </div>

                    </div>

                  );

                })}

              </div>

            )}

          </div>

          {/* Approved Members */}
          {!loading && !loadError && (

            <div>

              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                Approved Members

                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                  {approvedMembers.length}
                </span>
              </h3>

              {approvedMembers.length === 0 ? (

                <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
                  <p className="text-gray-400 text-sm">
                    No approved members yet.
                  </p>
                </div>

              ) : (

                <div className="space-y-3">

                  {approvedMembers.map((member) => {

                    const uid = getMemberUserId(member);
                    const name = getMemberName(member);
                    const email = member.user?.email || "";

                    return (

                      <div
                        key={uid}
                        className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow"
                      >

                        {/* Avatar */}
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${avatarGrad(name)} flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0`}
                        >
                          {getInitials(name)}
                        </div>

                        {/* Information */}
                        <div className="flex-1 min-w-0">

                          <p className="font-semibold text-gray-800 text-sm truncate">
                            {name}
                          </p>

                          <p className="text-xs text-gray-500 truncate">
                            {email}
                          </p>

                          <span className="sm:hidden inline-block text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold mt-1">
                            ✓ Member
                          </span>

                        </div>

                        {/* Desktop Member Badge */}
                        <span className="hidden sm:inline text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold whitespace-nowrap">
                          ✓ Member
                        </span>

                        {/* Remove Button */}
                        <button
                          onClick={() =>
                            setConfirmDialog({
                              open: true,
                              userId: uid,
                              name,
                            })
                          }
                          disabled={actionLoading !== null || !uid}
                          className="px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-50 whitespace-nowrap"
                        >
                          Remove
                        </button>

                      </div>

                    );

                  })}

                </div>

              )}

            </div>

          )}

          {/* Confirmation Dialog */}
          {confirmDialog.open && (

            <div
              className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setConfirmDialog({
                    open: false,
                    userId: null,
                    name: "",
                  });
                }
              }}
            >

              <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 w-full max-w-sm">

                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                  Remove Member?
                </h3>

                <p className="text-sm text-gray-600 mb-4">
                  You're about to remove{" "}
                  <span className="font-semibold">
                    {confirmDialog.name}
                  </span>{" "}
                  from the club.

                  <br />

                  This action cannot be undone.
                </p>

                <div className="flex gap-2 sm:gap-3">

                  <button
                    onClick={() =>
                      setConfirmDialog({
                        open: false,
                        userId: null,
                        name: "",
                      })
                    }
                    disabled={actionLoading !== null}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={confirmRemove}
                    disabled={actionLoading !== null}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition disabled:opacity-50"
                  >
                    {actionLoading === confirmDialog.userId
                      ? "Removing..."
                      : "Remove"}
                  </button>

                </div>

              </div>

            </div>

          )}

          {/* Toast Notification */}
          {toast.msg && (

            <div
              role="alert"
              className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 px-4 sm:px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2 max-w-[calc(100vw-2rem)] ${
                toast.type === "error"
                  ? "bg-red-50 border border-red-200 text-red-700"
                  : "bg-white border border-gray-200 text-gray-800"
              }`}
            >

              {toast.type === "error" ? (

                <AlertCircle
                  size={15}
                  className="text-red-500 flex-shrink-0"
                />

              ) : (

                <CheckCircle2
                  size={15}
                  className="text-green-500 flex-shrink-0"
                />

              )}

              <span>{toast.msg}</span>

            </div>

          )}

        </>
      )}
    </OrganizerLayout>
  );
}
