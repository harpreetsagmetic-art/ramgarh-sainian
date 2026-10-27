import Image from "next/image";

export default function Footer({ name, location, rights }: { name: string; location: string; rights: string }) {
  return (
    <footer className="bg-navy px-4 py-8 pb-28 text-center text-sm text-white/80 md:pb-8">
      <Image
        src="/images/logo-horizontal.png"
        alt={name}
        width={900}
        height={323}
        className="mx-auto h-auto w-64 md:w-80"
      />
      <p className="mt-3">{location}</p>
      <p className="mt-4 text-xs">© {new Date().getFullYear()} {name}. {rights}</p>
    </footer>
  );
}