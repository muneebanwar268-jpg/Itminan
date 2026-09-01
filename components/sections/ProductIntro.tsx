"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import styles from "./ProductIntro.module.css";

const images = [
  { src: "/images/bag-front.jpg",      alt: "Handcrafted Handbag — Front View" },
  { src: "/images/bag-top.jpg",        alt: "Handcrafted Handbag — Top View" },
  { src: "/images/bag-collection.jpg", alt: "Handcrafted Handbag — Full Collection" },
  { src: "/images/handbag-detail.jpg", alt: "Handcrafted Handbag — Detail" },
];

export function ProductIntro() {
  const [selected, setSelected] = useState(0);
  const { addItem, toggleCart } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      id: "itminaan-handbag",
      name: "Handcrafted Handbag",
      price: 1299,
      quantity: 1,
      image: "/images/bag-front.jpg",
    });
    toggleCart();
  };

  return (
    <section id="product" className={styles.section}>
      <div className={styles.inner}>

        {/* Left — Product Gallery */}
        <div className={styles.gallery}>
          <motion.div
            key={selected}
            className={styles.mainImageWrap}
            initial={{ opacity: 0.7, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Image
              src={images[selected].src}
              alt={images[selected].alt}
              width={600}
              height={600}
              className={styles.mainImage}
              priority
            />
          </motion.div>

          {/* Thumbnails */}
          <div className={styles.thumbnails} role="list">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`${styles.thumb} ${selected === i ? styles.thumbActive : ""}`}
                aria-label={img.alt}
                role="listitem"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={100}
                  height={100}
                  className={styles.thumbImg}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right — Product Details */}
        <motion.div
          className={styles.details}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.tag}>ITMINAAN Collection</span>
          <h2 className={styles.productName}>Handcrafted Handbag</h2>
          <p className={styles.description}>
            A beautifully handcrafted handbag featuring traditional block printing, 
            intricate mirror work and tassel detailing. Designed to be easy to carry 
            and add a distinctive touch to your look.
          </p>

          <div className={styles.priceRow}>
            <span className={styles.price}>Rs. 1,299</span>
            <span className={styles.priceSub}>COD Available</span>
          </div>

          <div className={styles.features}>
            <div className={styles.featureItem}>
              <span className={styles.featureDot} />
              Traditional block printing
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureDot} />
              Mirror &amp; shisha embroidery
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureDot} />
              Gold tassel detailing
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureDot} />
              ~10&quot; × 10&quot; size
            </div>
          </div>

          <div className={styles.actions}>
            <motion.button
              onClick={handleAddToCart}
              className={styles.btnCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              ADD TO CART
            </motion.button>
            <motion.a
              href="#product"
              onClick={handleAddToCart}
              className={styles.btnBuy}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              BUY NOW
            </motion.a>
          </div>

          <div className={styles.trust}>
            <span>🚚 Cash on Delivery</span>
            <span>📦 3–5 Day Delivery</span>
            <span>✨ Quality Assured</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
