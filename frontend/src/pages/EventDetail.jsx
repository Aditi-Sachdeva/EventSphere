
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";

const EventDetail = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionStatus, setActionStatus] = useState("");
    const [actionMsg, setActionMsg] = useState("");
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const fetchEvent = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(`/api/event/${eventId}`);

            setEvent(response.data.event || null);
            setIsRegistered(Boolean(response.data.isRegistered));
        } catch (err) {
            console.error("Error fetching event:", err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }

            setError(
                err.response?.data?.msg ||
                "Unable to load event details. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, [eventId, navigate]);

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
            fetchEvent();
        } catch (err) {
            console.error("Invalid stored user:", err);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
        }
    }, [navigate, fetchEvent]);

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

    const handleRegister = async () => {
        setActionStatus("loading");
        setActionMsg("");

        try {
            const response = await axios.post(
                `/api/event/${eventId}/register`,
                {}
            );

            setIsRegistered(true);
            setActionStatus("success");
            setActionMsg(
                response.data.msg ||
                "Registration successful! Check your email for the QR code."
            );

            await fetchEvent();
        } catch (err) {
            console.error("Registration error:", err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }

            setActionStatus("error");
            setActionMsg(
                err.response?.data?.msg ||
                "Unable to complete registration. Please try again."
            );
        }
    };

    const handleUnregister = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel your registration?"
        );

        if (!confirmed) {
            return;
        }

        setActionStatus("loading");
        setActionMsg("");

        try {
            const response = await axios.patch(
                `/api/event/${eventId}/unregister`,
                {}
            );

            setIsRegistered(false);
            setActionStatus("success");
            setActionMsg(
                response.data.msg ||
                "Your registration has been cancelled."
            );

            await fetchEvent();
        } catch (err) {
            console.error("Unregistration error:", err);

            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }

            setActionStatus("error");
            setActionMsg(
                err.response?.data?.msg ||
                "Unable to cancel registration. Please try again."
            );
        }
    };

    const handleLogout = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const formatDate = (dateString) => {
        if (!dateString) {
            return "Date not available";
        }

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "Date not available";
        }

        return date.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) {
            return "Time not available";
        }

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "Time not available";
        }

        return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const seatPercent = () => {
        if (
            !event ||
            !Number.isFinite(Number(event.totalSeats)) ||
            Number(event.totalSeats) <= 0
        ) {
            return 0;
        }

        const total = Number(event.totalSeats);
        const available = Number(event.availableSeats);

        return Math.min(
            100,
            Math.max(0, Math.round(((total - available) / total) * 100))
        );
    };

    const isEventPast = event
        ? new Date(event.eventDate).getTime() <= Date.now()
        : false;

    if (!user) {
        return null;
    }

    return (
        <div className="bg-gradient-to-b from-gray-50 via-pink-50/10 to-indigo-50/10 min-h-screen text-gray-800">

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
                            className="px-3 py-1 text-sm bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-md font-semibold shadow-sm"
                        >
                            Events
                        </Link>

                        <Link
                            to="/clubs"
                            className="px-3 py-1 text-sm text-gray-700 hover:text-pink-600 transition"
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
                            className="px-3 py-2 text-sm rounded-md text-pink-600 bg-pink-50 font-semibold"
                        >
                            Events
                        </Link>

                        <Link
                            to="/clubs"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Clubs
                        </Link>
                    </div>
                )}
            </nav>

            {/* Page content */}
            <main className="pt-24 pb-16 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">

                    <Link
                        to="/events"
                        className="inline-flex items-center gap-2 text-sm text-pink-600 hover:text-indigo-600 font-medium mb-6"
                    >
                        ← Back to Events
                    </Link>

                    {loading ? (
                        <div className="text-center py-24">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>

                            <p className="text-gray-500 mt-4">
                                Loading event details...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 text-center py-16 px-5">
                            <div className="text-4xl mb-4">⚠️</div>

                            <h2 className="text-xl font-bold text-gray-800 mb-2">
                                Unable to load event
                            </h2>

                            <p className="text-sm text-red-600 mb-6">
                                {error}
                            </p>

                            <button
                                onClick={fetchEvent}
                                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-indigo-600 text-white text-sm font-semibold"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : !event ? (
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 text-center py-16 px-5">
                            <div className="text-5xl mb-4">🔎</div>

                            <h2 className="text-xl font-bold text-gray-800 mb-2">
                                Event not found
                            </h2>

                            <p className="text-gray-500 text-sm mb-6">
                                This event may have been removed or is no longer available.
                            </p>

                            <Link
                                to="/events"
                                className="inline-block px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-indigo-600 text-white text-sm font-semibold"
                            >
                                Browse Events
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Event banner */}
                            <div className="relative rounded-2xl overflow-hidden shadow-lg min-h-[220px] sm:min-h-[320px] bg-gradient-to-br from-pink-400 via-rose-400 to-indigo-500">

                                {event.image && (
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>

                                <div className="absolute bottom-0 left-0 p-6 sm:p-10 text-white">
                                    {event.club?.name && (
                                        <span className="inline-block bg-white/20 border border-white/30 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold mb-3">
                                            {event.club.name}
                                        </span>
                                    )}

                                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold drop-shadow-lg">
                                        {event.title}
                                    </h1>

                                    <p className="mt-3 text-sm sm:text-base text-white/90">
                                        {formatDate(event.eventDate)}
                                    </p>
                                </div>
                            </div>

                            {/* Main details */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-7">

                                {/* Event information */}
                                <div className="lg:col-span-2 space-y-6">

                                    <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-7 shadow-sm">
                                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                                            About This Event
                                        </h2>

                                        <p className="text-gray-600 text-sm sm:text-base leading-7 whitespace-pre-line">
                                            {event.description || "No description available."}
                                        </p>
                                    </div>

                                    <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-7 shadow-sm">
                                        <h2 className="text-xl font-bold text-gray-800 mb-5">
                                            Event Information
                                        </h2>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                            {[
                                                {
                                                    icon: "📅",
                                                    label: "Date",
                                                    value: formatDate(event.eventDate),
                                                },
                                                {
                                                    icon: "🕒",
                                                    label: "Time",
                                                    value: formatTime(event.eventDate),
                                                },
                                                {
                                                    icon: "📍",
                                                    label: "Location",
                                                    value: event.location || "Not specified",
                                                },
                                                {
                                                    icon: "🏛️",
                                                    label: "Organizing Club",
                                                    value: event.club?.name || "Not specified",
                                                },
                                                {
                                                    icon: "👥",
                                                    label: "Total Seats",
                                                    value: event.totalSeats ?? "Not specified",
                                                },
                                                {
                                                    icon: "🎟️",
                                                    label: "Available Seats",
                                                    value: event.availableSeats ?? "Not specified",
                                                },
                                            ].map((item) => (
                                                <div
                                                    key={item.label}
                                                    className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start gap-3"
                                                >
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-50 to-indigo-50 flex items-center justify-center text-lg flex-shrink-0">
                                                        {item.icon}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">
                                                            {item.label}
                                                        </p>

                                                        <p className="text-sm font-semibold text-gray-700 break-words">
                                                            {item.value}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Registration card */}
                                <div>
                                    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden lg:sticky lg:top-24">

                                        <div className="bg-gradient-to-r from-pink-400 via-rose-300 to-indigo-400 px-5 sm:px-6 py-5">
                                            <h3 className="text-white font-bold text-xl">
                                                Registration
                                            </h3>

                                            <p className="text-white/80 text-xs mt-1">
                                                Secure your spot today
                                            </p>
                                        </div>

                                        <div className="p-5 sm:p-6">

                                            {/* Seat availability */}
                                            <div className="mb-5">
                                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                                    <span className="font-medium text-gray-700">
                                                        {event.availableSeats} seats left
                                                    </span>

                                                    <span>
                                                        {event.totalSeats} total
                                                    </span>
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
                                                        style={{
                                                            width: `${seatPercent()}%`,
                                                        }}
                                                    ></div>
                                                </div>

                                                <p className="text-xs text-gray-500 mt-2">
                                                    {seatPercent()}% filled

                                                    {seatPercent() >= 80 &&
                                                        Number(event.availableSeats) > 0 && (
                                                            <span className="text-orange-500 font-semibold">
                                                                {" "}· Filling fast!
                                                            </span>
                                                        )}
                                                </p>
                                            </div>

                                            {/* Registration feedback */}
                                            {actionStatus === "success" && (
                                                <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                                                    ✅ {actionMsg}
                                                </div>
                                            )}

                                            {actionStatus === "error" && (
                                                <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                                                    ⚠️ {actionMsg}
                                                </div>
                                            )}

                                            {/* Registration button */}
                                            {actionStatus === "loading" ? (
                                                <button
                                                    disabled
                                                    className="w-full py-3 rounded-full text-sm font-semibold bg-gray-100 text-gray-400 cursor-not-allowed"
                                                >
                                                    Processing...
                                                </button>
                                            ) : isRegistered ? (
                                                <div className="space-y-3">
                                                    <div className="text-center text-sm text-green-600 font-semibold bg-green-50 border border-green-200 rounded-xl py-3">
                                                        🎉 You're registered!
                                                    </div>

                                                    <p className="text-xs text-gray-500 text-center">
                                                        Your event QR code has been sent to your registered email address.
                                                    </p>

                                                    <button
                                                        onClick={handleUnregister}
                                                        disabled={isEventPast}
                                                        className="w-full py-3 rounded-full text-sm font-semibold border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        Cancel Registration
                                                    </button>

                                                    {isEventPast && (
                                                        <p className="text-xs text-gray-400 text-center">
                                                            Registration cannot be cancelled after the event starts.
                                                        </p>
                                                    )}
                                                </div>
                                            ) : isEventPast ? (
                                                <button
                                                    disabled
                                                    className="w-full py-3 rounded-full text-sm font-semibold bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                                                >
                                                    Event Has Started
                                                </button>
                                            ) : Number(event.availableSeats) <= 0 ? (
                                                <button
                                                    disabled
                                                    className="w-full py-3 rounded-full text-sm font-semibold bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                                                >
                                                    No Seats Available
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleRegister}
                                                    className="w-full py-3.5 rounded-full text-sm font-semibold bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
                                                >
                                                    Register Now →
                                                </button>
                                            )}

                                            <p className="text-xs text-gray-400 text-center mt-4">
                                                🔒 Free registration
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
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

export default EventDetail;
