"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Package, ChevronDown, Palette, Sparkles, Gem, Ruler, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import styles from "./ProductClient.module.css";

const productImages = [
  { src: "/images/bag-front.jpg",      alt: "Handcrafted Handbag — Front View" },
  { src: "/images/bag-top.jpg",        alt: "Handcrafted Handbag — Top View" },
  { src: "/images/bag-collection.jpg", alt: "Handcrafted Handbag — Collection" },
  { src: "/images/handbag-detail.jpg", alt: "Handcrafted Handbag — Detail" },
];

const productFeatures = [
  { 
    id: "craft",
    icon: Palette,
    title: "Traditional Block Printing", 
    desc: "Each handbag features authentic Pakistani block printing — a centuries-old heritage craft with vibrant geometric & floral motifs." 
  },
  { 
    id: "shisha",
    icon: Sparkles,
    title: "Mirror & Shisha Work", 
    desc: "Intricately hand-embroidered shisha mirror work and shimmering bead accents that reflect light with subtle radiance." 
  },
  { 
    id: "tassels",
    icon: Gem,
    title: "Gold Tassel & Pearl Detailing", 
    desc: "Accented with rich gold metallic tassels and delicate beaded edges for an opulent festive finish." 
  },
  { 
    id: "dimensions",
    icon: Ruler,
    title: "Size & Dimensions", 
    desc: "Measures ~10\" × 10\". Perfectly sized to carry your smartphone, cards, makeup, and daily essentials with effortless elegance." 
  },
];

export function ProductClient() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default
  const { addItem, toggleCart } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      id: "itminaan-handbag",
      name: "Handcrafted Handbag",
      price: 1299,
      quantity: qty,
      image: productImages[0].src,
    });
    toggleCart();
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>

        {/* ── Left: Gallery ── */}
        <div className={styles.gallery}>
          <motion.div
            key={selectedImage}
            className={styles.mainWrap}
            initial={{ opacity: 0.85, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Image
              src={productImages[selectedImage].src}
              alt={productImages[selectedImage].alt}
              width={700}
              height={700}
              className={styles.mainImage}
              priority
            />
          </motion.div>
          <div className={styles.thumbs}>
            {productImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`${styles.thumb} ${selectedImage === i ? styles.thumbActive : ""}`}
                aria-label={img.alt}
              >
                <Image src={img.src} alt={img.alt} width={100} height={100} className={styles.thumbImg} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: Details ── */}
        <motion.div
          className={styles.details}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.badgeRow}>
            <span className={styles.tag}>ITMINAAN Heritage Collection</span>
          </div>

          <h1 className={styles.title}>Handcrafted Handbag</h1>
          <p className={styles.desc}>
            A celebration of traditional Pakistani artistry. Crafted with authentic block printing, 
            intricate mirror work, and opulent gold tassel detailing — designed to elevate every occasion.
          </p>

          {/* Price */}
          <div className={styles.priceRow}>
            <div className={styles.priceWrapper}>
              <span className={styles.price}>Rs. 1,299</span>
              <span className={styles.originalPrice}>Rs. 1,899</span>
            </div>
            <span className={styles.codBadge}>✓ Cash on Delivery Available</span>
          </div>

          {/* Quantity */}
          <div className={styles.qtyRow}>
            <span className={styles.qtyLabel}>Quantity</span>
            <div className={styles.qtyControls}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} className={styles.qtyBtn} aria-label="Decrease quantity">−</button>
              <span className={styles.qtyValue}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} className={styles.qtyBtn} aria-label="Increase quantity">+</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <motion.button onClick={handleAddToCart} className={styles.btnCart} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              ADD TO CART
            </motion.button>
            <motion.button onClick={handleAddToCart} className={styles.btnBuy} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              ORDER NOW (COD)
            </motion.button>
          </div>

          {/* Trust Highlights */}
          <div className={styles.benefits}>
            <div className={styles.benefitItem}>
              <Truck size={16} className={styles.benefitIcon} />
              <span>Free COD Delivery across Pakistan (3–5 Working Days)</span>
            </div>
            <div className={styles.benefitItem}>
              <ShieldCheck size={16} className={styles.benefitIcon} />
              <span>100% Quality Checked &amp; Handcrafted Assurance</span>
            </div>
          </div>

          {/* Luxury Accordion Specs */}
          <div className={styles.accordionContainer}>
            <h3 className={styles.accordionHeading}>Product Specifications</h3>
            <div className={styles.accordionList}>
              {productFeatures.map((item, i) => {
                const IconComponent = item.icon;
                const isOpen = openIndex === i;
                return (
                  <div key={item.id} className={`${styles.accordionItem} ${isOpen ? styles.accordionItemOpen : ""}`}>
                    <button
                      type="button"
                      className={styles.accordionHeader}
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                    >
                      <div className={styles.accordionTitleGroup}>
                        <div className={styles.iconCircle}>
                          <IconComponent size={15} />
                        </div>
                        <span className={styles.accordionTitle}>{item.title}</span>
                      </div>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className={styles.chevronWrapper}
                      >
                        <ChevronDown size={17} strokeWidth={1.75} />
                      </motion.span>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          className={styles.accordionBody}
                        >
                          <p className={styles.accordionDesc}>{item.desc}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
