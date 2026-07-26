const MONTH_MAP: Record<string, number> = {
  jan: 0, janeiro: 0,
  fev: 1, fevereiro: 1, feb: 1,
  mar: 2, marco: 2, março: 2,
  abr: 3, abril: 3, apr: 3,
  mai: 4, maio: 4, may: 4,
  jun: 5, junho: 5,
  jul: 6, julho: 6,
  ago: 7, agosto: 7, aug: 7,
  set: 8, setembro: 8, sep: 8,
  out: 9, outubro: 9, oct: 9,
  nov: 10, novembro: 10,
  dez: 11, dezembro: 11, dec: 11
};

export function parseNewsDate(dateStr: string | undefined | null): number {
  if (!dateStr) return 0;
  
  const cleanStr = dateStr.toLowerCase().replace(/,/g, '').replace(/\bde\b/g, '').trim();
  const parts = cleanStr.split(/\s+/);

  if (parts.length >= 3) {
    let day = parseInt(parts[0], 10);
    if (isNaN(day) || day < 1 || day > 31) day = 1;

    const monthStr = parts[1];
    let month = 0;
    for (const [key, val] of Object.entries(MONTH_MAP)) {
      if (monthStr.startsWith(key)) {
        month = val;
        break;
      }
    }

    const year = parseInt(parts[2], 10) || 2026;
    return new Date(year, month, day).getTime();
  }

  const directTimestamp = Date.parse(dateStr);
  return isNaN(directTimestamp) ? 0 : directTimestamp;
}
