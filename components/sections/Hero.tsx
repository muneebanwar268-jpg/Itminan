"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./Hero.module.css";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="hero"
      ref={containerRef}
      className={styles.section}
    >
      <div className={styles.ambient} />

      <div className={styles.content}>
        <div className={styles.textContent}>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={styles.badge}
          >
            The Rhinestone Collection
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={styles.headline}
          >
            Mindfulness, <br />
            <span className={styles.headlineEm}>in every count.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className={styles.description}
          >
            Crafted with precision and heavily embellished with sparkling crystals. 
            The new Itminan is a premium smart tasbih counter designed to bring 
            elegant tranquility to your daily remembrance.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={styles.imageContainer}
        >
          <Image
            src="/images/hero-tasbih.png"
            alt="Luxury Rhinestone Tasbih"
            width={800}
            height={800}
            className={styles.productImage}
            priority
          />
          <a href="/product" className={styles.ctaPrimary}>
            Acquire
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className={styles.scrollIndicator}
      >
        <span>Discover</span>
        <div className={styles.scrollLine} />
      </motion.div>
    </section>
  );
}
