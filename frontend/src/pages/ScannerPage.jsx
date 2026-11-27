
import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";

const ScannerPage = () => {
    const [result, setResult] = useState(null);
    const [status, setStatus] = useState("idle");
    const [isRunning, setIsRunning] = useState(false);
    const [isStarting, setIsStarting] = useState(false);
    const [user, setUser] = useState(null);

    const scannerRef = useRef(null);
    const processingRef = useRef(false);
    const timeoutRef = useRef(null);
    const isRunningRef = useRef(false);

    const navigate = useNavigate();

    useEffect(() => {
        let storedUser = null;

        try {
            storedUser = JSON.parse(
                localStorage.getItem("user") || "null"
            );
        } catch (error) {
            console.error("Unable to read user information:", error);
        }

        const token = localStorage.getItem("token");

        if (
            !token ||
            !storedUser ||
            !["admin", "organizer"].includes(storedUser.role)
        ) {
            navigate("/mainpage", { replace: true });
            return;
        }

        setUser(storedUser);

        return () => {
            isRunningRef.current = false;
            processingRef.current = false;

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }

            const scanner = scannerRef.current;
            scannerRef.current = null;

            if (scanner) {
                scanner.stop()
                    .catch(() => {})
                    .finally(() => {
                        scanner.clear().catch(() => {});
                    });
            }
        };
    }, [navigate]);

    const startScanner = async () => {
        if (isStarting || isRunningRef.current) {
            return;
        }

        setIsStarting(true);
        setResult(null);
        setStatus("idle");

        let scanner = null;

        try {
            scanner = new Html5Qrcode("qr-reader");
            scannerRef.current = scanner;

            await scanner.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: {
                        width: 250,
                        height: 250
                    }
                },
                async (decodedToken) => {
                    if (processingRef.current) {
                        return;
                    }

                    processingRef.current = true;

                    try {
                        await scanner.pause();
                    } catch (error) {
                        console.error("Unable to pause scanner:", error);
                    }

                    await processToken(decodedToken, scanner);
                },
                () => {}
            );

            isRunningRef.current = true;
            setIsRunning(true);
            setStatus("scanning");
        } catch (error) {
            console.error("Camera error:", error);

            isRunningRef.current = false;
            setIsRunning(false);
            setStatus("error");

            setResult({
                msg: "Could not access the camera. Please allow camera permissions and try again."
            });

            if (scanner) {
                try {
                    await scanner.stop();
                } catch (stopError) {
                    // Scanner may not have started successfully.
                }

                try {
                    await scanner.clear();
                } catch (clearError) {
                    // Nothing else is required here.
                }
            }

            if (scannerRef.current === scanner) {
                scannerRef.current = null;
            }
        } finally {
            setIsStarting(false);
        }
    };

    const stopScanner = async () => {
        isRunningRef.current = false;
        processingRef.current = false;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        const scanner = scannerRef.current;
        scannerRef.current = null;

        if (scanner) {
            try {
                await scanner.stop();
            } catch (error) {
                console.error("Scanner stop error:", error);
            }

            try {
                await scanner.clear();
            } catch (error) {
                console.error("Scanner cleanup error:", error);
            }
        }

        setIsRunning(false);
        setIsStarting(false);
        setStatus("idle");
        setResult(null);
    };

    const processToken = async (token, scanner) => {
        try {
            const response = await axios.post(
                "/api/event/attendance/scan",
                { token }
            );

            setResult(response.data);
            setStatus("success");
        } catch (error) {
            console.error("Attendance scan error:", error);

            const statusCode = error.response?.status;
            const message =
                error.response?.data?.msg ||
                "Unable to process this QR code.";

            setResult({
                ...error.response?.data,
                msg: message
            });

            if (statusCode === 409) {
                setStatus("duplicate");
            } else if (statusCode === 410) {
                setStatus("expired");
            } else {
                setStatus("error");
            }
        } finally {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(async () => {
                timeoutRef.current = null;

                if (
                    !isRunningRef.current ||
                    scannerRef.current !== scanner
                ) {
                    processingRef.current = false;
                    return;
                }

                setResult(null);
                setStatus("scanning");

                try {
                    await scanner.resume();
                } catch (error) {
                    console.error("Unable to resume scanner:", error);
                    setStatus("error");
                    setResult({
                        msg: "Unable to resume the camera. Please stop and restart the scanner."
                    });
                } finally {
                    processingRef.current = false;
                }
            }, 3000);
        }
    };

    const statusColors = {
        success: "bg-green-500/15 border-green-500/30 text-green-400",
        duplicate: "bg-amber-500/15 border-amber-500/30 text-amber-400",
        expired: "bg-orange-500/15 border-orange-500/30 text-orange-400",
        error: "bg-red-500/15 border-red-500/30 text-red-400"
    };

    const statusIcons = {
        success: "✅",
        duplicate: "⚠️",
        expired: "⏰",
        error: "❌"
    };

    const statusLabels = {
        success: "Entry Granted",
        duplicate: "Already Checked In",
        expired: "QR Code Expired",
        error: "Scan Failed"
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col">

            {/* Navbar */}
            <nav className="fixed top-0 inset-x-0 z-50 h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shadow-sm">

                <div className="flex items-center gap-2 sm:gap-3">
                    <Link to="/mainpage">
                        <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-md"
                            style={{
                                background: "linear-gradient(to right, #ec4899, #6366f1)"
                            }}
                        >
                            ES
                        </div>
                    </Link>

                    <Link to="/mainpage">
                        <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap">
                            EventSphere
                        </h1>
                    </Link>
                </div>

                <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{
                            background: "linear-gradient(to right, #ec4899, #6366f1)"
                        }}
                    >
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="text-sm font-semibold text-gray-800 hidden sm:block">
                        {user.name || user.role}
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 pt-20 sm:pt-24 pb-8 sm:pb-10">

                <div className="w-full max-w-xs sm:max-w-sm">

                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">

                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg shadow-pink-500/20 text-2xl sm:text-3xl">
                            📷
                        </div>

                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                            Attendance Scanner
                        </h1>

                        <p className="text-gray-400 text-xs sm:text-sm mt-1">
                            Scan attendee QR codes at the entrance
                        </p>

                        <p className="text-gray-500 text-xs mt-2 capitalize">
                            Logged in as {user.role}
                        </p>
                    </div>

                    {/* Scanner */}
                    <div className="relative mb-4 sm:mb-5">

                        <div
                            id="qr-reader"
                            className="w-full rounded-2xl overflow-hidden border-2 border-gray-800 bg-gray-900"
                            style={{ minHeight: "260px" }}
                        />

                        {isRunning && (
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                <div className="relative w-44 h-44 sm:w-52 sm:h-52">

                                    <div className="absolute top-0 left-0 w-7 h-7 sm:w-8 sm:h-8 border-t-[3px] border-l-[3px] border-pink-400 rounded-tl-lg" />

                                    <div className="absolute top-0 right-0 w-7 h-7 sm:w-8 sm:h-8 border-t-[3px] border-r-[3px] border-pink-400 rounded-tr-lg" />

                                    <div className="absolute bottom-0 left-0 w-7 h-7 sm:w-8 sm:h-8 border-b-[3px] border-l-[3px] border-pink-400 rounded-bl-lg" />

                                    <div className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 border-b-[3px] border-r-[3px] border-pink-400 rounded-br-lg" />

                                    <div className="absolute left-0 right-0 h-0.5 bg-pink-400/60 top-1/2 animate-pulse" />
                                </div>
                            </div>
                        )}

                        {!isRunning && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gray-900">
                                <div className="text-center px-4">

                                    <div className="text-4xl sm:text-5xl mb-3 opacity-40">
                                        📷
                                    </div>

                                    <p className="text-gray-400 text-sm">
                                        Camera is off
                                    </p>

                                    <p className="text-gray-600 text-xs mt-1">
                                        Press Start to begin scanning
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Scanning status */}
                    {isRunning && !result && (
                        <div className="mb-4 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-400">

                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shrink-0" />

                            Scanning for QR codes...
                        </div>
                    )}

                    {/* Starting status */}
                    {isStarting && (
                        <div className="mb-4 text-center text-sm text-gray-400">
                            Starting camera...
                        </div>
                    )}

                    {/* Result feedback */}
                    {result && status !== "idle" && status !== "scanning" && (
                        <div
                            className={`mb-4 sm:mb-5 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 border ${
                                statusColors[status] || statusColors.error
                            }`}
                        >
                            <p className="font-bold text-sm sm:text-base mb-2 flex items-center gap-1.5 flex-wrap">

                                <span>
                                    {statusIcons[status] || "❌"}
                                </span>

                                <span>
                                    {statusLabels[status] || "Scan Failed"}
                                </span>
                            </p>

                            {result.user && (
                                <p className="text-xs sm:text-sm font-medium truncate">
                                    👤 {result.user}
                                </p>
                            )}

                            {result.event && (
                                <p className="text-xs sm:text-sm truncate">
                                    🎪 {result.event}
                                </p>
                            )}

                            {result.email && (
                                <p className="text-xs mt-1 opacity-70 truncate">
                                    📧 {result.email}
                                </p>
                            )}

                            {result.scannedAt && (
                                <p className="text-xs mt-1 opacity-60">
                                    Scanned at:{" "}
                                    {new Date(result.scannedAt).toLocaleTimeString("en-IN")}
                                </p>
                            )}

                            {result.msg && (
                                <p className="text-xs sm:text-sm mt-1">
                                    {result.msg}
                                </p>
                            )}

                            {isRunning && (
                                <p className="text-xs mt-2 sm:mt-3 opacity-50">
                                    Resuming in 3 seconds...
                                </p>
                            )}
                        </div>
                    )}

                    {/* Start / Stop */}
                    <button
                        onClick={isRunning ? stopScanner : startScanner}
                        disabled={isStarting}
                        className={`w-full py-3.5 sm:py-4 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                            isRunning
                                ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                                : "bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98]"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isStarting
                            ? "Starting Camera..."
                            : isRunning
                                ? "⏹ Stop Scanner"
                                : "▶ Start Scanner"}
                    </button>

                    <p className="text-center text-gray-500 text-xs mt-3 sm:mt-4 px-2">
                        Scanner automatically resumes 3 seconds after each scan.
                    </p>

                    <p className="text-center text-gray-600 text-xs mt-2 px-2">
                        Camera access requires permission and a secure connection (HTTPS or localhost).
                    </p>

                    <Link
                        to="/mainpage"
                        className="block text-center text-sm text-pink-400 hover:text-pink-300 mt-6"
                    >
                        ← Back to Dashboard
                    </Link>

                </div>
            </main>
        </div>
    );
};

export default ScannerPage;
