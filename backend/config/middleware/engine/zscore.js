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
    throw new Error('Total Active (totalAssets) nu poate fi 0');
  }
  if (!totalLiabilities || totalLiabilities === 0) {
    throw new Error('Total Datorii (totalLiabilities) nu poate fi 0');
  }

  const X1 = workingCapital    / totalAssets;
  const X2 = retainedEarnings  / totalAssets;
  const X3 = ebit              / totalAssets;
  const X4 = marketValueEquity / totalLiabilities;
  const X5 = revenue           / totalAssets;

  const Z = (WEIGHTS.X1 * X1)
           + (WEIGHTS.X2 * X2)
           + (WEIGHTS.X3 * X3)
           + (WEIGHTS.X4 * X4)
           + (WEIGHTS.X5 * X5);

  let zone, riskLevel, recommendation;
  if (Z > THRESHOLDS.SAFE) {
    zone           = 'SAFE';
    riskLevel      = 'Scăzut';
    recommendation = 'Compania este financiar sănătoasă. Continuați monitorizarea periodică.';
  } else if (Z >= THRESHOLDS.GREY) {
    zone           = 'GREY';
    riskLevel      = 'Mediu';
    recommendation = 'Zona de incertitudine. Monitorizare atentă și măsuri preventive recomandate.';
  } else {
    zone           = 'DANGER';
    riskLevel      = 'Ridicat';
    recommendation = 'Risc ridicat de insolvență. Acțiuni imediate necesare.';
  }

  return {
    score: parseFloat(Z.toFixed(4)),
    zone,
    riskLevel,
    recommendation,
    breakdown: {
      X1: parseFloat(X1.toFixed(6)),
      X2: parseFloat(X2.toFixed(6)),
      X3: parseFloat(X3.toFixed(6)),
      X4: parseFloat(X4.toFixed(6)),
      X5: parseFloat(X5.toFixed(6)),
    },
    weighted: {
      X1: parseFloat((WEIGHTS.X1 * X1).toFixed(6)),
      X2: parseFloat((WEIGHTS.X2 * X2).toFixed(6)),
      X3: parseFloat((WEIGHTS.X3 * X3).toFixed(6)),
      X4: parseFloat((WEIGHTS.X4 * X4).toFixed(6)),
      X5: parseFloat((WEIGHTS.X5 * X5).toFixed(6)),
    },
    thresholds: THRESHOLDS,
  };
}

module.exports = { calculateZScore, WEIGHTS, THRESHOLDS };
