"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./AnnouncementBar.module.css";

const slides = [
  {
    text: "🚚  COD Available Across Pakistan",
    bg: "#20201D",
  },
  {
    text: "📦  Delivered in 3–5 Working Days",
    bg: "#6e5002ff",   // deep navy
  },
  {
    text: "✨  Better Quality. Better Prices.",
    bg: "#3A2218",   // warm espresso
  },
  {
    text: "🛍️  Shop ITMINAAN — Rs. 1,299",
    bg: "#2D1A0E",   // dark amber-brown
  },
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = slides[index];

  return (
    <motion.div
      className={styles.bar}
      animate={{ backgroundColor: current.bg }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      role="status"
      aria-live="polite"
      aria-label="Announcements"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className={styles.text}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        >
          {current.text}
        </motion.span>
      </AnimatePresence>

      {/* Dot indicators */}
      {/* <div className={styles.dots} aria-hidden>
        {slides.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i === index ? styles.dotActive : ""}`}
          />
        ))}
      </div> */}
    </motion.div>
  );
}
