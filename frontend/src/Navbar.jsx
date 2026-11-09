
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const [moreOpen, setMoreOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);



const [isFacultyLoggedIn, setIsFacultyLoggedIn] = useState(
  Boolean(
    localStorage.getItem("facultyToken") &&
    localStorage.getItem("facultyRole") === "faculty"
  )
);

const [facultyBranch, setFacultyBranch] = useState(
  localStorage.getItem("facultyBranch") || ""
);

// Update faculty login status
useEffect(() => {
  const updateFacultyStatus = () => {
    const token = localStorage.getItem("facultyToken");
    const branch = localStorage.getItem("facultyBranch");
    const role = localStorage.getItem("facultyRole");

    setIsFacultyLoggedIn(
      Boolean(token) && role === "faculty"
    );

    setFacultyBranch(branch || "");
  };

  window.addEventListener(
    "faculty-auth-changed",
    updateFacultyStatus
  );

  return () => {
    window.removeEventListener(
      "faculty-auth-changed",
      updateFacultyStatus
    );
  };
}, []);

  // Faculty logout
  const handleLogout = () => {
    localStorage.removeItem("facultyToken");
    localStorage.removeItem("facultyBranch");
    localStorage.removeItem("facultyRole");

    setIsFacultyLoggedIn(false);
    setFacultyBranch("");

    closeMenus();

    navigate("/");
  };

  // Navigation links
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Syllabus", href: "/syllabus" },
    { label: "Model Papers", href: "/model-papers" },
    { label: "PYQs", href: "/pyqs" },
    { label: "Labs", href: "/labs" },
    { label: "Calculator", href: "/calculator" },
  ];

  const moreLinks = [
    { label: "VTU Scheme", href: "/vtu-scheme" },
    { label: "Academic Calendar", href: "/academic-calendar" },
  ];

  function closeMenus() {
    setMoreOpen(false);
    setMenuOpen(false);
  }

  return (
    <header className="rh-header">
      <nav className="rh-navbar" aria-label="Main navigation">

        {/* Logo */}
        <Link
          className="rh-brand"
          to="/"
          onClick={closeMenus}
        >
          <span className="rh-brand-icon" aria-hidden="true">
            RH
          </span>

          <span>
            <strong>Resource Hub</strong>
            <small>BGMIT Academic Portal</small>
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="rh-menu-toggle"
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Navigation links */}
        <div
          className={`rh-nav-links ${menuOpen ? "is-open" : ""}`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              className="rh-nav-link"
              to={link.href}
              onClick={closeMenus}
            >
              {link.label}
            </Link>
          ))}

          {/* More dropdown */}
          <div className="rh-more">
            <button
              type="button"
              className="rh-nav-link rh-more-button"
              aria-expanded={moreOpen}
              aria-haspopup="true"
              onClick={() => setMoreOpen(!moreOpen)}
            >
              More{" "}
              <span aria-hidden="true">
                {moreOpen ? "▴" : "▾"}
              </span>
            </button>

            {moreOpen && (
              <div className="rh-dropdown">
                {moreLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="rh-dropdown-link"
                    onClick={closeMenus}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Faculty navigation */}
          {isFacultyLoggedIn ? (
            <>
              <span className="rh-nav-link">
                {facultyBranch} Faculty
              </span>

              <Link
                className="rh-nav-link"
                to="/upload"
                onClick={closeMenus}
              >
                Upload Notes
              </Link>

              <button
                type="button"
                className="rh-nav-link"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              className="rh-nav-link"
              to="/faculty-login"
              onClick={closeMenus}
            >
              Faculty Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
