"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Accueil", link: "#" },
  { name: "Nos voitures", link: "#cars" },
  { name: "Services", link: "#services" },
  { name: "À propos", link: "#about" },
  { name: "Contact", link: "#contact" },
];

export default function FloatingNavbar() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      // Toujours visible en haut de page
      if (currentScrollY < 80) {
        setVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Cache au scroll down, montre au scroll up
      const goingDown = currentScrollY > lastScrollY;
      setVisible(!goingDown);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar, { passive: true });
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {visible && (
        <div
          className="
            fixed inset-x-0 top-4 z-[9999] 
            flex justify-center pointer-events-none
            md:top-6
          "
        >
          <motion.nav
            initial={{ y: -100, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -100, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="
              pointer-events-auto
              flex items-center justify-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 lg:gap-10
              px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 
              py-2.5 xs:py-3 sm:py-3.5
              bg-white/75 dark:bg-neutral-900/75
              backdrop-blur-xl 
              border border-neutral-200/60 dark:border-neutral-700/50
              rounded-full 
              shadow-xl shadow-black/10 dark:shadow-black/30
              text-sm sm:text-base font-medium text-neutral-800 dark:text-neutral-100
            "
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.link}
                className="
                  flex items-center gap-1.5 sm:gap-2
                  px-3 sm:px-4 py-1.5 sm:py-2
                  rounded-full
                  hover:bg-neutral-100/70 dark:hover:bg-neutral-800/50
                  hover:text-amber-800 dark:hover:text-amber-300
                  transition-all duration-200
                "
              >
                <span>{item.name}</span>
              </a>
            ))}
          </motion.nav>
        </div>
      )}
    </AnimatePresence>
  );
}