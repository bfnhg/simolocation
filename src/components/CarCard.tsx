import { useState, useRef, MouseEvent } from "react";
import { Car } from "@/data/cars";
import { CarFront, Fuel, Users, Settings2 } from "lucide-react";

interface CarCardProps {
  car: Car;
  onReserve: (car: Car) => void;
  onDetails: (car: Car) => void;
}

const CarCard = ({ car, onReserve, onDetails }: CarCardProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 });
  const [hovered, setHovered] = useState(false);
  const [glare, setGlare] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;

    setRotate({ x: (py - 0.5) * -22, y: (px - 0.5) * 22 });
    setSpotlight({ x: px * 100, y: py * 100, opacity: 1 });
    setGlare({ x: px * 100, y: py * 100 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setSpotlight((p) => ({ ...p, opacity: 0 }));
    setHovered(false);
  };

  const handleReserveClick = () => {
    onReserve(car);
  };

  return (
    <>
      <style>{`
        @keyframes cardReveal { from { opacity: 0; transform: translateY(28px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes shimmerSlide { from { transform: translateX(-100%); } to { transform: translateX(200%); } }
        @keyframes specFadeIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        .car-card-anim { animation: cardReveal 0.65s cubic-bezier(.22,1,.36,1) both; }
        .card-shimmer { animation: shimmerSlide 1.6s ease-in-out infinite; }
        .spec-item { animation: specFadeIn 0.4s cubic-bezier(.22,1,.36,1) both; }
        .spec-item:nth-child(1) { animation-delay:.05s }
        .spec-item:nth-child(2) { animation-delay:.10s }
        .spec-item:nth-child(3) { animation-delay:.15s }
        .spec-item:nth-child(4) { animation-delay:.20s }
      `}</style>

      <div className="car-card-anim group" style={{ perspective: "900px", perspectiveOrigin: "50% 50%" }}>
        <div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={() => setHovered(true)}
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(${hovered ? "20px" : "0px"})`,
            transition: hovered ? "transform 0.08s linear" : "transform 0.5s cubic-bezier(.22,1,.36,1)",
            transformStyle: "preserve-3d",
          }}
          className="relative overflow-hidden rounded-2xl border border-[rgba(176,72,24,0.2)] bg-[#fdf5ec]"
        >
          {/* Image sans dégradé de couleur */}
          <div className="relative h-52 overflow-hidden">
            {!imgLoaded && (
              <div className="absolute inset-0 bg-[rgba(176,72,24,0.06)] animate-pulse" />
            )}
            <img 
              src={car.image} 
              alt={car.name} 
              className={`w-full h-full object-cover ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              style={{ 
                transform: `scale(${hovered ? 1.1 : 1.0})`,
                transition: "transform 0.6s cubic-bezier(.22,1,.36,1)"
              }}
              onLoad={() => setImgLoaded(true)} 
            />
          </div>

          <div className="p-5 relative z-10">
            {/* Titre + Prix en € + Franchise */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-xl text-[#2c1005] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                {car.name}
              </h3>
              <div className="shrink-0 flex flex-col items-end">
                {/* Prix en Euros */}
                <span 
                  className="text-xl font-bold" 
                  style={{ 
                    fontFamily: "'Playfair Display', serif", 
                    background: "linear-gradient(135deg, #c05c20, #8f3810)", 
                    WebkitBackgroundClip: "text", 
                    WebkitTextFillColor: "transparent" 
                  }}
                >
                  {car.price}€
                </span>
                <span className="text-[0.6rem] font-medium tracking-widest uppercase text-[rgba(44,16,5,0.4)] mt-0.5">
                  / jour
                </span>

                {/* Franchise en MAD */}
                <span className="text-xs font-medium text-orange-700 mt-1">
                  Franchise : {car.franchise.toLocaleString()} euros
                </span>
              </div>
            </div>

            <p className="text-[rgba(44,16,5,0.45)] text-sm mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {car.brand} · {car.year}
            </p>

            {/* Spécifications */}
            <div className="grid grid-cols-2 gap-2 mb-5 text-sm">
              {[
                { icon: <Fuel className="w-4 h-4 text-[#b04818]" />, label: car.fuel },
                { icon: <Settings2 className="w-4 h-4 text-[#b04818]" />, label: car.transmission },
                { icon: <Users className="w-4 h-4 text-[#b04818]" />, label: `${car.seats} places` },
                { icon: <CarFront className="w-4 h-4 text-[#b04818]" />, label: car.brand },
              ].map((s, i) => (
                <div key={i} className="spec-item flex items-center gap-2 text-[rgba(44,16,5,0.55)]">
                  {s.icon} {s.label}
                </div>
              ))}
            </div>

            {/* Boutons */}
            <div className="flex gap-3">
              <button 
                onClick={handleReserveClick}
                className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm text-[#fdf5ec]"
                style={{
                  background: "linear-gradient(135deg, #c05c20 0%, #8f3810 100%)",
                  boxShadow: "0 4px 16px rgba(144,56,16,0.3)",
                }}
              >
                Réserver
              </button>
              <button 
                onClick={() => onDetails(car)}
                className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm"
                style={{ 
                  border: "1.5px solid rgba(176,72,24,0.3)", 
                  color: "#7a3010" 
                }}
              >
                Détails
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarCard;