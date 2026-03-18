"use client";
import { Globe3D, GlobeMarker } from "@/components/ui/3d-globe";
import { useState, useEffect, useRef } from "react";
import { X, Star, MapPin, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sophie M.",
    role: "Voyageuse",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    message: "Service exceptionnel ! La voiture était impeccable et l'accueil très chaleureux. Je recommande vivement.",
    date: "Il y a 2 jours",
    location: "Paris, France",
    lat: 48.8566, lng: 2.3522,
  },
  {
    id: 2,
    name: "Thomas B.",
    role: "Homme d'affaires",
    avatar: "https://i.pravatar.cc/150?img=2",
    rating: 5,
    message: "Rapide, efficace et professionnel. La livraison à l'aéroport était parfaite, la voiture prête à l'heure.",
    date: "Il y a 1 semaine",
    location: "Lyon, France",
    lat: 45.7640, lng: 4.8357,
  },
  {
    id: 3,
    name: "Emma L.",
    role: "Touriste",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    message: "Incredible service, very professional team. The car was spotless and the team super helpful!",
    date: "3 days ago",
    location: "Londres, UK",
    lat: 51.5074, lng: -0.1278,
  },
  {
    id: 4,
    name: "Carlos R.",
    role: "Photographe",
    avatar: "https://i.pravatar.cc/150?img=8",
    rating: 5,
    message: "Excelente servicio, el coche estaba impecable. La entrega en el aeropuerto fue perfecta. ¡Lo recomiendo!",
    date: "Hace 5 días",
    location: "Madrid, Espagne",
    lat: 40.4168, lng: -3.7038,
  },
  {
    id: 5,
    name: "Fatima A.",
    role: "Famille",
    avatar: "https://i.pravatar.cc/150?img=9",
    rating: 5,
    message: "Accueil chaleureux, voiture propre et récente. L'équipe est très disponible sur WhatsApp. Je reviendrai !",
    date: "Il y a 3 jours",
    location: "Casablanca, Maroc",
    lat: 33.5731, lng: -7.5898,
  },
  {
    id: 6,
    name: "Ahmed K.",
    role: "Businessman",
    avatar: "https://i.pravatar.cc/150?img=11",
    rating: 5,
    message: "Premium service, exactly as described. The delivery to our hotel was impeccable. Highly recommended.",
    date: "4 days ago",
    location: "Dubai, UAE",
    lat: 25.2048, lng: 55.2708,
  },
  {
    id: 7,
    name: "Julia S.",
    role: "Reisende",
    avatar: "https://i.pravatar.cc/150?img=20",
    rating: 4,
    message: "Sehr professionell und zuverlässig. Das Fahrzeug war in einwandfreiem Zustand. Gerne wieder!",
    date: "Vor 1 Woche",
    location: "Munich, Allemagne",
    lat: 48.1351, lng: 11.5820,
  },
  {
    id: 8,
    name: "Yuki T.",
    role: "Tourist",
    avatar: "https://i.pravatar.cc/150?img=30",
    rating: 5,
    message: "Wonderful experience. Everything was organized perfectly. Very friendly and professional team!",
    date: "2 weeks ago",
    location: "Tokyo, Japon",
    lat: 35.6762, lng: 139.6503,
  },
  {
    id: 9,
    name: "Nour B.",
    role: "Voyageuse",
    avatar: "https://i.pravatar.cc/150?img=45",
    rating: 5,
    message: "Super service, livraison rapide à l'aéroport Menara. L'équipe est vraiment aux petits soins. Merci !",
    date: "Il y a 4 jours",
    location: "Tunis, Tunisie",
    lat: 36.8065, lng: 10.1815,
  },
  {
    id: 10,
    name: "Marc D.",
    role: "Touriste",
    avatar: "https://i.pravatar.cc/150?img=52",
    rating: 4,
    message: "Great car, great price. The team was super helpful and friendly. Would absolutely rent again. Merci !",
    date: "1 week ago",
    location: "Montréal, Canada",
    lat: 45.5017, lng: -73.5673,
  },
  {
    id: 11,
    name: "Mehdi O.",
    role: "Famille",
    avatar: "https://i.pravatar.cc/150?img=33",
    rating: 5,
    message: "Prix transparents, aucune mauvaise surprise. L'équipe est très réactive sur WhatsApp. Je recommande !",
    date: "Il y a 6 jours",
    location: "Bruxelles, Belgique",
    lat: 50.8503, lng: 4.3517,
  },
  {
    id: 12,
    name: "Lena V.",
    role: "Reiziger",
    avatar: "https://i.pravatar.cc/150?img=25",
    rating: 5,
    message: "Geweldige ervaring! Super vriendelijk team en perfecte auto. Aanrader voor iedereen in Marrakesh.",
    date: "5 dagen geleden",
    location: "Amsterdam, NL",
    lat: 52.3676, lng: 4.9041,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

// Floating bubble that follows a marker on the globe
function FloatingBubble({
  testimonial,
  side,
}: {
  testimonial: typeof testimonials[0] | null;
  side: "left" | "right";
}) {
  if (!testimonial) return null;
  return (
    <div
      className={`absolute bottom-8 ${side === "right" ? "right-4" : "left-4"} 
        max-w-[280px] w-full pointer-events-none
        animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div
        style={{
          background: "rgba(10,15,40,0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(228,184,106,0.3)",
          borderRadius: 16,
          padding: "12px 14px",
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-10 h-10 rounded-full object-cover"
            style={{ border: "2px solid #e4b86a" }}
          />
          <div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "#e4b86a", fontWeight: 700, fontSize: 14, margin: 0 }}>
              {testimonial.name}
            </p>
            <div className="flex items-center gap-1">
              <MapPin size={10} className="text-white/40" />
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, margin: 0 }}>{testimonial.location}</p>
            </div>
          </div>
        </div>
        <StarRating rating={testimonial.rating} />
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 11.5, lineHeight: 1.55, margin: "8px 0 0" }}>
          « {testimonial.message.substring(0, 90)}{testimonial.message.length > 90 ? "…" : ""} »
        </p>
      </div>
    </div>
  );
}

export function TestimonialGlobe() {
  const [selected, setSelected] = useState<typeof testimonials[0] | null>(null);
  const [hovered, setHovered]   = useState<typeof testimonials[0] | null>(null);

  const markers: GlobeMarker[] = testimonials.map((t) => ({
    lat: t.lat,
    lng: t.lng,
    src: t.avatar,
    label: t.name,
    data: t,
  }));

  return (
    <>
      {/* font import */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

      <section
        style={{
          position: "relative",
          width: "100%",
          background: "#070714",
          fontFamily: "'DM Sans', sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            position: "absolute", top: 0, left: 0, right: 0,
            zIndex: 10, textAlign: "center", padding: "28px 20px 0",
            background: "linear-gradient(to bottom, #070714 0%, transparent 100%)",
          }}
        >
          <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#e4b86a", margin: "0 0 8px" }}>
            Témoignages clients
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 6px",
              lineHeight: 1.1,
            }}
          >
            Ils nous font confiance
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0 }}>
            Clients du monde entier · Location de voitures à Marrakech
          </p>
        </div>

        {/* Globe */}
        <Globe3D
          markers={markers}
          config={{ autoRotateSpeed: 0.3, markerSize: 1 }}
          onMarkerClick={(m) => setSelected(m.data)}
          onMarkerHover={(m) => setHovered(m?.data ?? null)}
        />

        {/* Hover bubble */}
        {hovered && !selected && (
          <FloatingBubble testimonial={hovered} side="right" />
        )}

        {/* Bottom gradient */}
        <div
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 70,
            background: "linear-gradient(to top, #070714, transparent)",
            pointerEvents: "none",
          }}
        />

        {/* Hint */}
        <p
          style={{
            position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
            fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase",
            color: "rgba(228,184,106,0.5)", margin: 0, whiteSpace: "nowrap",
          }}
        >
          Cliquez sur un avatar pour lire l'avis complet
        </p>
      </section>

      {/* Modal */}
      {selected && (
        <div
          style={{
            position: "fixed", inset: 0,
            background: "rgba(4,8,24,0.8)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 460,
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(228,184,106,0.2)",
              animation: "modalUp 0.3s cubic-bezier(0.34,1.45,0.64,1) forwards",
            }}
          >
            <style>{`
              @keyframes modalUp {
                from { opacity: 0; transform: translateY(28px) scale(0.96); }
                to   { opacity: 1; transform: translateY(0)    scale(1);    }
              }
            `}</style>

            {/* Hero banner */}
            <div
              style={{
                position: "relative",
                height: 140,
                background: "linear-gradient(135deg, #0d2548 0%, #1a3a6e 50%, #0a1e3e 100%)",
                display: "flex", alignItems: "flex-end",
                padding: "0 24px 0",
              }}
            >
              {/* Stars pattern */}
              <div style={{ position: "absolute", inset: 0, opacity: 0.3, background: "radial-gradient(ellipse at 30% 50%, rgba(228,184,106,0.15) 0%, transparent 60%)" }} />

              <div style={{ position: "absolute", top: 12, right: 12 }}>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ position: "relative", zIndex: 1, transform: "translateY(40px)", display: "flex", alignItems: "flex-end", gap: 16 }}>
                <img
                  src={selected.avatar}
                  alt={selected.name}
                  style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "3px solid #e4b86a", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
                />
                <div style={{ paddingBottom: 4 }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 2px" }}>
                    {selected.name}
                  </p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0 }}>{selected.role}</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div
              style={{
                background: "#0d1628",
                padding: "52px 24px 24px",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <StarRating rating={selected.rating} />
                <div className="flex items-center gap-1">
                  <MapPin size={12} style={{ color: "#e4b86a" }} />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{selected.location}</span>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(228,184,106,0.15)",
                  borderRadius: 12,
                  padding: "16px",
                  position: "relative",
                }}
              >
                <Quote size={20} style={{ color: "#e4b86a", opacity: 0.5, marginBottom: 8 }} />
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
                  {selected.message}
                </p>
              </div>

              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "12px 0 20px", textAlign: "right" }}>
                {selected.date}
              </p>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  style={{
                    flex: 1, padding: "12px 20px", borderRadius: 100, border: "none", cursor: "pointer",
                    background: "linear-gradient(135deg, #b8843a 0%, #e4b86a 60%, #f5c97a 100%)",
                    color: "#2c1a0e", fontWeight: 600, fontSize: 13, letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Réserver maintenant
                </button>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    padding: "12px 20px", borderRadius: 100,
                    border: "1px solid rgba(228,184,106,0.3)",
                    background: "transparent", color: "#e4b86a",
                    cursor: "pointer", fontSize: 13,
                  }}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}