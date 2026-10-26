import type { Bi } from "./content";

export const x = {
  // aaj
  nanakshahi: { pa: "ਨਾਨਕਸ਼ਾਹੀ", en: "Nanakshahi" },
  todayHistory: { pa: "ਅੱਜ ਦਾ ਇਤਿਹਾਸ", en: "Today in Sikh history" },

  // hukamnama
  hukamnamaTitle: { pa: "ਅੱਜ ਦਾ ਹੁਕਮਨਾਮਾ", en: "Today's Hukamnama" },
  hukamnamaFrom: {
    pa: "ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ, ਅੰਮ੍ਰਿਤਸਰ",
    en: "Sri Harmandir Sahib, Amritsar",
  },
  ang: { pa: "ਅੰਗ", en: "Ang" },
  viewMeaning: { pa: "ਅਰਥ ਵੇਖੋ", en: "View meaning" },
  hukamnamaSource: {
    pa: "ਸਰੋਤ: BaniDB (Khalis Foundation)। ਗੁਰਬਾਣੀ ਦਾ ਪਾਠ ਬਿਨਾਂ ਕਿਸੇ ਬਦਲਾਅ ਦੇ ਦਿਖਾਇਆ ਗਿਆ ਹੈ।",
    en: "Source: BaniDB (Khalis Foundation). Gurbani is shown unmodified.",
  },
  hukamnamaDown: {
    pa: "ਹੁਕਮਨਾਮਾ ਇਸ ਵੇਲੇ ਨਹੀਂ ਮਿਲ ਰਿਹਾ। ਕਿਰਪਾ ਕਰਕੇ ਅਧਿਕਾਰਤ ਸਾਈਟ ਤੋਂ ਪੜ੍ਹੋ ਜੀ।",
    en: "Hukamnama is unavailable right now. Please read it from the official site.",
  },
  hukamnamaOfficial: { pa: "ਅਧਿਕਾਰਤ ਸਾਈਟ", en: "Official site" },

  // calendar
  upcomingTitle: { pa: "ਆਉਣ ਵਾਲੇ ਦਿਹਾੜੇ", en: "Upcoming days" },
  upcomingNone: {
    pa: "ਅਗਲੇ ਦਿਨਾਂ ਦੀ ਜਾਣਕਾਰੀ ਇਸ ਵੇਲੇ ਨਹੀਂ ਮਿਲ ਰਹੀ।",
    en: "Calendar information is unavailable right now.",
  },
  nextSangrand: { pa: "ਅਗਲੀ ਸੰਗਰਾਂਦ", en: "Next Sangrand" },
  nextPuranmashi: { pa: "ਅਗਲੀ ਪੂਰਨਮਾਸ਼ੀ", en: "Next Puranmashi" },
  nextMassia: { pa: "ਅਗਲੀ ਮੱਸਿਆ", en: "Next Massia" },
  daysLeft: { pa: "ਦਿਨ ਬਾਕੀ", en: "days to go" },
  todayLabel: { pa: "ਅੱਜ ਹੈ!", en: "Today!" },
  calendarSource: {
    pa: "ਕੈਲੰਡਰ: SGPC ਜੰਤਰੀ ਅਧਾਰਿਤ (gurpurab.com API)।",
    en: "Calendar based on SGPC Jantri (gurpurab.com API).",
  },

  // village data
  census: { pa: "ਜਨਗਣਨਾ 2011 ਅਨੁਸਾਰ", en: "As per Census 2011" },
  population: { pa: "ਆਬਾਦੀ", en: "Population" },
  households: { pa: "ਘਰ", en: "Households" },
  literacy: { pa: "ਸਾਖਰਤਾ ਦਰ", en: "Literacy rate" },
  sexRatio: {
    pa: "ਲਿੰਗ ਅਨੁਪਾਤ (ਪ੍ਰਤੀ 1000 ਮਰਦ)",
    en: "Sex ratio (per 1000 males)",
  },
  children: { pa: "ਬੱਚੇ (0-6 ਸਾਲ)", en: "Children (0-6)" },
  workers: { pa: "ਕੰਮਕਾਜੀ ਲੋਕ", en: "Workers" },
  censusNote: {
    pa: "ਇਹ ਅੰਕੜੇ ਜਨਗਣਨਾ 2011 ਦੇ ਹਨ, ਅੱਜ ਦੀ ਅਸਲ ਗਿਣਤੀ ਵੱਖਰੀ ਹੋ ਸਕਦੀ ਹੈ। ਸਾਖਰਤਾ ਦਰ 7 ਸਾਲ ਤੋਂ ਵੱਡੀ ਆਬਾਦੀ ਉੱਤੇ ਗਿਣੀ ਜਾਂਦੀ ਹੈ।",
    en: "These figures are from Census 2011; today's actual numbers may differ. Literacy rate is counted among people aged 7 and above.",
  },
  adminTitle: { pa: "ਪ੍ਰਸ਼ਾਸਨਿਕ ਜਾਣਕਾਰੀ", en: "Administrative details" },
  pin: { pa: "ਪਿੰਨ ਕੋਡ", en: "PIN code" },
  postOffice: { pa: "ਡਾਕਖਾਨਾ", en: "Post office" },
  censusCode: { pa: "ਜਨਗਣਨਾ ਕੋਡ", en: "Census code" },
  gramPanchayat: { pa: "ਗ੍ਰਾਮ ਪੰਚਾਇਤ", en: "Gram Panchayat" },
  tehsil: { pa: "ਤਹਿਸੀਲ", en: "Tehsil" },
  district: { pa: "ਜ਼ਿਲ੍ਹਾ", en: "District" },
  sources: { pa: "ਸਰੋਤ", en: "Sources" },

  comingSoon: { pa: "ਜਲਦੀ ਆ ਰਹੀ ਹੈ", en: "Coming soon" },

  projectedTitle: { pa: "ਸਾਲ 2026 ਦੇ ਅਨੁਮਾਨ", en: "Projected 2026 estimates" },
  projectedNote: {
    pa: "ਇਹ ਅਨੁਮਾਨ MapsOfIndia ਦੇ ਹਨ, ਸਰਕਾਰੀ ਜਨਗਣਨਾ ਨਹੀਂ। ਇੱਥੇ ਸਾਖਰਤਾ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਕੁੱਲ ਆਬਾਦੀ ਉੱਤੇ ਗਿਣਿਆ ਗਿਆ ਹੈ, ਇਸ ਲਈ ਉੱਪਰ ਦਿੱਤੀ 87.74% ਨਾਲੋਂ ਵੱਖਰਾ ਹੈ।",
    en: "These estimates are from MapsOfIndia, not an official census. Literacy percentage here is counted on the total population, so it differs from the 87.74% shown above.",
  },
  indicator: { pa: "ਵੇਰਵਾ", en: "Indicator" },
  change: { pa: "ਬਦਲਾਅ", en: "Change" },
  males: { pa: "ਮਰਦ", en: "Males" },
  females: { pa: "ਔਰਤਾਂ", en: "Females" },
  literate: { pa: "ਪੜ੍ਹੇ-ਲਿਖੇ", en: "Literate" },
  nonLiterate: { pa: "ਅਨਪੜ੍ਹ", en: "Non-literate" },
} satisfies Record<string, Bi>;

export const villageAbout: Bi = {
  pa: "ਰਾਮਗੜ੍ਹ ਸੈਣੀਆਂ (ਸੈਣੀ ਮਾਜਰਾ) ਜ਼ਿਲ੍ਹਾ ਫ਼ਤਿਹਗੜ੍ਹ ਸਾਹਿਬ ਦੀ ਫ਼ਤਿਹਗੜ੍ਹ ਸਾਹਿਬ ਤਹਿਸੀਲ ਦਾ ਇੱਕ ਪਿੰਡ ਹੈ। ਜਨਗਣਨਾ 2011 ਅਨੁਸਾਰ ਇੱਥੇ 134 ਘਰ ਅਤੇ 621 ਦੀ ਆਬਾਦੀ ਸੀ। ਪਿੰਡ ਦੇ ਕੰਮਕਾਜੀ ਲੋਕਾਂ ਵਿੱਚੋਂ ਵੱਡੀ ਗਿਣਤੀ ਆਪਣੀ ਜ਼ਮੀਨ ਦੀ ਖੇਤੀ ਕਰਦੀ ਹੈ। ਪਿੰਡ ਦਾ ਇਤਿਹਾਸ ਬਜ਼ੁਰਗਾਂ ਤੋਂ ਪੁੱਛ ਕੇ ਇੱਥੇ ਜੋੜਿਆ ਜਾਵੇਗਾ।",
  en: "Ramgarh Sainian (Saini Majra) is a village in Fatehgarh Sahib tehsil of Fatehgarh Sahib district. As per Census 2011 it had 134 households and a population of 621. A large share of the working people farm their own land. The village history will be added after talking to the elders.",
};

// Census 2011 (census2011.co.in) aur MapsOfIndia ke records se
export const census = {
  population: 621,
  males: 338,
  females: 283,
  households: 134,
  children: 50,
  literacyPct: 87.74,
  sexRatio: 837,
  workers: 203,
};

export const admin = {
  pin: "140406",
  postOffice: { pa: "ਚੁੰਨੀ ਕਲਾਂ (ਸਬ ਪੋਸਟ ਆਫ਼ਿਸ)", en: "Chuni Kalan (S.O)" },
  censusCode: "032699",
  gramPanchayat: { pa: "ਰਾਮਗੜ੍ਹ ਸੈਣੀਆਂ", en: "Ramgarh Sanian" },
  tehsil: { pa: "ਫ਼ਤਿਹਗੜ੍ਹ ਸਾਹਿਬ", en: "Fatehgarh Sahib" },
  district: { pa: "ਫ਼ਤਿਹਗੜ੍ਹ ਸਾਹਿਬ", en: "Fatehgarh Sahib" },
};

export const dataSources = [
  {
    name: "Census 2011 (census2011.co.in)",
    url: "https://www.census2011.co.in/data/village/32699-ramgarh-sainian-saini-majra-punjab.html",
  },
  {
    name: "Maps of India",
    url: "https://www.mapsofindia.com/villages/punjab/fatehgarh-sahib/fatehgarh-sahib/ramgarh-sainian-saini-majra.html",
  },
];


// 2026 ke andaaze (MapsOfIndia). Percentage dono saalon ke liye poori aabadi par.
export const projection: { label: Bi; y2011: string; y2026: string; change?: string }[] = [
  { label: x.population, y2011: "621", y2026: "690", change: "+11.1%" },
  { label: x.males, y2011: "338", y2026: "374" },
  { label: x.females, y2011: "283", y2026: "316" },
  { label: x.households, y2011: "134", y2026: "158", change: "+17.9%" },
  { label: x.literate, y2011: "501 (80.7%)", y2026: "579 (83.9%)" },
  { label: x.nonLiterate, y2011: "120", y2026: "112" },
  { label: x.workers, y2011: "203 (32.7%)", y2026: "315 (45.7%)" },
  { label: x.sexRatio, y2011: "837", y2026: "845" },
];