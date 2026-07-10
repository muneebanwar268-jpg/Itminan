"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./Specs.module.css";

const specsData = [
  {
    label: "Materials",
    value: "Aerospace-grade zinc alloy body, hand-set premium crystals, and a scratch-resistant Sapphire OLED shield."
  },
  {
    label: "Display",
    value: "0.42-inch high-contrast energy-efficient OLED display."
  },
  {
    label: "Battery & Charging",
    value: "Up to 7 days of continuous use; accompanied by a magnetic leather charging vault."
  },
  {
    label: "Weight",
    value: "Engineered for a lightweight, balanced profile weighing only 7.8 grams."
  }
];

export function Specs() {
  return (
    <section id="specs" className={styles.section}>
      <div className={styles.inner}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className={styles.header}
        >
          <span className={styles.badge}>
            Technical Details
          </span>
          <h2 className={styles.title}>
            The exact specifications.
          </h2>
        </motion.div>

        <div className={styles.list}>
          {specsData.map((spec, index) => (
            <motion.div 
              key={index} 
              className={styles.rowContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className={styles.row}>
                <motion.span 
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { duration: 0.8, delay: 0.4 } }
                  }}
                  className={styles.rowLabel}
                >
                  {spec.label}
                </motion.span>
                <motion.span 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.5, ease: "easeOut" } }
                  }}
                  className={styles.rowValue}
                >
                  {spec.value}
                </motion.span>
              </div>
              
              {/* Animated bottom border */}
              <motion.div 
                variants={{
                  hidden: { scaleX: 0 },
                  visible: { scaleX: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
                }}
                className={styles.rowBorder}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
