import React from 'react';

// ─── Import statique des images depuis public/images ──────────────────────
// Next.js / Vite / CRA : les fichiers dans /public sont servis à la racine
// On utilise des chemins absolus /images/picX.webp (pas d'import ES module)
// car les fichiers sont dans /public (pas dans /src)
// ─────────────────────────────────────────────────────────────────────────

const BASE = '/images'; // ← chemin racine public

const DATA = [
  { src: `${BASE}/pic.webp`, label: 'Kia Picanto',       price: '25€/j', cat: 'Éco'     },
  { src: `${BASE}/pic1.webp`, label: 'Kia Picanto',       price: '25€/j', cat: 'Éco'     },
  { src: `${BASE}/pic2.webp`, label: 'Hyundai Grand i10', price: '30€/j', cat: 'Éco'     },
  { src: `${BASE}/pic3.webp`, label: 'Renault Clio 5',    price: '35€/j', cat: 'Éco'     },
  { src: `${BASE}/pic4.webp`, label: 'Peugeot 208',       price: '35€/j', cat: 'Éco'     },
  { src: `${BASE}/pic6.webp`, label: 'Dacia Duster',      price: '45€/j', cat: 'Pick-up' },
  { src: `${BASE}/pic5.webp`, label: 'Renault Kardian',   price: '40€/j', cat: 'Sport'   },
  { src: `${BASE}/pic6.webp`, label: 'Dacia Duster',      price: '45€/j', cat: 'Pick-up' },
  // { src: `${BASE}/pic7.webp`, label: 'Dacia Duster Auto', price: '45€/j', cat: 'Pick-up' },
  // 📸 Quand vous aurez pic8 & pic9, remplacez les lignes ci-dessous :
];

const N = DATA.length;

const HeroCarousel: React.FC = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Outfit:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .hero {
          position: relative;
          min-height: 100vh;
          display: grid;
          place-items: center;
          overflow: hidden;
          padding-top: 80px;
          padding-bottom: 60px;
          background:
            radial-gradient(ellipse 120% 80% at 50% -10%,  #f5c97a 0%, transparent 60%),
            radial-gradient(ellipse 80%  60% at 90%  80%,  #c0622a 0%, transparent 55%),
            radial-gradient(ellipse 70%  50% at 5%   70%,  #e8833a 0%, transparent 50%),
            #f0e0c8;
        }

        .hero-pattern {
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(45deg,  rgba(180,90,30,0.04) 0px, rgba(180,90,30,0.04) 1px, transparent 1px, transparent 28px),
            repeating-linear-gradient(-45deg, rgba(180,90,30,0.04) 0px, rgba(180,90,30,0.04) 1px, transparent 1px, transparent 28px);
          pointer-events: none;
          z-index: 1;
        }

        .hero-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 90% 90% at 50% 50%, transparent 50%, rgba(140,60,10,0.25) 100%);
          pointer-events: none;
          z-index: 2;
        }

        .hero-inner {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          width: 100%;
          padding: 0 20px;
        }

        .hero-text { text-align: center; }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #7a3010;
          margin-bottom: 20px;
        }
        .badge-line {
          display: inline-block;
          width: 28px;
          height: 1px;
          background: #b05020;
          opacity: 0.6;
        }

        .main-title {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: clamp(2rem, 8vw, 6rem);
          line-height: 0.9;
          letter-spacing: -0.02em;
          color: #2c1005;
          margin-bottom: 6px;
        }
        .main-title .line2 {
          display: block;
          font-style: italic;
          font-weight: 400;
          font-size: clamp(2.2rem, 6.5vw, 5rem);
          color: #b04818;
          letter-spacing: -0.01em;
          margin-top: 4px;
        }

        .subtitle {
          font-family: 'Outfit', sans-serif;
          font-weight: 300;
          font-size: clamp(0.88rem, 1.5vw, 1rem);
          color: rgba(44,16,5,0.55);
          line-height: 1.8;
          max-width: 420px;
          margin: 18px auto 0;
        }

        .stats {
          display: flex;
          gap: 40px;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }
        .stat { text-align: center; }
        .stat-num {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 1.6rem;
          color: #b04818;
          line-height: 1;
        }
        .stat-label {
          font-family: 'Outfit', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(44,16,5,0.45);
          margin-top: 4px;
        }
        .stat-sep {
          width: 1px;
          height: 32px;
          background: rgba(176,72,24,0.25);
        }

        /* ══ CAROUSEL 3D CORRIGÉ ══ */
        .scene {
          width: 100%;
          height: 400px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 1200px;
          overflow: visible;
          margin: 20px 0;
          filter: drop-shadow(0 24px 40px rgba(120,50,10,0.25));
        }

        .a3d {
          width: 220px;
          height: 280px;
          position: relative;
          transform-style: preserve-3d;
          animation: rotateCarousel 30s linear infinite;
        }

        /* Pause au survol optionnel - décommentez si vous voulez */
        /* .a3d:hover {
          animation-play-state: paused;
        } */

        @keyframes rotateCarousel {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }

        .card3d {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          object-fit: cover;
          border-radius: 1.2em;
          backface-visibility: hidden;
          outline: 2.5px solid rgba(255,200,100,0.35);
          outline-offset: -1px;
          box-shadow: 0 6px 24px rgba(120,50,0,0.30), inset 0 0 0 1px rgba(255,220,120,0.12);
          filter: sepia(0.12) saturate(1.1) contrast(1.05);
          transition: filter 0.4s, outline-color 0.4s;
          cursor: pointer;
        }

        .card3d:hover {
          filter: sepia(0) saturate(1.2) contrast(1.08) brightness(1.05);
          outline-color: rgba(255,180,60,0.7);
        }

        @media (prefers-reduced-motion: reduce) {
          .a3d {
            animation: rotateCarousel 60s linear infinite;
          }
        }

        .hero-cta {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 20px;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 13px 34px;
          border-radius: 100px;
          background: linear-gradient(135deg, #c05c20 0%, #8f3810 100%);
          color: #fdf5ec;
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 0.8rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(144,56,16,0.45), inset 0 1px 0 rgba(255,200,120,0.25);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(144,56,16,0.55);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7a3010;
          text-decoration: none;
          padding: 13px 20px;
          border: 1.5px solid rgba(176,72,24,0.35);
          border-radius: 100px;
          transition: border-color 0.2s, background 0.2s, color 0.2s;
        }
        .btn-secondary:hover {
          border-color: #b04818;
          background: rgba(176,72,24,0.07);
          color: #8f3810;
        }

        .scroll-hint {
          position: absolute;
          bottom: 22px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          z-index: 10;
          opacity: 0;
          animation: fadeIn 1s 1.5s forwards, bob 2.5s 2.5s ease-in-out infinite;
        }
        .scroll-hint span {
          font-family: 'Outfit', sans-serif;
          font-size: 0.55rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #7a3010;
        }
        .scroll-bar {
          width: 1px;
          height: 34px;
          background: linear-gradient(to bottom, #b04818, transparent);
        }
        @keyframes fadeIn { to { opacity: 0.5; } }
        @keyframes bob {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(6px); }
        }

        .hero-text, .stats, .hero-cta {
          animation: riseIn 0.8s cubic-bezier(.22,1,.36,1) both;
        }
        .stats    { animation-delay: 0.15s; }
        .hero-cta { animation-delay: 0.3s; }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section className="hero">
        <div className="hero-pattern" />
        <div className="hero-vignette" />

        <div className="hero-inner">

          <div className="hero-text">
            <div className="badge">
              <span className="badge-line" />
              Location de voitures · Marrakech
              <span className="badge-line" />
            </div>
            <h1 className="main-title">
              Premium car marrakech
              {/* <span className="line2">Livraison à l'aéroport Kilométrage illimité</span> */}
            </h1>
           
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat-num">{N}</div>
              <div className="stat-label">Modèles</div>
            </div>
            <div className="stat-sep" />
            <div className="stat">
              <div className="stat-num">25€</div>
              <div className="stat-label">Dès / jour</div>
            </div>
            <div className="stat-sep" />
            <div className="stat">
              <div className="stat-num">∞</div>
              <div className="stat-label">Km illimité</div>
            </div>
          </div>

          {/* ══ Carousel 3D CORRIGÉ ══ */}
          <div className="scene">
            <div className="a3d">
              {DATA.map((car, i) => {
                const angle = (360 / N) * i;
                return (
                  <img
                    key={i}
                    className="card3d"
                    src={car.src}
                    style={{ 
                      transform: `rotateY(${angle}deg) translateZ(320px)` 
                    } as React.CSSProperties}
                    alt={car.label}
                    title={`${car.label} — ${car.price}`}
                    onError={(e) => {
                      // Fallback si l'image n'existe pas encore
                      (e.target as HTMLImageElement).src =
                        `https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=320&auto=format&fit=crop`;
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className="hero-cta">
            <a href="#cars" className="btn-primary">
              Voir notre flotte
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="#contact" className="btn-secondary">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.18 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.81-.81a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Nous appeler
            </a>
          </div>

        </div>

        <div className="scroll-hint">
          <span>Défiler</span>
          <div className="scroll-bar" />
        </div>
      </section>
    </>
  );
};

export default HeroCarousel;