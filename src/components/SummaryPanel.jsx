function SummaryPanel() {
  return (
    <section className="summary-panel" aria-label="Comparison summary">
      <h2>Summary</h2>
      <div className="summary-grid">
        <article>
          <p className="label">Selected Material</p>
          <p className="value">Aerospace Aluminum A220</p>
        </article>
        <article>
          <p className="label">Total Cost</p>
          <p className="value">$1,420 / batch</p>
        </article>
        <article>
          <p className="label">CO2 Impact</p>
          <p className="value">Moderate · 2.8 tCO₂e</p>
        </article>
      </div>
    </section>
  );
}

export default SummaryPanel;
