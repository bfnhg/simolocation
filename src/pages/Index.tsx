import { useState, useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import HeroCarousel from "@/components/HeroCarousel";
import CarCard from "@/components/CarCard";
import ReservationModal from "@/components/ReservationModal";
import CarDetailsModal from "@/components/CarDetailsModal";
import Navbar from "@/components/Navbar";
import WhyChooseUs from "@/components/WhyChooseUs";
import ContactSection from "@/components/ContactSection";
import { cars, Car, categories, CarCategory } from "@/data/cars";
import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TestimonialGlobe } from "@/components/Testimonials";

const Index = () => {
  const [reserveCar, setReserveCar] = useState<Car | null>(null);
  const [detailsCar, setDetailsCar] = useState<Car | null>(null);
  const [activeCategory, setActiveCategory] = useState<CarCategory | "all">("all");
  const [pickupDate, setPickupDate] = useState<Date>();

  const filteredCars = useMemo(() => {
    if (activeCategory === "all") return cars;
    return cars.filter((c) => c.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroCarousel />

      <WhyChooseUs />

      {/* Cars Section */}
      <section id="cars" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
              Nos <span className="text-gradient">Voitures</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Choisissez parmi notre flotte premium de véhicules disponibles à Marrakech
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-display font-semibold transition-all duration-200 border",
                  activeCategory === cat.value
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                )}
              >
                {cat.label}
              </button>
            ))}

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "rounded-full px-5 font-display font-semibold text-sm gap-2",
                    !pickupDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="w-4 h-4" />
                  {pickupDate ? format(pickupDate, "dd MMM yyyy", { locale: fr }) : "Date de prise"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={pickupDate}
                  onSelect={setPickupDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onReserve={setReserveCar}
                onDetails={setDetailsCar}
              />
            ))}
            {filteredCars.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground py-12">
                Aucun véhicule trouvé dans cette catégorie.
              </p>
            )}
          </div>
        </div>
      </section>
      <TestimonialGlobe />

      <ContactSection />


      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="font-display text-lg font-bold text-gradient mb-3">Marrakech Auto Location</h3>
            <p className="text-muted-foreground">Votre partenaire de confiance pour la location de voitures à Marrakech depuis 2015.</p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">Contact</h4>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +212 6XX XXX XXX</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> contact@marrakechauto.ma</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Guéliz, Marrakech</div>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">Horaires</h4>
            <p className="text-muted-foreground">Lun - Sam: 8h00 - 20h00</p>
            <p className="text-muted-foreground">Dimanche: 9h00 - 18h00</p>
          </div>
        </div>
        <div className="container mx-auto mt-8 pt-6 border-t border-border text-center text-muted-foreground text-xs">
          © 2026 Marrakech Auto Location. Tous droits réservés.
        </div>
      </footer>

      {/* Modals */}
      {reserveCar && (
        <ReservationModal car={reserveCar} onClose={() => setReserveCar(null)} />
      )}
      {detailsCar && (
        <CarDetailsModal
          car={detailsCar}
          onClose={() => setDetailsCar(null)}
          onReserve={(car) => {
            setDetailsCar(null);
            setReserveCar(car);
          }}
        />
      )}
    </div>
  );
};

export default Index;
