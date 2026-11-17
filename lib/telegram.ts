// Telegram Bot API se message bhejne ke chhote helpers (sirf server par).
// Token sirf env se aata hai (TELEGRAM_BOT_TOKEN) aur kabhi log ya jawab mein nahi jaata.

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// HTML parse mode ke liye zaroori: & < > ko badalna
export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function chatIds(): string[] {
  return (process.env.TELEGRAM_CHAT_ID ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function sendOne(chatId: string, html: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN set nahi hai");

  for (let attempt = 0; attempt < 3; attempt++) {
    let res: Response;
    try {
      res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: html,
          parse_mode: "HTML",
          link_preview_options: { is_disabled: true },
        }),
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      // Dhyan: asli error mein URL (yaani token) aa sakta hai, isliye usse aage nahi bhejte
      throw new Error("Telegram tak pahunch nahi paye (network)");
    }

    const j = (await res.json().catch(() => null)) as {
      ok?: boolean;
      description?: string;
      parameters?: { retry_after?: number };
    } | null;

    if (res.ok && j?.ok) return;

    if (res.status === 429) {
      await sleep(Math.min(j?.parameters?.retry_after ?? 2, 10) * 1000); // Telegram ne ruk ne ko kaha
      continue;
    }
    throw new Error(`Telegram ${res.status}: ${j?.description ?? "pata nahi"}`);
  }
  throw new Error("Telegram ne bahut zyada requests ki wajah se roka");
}

// Har chat mein, ek-ek karke (har message ke beech ~1 second: Telegram ki limit ka khayal)
export async function sendMessages(
  messages: string[],
): Promise<{ chats: number; sent: number }> {
  const ids = chatIds();
  if (ids.length === 0) throw new Error("TELEGRAM_CHAT_ID set nahi hai");

  let sent = 0;
  for (const id of ids) {
    for (let i = 0; i < messages.length; i++) {
      await sendOne(id, messages[i]);
      sent++;
      if (i < messages.length - 1) await sleep(1100);
    }
  }
  return { chats: ids.length, sent };
}

// Message bhejne se pehle jaanch (dry-run mein dikhti hai): tag theek band hue? lambai theek hai?
const TAGS = ["b", "i", "u", "blockquote", "a"];

export function validateHtml(html: string): string[] {
  const problems: string[] = [];
  const stack: string[] = [];
  for (const m of html.matchAll(/<(\/?)([a-z]+)([^>]*)>/g)) {
    const [, closing, name] = m;
    if (!TAGS.includes(name)) {
      problems.push(`anjaan tag <${name}>`);
      continue;
    }
    if (!closing) stack.push(name);
    else if (stack.pop() !== name)
      problems.push(`</${name}> galat jagah band hua`);
  }
  if (stack.length) problems.push(`band nahi hue: ${stack.join(", ")}`);

  const rendered = html
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
  if (rendered.length > 4096)
    problems.push(`bahut lamba: ${rendered.length} akshar (limit 4096)`);
  if (rendered.trim().length === 0) problems.push("khaali message");
  return problems;
}
