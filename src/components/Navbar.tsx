"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Car, Phone, Sparkles, ChevronRight, Menu, X } from "lucide-react";

const navItems = [
  { name: "Accueil", link: "#", icon: null },
  { name: "Nos voitures", link: "#cars", icon: null },
  { name: "À propos", link: "#whychooseus", icon: null },
  { name: "Clients expérience", link: "#testimonials", icon: null },
  { name: "Contact", link: "#contact", icon: null },
];

export default function FloatingNavbar() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeItem, setActiveItem] = useState("Accueil");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 300 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const rotateX = useTransform(smoothY, [-100, 100], [3, -3]);
  const rotateY = useTransform(smoothX, [-100, 100], [-3, 3]);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 80) {
        setVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }
      const goingDown = currentScrollY > lastScrollY;
      setVisible(!goingDown);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar, { passive: true });
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Fermer le menu mobile au scroll
  useEffect(() => {
    if (mobileMenuOpen) {
      const close = () => setMobileMenuOpen(false);
      window.addEventListener("scroll", close, { passive: true });
      return () => window.removeEventListener("scroll", close);
    }
  }, [mobileMenuOpen]);

  const handleClick = (itemName: string, link: string) => {
    setActiveItem(itemName);
    setMobileMenuOpen(false);
    const element = document.querySelector(link);
    if (element && link !== "#") {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (link === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <div className="fixed inset-x-0 top-3 md:top-4 z-[9999] flex justify-center pointer-events-none px-3 sm:px-4">
          <motion.div
            ref={navRef}
            initial={{ y: -80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -80, opacity: 0, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              mass: 0.7,
            }}
            style={{
              rotateX: rotateX,
              rotateY: rotateY,
              transformStyle: "preserve-3d",
            }}
            className="pointer-events-auto relative w-full max-w-fit"
          >
            {/* Glow */}
            <motion.div
              className="absolute inset-0 rounded-full blur-lg"
              animate={{
                background: [
                  "radial-gradient(circle at 30% 50%, rgba(192,92,32,0.06), transparent 80%)",
                  "radial-gradient(circle at 70% 50%, rgba(232,131,58,0.06), transparent 80%)",
                  "radial-gradient(circle at 30% 50%, rgba(192,92,32,0.06), transparent 80%)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {/* ──────────────────────────────────────────
                NAVBAR DESKTOP  (md et +)
            ────────────────────────────────────────── */}
            <motion.nav
              className="
                hidden md:flex items-center justify-center gap-1 lg:gap-2 xl:gap-3 2xl:gap-5
                px-4 lg:px-6 xl:px-8
                py-1.5 sm:py-2
                bg-[#fef7e8]/95 dark:bg-neutral-900/95
                backdrop-blur-2xl
                border border-[#e0b070]/30 dark:border-neutral-700/50
                rounded-full
                text-xs sm:text-sm font-medium
                transition-all duration-300
                w-auto
              "
            >
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 px-1.5 py-0.5 mr-1 lg:mr-2 shrink-0"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#c05c20] to-[#e8833a] blur-sm opacity-30"
                  />
                </div>
                <span className="text-xs lg:text-sm font-bold bg-gradient-to-r from-[#c05c20] to-[#e8833a] bg-clip-text text-transparent whitespace-nowrap">
                  PremierCarMarrakech
                </span>
              </motion.div>

              <div className="w-px h-4 bg-gradient-to-b from-transparent via-[#e0b070]/40 to-transparent shrink-0" />

              {/* Nav items */}
              {navItems.map((item, idx) => (
                <motion.a
                  key={item.name}
                  href={item.link}
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick(item.name, item.link);
                  }}
                  className="relative shrink-0"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span
                    className={`
                      flex items-center gap-1
                      px-2 lg:px-2.5 py-1 lg:py-1.5
                      rounded-full
                      transition-all duration-300
                      text-[#7a3010]/80 hover:text-[#c05c20]
                      relative z-10
                      text-[11px] lg:text-xs xl:text-sm
                      whitespace-nowrap
                      ${activeItem === item.name ? "text-[#c05c20] font-semibold" : ""}
                    `}
                  >
                    {item.name === "Clients expérience" ? "Expérience" : item.name}
                  </span>

                  {activeItem === item.name && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#c05c20]/10 to-[#e8833a]/10 border border-[#e0b070]/30"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  {hoveredIndex === idx && activeItem !== item.name && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 rounded-full bg-[#e8d8c0]/30 backdrop-blur-sm"
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.a>
              ))}

              <div className="w-px h-4 bg-gradient-to-b from-transparent via-[#e0b070]/40 to-transparent shrink-0" />

              {/* CTA Réserver */}
              <motion.a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleClick("Contact", "#contact");
                }}
                className="
                  flex items-center gap-1.5
                  px-3 lg:px-4 py-1 lg:py-1.5
                  ml-0.5 shrink-0
                  rounded-full
                  bg-gradient-to-r from-[#c05c20] to-[#e8833a]
                  text-[#fef7e8] text-[11px] lg:text-xs xl:text-sm font-semibold
                  relative overflow-hidden
                  group whitespace-nowrap
                "
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Réserver</span>
                <ChevronRight className="w-3 h-3 relative z-10 group-hover:translate-x-0.5 transition-transform" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </motion.a>

              {/* Téléphone — visible uniquement xl+ */}
              <motion.div
                className="hidden xl:flex items-center gap-1.5 px-1.5 py-0.5 shrink-0"
                whileHover={{ scale: 1.02 }}
              >
                <Phone className="w-3 h-3 text-[#c05c20]" />
                <span className="text-[10px] font-medium text-[#7a3010] whitespace-nowrap">
                    +212 777 882 400
                </span>
              </motion.div>
            </motion.nav>

            {/* ──────────────────────────────────────────
                NAVBAR MOBILE  (< md)
            ────────────────────────────────────────── */}
            <motion.nav
              className="
                flex md:hidden items-center justify-between
                w-[calc(100vw-1.5rem)] max-w-sm
                px-4 py-2
                bg-[#fef7e8]/95 dark:bg-neutral-900/95
                backdrop-blur-2xl
                border border-[#e0b070]/30 dark:border-neutral-700/50
                rounded-full
                font-medium
              "
            >
              {/* Logo mobile */}
              <div className="flex items-center gap-1.5">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#c05c20] to-[#e8833a] blur-sm opacity-30"
                  />
                  <Car className="w-4 h-4 text-[#c05c20] relative" />
                </div>
                <span className="text-sm font-bold bg-gradient-to-r from-[#c05c20] to-[#e8833a] bg-clip-text text-transparent">
                  PremierCarMarrakech
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* CTA compact mobile */}
                <motion.a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick("Contact", "#contact");
                  }}
                  className="
                    flex items-center gap-1
                    px-3 py-1.5
                    rounded-full
                    bg-gradient-to-r from-[#c05c20] to-[#e8833a]
                    text-[#fef7e8] text-xs font-semibold
                    relative overflow-hidden
                    group
                  "
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="relative z-10">Réserver</span>
                  <ChevronRight className="w-3 h-3 relative z-10 group-hover:translate-x-0.5 transition-transform" />
                </motion.a>

                {/* Burger */}
                <motion.button
                  onClick={() => setMobileMenuOpen((o) => !o)}
                  className="
                    flex items-center justify-center
                    w-8 h-8 rounded-full
                    bg-[#e8d8c0]/40
                    text-[#c05c20]
                    transition-colors
                  "
                  whileTap={{ scale: 0.93 }}
                  aria-label="Menu"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {mobileMenuOpen ? (
                      <motion.span
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        <X className="w-4 h-4" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                      >
                        <Menu className="w-4 h-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.nav>

            {/* ──────────────────────────────────────────
                DROPDOWN MENU MOBILE
            ────────────────────────────────────────── */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  className="
                    absolute top-full left-0 right-0 mt-2
                    bg-[#fef7e8]/97 dark:bg-neutral-900/97
                    backdrop-blur-2xl
                    border border-[#e0b070]/30
                    rounded-2xl
                    overflow-hidden
                    shadow-lg shadow-[#c05c20]/10
                    md:hidden
                  "
                >
                  <div className="flex flex-col py-2">
                    {navItems.map((item, idx) => (
                      <motion.a
                        key={item.name}
                        href={item.link}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick(item.name, item.link);
                        }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`
                          flex items-center justify-between
                          px-5 py-3
                          text-sm font-medium
                          transition-colors duration-200
                          ${activeItem === item.name
                            ? "text-[#c05c20] bg-[#c05c20]/8"
                            : "text-[#7a3010]/80 hover:text-[#c05c20] hover:bg-[#e8d8c0]/30"
                          }
                        `}
                      >
                        <span>{item.name}</span>
                        {activeItem === item.name && (
                          <motion.div
                            layoutId="activeMobileNav"
                            className="w-1.5 h-1.5 rounded-full bg-[#c05c20]"
                          />
                        )}
                      </motion.a>
                    ))}

                    {/* Téléphone dans le menu mobile */}
                    <div className="flex items-center gap-2 px-5 py-3 mt-1 border-t border-[#e0b070]/20">
                      <Phone className="w-3.5 h-3.5 text-[#c05c20]" />
                      <span className="text-xs font-medium text-[#7a3010]">+212 777 882 400</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Particules décoratives */}
            <div className="absolute -inset-3 pointer-events-none overflow-visible">
              {[...Array(2)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-0.5 rounded-full bg-[#e8833a]/20"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 0.2, 0],
                    scale: [0, 1, 0],
                    x: [0, (i - 0.5) * 25],
                    y: [0, -15],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.5,
                    repeat: Infinity,
                    repeatDelay: 1.5,
                  }}
                  style={{
                    left: `${35 + i * 30}%`,
                    top: "50%",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}