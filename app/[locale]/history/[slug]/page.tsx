import Container from "@/components/Container";
import PageBanner from "@/components/PageBanner";
import { x } from "@/lib/extra";
import { guruNote } from "@/lib/gurus";
import { getTopicSummary } from "@/lib/history";
import { findTopic, topics } from "@/lib/history-topics";
import { isLocale } from "@/lib/i18n";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 604800; // 7 din

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const topic = findTopic(slug);
  if (!topic || !isLocale(locale)) return {};
  return { title: `${topic.name[locale]} | Ramgarh Sainian` };
}

export default async function HistoryTopicPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const topic = findTopic(slug);
  if (!topic) notFound();

  const { data, fallback } = await getTopicSummary(topic.wiki, locale);
  const guru = guruNote(topic.guru, locale);
  const name = topic.name[locale];
  const related = topics.filter((t) => t.group === topic.group && t.slug !== topic.slug).slice(0, 6);
  const wikiUrl = data?.url ?? `https://en.wikipedia.org/wiki/${topic.wiki}`;

  return (
    <>
      <PageBanner title={name} subtitle={data?.description} image="/images/hero.jpg" />
      <Container className="max-w-2xl space-y-6 py-8">
        {/* Guru sahiban ke liye hamara apna parichay (upar) */}
        {guru && (
          <section className="rounded-2xl border-l-4 border-saffron bg-white p-5 shadow-sm">
            <h2 className="font-bold">
              {guru.title} <span className="font-normal text-navy/60">({guru.years})</span>
            </h2>
            <p className="mt-2 text-navy/80">{guru.text}</p>
            <p className="mt-2 text-xs text-navy/50">{x.guruNoteCaption[locale]}</p>
          </section>
        )}

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-bold">{x.fromWikipedia[locale]}</h2>

          {data?.image && (
            <figure className="mx-auto mb-4 max-w-xs overflow-hidden rounded-xl bg-cream">
              <Image
                src={data.image.src}
                alt={name}
                width={data.image.width}
                height={data.image.height}
                sizes="(max-width: 9600px) 90vw, 960px"
                className="h-auto w-full"
              />
              <figcaption className="p-2 text-center text-xs text-navy/60">{x.imageCredit[locale]}</figcaption>
            </figure>
          )}

          {data ? (
            <>
              {fallback && (
                <p className="mb-3 rounded-lg bg-gold/20 p-2 text-sm">{x.wikiFallbackEn[locale]}</p>
              )}
              <p lang={data.lang} className="leading-relaxed text-navy/90">
                {data.extract}
              </p>
            </>
          ) : (
            <p className="text-navy/70">{x.wikiDown[locale]}</p>
          )}

          <a
            href={wikiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-saffron"
          >
            {x.readMoreWiki[locale]} <ExternalLink size={14} />
          </a>
          <p className="mt-3 text-xs text-navy/50">Wikipedia · CC BY-SA</p>
        </section>

        <p className="rounded-xl bg-gold/20 p-3 text-xs text-navy/70">{x.historyDisclaimer[locale]}</p>

        {related.length > 0 && (
          <section>
            <h2 className="mb-2 font-bold">{x.relatedTopics[locale]}</h2>
            <div className="flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${locale}/history/${r.slug}`}
                  className="rounded-full border border-saffron bg-white px-3 py-1.5 text-sm active:scale-95"
                >
                  {r.name[locale]}
                </Link>
              ))}
            </div>
          </section>
        )}

        <Link href={`/${locale}/history`} className="inline-block text-sm font-bold text-saffron">
          ← {x.backToHistory[locale]}
        </Link>
      </Container>
    </>
  );
}