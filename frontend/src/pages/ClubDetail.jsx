
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";

const ClubDetail = () => {
    const { clubId } = useParams();
    const navigate = useNavigate();

    const [club, setClub] = useState(null);
    const [membershipStatus, setMembershipStatus] = useState(null);
    const [clubEvents, setClubEvents] = useState([]);

    const [loading, setLoading] = useState(true);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [error, setError] = useState("");
    const [eventsError, setEventsError] = useState("");

    const [joinStatus, setJoinStatus] = useState("");
    const [joinMsg, setJoinMsg] = useState("");

    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const fetchClub = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(`/api/club/${clubId}`);

            setClub(response.data.club || null);
            setMembershipStatus(response.data.membershipStatus || null);
        } catch (err) {
            console.error("Error fetching club:", err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }

            setError(
                err.response?.data?.msg ||
                "Unable to load club details. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, [clubId, navigate]);

    const fetchClubEvents = useCallback(async () => {
        setEventsLoading(true);
        setEventsError("");

        try {
            const response = await axios.get(
                `/api/event/club/${clubId}`
            );

            setClubEvents(
                Array.isArray(response.data.events)
                    ? response.data.events
                    : []
            );
        } catch (err) {
            console.error("Error fetching club events:", err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }

            setEventsError(
                err.response?.data?.msg ||
                "Unable to load club events."
            );

            setClubEvents([]);
        } finally {
            setEventsLoading(false);
        }
    }, [clubId, navigate]);

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
            fetchClub();
            fetchClubEvents();
        } catch (err) {
            console.error("Invalid stored user:", err);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
        }
    }, [navigate, fetchClub, fetchClubEvents]);

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

    const handleJoin = async () => {
        setJoinStatus("loading");
        setJoinMsg("");

        try {
            const response = await axios.post("/api/club/join", {
                clubId,
            });

            setMembershipStatus("pending");
            setJoinStatus("success");
            setJoinMsg(
                response.data.msg ||
                "Your join request has been sent. Awaiting organizer approval."
            );
        } catch (err) {
            console.error("Join club error:", err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }

            const message =
                err.response?.data?.msg ||
                "Something went wrong. Please try again.";

            if (message === "Already a member") {
                setMembershipStatus("approved");
                setJoinStatus("success");
                setJoinMsg("You are already a member of this club.");
            } else if (
                message === "Already requested, awaiting approval"
            ) {
                setMembershipStatus("pending");
                setJoinStatus("success");
                setJoinMsg("Your request is already pending approval.");
            } else {
                setJoinStatus("error");
                setJoinMsg(message);
            }
        }
    };

    const handleLogout = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const formatDate = (dateString) => {
        if (!dateString) return "—";

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) return "—";

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const isClubOrganizer = () => {
        if (!club || !user) return false;

        const userId = String(user._id || user.id || "");

        const mainOrganizerId =
            club.mainOrganizer?._id || club.mainOrganizer;

        const organizerIds = Array.isArray(club.organizers)
            ? club.organizers.map((organizer) =>
                String(organizer?._id || organizer)
            )
            : [];

        return (
            String(mainOrganizerId) === userId ||
            organizerIds.includes(userId) ||
            user.role === "admin"
        );
    };

    const isOrganizer = isClubOrganizer();

    if (!user) {
        return null;
    }

    return (
        <div className="bg-gray-50 min-h-screen text-gray-800">

            {/* Navbar */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow border-b border-gray-200 h-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-5 h-full flex justify-between items-center">

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
                            className="px-3 py-1 text-sm text-gray-700 hover:text-pink-600 transition"
                        >
                            Home
                        </Link>

                        <Link
                            to="/events"
                            className="px-3 py-1 text-sm text-gray-700 hover:text-pink-600 transition"
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
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-indigo-600 text-white font-bold text-xs">
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
                            className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 transition gap-1"
                            aria-label="Toggle menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            <span
                                className="block bg-gray-600 transition-all duration-200"
                                style={{
                                    width: "18px",
                                    height: "2px",
                                    transform: mobileMenuOpen
                                        ? "rotate(45deg) translate(0, 5px)"
                                        : "none",
                                }}
                            />

                            <span
                                className="block bg-gray-600 transition-all duration-200"
                                style={{
                                    width: "18px",
                                    height: "2px",
                                    opacity: mobileMenuOpen ? 0 : 1,
                                }}
                            />

                            <span
                                className="block bg-gray-600 transition-all duration-200"
                                style={{
                                    width: "18px",
                                    height: "2px",
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
                        data-mobilemenu
                        className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-200 shadow-md z-40 px-4 py-3 flex flex-col gap-1"
                    >
                        <Link
                            to="/mainpage"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Home
                        </Link>

                        <Link
                            to="/events"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Events
                        </Link>

                        <Link
                            to="/clubs"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-3 py-2 text-sm rounded-md bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-semibold"
                        >
                            Clubs
                        </Link>
                    </div>
                )}
            </nav>

            {/* Main content */}
            <main className="pt-16">

                <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-2">
                    <Link
                        to="/clubs"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-500 transition bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:shadow-md"
                    >
                        ← Back to Clubs
                    </Link>
                </div>

                {loading ? (
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
                        <div className="h-40 sm:h-48 bg-gray-200 rounded-2xl mb-6"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2 mb-3"></div>
                        <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-100 rounded w-4/5 mb-8"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-24 px-4">
                        <div className="text-5xl mb-4">⚠️</div>

                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            Unable to load club
                        </h2>

                        <p className="text-red-600 text-sm mb-6">
                            {error}
                        </p>

                        <button
                            onClick={fetchClub}
                            className="px-5 py-2 bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-full text-sm font-semibold"
                        >
                            Try Again
                        </button>
                    </div>
                ) : !club ? (
                    <div className="text-center py-24 sm:py-32 px-4">
                        <div className="text-5xl mb-4">😕</div>

                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            Club not found
                        </h3>

                        <p className="text-gray-500 text-sm mb-6">
                            This club may have been removed or doesn't exist.
                        </p>

                        <Link
                            to="/clubs"
                            className="inline-block px-5 py-2 bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-full text-sm font-semibold"
                        >
                            Back to Clubs
                        </Link>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">

                        {/* Hero banner */}
                        <div className="relative h-40 sm:h-48 md:h-64 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl overflow-hidden mb-6 sm:mb-8 flex items-center justify-center shadow-lg">

                            <span className="text-white font-extrabold opacity-10 select-none text-[6rem] sm:text-[10rem]">
                                {(club.name || "C").charAt(0).toUpperCase()}
                            </span>

                            <span className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full shadow bg-green-500">
                                Active
                            </span>

                            {isOrganizer ? (
                                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/20 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/30">
                                    Organizer
                                </span>
                            ) : membershipStatus === "approved" ? (
                                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/20 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/30">
                                    Member ✓
                                </span>
                            ) : membershipStatus === "pending" ? (
                                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-yellow-500/80 text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full">
                                    Request Pending
                                </span>
                            ) : null}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

                            {/* Main content */}
                            <div className="lg:col-span-2 space-y-6">

                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2 leading-tight">
                                        {club.name}
                                    </h2>

                                    <p className="text-sm text-gray-400">
                                        Founded {formatDate(club.createdAt)}
                                    </p>
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="text-base font-semibold text-gray-700 mb-2">
                                        About this club
                                    </h3>

                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                        {club.description ||
                                            "No description provided for this club."}
                                    </p>
                                </div>

                                {/* Information cards */}
                                <div className="grid grid-cols-3 gap-3 sm:gap-4">

                                    <div className="bg-white border border-gray-100 rounded-xl p-3 sm:p-4 shadow-sm text-center">
                                        <p className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
                                            {club.approvedMemberCount ?? 0}
                                        </p>

                                        <p className="text-xs text-gray-400 mt-1 font-medium">
                                            Members
                                        </p>
                                    </div>

                                    <div className="bg-white border border-gray-100 rounded-xl p-3 sm:p-4 shadow-sm text-center">
                                        <p className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                                            {clubEvents.length}
                                        </p>

                                        <p className="text-xs text-gray-400 mt-1 font-medium">
                                            Events
                                        </p>
                                    </div>

                                    <div className="bg-white border border-gray-100 rounded-xl p-3 sm:p-4 shadow-sm text-center">
                                        <p className="text-xs sm:text-sm font-bold mt-1 text-green-600">
                                            ● Active
                                        </p>

                                        <p className="text-xs text-gray-400 mt-1 font-medium">
                                            Status
                                        </p>
                                    </div>
                                </div>

                                {/* Mobile membership card */}
                                <div className="lg:hidden">
                                    <MembershipCard
                                        club={club}
                                        membershipStatus={membershipStatus}
                                        isOrganizer={isOrganizer}
                                        joinStatus={joinStatus}
                                        joinMsg={joinMsg}
                                        handleJoin={handleJoin}
                                    />
                                </div>

                                {/* Club events */}
                                <div>
                                    <h3 className="text-base font-semibold text-gray-700 mb-3">
                                        Club Events
                                    </h3>

                                    {eventsLoading ? (
                                        <div className="space-y-3 animate-pulse">
                                            <div className="h-20 bg-gray-100 rounded-xl"></div>
                                            <div className="h-20 bg-gray-100 rounded-xl"></div>
                                        </div>
                                    ) : eventsError ? (
                                        <div className="bg-white border border-gray-100 rounded-xl px-4 py-6 shadow-sm text-center">
                                            <p className="text-sm text-red-500 mb-3">
                                                {eventsError}
                                            </p>

                                            <button
                                                onClick={fetchClubEvents}
                                                className="text-sm text-indigo-600 font-semibold hover:underline"
                                            >
                                                Retry loading events
                                            </button>
                                        </div>
                                    ) : clubEvents.length === 0 ? (
                                        <div className="bg-white border border-gray-100 rounded-xl px-4 py-6 shadow-sm text-center">
                                            <p className="text-sm text-gray-400">
                                                No events hosted by this club yet.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {clubEvents.map((event) => {
                                                const eventDate = new Date(event.eventDate);
                                                const validDate =
                                                    !Number.isNaN(eventDate.getTime());

                                                const upcoming =
                                                    validDate &&
                                                    eventDate >= new Date();

                                                return (
                                                    <Link
                                                        key={event._id}
                                                        to={`/events/${event._id}`}
                                                        className="flex items-center gap-3 sm:gap-4 bg-white border border-gray-100 rounded-xl px-3 sm:px-4 py-3 shadow-sm hover:shadow-md hover:border-indigo-200 transition group"
                                                    >
                                                        <div className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl text-white">
                                                            <span className="text-xs font-semibold leading-none">
                                                                {validDate
                                                                    ? eventDate.toLocaleDateString("en-IN", {
                                                                        month: "short",
                                                                    })
                                                                    : "—"}
                                                            </span>

                                                            <span className="text-base sm:text-lg font-extrabold leading-none">
                                                                {validDate
                                                                    ? eventDate.getDate()
                                                                    : "—"}
                                                            </span>
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition">
                                                                {event.title}
                                                            </p>

                                                            <p className="text-xs text-gray-400 truncate mt-0.5">
                                                                {event.location || "Venue TBD"}
                                                                {" · "}
                                                                {formatDate(event.eventDate)}
                                                            </p>
                                                        </div>

                                                        <span
                                                            className={`hidden sm:inline-flex flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                                                                upcoming
                                                                    ? "bg-green-50 text-green-600 border-green-200"
                                                                    : "bg-gray-50 text-gray-400 border-gray-200"
                                                            }`}
                                                        >
                                                            {upcoming ? "Upcoming" : "Past"}
                                                        </span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Desktop membership card */}
                            <div className="hidden lg:block lg:col-span-1">
                                <MembershipCard
                                    club={club}
                                    membershipStatus={membershipStatus}
                                    isOrganizer={isOrganizer}
                                    joinStatus={joinStatus}
                                    joinMsg={joinMsg}
                                    handleJoin={handleJoin}
                                    sticky
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-gray-100 border-t border-gray-300 shadow-inner">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">

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

const MembershipCard = ({
    club,
    membershipStatus,
    isOrganizer,
    joinStatus,
    joinMsg,
    handleJoin,
    sticky = false,
}) => {
    return (
        <div
            className={`bg-white border border-gray-200 rounded-2xl shadow-md p-5 sm:p-6 ${
                sticky ? "sticky top-24" : ""
            }`}
        >
            <h3 className="text-base font-semibold text-gray-700 mb-1">
                Membership
            </h3>

            <p className="text-xs text-gray-400 mb-5">
                Join requests are reviewed by organizers before approval.
            </p>

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

            {isOrganizer ? (
                <div className="text-center text-sm text-indigo-600 font-medium bg-indigo-50 border border-indigo-200 rounded-xl py-3">
                    You manage this club.
                </div>
            ) : joinStatus === "loading" ? (
                <button
                    disabled
                    className="w-full py-3 rounded-full text-sm font-semibold bg-gray-200 text-gray-500 cursor-not-allowed"
                >
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

            <div className="mt-5 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500">

                <div className="flex justify-between">
                    <span>Members</span>
                    <span className="font-semibold text-gray-700">
                        {club.approvedMemberCount ?? 0}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span>Founded</span>
                    <span className="font-semibold text-gray-700">
                        {club.createdAt
                            ? new Date(club.createdAt).toLocaleDateString("en-IN")
                            : "—"}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span>Status</span>
                    <span className="font-semibold text-green-600">
                        Active
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ClubDetail;
