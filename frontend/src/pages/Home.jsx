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
      const eventsRes = await axios.get("http://localhost:5000/api/event/allEvents");
      const clubsRes = await axios.get("http://localhost:5000/api/club/allClubs");

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

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-indigo-600 text-white flex items-center justify-center rounded-lg font-bold shadow-md text-xs flex-shrink-0">
              ES
            </div>
            <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
              EventSphere
            </h1>
          </div>

          <div className="hidden md:flex gap-5 font-medium">
            <Link
              to="/"
              className="px-3 py-1 text-sm bg-gradient-to-r from-pink-500 to-indigo-600 text-white rounded-md font-semibold shadow-sm"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="px-3 py-1 text-sm rounded-md transition bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-gray-700 hover:text-transparent"
            >
              Events
            </Link>
            <Link
              to="/login"
              className="px-3 py-1 text-sm rounded-md transition bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-gray-700 hover:text-transparent"
            >
              Clubs
            </Link>
            <Link
              to="/login"
              className="px-3 py-1 text-sm rounded-md transition bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-gray-700 hover:text-transparent"
            >
              Login
            </Link>
          </div>

          <Link
            to="/signup"
            className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg hover:scale-[1.05] transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[480px] sm:h-[560px] md:h-[730px] overflow-hidden">
        <img
          src={heroImage}
          alt="Hero"
          className="w-full h-full object-cover object-center md:object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-pink-500/20 to-indigo-600/20"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 leading-tight drop-shadow-lg">
            Discover{" "}
            <span className="bg-gradient-to-r from-pink-400 to-indigo-500 bg-clip-text text-transparent">
              Events
            </span>
            .<br />
            Connect With{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">
              Clubs
            </span>
            .
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-6 sm:mb-8 max-w-xl sm:max-w-2xl drop-shadow-md">
            Explore exciting campus activities and join communities that match your passion.
          </p>
          <div className="flex justify-center gap-3 sm:gap-6 flex-wrap">
            <button
              onClick={() => document.getElementById("events-section")?.scrollIntoView({ behavior: "smooth" })}
              className="px-5 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-gradient-to-r from-pink-500 to-indigo-600 rounded-full font-semibold shadow-md hover:shadow-lg hover:scale-[1.05] transition"
            >
              Browse Events
            </button>
            <button
              onClick={() => document.getElementById("clubs-section")?.scrollIntoView({ behavior: "smooth" })}
              className="px-5 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base border border-white rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition"
            >
              Explore Clubs
            </button>
          </div>
        </div>
      </section>

      {/* Event Section */}
      <section id="events-section" className="py-12 sm:py-16 pb-8 bg-gradient-to-b from-gray-50 via-pink-50/30 to-indigo-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center mb-7 sm:mb-10">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
              Upcoming Events
            </h3>
          </div>
          {loading ? (
            <p className="text-gray-600">Loading events...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 items-stretch">
              {events.slice(0, 4).map((event) => (
                <Link
                  to="/login"
                  key={event._id}
                  className="bg-white rounded-2xl shadow-md p-5 sm:p-6 hover:shadow-xl hover:-translate-y-1 transition flex flex-col h-full"
                >
                  {event.image ? (
                    <img
                      src={event.image}
                      alt="event"
                      className="h-32 w-full object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="h-32 flex items-center justify-center text-center px-3 bg-gradient-to-br from-pink-100 to-indigo-100 rounded-lg mb-4">
                      <span className="text-sm font-semibold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent line-clamp-2">
                        {event.title}
                      </span>
                    </div>
                  )}
                  <h4 className="font-semibold text-base sm:text-lg mb-2 text-gray-800">{event.title}</h4>
                  <p className="text-sm text-gray-500 mb-3 tabular-nums">
                    {event.eventDate
                      ? new Date(event.eventDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "Date not specified"}
                  </p>
                  <div className="mt-auto text-sm font-semibold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent">
                    View Details →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Club Section */}
      <section id="clubs-section" className="py-12 sm:py-16 bg-gradient-to-b from-indigo-50/30 via-pink-50/30 to-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center mb-7 sm:mb-10">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-500 to-pink-600 bg-clip-text text-transparent">
              Popular Clubs
            </h3>
            <Link
              to="/login"
              className="text-sm sm:text-base font-semibold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent hover:opacity-80 transition"
            >
              View All →
            </Link>
          </div>
          {loading ? (
            <p className="text-gray-600">Loading clubs...</p>
          ) : clubs.length === 0 ? (
            <p className="text-gray-600">No clubs available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
              {clubs.slice(0, 4).map((club) => (
                <Link
                  to="/login"
                  key={club._id}
                  className="bg-white border border-gray-200 rounded-2xl shadow-lg shadow-indigo-100 p-5 sm:p-6 text-center hover:shadow-xl hover:-translate-y-1 transition"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-indigo-600 text-white font-bold text-base sm:text-lg mb-4">
                    {club.name.charAt(0).toUpperCase()}
                  </div>
                  <h4 className="font-semibold text-base sm:text-lg text-gray-800">{club.name}</h4>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {club.description || "No description available"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-6 bg-gray-100 border-t border-gray-300 shadow-inner">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-indigo-600 text-white flex items-center justify-center rounded-xl font-bold text-lg flex-shrink-0">
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
              <h3 className="text-lg font-semibold bg-gradient-to-r from-pink-500 to-indigo-600 bg-clip-text text-transparent mb-4">
                Explore
              </h3>
              <ul className="space-y-3 text-sm text-gray-800">
                <li><Link to="/" className="hover:text-pink-600">Home</Link></li>
                <li><Link to="/login" className="hover:text-pink-600">Events</Link></li>
                <li><Link to="/login" className="hover:text-pink-600">Clubs</Link></li>
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

        {/* Bottom */}
        <div className="bg-gray-200 border-t border-gray-300">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6 text-center text-sm text-gray-800 tracking-wide">
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