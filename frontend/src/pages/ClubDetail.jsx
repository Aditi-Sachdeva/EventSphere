import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ClubDetail = () => {
    const { clubId } = useParams();
    const navigate = useNavigate();

    const [club, setClub] = useState(null);
    const [membershipStatus, setMembershipStatus] = useState(null); // null | "pending" | "approved"
    const [loading, setLoading] = useState(true);
    const [joinStatus, setJoinStatus] = useState(null); // null | "loading" | "success" | "error"
    const [joinMsg, setJoinMsg] = useState("");
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [clubEvents, setClubEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate("/login");
        }
        fetchClub();
        handleGetClubEvents();
    }, [clubId]);

    const fetchClub = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/club/${clubId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setClub(res.data.club);
            setMembershipStatus(res.data.membershipStatus); // null | "pending" | "approved"
        } catch (err) {
            console.error("Error fetching club:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleGetClubEvents = async () => {
        setEventsLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/event/club/${clubId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setClubEvents(res.data.events || res.data || []);
        } catch (err) {
            console.error("Error fetching club events:", err);
            setClubEvents([]);
        } finally {
            setEventsLoading(false);
        }
    };

    const handleJoin = async () => {
        setJoinStatus("loading");
        setJoinMsg("");
        try {
            await axios.post(
                "http://localhost:5000/api/club/join",
                { clubId },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            setMembershipStatus("pending");
            setJoinStatus("success");
            setJoinMsg("Your join request has been sent! Awaiting organizer approval.");
        } catch (err) {
            const msg = err.response?.data?.msg || "Something went wrong.";
            if (msg === "Already a member") {
                setMembershipStatus("approved");
                setJoinStatus("success");
                setJoinMsg("You are already a member of this club.");
            } else if (msg === "Already requested, awaiting approval") {
                setMembershipStatus("pending");
                setJoinStatus("success");
                setJoinMsg("Your request is already pending approval.");
            } else {
                setJoinStatus("error");
                setJoinMsg(msg);
            }
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(
                "http://localhost:5000/api/auth/logout",
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        const d = new Date(dateStr);
        if (isNaN(d)) return "—";
        return d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    if (!user) return null;

    return (
        <div className="bg-gray-50 min-h-screen text-gray-800">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow border-b border-gray-200 h-16">
                <div className="max-w-7xl mx-auto px-5 h-full flex justify-between items-center">
                    <Link to="/mainpage" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-indigo-600 text-white flex items-center justify-center rounded-lg font-bold shadow-md text-xs">
                            ES
                        </div>
                        <h1 className="text-lg font-bold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
                            EventSphere
                        </h1>
                    </Link>

                    <div className="hidden md:flex gap-8 font-medium ml-10">
                        <Link to="/mainpage" className="px-3 py-1 text-sm rounded-md transition bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-gray-700 hover:text-transparent">
                            Home
                        </Link>
                        <Link to="/events" className="px-3 py-1 text-sm rounded-md transition bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-gray-700 hover:text-transparent">
                            Events
                        </Link>
                        <Link to="/clubs" className="px-3 py-1 text-sm bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-md font-semibold shadow-sm">
                            Clubs
                        </Link>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md shadow-md border border-gray-300 hover:shadow-lg transition"
                        >
                            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-indigo-600 text-white font-bold text-xs">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-sm text-gray-800">{user.name}</span>
                            <span className="text-gray-600 text-xs">▼</span>
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                                {user.role === "admin" && (
                                    <button onClick={() => navigate("/admin")} className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
                                        Admin Dashboard
                                    </button>
                                )}
                                <button onClick={handleLogout} className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div className="pt-16">
                {/* Back button */}
                <div className="max-w-4xl mx-auto px-6 pt-8 pb-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-500 transition"
                    >
                        ← Back to Clubs
                    </button>
                </div>

                {loading ? (
                    <div className="max-w-4xl mx-auto px-6 py-8 animate-pulse">
                        <div className="h-48 bg-gray-200 rounded-2xl mb-6"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2 mb-3"></div>
                        <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-100 rounded w-4/5 mb-8"></div>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
                            ))}
                        </div>
                        <div className="h-12 bg-gray-200 rounded-full w-44 mx-auto"></div>
                    </div>
                ) : !club ? (
                    <div className="text-center py-32">
                        <div className="text-5xl mb-4">😕</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Club not found</h3>
                        <p className="text-gray-500 text-sm mb-6">This club may have been removed or doesn't exist.</p>
                        <Link to="/clubs" className="px-5 py-2 bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-full text-sm font-semibold hover:opacity-90 transition">
                            Back to Clubs
                        </Link>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto px-6 pb-16">
                        {/* Hero Banner */}
                        <div className="relative h-48 md:h-64 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl overflow-hidden mb-8 flex items-center justify-center shadow-lg">
                            <span className="text-white font-extrabold opacity-10 select-none" style={{ fontSize: "10rem", lineHeight: 1 }}>
                                {club.name.charAt(0).toUpperCase()}
                            </span>
                            {/* Status badge */}
                            <span className={`absolute top-4 right-4 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow ${club.isActive ? "bg-green-500" : "bg-red-500"}`}>
                                {club.isActive ? "Active" : "Inactive"}
                            </span>
                            {/* Membership badge */}
                            {membershipStatus === "approved" && (
                                <span className="absolute top-4 left-4 bg-white/20 text-white text-sm font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/30">
                                    Member ✓
                                </span>
                            )}
                            {membershipStatus === "pending" && (
                                <span className="absolute top-4 left-4 bg-yellow-500/80 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                                    Request Pending
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left — main content */}
                            <div className="lg:col-span-2 space-y-6">
                                <div>
                                    <h2 className="text-3xl font-extrabold text-gray-800 mb-2 leading-tight">
                                        {club.name}
                                    </h2>
                                    <p className="text-sm text-gray-400">
                                        Founded {formatDate(club.createdAt)}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-base font-semibold text-gray-700 mb-2">About this club</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                        {club.description || "No description provided for this club."}
                                    </p>
                                </div>

                                {/* Info Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
                                        <p className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
                                            {club.approvedMemberCount}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1 font-medium">Members</p>
                                    </div>
                                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
                                        <p className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                                            {clubEvents.length}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1 font-medium">Events</p>
                                    </div>
                                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm text-center">
                                        <p className={`text-sm font-bold mt-1 ${club.isActive ? "text-green-600" : "text-red-500"}`}>
                                            {club.isActive ? "● Active" : "● Inactive"}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1 font-medium">Status</p>
                                    </div>
                                </div>

                                {/* Club Events */}
                                <div>
                                    <h3 className="text-base font-semibold text-gray-700 mb-3">Club Events</h3>
                                    {eventsLoading ? (
                                        <div className="space-y-3 animate-pulse">
                                            {[...Array(2)].map((_, i) => (
                                                <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
                                            ))}
                                        </div>
                                    ) : clubEvents.length === 0 ? (
                                        <div className="bg-white border border-gray-100 rounded-xl px-4 py-6 shadow-sm text-center">
                                            <p className="text-sm text-gray-400">No events hosted by this club yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {clubEvents.map((event) => (
                                                <Link
                                                    key={event._id}
                                                    to={`/events/${event._id}`}
                                                    className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm hover:shadow-md hover:border-indigo-200 transition group"
                                                >
                                                    {/* Date badge */}
                                                    <div className="flex-shrink-0 w-12 h-12 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl text-white">
                                                        <span className="text-xs font-semibold leading-none">
                                                            {new Date(event.eventDate).toLocaleDateString("en-IN", { month: "short" })}
                                                        </span>
                                                        <span className="text-lg font-extrabold leading-none">
                                                            {new Date(event.eventDate).getDate()}
                                                        </span>
                                                    </div>
                                                    {/* Event info */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition">
                                                            {event.title}
                                                        </p>
                                                        <p className="text-xs text-gray-400 truncate mt-0.5">
                                                            {event.location || "Venue TBD"} · {formatDate(event.eventDate)}
                                                        </p>
                                                    </div>
                                                    {/* Status pill */}
                                                    <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${new Date(event.eventDate) >= new Date()
                                                            ? "bg-green-50 text-green-600 border-green-200"
                                                            : "bg-gray-50 text-gray-400 border-gray-200"
                                                        }`}>
                                                        {new Date(event.eventDate) >= new Date() ? "Upcoming" : "Past"}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right — join card */}
                            <div className="lg:col-span-1">
                                <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 sticky top-24">
                                    <h3 className="text-base font-semibold text-gray-700 mb-1">Membership</h3>
                                    <p className="text-xs text-gray-400 mb-5">
                                        Join requests are reviewed by organizers before approval.
                                    </p>

                                    {/* Feedback message */}
                                    {joinStatus === "success" && (
                                        <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                                            {joinMsg}
                                        </div>
                                    )}
                                    {joinStatus === "error" && (
                                        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                            {joinMsg}
                                        </div>
                                    )}

                                    {/* Action button */}
                                    {joinStatus === "loading" ? (
                                        <button disabled className="w-full py-3 rounded-full text-sm font-semibold bg-gray-200 text-gray-500 cursor-not-allowed">
                                            Sending request...
                                        </button>
                                    ) : membershipStatus === "approved" ? (
                                        <div className="text-center text-sm text-green-600 font-medium bg-green-50 border border-green-200 rounded-xl py-3">
                                            🎉 You're a member!
                                        </div>
                                    ) : membershipStatus === "pending" ? (
                                        <div className="text-center text-sm text-yellow-700 font-medium bg-yellow-50 border border-yellow-200 rounded-xl py-3">
                                            ⏳ Request pending approval
                                        </div>
                                    ) : !club.isActive ? (
                                        <button disabled className="w-full py-3 rounded-full text-sm font-semibold bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed">
                                            Club Unavailable
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleJoin}
                                            className="w-full py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow hover:shadow-md hover:scale-[1.02] transition"
                                        >
                                            Request to Join
                                        </button>
                                    )}

                                    <p className="text-xs text-gray-400 text-center mt-3">
                                        Free to join · Subject to approval
                                    </p>

                                    {/* Quick stats */}
                                    <div className="mt-5 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500">
                                        <div className="flex justify-between">
                                            <span>Members</span>
                                            <span className="font-semibold text-gray-700">{club.approvedMemberCount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Founded</span>
                                            <span className="font-semibold text-gray-700">{formatDate(club.createdAt)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Status</span>
                                            <span className={`font-semibold ${club.isActive ? "text-green-600" : "text-red-500"}`}>
                                                {club.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Events</span>
                                            <span className="font-semibold text-gray-700">{clubEvents.length}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-gray-100 border-t border-gray-300 shadow-inner">
                <div className="max-w-6xl mx-auto px-6 py-14">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-indigo-600 text-white flex items-center justify-center rounded-xl font-bold text-lg">
                                    ES
                                </div>
                                <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
                                    EventSphere
                                </h2>
                            </div>
                            <p className="text-gray-800 text-sm leading-relaxed">
                                A modern campus event & club management platform helping students discover events, join communities, and stay connected effortlessly.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent mb-4 ml-15">
                                Explore
                            </h3>
                            <ul className="space-y-3 text-sm text-gray-800 ml-15">
                                <li><Link to="/mainpage" className="hover:text-pink-600">Home</Link></li>
                                <li><Link to="/events" className="hover:text-pink-600">Events</Link></li>
                                <li><Link to="/clubs" className="hover:text-pink-600">Clubs</Link></li>
                                <li><Link to="/signup" className="hover:text-pink-600">Register</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-500 to-pink-600 bg-clip-text text-transparent mb-4">
                                Platform
                            </h3>
                            <div className="space-y-3 text-sm text-gray-800">
                                <p>Campus Event Management System</p>
                                <p>Built for Student Communities</p>
                                <p>Seamless Event Experience</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-200 border-t border-gray-300">
                    <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-gray-800 tracking-wide">
                        <span className="bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent font-semibold">
                            © 2026 EventSphere
                        </span>{" "}
                        — All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ClubDetail;




