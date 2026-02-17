const normalize = (value) => (value ?? '').toString().trim().toLowerCase();

const temperatureOverlap = (a, b) => {
  const parse = (range) => {
    if (!range) return null;
    const match = range.match(/(-?\d+)\.\.(-?\d+)/);
    return match ? { min: Number(match[1]), max: Number(match[2]) } : null;
  };
  const ra = parse(a);
  const rb = parse(b);
  if (!ra || !rb) return false;
  const overlap = Math.min(ra.max, rb.max) - Math.max(ra.min, rb.min);
  return overlap >= 30;
};

export function compareMaterials(materialA, materialB) {
  if (!materialA || !materialB) {
    return { score: 0, identicalFields: [], differences: [] };
  }

  if (materialA.category !== materialB.category) {
    return {
      score: 0,
      identicalFields: [],
      differences: [{ field: 'category', a: materialA.category, b: materialB.category }],
    };
  }

  let score = 0;
  const identicalFields = [];
  const differences = [];

  const coreDimensionMatch =
    normalize(materialA.diameter) === normalize(materialB.diameter) &&
    normalize(materialA.length) === normalize(materialB.length) &&
    normalize(materialA.size) === normalize(materialB.size);

  const pushCompare = (field, points) => {
    if (normalize(materialA[field]) && normalize(materialA[field]) === normalize(materialB[field])) {
      score += points;
      identicalFields.push(field);
    } else {
      differences.push({ field, a: materialA[field], b: materialB[field] });
    }
  };

  if (coreDimensionMatch) {
    score += 40;
    identicalFields.push('coreDimensions');
  } else {
    differences.push({
      field: 'coreDimensions',
      a: `${materialA.diameter ?? '-'} / ${materialA.length ?? '-'} / ${materialA.size ?? '-'}`,
      b: `${materialB.diameter ?? '-'} / ${materialB.length ?? '-'} / ${materialB.size ?? '-'}`,
    });
  }

  pushCompare('standard', 15);
  pushCompare('materialGrade', 15);

  const loadOrPressureMatch =
    (normalize(materialA.loadRating) && normalize(materialA.loadRating) === normalize(materialB.loadRating)) ||
    (normalize(materialA.pressureRating) && normalize(materialA.pressureRating) === normalize(materialB.pressureRating));

  if (loadOrPressureMatch) {
    score += 10;
    identicalFields.push('loadOrPressure');
  } else {
    differences.push({
      field: 'loadOrPressure',
      a: `${materialA.loadRating ?? materialA.pressureRating ?? '-'}`,
      b: `${materialB.loadRating ?? materialB.pressureRating ?? '-'}`,
    });
  }

  pushCompare('coating', 5);
  pushCompare('brand', 5);

  if (temperatureOverlap(materialA.temperatureRange, materialB.temperatureRange)) {
    score += 10;
    identicalFields.push('temperatureRange');
  } else {
    differences.push({ field: 'temperatureRange', a: materialA.temperatureRange, b: materialB.temperatureRange });
  }

  return { score: Math.min(100, Math.max(0, Math.round(score))), identicalFields, differences };
}
