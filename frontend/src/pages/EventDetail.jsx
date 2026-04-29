import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EventDetail = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionStatus, setActionStatus] = useState(null);
    const [actionMsg, setActionMsg] = useState("");
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate("/login");
        }
        fetchEvent();
    }, [eventId]);

    const fetchEvent = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/event/${eventId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setEvent(res.data.event);
            setIsRegistered(res.data.isRegistered);
        } catch (err) {
            console.error("Error fetching event:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        setActionStatus("loading");
        setActionMsg("");
        try {
            await axios.post(
                `http://localhost:5000/api/event/${eventId}/register`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            setIsRegistered(true);
            setActionStatus("success");
            setActionMsg("You have successfully registered for this event!");
            fetchEvent();
        } catch (err) {
            const msg = err.response?.data?.msg || "Something went wrong.";
            setActionStatus("error");
            setActionMsg(msg);
        }
    };

    const handleUnregister = async () => {
        setActionStatus("loading");
        setActionMsg("");
        try {
            await axios.patch(
                `http://localhost:5000/api/event/${eventId}/unregister`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            setIsRegistered(false);
            setActionStatus("success");
            setActionMsg("You have cancelled your registration.");
            fetchEvent();
        } catch (err) {
            const msg = err.response?.data?.msg || "Something went wrong.";
            setActionStatus("error");
            setActionMsg(msg);
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
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-IN", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
        });
    };

    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    };

    const seatPercent = () => {
        if (!event?.totalSeats) return 0;
        return Math.round(((event.totalSeats - event.availableSeats) / event.totalSeats) * 100);
    };

    if (!user) return null;

    return (
        <div className="bg-gradient-to-b from-gray-50 via-pink-50/10 to-indigo-50/10 min-h-screen text-gray-800">

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
                        <Link to="/events" className="px-3 py-1 text-sm bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-md font-semibold shadow-sm">
                            Events
                        </Link>
                        <Link to="/clubs" className="px-3 py-1 text-sm rounded-md transition bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-gray-700 hover:text-transparent">
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
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pink-500 transition group bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:shadow-md hover:border-pink-200"
                    >
                        <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
                        Back to Events
                    </button>
                </div>

                {loading ? (
                    <div className="max-w-4xl mx-auto px-6 py-8 animate-pulse">
                        <div className="h-64 bg-gray-200 rounded-2xl mb-6"></div>
                        <div className="h-8 bg-gray-200 rounded w-2/3 mb-3"></div>
                        <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-100 rounded w-5/6 mb-8"></div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
                            ))}
                        </div>
                        <div className="h-12 bg-gray-200 rounded-full w-48 mx-auto"></div>
                    </div>
                ) : !event ? (
                    <div className="text-center py-32">
                        <div className="text-5xl mb-4">😕</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Event not found</h3>
                        <p className="text-gray-500 text-sm mb-6">This event may have been cancelled or doesn't exist.</p>
                        <Link to="/events" className="px-5 py-2 bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-full text-sm font-semibold hover:opacity-90 transition">
                            Back to Events
                        </Link>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto px-6 pb-16">

                        {/* Hero Banner */}
                        <div className="relative h-64 md:h-80 bg-gradient-to-br from-pink-400 via-rose-300 to-indigo-400 rounded-2xl overflow-hidden mb-8 flex items-center justify-center shadow-xl">
                            {/* Decorative orbs */}
                            <div className="absolute -top-8 -left-8 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-indigo-300/20 rounded-full blur-2xl"></div>
                            <div className="absolute top-10 right-20 w-24 h-24 bg-pink-300/20 rounded-full blur-xl"></div>

                            <span className="text-white font-extrabold opacity-10 select-none" style={{ fontSize: "12rem", lineHeight: 1 }}>
                                {event.title.charAt(0).toUpperCase()}
                            </span>

                            {/* Club badge */}
                            {event.club?.name && (
                                <span className="absolute top-4 left-4 bg-white/25 text-white text-sm font-semibold px-3 py-1.5 rounded-full backdrop-blur-md border border-white/40 shadow-sm">
                                    🏛️ {event.club.name}
                                </span>
                            )}

                            {/* Status badge */}
                            {isRegistered && (
                                <span className="absolute top-4 right-4 bg-green-500/90 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm">
                                    ✓ You're Registered
                                </span>
                            )}
                            {!isRegistered && event.availableSeats === 0 && (
                                <span className="absolute top-4 right-4 bg-red-500/90 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-md">
                                    Fully Booked
                                </span>
                            )}

                            {/* Bottom overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent px-6 py-4">
                                <p className="text-white/80 text-xs font-medium uppercase tracking-widest">
                                    {event.club?.name || "Campus Event"}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                            {/* Left — main content */}
                            <div className="lg:col-span-3 space-y-6">

                                {/* Title + organizer */}
                                <div>
                                    <h2 className="text-3xl font-extrabold text-gray-800 mb-3 leading-tight">
                                        {event.title}
                                    </h2>
                                    {event.createdBy?.name && (
                                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-50 to-indigo-50 border border-pink-100 rounded-full px-3 py-1.5">
                                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                                                {event.createdBy.name.charAt(0)}
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Organized by{" "}
                                                <span className="font-semibold text-gray-700">{event.createdBy.name}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* About */}
                                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                    <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                        About this Event
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                        {event.description || "No description provided for this event."}
                                    </p>
                                </div>

                                {/* Info Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { icon: "📅", label: "Date", value: formatDate(event.eventDate) },
                                        { icon: "🕐", label: "Time", value: formatTime(event.eventDate) },
                                        { icon: "📍", label: "Location", value: event.location || "TBD" },
                                        { icon: "🏛️", label: "Club", value: event.club?.name || "—" },
                                    ].map(({ icon, label, value }) => (
                                        <div
                                            key={label}
                                            className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start gap-3 hover:shadow-md hover:border-pink-100 transition-all duration-200 group"
                                        >
                                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-50 to-indigo-50 border border-pink-100 flex items-center justify-center text-base group-hover:scale-110 transition-transform flex-shrink-0">
                                                {icon}
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-medium mb-0.5 uppercase tracking-wide">{label}</p>
                                                <p className="text-sm font-semibold text-gray-700">{value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right — registration card */}
                            <div className="lg:col-span-2">
                                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden sticky top-24 scale-[1.02]">

                                    {/* Card header strip */}
                                    <div className="bg-gradient-to-r from-pink-400 via-rose-300 to-indigo-400 px-6 py-4">
                                        <h3 className="text-white font-bold text-lg">Registration</h3>
                                        <p className="text-white/75 text-xs mt-0.5">Secure your spot today</p>
                                    </div>

                                    <div className="p-6">
                                        {/* Seat availability */}
                                        <div className="mb-5">
                                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                <span className="font-medium text-gray-700">{event.availableSeats} seats left</span>
                                                <span>{event.totalSeats} total</span>
                                            </div>
                                            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${
                                                        seatPercent() >= 90
                                                            ? "bg-red-400"
                                                            : seatPercent() >= 70
                                                            ? "bg-orange-400"
                                                            : "bg-gradient-to-r from-pink-400 to-indigo-500"
                                                    }`}
                                                    style={{ width: `${seatPercent()}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                {seatPercent()}% filled
                                                {seatPercent() >= 80 && event.availableSeats > 0 && (
                                                    <span className="text-orange-500 font-semibold"> · Filling fast!</span>
                                                )}
                                            </p>
                                        </div>

                                        {/* Feedback messages */}
                                        {actionStatus === "success" && (
                                            <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-2">
                                                <span>✅</span> {actionMsg}
                                            </div>
                                        )}
                                        {actionStatus === "error" && (
                                            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                                                <span>⚠️</span> {actionMsg}
                                            </div>
                                        )}

                                        {/* Action button */}
                                        {actionStatus === "loading" ? (
                                            <button disabled className="w-full py-3.5 rounded-full text-base font-semibold bg-gray-100 text-gray-400 cursor-not-allowed flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                                </svg>
                                                Processing...
                                            </button>
                                        ) : isRegistered ? (
                                            <div className="space-y-3">
                                                <div className="text-center text-sm text-green-600 font-semibold bg-green-50 border border-green-200 rounded-xl py-3">
                                                    🎉 You're all set!
                                                </div>
                                                <button
                                                    onClick={handleUnregister}
                                                    className="w-full py-2.5 rounded-full text-sm font-semibold border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition"
                                                >
                                                    Cancel Registration
                                                </button>
                                            </div>
                                        ) : event.availableSeats === 0 ? (
                                            <button disabled className="w-full py-3 rounded-full text-sm font-semibold bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed">
                                                No Seats Available
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleRegister}
                                                className="w-full py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
                                            >
                                                Register Now →
                                            </button>
                                        )}

                                        <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
                                            <span>🔒</span> Free registration · Cancel anytime
                                        </p>
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

export default EventDetail;