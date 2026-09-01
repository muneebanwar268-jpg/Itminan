"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./WhyUs.module.css";

const cards = [
  {
    icon: "✨",
    title: "COD Available",
    body: "Across Pakistan",
  },
  {
    icon: "🪡",
    title: "Quality Assured",
    body: "Made with care",
  },
  {
    icon: "🎨",
    title: "Block Printing",
    body: "Traditional craft",
  },
  {
    icon: "📦",
    title: "Handled With Care",
    body: "Packed with love",
  },
];

export function WhyUs() {
  return (
    <section id="why-us" className={styles.section}>
      <div className={styles.inner}>

        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className={styles.title}>Why ITMINAAN?</h2>
        </motion.div>

        <div className={styles.grid}>
          {cards.map((card, i) => (
            <motion.div
              key={i}
              className={styles.card}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={styles.cardIcon} aria-hidden>{card.icon}</span>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardBody}>{card.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className={styles.giftBanner}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          <span className={styles.giftIcon}>🎁</span>
          <div>
            <p className={styles.giftTitle}>Gift-Worthy &amp; Made for Occasions</p>
            <p className={styles.giftSub}>Perfect for gifting, weddings, parties &amp; festive occasions.</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
