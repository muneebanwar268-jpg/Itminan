"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./FAQ.module.css";

const faqs = [
  {
    q: "🚚 Do you offer Cash on Delivery?",
    a: "Yes, Cash on Delivery is available across Pakistan.",
  },
  {
    q: "💰 What are the delivery charges?",
    a: "We charge a standard delivery fee of Rs. 199 across Pakistan with safe and insured Cash on Delivery.",
  },
  {
    q: "📦 How long will my order take to arrive?",
    a: "Orders are delivered in 3–5 working days.",
  },
  {
    q: "📏 What is the size of the handbag?",
    a: "It measures up to 10\" × 10\".",
  },
  {
    q: "✨ What makes this handbag special?",
    a: "It features traditional block printing, premium mirror work and handcrafted tassel detailing — all made by skilled artisans.",
  },
  {
    q: "💬 What if I am not satisfied?",
    a: "We assure the quality of our products. If you're still not satisfied, please contact us on the number provided for further details.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className={styles.section}>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <h2 className={styles.title}>Frequently Asked Questions</h2>
        </motion.div>

        <div className={styles.list}>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className={styles.item}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className={styles.question}
                aria-expanded={open === i}
              >
                <span>{faq.q}</span>
                <motion.span
                  className={styles.chevron}
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  aria-hidden
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    className={styles.answer}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className={styles.answerInner}>{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
