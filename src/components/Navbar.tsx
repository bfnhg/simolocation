import { Phone } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-5xl bg-glass border border-border rounded-2xl shadow-lg">
      <div className="px-6 h-14 flex items-center justify-between">
        <a href="/" className="font-display text-xl font-bold text-gradient">
          Marrakech Auto
        </a>
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#cars" className="hover:text-foreground transition-colors">Nos voitures</a>
          <a href="#" className="hover:text-foreground transition-colors">À propos</a>
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-primary" />
            <span>+212 6XX XXX XXX</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
