import FeatureAnalysis from './FeatureAnalysis';

const featureNames = [
  'Functional Substitution Engine',
  'Over-Specification Detection',
  'Application-Based Intelligence',
  'Lifecycle Cost Optimization',
  'Inventory Consolidation Impact',
  'Sustainability Impact Analysis',
  'Risk Assessment Engine',
  'Compliance & Standards Mapping',
  'Cross-Brand Equivalency',
  'Tolerance & Fit Validation',
  'Failure Mode Risk Comparison',
  'Procurement Leverage Index',
  'Digital Master Data Improvement Suggestion',
];

function makeFeatureDetail(name, materialA, materialB, score) {
  return {
    identical: `${materialA.fullName} and ${materialB.fullName} share category ${materialA.category} with aligned core fit indicators.`,
    differs: `${materialA.fullName} varies from ${materialB.fullName} across grade/coating/brand or rating attributes that affect interchange behavior.`,
    impact:
      score >= 85
        ? `${name} flags a high duplicate probability, enabling immediate part rationalization and lower sourcing complexity.`
        : `${name} indicates partial equivalency, so uncontrolled swapping could increase validation workload and service risk.`,
    action:
      score >= 85
        ? `Standardize on one master record between ${materialA.fullName} and ${materialB.fullName}, then phase out the duplicate SKU after pilot confirmation.`
        : `Run controlled qualification for ${materialA.fullName} versus ${materialB.fullName}, define approved use-cases, and update governance rules.`,
  };
}

function IntelligencePanel({ materialA, materialB, score }) {
  if (!materialA || !materialB || score < 70) return null;

  return (
    <details className="panel" open>
      <summary>PROSOL VALUE-ADDED INTELLIGENCE ANALYSIS</summary>
      <div className="feature-grid">
        {featureNames.map((name) => (
          <FeatureAnalysis key={name} title={name} detail={makeFeatureDetail(name, materialA, materialB, score)} />
        ))}
      </div>
    </details>
  );
}

export default IntelligencePanel;
