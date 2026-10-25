
// import { useState } from "react";
// import "./Home.css";

// const academicPaths = [
//   {
//     id: "first-year",
//     name: "First Year",
//     description: "Common first-year academic resources",
//     icon: "🎓",
//     semesters: [1, 2],
//   },
//   {
//     id: "cse",
//     name: "Computer Science and Engineering",
//     description: "Explore CSE academic resources",
//     icon: "💻",
//     semesters: [3, 4, 5, 6, 7, 8],
//   },
//   {
//     id: "aiml",
//     name: "Artificial Intelligence and Machine Learning",
//     description: "Explore AIML academic resources",
//     icon: "🤖",
//     semesters: [3, 4, 5, 6, 7, 8],
//   },
//   {
//     id: "mechanical",
//     name: "Mechanical Engineering",
//     description: "Explore Mechanical academic resources",
//     icon: "⚙️",
//     semesters: [3, 4, 5, 6, 7, 8],
//   },
//   {
//     id: "ece",
//     name: "Electronics and Communication",
//     description: "Explore Electronics and Communication resources",
//     icon: "🔌",
//     semesters: [3, 4, 5, 6, 7, 8],
//   },
//   {
//     id: "civil",
//     name: "Civil Engineering",
//     description: "Explore Civil academic resources",
//     icon: "🏗️",
//     semesters: [3, 4, 5, 6, 7, 8],
//   },
// ];

// // Verified curriculum data will be added later.
// // Keys represent semester numbers within each academic path.
// const subjectsByPath = {
//   "first-year": {},
//   cse: {},
//   aiml: {},
//   mechanical: {},
//   ece: {},
//   civil: {},
// };

// export default function Home() {
//   const [search, setSearch] = useState("");
//   const [selectedPath, setSelectedPath] = useState(null);
//   const [selectedSemester, setSelectedSemester] = useState(null);
//   const [selectedSubject, setSelectedSubject] = useState(null);

//   const filteredPaths = academicPaths.filter((path) =>
//     path.name.toLowerCase().includes(search.trim().toLowerCase())
//   );

//   const subjects =
//     selectedPath && selectedSemester
//       ? subjectsByPath[selectedPath.id]?.[selectedSemester] || []
//       : [];

//   const modules = selectedSubject?.modules || [];

//   function openPath(path) {
//     setSelectedPath(path);
//     setSelectedSemester(null);
//     setSelectedSubject(null);
//     setSearch("");
//   }

//   function goHome() {
//     setSelectedPath(null);
//     setSelectedSemester(null);
//     setSelectedSubject(null);
//     setSearch("");
//   }

//   function handleSearch(event) {
//     event.preventDefault();

//     const query = search.trim().toLowerCase();
//     if (!query) return;

//     const match = academicPaths.find((path) =>
//       path.name.toLowerCase().includes(query)
//     );

//     if (match) {
//       openPath(match);
//     }
//   }     

//   function goBack() {
//     if (selectedSubject) {
//       setSelectedSubject(null);
//     } else if (selectedSemester !== null) {
//       setSelectedSemester(null);
//     } else {
//       goHome();
//     }
//   }

//   return (
//     <main>
//       <section className="hero">
//         <div className="container hero-content">
//           <span className="hero-label">
//             BGMIT · Academic Resources
//           </span>

//           <h1>All Your Semester Notes in One Place</h1>

//           <p>
//             Find academic notes and study materials organized
//             by academic path, semester, subject, and module.
//           </p>

//           <form className="home-search" onSubmit={handleSearch}>
//             <span className="search-icon" aria-hidden="true">
//               ⌕
//             </span>

//             <input
//               type="search"
//               aria-label="Search academic paths"
//               placeholder="Search your branch..."
//               value={search}
//               onChange={(event) => setSearch(event.target.value)}
//             />

//             <button type="submit">Search</button>
//           </form>

//           <button
//             className="hero-link"
//             type="button"
//             onClick={() =>
//               document
//                 .getElementById("academic-paths")
//                 ?.scrollIntoView({ behavior: "smooth" })
//             }
//           >
//             Explore Academic Resources <span>→</span>
//           </button>
//         </div>
//       </section>

//       <section
//         className="section academic-section"
//         id="academic-paths"
//       >
//         <div className="container">
//           {!selectedPath ? (
//             <>
//               <div className="section-heading-row">
//                 <h2 className="section-heading">
//                   Choose Your Academic Path
//                 </h2>
//                 <p className="section-description">
//                   Select First Year or your engineering branch to get started.
//                 </p>
//               </div>

//               <div className="branch-grid">
//                 {filteredPaths.map((path) => (
//                   <button
//                     type="button"
//                     className={`branch-card ${
//                       path.id === "first-year" ? "first-year-card" : ""
//                     }`}
//                     key={path.id}
//                     onClick={() => openPath(path)}
//                   >
//                     <span className="branch-icon" aria-hidden="true">
//                       {path.icon}
//                     </span>

//                     <span className="branch-name">{path.name}</span>

//                     <span className="branch-description">
//                       {path.description}
//                     </span>

//                     <span className="branch-action">
//                       Explore {path.id === "first-year" ? "First Year" : "Branch"}
//                       <span aria-hidden="true"> →</span>
//                     </span>
//                   </button>
//                 ))}
//               </div>

//               {filteredPaths.length === 0 && (
//                 <div className="empty-state">
//                   <h3>No matching academic paths</h3>
//                   <p>Try searching for First Year or a branch name.</p>
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className="browse-panel">
//               <nav className="breadcrumbs" aria-label="Breadcrumb">
//                 <button type="button" onClick={goHome}>
//                   Home
//                 </button>
//                 <span>/</span>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     setSelectedSemester(null);
//                     setSelectedSubject(null);
//                   }}
//                 >
//                   {selectedPath.name}
//                 </button>

//                 {selectedSemester !== null && (
//                   <>
//                     <span>/</span>
//                     <button
//                       type="button"
//                       onClick={() => setSelectedSubject(null)}
//                     >
//                       Semester {selectedSemester}
//                     </button>
//                   </>
//                 )}

//                 {selectedSubject && (
//                   <>
//                     <span>/</span>
//                     <span>{selectedSubject.name}</span>
//                   </>
//                 )}
//               </nav>

//               {selectedSemester === null ? (
//                 <>
//                   <h2 className="browse-title">
//                     {selectedPath.name} — Semesters
//                   </h2>

//                   <p className="section-description">
//                     Select a semester to explore its subjects.
//                   </p>

//                   <div className="semester-grid">
//                     {selectedPath.semesters.map((semester) => (
//                       <button
//                         type="button"
//                         className="semester-card"
//                         key={semester}
//                         onClick={() => setSelectedSemester(semester)}
//                       >
//                         <span className="semester-number">
//                           {String(semester).padStart(2, "0")}
//                         </span>
//                         <span className="semester-title">
//                           Semester {semester}
//                         </span>
//                         <span className="semester-action">
//                           View subjects →
//                         </span>
//                       </button>
//                     ))}
//                   </div>
//                 </>
//               ) : !selectedSubject ? (
//                 <>
//                   <h2 className="browse-title">
//                     Semester {selectedSemester}
//                   </h2>

//                   <p className="section-description">
//                     Select a subject to view its modules and notes.
//                   </p>

//                   {subjects.length > 0 ? (
//                     <div className="subject-grid">
//                       {subjects.map((subject) => (
//                         <button
//                           type="button"
//                           className="subject-card"
//                           key={subject.id}
//                           onClick={() => setSelectedSubject(subject)}
//                         >
//                           <span className="subject-icon" aria-hidden="true">
//                             📘
//                           </span>
//                           <span className="subject-name">
//                             {subject.name}
//                           </span>
//                           <span className="branch-action">
//                             View modules →
//                           </span>
//                         </button>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="empty-state">
//                       <span className="empty-icon" aria-hidden="true">
//                         📚
//                       </span>
//                       <h3>Subjects coming soon</h3>
//                       <p>
//                         Verified subject information will appear here
//                         when the academic data is added.
//                       </p>
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <>
//                   <h2 className="browse-title">
//                     {selectedSubject.name}
//                   </h2>

//                   <p className="section-description">
//                     Browse the modules and their available notes.
//                   </p>

//                   {modules.length > 0 ? (
//                     <div className="module-list">
//                       {modules.map((module) => (
//                         <section className="module-card" key={module.id}>
//                           <h3>{module.name}</h3>

//                           {module.notes?.length ? (
//                             module.notes.map((note) => (
//                               <a
//                                 className="note-link"
//                                 key={note.id}
//                                 href={note.url}
//                                 target="_blank"
//                                 rel="noreferrer"
//                               >
//                                 📄 {note.title}
//                               </a>
//                             ))
//                           ) : (
//                             <p>No notes available in this module yet.</p>
//                           )}
//                         </section>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="empty-state">
//                       <span className="empty-icon" aria-hidden="true">
//                         📖
//                       </span>
//                       <h3>Modules coming soon</h3>
//                       <p>
//                         Modules and notes will appear after the verified
//                         subject data is added.
//                       </p>
//                     </div>
//                   )}
//                 </>
//               )}

//               <button
//                 type="button"
//                 className="back-button"
//                 onClick={goBack}
//               >
//                 ← Back
//               </button>
//             </div>
//           )}
//         </div>
//       </section>
//     </main>
//   );
// }
