const fields = [
  'fullName',
  'standard',
  'diameter',
  'length',
  'size',
  'materialGrade',
  'coating',
  'tolerance',
  'loadRating',
  'pressureRating',
  'temperatureRange',
  'brand',
  'cost',
  'sustainabilityScore',
];

function DifferencesTable({ materialA, materialB }) {
  if (!materialA || !materialB) return null;

  return (
    <section className="panel">
      <h2>Attribute Comparison</h2>
      <div className="table-wrap">
        <table className="diff-table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Material A</th>
              <th>Material B</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field) => {
              const a = materialA[field] ?? '-';
              const b = materialB[field] ?? '-';
              const same = String(a) === String(b);
              return (
                <tr key={field} className={same ? 'same' : 'diff'}>
                  <td>{field}</td>
                  <td>{a}</td>
                  <td>{b}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default DifferencesTable;
