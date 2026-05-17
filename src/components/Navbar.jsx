import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
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
    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[95vw] max-w-6xl z-50">
      <nav className="
          flex items-center justify-between px-8 py-4
          border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
          text-black
        "
      >
        {/* LOGO */}
        <Link
          to="/"
          className="text-4xl font-black italic tracking-tighter uppercase font-[Montserrat]"
        >
          {siteName || "IRON HAVEN"}
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="font-black uppercase tracking-widest text-sm px-4 py-2 hover:bg-brutal-yellow border-4 border-transparent hover:border-black transition-all"
          >
            Base
          </Link>
          <Link
            to="/booking"
            className="font-black uppercase tracking-widest text-sm px-4 py-2 hover:bg-brutal-yellow border-4 border-transparent hover:border-black transition-all"
          >
            Book Session
          </Link>
          <Link
            to="/my-bookings"
            className="font-black uppercase tracking-widest text-sm px-4 py-2 hover:bg-brutal-yellow border-4 border-transparent hover:border-black transition-all"
          >
            My Dossier
          </Link>
        </div>

        {/* DESKTOP LOGIN BUTTONS */}
        <div className="hidden md:flex items-center gap-3">
          {!loggedIn ? (
            <button
              onClick={openLogin}
              className="brutalist-button py-2 px-8 bg-brutal-red text-white"
            >
              Recruit
            </button>
          ) : (
            <>
              <Link
                to="/profile"
                className="font-black uppercase tracking-widest text-sm px-4 py-2 hover:bg-brutal-yellow border-4 border-transparent hover:border-black transition-all"
              >
                {user?.name || "Operative"}
              </Link>
              <button
                onClick={logout}
                className="p-2 border-4 border-black bg-black text-white hover:bg-brutal-red transition-all"
              >
                <LogOut size={24} />
              </button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-black p-2 border-4 border-black"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} strokeWidth={3} /> : <Menu size={28} strokeWidth={3} />}
        </button>
      </nav>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div
          className="
            md:hidden mt-4 p-6 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
            flex flex-col gap-4 text-black
          "
        >
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="font-black uppercase tracking-widest py-3 border-b-4 border-black hover:bg-brutal-yellow px-2"
          >
            Base
          </Link>
          <Link
            to="/booking"
            onClick={() => setOpen(false)}
            className="font-black uppercase tracking-widest py-3 border-b-4 border-black hover:bg-brutal-yellow px-2"
          >
            Book Session
          </Link>
          <Link
            to="/my-bookings"
            onClick={() => setOpen(false)}
            className="font-black uppercase tracking-widest py-3 border-b-4 border-black hover:bg-brutal-yellow px-2"
          >
            My Dossier
          </Link>

          {/* LOGIN / LOGOUT MOBILE */}
          {!loggedIn ? (
            <button
              onClick={() => {
                setOpen(false);
                openLogin();
              }}
              className="brutalist-button bg-brutal-red text-white w-full"
            >
              Recruit
            </button>
          ) : (
            <>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="font-black uppercase tracking-widest py-3 hover:bg-brutal-yellow px-2"
              >
                {user?.name || "Operative"}
              </Link>
              <button
                onClick={logout}
                className="brutalist-button bg-black text-white w-full"
              >
                Retreat
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
