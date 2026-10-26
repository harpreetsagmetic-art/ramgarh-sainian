import type { Locale } from "./i18n";

export type Bi = { pa: string; en: string };
export const pick = (l: Locale, v: Bi) => v[l];

export const labels = {
  // common
  about: { pa: "ਪਿੰਡ ਬਾਰੇ", en: "About the village" },
  glance: { pa: "ਇੱਕ ਨਜ਼ਰ ਵਿੱਚ", en: "At a glance" },
  leaders: { pa: "ਪਿੰਡ ਦੀ ਅਗਵਾਈ", en: "Village leadership" },
  timings: { pa: "ਸਮਾਂ-ਸਾਰਣੀ", en: "Timings" },
  programs: { pa: "ਪ੍ਰੋਗਰਾਮ", en: "Programs" },
  events: { pa: "ਤਿਉਹਾਰ ਤੇ ਸਮਾਗਮ", en: "Events & Festivals" },
  sewa: { pa: "ਲੰਗਰ ਤੇ ਸੇਵਾ", en: "Langar & Sewa" },
  achievements: { pa: "ਮਾਣ ਵਾਲੀਆਂ ਪ੍ਰਾਪਤੀਆਂ", en: "Achievements" },
  directory: { pa: "ਪਿੰਡ ਡਾਇਰੈਕਟਰੀ", en: "Village Directory" },
  hukamnama: { pa: "ਅੱਜ ਦਾ ਹੁਕਮਨਾਮਾ", en: "Today's Hukamnama" },
  accounts: { pa: "ਦਾਨ ਦਾ ਹਿਸਾਬ", en: "Donation Accounts" },
  emergency: { pa: "ਐਮਰਜੈਂਸੀ ਨੰਬਰ", en: "Emergency Numbers" },
  share: { pa: "ਵਟਸਐਪ 'ਤੇ ਸਾਂਝਾ ਕਰੋ", en: "Share on WhatsApp" },
  call: { pa: "ਫ਼ੋਨ ਕਰੋ", en: "Call" },
  openMap: { pa: "ਨਕਸ਼ੇ ਵਿੱਚ ਵੇਖੋ", en: "Open in map" },
  gallerySoon: {
    pa: "ਤਸਵੀਰਾਂ ਐਡਮਿਨ ਪੈਨਲ ਤੋਂ ਜੋੜੀਆਂ ਜਾਣਗੀਆਂ।",
    en: "Photos will be added from the admin panel.",
  },
  noEntries: { pa: "ਅਜੇ ਕੋਈ ਨਾਮ ਨਹੀਂ ਜੁੜਿਆ।", en: "No entries yet." },
  consentNote: {
    pa: "ਸਿਰਫ਼ ਉਹੀ ਲੋਕ ਸੂਚੀ ਵਿੱਚ ਆਉਣਗੇ ਜੋ ਆਪ ਸਹਿਮਤ ਹੋਣਗੇ।",
    en: "Only people who agree will be listed.",
  },

  // UPI donate
  upiId: { pa: "UPI ID", en: "UPI ID" },
  payee: { pa: "ਪ੍ਰਾਪਤਕਰਤਾ", en: "Payee" },
  copy: { pa: "ਕਾਪੀ", en: "Copy" },
  copied: { pa: "ਕਾਪੀ ਹੋ ਗਿਆ", en: "Copied" },
  amount: { pa: "ਰਕਮ (₹)", en: "Amount (₹)" },
  payNow: { pa: "UPI ਨਾਲ ਦਾਨ ਕਰੋ", en: "Donate with UPI" },
  scanQr: { pa: "ਜਾਂ ਇਹ QR ਸਕੈਨ ਕਰੋ", en: "Or scan this QR" },
  donateNote: {
    pa: "ਭੁਗਤਾਨ ਤੋਂ ਬਾਅਦ ਕਮੇਟੀ ਬੈਂਕ ਸਟੇਟਮੈਂਟ ਵਿੱਚ ਪੁਸ਼ਟੀ ਕਰੇਗੀ।",
    en: "After payment, the committee will confirm it in the bank statement.",
  },

  // accounts
  collected: { pa: "ਇਕੱਠਾ ਹੋਇਆ", en: "Collected" },
  spent: { pa: "ਖ਼ਰਚ", en: "Spent" },
  balance: { pa: "ਬਾਕੀ", en: "Balance" },
  sampleData: {
    pa: "⚠️ ਇਹ ਨਮੂਨਾ ਅੰਕੜੇ ਹਨ। ਅਸਲ ਹਿਸਾਬ ਕਮੇਟੀ ਦੀ ਮਨਜ਼ੂਰੀ ਤੋਂ ਬਾਅਦ ਹੀ ਪਾਇਆ ਜਾਵੇਗਾ।",
    en: "⚠️ These are sample figures. Real accounts will be added only after committee approval.",
  },

  // weather
  wind: { pa: "ਹਵਾ", en: "Wind" },
  humidity: { pa: "ਨਮੀ", en: "Humidity" },
  rainChance: { pa: "ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ", en: "Chance of rain" },
  farmTips: { pa: "ਕਿਸਾਨ ਵੀਰਾਂ ਲਈ", en: "For farmers" },
  tipsNote: {
    pa: "ਇਹ ਆਮ ਸੰਕੇਤ ਹਨ, ਮਾਹਰ ਦੀ ਸਲਾਹ ਨਹੀਂ।",
    en: "These are general hints, not expert advice.",
  },
  weatherDown: {
    pa: "ਮੌਸਮ ਦੀ ਜਾਣਕਾਰੀ ਹੁਣ ਨਹੀਂ ਮਿਲ ਰਹੀ।",
    en: "Weather is unavailable right now.",
  },

  // countdown
  nextEvent: { pa: "ਅਗਲਾ ਸਮਾਗਮ", en: "Next event" },
  daysLeft: { pa: "ਦਿਨ ਬਾਕੀ", en: "days to go" },
  today: { pa: "ਅੱਜ ਹੈ!", en: "Today!" },

  // hukamnama
  hukamnamaNote: {
    pa: "ਰੋਜ਼ਾਨਾ ਹੁਕਮਨਾਮਾ ਸਿੱਧਾ ਅਧਿਕਾਰਤ ਸਰੋਤ ਤੋਂ ਪੜ੍ਹੋ ਜੀ।",
    en: "Please read the daily Hukamnama directly from the official source.",
  },
  hukamnamaBtn: { pa: "ਹੁਕਮਨਾਮਾ ਪੜ੍ਹੋ", en: "Read Hukamnama" },

  // emergency
  national: { pa: "ਰਾਸ਼ਟਰੀ ਨੰਬਰ", en: "National numbers" },
  local: { pa: "ਸਥਾਨਕ ਨੰਬਰ", en: "Local numbers" },
} satisfies Record<string, Bi>;

// ⚠️ Sab placeholder hai. Asli jaankari gaon se ikatthi karke badalna.
export const site = {
  upiId: "yourname@bank",
  payee: {
    pa: "ਗੁਰਦੁਆਰਾ ਸਾਹਿਬ ਪ੍ਰਬੰਧਕ ਕਮੇਟੀ",
    en: "Gurudwara Sahib Management Committee",
  },
  phone: "+910000000000",
  phoneShow: "+91 00000 00000",
  mapUrl:
    "https://maps.app.goo.gl/bdmvC9rpRBs8nmup9",
};

// ⚠️ Ye Fatehgarh Sahib ke lagbhag coordinates hain.
// Apne gaon ke liye: Google Maps mein gaon par long-press karo, upar aaye numbers copy karo.
export const geo = { lat: 30.612361, lon: 76.472778 };

// ⚠️ Sahi Hukamnama page khud khol kar pakka karo, phir yahan poora link daalo.
export const links = { hukamnamaUrl: "https://sgpc.net" };

export const village = {
  about: {
    pa: "ਰਾਮਗੜ੍ਹ ਸੈਣੀਆਂ (ਸੈਣੀ ਮਾਜਰਾ) ਜ਼ਿਲ੍ਹਾ ਫ਼ਤਿਹਗੜ੍ਹ ਸਾਹਿਬ, ਪੰਜਾਬ ਦਾ ਇੱਕ ਪਿੰਡ ਹੈ। ਪਿੰਡ ਦਾ ਇਤਿਹਾਸ ਇੱਥੇ ਜੋੜਿਆ ਜਾਵੇਗਾ।",
    en: "Ramgarh Sainian (Saini Majra) is a village in Fatehgarh Sahib district, Punjab. The village history will be added here.",
  },
  facts: [
    { label: { pa: "ਆਬਾਦੀ", en: "Population" }, value: "—" },
    { label: { pa: "ਘਰ", en: "Households" }, value: "—" },
    { label: { pa: "ਸਾਖਰਤਾ", en: "Literacy" }, value: "—" },
    { label: { pa: "ਖੇਤਰਫਲ", en: "Area" }, value: "—" },
  ] satisfies { label: Bi; value: string }[],
  leaders: [
    {
      id: 1,
      name: { pa: "ਨਾਮ ਜਲਦੀ", en: "Name soon" },
      role: { pa: "ਸਰਪੰਚ", en: "Sarpanch" },
    },
    {
      id: 2,
      name: { pa: "ਨਾਮ ਜਲਦੀ", en: "Name soon" },
      role: { pa: "ਪੰਚਾਇਤ ਮੈਂਬਰ", en: "Panchayat member" },
    },
    {
      id: 3,
      name: { pa: "ਨਾਮ ਜਲਦੀ", en: "Name soon" },
      role: { pa: "ਗੁਰਦੁਆਰਾ ਪ੍ਰਧਾਨ", en: "Gurudwara president" },
    },
  ],
};

// NRI section: sirf text. Asli naam/projects elders se puchh kar, unki ijazat se jodna.
export const nri = {
  title: { pa: "ਸਾਡੇ ਪਰਦੇਸੀ ਵੀਰ", en: "Our NRI Family" },
  intro: {
    pa: "ਸਾਡੇ ਪਿੰਡ ਦੇ ਬਹੁਤ ਸਾਰੇ ਵੀਰ-ਭੈਣਾਂ ਵਿਦੇਸ਼ ਵਿੱਚ ਵੱਸਦੇ ਹਨ, ਪਰ ਉਨ੍ਹਾਂ ਦਾ ਦਿਲ ਅੱਜ ਵੀ ਪਿੰਡ ਨਾਲ ਜੁੜਿਆ ਹੋਇਆ ਹੈ। ਪਿੰਡ ਦੀ ਤਰੱਕੀ, ਗੁਰਦੁਆਰਾ ਸਾਹਿਬ ਦੀ ਸੇਵਾ ਅਤੇ ਸਾਂਝੇ ਕੰਮਾਂ ਵਿੱਚ ਪਰਦੇਸੀ ਵੀਰਾਂ ਦਾ ਬਹੁਤ ਵੱਡਾ ਯੋਗਦਾਨ ਹੈ।",
    en: "Many sons and daughters of our village live abroad, yet their hearts remain connected to the village. Their contribution to the progress of the village, the service of Gurudwara Sahib and shared works is very important.",
  },
  roles: [
    {
      id: 1,
      title: { pa: "ਗੁਰਦੁਆਰਾ ਸਾਹਿਬ ਦੀ ਸੇਵਾ", en: "Service of Gurudwara Sahib" },
      text: {
        pa: "ਗੁਰਪੁਰਬ ਤੇ ਸਮਾਗਮਾਂ ਲਈ ਤਨ, ਮਨ ਅਤੇ ਧਨ ਨਾਲ ਸੇਵਾ।",
        en: "Sewa with body, mind and resources for Gurpurab and other programmes.",
      },
    },
    {
      id: 4,
      title: { pa: "ਜੜ੍ਹਾਂ ਨਾਲ ਜੁੜੇ ਰਹਿਣਾ", en: "Staying rooted" },
      text: {
        pa: "ਪਿੰਡ ਦੀ ਬੋਲੀ, ਸਭਿਆਚਾਰ ਅਤੇ ਰਿਸ਼ਤਿਆਂ ਨੂੰ ਜਿਉਂਦਾ ਰੱਖਣਾ।",
        en: "Keeping the language, culture and relationships of the village alive.",
      },
    },
  ],
  closing: {
    pa: "ਪਿੰਡ ਵੱਲੋਂ ਸਾਰੇ ਪਰਦੇਸੀ ਵੀਰਾਂ ਦਾ ਦਿਲੋਂ ਧੰਨਵਾਦ 🙏",
    en: "The village heartfully thanks all our NRI family 🙏",
  },
};

export const achievements = [
  {
    id: 1,
    kind: "student",
    name: { pa: "ਨਾਮ ਜਲਦੀ", en: "Name soon" },
    text: {
      pa: "ਪੜ੍ਹਾਈ ਵਿੱਚ ਪ੍ਰਾਪਤੀ ਦੀ ਜਾਣਕਾਰੀ ਇੱਥੇ ਆਵੇਗੀ।",
      en: "Academic achievement details will appear here.",
    },
  },
  {
    id: 2,
    kind: "sport",
    name: { pa: "ਨਾਮ ਜਲਦੀ", en: "Name soon" },
    text: {
      pa: "ਖੇਡਾਂ ਵਿੱਚ ਪ੍ਰਾਪਤੀ ਦੀ ਜਾਣਕਾਰੀ ਇੱਥੇ ਆਵੇਗੀ।",
      en: "Sports achievement details will appear here.",
    },
  },
  {
    id: 3,
    kind: "service",
    name: { pa: "ਨਾਮ ਜਲਦੀ", en: "Name soon" },
    text: {
      pa: "ਫ਼ੌਜ ਜਾਂ ਸੇਵਾ ਵਿੱਚ ਯੋਗਦਾਨ ਦੀ ਜਾਣਕਾਰੀ ਇੱਥੇ ਆਵੇਗੀ।",
      en: "Armed forces or public service details will appear here.",
    },
  },
];

export const gurudwara = {
  about: {
    pa: "ਇਹ ਪਿੰਡ ਦੇ ਗੁਰਦੁਆਰਾ ਸਾਹਿਬ ਦਾ ਪੰਨਾ ਹੈ। ਇਤਿਹਾਸ ਅਤੇ ਸੇਵਾ ਦੀ ਜਾਣਕਾਰੀ ਇੱਥੇ ਜੋੜੀ ਜਾਵੇਗੀ।",
    en: "This is the page of the village Gurudwara Sahib. Its history and sewa details will be added here.",
  },
  timings: [
    { label: { pa: "ਅੰਮ੍ਰਿਤ ਵੇਲਾ", en: "Amrit Vela" }, value: "—" },
    { label: { pa: "ਸ਼ਾਮ ਦਾ ਦੀਵਾਨ", en: "Evening Diwan" }, value: "—" },
    { label: { pa: "ਲੰਗਰ", en: "Langar" }, value: "—" },
  ] satisfies { label: Bi; value: string }[],
  programs: [
    {
      id: 1,
      title: { pa: "ਗੁਰਪੁਰਬ", en: "Gurpurab" },
      text: { pa: "ਤਾਰੀਖ਼ ਜਲਦੀ ਜੋੜੀ ਜਾਵੇਗੀ।", en: "Date will be added soon." },
    },
    {
      id: 2,
      title: { pa: "ਸੰਗਰਾਂਦ", en: "Sangrand" },
      text: {
        pa: "ਹਰ ਮਹੀਨੇ ਦੀ ਸੰਗਰਾਂਦ ਦਾ ਪ੍ਰੋਗਰਾਮ।",
        en: "Monthly Sangrand programme.",
      },
    },
  ],
};

export const notices = [
  {
    id: 1,
    date: "2026-10-26",
    title: { pa: "ਨਮੂਨਾ ਸੂਚਨਾ", en: "Sample notice" },
    body: {
      pa: "ਇਹ ਇੱਕ ਨਮੂਨਾ ਸੂਚਨਾ ਹੈ। ਅਸਲ ਸੂਚਨਾਵਾਂ ਐਡਮਿਨ ਪੈਨਲ ਤੋਂ ਆਉਣਗੀਆਂ।",
      en: "This is a sample notice. Real notices will come from the admin panel.",
    },
  },
  {
    id: 2,
    date: "2026-10-20",
    title: { pa: "ਦੂਜੀ ਨਮੂਨਾ ਸੂਚਨਾ", en: "Second sample notice" },
    body: {
      pa: "ਇੱਥੇ ਪਿੰਡ ਦੀ ਮੀਟਿੰਗ ਜਾਂ ਪ੍ਰੋਗਰਾਮ ਦੀ ਜਾਣਕਾਰੀ ਆਵੇਗੀ।",
      en: "Village meetings and programmes will appear here.",
    },
  },
];

export const events = [
  {
    id: 1,
    date: "2026-11-15",
    title: { pa: "ਨਮੂਨਾ ਗੁਰਪੁਰਬ ਸਮਾਗਮ", en: "Sample Gurpurab programme" },
    place: { pa: "ਗੁਰਦੁਆਰਾ ਸਾਹਿਬ", en: "Gurudwara Sahib" },
    text: {
      pa: "ਅਸਲ ਤਾਰੀਖ਼ ਤੇ ਪ੍ਰੋਗਰਾਮ ਐਡਮਿਨ ਪੈਨਲ ਤੋਂ ਆਵੇਗਾ।",
      en: "Real date and programme will come from the admin panel.",
    },
  },
  {
    id: 2,
    date: "2026-12-14",
    title: { pa: "ਨਮੂਨਾ ਪਿੰਡ ਮੀਟਿੰਗ", en: "Sample village meeting" },
    place: { pa: "ਪੰਚਾਇਤ ਘਰ", en: "Panchayat Ghar" },
    text: {
      pa: "ਪਿੰਡ ਦੇ ਕੰਮਾਂ ਬਾਰੇ ਵਿਚਾਰ।",
      en: "Discussion on village matters.",
    },
  },
];

const weekdays: Bi[] = [
  { pa: "ਐਤਵਾਰ", en: "Sunday" },
  { pa: "ਸੋਮਵਾਰ", en: "Monday" },
  { pa: "ਮੰਗਲਵਾਰ", en: "Tuesday" },
  { pa: "ਬੁੱਧਵਾਰ", en: "Wednesday" },
  { pa: "ਵੀਰਵਾਰ", en: "Thursday" },
  { pa: "ਸ਼ੁੱਕਰਵਾਰ", en: "Friday" },
  { pa: "ਸ਼ਨੀਵਾਰ", en: "Saturday" },
];

export const sewaSchedule = weekdays.map((day, i) => ({
  id: i,
  day,
  who: {
    pa: "ਸੇਵਾਦਾਰ ਦਾ ਨਾਮ ਜਲਦੀ ਜੋੜਿਆ ਜਾਵੇਗਾ",
    en: "Sewadar name will be added soon",
  },
}));

export const accounts = [
  {
    month: "2026-10",
    collected: 25000,
    items: [
      { title: { pa: "ਲੰਗਰ ਦਾ ਸਮਾਨ", en: "Langar supplies" }, amount: 12000 },
      { title: { pa: "ਬਿਜਲੀ ਬਿੱਲ", en: "Electricity bill" }, amount: 6000 },
    ],
  },
];

export const emergency = {
  national: [
    {
      number: "112",
      label: {
        pa: "ਸਾਂਝੀ ਐਮਰਜੈਂਸੀ (ਪੁਲਿਸ, ਐਂਬੂਲੈਂਸ, ਫਾਇਰ)",
        en: "All emergencies (police, ambulance, fire)",
      },
    },
    { number: "108", label: { pa: "ਐਂਬੂਲੈਂਸ", en: "Ambulance" } },
    { number: "101", label: { pa: "ਫਾਇਰ ਬ੍ਰਿਗੇਡ", en: "Fire brigade" } },
    { number: "1098", label: { pa: "ਚਾਈਲਡਲਾਈਨ", en: "Childline" } },
    { number: "181", label: { pa: "ਮਹਿਲਾ ਹੈਲਪਲਾਈਨ", en: "Women helpline" } },
    {
      number: "1930",
      label: { pa: "ਸਾਈਬਰ ਠੱਗੀ ਹੈਲਪਲਾਈਨ", en: "Cyber fraud helpline" },
    },
  ],
  // ⚠️ Asli numbers pakke karke daalna
  local: [
    {
      number: "+910000000000",
      show: "—",
      label: { pa: "ਸਰਪੰਚ", en: "Sarpanch" },
    },
    {
      number: "+910000000000",
      show: "—",
      label: { pa: "ਨੇੜੇ ਦਾ ਥਾਣਾ", en: "Nearest police station" },
    },
    {
      number: "+910000000000",
      show: "—",
      label: { pa: "ਨੇੜੇ ਦਾ ਹਸਪਤਾਲ", en: "Nearest hospital" },
    },
  ],
};

export function formatDate(iso: string, locale: Locale) {
  return new Date(iso).toLocaleDateString(locale === "pa" ? "pa-IN" : "en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
