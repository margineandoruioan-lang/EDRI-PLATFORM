const WEIGHTS = {
  X1: 1.2,
  X2: 1.4,
  X3: 3.3,
  X4: 0.6,
  X5: 1.0,
};

const THRESHOLDS = {
  SAFE: 2.99,
  GREY: 1.81,
};

function calculateZScore(financials) {
  const {
    workingCapital,
    totalAssets,
    retainedEarnings,
    ebit,
    marketValueEquity,
    totalLiabilities,
    revenue,
  } = financials;

  if (!totalAssets || totalAssets === 0) {
    throw new Error('Total Active nu poate fi 0');
  }
  if (!totalLiabilities || totalLiabilities === 0) {
    throw new Error('Total Datorii nu poate fi 0');
  }

  const X1 = workingCapital / totalAssets;
  const X2 = retainedEarnings / totalAssets;
  const X3 = ebit / totalAssets;
  const X4 = marketValueEquity / totalLiabilities;
  const X5 = revenue / totalAssets;

  const Z = (1.2*X1) + (1.4*X2) + (3.3*X3) + (0.6*X4) + (1.0*X5);

  let zone, riskLevel, recommendation;
  if (Z > 2.99) {
    zone = 'SAFE';
    riskLevel = 'Scazut';
    recommendation = 'Compania este financiar sanatoasa.';
  } else if (Z >= 1.81) {
    zone = 'GREY';
    riskLevel = 'Mediu';
    recommendation = 'Zona de incertitudine.';
  } else {
    zone = 'DANGER';
    riskLevel = 'Ridicat';
    recommendation = 'Risc ridicat de insolventa.';
  }

  return {
    score: parseFloat(Z.toFixed(4)),
    zone,
    riskLevel,
    recommendation,
    breakdown: { X1, X2, X3, X4, X5 },
  };
}

module.exports = { calculateZScore };
