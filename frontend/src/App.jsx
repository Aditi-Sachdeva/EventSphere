import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import MainPage from "./pages/MainPage";

import GetClubs from "./pages/GetClubs";
import GetEvents from "./pages/GetEvents";
 import EventDetail from "./pages/EventDetail";
  import ClubDetail from "./pages/ClubDetail";




import AdminDashboard from "./pages/admin/adminDashboard";
import ViewUsers from "./pages/admin/ViewUsers";
import CreateClub from "./pages/admin/CreateClub";
import ViewClubs from "./pages/admin/ViewClubs";
import ViewEvents from "./pages/admin/ViewEvents";

import OrganizerDashboard from "./pages/Organizer/Organizerdashboard";




function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/mainpage" element={<MainPage />} />
     
      <Route path="/clubs" element={<GetClubs />} />
      <Route path="/events" element={<GetEvents />} />
      <Route path="/events/:eventId" element={<EventDetail />} />
      <Route path="/clubs/:clubId" element={<ClubDetail />} />

      <Route path="/organizer" element={<OrganizerDashboard />} />
     
      
      


      <Route path="/admin" element={<AdminDashboard />}>

        <Route path="users" element={<ViewUsers />} />
        <Route path="create-club" element={<CreateClub />} />
        <Route path="view-clubs" element={<ViewClubs />} />
        <Route path="view-events" element={<ViewEvents />} />
        

      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;



// import OrganizerDashboard from "./pages/Organizer/OrganizerDashboard";

// function App() {
//   return <OrganizerDashboard />;
// }

// export default App;



