import type { Bi } from "./content";
import { gurus } from "./gurus";

export type Group = "guru" | "event" | "battle" | "person" | "gurdwara" | "development";

export type Topic = {
  slug: string;
  group: Group;
  wiki: string; // English Wikipedia article ka title
  name: Bi;
  guru?: number; // 1 se 11
  local?: boolean; // hamare ilaake (Fatehgarh Sahib) se jura hua
};

export const groupOrder: Group[] = ["guru", "event", "battle", "person", "gurdwara", "development"];

const g = (n: number, slug: string, wiki: string): Topic => ({
  slug, group: "guru", wiki, name: gurus[n].title, guru: n,
});

const t = (group: Group, slug: string, wiki: string, pa: string, en: string, local = false): Topic => ({
  slug, group, wiki, name: { pa, en }, local,
});

export const topics: Topic[] = [
  // Guru sahiban
  g(1, "guru-nanak-dev-ji", "Guru_Nanak"),
  g(2, "guru-angad-dev-ji", "Guru_Angad"),
  g(3, "guru-amar-das-ji", "Guru_Amar_Das"),
  g(4, "guru-ram-das-ji", "Guru_Ram_Das"),
  g(5, "guru-arjan-dev-ji", "Guru_Arjan"),
  g(6, "guru-hargobind-sahib-ji", "Guru_Hargobind"),
  g(7, "guru-har-rai-ji", "Guru_Har_Rai"),
  g(8, "guru-har-krishan-ji", "Guru_Har_Krishan"),
  g(9, "guru-tegh-bahadur-ji", "Guru_Tegh_Bahadur"),
  g(10, "guru-gobind-singh-ji", "Guru_Gobind_Singh"),
  g(11, "guru-granth-sahib-ji", "Guru_Granth_Sahib"),

  // Itihaasik ghatnayein
  t("event", "khalsa", "Khalsa", "ਖ਼ਾਲਸਾ ਪੰਥ", "The Khalsa"),
  t("event", "vaisakhi", "Vaisakhi", "ਵਿਸਾਖੀ", "Vaisakhi"),
  t("event", "bandi-chhor-divas", "Bandi_Chhor_Divas", "ਬੰਦੀ ਛੋੜ ਦਿਵਸ", "Bandi Chhor Divas"),
  t("event", "hola-mohalla", "Hola_Mohalla", "ਹੋਲਾ ਮਹੱਲਾ", "Hola Mohalla"),
  t("event", "sikh-empire", "Sikh_Empire", "ਸਿੱਖ ਰਾਜ", "The Sikh Empire"),
  t("event", "singh-sabha-movement", "Singh_Sabha_Movement", "ਸਿੰਘ ਸਭਾ ਲਹਿਰ", "Singh Sabha Movement"),
  t("event", "akali-movement", "Akali_movement", "ਅਕਾਲੀ ਲਹਿਰ", "Akali Movement"),
  t("event", "jallianwala-bagh", "Jallianwala_Bagh_massacre", "ਜਲ੍ਹਿਆਂਵਾਲਾ ਬਾਗ਼ ਦਾ ਸਾਕਾ", "Jallianwala Bagh massacre"),
  t("event", "komagata-maru", "Komagata_Maru_incident", "ਕਾਮਾਗਾਟਾ ਮਾਰੂ ਘਟਨਾ", "Komagata Maru incident"),

  // Jangein
  t("battle", "bhangani", "Battle_of_Bhangani", "ਭੰਗਾਣੀ ਦੀ ਲੜਾਈ", "Battle of Bhangani"),
  t("battle", "chamkaur", "Battle_of_Chamkaur", "ਚਮਕੌਰ ਦੀ ਲੜਾਈ", "Battle of Chamkaur"),
  t("battle", "muktsar", "Battle_of_Muktsar", "ਮੁਕਤਸਰ ਦੀ ਲੜਾਈ", "Battle of Muktsar"),
  t("battle", "chappar-chiri", "Battle_of_Chappar_Chiri", "ਚੱਪੜਚਿੜੀ ਦੀ ਲੜਾਈ", "Battle of Chappar Chiri", true),
  t("battle", "saragarhi", "Battle_of_Saragarhi", "ਸਾਰਾਗੜ੍ਹੀ ਦੀ ਲੜਾਈ", "Battle of Saragarhi"),
  t("battle", "jamrud", "Battle_of_Jamrud", "ਜਮਰੌਦ ਦੀ ਲੜਾਈ", "Battle of Jamrud"),
  t("battle", "sobraon", "Battle_of_Sobraon", "ਸਭਰਾਉਂ ਦੀ ਲੜਾਈ", "Battle of Sobraon"),
  t("battle", "first-anglo-sikh-war", "First_Anglo-Sikh_War", "ਪਹਿਲੀ ਐਂਗਲੋ-ਸਿੱਖ ਜੰਗ", "First Anglo-Sikh War"),
  t("battle", "second-anglo-sikh-war", "Second_Anglo-Sikh_War", "ਦੂਜੀ ਐਂਗਲੋ-ਸਿੱਖ ਜੰਗ", "Second Anglo-Sikh War"),

  // Mahan shakhsiyatein
  t("person", "mata-gujri", "Mata_Gujri", "ਮਾਤਾ ਗੁਜਰੀ ਜੀ", "Mata Gujri", true),
  t("person", "banda-singh-bahadur", "Banda_Singh_Bahadur", "ਬਾਬਾ ਬੰਦਾ ਸਿੰਘ ਬਹਾਦਰ", "Banda Singh Bahadur", true),
  t("person", "bhai-mani-singh", "Bhai_Mani_Singh", "ਭਾਈ ਮਨੀ ਸਿੰਘ", "Bhai Mani Singh"),
  t("person", "baba-deep-singh", "Baba_Deep_Singh", "ਬਾਬਾ ਦੀਪ ਸਿੰਘ ਜੀ", "Baba Deep Singh"),
  t("person", "nawab-kapur-singh", "Nawab_Kapur_Singh", "ਨਵਾਬ ਕਪੂਰ ਸਿੰਘ", "Nawab Kapur Singh"),
  t("person", "jassa-singh-ahluwalia", "Jassa_Singh_Ahluwalia", "ਜੱਸਾ ਸਿੰਘ ਆਹਲੂਵਾਲੀਆ", "Jassa Singh Ahluwalia"),
  t("person", "jassa-singh-ramgarhia", "Jassa_Singh_Ramgarhia", "ਜੱਸਾ ਸਿੰਘ ਰਾਮਗੜ੍ਹੀਆ", "Jassa Singh Ramgarhia"),
  t("person", "maharaja-ranjit-singh", "Ranjit_Singh", "ਮਹਾਰਾਜਾ ਰਣਜੀਤ ਸਿੰਘ", "Maharaja Ranjit Singh"),
  t("person", "hari-singh-nalwa", "Hari_Singh_Nalwa", "ਹਰੀ ਸਿੰਘ ਨਲੂਆ", "Hari Singh Nalwa"),
  t("person", "mai-bhago", "Mai_Bhago", "ਮਾਈ ਭਾਗੋ", "Mai Bhago"),
  t("person", "bhai-kanhaiya", "Bhai_Kanhaiya", "ਭਾਈ ਕਨ੍ਹਈਆ ਜੀ", "Bhai Kanhaiya"),
  t("person", "bhai-gurdas", "Bhai_Gurdas", "ਭਾਈ ਗੁਰਦਾਸ", "Bhai Gurdas"),
  t("person", "bhagat-singh", "Bhagat_Singh", "ਸ਼ਹੀਦ ਭਗਤ ਸਿੰਘ", "Shaheed Bhagat Singh"),
  t("person", "udham-singh", "Udham_Singh", "ਸ਼ਹੀਦ ਊਧਮ ਸਿੰਘ", "Shaheed Udham Singh"),
  t("person", "kartar-singh-sarabha", "Kartar_Singh_Sarabha", "ਕਰਤਾਰ ਸਿੰਘ ਸਰਾਭਾ", "Kartar Singh Sarabha"),

  // Itihaasik gurdwaare
  t("gurdwara", "harmandir-sahib", "Golden_Temple", "ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ", "Sri Harmandir Sahib"),
  t("gurdwara", "akal-takht", "Akal_Takht", "ਸ੍ਰੀ ਅਕਾਲ ਤਖ਼ਤ ਸਾਹਿਬ", "Sri Akal Takht Sahib"),
  t("gurdwara", "anandpur-sahib", "Anandpur_Sahib", "ਸ੍ਰੀ ਆਨੰਦਪੁਰ ਸਾਹਿਬ", "Sri Anandpur Sahib"),
  t("gurdwara", "fatehgarh-sahib", "Gurdwara_Fatehgarh_Sahib", "ਗੁਰਦੁਆਰਾ ਫ਼ਤਿਹਗੜ੍ਹ ਸਾਹਿਬ", "Gurdwara Fatehgarh Sahib", true),
  t("gurdwara", "nankana-sahib", "Nankana_Sahib", "ਸ੍ਰੀ ਨਨਕਾਣਾ ਸਾਹਿਬ", "Sri Nankana Sahib"),
  t("gurdwara", "kartarpur-sahib", "Gurdwara_Darbar_Sahib_Kartarpur", "ਸ੍ਰੀ ਕਰਤਾਰਪੁਰ ਸਾਹਿਬ", "Sri Kartarpur Sahib"),
  t("gurdwara", "bangla-sahib", "Gurdwara_Bangla_Sahib", "ਗੁਰਦੁਆਰਾ ਬੰਗਲਾ ਸਾਹਿਬ", "Gurdwara Bangla Sahib"),
  t("gurdwara", "sis-ganj-sahib", "Gurdwara_Sis_Ganj_Sahib", "ਗੁਰਦੁਆਰਾ ਸੀਸ ਗੰਜ ਸਾਹਿਬ", "Gurdwara Sis Ganj Sahib"),
  t("gurdwara", "hazur-sahib", "Hazur_Sahib", "ਸ੍ਰੀ ਹਜ਼ੂਰ ਸਾਹਿਬ", "Sri Hazur Sahib"),
  t("gurdwara", "patna-sahib", "Takht_Sri_Patna_Sahib", "ਤਖ਼ਤ ਸ੍ਰੀ ਪਟਨਾ ਸਾਹਿਬ", "Takht Sri Patna Sahib"),
  t("gurdwara", "damdama-sahib", "Takht_Sri_Damdama_Sahib", "ਤਖ਼ਤ ਸ੍ਰੀ ਦਮਦਮਾ ਸਾਹਿਬ", "Takht Sri Damdama Sahib"),
  t("gurdwara", "hemkund-sahib", "Hemkund_Sahib", "ਸ੍ਰੀ ਹੇਮਕੁੰਟ ਸਾਹਿਬ", "Sri Hemkunt Sahib"),

  // Sikh dharam ka vikas
  t("development", "sikhism", "Sikhism", "ਸਿੱਖ ਧਰਮ", "Sikhism"),
  t("development", "history-of-sikhism", "History_of_Sikhism", "ਸਿੱਖ ਧਰਮ ਦਾ ਇਤਿਹਾਸ", "History of Sikhism"),
  t("development", "gurmukhi", "Gurmukhi", "ਗੁਰਮੁਖੀ ਲਿਪੀ", "Gurmukhi script"),
  t("development", "langar", "Langar_(Sikhism)", "ਲੰਗਰ", "Langar"),
  t("development", "panj-pyare", "Panj_Pyare", "ਪੰਜ ਪਿਆਰੇ", "Panj Pyare"),
  t("development", "five-ks", "Five_Ks", "ਪੰਜ ਕਕਾਰ", "The Five Ks"),
  t("development", "misls", "Misl", "ਸਿੱਖ ਮਿਸਲਾਂ", "The Sikh Misls"),
  t("development", "sgpc", "Shiromani_Gurdwara_Parbandhak_Committee", "ਸ਼੍ਰੋਮਣੀ ਗੁਰਦੁਆਰਾ ਪ੍ਰਬੰਧਕ ਕਮੇਟੀ", "SGPC"),
  t("development", "nitnem", "Nitnem", "ਨਿਤਨੇਮ", "Nitnem"),
];

export const findTopic = (slug: string) => topics.find((x) => x.slug === slug);