import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const tabs = [
    { key: "all", label: "All Events" },
    { key: "my", label: "My Registrations" },
];

const GetEvents = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [allEvents, setAllEvents] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate("/login");
        }
        fetchAllEvents();
        fetchMyEvents();
    }, []);

    const fetchAllEvents = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/event/");
            setAllEvents(res.data.events || []);
        } catch (err) {
            console.error("Error fetching events:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyEvents = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/event/me", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setMyEvents(res.data.events || []);
        } catch (err) {
            console.error("Error fetching my events:", err);
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

    const displayedEvents = (activeTab === "all" ? allEvents : myEvents).filter((e) =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        (e.description || "").toLowerCase().includes(search.toLowerCase()) ||
        (e.location || "").toLowerCase().includes(search.toLowerCase()) ||
        (e.club?.name || "").toLowerCase().includes(search.toLowerCase())
    );

    const isMyEvent = (eventId) => myEvents.some((e) => e._id === eventId);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    };

    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    };

    const seatPercent = (event) => {
        if (!event.totalSeats) return 0;
        return Math.round(((event.totalSeats - event.availableSeats) / event.totalSeats) * 100);
    };

    const gradients = [
        "from-pink-400 to-indigo-500",
        "from-indigo-400 to-purple-500",
        "from-rose-400 to-pink-500",
        "from-violet-500 to-indigo-400",
        "from-fuchsia-400 to-pink-500",
        "from-blue-400 to-indigo-500",
    ];

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

            {/* Page Header */}
            <div className="pt-16">
                
                    <div className="bg-gradient-to-br from-pink-400 via-rose-400 to-indigo-500 py-16 px-6 text-white text-center relative overflow-hidden">
    <div className="absolute inset-0 bg-white/10"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow">
                            Upcoming Events
                        </h2>
                        <p className="text-gray-200 text-base md:text-lg max-w-xl mx-auto mb-8">
                            Discover and register for the latest campus events. Don't miss out!
                        </p>
                        <div className="max-w-md mx-auto">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></span>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search events, clubs, locations..."
                                    className="w-full pl-10 pr-4 py-3 rounded-full text-gray-800 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs + Stats Bar */}
            <div className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-40">
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => { setActiveTab(tab.key); setSearch(""); }}
                                className={`px-5 py-4 text-sm font-semibold border-b-2 transition ${
                                    activeTab === tab.key
                                        ? "border-pink-500 text-pink-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                {tab.label}
                                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                                    activeTab === tab.key
                                        ? "bg-pink-100 text-pink-600"
                                        : "bg-gray-100 text-gray-500"
                                }`}>
                                    {tab.key === "all" ? allEvents.length : myEvents.length}
                                </span>
                            </button>
                        ))}
                    </div>
                    <div className="text-sm text-gray-500">
                        {displayedEvents.length} {displayedEvents.length === 1 ? "result" : "results"}
                        {search && (
                            <button onClick={() => setSearch("")} className="ml-2 text-xs text-pink-500 hover:underline">
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            <section className="py-12 bg-gradient-to-b from-gray-50 via-pink-50/20 to-indigo-50/20">
                <div className="max-w-6xl mx-auto px-6">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
                                    <div className="h-36 bg-gray-200"></div>
                                    <div className="p-5">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-3 bg-gray-100 rounded w-full mb-1"></div>
                                        <div className="h-3 bg-gray-100 rounded w-5/6 mb-4"></div>
                                        <div className="h-9 bg-gray-200 rounded-full w-full"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : displayedEvents.length === 0 ? (
                        <div className="text-center py-24">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-indigo-100 flex items-center justify-center text-3xl mx-auto mb-4">
                                {activeTab === "my" ? "📅" : "🔎"}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                {activeTab === "my" && !search ? "No registrations yet" : "No events found"}
                            </h3>
                            <p className="text-gray-500 text-sm">
                                {activeTab === "my" && !search
                                    ? "Register for upcoming events to see them here."
                                    : search
                                    ? `No events match "${search}".`
                                    : "No upcoming events at the moment."}
                            </p>
                            {activeTab === "my" && !search && (
                                <button
                                    onClick={() => setActiveTab("all")}
                                    className="mt-4 px-5 py-2 bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-full text-sm font-semibold hover:opacity-90 transition"
                                >
                                    Browse All Events
                                </button>
                            )}
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="mt-4 px-5 py-2 bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-full text-sm font-semibold hover:opacity-90 transition"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayedEvents.map((event, index) => {
                                const percent = seatPercent(event);
                                const registered = isMyEvent(event._id);
                                const isFull = event.availableSeats === 0;

                                return (
                                    <div
                                        key={event._id}
                                        className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col"
                                    >
                                        {/* Banner */}
                                        <div className={`relative h-36 bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center`}>
                                            <span className="text-white text-5xl font-extrabold opacity-10 select-none">
                                                {event.title.charAt(0).toUpperCase()}
                                            </span>
                                            {event.club?.name && (
                                                <span className="absolute top-3 left-3 bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/30">
                                                    {event.club.name}
                                                </span>
                                            )}
                                            {registered && (
                                                <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                                                    Registered ✓
                                                </span>
                                            )}
                                            {!registered && percent >= 80 && !isFull && (
                                                <span className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                                                    Almost Full!
                                                </span>
                                            )}
                                            {isFull && !registered && (
                                                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                                                    Full
                                                </span>
                                            )}
                                        </div>

                                        <div className="p-5 flex flex-col flex-1">
                                            <h4 className="font-semibold text-gray-800 text-base mb-1 leading-tight line-clamp-2">
                                                {event.title}
                                            </h4>
                                            <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                                                {event.description || "No description available."}
                                            </p>

                                            {/* Meta info */}
                                            <div className="space-y-1.5 mb-4 text-xs text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <span>📅</span>
                                                    <span>{formatDate(event.eventDate)} · {formatTime(event.eventDate)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span>📍</span>
                                                    <span className="line-clamp-1">{event.location || "Location TBD"}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span>🪑</span>
                                                    <span>{event.availableSeats} / {event.totalSeats} seats available</span>
                                                </div>
                                            </div>

                                            {/* Seat fill bar */}
                                            <div className="mb-4">
                                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${
                                                            percent >= 90 ? "bg-red-400" : percent >= 70 ? "bg-orange-400" : "bg-gradient-to-r from-pink-400 to-indigo-500"
                                                        }`}
                                                        style={{ width: `${percent}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* CTA button — always navigates to detail page */}
                                            <div className="mt-auto">
                                                <Link
                                                    to={`/events/${event._id}`}
                                                    className={`block w-full py-2 rounded-full text-sm font-semibold text-center transition hover:scale-[1.02] hover:shadow-md ${
                                                        registered
                                                            ? "bg-green-50 text-green-700 border border-green-300 hover:bg-green-100"
                                                            : isFull
                                                            ? "bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200"
                                                            : "bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow"
                                                    }`}
                                                >
                                                    {registered ? "View Details" : isFull ? "View Details" : "View & Register →"}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-8 bg-gray-100 border-t border-gray-300 shadow-inner">
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

export default GetEvents;