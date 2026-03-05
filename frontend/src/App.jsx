import { Routes, Route, Navigate } from "react-router-dom";

import AdminDashboard from "./pages/admin/adminDashboard";
import ViewUsers from "./pages/admin/ViewUsers";
import CreateClub from "./pages/admin/CreateClub";
import ViewClubs from "./pages/admin/ViewClubs";
import ViewEvents from "./pages/admin/ViewEvents";

function App() {
  return (
    <Routes>

      {/* Redirect root to admin users */}
      <Route path="/" element={<Navigate to="/admin/users" />} />

      {/* Admin Layout */}
      <Route path="/admin" element={<AdminDashboard />}>

        {/* View Users Page */}
        <Route path="users" element={<ViewUsers />} />

        {/* Create Club Page */}
        <Route path="create-club" element={<CreateClub />} />


        {/* Create Club Page */}
        <Route path="view-clubs" element={<ViewClubs />} />

        <Route path="view-events" element={<ViewEvents />} />



      </Route>

    </Routes>
  );
}

export default App;

