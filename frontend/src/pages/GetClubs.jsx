import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const tabs = [
    { key: "all", label: "All Clubs" },
    { key: "my", label: "My Clubs" },
];

const GetClubs = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [clubs, setClubs] = useState([]);
    const [myClubs, setMyClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
     const storedUser = localStorage.getItem("user");

    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        fetchClubs();
        fetchMyClubs(); // ✅ call AFTER user is set
    } else {
        navigate("/login");
    }
}, []);

    const fetchClubs = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/club/allClubs");
            setClubs(res.data.clubs || []);
        } catch (error) {
            console.error("Error fetching clubs:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyClubs = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/club/me", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setMyClubs(res.data.clubs || []);
        } catch (err) {
            console.error("Error fetching my clubs:", err);
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

    const displayedClubs = (activeTab === "all" ? clubs : myClubs).filter((club) =>
        club.name.toLowerCase().includes(search.toLowerCase()) ||
        (club.description || "").toLowerCase().includes(search.toLowerCase())
    );

    const isMyClub = (clubId) => myClubs.some((c) => c._id === clubId);

    const gradients = [
        { from: "#f472b6", to: "#6366f1" },
        { from: "#818cf8", to: "#a855f7" },
        { from: "#ec4899", to: "#fb7185" },
        { from: "#8b5cf6", to: "#818cf8" },
        { from: "#e879f9", to: "#ec4899" },
        { from: "#60a5fa", to: "#6366f1" },
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
                            <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg">
                                {user.role === "admin" && (
                                    <>
                                        <button onClick={() => navigate("/admin")} className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
                                            Admin Dashboard
                                        </button>
                                        <button onClick={() => navigate("/organizer")} className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
                                            Organizer Dashboard
                                        </button>
                                    </>
                                )}
                                {user.role === "organizer" && (
                                    <button onClick={() => navigate("/organizer")} className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
                                        Organizer Dashboard
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
                            Explore Clubs
                        </h2>
                        <p className="text-gray-200 text-base md:text-lg max-w-xl mx-auto mb-8">
                            Find your community. Join clubs that match your interests and make the most of campus life.
                        </p>
                        <div className="max-w-md mx-auto">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></span>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search clubs..."
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
                                    {tab.key === "all" ? clubs.length : myClubs.length}
                                </span>
                            </button>
                        ))}
                    </div>
                    <div className="text-sm text-gray-500">
                        {displayedClubs.length} {displayedClubs.length === 1 ? "result" : "results"}
                        {search && (
                            <button onClick={() => setSearch("")} className="ml-2 text-xs text-pink-500 hover:underline">
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Clubs Grid */}
            <section className="py-12 bg-gradient-to-b from-gray-50 via-pink-50/20 to-indigo-50/20">
                <div className="max-w-6xl mx-auto px-6">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl shadow-md p-6 animate-pulse">
                                    <div className="w-14 h-14 rounded-full bg-gray-200 mx-auto mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                                    <div className="h-3 bg-gray-100 rounded w-full mb-1"></div>
                                    <div className="h-3 bg-gray-100 rounded w-5/6 mx-auto mb-4"></div>
                                    <div className="h-9 bg-gray-200 rounded-full w-full"></div>
                                </div>
                            ))}
                        </div>
                    ) : displayedClubs.length === 0 ? (
                        <div className="text-center py-24">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-indigo-100 flex items-center justify-center text-3xl mx-auto mb-4">
                                {activeTab === "my" ? "🏛️" : "🔎"}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                {activeTab === "my" && !search ? "No clubs joined yet" : "No clubs found"}
                            </h3>
                            <p className="text-gray-500 text-sm">
                                {activeTab === "my" && !search
                                    ? "Join clubs to see them here."
                                    : search
                                    ? `No clubs match "${search}".`
                                    : "No clubs available at the moment."}
                            </p>
                            {activeTab === "my" && !search && (
                                <button
                                    onClick={() => setActiveTab("all")}
                                    className="mt-4 px-5 py-2 bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-full text-sm font-semibold hover:opacity-90 transition"
                                >
                                    Browse All Clubs
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
                            {displayedClubs.map((club, index) => {
                                const gradient = gradients[index % gradients.length];
                                const joined = isMyClub(club._id);
                                return (
                                    <div
                                        key={club._id}
                                        className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col"
                                    >
                                        {/* Top color bar */}
                                        <div
                                            className="h-3"
                                            style={{ background: `linear-gradient(to right, ${gradient.from}, ${gradient.to})` }}
                                        ></div>

                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div
                                                    className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold text-xl shadow-md"
                                                    style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
                                                >
                                                    {club.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-800 text-base leading-tight truncate">
                                                        {club.name}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                        {club.isActive ? (
                                                            <span className="text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5 inline-block">
                                                                Active
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs font-medium text-red-500 bg-red-50 border border-red-200 rounded-full px-2 py-0.5 inline-block">
                                                                Inactive
                                                            </span>
                                                        )}
                                                        {joined && (
                                                            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-full px-2 py-0.5 inline-block">
                                                                Joined ✓
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">
                                                {club.description || "No description available for this club."}
                                            </p>

                                            {/* CTA */}
                                            <Link
                                                to={`/clubs/${club._id}`}
                                                className={`block w-full mt-4 py-2 rounded-full text-sm font-semibold text-center transition hover:scale-[1.02] hover:shadow-md ${
                                                    joined
                                                        ? "bg-indigo-50 text-indigo-700 border border-indigo-300 hover:bg-indigo-100"
                                                        : club.isActive
                                                        ? "bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow"
                                                        : "bg-gray-100 text-gray-500 border border-gray-200"
                                                }`}
                                            >
                                                {joined ? "View Details" : club.isActive ? "View & Join →" : "View Details"}
                                            </Link>
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

export default GetClubs;