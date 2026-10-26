import Image from "next/image";

export default function PageBanner({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle?: string;
  image?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy text-white">
      {image && (
        <Image src={image} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-40" />
      )}
      <div className="px-4 py-10 text-center md:py-16">
        <h1 className="text-3xl font-bold text-gold md:text-4xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-2 max-w-xl text-white/85">{subtitle}</p>}
      </div>
      <div className="h-1.5 bg-linear-to-r from-saffron via-gold to-saffron" />
    </section>
  );
}