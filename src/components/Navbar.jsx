import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, LogOut, Stethoscope } from "lucide-react";
import { isLoggedIn } from "../services/is_logged_in";
import { useSiteContext } from "../contexts/SiteContext";

export default function Navbar({ openLogin }) {
  const { siteName } = useSiteContext();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const loggedIn = isLoggedIn();

  useEffect(() => {
    const handler = () => setUser(JSON.parse(localStorage.getItem("user") || "{}"));
    window.addEventListener("authChanged", handler);
    return () => window.removeEventListener("authChanged", handler);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.dispatchEvent(new Event("authChanged"));
    window.location.href = "/";
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 py-4">
      <nav className="
          max-w-6xl mx-auto flex items-center justify-between px-6 py-4
          rounded-2xl shadow-lg backdrop-blur-md
          bg-white/80 border border-sky-100
          text-slate-800
        "
      >
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-sky-700"
        >
          <Stethoscope className="text-sky-500" />
          <span className="hidden sm:inline">{siteName}</span>
          <span className="sm:hidden">Cuspids</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="font-medium px-3 py-1 rounded-lg transition hover:text-sky-600"
          >
            Home
          </Link>
          <Link
            to="/booking"
            className="font-medium px-3 py-1 rounded-lg transition hover:text-sky-600"
          >
            Book Appointment
          </Link>
          <Link
            to="/my-bookings"
            className="font-medium px-3 py-1 rounded-lg transition hover:text-sky-600"
          >
            My Appointments
          </Link>
        </div>

        {/* DESKTOP LOGIN BUTTONS */}
        <div className="hidden md:flex items-center gap-3">
          {!loggedIn ? (
            <button
              onClick={openLogin}
              className="
                font-bold px-6 py-2 rounded-full transition
                bg-sky-600 text-white
                hover:bg-sky-700 hover:shadow-md
              "
            >
              Login
            </button>
          ) : (
            <>
              <Link
                to="/profile"
                className="font-semibold px-4 py-2 rounded-full transition hover:bg-sky-50 text-sky-700"
              >
                {user?.name || "User"}
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-slate-600 p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div
          className="
            md:hidden mt-2 p-4 rounded-2xl backdrop-blur-xl
            bg-white/95 border border-sky-100 shadow-xl
            flex flex-col gap-2 text-slate-800
          "
        >
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="font-semibold py-3 px-4 rounded-xl hover:bg-sky-50 hover:text-sky-700"
          >
            Home
          </Link>
          <Link
            to="/booking"
            onClick={() => setOpen(false)}
            className="font-semibold py-3 px-4 rounded-xl hover:bg-sky-50 hover:text-sky-700"
          >
            Book Appointment
          </Link>
          <Link
            to="/my-bookings"
            onClick={() => setOpen(false)}
            className="font-semibold py-3 px-4 rounded-xl hover:bg-sky-50 hover:text-sky-700"
          >
            My Appointments
          </Link>

          {!loggedIn ? (
            <button
              onClick={() => {
                setOpen(false);
                openLogin();
              }}
              className="
                w-full font-bold py-3 rounded-xl
                bg-sky-600 text-white mt-2
              "
            >
              Login
            </button>
          ) : (
            <>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="font-semibold py-3 px-4 rounded-xl hover:bg-sky-50 hover:text-sky-700"
              >
                Profile ({user?.name || "User"})
              </Link>
              <button
                onClick={logout}
                className="w-full font-semibold py-3 rounded-xl bg-red-50 text-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
