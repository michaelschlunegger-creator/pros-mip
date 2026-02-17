import { useEffect, useMemo, useRef, useState } from 'react';
import { ITEMS } from './data/items';
import { PAIRS } from './data/pairs';
import { getItemById, getPairsByCategory } from './utils/dataAccess';
import { buildValueAddedOutputs } from './utils/buildValueAddedOutputs';

const categories = [
  'Bearing',
  'Screw',
  'Valve',
  'Gasket',
  'Seal',
  'Pipe',
  'Flange',
  'Motor',
  'Pump',
  'Sensor',
  'Cable',
  'Fastener',
  'Other',
];

const completenessScore = (item) => {
  if (!item) return 0;
  const manufacturer = item.manufacturer ? 1 : 0;
  const standard = item.standard ? 1 : 0;
  const specs = Object.values(item.keySpecs || {}).filter((value) => value !== null && value !== '').length;
  return manufacturer + standard + specs;
};

const pickMasterRecord = (a, b) => {
  const scoreA = completenessScore(a);
  const scoreB = completenessScore(b);
  if (scoreA !== scoreB) return scoreA > scoreB ? a : b;
  if ((a.lifecycle?.criticalityScore ?? 0) !== (b.lifecycle?.criticalityScore ?? 0)) {
    return (a.lifecycle?.criticalityScore ?? 0) >= (b.lifecycle?.criticalityScore ?? 0) ? a : b;
  }
  const stdA = (a.standard || '').toUpperCase();
  const stdB = (b.standard || '').toUpperCase();
  if (stdA.includes('ISO') && !stdB.includes('ISO')) return a;
  if (stdB.includes('ISO') && !stdA.includes('ISO')) return b;
  return a;
};

function App() {
  const [category, setCategory] = useState('Screw');
  const comparisonRef = useRef(null);

  const pairsForCategory = useMemo(() => getPairsByCategory(PAIRS, category), [category]);
  const [pairId, setPairId] = useState('');

  useEffect(() => {
    setPairId(pairsForCategory[0]?.pairId || '');
  }, [category]);

  const selectedPair = useMemo(() => pairsForCategory.find((pair) => pair.pairId === pairId) || null, [pairsForCategory, pairId]);

  const itemA = selectedPair ? getItemById(ITEMS, selectedPair.aId) : null;
  const itemB = selectedPair ? getItemById(ITEMS, selectedPair.bId) : null;

  const [swapped, setSwapped] = useState(false);

  useEffect(() => {
    if (selectedPair && comparisonRef.current) {
      comparisonRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedPair]);

  const leftItem = swapped ? itemB : itemA;
  const rightItem = swapped ? itemA : itemB;
  const master = itemA && itemB ? pickMasterRecord(itemA, itemB) : null;
  const valueAdded = selectedPair && itemA && itemB ? buildValueAddedOutputs(selectedPair, itemA, itemB) : [];

  return (
    <div className="app-shell">
      <header className="top-nav">
        <div className="brand">PROSOL MIP</div>
      </header>

      <main className="content">
        <section className="panel wizard-panel">
          <h1>Duplicate Resolution Simulator</h1>
          <div className="step-grid">
            <label className="control-group">
              <span>Step A — Select Category</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="control-group">
              <span>Step B — Select 2 Almost Duplicates</span>
              <select value={pairId} onChange={(e) => setPairId(e.target.value)}>
                {pairsForCategory.map((pair) => {
                  const a = getItemById(ITEMS, pair.aId);
                  const b = getItemById(ITEMS, pair.bId);
                  return (
                    <option key={pair.pairId} value={pair.pairId}>
                      {a?.displayName} ↔ {b?.displayName} ({Math.round(pair.similarity * 100)}%)
                    </option>
                  );
                })}
              </select>
            </label>

            <div className="control-group action-group">
              <span>Step C — Resolve & Value-Add</span>
              <div className="btn-row">
                <button type="button" className="compare-button" onClick={() => setSwapped((prev) => !prev)} disabled={!selectedPair}>
                  Swap left/right
                </button>
                <button
                  type="button"
                  className="compare-button"
                  onClick={() => setPairId(pairsForCategory[0]?.pairId || '')}
                  disabled={!pairsForCategory.length}
                >
                  Try another pair
                </button>
              </div>
            </div>
          </div>
        </section>

        {selectedPair && leftItem && rightItem && (
          <section ref={comparisonRef} className="panel">
            <h2>Pair Comparison</h2>
            <div className="comparison-cards">
              <article className="item-card">
                <h3>{leftItem.displayName}</h3>
                <p><strong>Manufacturer:</strong> {leftItem.manufacturer || 'Unknown'}</p>
                <p><strong>Standard:</strong> {leftItem.standard || 'Unknown'}</p>
                <p><strong>Criticality:</strong> {leftItem.lifecycle.criticalityScore}/5</p>
              </article>
              <article className="item-card">
                <h3>{rightItem.displayName}</h3>
                <p><strong>Manufacturer:</strong> {rightItem.manufacturer || 'Unknown'}</p>
                <p><strong>Standard:</strong> {rightItem.standard || 'Unknown'}</p>
                <p><strong>Criticality:</strong> {rightItem.lifecycle.criticalityScore}/5</p>
              </article>
            </div>

            <div className="split-grid">
              <article className="sub-panel">
                <h3>What&apos;s different</h3>
                <ul>
                  {selectedPair.differences.map((diff) => (
                    <li key={diff}>{diff}</li>
                  ))}
                </ul>
              </article>
              <article className="sub-panel">
                <h3>Risk if we merge incorrectly</h3>
                <ul>
                  {selectedPair.riskNotes.map((risk) => (
                    <li key={risk}>{risk}</li>
                  ))}
                </ul>
              </article>
            </div>

            <article className="sub-panel master-panel">
              <h3>Recommended master record</h3>
              <p>{master?.displayName}</p>
              <p>Selection logic: completeness, criticality score, then common standard preference.</p>
            </article>
          </section>
        )}

        {valueAdded.length > 0 && (
          <section className="panel">
            <h2>Value-Added Information Service</h2>
            <div className="feature-grid">
              {valueAdded.map((feature) => (
                <article className="feature-card" key={feature.title}>
                  <h3>{feature.title}</h3>
                  <p>{feature.summary}</p>
                  <ul>
                    {feature.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
