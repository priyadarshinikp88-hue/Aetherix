export function getMoonPhase(date = new Date()) {
  const lp = 2551443;
  const now = date.getTime() / 1000;
  const newMoon = 592500;

  const phase = ((now - newMoon) % lp) / lp;

  if (phase < 0.03 || phase > 0.97) return "🌑 New Moon";
  if (phase < 0.22) return "🌒 Waxing Crescent";
  if (phase < 0.28) return "🌓 First Quarter";
  if (phase < 0.47) return "🌔 Waxing Gibbous";
  if (phase < 0.53) return "🌕 Full Moon";
  if (phase < 0.72) return "🌖 Waning Gibbous";
  if (phase < 0.78) return "🌗 Last Quarter";

  return "🌘 Waning Crescent";
}
