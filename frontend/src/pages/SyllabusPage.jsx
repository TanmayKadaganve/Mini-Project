
import { useState } from "react";
import Navbar from "../Navbar";
import syllabusData from "../data/syllabusData";

function SyllabusPage() {
  const [selectedScheme, setSelectedScheme] = useState("");
  const [expandedBranch, setExpandedBranch] = useState("");

  const branches = selectedScheme
    ? syllabusData[selectedScheme] || []
    : [];

  const handleSchemeChange = (scheme) => {
    setSelectedScheme(scheme);
    setExpandedBranch("");
  };

  const toggleSpecificPDFs = (branch) => {
    setExpandedBranch((previous) =>
      previous === branch ? "" : branch
    );
  };

  return (
    <>
      <Navbar />

      <main className="syllabus-page">
        <div className="syllabus-container">

          {/* Page Heading */}
          <div className="syllabus-header">
            <p className="eyebrow">RESOURCE HUB</p>
            <h1>Engineering Syllabus</h1>
            <p>
              Access branch-wise syllabus documents and
              year and stream-specific PDFs.
            </p>
          </div>

          {/* Scheme Selection */}
          <section className="scheme-selection">
            <h2>Select VTU Scheme</h2>
            <p>Choose your academic scheme to view the syllabus.</p>

            <div className="scheme-grid">
              {["2022", "2025"].map((scheme) => (
                <button
                  key={scheme}
                  type="button"
                  className={`scheme-card ${
                    selectedScheme === scheme ? "active" : ""
                  }`}
                  onClick={() => handleSchemeChange(scheme)}
                  aria-pressed={selectedScheme === scheme}
                >
                  <span>{scheme}</span>
                  <small>VTU SCHEME</small>
                </button>
              ))}
            </div>
          </section>

          {/* Branch Cards */}
          {selectedScheme && (
            <section className="syllabus-branches">
              <div className="syllabus-section-heading">
                <div>
                  <p className="eyebrow">{selectedScheme} SCHEME</p>
                  <h2>Available Branches</h2>
                </div>
                <span>{branches.length} Branches</span>
              </div>

              <div className="syllabus-card-grid">
                {branches.map((item) => (
                  <article
                    className="syllabus-card"
                    key={item.branch}
                  >
                    <div className="syllabus-card-content">
                      <span className="syllabus-badge">
                        CURRICULUM
                      </span>

                      <h3>{item.branch}</h3>
                      <p>{item.description}</p>
                    </div>

                    <div className="syllabus-card-actions">

                      {/* Main Syllabus */}
                      {item.mainSyllabus ? (
                        <a
                          className="syllabus-main-button"
                          href={item.mainSyllabus}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          ↓ View Main Syllabus
                        </a>
                      ) : (
                        <button
                          type="button"
                          className="syllabus-main-button"
                          disabled
                        >
                          Main Syllabus Not Available
                        </button>
                      )}

                      {/* Specific PDFs Dropdown */}
                      {/* <button
                        type="button"
                        className="syllabus-dropdown-button"
                        onClick={() =>
                          toggleSpecificPDFs(item.branch)
                        }
                        aria-expanded={
                          expandedBranch === item.branch
                        }
                      >
                        Year & Stream Specific PDFs
                        <span>
                          {expandedBranch === item.branch ? "▴" : "▾"}
                        </span>
                      </button> */}

                      {expandedBranch === item.branch && (
                        <div className="syllabus-specific-list">
                          {item.specificPDFs?.length > 0 ? (
                            item.specificPDFs.map((pdf, index) => (
                              <a
                                key={`${pdf.title}-${index}`}
                                href={pdf.url || undefined}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`syllabus-specific-link ${
                                  !pdf.url ? "disabled" : ""
                                }`}
                                onClick={(event) => {
                                  if (!pdf.url) {
                                    event.preventDefault();
                                  }
                                }}
                                aria-disabled={!pdf.url}
                              >
                                <span>{pdf.title}</span>
                                <span>↗</span>
                              </a>
                            ))
                          ) : (
                            <p className="syllabus-empty-message">
                              No specific PDFs added yet.
                            </p>
                          )}
                        </div>
                      )}

                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
    </>
  );
}

export default SyllabusPage;
