import { useEffect, useState } from "react";

import curriculum, { branches } from "./data/curriculum";
import "./App.css";
import Navbar from "./Navbar";

const API = "http://localhost:5000/api";

export default function App() {
  const [scheme, setScheme] = useState("2025");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState(null);
  const [subject, setSubject] = useState(null);
  const [module, setModule] = useState(null);
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const semesters = branch
    ? Object.keys(curriculum[scheme]?.[branch] || {}).sort(
        (a, b) => Number(a) - Number(b)
      )
    : [];

  const subjects =
    branch && semester
      ? curriculum[scheme]?.[branch]?.[semester] || []
      : [];

  const filteredResources = resources.filter((resource) =>
    resource.originalName.toLowerCase().includes(search.toLowerCase())
  );

  function resetToBranches(nextScheme = scheme) {
    setScheme(nextScheme);
    setBranch("");
    setSemester(null);
    setSubject(null);
    setModule(null);
    setResources([]);
    setSelectedPDF(null);
    setSearch("");
    setError("");
  }

  function openBranch(name) {
    setBranch(name);
    setSemester(null);
    setSubject(null);
    setModule(null);
    setResources([]);
    setSelectedPDF(null);
    setError("");
  }

  function goToSubjects(nextSemester) {
    setSemester(nextSemester);
    setSubject(null);
    setModule(null);
    setResources([]);
    setSelectedPDF(null);
  }

  function goToModules(nextSubject) {
    setSubject(nextSubject);
    setModule(null);
    setResources([]);
    setSelectedPDF(null);
  }

  async function openModule(nextModule) {
    setModule(nextModule);
    setSelectedPDF(null);
    setSearch("");
    setError("");
    setLoading(true);
    setResources([]);

    try {
      const params = new URLSearchParams({
        scheme,
        branch,
        semester: String(semester),
        subject: subject.name,
        module: String(nextModule.number),
      });

      const response = await fetch(`${API}/resources?${params}`);

      if (!response.ok) {
        throw new Error("Could not load resources.");
      }

      const data = await response.json();
      setResources(data.resources || []);
    } catch {
      setError("Unable to load resources. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  // Refresh the current module's resources when the user returns
  // from the PDF reader.
  useEffect(() => {
    if (!selectedPDF && module && subject && semester && branch) {
      // Resources remain in state when the reader is closed.
    }
  }, [selectedPDF, module, subject, semester, branch]);

  const breadcrumb = [
    "Home",
    scheme + " Scheme",
    branch,
    semester ? `Semester ${semester}` : null,
    subject?.name,
    module ? `Module ${module.number}` : null,
  ].filter(Boolean);

  function goBackFromReader() {
    setSelectedPDF(null);
  }

  function renderBackButton(label, action) {
    return (
      <button className="back-button" onClick={action}>
        ← {label}
      </button>
    );
  }

  return (
    <div className="app-shell">
      <Navbar/>
      {/* <header className="navbar">
        <button
          className="brand"
          onClick={() => resetToBranches()}
          aria-label="Resource Hub home"
        >
          <span className="brand-icon">RH</span>
          <span>
            Resource <strong>Hub</strong>
            <small>Academic Resource Portal</small>
          </span>
        </button>

        <nav className="nav-links" aria-label="Main navigation">
          <button onClick={() => resetToBranches()}>Home</button>
          <a href="#curriculum">Browse Resources</a>
          <a href="#footer">Contact</a>
        </nav>
      </header> */}

      <main className="main-content" id="curriculum">
        <section className="hero">
          <p className="eyebrow">BGMIT · ACADEMIC RESOURCE PORTAL</p>
          <h1>All Your Semester Notes in One Place.</h1>
          <p>
            Find syllabus-related notes and study materials organized by
            scheme, branch, semester, subject, and module.
          </p>

          <div className="scheme-switch" aria-label="Select curriculum scheme">
            {["2018", "2025"].map((value) => (
              <button
                key={value}
                className={scheme === value ? "active" : ""}
                onClick={() => resetToBranches(value)}
                aria-pressed={scheme === value}
              >
                {value} Scheme
              </button>
            ))}
          </div>
        </section>

        <div className="breadcrumbs" aria-label="Breadcrumb">
          {breadcrumb.map((item, index) => (
            <span key={`${item}-${index}`}>
              {index > 0 && <span className="crumb-divider">/</span>}
              {item}
            </span>
          ))}
        </div>

        {selectedPDF ? (
          <section className="reader-section">
            {renderBackButton("Back to Module Resources", goBackFromReader)}

            <div className="section-heading reader-heading">
              <div>
                <p className="eyebrow">PDF READER</p>
                <h2>{selectedPDF.originalName}</h2>
                <p>Read your study material directly in Resource Hub.</p>
              </div>

              <a
                className="primary-button"
                href={`${API}/resources/${selectedPDF._id}/download`}
              >
                ↓ Download PDF
              </a>
            </div>

            <div className="pdf-frame">
              <iframe
                key={selectedPDF._id}
                title={`PDF: ${selectedPDF.originalName}`}
                src={`${API}/resources/${selectedPDF._id}/view`}
              />
            </div>
          </section>
        ) : !branch ? (
          <section>
            <div className="section-heading">
              <div>
                <p className="eyebrow">EXPLORE CURRICULUM</p>
                <h2>Select your academic path</h2>
                <p>Choose a branch or First Year to browse resources.</p>
              </div>
            </div>

            <div className="card-grid">
              {branches
                .filter((name) => curriculum[scheme]?.[name])
                .map((name) => (
                  <button
                    className="academic-card branch-card"
                    key={name}
                    onClick={() => openBranch(name)}
                  >
                    <span className="card-topline">
                      <span className="card-icon">▤</span>
                      <span className="scheme-tag">{scheme} Scheme</span>
                    </span>
                    <h3>{name}</h3>
                    <p>
                      {name === "First Year"
                        ? "Common first-year subjects"
                        : `${name} academic resources`}
                    </p>
                    <span className="card-action">Explore →</span>
                  </button>
                ))}
            </div>
          </section>
        ) : !semester ? (
          <section>
            {renderBackButton("All Branches", () => resetToBranches())}

            <div className="section-heading">
              <div>
                <p className="eyebrow">{scheme} SCHEME</p>
                <h2>{branch}</h2>
                <p>Select a semester to continue.</p>
              </div>
            </div>

            <div className="card-grid">
              {semesters.map((value) => (
                <button
                  className="academic-card"
                  key={value}
                  onClick={() => goToSubjects(value)}
                >
                  <span className="card-icon">▣</span>
                  <h3>Semester {value}</h3>
                  <p>
                    {Number(value) <= 2
                      ? "First-year curriculum"
                      : `Year ${Math.ceil(Number(value) / 2)}`}
                  </p>
                  <span className="card-action">View Subjects →</span>
                </button>
              ))}
            </div>
          </section>
        ) : !subject ? (
          <section>
            {renderBackButton("Semesters", () => {
              setSemester(null);
              setModule(null);
            })}

            <div className="section-heading">
              <div>
                <p className="eyebrow">SEMESTER {semester}</p>
                <h2>Subjects</h2>
                <p>Select a subject to explore its modules.</p>
              </div>
            </div>

            <div className="card-grid">
              {subjects.map((item) => (
                <button
                  className="academic-card subject-card"
                  key={item.name}
                  onClick={() => goToModules(item)}
                >
                  <span className="card-topline">
                    <span className="semester-tag">Sem {semester}</span>
                    <span className="subject-code">
                      {item.code || "Subject"}
                    </span>
                  </span>
                  <h3>{item.name}</h3>
                  <p>{item.modules.length} learning modules</p>
                  <span className="card-action">View Modules →</span>
                </button>
              ))}
            </div>
          </section>
        ) : !module ? (
          <section>
            {renderBackButton("Subjects", () => goToModules(null))}

            <div className="section-heading">
              <div>
                <p className="eyebrow">{subject.name}</p>
                <h2>Subject Modules</h2>
                <p>Choose a module to see its available PDFs.</p>
              </div>
            </div>

            <div className="module-list">
              {subject.modules.map((item) => (
                <button
                  className="module-row"
                  key={item.number}
                  onClick={() => openModule(item)}
                >
                  <span className="module-number">
                    {String(item.number).padStart(2, "0")}
                  </span>
                  <span className="module-copy">
                    <strong>{item.title}</strong>
                    <small>View notes and learning resources</small>
                  </span>
                  <span className="module-arrow">→</span>
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section>
            {renderBackButton("Back to Modules", () => {
              setModule(null);
              setResources([]);
              setError("");
            })}

            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  {branch} · SEMESTER {semester}
                </p>
                <h2>Module {module.number} Resources</h2>
                <p>{subject.name}</p>
              </div>
            </div>

            <div className="resource-toolbar">
              <label className="search-box">
                <span aria-hidden="true">⌕</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search resources..."
                  aria-label="Search resources"
                />
              </label>

              <span className="resource-count">
                {filteredResources.length} resources
              </span>
            </div>

            {loading && <p className="status-message">Loading resources...</p>}

            {error && (
              <p className="error-message" role="alert">
                {error}
              </p>
            )}

            {!loading && !error && filteredResources.length === 0 && (
              <div className="empty-state">
                <span className="empty-icon">▤</span>
                <h3>No resources available yet</h3>
                <p>
                  PDFs uploaded for this exact scheme, subject, and module
                  will appear here.
                </p>
              </div>
            )}

            <div className="resource-list">
              {filteredResources.map((resource) => (
                <article className="resource-row" key={resource._id}>
                  <div className="pdf-icon">PDF</div>

                  <div className="resource-info">
                    <h3>{resource.originalName}</h3>
                    <p>
                      {resource.resourceType || "Study Material"}
                      {resource.fileSize
                        ? ` · ${(resource.fileSize / 1024 / 1024).toFixed(2)} MB`
                        : ""}
                    </p>
                  </div>

                  <div className="resource-actions">
                    <button
                      className="secondary-button"
                      onClick={() => setSelectedPDF(resource)}
                    >
                      View PDF
                    </button>
                    <a
                      className="primary-button"
                      href={`${API}/resources/${resource._id}/download`}
                    >
                      Download
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="footer" id="footer">
        <div>
          <strong>Resource Hub</strong>
          <p>Centralized College Academic Resource Management System</p>
        </div>
        <a href="mailto:resourcehub@bgmit.edu.in">Contact</a>
        <a href="/admin/login">Admin Login</a>
      </footer>
    </div>
  );
}