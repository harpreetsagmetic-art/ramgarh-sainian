// Sikh calendar ka data "snapshot" banata hai: lib/jantri-data.json
//
// Chalane ke liye:  npm run jantri:build
//
// Ye script sirf development mein chalti hai (library devDependency hai). Live site sirf banayi hui JSON padhti hai,
// to koi network ya bhaari astronomy library nahi chalti. Nayi Jantri ka data aane par (library update ke baad)
// ye script dobara chalao aur nayi JSON commit karo.

import { Engine, addDays } from "nanakshahi-jantri";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FIRST_YEAR = 557; // chhapi Jantri (pinned)
const LAST_YEAR = 561; // 559 se aage andaaze (estimated) hain
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "lib", "jantri-data.json");

const engine = new Engine();
const bikrami = engine.bikrami;

// ---------- Massia (tithi 30) aur Puranmashi (tithi 15) ----------
// Library sirf "sooraj chadhte waqt jo tithi hai" dekhti hai, isliye
//   - kshaya (tithi do sooraj-chadhne ke beech poori nikal jaye) wale mahine list se gayab ho jaate hain,
//   - vridhi (tithi do sooraj-chadhne chhoo le) mein ek hi tithi do din aa jaati hai.
// Sahi niyam: vridhi -> pehla din; kshaya -> jis din tithi chali.
function lunarDays(startIso, endIso, tithi) {
  const out = [];
  let prev = bikrami.sunriseTithi(addDays(startIso, -1));
  for (let d = startIso; d < endIso; d = addDays(d, 1)) {
    const cur = bikrami.sunriseTithi(d);
    const next = bikrami.sunriseTithi(addDays(d, 1));
    if (cur === tithi) {
      if (prev !== tithi) out.push(d);
    } else {
      const step = (((next - cur) % 30) + 30) % 30; // agle sooraj-chadhne tak kitni tithiyan nikal gayin
      const dist = (((tithi - cur) % 30) + 30) % 30; // hamari tithi kitni aage hai
      if (step >= 2 && dist >= 1 && dist < step) out.push(d); // beech mein nikal gayi (kshaya)
    }
    prev = cur;
  }
  return out;
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const fail = (msg) => {
  console.error("\nGALTI:", msg);
  process.exit(1);
};

// ---------- Saal-dar-saal data ----------
const years = {};
for (let y = FIRST_YEAR; y <= LAST_YEAR; y++) {
  const table = engine.yearTable(y);
  const built = engine.buildYear(y);
  const start = table.months[0].start;
  const end = table.nextChet;
  const pinnedLunar = engine.lunarDays(y);

  const massia = pinnedLunar.status === "confirmed" ? pinnedLunar.massia : lunarDays(start, end, 30);
  const purnmashi = pinnedLunar.status === "confirmed" ? pinnedLunar.purnmashi : lunarDays(start, end, 15);

  // Jaanch 1: jin saalon ke lunar din chhapi Jantri se pinned hain, hamara niyam unhe hubahu dohrana chahiye
  if (pinnedLunar.status === "confirmed") {
    if (!same(lunarDays(start, end, 30), pinnedLunar.massia) || !same(lunarDays(start, end, 15), pinnedLunar.purnmashi))
      fail(`NS ${y}: hamara Massia/Puranmashi niyam pinned Jantri se nahi mila.`);
  }

  // Jaanch 2: har dihara apne saal ke andar ho
  for (const ev of built.events) {
    if (ev.date < start || ev.date >= end) fail(`NS ${y}: "${ev.en}" ki date (${ev.date}) saal se bahar hai.`);
  }

  years[y] = {
    nsYear: y,
    status: table.status, // "confirmed" ya "estimated"
    source: table.source,
    start,
    nextChet: end,
    months: table.months.map(({ name, start: s, days }) => ({ name, start: s, days })),
    events: built.events.map(({ id, en, pa, category, span, date, status }) => ({
      id, en, pa, category, span, date, status,
    })),
    massia,
    purnmashi,
    lunarStatus: pinnedLunar.status,
  };
  console.log(
    `NS ${y}  ${table.status.padEnd(9)} ${String(built.events.length).padStart(3)} events | massia ${massia.length} | purnmashi ${purnmashi.length} | lunar ${pinnedLunar.status}`,
  );
}

// Jaanch 3: jaane-pehchane din sahi tareekh par hon
const ev558 = years[558].events;
const must = [
  ["bandi-chhor", "2026-11-08"],
  ["parkash-guru-nanak", "2026-11-24"],
];
for (const [needle, date] of must) {
  if (!ev558.some((e) => e.id.includes(needle) && e.date === date)) fail(`"${needle}" ${date} par nahi mila.`);
}
if (!years[558].purnmashi.includes("2026-12-23")) fail("Poh Puranmashi (2026-12-23) nahi mili.");

// ---------- Library ka version ----------
const pkgUrl = new URL("../package.json", import.meta.resolve("nanakshahi-jantri"));
const pkg = JSON.parse(readFileSync(pkgUrl, "utf8"));

const data = {
  generatedAt: new Date().toISOString(),
  packageName: pkg.name,
  packageVersion: pkg.version,
  years,
};

writeFileSync(OUT, JSON.stringify(data));
console.log(`\nLikh diya: ${OUT}  (${pkg.name}@${pkg.version})`);
