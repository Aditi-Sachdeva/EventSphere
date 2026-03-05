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


import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />   {/* 👈 CHANGE HERE */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route
        path="/dashboard"
        element={
          <div className="min-h-screen flex items-center justify-center text-4xl font-bold">
            Dashboard 🎉
          </div>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;