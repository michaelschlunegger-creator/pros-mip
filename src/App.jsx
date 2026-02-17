import { useMemo, useState } from 'react';
import { MATERIALS } from './data/materials';
import { compareMaterials } from './utils/similarityEngine';
import MaterialSelector from './components/MaterialSelector';
import DifferencesTable from './components/DifferencesTable';
import IntelligencePanel from './components/IntelligencePanel';

const categories = [
  'Ball Bearings',
  'Screws',
  'Valves',
  'Bushings',
  'Gaskets',
  'Hydraulic Fittings',
  'Electric Motors',
  'Seals',
  'Couplings',
  'Fasteners (Other)',
];

function App() {
  const [category, setCategory] = useState('Screws');
  const [materialAId, setMaterialAId] = useState('');
  const [materialBId, setMaterialBId] = useState('');
  const [comparison, setComparison] = useState(null);

  const categoryMaterials = useMemo(
    () => MATERIALS.filter((item) => item.category === category),
    [category],
  );

  const materialA = categoryMaterials.find((m) => m.id === materialAId) || null;
  const materialB = categoryMaterials.find((m) => m.id === materialBId) || null;

  const onCategoryChange = (value) => {
    setCategory(value);
    setMaterialAId('');
    setMaterialBId('');
    setComparison(null);
  };

  const onCompare = () => {
    setComparison(compareMaterials(materialA, materialB));
  };

  return (
    <div className="app-shell">
      <header className="top-nav">
        <div className="brand">PROSOL MIP</div>
      </header>

      <main className="content">
        <section className="panel">
          <h1>PROSOL MIP – Duplicate Resolution Simulator</h1>
          <div className="controls-grid">
            <label className="control-group">
              <span>Main Category</span>
              <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <MaterialSelector
              label="Material A"
              options={categoryMaterials}
              value={materialAId}
              onChange={setMaterialAId}
              disabled={!categoryMaterials.length}
            />
            <MaterialSelector
              label="Material B"
              options={categoryMaterials}
              value={materialBId}
              onChange={setMaterialBId}
              disabled={!categoryMaterials.length}
            />
          </div>
          <button className="compare-button" onClick={onCompare} disabled={!materialA || !materialB || materialAId === materialBId}>
            Compare
          </button>
        </section>

        {comparison && (
          <section className="panel score-panel">
            <p>Duplicate Similarity Score: <strong>{comparison.score}%</strong></p>
            <span className="score-badge">{comparison.score >= 70 ? 'Potential Duplicate' : 'Distinct Items'}</span>
          </section>
        )}

        <DifferencesTable materialA={materialA} materialB={materialB} />
        <IntelligencePanel materialA={materialA} materialB={materialB} score={comparison?.score ?? 0} />
      </main>
    </div>
  );
}

export default App;
