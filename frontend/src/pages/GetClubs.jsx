
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const tabs = [
    { key: "all", label: "All Clubs" },
    { key: "my", label: "My Clubs" },
];

const gradients = [
    { from: "#f472b6", to: "#6366f1" },
    { from: "#818cf8", to: "#a855f7" },
    { from: "#ec4899", to: "#fb7185" },
    { from: "#8b5cf6", to: "#818cf8" },
    { from: "#e879f9", to: "#ec4899" },
    { from: "#60a5fa", to: "#6366f1" },
];

const GetClubs = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [clubs, setClubs] = useState([]);
    const [myClubs, setMyClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigate = useNavigate();

    const fetchClubs = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const [allResponse, myResponse] = await Promise.all([
                axios.get("/api/club/allClubs"),
                axios.get("/api/club/me"),
            ]);

            setClubs(
                Array.isArray(allResponse.data.clubs)
                    ? allResponse.data.clubs
                    : []
            );

            setMyClubs(
                Array.isArray(myResponse.data.clubs)
                    ? myResponse.data.clubs
                    : []
            );
        } catch (err) {
            console.error("Error fetching clubs:", err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }

            setError(
                err.response?.data?.msg ||
                "Unable to load clubs. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
            navigate("/login");
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);

            if (!parsedUser || !parsedUser.name) {
                throw new Error("Invalid user information");
            }

            setUser(parsedUser);
            fetchClubs();
        } catch (err) {
            console.error("Invalid stored user:", err);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
        }
    }, [navigate, fetchClubs]);

    // Close dropdowns when clicking outside them.
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                !event.target.closest("[data-dropdown]") &&
                !event.target.closest("[data-mobilemenu]")
            ) {
                setDropdownOpen(false);
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("/api/auth/logout");
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

    const isMyClub = (clubId) => {
        return myClubs.some(
            (club) => String(club._id) === String(clubId)
        );
    };

    const displayedClubs = useMemo(() => {
        const selectedClubs =
            activeTab === "all" ? clubs : myClubs;

        const searchText = search.trim().toLowerCase();

        if (!searchText) {
            return selectedClubs;
        }

        return selectedClubs.filter((club) => {
            return (
                (club.name || "").toLowerCase().includes(searchText) ||
                (club.description || "").toLowerCase().includes(searchText)
            );
        });
    }, [activeTab, clubs, myClubs, search]);

    if (!user) {
        return null;
    }

    return (
        <div className="bg-gray-50 min-h-screen text-gray-800">

            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow border-b border-gray-200 h-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-5 h-full flex justify-between items-center">

                    {/* Logo */}
                    <Link
                        to="/mainpage"
                        className="flex items-center gap-2 flex-shrink-0"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-indigo-600 text-white flex items-center justify-center rounded-lg font-bold shadow-md text-xs">
                            ES
                        </div>

                        <h1 className="text-lg font-bold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
                            EventSphere
                        </h1>
                    </Link>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex gap-8 font-medium ml-10">
                        <Link
                            to="/mainpage"
                            className="px-3 py-1 text-sm rounded-md text-gray-700 hover:text-pink-600 transition"
                        >
                            Home
                        </Link>

                        <Link
                            to="/events"
                            className="px-3 py-1 text-sm rounded-md text-gray-700 hover:text-pink-600 transition"
                        >
                            Events
                        </Link>

                        <Link
                            to="/clubs"
                            className="px-3 py-1 text-sm bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-md font-semibold shadow-sm"
                        >
                            Clubs
                        </Link>
                    </div>

                    {/* User menu */}
                    <div className="flex items-center gap-2">

                        <div className="relative" data-dropdown>
                            <button
                                onClick={() => {
                                    setDropdownOpen(!dropdownOpen);
                                    setMobileMenuOpen(false);
                                }}
                                className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md shadow-md border border-gray-300 hover:shadow-lg transition"
                            >
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-indigo-600 text-white font-bold text-xs flex-shrink-0">
                                    {(user.name || "U").charAt(0).toUpperCase()}
                                </div>

                                <span className="hidden sm:inline font-medium text-sm text-gray-800 max-w-[100px] truncate">
                                    {user.name}
                                </span>

                                <span className="text-gray-600 text-xs">
                                    ▼
                                </span>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">

                                    {user.role === "admin" && (
                                        <>
                                            <button
                                                onClick={() => navigate("/admin")}
                                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Admin Dashboard
                                            </button>

                                            <button
                                                onClick={() => navigate("/organizer")}
                                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Organizer Dashboard
                                            </button>
                                        </>
                                    )}

                                    {user.role === "organizer" && (
                                        <button
                                            onClick={() => navigate("/organizer")}
                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Organizer Dashboard
                                        </button>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            data-mobilemenu
                            onClick={() => {
                                setMobileMenuOpen(!mobileMenuOpen);
                                setDropdownOpen(false);
                            }}
                            className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 transition"
                            aria-label="Toggle menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            <span
                                style={{
                                    width: "18px",
                                    height: "2px",
                                    display: "block",
                                    backgroundColor: "#4B5563",
                                    transition: "all 0.2s",
                                    transform: mobileMenuOpen
                                        ? "rotate(45deg) translate(0, 5px)"
                                        : "none",
                                    marginBottom: "3px",
                                }}
                            />

                            <span
                                style={{
                                    width: "18px",
                                    height: "2px",
                                    display: "block",
                                    backgroundColor: "#4B5563",
                                    opacity: mobileMenuOpen ? 0 : 1,
                                    transition: "all 0.2s",
                                    marginBottom: "3px",
                                }}
                            />

                            <span
                                style={{
                                    width: "18px",
                                    height: "2px",
                                    display: "block",
                                    backgroundColor: "#4B5563",
                                    transition: "all 0.2s",
                                    transform: mobileMenuOpen
                                        ? "rotate(-45deg) translate(0, -5px)"
                                        : "none",
                                }}
                            />
                        </button>
                    </div>
                </div>

                {/* Mobile navigation */}
                {mobileMenuOpen && (
                    <div
                        className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-md z-40 px-4 py-3 flex flex-col gap-1"
                        data-mobilemenu
                    >
                        <Link
                            to="/mainpage"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                        >
                            Home
                        </Link>

                        <Link
                            to="/events"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                        >
                            Events
                        </Link>

                        <Link
                            to="/clubs"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-3 py-2 text-sm rounded-md text-pink-600 bg-pink-50 font-semibold"
                        >
                            Clubs
                        </Link>
                    </div>
                )}
            </nav>

            {/* Page header */}
            <div className="pt-16">
                <div className="bg-gradient-to-br from-pink-400 via-rose-400 to-indigo-500 py-12 sm:py-20 px-4 sm:px-6 text-white text-center relative overflow-hidden">

                    <div className="absolute inset-0 bg-white/10"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 drop-shadow">
                            Explore Clubs
                        </h2>

                        <p className="text-gray-200 text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-6 sm:mb-8">
                            Discover campus communities, connect with students, and become part of something exciting.
                        </p>

                        <div className="max-w-md mx-auto px-2 sm:px-0">
                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search clubs..."
                                className="w-full pl-5 pr-4 py-2.5 sm:py-3 rounded-full text-gray-800 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-40">
                <div className="max-w-6xl mx-auto px-3 sm:px-6 flex items-center justify-between">

                    <div className="flex">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => {
                                    setActiveTab(tab.key);
                                    setSearch("");
                                }}
                                className={`px-3 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm font-semibold border-b-2 transition ${
                                    activeTab === tab.key
                                        ? "border-pink-500 text-pink-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                {tab.label}

                                <span
                                    className={`ml-1.5 sm:ml-2 text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                                        activeTab === tab.key
                                            ? "bg-pink-100 text-pink-600"
                                            : "bg-gray-100 text-gray-500"
                                    }`}
                                >
                                    {tab.key === "all"
                                        ? clubs.length
                                        : myClubs.length}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                        <span>
                            {displayedClubs.length}{" "}
                            {displayedClubs.length === 1
                                ? "result"
                                : "results"}
                        </span>

                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="ml-1 sm:ml-2 text-xs text-pink-500 hover:underline"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Clubs section */}
            <section className="py-8 sm:py-12 bg-gradient-to-b from-gray-50 via-pink-50/20 to-indigo-50/20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>

                            <p className="text-gray-500 mt-4">
                                Loading clubs...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-16 px-4">
                            <p className="text-red-600 mb-4">
                                {error}
                            </p>

                            <button
                                onClick={fetchClubs}
                                className="px-5 py-2 bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-full text-sm font-semibold hover:opacity-90"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : displayedClubs.length === 0 ? (
                        <div className="text-center py-16 sm:py-24 px-4">

                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-indigo-100 flex items-center justify-center text-3xl mx-auto mb-4">
                                {activeTab === "my" ? "👥" : "🔎"}
                            </div>

                            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
                                {activeTab === "my" && !search
                                    ? "You haven't joined any clubs yet"
                                    : "No clubs found"}
                            </h3>

                            <p className="text-gray-500 text-sm">
                                {activeTab === "my" && !search
                                    ? "Explore the available clubs and find a community you like."
                                    : search
                                    ? `No clubs match "${search}".`
                                    : "There are no active clubs available at the moment."}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">

                            {displayedClubs.map((club, index) => {
                                const gradient =
                                    gradients[index % gradients.length];

                                const joined = isMyClub(club._id);

                                return (
                                    <div
                                        key={club._id}
                                        className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col"
                                    >
                                        {/* Top color bar */}
                                        <div
                                            className="h-3"
                                            style={{
                                                background: `linear-gradient(to right, ${gradient.from}, ${gradient.to})`,
                                            }}
                                        ></div>

                                        <div className="p-5 sm:p-6 flex flex-col flex-1">

                                            <div className="flex items-center gap-3 sm:gap-4 mb-4">

                                                <div
                                                    className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold text-lg sm:text-xl shadow-md"
                                                    style={{
                                                        background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                                                    }}
                                                >
                                                    {(club.name || "C")
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-800 text-base leading-tight truncate">
                                                        {club.name || "Unnamed Club"}
                                                    </h4>

                                                    <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">

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
                                                {club.description ||
                                                    "No description available for this club."}
                                            </p>

                                            {/* Club details link */}
                                            <Link
                                                to={`/clubs/${club._id}`}
                                                className={`block w-full mt-4 py-2.5 rounded-full text-sm font-semibold text-center transition hover:scale-[1.02] hover:shadow-md ${
                                                    joined
                                                        ? "bg-indigo-50 text-indigo-700 border border-indigo-300 hover:bg-indigo-100"
                                                        : "bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow"
                                                }`}
                                            >
                                                {joined
                                                    ? "View Details"
                                                    : "View & Join →"}
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
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">

                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-indigo-600 text-white flex items-center justify-center rounded-xl font-bold text-lg flex-shrink-0">
                                    ES
                                </div>

                                <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
                                    EventSphere
                                </h2>
                            </div>

                            <p className="text-gray-800 text-sm leading-relaxed">
                                A modern campus event and club management platform helping students discover events, join communities, and stay connected effortlessly.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent mb-4">
                                Explore
                            </h3>

                            <ul className="space-y-3 text-sm text-gray-800">
                                <li>
                                    <Link to="/mainpage" className="hover:text-pink-600">
                                        Home
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/events" className="hover:text-pink-600">
                                        Events
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/clubs" className="hover:text-pink-600">
                                        Clubs
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/signup" className="hover:text-pink-600">
                                        Register
                                    </Link>
                                </li>
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
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6 text-center text-sm text-gray-800 tracking-wide">
                        <span className="bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent font-semibold">
                            © 2026 EventSphere
                        </span>
                        {" "}— All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default GetClubs;
