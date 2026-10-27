const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // IST = UTC+5:30, DST nahi hota

// Ek Date jiske UTC getters India ka wall-clock dikhate hain
const istNow = () => new Date(Date.now() + IST_OFFSET_MS);

// "Hukamnama ka din" subah 4 baje IST se badalta hai, raat 12 baje se nahi
export function hukamDay(): string {
  return new Date(Date.now() + IST_OFFSET_MS - 4 * 3600_000).toISOString().slice(0, 10);
}

// Agle IST `hour` baje tak kitne second (kam se kam 60)
export function secondsUntilIst(hour: number): number {
  const now = istNow();
  const target = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hour));
  if (target.getTime() <= now.getTime()) target.setUTCDate(target.getUTCDate() + 1);
  return Math.max(60, Math.round((target.getTime() - now.getTime()) / 1000));
}