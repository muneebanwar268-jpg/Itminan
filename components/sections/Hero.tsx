"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section id="hero" className={styles.section}>
      {/* Subtle background texture overlay */}
      <div className={styles.texture} aria-hidden />

      <div className={styles.inner}>
        {/* Left product image */}
        <motion.div
          className={styles.imageLeft}
          initial={{ opacity: 0, x: -40, scale: 1.02 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.imageWrap}>
            <Image
              src="/images/bag-front.jpg"
              alt="ITMINAAN Handcrafted Handbag — Front View"
              width={520}
              height={520}
              className={styles.productImg}
              priority
            />
          </div>
        </motion.div>

        {/* Center text */}
        <motion.div
          className={styles.centerText}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.eyebrow}>Handcrafted in Pakistan</span>
          <h1 className={styles.headline}>
            Carry<br />
            <em>Culture.</em>
          </h1>
          {/* <p className={styles.sub}>
            Traditional block printing, mirror work &amp; tassel detailing — beautifully crafted for every occasion.
          </p> */}
          <Link href="/product" className={styles.cta}>
            <motion.span
              style={{ display: "inline-flex", alignItems: "center" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              SHOP NOW →
            </motion.span>
          </Link>
          {/* <span className={styles.price}>Rs. 1,299</span> */}
        </motion.div>

        {/* Right product image */}
        <motion.div
          className={styles.imageRight}
          initial={{ opacity: 0, x: 40, scale: 1.02 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.imageWrap}>
            <Image
              src="/images/bag-collection.jpg"
              alt="ITMINAAN Handcrafted Handbag — Collection"
              width={520}
              height={520}
              className={styles.productImg}
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scroll}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
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
