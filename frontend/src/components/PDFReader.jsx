
function PDFReader({ selectedPDF, API, renderBackButton, goBackFromReader }) {
  return (
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
  );
}

export default PDFReader;
