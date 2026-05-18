



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
  const [user, setUser]                 = useState(null);
  const [clubName, setClubName]         = useState("");
  const [pendingCount, setPendingCount] = useState(0);
  const [open, setOpen]                 = useState(true);       // desktop sidebar
  const [mobileOpen, setMobileOpen]     = useState(false);      // mobile drawer

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

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close mobile drawer on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    const handle = (e) => {
      if (!e.target.closest("[data-mobiledrawer]") && !e.target.closest("[data-hamburger]")) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [mobileOpen]);

  async function handleLogout() {
    try { await axios.post(`${API}/auth/logout`, {}, auth()); } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  // Sidebar widths as numbers so we can use them in inline styles
  const SIDEBAR_OPEN_W  = 224; // w-56 = 14rem = 224px
  const SIDEBAR_CLOSED_W = 64; // w-16 = 4rem  = 64px

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-5 shadow-sm">

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop: collapse sidebar toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="hidden md:flex w-9 h-9 rounded-xl items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-500 transition-colors"
            aria-label="Toggle sidebar"
          >
            ☰
          </button>

          {/* Mobile: open drawer */}
          <button
            data-hamburger
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-xl border border-gray-200 bg-gray-50 hover:bg-indigo-50 transition"
            aria-label="Toggle menu"
          >
            <span style={{ width: "16px", height: "2px", display: "block", backgroundColor: "#6B7280", transition: "all 0.2s", transform: mobileOpen ? "rotate(45deg) translate(0, 5px)" : "none", marginBottom: "3px" }} />
            <span style={{ width: "16px", height: "2px", display: "block", backgroundColor: "#6B7280", opacity: mobileOpen ? 0 : 1, transition: "all 0.2s", marginBottom: "3px" }} />
            <span style={{ width: "16px", height: "2px", display: "block", backgroundColor: "#6B7280", transition: "all 0.2s", transform: mobileOpen ? "rotate(-45deg) translate(0, -5px)" : "none" }} />
          </button>

          <Link to="/mainpage" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-md"
              style={{ background: GRAD }}
            >
              ES
            </div>
            <h1 className="text-lg font-bold">
              Event
              <span style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Sphere
              </span>
            </h1>
          </Link>
        </div>

        {/* User pill */}
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: GRAD }}
          >
            {user.name ? user.name.charAt(0).toUpperCase() : "O"}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold text-gray-800 max-w-[120px] truncate">{user.name || "Organizer"}</div>
            <div className="text-xs text-gray-400">Organizer</div>
          </div>
          <button
            onClick={handleLogout}
            className="ml-1 sm:ml-2 text-xs text-gray-400 hover:text-red-500 transition px-2 py-1 rounded-lg hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex pt-16">

        {/* Mobile overlay backdrop */}
        {mobileOpen && (
          <div
            className="md:hidden fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile drawer */}
        <aside
          data-mobiledrawer
          className="md:hidden fixed top-16 left-0 z-40 bg-white border-r border-gray-200 w-64 transition-transform duration-300"
          style={{
            height: "calc(100vh - 64px)",
            transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          <NavContent
            open={true}
            isActive={isActive}
            pendingCount={pendingCount}
            clubName={clubName}
          />
        </aside>

        {/* Desktop sidebar — inline width so the transition actually works */}
        <aside
          className="hidden md:block fixed top-16 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden"
          style={{
            height: "calc(100vh - 64px)",
            width: open ? `${SIDEBAR_OPEN_W}px` : `${SIDEBAR_CLOSED_W}px`,
          }}
        >
          <NavContent
            open={open}
            isActive={isActive}
            pendingCount={pendingCount}
            clubName={clubName}
          />
        </aside>

        {/* Main content — inline marginLeft on md+ so it tracks the sidebar width correctly */}
        <main
          className="flex-1 p-4 sm:p-6 md:p-8 bg-gradient-to-b from-gray-50 via-pink-50/20 to-indigo-50/20 min-h-[calc(100vh-4rem)] transition-all duration-300 w-full"
          style={{
            // On mobile the sidebar is an overlay so no offset needed.
            // On md+ we shift by the sidebar width using a CSS custom property
            // injected via a <style> tag below so we can still use Tailwind for everything else.
            marginLeft: "var(--sidebar-offset, 0px)",
          }}
        >
          {typeof children === "function"
            ? children({ clubName, setClubName, pendingCount, setPendingCount })
            : children}
        </main>
      </div>

      {/*
        Inject a small style block that sets --sidebar-offset at the md breakpoint.
        This is the cleanest way to drive a CSS-variable from React state without
        fighting Tailwind's JIT string interpolation limitation.
      */}
      <style>{`
        @media (min-width: 768px) {
          :root {
            --sidebar-offset: ${open ? SIDEBAR_OPEN_W : SIDEBAR_CLOSED_W}px;
          }
        }
      `}</style>
    </div>
  );
}

/* Shared sidebar nav content */
function NavContent({ open, isActive, pendingCount, clubName }) {
  return (
    <div className="flex flex-col h-full">
      {clubName && open && (
        <div className="px-4 pt-5 pb-2">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">Managing</p>
          <p className="text-sm font-semibold text-gray-700 truncate">{clubName}</p>
        </div>
      )}

      <nav className="p-2.5 flex flex-col gap-1 mt-4 flex-1">
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
            style={isActive(link.to) ? { background: "linear-gradient(to right, #ec4899, #6366f1)" } : {}}
          >
            <span className="shrink-0 text-base">{link.icon}</span>
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

      <div className="px-4 sm:px-5 py-4 border-t border-gray-100">
        <Link to="/mainpage" className="text-xs text-gray-400 hover:text-gray-700 transition flex items-center gap-1">
          <span>←</span> Back to Home
        </Link>
      </div>
    </div>
  );
}