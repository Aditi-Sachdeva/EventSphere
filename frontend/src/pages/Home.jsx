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

      {/* ================= NAVBAR ================= */}
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-xl font-bold">
              ES
            </div>
            <h1 className="text-xl font-bold text-indigo-600">EventSphere</h1>
          </div>

          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <Link to="/events" className="hover:text-indigo-600">Events</Link>
            <Link to="/clubs" className="hover:text-indigo-600">Clubs</Link>
            <Link to="/login" className="hover:text-indigo-600">Login</Link>
          </div>

          <Link
            to="/signup"
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm hover:bg-indigo-700 transition"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section
        className="relative py-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Discover Events.
            <span className="block text-indigo-300">
              Connect With Clubs.
            </span>
          </h2>

          <p className="text-lg text-gray-200 mb-8">
            Explore exciting campus activities and join communities that match your passion.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/events"
              className="px-6 py-3 bg-indigo-600 rounded-full hover:bg-indigo-700 transition"
            >
              Browse Events
            </Link>

            <Link
              to="/clubs"
              className="px-6 py-3 border border-white rounded-full hover:bg-white hover:text-indigo-600 transition"
            >
              Explore Clubs
            </Link>
          </div>
        </div>
      </section>

      {/* ================= EVENTS ================= */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-semibold">Upcoming Events</h3>
            <Link to="/events" className="text-indigo-600 hover:underline">
              View All →
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-gray-500">No events available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {events.slice(0, 4).map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition"
                >
                  <div className="h-28 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg mb-4"></div>

                  <h4 className="font-semibold text-lg mb-2">
                    {event.title || event.name}
                  </h4>

                  <p className="text-sm text-gray-500 mb-3">
                    {event.date
                      ? new Date(event.date).toLocaleDateString()
                      : "Date not specified"}
                  </p>

                  <Link
                    to={`/events/${event._id}`}
                    className="text-sm text-indigo-600 hover:underline"
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
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-semibold">Popular Clubs</h3>
            <Link to="/clubs" className="text-indigo-600 hover:underline">
              View All →
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading clubs...</p>
          ) : clubs.length === 0 ? (
            <p className="text-gray-500">No clubs available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {clubs.slice(0, 4).map((club) => (
                <div
                  key={club._id}
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 text-center hover:shadow-xl hover:-translate-y-1 transition"
                >
                  <div className="w-14 h-14 mx-auto bg-white rounded-full shadow mb-4"></div>

                  <h4 className="font-semibold text-lg">{club.name}</h4>

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
      <footer className="mt-20">

        {/* Top Section */}
        <div className="bg-gray-100 border-t">
          <div className="max-w-6xl mx-auto px-6 py-14">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-xl font-bold text-lg">
                    ES
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    EventSphere
                  </h2>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">
                  A modern campus event & club management platform helping students 
                  discover events, join communities, and stay connected effortlessly.
                </p>
              </div>

              <div>
                <h3 className="text-gray-800 font-semibold mb-4">
                  Explore
                </h3>

                <ul className="space-y-3 text-sm text-gray-600">
                  <li><Link to="/" className="hover:text-indigo-600">Home</Link></li>
                  <li><Link to="/events" className="hover:text-indigo-600">Events</Link></li>
                  <li><Link to="/clubs" className="hover:text-indigo-600">Clubs</Link></li>
                  <li><Link to="/signup" className="hover:text-indigo-600">Register</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-gray-800 font-semibold mb-4">
                  Platform
                </h3>

                <div className="space-y-3 text-sm text-gray-600">
                  <p>Campus Event Management System</p>
                  <p>Built for Student Communities</p>
                  <p>Seamless Event Experience</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bg-gray-900">
          <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-gray-400 tracking-wide">
            © 2026 EventSphere. All rights reserved.
          </div>
        </div>

      </footer>

    </div>
  );
};

export default Home;