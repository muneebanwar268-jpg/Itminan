"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Cpu, Droplets, Gem } from "lucide-react";
import styles from "./Features.module.css";

export function Features() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Extremely subtle luxury parallax speeds to prevent overlapping
  const yLarge = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const ySmall1 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const ySmall2 = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  return (
    <section id="features" ref={containerRef} className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          style={{ opacity, y: useTransform(scrollYProgress, [0, 1], [50, -50]) }}
          className={styles.header}
        >
          <span className={styles.badge}>
            Craftsmanship
          </span>
          <h2 className={styles.title}>
            Meticulously engineered details.
          </h2>
        </motion.div>

        <div className={styles.grid}>
          {/* Large Bento Card */}
          <motion.div 
            style={{ y: yLarge, opacity }}
            className={styles.cardLarge}
          >
            <div className={styles.cardContent}>
              <Cpu className={styles.cardIcon} strokeWidth={1.5} />
              <h3 className={styles.cardTitle}>Precision Haptics</h3>
              <p className={styles.cardBody}>
                Discreet, precisely tuned haptic vibrations mark your progress at 33, 66, and 99 intervals. 
                Experience absolute focus, allowing you to remain locked in your remembrance without ever needing to look at a screen.
              </p>
            </div>
          </motion.div>

          {/* Standard Cards */}
          <motion.div 
            style={{ y: ySmall1, opacity }}
            className={styles.card}
          >
            <div className={styles.cardContent}>
              <Droplets className={styles.cardIcon} strokeWidth={1.5} />
              <h3 className={styles.cardTitle}>IP68 Waterproof</h3>
              <p className={styles.cardBody}>
                A fully sealed, waterproof architecture ensures it remains an uninterrupted part of your life, safe for wudu, rain, and daily wear.
              </p>
            </div>
          </motion.div>

          <motion.div 
            style={{ y: ySmall2, opacity }}
            className={styles.card}
          >
            <div className={styles.cardContent}>
              <Gem className={styles.cardIcon} strokeWidth={1.5} />
              <h3 className={styles.cardTitle}>Premium Embellishments</h3>
              <p className={styles.cardBody}>
                Encrusted with brilliant, hand-set crystals around an aerospace-grade zinc alloy body, 
                merging timeless luxury with enduring resilience.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
