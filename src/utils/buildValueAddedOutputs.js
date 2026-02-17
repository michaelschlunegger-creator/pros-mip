const featureTitles = [
  'Functional Substitution Engine',
  'Over-Specification Detection',
  'Application-Based Intelligence',
  'Standards & Compliance Normalizer',
  'Unit & Format Harmonization',
  'Manufacturer & Part Number Enrichment',
  'Interchangeability / Fit Check (basic rules)',
  'Risk Scoring for Wrong Merge',
  'Maintenance & Repair Guidance (basic)',
  'Total Cost of Ownership (TCO) Hints',
  'Preferred Vendor / Availability Hint',
  'BOM (Bill of Materials) Impact Preview',
  'Data Quality Checklist & Autofix Suggestions',
];

const scoreRisk = (pair) => {
  const risk = pair.riskNotes.length + pair.differences.length + Math.round((1 - pair.similarity) * 10);
  return Math.min(10, Math.max(1, risk));
};

export const buildValueAddedOutputs = (pair, itemA, itemB) => {
  if (!pair || !itemA || !itemB) return [];

  const risk = scoreRisk(pair);
  const sameStandard = (itemA.standard || '').toLowerCase() === (itemB.standard || '').toLowerCase();
  const leadA = itemA.lifecycle?.leadTimeDays ?? 999;
  const leadB = itemB.lifecycle?.leadTimeDays ?? 999;
  const betterAvailability = leadA <= leadB ? itemA : itemB;

  return featureTitles.map((title, index) => ({
    title,
    summary: `${title} evaluated for ${itemA.displayName} versus ${itemB.displayName}.`,
    bullets: [
      `Similarity baseline: ${(pair.similarity * 100).toFixed(0)}% with ${pair.differences.length} recorded non-identical attributes.`,
      sameStandard
        ? `Both records align to ${itemA.standard || 'a known standard'}; consolidation workflow can be faster.`
        : `Standards differ (${itemA.standard || 'Unknown'} vs ${itemB.standard || 'Unknown'}), so approvals should include compliance review.`,
      index % 2 === 0
        ? `Preferred source hint: ${betterAvailability.shortName} due to lead time ${betterAvailability.lifecycle.leadTimeDays} days.`
        : `Risk index for incorrect merge: ${risk}/10 based on fit, rating, and metadata differences.`,
    ],
  }));
};
