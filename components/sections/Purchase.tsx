"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Truck } from "lucide-react";
import styles from "./Purchase.module.css";

export function Purchase() {
  return (
    <section id="purchase" className={styles.section}>
      <div className={styles.inner}>
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={styles.card}
        >
          {/* Left: Description */}
          <div className={styles.left}>
            <span className={styles.badge}>
              Acquire
            </span>
            <h2 className={styles.title}>
              Bring tranquility home.
            </h2>
            <p className={styles.body}>
              The Itminan Smart Tasbih Ring is shipped inside an elegant magnetic leather
              charging vault, complete with premium cable and lifetime access to our
              meditation companion app.
            </p>
            <div className={styles.badges}>
              <div className={styles.badgeItem}>
                <Truck className={styles.badgeIcon} strokeWidth={1.5} />
                <span>Complimentary Shipping</span>
              </div>
              <div className={styles.badgeItem}>
                <ShieldCheck className={styles.badgeIcon} strokeWidth={1.5} />
                <span>2-Year Warranty Included</span>
              </div>
            </div>
          </div>

          {/* Right: Purchase card */}
          <div className={styles.right}>
            <div className={styles.priceRow}>
              <span className={styles.label}>Itminan Smart Tasbih</span>
              <span className={styles.price}>$149</span>
            </div>
            <a href="/product" className={styles.orderBtn}>
              Order Now
            </a>
            <span className={styles.note}>
              Express shipping worldwide. 30-day money-back guarantee.
            </span>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
