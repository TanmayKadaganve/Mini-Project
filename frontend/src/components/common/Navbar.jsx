
// import { useState } from "react";
// import "./Navbar.css";

// const links = [
//   { label: "Home", href: "/" },
//   { label: "Syllabus", href: "/syllabus" },
//   { label: "Model Papers", href: "/model-papers" },
//   { label: "PYQs", href: "/pyqs" },
//   { label: "Labs", href: "/labs" },
// ];

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <header className="navbar">
//       <div className="navbar-inner container">
//         <a className="brand" href="/" aria-label="Resource Hub Home">
//           <span className="brand-icon">RH</span>
//           <span>Resource Hub</span>
//         </a>

//         <button
//           className="menu-toggle"
//           type="button"
//           aria-label="Toggle navigation menu"
//           aria-expanded={menuOpen}
//           onClick={() => setMenuOpen((open) => !open)}
//         >
//           {menuOpen ? "✕" : "☰"}
//         </button>

//         <nav
//           className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}
//           aria-label="Main navigation"
//         >
//           {links.map((link) => (
//             <a
//               key={link.href}
//               href={link.href}
//               onClick={() => setMenuOpen(false)}
//             >
//               {link.label}
//             </a>
//           ))}

//           <a
//             className="nav-upload"
//             href="/upload"
//             onClick={() => setMenuOpen(false)}
//           >
//             Upload Notes
//           </a>
//         </nav>
//       </div>
//     </header>
//   );
// }
