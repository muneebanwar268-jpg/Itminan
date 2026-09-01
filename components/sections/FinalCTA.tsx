"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./FinalCTA.module.css";

export function FinalCTA() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.badge}>Limited Stock Available</span>
          <h2 className={styles.title}>Join ITMINAAN Today</h2>
          <p className={styles.sub}>
            Handcrafted tradition. Delivered to your door.
          </p>
          <Link href="/product" className={styles.cta}>
            <motion.span
              style={{ display: "inline-flex", alignItems: "center" }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              SHOP NOW →
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
