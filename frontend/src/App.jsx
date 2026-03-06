// import { Routes, Route, Navigate } from "react-router-dom";

// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import SignUp from "./pages/SignUp";

// import AdminDashboard from "./pages/admin/adminDashboard";
// import ViewUsers from "./pages/admin/ViewUsers";
// import CreateClub from "./pages/admin/CreateClub";
// import ViewClubs from "./pages/admin/ViewClubs";
// import ViewEvents from "./pages/admin/ViewEvents";

// function App() {
//   return (
//     <Routes>

//       {/* Public Pages */}
//       <Route path="/" element={<Home />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<SignUp />} />

//       {/* Admin Layout */}
//       <Route path="/admin" element={<AdminDashboard />}>

//         <Route path="users" element={<ViewUsers />} />
//         <Route path="create-club" element={<CreateClub />} />
//         <Route path="view-clubs" element={<ViewClubs />} />
//         <Route path="view-events" element={<ViewEvents />} />

//       </Route>

//       {/* Catch invalid routes */}
//       <Route path="*" element={<Navigate to="/" replace />} />

//     </Routes>
//   );
// }

// export default App;





















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