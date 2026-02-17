function FeatureAnalysis({ title, detail }) {
  return (
    <article className="feature-card">
      <h4>{title}</h4>
      <ul>
        <li>
          <strong>What is identical:</strong> {detail.identical}
        </li>
        <li>
          <strong>What differs:</strong> {detail.differs}
        </li>
        <li>
          <strong>Business impact:</strong> {detail.impact}
        </li>
        <li>
          <strong>Recommended action:</strong> {detail.action}
        </li>
      </ul>
    </article>
  );
}

export default FeatureAnalysis;
