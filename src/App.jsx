import { useEffect, useMemo, useRef, useState } from 'react';
import { MATERIALS, PAIRS } from './data';

const MODULE_TITLES = [
  'Functional Substitution Engine',
  'Over-Specification Detection',
  'Application-Based Intelligence',
  'Standards & Compliance Normalizer',
  'Unit & Format Harmonization',
  'Manufacturer & Part Number Enrichment',
  'Interchangeability / Fit Check',
  'Risk Scoring for Wrong Merge',
  'Maintenance & Repair Guidance',
  'Total Cost of Ownership (TCO) Hints',
  'Preferred Vendor / Availability Hint',
  'BOM (Bill of Materials) Impact Preview',
  'Data Quality Checklist & Autofix Suggestions',
];

const CATEGORIES = [
  'Screws',
  'Ball Bearings',
  'Valves',
  'Gaskets',
  'Bushings',
  'Hydraulic Fittings',
  'Motors',
  'Seals',
  'Couplings',
  'Other',
];

function getItemById(id) {
  return MATERIALS.find((m) => m.id === id) || null;
}

function findPair(aId, bId, category) {
  return PAIRS.find(
    (p) => p.category === category && ((p.aId === aId && p.bId === bId) || (p.aId === bId && p.bId === aId)),
  );
}

function fallbackSimilarity(a, b) {
  if (!a || !b || a.category !== b.category) return 0;
  const keys = Array.from(new Set([...Object.keys(a.keySpecs || {}), ...Object.keys(b.keySpecs || {})]));
  if (!keys.length) return 0;
  let same = 0;
  keys.forEach((k) => {
    if (String(a.keySpecs?.[k] ?? '').toLowerCase() === String(b.keySpecs?.[k] ?? '').toLowerCase()) same += 1;
  });
  const base = Math.round((same / keys.length) * 70);
  const standard = a.standard && b.standard && a.standard === b.standard ? 15 : 0;
  const brand = a.brand && b.brand && a.brand === b.brand ? 5 : 0;
  const sustain = Math.abs(a.sustainabilityScore - b.sustainabilityScore) <= 8 ? 10 : 0;
  return Math.min(100, base + standard + brand + sustain);
}

function buildComparison(a, b, category) {
  const pair = findPair(a.id, b.id, category);
  const score = pair ? Math.round(pair.similarity * 100) : fallbackSimilarity(a, b);
  const identical = [];
  const different = [];

  if (a.standard === b.standard) identical.push(`Standard: ${a.standard || 'Unknown'}`);
  else different.push(`Standard: ${a.standard || 'Unknown'} vs ${b.standard || 'Unknown'}`);

  if (a.brand === b.brand) identical.push(`Brand: ${a.brand || 'Unknown'}`);
  else different.push(`Brand: ${a.brand || 'Unknown'} vs ${b.brand || 'Unknown'}`);

  const fields = Array.from(new Set([...Object.keys(a.keySpecs || {}), ...Object.keys(b.keySpecs || {})]));
  fields.forEach((k) => {
    const av = a.keySpecs?.[k] ?? '—';
    const bv = b.keySpecs?.[k] ?? '—';
    if (String(av) === String(bv)) identical.push(`${k}: ${av}`);
    else different.push(`${k}: ${av} vs ${bv}`);
  });

  if (a.cost === b.cost) identical.push(`Cost: ${a.cost}`);
  else different.push(`Cost: ${a.cost} vs ${b.cost}`);

  if (a.sustainabilityScore === b.sustainabilityScore) identical.push(`Sustainability Score: ${a.sustainabilityScore}`);
  else different.push(`Sustainability Score: ${a.sustainabilityScore} vs ${b.sustainabilityScore}`);

  const recommendation =
    score >= 85
      ? 'Recommendation: Merge candidates are strong. Consolidate after quick engineering confirmation.'
      : score >= 70
        ? 'Recommendation: Needs validation. Keep both until fit and compliance checks are complete.'
        : 'Recommendation: Keep separate. Similarity is too low for safe merge.';

  const riskNotes = pair?.riskNotes || ['Evaluate fit, pressure, material, and maintenance impact before merge.'];

  const modules = MODULE_TITLES.map((title) => ({
    title,
    identical: `${a.fullName} and ${b.fullName} share category ${a.category} with overlap score ${score}%.`,
    differs: different.slice(0, 3).join(' | ') || 'No critical differences detected.',
    impact: score >= 80
      ? `High duplicate likelihood can reduce inventory complexity if ${title} checks pass.`
      : `Partial overlap indicates controlled substitution only after validation under ${title}.`,
    action: score >= 80
      ? `Promote one master record between "${a.fullName}" and "${b.fullName}" and map alternate references.`
      : `Retain both records, run qualification tests, and enrich metadata before any merge decision.`,
  }));

  return { score, identical, different, recommendation, pair, riskNotes, modules };
}

function App() {
  const [category, setCategory] = useState('Screws');
  const [aId, setAId] = useState('');
  const [bId, setBId] = useState('');
  const [result, setResult] = useState(null);
  const outputRef = useRef(null);

  const materials = useMemo(
    () => MATERIALS.filter((m) => m.category === category || (category === 'Other' && !CATEGORIES.slice(0, 9).includes(m.category))),
    [category],
  );

  useEffect(() => {
    setAId(materials[0]?.id || '');
    setBId(materials[1]?.id || materials[0]?.id || '');
    setResult(null);
  }, [category]);

  const itemA = useMemo(() => getItemById(aId), [aId]);
  const itemB = useMemo(() => getItemById(bId), [bId]);

  const onCompare = () => {
    if (!itemA || !itemB || itemA.id === itemB.id) return;
    const computed = buildComparison(itemA, itemB, category === 'Other' ? itemA.category : category);
    setResult(computed);
  };

  useEffect(() => {
    if (result && outputRef.current) outputRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [result]);

  return (
    <div className="app-shell">
      <header className="top-nav">
        <div className="brand">PROSOL MIP</div>
      </header>

      <main className="content">
        <section className="panel">
          <h1>Duplicate Resolution Simulator</h1>
          <div className="step-grid">
            <label className="control-group">
              <span>Step A — Category</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>

            <label className="control-group">
              <span>Step B — Material A</span>
              <select value={aId} onChange={(e) => setAId(e.target.value)}>
                {materials.map((m) => <option key={m.id} value={m.id}>{m.fullName}</option>)}
              </select>
            </label>

            <label className="control-group">
              <span>Step B — Material B</span>
              <select value={bId} onChange={(e) => setBId(e.target.value)}>
                {materials.map((m) => <option key={m.id} value={m.id}>{m.fullName}</option>)}
              </select>
            </label>
          </div>
          <div className="action-row" style={{ marginTop: '.8rem' }}>
            <button className="compare-cta" onClick={onCompare} disabled={!itemA || !itemB || aId === bId}>Compare</button>
          </div>
        </section>

        {result && (
          <section className="panel" ref={outputRef}>
            <div className="score">Similarity Score: {result.score}%</div>

            <div className="cards" style={{ marginTop: '.8rem' }}>
              <article className="card">
                <h3>{itemA.fullName}</h3>
                <p><strong>Standard:</strong> {itemA.standard}</p>
                <p><strong>Brand:</strong> {itemA.brand}</p>
                <p><strong>Cost:</strong> ${itemA.cost}</p>
                <p><strong>Sustainability:</strong> {itemA.sustainabilityScore}</p>
              </article>
              <article className="card">
                <h3>{itemB.fullName}</h3>
                <p><strong>Standard:</strong> {itemB.standard}</p>
                <p><strong>Brand:</strong> {itemB.brand}</p>
                <p><strong>Cost:</strong> ${itemB.cost}</p>
                <p><strong>Sustainability:</strong> {itemB.sustainabilityScore}</p>
              </article>
            </div>

            <div className="cards" style={{ marginTop: '.8rem' }}>
              <article className="list-box ok">
                <h3>What is identical</h3>
                <ul>{result.identical.map((v) => <li key={v}>{v}</li>)}</ul>
              </article>
              <article className="list-box bad">
                <h3>What differs</h3>
                <ul>{result.different.map((v) => <li key={v}>{v}</li>)}</ul>
              </article>
            </div>

            <article className="card recommend" style={{ marginTop: '.8rem' }}>
              <h3>Recommendation summary</h3>
              <p>{result.recommendation}</p>
              <p><strong>Risk notes:</strong> {result.riskNotes.join(' | ')}</p>
              {result.pair && <p><strong>Precomputed pair match:</strong> {result.pair.pairId} ({Math.round(result.pair.similarity * 100)}%)</p>}
            </article>

            <details style={{ marginTop: '.8rem' }} open>
              <summary>PROSOL Value-Added Intelligence Service</summary>
              <div className="feature-grid">
                {result.modules.map((m) => (
                  <article className="feature-card" key={m.title}>
                    <h4>{m.title}</h4>
                    <p><strong>What is identical:</strong> {m.identical}</p>
                    <p><strong>What differs:</strong> {m.differs}</p>
                    <p><strong>Business impact:</strong> {m.impact}</p>
                    <p><strong>Recommended action:</strong> {m.action}</p>
                  </article>
                ))}
              </div>
            </details>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
