import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const ScannerPage = () => {
    const [result, setResult] = useState(null);
    const [status, setStatus] = useState("idle"); // idle | scanning | success | error | duplicate
    const [isRunning, setIsRunning] = useState(false);
    const [user, setUser] = useState(null);
    const scannerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        if (!["admin", "organizer", "mainOrganizer"].includes(stored.role)) {
            navigate("/mainpage");
            return;
        }
        setUser(stored);

        // Cleanup scanner on unmount
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => {});
            }
        };
    }, []);

    const startScanner = async () => {
        try {
            const scanner = new Html5Qrcode("qr-reader");
            scannerRef.current = scanner;

            await scanner.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                async (decodedToken) => {
                    await scanner.pause();
                    await processToken(decodedToken);
                },
                () => {} // suppress ongoing scan errors
            );

            setIsRunning(true);
            setStatus("scanning");
        } catch (err) {
            console.error("Camera error:", err);
            alert("Could not access camera. Please allow camera permissions.");
        }
    };

    const stopScanner = async () => {
        if (scannerRef.current) {
            await scannerRef.current.stop().catch(() => {});
            scannerRef.current = null;
        }
        setIsRunning(false);
        setStatus("idle");
        setResult(null);
    };

    const processToken = async (token) => {
        try {
            const res = await axios.post(
                "http://localhost:5000/api/event/attendance/scan",
                { token },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setResult(res.data);
            setStatus("success");

            setTimeout(async () => {
                setResult(null);
                setStatus("scanning");
                await scannerRef.current?.resume();
            }, 3000);

        } catch (err) {
            const isDuplicate = err.response?.status === 409;
            setResult({ msg: err.response?.data?.msg || "Something went wrong", ...err.response?.data });
            setStatus(isDuplicate ? "duplicate" : "error");

            setTimeout(async () => {
                setResult(null);
                setStatus("scanning");
                await scannerRef.current?.resume();
            }, 3000);
        }
    };

    const statusColors = {
        success: "bg-green-500/15 border-green-500/30 text-green-400",
        duplicate: "bg-amber-500/15 border-amber-500/30 text-amber-400",
        error: "bg-red-500/15 border-red-500/30 text-red-400",
    };

    const statusIcon = {
        success: "✅",
        duplicate: "⚠️",
        error: "❌",
    };

    const statusLabel = {
        success: "Entry Granted",
        duplicate: "Already Checked In",
        error: "Invalid QR",
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col">

            {/* Navbar */}
            <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
                <Link to="/mainpage" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs shadow-lg">
                        ES
                    </div>
                    <span className="font-bold text-white">EventSphere</span>
                </Link>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                        {user.role}
                    </span>
                    <span className="text-sm text-gray-300 font-medium">{user.name}</span>
                </div>
            </nav>

            {/* Main */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
                <div className="w-full max-w-sm">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/20 text-3xl">
                            📷
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Attendance Scanner</h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Scan attendee QR codes at the entrance
                        </p>
                    </div>

                    {/* Scanner box */}
                    <div className="relative mb-5">
                        <div
                            id="qr-reader"
                            className="w-full rounded-2xl overflow-hidden border-2 border-gray-800 bg-gray-900"
                            style={{ minHeight: "280px" }}
                        />

                        {/* Corner brackets overlay when scanning */}
                        {isRunning && (
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                <div className="relative w-52 h-52">
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-pink-400 rounded-tl-lg" />
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] border-pink-400 rounded-tr-lg" />
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] border-pink-400 rounded-bl-lg" />
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-pink-400 rounded-br-lg" />
                                    {/* Scan line animation */}
                                    <div className="absolute left-0 right-0 h-0.5 bg-pink-400/60 top-1/2 animate-pulse" />
                                </div>
                            </div>
                        )}

                        {/* Idle placeholder */}
                        {!isRunning && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gray-900">
                                <div className="text-center">
                                    <div className="text-5xl mb-3 opacity-40">📷</div>
                                    <p className="text-gray-600 text-sm">Camera is off</p>
                                    <p className="text-gray-700 text-xs mt-1">Press Start to begin scanning</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Status indicator bar */}
                    {isRunning && !result && (
                        <div className="mb-4 flex items-center justify-center gap-2 text-sm text-gray-400">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            Scanning for QR codes...
                        </div>
                    )}

                    {/* Result feedback card */}
                    {result && status !== "idle" && status !== "scanning" && (
                        <div className={`mb-5 rounded-2xl px-5 py-4 border ${statusColors[status]}`}>
                            <p className="font-bold text-base mb-2">
                                {statusIcon[status]} {statusLabel[status]}
                            </p>
                            {result.user && (
                                <p className="text-sm font-medium">👤 {result.user}</p>
                            )}
                            {result.event && (
                                <p className="text-sm">🎪 {result.event}</p>
                            )}
                            {result.email && (
                                <p className="text-xs mt-1 opacity-70">📧 {result.email}</p>
                            )}
                            {result.scannedAt && (
                                <p className="text-xs mt-1 opacity-60">
                                    First scan: {new Date(result.scannedAt).toLocaleTimeString("en-IN")}
                                </p>
                            )}
                            {!result.user && (
                                <p className="text-sm">{result.msg}</p>
                            )}
                            <p className="text-xs mt-3 opacity-50">Resuming in 3 seconds...</p>
                        </div>
                    )}

                    {/* Start / Stop button */}
                    <button
                        onClick={isRunning ? stopScanner : startScanner}
                        className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                            isRunning
                                ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                                : "bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98]"
                        }`}
                    >
                        {isRunning ? "⏹ Stop Scanner" : "▶ Start Scanner"}
                    </button>

                    <p className="text-center text-gray-700 text-xs mt-4">
                        Scanner auto-resumes 3 seconds after each scan
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ScannerPage;