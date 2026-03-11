import { useState } from "react";
import { Car } from "@/data/cars";
import { CarFront, Fuel, Users, Settings2 } from "lucide-react";

interface CarCardProps {
  car: Car;
  onReserve: (car: Car) => void;
  onDetails: (car: Car) => void;
}

const CarCard = ({ car, onReserve, onDetails }: CarCardProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="card-material overflow-hidden group">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {!imgLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
        <img
          src={car.image}
          alt={car.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
        />
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-display font-semibold shadow-lg">
          {car.price} MAD/jour
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-xl font-bold text-foreground mb-1">{car.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{car.brand} · {car.year}</p>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-2 mb-5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Fuel className="w-4 h-4 text-primary" />
            {car.fuel}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Settings2 className="w-4 h-4 text-primary" />
            {car.transmission}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            {car.seats} places
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CarFront className="w-4 h-4 text-primary" />
            {car.brand}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onReserve(car)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-opacity shadow-md"
          >
            Réserver
          </button>
          <button
            onClick={() => onDetails(car)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border text-foreground font-display font-semibold text-sm hover:bg-secondary transition-colors"
          >
            Détails
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
