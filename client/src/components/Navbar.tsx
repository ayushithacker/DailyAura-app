import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useUser } from "../context/UserContext";

const Navbar: React.FC = () => {
    const { user } = useUser();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // true if token exists
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    console.log(token);
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);

      // Example: Fetch username from backend
      fetch("http://localhost:5050/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
     
        })
        .catch((err) => {
          console.error(err);
          setIsLoggedIn(false);
        });
    } else {
      setIsLoggedIn(false);
    }
  }, [pathname]);
const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate("/login");
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Journal", path: "/journal" },
    // { name: "Login", path: "/login" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-rose-400 via-pink-350 to-purple-500
    shadow-lg backdrop-blur-sm"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-wide drop-shadow-md">
          🌌 DailyAura
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm font-semibold transition ${
                pathname === item.path
                  ? "text-yellow-300 underline"
                  : "text-gray-200"
              } hover:text-yellow-400 hover:tracking-wide`}
            >
              {item.name}
            </Link>
          ))}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-white font-semibold hover:text-yellow-300"
              >
                My Profile 
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg py-2 z-50">
                  <div className="px-4 py-2 text-sm text-gray-800 border-b">
                    👤 {user?.username.toUpperCase() || "User"}
                  </div>
                  <Link
                    to="/change-password"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    🔒 Change Password
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-1.5 rounded-2xl text-sm font-semibold shadow hover:bg-blue-700 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-blue-950 text-white px-6 pb-4 space-y-3 shadow-lg">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`block text-sm font-medium ${
                pathname === item.path
                  ? "text-yellow-300 font-semibold"
                  : "text-gray-200"
              } hover:text-yellow-400 transition`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
