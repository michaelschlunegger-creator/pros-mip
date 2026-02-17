function ComparisonCard({ material }) {
  return (
    <article className="comparison-card">
      <h2>{material.name}</h2>

      <ul className="spec-list">
        {material.specs.map((spec) => (
          <li key={spec}>{spec}</li>
        ))}
      </ul>

      <dl className="metric-grid">
        <div>
          <dt>Cost</dt>
          <dd>{material.cost}</dd>
        </div>
        <div>
          <dt>Sustainability Score</dt>
          <dd>{material.sustainability}</dd>
        </div>
      </dl>

      <button className="replace-button" type="button">
        Replace
      </button>
    </article>
  );
}

export default ComparisonCard;
