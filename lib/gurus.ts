import type { Bi } from "./content";
import type { Locale } from "./i18n";

type GuruInfo = { title: Bi; years: string; text: Bi };

// Chhote parichay, aam itihaasik jaankari ke hisaab se. Publish karne se pehle gyani/bujurg se zaroor check karwao.
export const gurus: Record<number, GuruInfo> = {
  1: {
    title: { pa: "ਸ੍ਰੀ ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ", en: "Sri Guru Nanak Dev Ji" },
    years: "1469–1539",
    text: {
      pa: "ਸਿੱਖ ਧਰਮ ਦੇ ਬਾਨੀ। ਆਪ ਦਾ ਜਨਮ ਤਲਵੰਡੀ (ਹੁਣ ਨਨਕਾਣਾ ਸਾਹਿਬ) ਵਿੱਚ ਹੋਇਆ। ਆਪ ਨੇ ੴ, ਕਿਰਤ ਕਰਨੀ, ਵੰਡ ਛਕਣਾ ਅਤੇ ਨਾਮ ਜਪਣਾ ਦਾ ਉਪਦੇਸ਼ ਦਿੱਤਾ, ਉਦਾਸੀਆਂ ਕੀਤੀਆਂ ਅਤੇ ਅੰਤ ਵਿੱਚ ਕਰਤਾਰਪੁਰ ਵਸਾਇਆ।",
      en: "Founder of Sikhism, born at Talwandi (now Nankana Sahib). He taught Ik Oankar, honest living, sharing with others and remembering the Name, travelled widely on his Udasis and finally settled at Kartarpur.",
    },
  },
  2: {
    title: { pa: "ਸ੍ਰੀ ਗੁਰੂ ਅੰਗਦ ਦੇਵ ਜੀ", en: "Sri Guru Angad Dev Ji" },
    years: "1504–1552",
    text: {
      pa: "ਦੂਜੇ ਗੁਰੂ। ਆਪ ਨੂੰ ਗੁਰਮੁਖੀ ਲਿਪੀ ਨੂੰ ਮਾਨਕ ਰੂਪ ਦੇਣ ਦਾ ਸਿਹਰਾ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ। ਖਡੂਰ ਸਾਹਿਬ ਵਿੱਚ ਆਪ ਨੇ ਲੰਗਰ ਦੀ ਪਰੰਪਰਾ ਅਤੇ ਸਰੀਰਕ ਕਸਰਤ (ਮੱਲ ਅਖਾੜਾ) ਨੂੰ ਉਤਸ਼ਾਹਿਤ ਕੀਤਾ।",
      en: "The second Guru, credited with standardising the Gurmukhi script. At Khadur Sahib he strengthened the langar tradition and encouraged physical training (Mal Akhara).",
    },
  },
  3: {
    title: { pa: "ਸ੍ਰੀ ਗੁਰੂ ਅਮਰਦਾਸ ਜੀ", en: "Sri Guru Amar Das Ji" },
    years: "1479–1574",
    text: {
      pa: "ਤੀਜੇ ਗੁਰੂ। ਗੋਇੰਦਵਾਲ ਸਾਹਿਬ ਤੋਂ ਆਪ ਨੇ ਪਹਿਲਾਂ ਪੰਗਤ, ਫਿਰ ਸੰਗਤ ਦੇ ਸਿਧਾਂਤ ਅਨੁਸਾਰ ਲੰਗਰ ਨੂੰ ਪੱਕਾ ਕੀਤਾ, ਮੰਜੀ ਪ੍ਰਥਾ ਨਾਲ ਸੰਗਤ ਦਾ ਪ੍ਰਬੰਧ ਕੀਤਾ ਅਤੇ ਜਾਤ-ਪਾਤ ਤੇ ਸਤੀ ਪ੍ਰਥਾ ਦਾ ਵਿਰੋਧ ਕੀਤਾ। ਅਨੰਦੁ ਸਾਹਿਬ ਆਪ ਦੀ ਰਚਨਾ ਹੈ।",
      en: "The third Guru. From Goindwal Sahib he made the langar firmly established on the principle of eating together, organised the Sangat through the manji system and spoke against caste distinctions and sati. Anand Sahib is his composition.",
    },
  },
  4: {
    title: { pa: "ਸ੍ਰੀ ਗੁਰੂ ਰਾਮਦਾਸ ਜੀ", en: "Sri Guru Ram Das Ji" },
    years: "1534–1581",
    text: {
      pa: "ਚੌਥੇ ਗੁਰੂ। ਆਪ ਨੇ ਰਾਮਦਾਸਪੁਰ (ਅੱਜ ਦਾ ਅੰਮ੍ਰਿਤਸਰ) ਵਸਾਇਆ, ਪਵਿੱਤਰ ਸਰੋਵਰ ਦੀ ਖੁਦਾਈ ਸ਼ੁਰੂ ਕਰਵਾਈ ਅਤੇ ਅਨੰਦ ਕਾਰਜ ਵਿੱਚ ਪੜ੍ਹੀਆਂ ਜਾਂਦੀਆਂ ਲਾਵਾਂ ਦੀ ਰਚਨਾ ਕੀਤੀ।",
      en: "The fourth Guru. He founded Ramdaspur (today's Amritsar), began the digging of the sacred sarovar and composed the Laavan recited in the Anand Karaj.",
    },
  },
  5: {
    title: { pa: "ਸ੍ਰੀ ਗੁਰੂ ਅਰਜਨ ਦੇਵ ਜੀ", en: "Sri Guru Arjan Dev Ji" },
    years: "1563–1606",
    text: {
      pa: "ਪੰਜਵੇਂ ਗੁਰੂ। ਆਪ ਨੇ ਆਦਿ ਗ੍ਰੰਥ ਦੀ ਸੰਪਾਦਨਾ (1604) ਕੀਤੀ ਅਤੇ ਉਸ ਦਾ ਪ੍ਰਕਾਸ਼ ਹਰਿਮੰਦਰ ਸਾਹਿਬ ਵਿੱਚ ਕਰਵਾਇਆ। ਸੁਖਮਨੀ ਸਾਹਿਬ ਆਪ ਦੀ ਰਚਨਾ ਹੈ। ਆਪ ਨੇ 1606 ਵਿੱਚ ਸ਼ਹਾਦਤ ਦਿੱਤੀ।",
      en: "The fifth Guru. He compiled the Adi Granth (1604) and had it installed at Harmandir Sahib. Sukhmani Sahib is his composition. He attained martyrdom in 1606.",
    },
  },
  6: {
    title: { pa: "ਸ੍ਰੀ ਗੁਰੂ ਹਰਿਗੋਬਿੰਦ ਸਾਹਿਬ ਜੀ", en: "Sri Guru Hargobind Sahib Ji" },
    years: "1595–1644",
    text: {
      pa: "ਛੇਵੇਂ ਗੁਰੂ। ਆਪ ਨੇ ਮੀਰੀ ਤੇ ਪੀਰੀ ਦੀਆਂ ਦੋ ਤਲਵਾਰਾਂ ਧਾਰਨ ਕੀਤੀਆਂ ਅਤੇ ਅੰਮ੍ਰਿਤਸਰ ਵਿੱਚ ਸ੍ਰੀ ਅਕਾਲ ਤਖ਼ਤ ਸਾਹਿਬ ਦੀ ਸਥਾਪਨਾ ਕੀਤੀ।",
      en: "The sixth Guru. He wore the two swords of Miri and Piri (worldly and spiritual authority) and established the Sri Akal Takht Sahib at Amritsar.",
    },
  },
  7: {
    title: { pa: "ਸ੍ਰੀ ਗੁਰੂ ਹਰਿਰਾਇ ਜੀ", en: "Sri Guru Har Rai Ji" },
    years: "1630–1661",
    text: {
      pa: "ਸੱਤਵੇਂ ਗੁਰੂ। ਆਪ ਆਪਣੀ ਕੋਮਲਤਾ ਤੇ ਦਇਆ ਲਈ ਜਾਣੇ ਜਾਂਦੇ ਹਨ। ਕੀਰਤਪੁਰ ਵਿੱਚ ਆਪ ਨੇ ਜੜ੍ਹੀ-ਬੂਟੀਆਂ ਦਾ ਦਵਾਖ਼ਾਨਾ ਚਲਾਇਆ।",
      en: "The seventh Guru, known for his gentleness and compassion. At Kiratpur he ran a herbal dispensary.",
    },
  },
  8: {
    title: { pa: "ਸ੍ਰੀ ਗੁਰੂ ਹਰਿਕ੍ਰਿਸ਼ਨ ਜੀ", en: "Sri Guru Har Krishan Ji" },
    years: "1656–1664",
    text: {
      pa: "ਅੱਠਵੇਂ ਗੁਰੂ, ਜੋ ਪੰਜ ਸਾਲ ਦੀ ਉਮਰ ਵਿੱਚ ਗੁਰਗੱਦੀ 'ਤੇ ਬਿਰਾਜੇ। ਦਿੱਲੀ ਵਿੱਚ ਚੇਚਕ ਦੀ ਬਿਮਾਰੀ ਦੌਰਾਨ ਆਪ ਨੇ ਬਿਮਾਰਾਂ ਦੀ ਸੇਵਾ ਕੀਤੀ; ਗੁਰਦੁਆਰਾ ਬੰਗਲਾ ਸਾਹਿਬ ਉਸ ਦੀ ਯਾਦ ਵਿੱਚ ਹੈ।",
      en: "The eighth Guru, who became Guru at the age of five. He served the sick during a smallpox outbreak in Delhi; Gurdwara Bangla Sahib commemorates this.",
    },
  },
  9: {
    title: { pa: "ਸ੍ਰੀ ਗੁਰੂ ਤੇਗ ਬਹਾਦਰ ਜੀ", en: "Sri Guru Tegh Bahadur Ji" },
    years: "1621–1675",
    text: {
      pa: "ਨੌਵੇਂ ਗੁਰੂ। ਆਪ ਨੇ 1675 ਵਿੱਚ ਦਿੱਲੀ ਵਿੱਚ ਧਰਮ ਦੀ ਆਜ਼ਾਦੀ ਲਈ ਸ਼ਹਾਦਤ ਦਿੱਤੀ ਅਤੇ 'ਹਿੰਦ ਦੀ ਚਾਦਰ' ਵਜੋਂ ਯਾਦ ਕੀਤੇ ਜਾਂਦੇ ਹਨ। ਆਪ ਦੀ ਬਾਣੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ ਵਿੱਚ ਦਰਜ ਹੈ।",
      en: "The ninth Guru. He attained martyrdom in Delhi in 1675 defending freedom of religion and is remembered as 'Hind di Chadar'. His bani is included in Guru Granth Sahib Ji.",
    },
  },
  10: {
    title: { pa: "ਸ੍ਰੀ ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ ਜੀ", en: "Sri Guru Gobind Singh Ji" },
    years: "1666–1708",
    text: {
      pa: "ਦਸਵੇਂ ਗੁਰੂ। ਆਪ ਨੇ 1699 ਦੀ ਵਿਸਾਖੀ ਨੂੰ ਸ੍ਰੀ ਆਨੰਦਪੁਰ ਸਾਹਿਬ ਵਿਖੇ ਖ਼ਾਲਸਾ ਪੰਥ ਸਾਜਿਆ, ਜ਼ਫ਼ਰਨਾਮਾ ਲਿਖਿਆ ਅਤੇ 1708 ਵਿੱਚ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ ਨੂੰ ਸਦੀਵੀ ਗੁਰੂ ਥਾਪਿਆ।",
      en: "The tenth Guru. On Vaisakhi 1699 he created the Khalsa at Sri Anandpur Sahib, wrote the Zafarnama, and in 1708 declared Guru Granth Sahib Ji the eternal Guru.",
    },
  },
  11: {
    title: { pa: "ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ", en: "Sri Guru Granth Sahib Ji" },
    years: "1604 / 1708",
    text: {
      pa: "ਸਿੱਖਾਂ ਦੇ ਸਦੀਵੀ ਗੁਰੂ। ਇਸ ਦੀ ਸੰਪਾਦਨਾ ਗੁਰੂ ਅਰਜਨ ਦੇਵ ਜੀ ਨੇ 1604 ਵਿੱਚ ਕੀਤੀ ਅਤੇ ਅੰਤਿਮ ਰੂਪ ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ ਜੀ ਨੇ ਦਿੱਤਾ। ਇਸ ਵਿੱਚ ਗੁਰੂ ਸਾਹਿਬਾਨ ਅਤੇ ਵੱਖ-ਵੱਖ ਭਗਤਾਂ-ਸੰਤਾਂ ਦੀ ਬਾਣੀ ਹੈ।",
      en: "The eternal Guru of the Sikhs. Compiled by Guru Arjan Dev Ji in 1604 and given its final form by Guru Gobind Singh Ji, it contains the bani of the Sikh Gurus and of saints from different faiths and regions.",
    },
  },
};

export function guruNote(n: number | undefined, l: Locale) {
  if (!n) return null;
  const g = gurus[n];
  return g ? { title: g.title[l], years: g.years, text: g.text[l] } : null;
}