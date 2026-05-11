import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import MainPage from "./pages/MainPage";
import ScannerPage from "./pages/ScannerPage";

// User Pages
import GetClubs from "./pages/GetClubs";
import GetEvents from "./pages/GetEvents";
import EventDetail from "./pages/EventDetail";
import ClubDetail from "./pages/ClubDetail";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ViewUsers from "./pages/admin/ViewUsers";
import CreateClub from "./pages/admin/CreateClub";
import ViewClubs from "./pages/admin/ViewClubs";
import ViewEvents from "./pages/admin/ViewEvents";

// Organizer Pages
import ClubEvents from "./pages/organizer/ClubEvents";
import MemberApprovals from "./pages/organizer/MemberApprovals";
import CreateEvent from "./pages/organizer/CreateEvent";

// 🔐 Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/mainpage" />;
    }
    return children;
};

export default function App() {
    return (
        <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* MAIN APP */}
            <Route path="/mainpage" element={<MainPage />} />
            <Route path="/clubs" element={<GetClubs />} />
            <Route path="/events" element={<GetEvents />} />
            <Route path="/events/:eventId" element={<EventDetail />} />
            <Route path="/clubs/:clubId" element={<ClubDetail />} />

            {/* SCANNER — organizer / admin only */}
            <Route
                path="/scan"
                element={
                    <ProtectedRoute allowedRoles={["admin", "organizer", "mainOrganizer"]}>
                        <ScannerPage />
                    </ProtectedRoute>
                }
            />

            {/* ORGANIZER */}
            <Route
                path="/organizer"
                element={<Navigate to="/organizer/events" replace />}
            />
            <Route
                path="/organizer/events"
                element={
                    <ProtectedRoute allowedRoles={["organizer", "mainOrganizer", "admin"]}>
                        <ClubEvents />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/organizer/approvals"
                element={
                    <ProtectedRoute allowedRoles={["organizer", "mainOrganizer", "admin"]}>
                        <MemberApprovals />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/organizer/create"
                element={
                    <ProtectedRoute allowedRoles={["organizer", "mainOrganizer", "admin"]}>
                        <CreateEvent />
                    </ProtectedRoute>
                }
            />

            {/* ADMIN */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            >
                <Route path="users" element={<ViewUsers />} />
                <Route path="create-club" element={<CreateClub />} />
                <Route path="view-clubs" element={<ViewClubs />} />
                <Route path="view-events" element={<ViewEvents />} />
            </Route>

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
