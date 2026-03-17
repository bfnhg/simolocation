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
    setRotate({
      x: (py - 0.5) * -22,
      y: (px - 0.5) * 22,
    });
    setSpotlight({ x: px * 100, y: py * 100, opacity: 1 });
    setGlare({ x: px * 100, y: py * 100 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setSpotlight((p) => ({ ...p, opacity: 0 }));
    setHovered(false);
  };

  return (
    <>
      <style>{`
        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmerSlide {
          from { transform: translateX(-100%); }
          to   { transform: translateX(200%); }
        }
        @keyframes specFadeIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes floatShadow {
          0%,100% { transform: scaleX(1);    opacity: 0.35; }
          50%      { transform: scaleX(0.92); opacity: 0.2;  }
        }
        .car-card-anim  { animation: cardReveal 0.65s cubic-bezier(.22,1,.36,1) both; }
        .card-shimmer   { animation: shimmerSlide 1.6s ease-in-out infinite; }
        .spec-item      { animation: specFadeIn 0.4s cubic-bezier(.22,1,.36,1) both; }
        .spec-item:nth-child(1) { animation-delay:.05s }
        .spec-item:nth-child(2) { animation-delay:.10s }
        .spec-item:nth-child(3) { animation-delay:.15s }
        .spec-item:nth-child(4) { animation-delay:.20s }
        .card-shadow-blob { animation: floatShadow 3s ease-in-out infinite; }
      `}</style>

      {/* Perspective wrapper */}
      <div
        className="car-card-anim group"
        style={{ perspective: "900px", perspectiveOrigin: "50% 50%" }}
      >
        {/* Floating shadow blob under card */}
        <div
          className="card-shadow-blob mx-auto"
          style={{
            height: "18px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(120,50,10,0.3) 0%, transparent 70%)",
            marginTop: hovered ? "12px" : "4px",
            width: "80%",
            transition: "margin-top 0.3s ease",
            transformOrigin: "center",
            position: "relative",
            top: "0",
            zIndex: 0,
          }}
        />

        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={() => setHovered(true)}
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(${hovered ? "20px" : "0px"})`,
            transition: hovered
              ? "transform 0.08s linear"
              : "transform 0.5s cubic-bezier(.22,1,.36,1)",
            transformStyle: "preserve-3d",
            willChange: "transform",
            marginTop: "-18px",
            position: "relative",
            zIndex: 1,
            boxShadow: hovered
              ? `${-rotate.y * 0.8}px ${rotate.x * 0.8}px 40px rgba(120,50,10,0.22), 0 30px 70px rgba(120,50,10,0.2)`
              : "0 8px 30px rgba(120,50,10,0.12)",
          }}
          className="relative overflow-hidden rounded-2xl border border-[rgba(176,72,24,0.2)] bg-[#fdf5ec]"
        >
          {/* Glare layer — moves with mouse */}
          <div
            className="pointer-events-none absolute inset-0 z-30 rounded-2xl overflow-hidden"
            style={{ mixBlendMode: "overlay" }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,220,150,0.45) 0%, transparent 55%)`,
                opacity: spotlight.opacity,
                transition: "opacity 0.3s ease",
              }}
            />
          </div>

          {/* Spotlight depth glow */}
          <div
            style={{
              background: `radial-gradient(280px circle at ${spotlight.x}% ${spotlight.y}%, rgba(192,92,32,0.13), transparent 70%)`,
              opacity: spotlight.opacity,
              transition: "opacity 0.25s ease",
            }}
            className="pointer-events-none absolute inset-0 z-10"
          />

          {/* Top shimmer line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px overflow-hidden">
            <div className="h-full bg-gradient-to-r from-transparent via-[rgba(176,72,24,0.5)] to-transparent" />
            {hovered && (
              <div className="card-shimmer absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[rgba(255,180,80,0.7)] to-transparent" />
            )}
          </div>

          {/* 3D depth edge — bottom */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1 rounded-b-2xl"
            style={{
              background: "linear-gradient(to top, rgba(120,50,10,0.12), transparent)",
              transform: "translateZ(-2px)",
            }}
          />

          {/* Image */}
          <div className="relative h-52 overflow-hidden">
            {!imgLoaded && (
              <div className="absolute inset-0 bg-[rgba(176,72,24,0.06)] animate-pulse" />
            )}
            <img
              src={car.image}
              alt={car.name}
              className={`w-full h-full object-cover ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              style={{
                transform: `scale(${hovered ? 1.1 : 1.0}) translateZ(0)`,
                transition: "transform 0.6s cubic-bezier(.22,1,.36,1), opacity 0.4s",
              }}
              onLoad={() => setImgLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#fdf5ec] via-[rgba(253,245,236,0.15)] to-transparent" />
          </div>

          {/* Content */}
          <div className="p-5 relative z-10">

            {/* Title + Price */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3
                className="font-bold text-xl text-[#2c1005] leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {car.name}
              </h3>
              <div className="shrink-0 flex flex-col items-end">
                <span
                  className="text-xl font-bold leading-none"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    background: "linear-gradient(135deg, #c05c20, #8f3810)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {car.price}€
                </span>
                <span
                  className="text-[0.6rem] font-medium tracking-widest uppercase text-[rgba(44,16,5,0.4)] mt-0.5"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  / jour
                </span>
              </div>
            </div>

            <p
              className="text-[rgba(44,16,5,0.45)] text-sm mb-4"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {car.brand} · {car.year}
            </p>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-2 mb-5 text-sm">
              {[
                { icon: <Fuel className="w-4 h-4 text-[#b04818]" />, label: car.fuel },
                { icon: <Settings2 className="w-4 h-4 text-[#b04818]" />, label: car.transmission },
                { icon: <Users className="w-4 h-4 text-[#b04818]" />, label: `${car.seats} places` },
                { icon: <CarFront className="w-4 h-4 text-[#b04818]" />, label: car.brand },
              ].map((s, i) => (
                <div
                  key={i}
                  className="spec-item flex items-center gap-2 text-[rgba(44,16,5,0.55)]"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {s.icon}
                  {s.label}
                </div>
              ))}
            </div>

            {/* Divider */}
            <div
              className="h-px mb-4"
              style={{
                background: hovered
                  ? "linear-gradient(to right, transparent, rgba(176,72,24,0.4), transparent)"
                  : "linear-gradient(to right, transparent, rgba(176,72,24,0.15), transparent)",
                transition: "background 0.4s ease",
              }}
            />

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => onReserve(car)}
                className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm text-[#fdf5ec]"
                style={{
                  background: "linear-gradient(135deg, #c05c20 0%, #8f3810 100%)",
                  boxShadow: hovered
                    ? "0 8px 28px rgba(144,56,16,0.5), inset 0 1px 0 rgba(255,200,120,0.2)"
                    : "0 4px 16px rgba(144,56,16,0.3), inset 0 1px 0 rgba(255,200,120,0.15)",
                  transform: hovered ? "translateY(-1px) translateZ(8px)" : "translateY(0)",
                  transition: "all 0.2s ease",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                Réserver
              </button>
              <button
                onClick={() => onDetails(car)}
                className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm"
                style={{
                  border: "1.5px solid rgba(176,72,24,0.3)",
                  color: "#7a3010",
                  background: hovered ? "rgba(176,72,24,0.06)" : "transparent",
                  transition: "all 0.2s ease",
                  fontFamily: "'Outfit', sans-serif",
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