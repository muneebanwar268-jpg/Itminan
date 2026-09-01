"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./Reviews.module.css";

export function Reviews() {
  return (
    <section id="reviews" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className={styles.title}>What Customers Say</h2>
          <p className={styles.sub}>
            Genuine reviews will appear here once our first orders are delivered.
            We believe in honest feedback only.
          </p>
        </motion.div>

        <motion.div
          className={styles.comingSoon}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <span key={i} className={styles.star}>★</span>
            ))}
          </div>
          <p className={styles.comingSoonText}>
            Reviews coming soon — be the first to order!
          </p>
          <a href="#product" className={styles.orderBtn}>
            Order Now →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
