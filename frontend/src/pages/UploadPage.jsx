
import { useState } from "react";
import { getSubjects } from "../data/curriculum";
import "./UploadPage.css";

const resourceTypes = [
  "Study Material",
  "Notes",
  "Question Bank",
  "Lab Manual",
  "Other",
];

function UploadPage() {
  const facultyBranch = localStorage.getItem("facultyBranch") || "";

  const [formData, setFormData] = useState({
    scheme: "2025",
    semester: "",
    subject: "",
    module: "",
    resourceType: "Study Material",
  });

  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Get subjects from the shared curriculum data
  const subjects = getSubjects(
    formData.scheme,
    facultyBranch,
    formData.semester
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,

      // Reset subject and module when scheme or semester changes
      ...(name === "scheme" || name === "semester"
        ? { subject: "", module: "" }
        : {}),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setMessage("");
    setPdf(null);

    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setMessageType("error");
      setMessage("Please select a PDF file only.");
      e.target.value = "";
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setMessageType("error");
      setMessage("PDF size must not exceed 20 MB.");
      e.target.value = "";
      return;
    }

    setPdf(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    const token = localStorage.getItem("facultyToken");

    if (!token) {
      setMessageType("error");
      setMessage("Please log in as faculty first.");
      return;
    }

    if (!subjects.some((item) => item.name === formData.subject)) {
      setMessageType("error");
      setMessage("Please select a valid subject.");
      return;
    }

    if (!pdf) {
      setMessageType("error");
      setMessage("Please select a PDF file.");
      return;
    }

    const data = new FormData();

    data.append("scheme", formData.scheme);
    data.append("semester", formData.semester);
    data.append("subject", formData.subject.trim());
    data.append("module", formData.module);
    data.append("resourceType", formData.resourceType);
    data.append("pdf", pdf);

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/resources/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Upload failed.");
      }

      setMessageType("success");
      setMessage(result.message || "PDF uploaded successfully.");

      setFormData({
        scheme: "2025",
        semester: "",
        subject: "",
        module: "",
        resourceType: "Study Material",
      });

      setPdf(null);
      e.target.reset();

    } catch (error) {
      setMessageType("error");
      setMessage(error.message || "Unable to upload PDF.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="upload-page">
      <div className="upload-container">

        <div className="upload-heading">
          <span className="upload-eyebrow">FACULTY DASHBOARD</span>
          <h1>Upload Academic Resource</h1>
          <p>
            Add study materials and academic resources for your students.
          </p>
        </div>

        <form className="upload-card" onSubmit={handleSubmit}>

          <section className="upload-section">
            <div className="section-heading">
              <span className="section-number">01</span>
              <div>
                <h2>Academic Information</h2>
                <p>Select the academic details for this resource.</p>
              </div>
            </div>

            <div className="upload-grid">

              <div className="upload-field">
                <label htmlFor="scheme">VTU Scheme</label>
                <select
                  id="scheme"
                  name="scheme"
                  value={formData.scheme}
                  onChange={handleChange}
                  required
                >
                  <option value="2022">2022 Scheme</option>
                  <option value="2025">2025 Scheme</option>
                </select>
              </div>

              <div className="upload-field">
                <label htmlFor="branch">Branch</label>
                <input
                  id="branch"
                  type="text"
                  value={facultyBranch}
                  readOnly
                />
                <small>
                  Automatically assigned from faculty login.
                </small>
              </div>

              <div className="upload-field">
                <label htmlFor="semester">Semester</label>
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              <div className="upload-field">
                <label htmlFor="subject">Subject Name</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={!formData.semester || subjects.length === 0}
                  required
                >
                  <option value="">
                    {!formData.semester
                      ? "Select semester first"
                      : subjects.length === 0
                      ? "No subjects available"
                      : "Select Subject"}
                  </option>

                  {subjects.map((subject) => (
                    <option
                      key={`${subject.code}-${subject.name}`}
                      value={subject.name}
                    >
                      {subject.code
                        ? `${subject.code} - ${subject.name}`
                        : subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="upload-field">
                <label htmlFor="module">Module</label>
                <select
                  id="module"
                  name="module"
                  value={formData.module}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Module</option>
                  {[1, 2, 3, 4, 5].map((mod) => (
                    <option key={mod} value={mod}>
                      Module {mod}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </section>

          <div className="upload-divider" />

          <section className="upload-section">
            <div className="section-heading">
              <span className="section-number">02</span>
              <div>
                <h2>Resource Details</h2>
                <p>Choose the resource type and select your PDF.</p>
              </div>
            </div>

            <div className="upload-field resource-type-field">
              <label htmlFor="resourceType">Resource Type</label>
              <select
                id="resourceType"
                name="resourceType"
                value={formData.resourceType}
                onChange={handleChange}
                required
              >
                {resourceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="upload-field">
              <label htmlFor="pdf">Upload PDF File</label>

              <label className="pdf-drop-area" htmlFor="pdf">
                <span className="pdf-icon">PDF</span>
                <strong>
                  {pdf ? pdf.name : "Choose a PDF file"}
                </strong>
                <span>
                  {pdf
                    ? `${(pdf.size / (1024 * 1024)).toFixed(2)} MB`
                    : "Click here to browse your files"}
                </span>
                <small>PDF only · Maximum file size 20 MB</small>
              </label>

              <input
                id="pdf"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                hidden
              />
            </div>
          </section>

          {message && (
            <div
              className={`upload-message ${messageType}`}
              role="alert"
            >
              {message}
            </div>
          )}

          <div className="upload-actions">
            <button
              type="submit"
              className="upload-submit"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Resource"}
            </button>
          </div>

        </form>

        <p className="upload-security-note">
          <span>🔒</span>
          Your resource will be available to students in your branch.
        </p>

      </div>
    </main>
  );
}

export default UploadPage;
