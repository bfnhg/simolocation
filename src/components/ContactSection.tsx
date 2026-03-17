import { useEffect, useRef, useState } from "react";
import { Mail, MapPin, Phone, LucideIcon, Send } from "lucide-react";

/* ── Text Generate Effect ── */
const WORDS = [
  { text: "Besoin" },
  { text: "d'un" },
  { text: "véhicule" },
  { text: "?" },
  { text: "Contactez‑nous." },
];

function TextGenerateEffect() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setActive(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4">
      {WORDS.map((w, i) => (
        <span
          key={i}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.2rem, 6vw, 4rem)",
            fontWeight: 700,
            color: i >= 3 ? "#b04818" : "#2c1005",
            fontStyle: i === 4 ? "italic" : "normal",
            opacity: active ? 1 : 0,
            filter: active ? "blur(0px)" : "blur(10px)",
            transition: "opacity 0.8s ease, filter 0.8s ease",
            transitionDelay: `${i * 120}ms`,
            display: "inline-block",
          }}
        >
          {w.text}
        </span>
      ))}
    </div>
  );
}

/* ── Typewriter Subtitle ── */
const SUBTITLE =
  "Retrouvez rapidement nos coordonnées et contactez-nous par téléphone, email ou en venant nous voir.";

function TypewriterSubtitle() {
  const [visible, setVisible] = useState(0);
  const elRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let i = 0;
          const id = setInterval(() => {
            i++;
            setVisible(i);
            if (i >= SUBTITLE.length) clearInterval(id);
          }, 20);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    const el = elRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <p
      ref={elRef}
      style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: "1.05rem",
        color: "rgba(44,16,5,0.55)",
        maxWidth: "600px",
        margin: "0 auto",
        minHeight: "1.8rem",
        lineHeight: 1.7,
      }}
    >
      {SUBTITLE.slice(0, visible)}
      <span style={{ color: "#b04818", animation: "blink 1s step-end infinite" }}>|</span>
    </p>
  );
}

/* ── Aceternity Contact Form ── */
function ContactForm() {
  const [focused, setFocused] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

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

  const inputBase: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1.5px solid rgba(176,72,24,0.25)",
    outline: "none",
    fontFamily: "'Outfit', sans-serif",
    fontSize: "0.95rem",
    color: "#2c1005",
    padding: "10px 0",
    transition: "border-color 0.3s ease",
  };

  const labelBase: React.CSSProperties = {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "0.7rem",
    fontWeight: 500,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "rgba(44,16,5,0.45)",
    marginBottom: "4px",
    display: "block",
    transition: "color 0.3s ease",
  };

  const fields = [
    { name: "name",    label: "Nom complet",    type: "input",    placeholder: "Votre nom" },
    { name: "email",   label: "Adresse email",  type: "input",    placeholder: "votre@email.com" },
    { name: "message", label: "Message",        type: "textarea", placeholder: "Comment pouvons-nous vous aider ?" },
  ];

  return (
    <div
      style={{
        background: "rgba(253,245,236,0.7)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(176,72,24,0.15)",
        borderRadius: "1.25rem",
        padding: "2.5rem",
        boxShadow: "0 8px 40px rgba(120,50,10,0.08)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative top shimmer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(to right, transparent, rgba(176,72,24,0.5), transparent)",
        }}
      />

      {sent ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            minHeight: "260px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "rgba(176,72,24,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "popIn 0.4s cubic-bezier(.22,1,.36,1)",
            }}
          >
            <Send style={{ color: "#b04818", width: "24px", height: "24px" }} />
          </div>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#2c1005",
            }}
          >
            Message envoyé !
          </p>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.9rem",
              color: "rgba(44,16,5,0.5)",
            }}
          >
            Nous vous répondrons dans les plus brefs délais.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {fields.map((f) => (
            <div key={f.name}>
              <label
                htmlFor={f.name}
                style={{
                  ...labelBase,
                  color: focused === f.name ? "#b04818" : "rgba(44,16,5,0.45)",
                }}
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
                  style={{
                    ...inputBase,
                    borderBottomColor:
                      focused === f.name
                        ? "#b04818"
                        : "rgba(176,72,24,0.25)",
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
                  style={{
                    ...inputBase,
                    resize: "none",
                    borderBottomColor:
                      focused === f.name
                        ? "#b04818"
                        : "rgba(176,72,24,0.25)",
                  }}
                />
              )}
            </div>
          ))}

          <button
            onClick={handleSubmit}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "13px 32px",
              borderRadius: "100px",
              background: "linear-gradient(135deg, #c05c20 0%, #8f3810 100%)",
              color: "#fdf5ec",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
              fontSize: "0.82rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(144,56,16,0.35), inset 0 1px 0 rgba(255,200,120,0.2)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              alignSelf: "flex-start",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(144,56,16,0.5), inset 0 1px 0 rgba(255,200,120,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(144,56,16,0.35), inset 0 1px 0 rgba(255,200,120,0.2)";
            }}
          >
            <Send style={{ width: "15px", height: "15px" }} />
            Envoyer le message
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Types ── */
interface ContactCard {
  title: string;
  icon: LucideIcon;
  description: string;
  href: string;
  target?: string;
}

/* ── Data ── */
const contactCards: ContactCard[] = [
  {
    title: "Téléphone",
    icon: Phone,
    description: "+212 6XX XXX XXX",
    href: "tel:+2126XXXXXXX",
  },
  {
    title: "Email",
    icon: Mail,
    description: "contact@marrakechauto.ma",
    href: "mailto:contact@marrakechauto.ma",
  },
  {
    title: "Adresse",
    icon: MapPin,
    description: "Guéliz, Marrakech",
    href: "https://www.google.com/maps/place/Marrakech/",
    target: "_blank",
  },
];

/* ── Main ── */
export default function ContactSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Outfit:wght@300;400;500;600&display=swap');
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes popIn  { from{opacity:0;transform:scale(0.6)} to{opacity:1;transform:scale(1)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .contact-card { animation: slideUp 0.5s cubic-bezier(.22,1,.36,1) both; }
        .contact-card:nth-child(1) { animation-delay: 0.05s; }
        .contact-card:nth-child(2) { animation-delay: 0.15s; }
        .contact-card:nth-child(3) { animation-delay: 0.25s; }
        input::placeholder, textarea::placeholder { color: rgba(44,16,5,0.3); }
      `}</style>

      <section id="contact" className="py-20 px-4 bg-background">
        <div className="container mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <TextGenerateEffect />
            <TypewriterSubtitle />
          </div>

          {/* Layout : form + cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* Left — Form */}
            <ContactForm />

            {/* Right — Cards + horaires */}
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactCards.map((card, i) => (
                  <a
                    key={i}
                    href={card.href}
                    target={card.target || "_self"}
                    className="contact-card rounded-2xl border border-border bg-card p-5 flex items-start gap-4 hover:bg-[#fdf5ec] transition-colors"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "rgba(176,72,24,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <card.icon style={{ color: "#b04818", width: "20px", height: "20px" }} />
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
                        {card.title}
                      </p>
                      <p className="font-semibold text-foreground">
                        {card.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Horaires */}
              <div
                className="rounded-2xl border border-border bg-card p-5"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-3">
                  Horaires d'ouverture
                </p>
                <div className="flex flex-col gap-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lun – Sam</span>
                    <span className="font-semibold text-foreground">08h00 – 20h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dimanche</span>
                    <span className="font-semibold text-foreground">09h00 – 18h00</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}