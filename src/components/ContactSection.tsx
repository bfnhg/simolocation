import { useEffect, useRef, useState } from "react";
import { 
  Mail, MapPin, Phone, LucideIcon, Send, Clock, 
  ChevronRight, Sparkles, Globe, Star, Award 
} from "lucide-react";

/* ==============================================
   CONFIGURATION & CONSTANTES
============================================== */
const WORDS = [
  { text: "Besoin", gradient: false },
  { text: "d'un", gradient: false },
  { text: "véhicule", gradient: false },
  { text: "?", gradient: true },
  { text: "Contactez‑nous.", gradient: true, italic: true },
];

const SUBTITLE = "Des questions ? Notre équipe est à votre écoute 24h/24 pour vous accompagner dans votre location.";

const contactCards: ContactCard[] = [
  {
    title: "Téléphone",
    icon: Phone,
    description: "+212 777 882 400",
    href: "tel:+212777882400",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    title: "Email",
    icon: Mail,
    description: "contact@marrakechauto.ma",
    href: "mailto:contact@marrakechauto.ma",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    title: "Adresse",
    icon: MapPin,
    description: "Guéliz, Marrakech",
    href: "https://www.google.com/maps/place/Marrakech/",
    target: "_blank",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
];

/* ==============================================
   COMPOSANTS D'ANIMATION
============================================== */

// Text Generate Effect avec staggered animation
const TextGenerateEffect = () => {
  const [active, setActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const t = setTimeout(() => setActive(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-amber-200/30 to-orange-200/30 blur-3xl"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
        }}
      />
      <div className="relative flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4">
        {WORDS.map((w, i) => (
          <span
            key={i}
            className={`
              inline-block text-5xl md:text-6xl lg:text-7xl font-black
              transition-all duration-1000 ease-out
              ${active ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-lg translate-y-8'}
              ${w.gradient ? 'bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent' : 'text-gray-900'}
              ${w.italic ? 'italic' : ''}
            `}
            style={{
              fontFamily: "'Playfair Display', serif",
              transitionDelay: `${i * 100}ms`,
              textShadow: active ? '0 10px 30px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {w.text}
          </span>
        ))}
      </div>
    </div>
  );
};

// Typewriter avec effet de glow
const TypewriterSubtitle = () => {
  const [visible, setVisible] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const elRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          let i = 0;
          const id = setInterval(() => {
            i++;
            setVisible(i);
            if (i >= SUBTITLE.length) clearInterval(id);
          }, 30);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    
    if (elRef.current) observer.observe(elRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className={`absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-xl transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`} />
      <p
        ref={elRef}
        className="relative text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed px-4"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {SUBTITLE.slice(0, visible)}
        <span className="inline-block w-0.5 h-5 ml-1 bg-amber-600 animate-pulse">|</span>
      </p>
    </div>
  );
};

// Floating Particles Background
const ParticlesBackground = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
    opacity: Math.random() * 0.3 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: '-10%',
            opacity: p.opacity,
            animation: `floatParticle ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  );
};

/* ==============================================
   COMPOSANTS PRINCIPAUX
============================================== */

// Contact Card 3D Ultra Premium
const ContactCard3D = ({ card, index }: { card: ContactCard; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  const transform = isHovered
    ? `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * -20}deg) rotateY(${(mousePosition.x - 0.5) * 20}deg) translateZ(30px)`
    : 'none';

  const glowPosition = `${mousePosition.x * 100}% ${mousePosition.y * 100}%`;

  return (
    <a
      ref={cardRef}
      href={card.href}
      target={card.target || "_self"}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0.5, y: 0.5 });
      }}
      onMouseMove={handleMouseMove}
    >
      <div
        className="relative p-6 md:p-8 rounded-3xl transition-all duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: isHovered 
            ? '0 40px 70px -15px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.3)'
            : '0 20px 40px -15px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.1)',
          transform,
          transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ease',
        }}
      >
        {/* Dynamic glow */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glowPosition}, rgba(255,215,0,0.3) 0%, transparent 70%)`,
          }}
        />

        {/* Animated border */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100"
          style={{
            background: 'linear-gradient(90deg, #ffd700, #ff8c42, #ffd700)',
            padding: '2px',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            animation: 'rotateGradient 3s linear infinite',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex items-start gap-4 md:gap-6">
          {/* Icon with gradient */}
          <div
            className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              background: card.gradient,
              boxShadow: isHovered ? '0 10px 30px rgba(0,0,0,0.3)' : '0 5px 15px rgba(0,0,0,0.2)',
            }}
          >
            <card.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            
            {/* Sparkle effect */}
            <Sparkles 
              className="absolute -top-2 -right-2 w-4 h-4 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ animation: 'spin 4s linear infinite' }}
            />
          </div>

          {/* Text content */}
          <div className="flex-1">
            <p className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-gray-500 mb-1">
              {card.title}
            </p>
            <p className="text-lg md:text-xl font-bold text-gray-900 break-words" 
               style={{ fontFamily: "'Playfair Display', serif" }}>
              {card.description}
            </p>
          </div>

          {/* Arrow indicator */}
          <ChevronRight 
            className={`w-5 h-5 text-gray-400 transition-all duration-300 ${
              isHovered ? 'translate-x-2 text-amber-600' : ''
            }`}
          />
        </div>

        {/* Reflection effect */}
        <div
          className="absolute top-0 left-0 right-0 h-1/3 rounded-t-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
          }}
        />
      </div>
    </a>
  );
};

// Hours Card with 3D effect
const HoursCard3D = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  const transform = isHovered
    ? `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * -10}deg) rotateY(${(mousePosition.x - 0.5) * 10}deg) translateZ(20px)`
    : 'none';

  return (
    <div
      ref={cardRef}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0.5, y: 0.5 });
      }}
      onMouseMove={handleMouseMove}
    >
      <div
        className="relative p-6 md:p-8 rounded-3xl"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: isHovered ? '0 30px 60px -15px rgba(0,0,0,0.3)' : '0 15px 30px -10px rgba(0,0,0,0.2)',
          transform,
          transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ease',
        }}
      >
        {/* Header */}
        <div className="relative z-10 flex items-center gap-3 mb-6">
          <div className="relative">
            <Clock className="w-6 h-6 text-amber-600" />
            <div className="absolute inset-0 bg-amber-400 blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
          </div>
          <h3 className="text-sm font-semibold tracking-[0.2em] uppercase text-gray-700">
            Horaires d'ouverture
          </h3>
        </div>

        {/* Hours grid */}
        <div className="relative z-10 space-y-4">
          {[
            { day: "Lundi – Samedi", hours: "08h00 – 20h00" },
            { day: "Dimanche", hours: "09h00 – 18h00" },
            { day: "Jours fériés", hours: "10h00 – 16h00" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-gray-200 last:border-0 last:pb-0"
            >
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-amber-500" />
                {item.day}
              </span>
              <span className="text-base md:text-lg font-semibold text-gray-900" 
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                {item.hours}
              </span>
            </div>
          ))}
        </div>

        {/* Badge */}
        <div className="relative z-10 mt-6 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-600" />
          <span className="text-xs text-gray-500">Service disponible 7j/7</span>
        </div>

        {/* Decorative gradient */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(251, 191, 36, 0.15) 0%, transparent 70%)`,
          }}
        />
      </div>
    </div>
  );
};

// Contact Form Ultra Premium
const ContactForm = () => {
  const [focused, setFocused] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const formRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!formRef.current) return;
    const rect = formRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  };

  const glowPosition = `${mousePosition.x * 100}% ${mousePosition.y * 100}%`;

  const fields = [
    { name: "name", label: "Nom complet", type: "input", placeholder: "John Doe" },
    { name: "email", label: "Adresse email", type: "input", placeholder: "john@example.com" },
    { name: "message", label: "Message", type: "textarea", placeholder: "Votre message..." },
  ];

  return (
    <div
      ref={formRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden rounded-3xl md:rounded-4xl"
    >
      {/* Background with dynamic glow */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glowPosition}, rgba(251, 191, 36, 0.2) 0%, transparent 70%)`,
        }}
      />

      {/* Form container */}
      <div
        className="relative p-6 md:p-8 lg:p-10"
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      >
        {/* Animated border */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.3), transparent)',
            animation: 'slide 3s linear infinite',
          }}
        />

        <div className="relative z-10">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center animate-bounce">
                  <Send className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-spin" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                Message envoyé !
              </h3>
              
              <p className="text-gray-600 mb-6 max-w-sm">
                Merci de nous avoir contacté. Notre équipe vous répondra dans les plus brefs délais.
              </p>
              
              <button
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", email: "", message: "" });
                }}
                className="px-6 py-3 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-8">
                <Globe className="w-6 h-6 text-amber-600" />
                <h3 className="text-lg font-semibold text-gray-900">Formulaire de contact</h3>
              </div>

              <div className="space-y-6">
                {fields.map((f) => (
                  <div key={f.name} className="group">
                    <label
                      htmlFor={f.name}
                      className={`block text-xs font-semibold tracking-wider uppercase mb-2 transition-colors duration-300 ${
                        focused === f.name ? 'text-amber-600' : 'text-gray-500'
                      }`}
                    >
                      {f.label}
                    </label>

                    {f.type === "input" ? (
                      <input
                        id={f.name}
                        name={f.name}
                        type={f.name === "email" ? "email" : "text"}
                        placeholder={f.placeholder}
                        value={form[f.name as keyof typeof form]}
                        onChange={handleChange}
                        onFocus={() => setFocused(f.name)}
                        onBlur={() => setFocused(null)}
                        className="w-full bg-transparent border-b-2 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300"
                        style={{
                          borderColor: focused === f.name ? '#f59e0b' : 'rgba(0,0,0,0.1)',
                          transform: focused === f.name ? 'scale(1.02)' : 'scale(1)',
                          transformOrigin: 'left',
                        }}
                      />
                    ) : (
                      <textarea
                        id={f.name}
                        name={f.name}
                        placeholder={f.placeholder}
                        rows={4}
                        value={form[f.name as keyof typeof form]}
                        onChange={handleChange}
                        onFocus={() => setFocused(f.name)}
                        onBlur={() => setFocused(null)}
                        className="w-full bg-transparent border-b-2 py-3 text-gray-900 placeholder-gray-400 outline-none resize-none transition-all duration-300"
                        style={{
                          borderColor: focused === f.name ? '#f59e0b' : 'rgba(0,0,0,0.1)',
                          transform: focused === f.name ? 'scale(1.02)' : 'scale(1)',
                          transformOrigin: 'left',
                        }}
                      />
                    )}
                  </div>
                ))}

                <button
                  onClick={handleSubmit}
                  className="relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full font-semibold text-sm tracking-wider uppercase overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Envoyer le message
                  </span>
                  
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      animation: 'slide 2s linear infinite',
                    }}
                  />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ==============================================
   COMPOSANT PRINCIPAL AVEC ID
============================================== */
interface ContactCard {
  title: string;
  icon: LucideIcon;
  description: string;
  href: string;
  target?: string;
  gradient: string;
}

export default function ContactSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Outfit:wght@300;400;500;600;700&display=swap');

        @keyframes floatParticle {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: var(--opacity); }
          90% { opacity: var(--opacity); }
          100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
        }

        @keyframes rotateGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .text-7xl { font-size: 3rem; }
          .text-6xl { font-size: 2.5rem; }
          .text-5xl { font-size: 2rem; }
        }

        @media (min-width: 641px) and (max-width: 768px) {
          .text-7xl { font-size: 4rem; }
        }

        @media (min-width: 1024px) {
          .grid-cols-auto { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
        }
      `}</style>

      {/* AJOUT DE L'ID CONTACT ICI */}
      <section id="contact" className="relative min-h-screen py-16 md:py-20 lg:py-24 overflow-hidden">
        {/* Background avec dégradé dynamique */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50" />
        
        {/* Particles effect */}
        <ParticlesBackground />

        {/* Main container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header section */}
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            <TextGenerateEffect />
            <TypewriterSubtitle />
          </div>

          {/* Grid layout responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
            
            {/* Left column - Form */}
            <div className="w-full order-2 lg:order-1">
              <ContactForm />
            </div>

            {/* Right column - Cards */}
            <div className="w-full order-1 lg:order-2 space-y-6 md:space-y-8">
              
              {/* Contact cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                {contactCards.map((card, i) => (
                  <ContactCard3D key={i} card={card} index={i} />
                ))}
              </div>

              {/* Hours card */}
              <HoursCard3D />

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 pt-4">
                {[
                  { icon: Star, text: "4.9/5 - 500+ avis" },
                  { icon: Award, text: "Service Premium" },
                  { icon: Clock, text: "24/7 Support" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                    <item.icon className="w-4 h-4 text-amber-600" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}