// import { Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login";
// import SignUp from "./pages/SignUp";

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Login />} />
//       <Route path="/signup" element={<SignUp />} />

//       <Route
//         path="/dashboard"
//         element={
//           <div className="min-h-screen flex items-center justify-center text-4xl font-bold">
//             Dashboard 🎉
//           </div>
//         }
//       />

//       <Route path="*" element={<Navigate to="/" />} />
//     </Routes>
//   );
// }

// export default App;


// import { Routes, Route, Navigate } from "react-router-dom";

// import AdminDashboard from "./pages/admin/adminDashboard";
// import ViewUsers from "./pages/admin/ViewUsers";
// import CreateClub from "./pages/admin/CreateClub";
// import ViewClubs from "./pages/admin/ViewClubs";
// import ViewEvents from "./pages/admin/ViewEvents";

// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import SignUp from "./pages/SignUp";


// function App() {
//   return (
//     <Routes>

//       <Route path="/" element={<Home />} />   {/* 👈 CHANGE HERE */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/signup" element={<SignUp />} />


//       {/* Redirect root to admin users */}
//       <Route path="/" element={<Navigate to="/admin/users" />} />

//       {/* Admin Layout */}
//       <Route path="/admin" element={<AdminDashboard />}>

//         {/* View Users Page */}
//         <Route path="users" element={<ViewUsers />} />

//         {/* Create Club Page */}
//         <Route path="create-club" element={<CreateClub />} />


//         {/* Create Club Page */}
//         <Route path="view-clubs" element={<ViewClubs />} />

//         <Route path="view-events" element={<ViewEvents />} />



//       </Route>

//     </Routes>
//   );
// }

// export default App;

import { Routes, Route, Navigate } from "react-router-dom";


// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import SignUp from "./pages/SignUp";



import AdminDashboard from "./pages/admin/adminDashboard";
import ViewUsers from "./pages/admin/ViewUsers";
import CreateClub from "./pages/admin/CreateClub";
import ViewClubs from "./pages/admin/ViewClubs";
import ViewEvents from "./pages/admin/ViewEvents";



function App() {
  return (
    <Routes>


      <Route path="/" element={<Home />} />   {/* 👈 CHANGE HERE */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />


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