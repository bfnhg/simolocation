import { Car } from "@/data/cars";
import { X, Fuel, Settings2, Users, CarFront, Check } from "lucide-react";

interface CarDetailsModalProps {
  car: Car;
  onClose: () => void;
  onReserve: (car: Car) => void;
}

const CarDetailsModal = ({ car, onClose, onReserve }: CarDetailsModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-background/60 text-foreground hover:bg-background transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Image */}
        <div className="relative h-64 md:h-80">
          <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6">
            <h2 className="font-display text-3xl font-bold text-foreground">{car.name}</h2>
            <p className="text-primary font-display font-semibold text-lg">{car.price} MAD/jour</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-muted-foreground mb-6">{car.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { icon: Fuel, label: "Carburant", value: car.fuel },
              { icon: Settings2, label: "Transmission", value: car.transmission },
              { icon: Users, label: "Places", value: `${car.seats} places` },
              { icon: CarFront, label: "Année", value: `${car.year}` },
            ].map((spec) => (
              <div key={spec.label} className="p-3 rounded-lg bg-secondary text-center">
                <spec.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">{spec.label}</p>
                <p className="text-sm font-semibold text-foreground">{spec.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="font-display font-semibold text-foreground mb-3">Inclus dans le prix</h3>
            <div className="grid grid-cols-2 gap-2">
              {["Kilométrage illimité", "Assurance tous risques", "Assistance 24/7", "Annulation gratuite"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-primary" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onReserve(car)}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold text-base hover:opacity-90 transition-opacity"
          >
            Réserver maintenant
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsModal;
