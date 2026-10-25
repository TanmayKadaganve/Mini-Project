
import { useState } from "react";
import "./Navbar.css";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Syllabus", href: "/syllabus" },
  { label: "Model Papers", href: "/model-papers" },
  { label: "PYQs", href: "/pyqs" },
  { label: "Labs", href: "/labs" },
  { label: "Upload Notes", href: "/upload" },
  { label: "Calculator", href: "/calculator" },
];

const moreLinks = [
  { label: "VTU Scheme", href: "/vtu-scheme" },
  { label: "Academic Calendar", href: "/academic-calendar" },
];

export default function Navbar() {
  const [moreOpen, setMoreOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenus() {
    setMoreOpen(false);
    setMenuOpen(false);
  }

  return (
    <header className="rh-header">
      <nav className="rh-navbar" aria-label="Main navigation">
        <a className="rh-brand" href="/" onClick={closeMenus}>
          <span className="rh-brand-icon" aria-hidden="true">RH</span>
          <span>
            <strong>Resource Hub</strong>
            <small>BGMIT Academic Portal</small>
          </span>
        </a>

        <button
          className="rh-menu-toggle"
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div className={`rh-nav-links ${menuOpen ? "is-open" : ""}`}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              className="rh-nav-link"
              href={link.href}
              onClick={closeMenus}
            >
              {link.label}
            </a>
          ))}

          <div className="rh-more">
            <button
              type="button"
              className="rh-nav-link rh-more-button"
              aria-expanded={moreOpen}
              aria-haspopup="true"
              onClick={() => setMoreOpen(!moreOpen)}
            >
              More <span aria-hidden="true">{moreOpen ? "▴" : "▾"}</span>
            </button>

            {moreOpen && (
              <div className="rh-dropdown">
                {moreLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="rh-dropdown-link"
                    onClick={closeMenus}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
