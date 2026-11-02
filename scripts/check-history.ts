import { topics } from "../lib/history-topics";

const UA = process.env.WIKI_USER_AGENT ?? "RamgarhSainianVillageSite/1.0 (check script)";
const headers = { "User-Agent": UA, Accept: "application/json" };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const enc = (t: string) => encodeURIComponent(t.replace(/ /g, "_"));

async function main() {
  let missing = 0;
  let withPa = 0;

  for (const t of topics) {
    // English summary
    const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${enc(t.wiki)}`, { headers });
    const j = r.ok ? await r.json() : null;
    const ok = !!j?.extract && j.type !== "disambiguation";

    // Punjabi jora
    let pa = "-";
    if (ok) {
      const u =
        "https://en.wikipedia.org/w/api.php?action=query&prop=langlinks&lllang=pa&redirects=1" +
        `&titles=${enc(t.wiki)}&format=json&formatversion=2`;
      const lj = await (await fetch(u, { headers })).json();
      const title = lj?.query?.pages?.[0]?.langlinks?.[0]?.title;
      if (title) { pa = title; withPa++; }
    }

    if (!ok) missing++;
    console.log(`${ok ? "OK     " : "MISSING"} | ${t.slug.padEnd(26)} | ${t.wiki.padEnd(42)} | pa: ${pa}`);
    await sleep(150); // Wikimedia ke saath tameez se
  }

  console.log(`\nTotal ${topics.length}, missing ${missing}, Punjabi version ${withPa}`);
}

main();