export function computeWaterStatus(temp: number, ph: number, tds: number) {
  let score = 0;

  if (ph >= 6.5 && ph <= 8.5) score += 2;
  else if (ph >= 6 && ph <= 9) score += 1;

  if (tds <= 300) score += 2;
  else if (tds <= 600) score += 1;

  if (temp >= 24 && temp <= 30) score += 2;
  else if (temp >= 20 && temp <= 35) score += 1;

  if (score >= 5) return "Excellent";
  if (score >= 4) return "Good";
  if (score >= 3) return "Fair";
  if (score >= 2) return "Poor";
  return "Critical";
}
