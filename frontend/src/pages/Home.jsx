import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import heroImage from "../assets/group-.avif";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const eventsRes = await axios.get("http://localhost:5000/events");
      const clubsRes = await axios.get("http://localhost:5000/clubs");

      setEvents(eventsRes.data.events || []);
      setClubs(clubsRes.data.clubs || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">

      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-indigo-600 text-white flex items-center justify-center rounded-lg font-bold shadow-md text-xs">
              ES
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
              EventSphere
            </h1>
          </div>

          {/* Links */}
          <div className="hidden md:flex gap-5 font-medium">
            <Link
              to="/"
              className="px-3 py-1 text-sm bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-md font-semibold shadow-sm"
            >
              Home
            </Link>

            <Link
              to="/events"
              className="px-3 py-1 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-indigo-600 hover:text-white rounded-md transition"
            >
              Events
            </Link>

            <Link
              to="/clubs"
              className="px-3 py-1 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-indigo-600 hover:text-white rounded-md transition"
            >
              Clubs
            </Link>

            <Link
              to="/login"
              className="px-3 py-1 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-indigo-600 hover:text-white rounded-md transition"
            >
              Login
            </Link>
          </div>

          {/* Register Button */}
          <Link
            to="/signup"
            className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:scale-[1.05] transition"
          >
            Register
          </Link>
        </div>
      </nav>




      {/* ================= HERO ================= */}
      <section className="relative h-[560px] md:h-[730px] overflow-hidden">
        {/* Hero Image */}
        <img
          src={heroImage}
          alt="Hero"
          className="w-full h-full object-cover object-center md:object-top"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-pink-500/20 to-indigo-600/20"></div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Discover{" "}
            <span className="bg-gradient-to-r from-pink-400 to-indigo-500 bg-clip-text text-transparent">
              Events
            </span>
            .
            <br />
            Connect With{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">
              Clubs
            </span>
            .
          </h2>

          <p className="text-base md:text-lg text-gray-200 mb-8 max-w-2xl drop-shadow-md">
            Explore exciting campus activities and join communities that match your passion.
          </p>

          <div className="flex justify-center gap-6">
            <Link
              to="/events"
              className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-indigo-600 rounded-full font-semibold shadow-md hover:shadow-lg hover:scale-[1.05] transition"
            >
              Browse Events
            </Link>

            <Link
              to="/clubs"
              className="px-6 py-2.5 border border-white rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition"
            >
              Explore Clubs
            </Link>
          </div>
        </div>
      </section>


      {/* ================= EVENTS ================= */}
      <section className="py-16 bg-gradient-to-b from-gray-50 via-pink-50/30 to-indigo-50/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
              Upcoming Events
            </h3>
            <Link
              to="/events"
              className="font-semibold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent hover:opacity-80 transition"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-600">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-gray-600">No events available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {events.slice(0, 4).map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition"
                >
                  <div className="h-28 bg-gradient-to-br from-pink-100 to-indigo-100 rounded-lg mb-4"></div>

                  <h4 className="font-semibold text-lg mb-2 text-gray-800">
                    {event.title || event.name}
                  </h4>

                  <p className="text-sm text-gray-500 mb-3">
                    {event.date
                      ? new Date(event.date).toLocaleDateString()
                      : "Date not specified"}
                  </p>

                  <Link
                    to={`/events/${event._id}`}
                    className="text-sm font-semibold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent hover:opacity-80 transition"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>



      {/* ================= CLUBS ================= */}
      <section className="py-16 bg-gradient-to-b from-indigo-50/30 via-pink-50/30 to-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 to-pink-600 bg-clip-text text-transparent">
              Popular Clubs
            </h3>
            <Link
              to="/clubs"
              className="font-semibold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent hover:opacity-80 transition"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-600">Loading clubs...</p>
          ) : clubs.length === 0 ? (
            <p className="text-gray-600">No clubs available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {clubs.slice(0, 4).map((club) => (
                <div
                  key={club._id}
                  className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl hover:-translate-y-1 transition"
                >
                  <div className="w-14 h-14 mx-auto bg-white rounded-full shadow mb-4"></div>

                  <h4 className="font-semibold text-lg text-gray-800">{club.name}</h4>

                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {club.description || "No description available"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>




      {/* ================= FOOTER ================= */}
      <footer className="mt-20 bg-gray-200/40">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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
                A modern campus event & club management platform helping students
                discover events, join communities, and stay connected effortlessly.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent mb-4 ml-15">
                Explore
              </h3>
              <ul className="space-y-3 text-sm text-gray-800 ml-15">
                <li><Link to="/" className="hover:text-pink-600">Home</Link></li>
                <li><Link to="/events" className="hover:text-pink-600">Events</Link></li>
                <li><Link to="/clubs" className="hover:text-pink-600">Clubs</Link></li>
                <li><Link to="/signup" className="hover:text-pink-600">Register</Link></li>
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

        {/* Bottom Section */}
        <div className="bg-gray-200/40">
          <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-gray-800 tracking-wide">
            <span className="bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent font-semibold">
              © 2026 EventSphere
            </span> — All rights reserved.
          </div>
        </div>
      </footer>




    </div>
  );
};

export default Home;
