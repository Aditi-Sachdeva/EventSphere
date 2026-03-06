import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import MainPage from "./pages/MainPage";  // ✅ new page after login

function App() {
  return (
    <Routes>
      {/* Public Home Page */}
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/" element={<MainPage/>} />


      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected/Main Page after login */}
      <Route path="/mainpage" element={<MainPage />} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
