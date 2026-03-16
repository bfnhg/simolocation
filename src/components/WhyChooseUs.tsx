import { useState, useEffect } from "react";

const cards = [
  {
    img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=900&h=600&fit=crop",
    thumb: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&h=600&fit=crop",
    icon: "🚗",
    title: "Flotte variée",
    short: "Citadines, SUV, premium",
    tags: ["citadines", "SUV", "premium"],
    // desc: "Que vous soyez en solo, en famille ou en groupe, notre flotte s'adapte à chaque besoin. Citadines économiques, SUV spacieux, berlines de luxe — plus de 30 véhicules disponibles à Marrakech.",
    points: ["30+ véhicules disponibles", "Modèles récents (< 2 ans)", "Intérieurs impeccables", "GPS inclus"],
  },
  {
    img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&h=600&fit=crop",
    thumb: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=600&fit=crop",
    icon: "🕐",
    title: "Service 24/7",
    short: "Disponible chaque jour",
    // desc: "Une urgence à minuit ? Un vol tôt le matin ? Notre équipe est joignable 24h/24 et 7j/7. Réservation, assistance et support en temps réel, sans jamais vous faire attendre.",
    points: ["Hotline disponible 24h/24", "Réponse sous 5 minutes", "Assistance sur route incluse", "Aucun jour férié fermé"],
  },
  {
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&h=600&fit=crop",
    thumb: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=600&fit=crop",
    icon: "✦",
    title: "Prix transparents",
    short: "Aucun frais caché",
    // desc: "Chez nous, le prix affiché est le prix payé. Pas de frais cachés, pas de surprises à la restitution. Chaque tarif est détaillé avant la signature et vous recevez un contrat clair et lisible.",
    points: ["Devis gratuit en ligne", "Contrat détaillé", "Zéro frais de dossier", "Remboursement si annulation"],
  },
  {
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&h=600&fit=crop",
    thumb: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=600&fit=crop",
    icon: "⭐",
    title: "Expérience premium",
    short: "Accueil personnalisé",
    // desc: "Chaque véhicule est nettoyé, révisé et préparé avant votre arrivée. Nous offrons une expérience digne des meilleures agences internationales, avec le sourire marocain en plus.",
    points: ["Véhicule nettoyé & désinfecté", "Plein d'essence à la remise", "Accueil personnalisé", "Eau minérale offerte"],
  },
  {
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&h=600&fit=crop",
    thumb: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=600&fit=crop",
    icon: "📍",
    title: "Livraison sur place",
    short: "Aéroport, hôtel, riad",
    desc: "Nous livrons votre véhicule là où vous vous trouvez — aéroport de Marrakech-Menara, hôtel, riad ou tout autre adresse en ville. Pas de trajet en taxi pour venir chercher votre voiture.",
    points: ["Livraison aéroport incluse", "Récupération à votre adresse", "Ponctualité garantie", "Suivi en temps réel"],
  },
  {
    img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=900&h=600&fit=crop",
    thumb: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=600&fit=crop",
    icon: "🛡️",
    title: "Assurance incluse",
    short: "Couverture complète",
    // desc: "Tous nos véhicules sont couverts par une assurance tous risques. Vous roulez l'esprit tranquille, sans craindre les imprévus. Une protection complète est incluse dans chaque location.",
    points: ["Tous risques inclus", "Assistance routière 24h", "Franchise réduite disponible", "Couverture conducteur supplémentaire"],
  },
  {
    img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&h=600&fit=crop",
    thumb: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=600&fit=crop",
    icon: "💬",
    title: "Support français",
    short: "Équipe francophone",
    // desc: "Notre équipe est entièrement francophone. Pas de barrière de langue, pas de malentendu. Du premier contact jusqu'à la restitution du véhicule, nous communiquons dans votre langue.",
    points: ["100% en français", "WhatsApp & appel", "Email sous 1h", "Conseils personnalisés"],
  },
];

// Desktop arc parameters (inchangé)
const DESKTOP_PARAMS = {
  radius: 400,
  cardW: 238,
  cardH: 200,
  wrapperW: 700,
  wrapperH: 340,
  arcSpread: 0.48,
  topOffset: 12
};

const N = cards.length;
const Z_INDEXES = [1, 2, 3, 4, 3, 2, 1];

function getCardStyle(i: number) {
  const fraction = i / (N - 1) - 0.5;
  const angle = fraction * DESKTOP_PARAMS.arcSpread * 2 * Math.PI;

  const x = DESKTOP_PARAMS.radius * Math.sin(angle) - DESKTOP_PARAMS.cardW / 2;
  const y = DESKTOP_PARAMS.radius * (1 - Math.cos(angle)) - DESKTOP_PARAMS.cardH;

  const rot = fraction * DESKTOP_PARAMS.arcSpread * 360 * 0.85;

  return { x, y, rot };
}

type Card = typeof cards[number];

export default function WhyChooseUs() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selected, setSelected] = useState<Card | null>(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getTransform = (i: number, rot: number) => {
    if (hoveredIndex === i) return `rotate(${rot}deg) translateY(-36px) scale(1.09)`;
    return `rotate(${rot}deg)`;
  };

  // Prendre seulement les 4 premières cartes pour le mobile
  const mobileCards = cards.slice(0, 4);

  // Titres explicites pour chaque carte mobile
  const mobileTitles = [
    "Notre flotte de véhicules",
    "Notre service client",
    "Nos prix et tarifs",
    "Notre accompagnement"
  ];

  // Couleurs pour chaque carte
  const cardColors = ['#ED5565', '#FC6E51', '#FFCE54', '#2ECC71'];

  // Gestionnaire de clic pour mobile
  const handleMobileCardClick = (index: number) => {
    if (activeMobileIndex === index) {
      // Si la carte est déjà active, ouvrir la modal avec les détails
      setSelected(mobileCards[index]);
    } else {
      // Sinon, activer la carte
      setActiveMobileIndex(index);
    }
  };

  // Desktop arc view (exactement comme avant)
  const renderDesktopView = () => (
    <div className="fan-wrapper">
      {cards.map((card, i) => {
        const { x, y, rot } = getCardStyle(i);
        const left = x + DESKTOP_PARAMS.wrapperW / 2;

        return (
          <div
            key={i}
            className={`fan-card${hoveredIndex === i ? " fan-card--hovered" : ""}`}
            style={{
              left: `${left}px`,
              top: `${y}px`,
              transform: getTransform(i, rot),
              zIndex: hoveredIndex === i ? 10 : Z_INDEXES[i],
            }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => setSelected(card)}
          >
            <img
              className="fan-card-img"
              src={card.thumb}
              alt={card.title}
              draggable={false}
              loading="lazy"
            />
            <div className="fan-card-content">
              <span className="fan-card-icon">{card.icon}</span>
              <h3 className="fan-card-title">{card.title}</h3>
              <p className="fan-card-short">{card.short}</p>
              {"tags" in card && card.tags && (
                <div className="fan-tags">
                  {card.tags.map((tag) => (
                    <span key={tag} className="fan-tag">{tag}</span>
                  ))}
                </div>
              )}
              <p className="fan-click-hint">Cliquer pour en savoir plus →</p>
            </div>
          </div>
        );
      })}
    </div>
  );

  // Mobile Expanding Flex Cards with details
  const renderMobileView = () => (
    <div className="fan-mobile-container">
      <div className="fan-mobile-options">
        {mobileCards.map((card, index) => (
          <div
            key={index}
            className={`fan-mobile-option ${activeMobileIndex === index ? 'active' : ''}`}
            style={{
              '--optionBackground': `url(${card.img})`,
              '--defaultBackground': cardColors[index % cardColors.length]
            } as React.CSSProperties}
            onClick={() => handleMobileCardClick(index)}
          >
            <div className="fan-mobile-shadow"></div>
            
            {/* Titre explicatif au-dessus de la carte active */}
            {activeMobileIndex === index && (
              <div className="fan-mobile-section-title">
                <span>{mobileTitles[index]}</span>
              </div>
            )}
            
            <div className="fan-mobile-label">
              <div className="fan-mobile-icon">
                <span>{card.icon}</span>
              </div>
              <div className="fan-mobile-info">
                <div className="fan-mobile-main">{card.title}</div>
                <div className="fan-mobile-sub">{card.short}</div>
              </div>
            </div>
            
            {/* Détails qui apparaissent quand la carte est active */}
            {activeMobileIndex === index && (
              <div className="fan-mobile-details">
                <p className="fan-mobile-desc">{card.desc}</p>
                <ul className="fan-mobile-points">
                  {card.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
                <button 
                  className="fan-mobile-details-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(card);
                  }}
                >
                  Plus de détails →
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,500&family=DM+Sans:wght@300;400;500&display=swap');

        .fan-section {
          --terracotta: #c0622a;
          --gold: #b8843a;
          --gold2: #e4b86a;
          --dark: #2c1a0e;
          --card-bg: #eddfc8;

          font-family: 'DM Sans', sans-serif;
          background:
            radial-gradient(ellipse at 80% 10%, #e8d5b7 0%, transparent 55%),
            radial-gradient(ellipse at 5% 90%, #d4956a18 0%, transparent 50%),
            #f5ede0;
          padding: 2.5em 1.5em 3em;
          display: grid;
          place-items: center;
          gap: 1.5em;
          position: relative;
          overflow: hidden;
          min-height: 680px;
        }

        .fan-section::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0.035;
          background-image:
            repeating-linear-gradient(45deg, #b8843a 0, #b8843a 1px, transparent 0, transparent 50%),
            repeating-linear-gradient(-45deg, #b8843a 0, #b8843a 1px, transparent 0, transparent 50%);
          background-size: 22px 22px;
          pointer-events: none;
        }

        .fan-header {
          text-align: center;
          position: relative;
          z-index: 1;
          max-width: 90%;
        }
        
        .fan-eyebrow {
          font-size: .68em;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: var(--terracotta);
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: .6em;
          margin-bottom: .4em;
        }
        
        .fan-eyebrow::before,
        .fan-eyebrow::after {
          content: '';
          width: 2.5em;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold));
        }
        
        .fan-eyebrow::after { transform: scaleX(-1); }
        
        .fan-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8em, 5vw, 2.5em);
          font-weight: 700;
          color: var(--dark);
          line-height: 1.1;
          margin: 0 0 .25em;
        }
        
        .fan-subtitle {
          font-size: clamp(0.75em, 2vw, 0.82em);
          color: #7a5c3e;
          font-weight: 300;
          margin: 0;
          padding: 0 1em;
        }

        /* Desktop Arc Styles (inchangé) */
        .fan-wrapper {
          position: relative;
          width: ${DESKTOP_PARAMS.wrapperW}px;
          max-width: 100%;
          height: ${DESKTOP_PARAMS.wrapperH}px;
          z-index: 1;
          margin: ${DESKTOP_PARAMS.topOffset}em auto 4em;
          overflow: visible;
        }

        .fan-card {
          position: absolute;
          width: ${DESKTOP_PARAMS.cardW}px;
          height: ${DESKTOP_PARAMS.cardH}px;
          border-radius: 14px;
          background: var(--card-bg);
          border: 1.5px solid #d4b87a55;
          transform-origin: 50% 100%;
          transition: transform 0.45s cubic-bezier(0.34, 1.45, 0.64, 1), box-shadow 0.3s ease;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: .9em;
          box-sizing: border-box;
          will-change: transform;
          isolation: isolate;
          cursor: pointer;
        }

        .fan-card--hovered {
          box-shadow: 0 18px 50px #2c1a0e32;
        }

        .fan-card-img {
          position: absolute;
          inset: 0;
          object-fit: cover;
          width: 100%;
          height: 100%;
          opacity: 0.42;
          mix-blend-mode: multiply;
          border-radius: inherit;
          pointer-events: none;
          user-select: none;
        }

        .fan-card-content {
          position: relative;
          z-index: 2;
        }

        .fan-card-icon {
          font-size: 1.2em;
          margin-bottom: .2em;
          display: block;
          line-height: 1;
        }

        .fan-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1em;
          font-weight: 700;
          color: var(--dark);
          margin: 0 0 .15em;
          line-height: 1.2;
          text-shadow: 0 1px 5px #f5ede0cc;
        }

        .fan-card-short {
          font-size: 0.6em;
          color: #6b4e2e;
          font-weight: 400;
          margin: 0;
          line-height: 1.45;
        }

        .fan-tags {
          display: flex;
          gap: .25em;
          flex-wrap: wrap;
          margin-top: .3em;
        }

        .fan-tag {
          border: 1px solid var(--gold);
          padding: 1px .35em;
          border-radius: 4px;
          background: rgb(184 132 58 / .13);
          font-size: 0.56em;
          color: var(--dark);
          font-weight: 500;
        }

        .fan-click-hint {
          font-size: 0.52em;
          color: var(--terracotta);
          margin-top: .35em;
          opacity: .75;
          letter-spacing: .04em;
        }

        /* Mobile Container */
        .fan-mobile-container {
          width: 100%;
          max-width: 600px;
          margin: 1rem auto;
          display: none;
        }

        /* Mobile Expanding Flex Cards Styles */
        .fan-mobile-options {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          overflow: hidden;
          width: 100%;
          height: 520px;
          margin: 0 auto;
          padding: 0;
          gap: 5px;
        }

        .fan-mobile-option {
          position: relative;
          overflow: hidden;
          flex: 1;
          min-width: 50px;
          margin: 5px;
          background: var(--optionBackground, var(--defaultBackground, #E6E9ED));
          background-size: cover;
          background-position: center;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
          border-radius: 20px;
        }

        .fan-mobile-section-title {
          position: absolute;
          top: 20px;
          left: 0;
          right: 0;
          text-align: center;
          z-index: 5;
          animation: fadeInDown 0.5s ease;
        }

        .fan-mobile-section-title span {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          color: white;
          padding: 8px 20px;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          display: inline-block;
          font-family: 'Cormorant Garamond', serif;
          text-transform: uppercase;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fan-mobile-option.active {
          flex: 8;
          transform: scale(1);
          max-width: 400px;
          margin: 0px;
          border-radius: 30px;
          background-size: cover;
        }

        .fan-mobile-option.active .fan-mobile-shadow {
          box-shadow: inset 0 -120px 120px -120px black, inset 0 -120px 120px -100px black;
        }

        .fan-mobile-option.active .fan-mobile-label {
          bottom: 240px;
          left: 20px;
        }

        .fan-mobile-option.active .fan-mobile-info > div {
          left: 0px;
          opacity: 1;
        }

        .fan-mobile-option:not(.active) {
          flex: 1;
          border-radius: 20px;
        }

        .fan-mobile-option:not(.active) .fan-mobile-shadow {
          bottom: -40px;
          box-shadow: inset 0 -120px 0px -120px black, inset 0 -120px 0px -100px black;
        }

        .fan-mobile-option:not(.active) .fan-mobile-label {
          bottom: 10px;
          left: 10px;
        }

        .fan-mobile-option:not(.active) .fan-mobile-info > div {
          left: 20px;
          opacity: 0;
        }

        .fan-mobile-shadow {
          position: absolute;
          bottom: 0px;
          left: 0px;
          right: 0px;
          height: 120px;
          transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
        }

        .fan-mobile-label {
          display: flex;
          position: absolute;
          right: 0px;
          height: 40px;
          transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
          z-index: 3;
        }

        .fan-mobile-icon {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          min-width: 40px;
          max-width: 40px;
          height: 40px;
          border-radius: 100%;
          background-color: white;
          font-size: 1.2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        .fan-mobile-icon span {
          filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));
        }

        .fan-mobile-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-left: 10px;
          color: white;
          white-space: nowrap;
          overflow: hidden;
        }

        .fan-mobile-info > div {
          position: relative;
          transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95), opacity 0.5s ease-out;
        }

        .fan-mobile-main {
          font-weight: bold;
          font-size: 1rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .fan-mobile-sub {
          font-size: 0.7rem;
          transition-delay: 0.1s;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        /* Mobile Details Styles */
        .fan-mobile-details {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          color: white;
          z-index: 4;
          animation: slideUp 0.5s ease;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          padding: 15px;
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fan-mobile-desc {
          font-size: 0.8rem;
          line-height: 1.4;
          margin: 0 0 12px 0;
          opacity: 0.95;
          font-weight: 300;
        }

        .fan-mobile-points {
          list-style: none;
          padding: 0;
          margin: 0 0 15px 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 12px;
        }

        .fan-mobile-points li {
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 400;
        }

        .fan-mobile-points li::before {
          content: '✓';
          color: #4CAF50;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .fan-mobile-details-btn {
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%);
          border: none;
          color: var(--dark);
          padding: 10px 15px;
          border-radius: 25px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .fan-mobile-details-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.4);
          filter: brightness(1.1);
        }

        .fan-hint {
          font-size: .68em;
          color: #b8843a88;
          text-align: center;
          letter-spacing: .1em;
          text-transform: uppercase;
          position: relative;
          z-index: 1;
          margin: 0;
        }

        .fan-buttons {
          display: flex;
          gap: .7em;
          z-index: 1;
          position: relative;
          flex-wrap: wrap;
          justify-content: center;
        }

        .fan-btn {
          border-radius: 3em;
          border: none;
          cursor: pointer;
          padding: .55em 1.5em;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700;
          font-size: clamp(0.8em, 2vw, 0.9em);
          letter-spacing: .06em;
          text-transform: uppercase;
          transition: filter .2s, transform .15s;
          white-space: nowrap;
        }

        .fan-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }

        .fan-btn-main {
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold2) 60%, #f5c97a 100%);
          color: var(--dark);
        }

        .fan-btn-sub { background: var(--dark); color: var(--gold2); }

        /* Modal Styles (inchangé) */
        .fan-overlay {
          position: fixed;
          inset: 0;
          background: rgba(28, 16, 6, 0.75);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fan-fade .2s ease;
        }

        @keyframes fan-fade { from { opacity: 0 } to { opacity: 1 } }

        .fan-modal {
          background: #f5ede0;
          border-radius: 20px;
          overflow: hidden;
          width: 100%;
          max-width: min(580px, 90vw);
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 32px 80px #2c1a0e44;
          animation: fan-up .3s cubic-bezier(0.34, 1.45, 0.64, 1);
          position: relative;
          margin: auto;
        }

        @keyframes fan-up {
          from { opacity: 0; transform: translateY(36px) scale(0.96) }
          to   { opacity: 1; transform: translateY(0)    scale(1)    }
        }

        .fan-modal-img {
          width: 100%;
          height: clamp(160px, 25vh, 220px);
          object-fit: cover;
          display: block;
          flex-shrink: 0;
        }

        .fan-modal-body {
          padding: clamp(1.1em, 3vw, 1.5em) clamp(1.2em, 3vw, 1.7em) clamp(1.4em, 3vw, 1.8em);
          overflow-y: auto;
          flex: 1;
        }

        .fan-modal-eyebrow {
          font-size: clamp(0.6em, 1.5vw, 0.63em);
          letter-spacing: .18em;
          text-transform: uppercase;
          color: var(--terracotta);
          font-weight: 500;
          margin-bottom: .35em;
        }

        .fan-modal-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.5em, 4vw, 1.9em);
          font-weight: 700;
          color: var(--dark);
          margin: 0 0 .55em;
          line-height: 1.1;
        }

        .fan-modal-desc {
          font-size: clamp(0.75em, 2vw, 0.83em);
          color: #5a3e28;
          line-height: 1.7;
          margin: 0 0 1.1em;
          font-weight: 300;
        }

        .fan-modal-points {
          list-style: none;
          padding: 0;
          margin: 0 0 1.4em;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: .45em .8em;
        }

        .fan-modal-points li {
          font-size: clamp(0.7em, 1.8vw, 0.76em);
          color: var(--dark);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: .4em;
        }

        .fan-modal-points li::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gold);
          flex-shrink: 0;
        }

        .fan-modal-cta { 
          display: flex; 
          gap: .6em; 
          flex-wrap: wrap; 
        }

        .fan-modal-close {
          position: absolute;
          top: .75em;
          right: .75em;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(245, 237, 224, 0.92);
          border: none;
          cursor: pointer;
          font-size: .85em;
          color: var(--dark);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transition: background .18s;
        }

        .fan-modal-close:hover { background: #eddfc8; }

        /* Responsive Breakpoints */
        @media (max-width: 768px) {
          .fan-section {
            padding: 2em 0.5em 2.5em;
            min-height: auto;
          }
          
          .fan-wrapper {
            display: none;
          }
          
          .fan-mobile-container {
            display: block;
          }
          
          .fan-buttons {
            flex-direction: column;
            align-items: center;
            width: 100%;
          }
          
          .fan-btn {
            width: 100%;
            max-width: 280px;
            white-space: normal;
          }
        }

        @media (max-width: 480px) {
          .fan-mobile-options {
            height: 480px;
          }
          
          .fan-mobile-option.active .fan-mobile-label {
            bottom: 220px;
          }
          
          .fan-mobile-section-title span {
            font-size: 0.9rem;
            padding: 6px 16px;
          }
          
          .fan-mobile-main {
            font-size: 0.9rem;
          }
          
          .fan-mobile-sub {
            font-size: 0.65rem;
          }
          
          .fan-mobile-details {
            bottom: 10px;
            left: 10px;
            right: 10px;
            padding: 12px;
          }
          
          .fan-mobile-points {
            grid-template-columns: 1fr;
            gap: 6px;
          }
          
          .fan-mobile-desc {
            font-size: 0.7rem;
            margin-bottom: 10px;
          }
          
          .fan-mobile-points li {
            font-size: 0.7rem;
          }
        }

        @media (min-width: 769px) {
          .fan-mobile-container {
            display: none;
          }
        }
      `}</style>

      <section className="fan-section">
        <header className="fan-header">
          <p className="fan-eyebrow">Notre engagement</p>
          <h2 className="fan-title">Pourquoi nous choisir</h2>
          <p className="fan-subtitle">
            Location de voitures à Marrakech — fluide, transparente, premium.
          </p>
        </header>

        {isMobile ? renderMobileView() : renderDesktopView()}

        <p className="fan-hint">
          {isMobile ? "Appuyez pour voir les détails" : "Survolez ou cliquez une carte"}
        </p>

        <div className="fan-buttons">
          <button className="fan-btn fan-btn-main">Réserver maintenant</button>
          <button className="fan-btn fan-btn-sub">Voir la flotte</button>
        </div>
      </section>

      {selected && (
        <div
          className="fan-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <div className="fan-modal">
            <button
              className="fan-modal-close"
              onClick={() => setSelected(null)}
              aria-label="Fermer"
            >
              ✕
            </button>

            <img
              className="fan-modal-img"
              src={selected.img}
              alt={selected.title}
              loading="lazy"
            />

            <div className="fan-modal-body">
              <p className="fan-modal-eyebrow">{selected.icon} Pourquoi nous choisir</p>
              <h3 className="fan-modal-title">{selected.title}</h3>
              <p className="fan-modal-desc">{selected.desc}</p>

              {selected.points && (
                <ul className="fan-modal-points">
                  {selected.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              )}

              <div className="fan-modal-cta">
                <button className="fan-btn fan-btn-main" onClick={() => setSelected(null)}>
                  Réserver maintenant
                </button>
                <button className="fan-btn fan-btn-sub" onClick={() => setSelected(null)}>
                  Voir la flotte
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}