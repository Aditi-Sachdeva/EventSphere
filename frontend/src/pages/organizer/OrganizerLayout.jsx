import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";
const GRAD = "linear-gradient(to right, #ec4899, #6366f1)";
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

const NAV_LINKS = [
  { to: "/organizer/events",    icon: "📅", label: "Club Events" },
  { to: "/organizer/approvals", icon: "👥", label: "Member Approvals" },
  { to: "/organizer/create",    icon: "➕", label: "Create Event" },
];

export default function OrganizerLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser]           = useState(null);
  const [clubName, setClubName]   = useState("");
  const [pendingCount, setPendingCount] = useState(0);
  const [open, setOpen]           = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/login"); return; }
    const parsed = JSON.parse(stored);
    setUser(parsed);
    const clubId = parsed?.clubId || parsed?.club?._id || parsed?.club;
    if (clubId) {
      axios.get(`${API}/club/${clubId}/pending`, auth())
        .then(r => {
          setClubName(r.data.clubName || "");
          setPendingCount((r.data.pending || []).length);
        })
        .catch(console.error);
    }
  }, []);

  async function handleLogout() {
    try { await axios.post(`${API}/auth/logout`, {}, auth()); } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-5 shadow-sm">
              <div className="flex items-center gap-3 ml-2">
                <button
                  onClick={() => setOpen(!open)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-500 transition-colors"
                >
                  ☰
                </button>
      
                <Link to="/mainpage">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-md cursor-pointer"
                    style={{ background: GRAD }}
                  >
                    ES
                  </div>
                </Link>
      
                <Link to="/mainpage">
                  <h1 className="text-lg font-bold cursor-pointer">
                    Event
                    <span
                      style={{
                        background: GRAD,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Sphere
                    </span>
                  </h1>
                </Link>
              </div>
      
      
              <div className="flex items-center gap-2 pl-3 border-l border-gray-200 mr-16">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: GRAD }}
                >
                  0
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-800">Organizer</div>
                </div>
              </div>
            </header>

      <div className="flex pt-16 flex-1">

        {/* Sidebar */}
        <aside
          className={`fixed top-16 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden ${open ? "w-56" : "w-16"}`}
          style={{ height: "calc(100vh - 64px)" }}
        >
          <nav className="p-2.5 flex flex-col gap-1 mt-6">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`w-full flex items-center gap-2.5 rounded-xl py-2.5 text-sm font-medium transition-all
                  ${open ? "px-3" : "px-0 justify-center"}
                  ${isActive(link.to)
                    ? "text-white font-bold shadow-lg"
                    : "text-gray-500 hover:bg-indigo-50 hover:text-indigo-500"
                  }`}
                style={isActive(link.to) ? { background: GRAD } : {}}
              >
                <span className="shrink-0">{link.icon}</span>
                {open && <span>{link.label}</span>}
                {open && link.to === "/organizer/approvals" && pendingCount > 0 && (
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-semibold
                    ${isActive(link.to) ? "bg-white/30 text-white" : "bg-red-100 text-red-600"}`}>
                    {pendingCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {open && (
            <div className="absolute bottom-0 left-0 right-0 px-5 py-4 border-t border-gray-100">
              <Link to="/mainpage" className="text-xs text-gray-400 hover:text-gray-700 transition">← Back to Home</Link>
            </div>
          )}
        </aside>

        {/* Main */}
        <main className={`flex-1 p-8 bg-gradient-to-b from-gray-50 via-pink-50/20 to-indigo-50/20 min-h-[calc(100vh-4rem)] transition-all duration-300 ${open ? "ml-56" : "ml-16"}`}>
          {typeof children === "function"
            ? children({ clubName, setClubName, pendingCount, setPendingCount })
            : children}
        </main>
      </div>
    </div>
  );
}