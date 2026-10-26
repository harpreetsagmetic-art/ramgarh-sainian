export default function Footer({ name, location, rights }: { name: string; location: string; rights: string }) {
  return (
    <footer className="bg-navy px-4 py-8 pb-28 text-center text-sm text-white/80 md:pb-8">
      <p className="text-base font-bold text-gold">{name}</p>
      <p className="mt-1">{location}</p>
      <p className="mt-4 text-xs">© {new Date().getFullYear()} {name}. {rights}</p>
    </footer>
  );
}