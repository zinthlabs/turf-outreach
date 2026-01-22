import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SportsBooking from "./pages/SportsBooking";
import MyBookings from "./pages/MyBooking";
import Profile from "./pages/Profile";
import LoginModal from "./components/LoginModal";
import { isLoggedIn } from "./services/is_logged_in";
import { fetchSiteSettings } from "./services/api";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [redirectTo, setRedirectTo] = useState(null);
  const [siteName, setSiteName] = useState("Strikers Yard");

  const loggedIn = isLoggedIn();
  // const [login,setLogin] = useState(isLoggedIn());

  useEffect(() => {
    fetchSiteSettings()
      .then((res) => {
        if (res.data) {
          const name = res.data.site_title;
          if (name) {
            setSiteName(name);
            document.title = name;
          }
        }
      })
      .catch((err) => {
        console.error("Failed to fetch site settings:", err);
      });
  }, []);


  const openLogin = (path) => {
    setRedirectTo(path);
    setShowLogin(true);
  };

  const handleLoginSuccess = () => {
    if (redirectTo) {
      window.location.href = redirectTo;
    }
  };

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <Navbar openLogin={() => openLogin()} siteName={siteName} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<SportsBooking />} />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute loggedIn={loggedIn} openLogin={openLogin}>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute loggedIn={loggedIn} openLogin={openLogin}>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}
