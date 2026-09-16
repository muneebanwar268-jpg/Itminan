"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section id="hero" className={styles.section}>
      {/* Ambient watermark behind the hero */}
      <div className={styles.watermark} aria-hidden>
        ITMINAAN
      </div>

      {/* Subtle background texture overlay */}
      <div className={styles.texture} aria-hidden />

      <div className={styles.inner}>
        {/* Left product image */}
        <motion.div
          className={styles.imageLeft}
          initial={{ opacity: 0, x: -40, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.imageWrap}>
            <Image
              src="/images/left.webp"
              alt="ITMINAAN Handcrafted Handbag — Front View"
              width={560}
              height={560}
              className={styles.productImg}
              priority
            />
            <motion.div
              className={styles.bagTag}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <span>✨ Mirror Work & Velvet</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Center content */}
        <div className={styles.centerText}>
          {/* Header grouping (Eyebrow & Headline) */}
          <motion.div
            className={styles.heroHeader}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* <div className={styles.eyebrowBadge}>
              <span className={styles.badgeDot} />
              <span>Handcrafted in Pakistan</span>
            </div> */}

            <h1 className={styles.headline}>
              Carry<br />
              <em>Culture.</em>
            </h1>
          </motion.div>

          {/* Action grouping (Sub, CTA, Price, Trust) */}
          <motion.div
            className={styles.heroActions}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className={styles.sub}>
              A Handbag Woven with Heritage — Mirror work, Golden tassels and a Golden Chain attached for hanging, crafted just like you ❤️❤️
            </p>

            <div className={styles.ctaGroup}>
              <Link href="/product" className={styles.cta}>
                <motion.span
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>SHOP NOW</span>
                  <span aria-hidden="true">→</span>
                </motion.span>
              </Link>

              {/* <div className={styles.priceContainer}>
                <span className={styles.priceCurrent}>Rs. 1,299</span>
                <span className={styles.priceOld}>Rs. 1,899</span>
                <span className={styles.discountPill}>SAVE 31%</span>
              </div> */}
            </div>

            <div className={styles.trustBadges}>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🚚</span>
                <span>Rs. 199 Delivery</span>
              </div>
              <span className={styles.trustDivider}>•</span>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>💵</span>
                <span>Cash on Delivery</span>
              </div>
              <span className={styles.trustDivider}>•</span>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>⭐</span>
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right product image */}
        <motion.div
          className={styles.imageRight}
          initial={{ opacity: 0, x: 40, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.imageWrap}>
            <Image
              src="/images/right.webp"
              alt="ITMINAAN Handcrafted Handbag — Collection"
              width={560}
              height={560}
              className={styles.productImg}
              priority
            />
            <motion.div
              className={styles.bagTag}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <span>⚜️ Golden Tassels & Chain</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <span>Explore</span>
        <motion.div
          className={styles.scrollLine}
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

