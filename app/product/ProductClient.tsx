"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Truck, RefreshCcw, ChevronDown, ChevronUp, Package, BatteryCharging, Fingerprint, Star } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import styles from "./ProductClient.module.css";
import { Specs } from "@/components/sections/Specs";

const SIZES = ["7", "8", "9", "10", "11", "12"];
const FINISHES = ["Rhodium", "Rose Gold", "Yellow Gold"];

export function ProductClient() {
  const [selectedSize, setSelectedSize] = useState(SIZES[1]);
  const [selectedFinish, setSelectedFinish] = useState(FINISHES[0]);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      name: "Itminan Smart Tasbih",
      price: 149,
      quantity: 1,
      size: selectedSize,
      finish: selectedFinish,
      image: "/images/hero-tasbih.png" // using existing asset
    });
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        
        {/* Sticky Gallery */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={styles.gallery}
        >
          <Image
            src="/images/hero-tasbih.png"
            alt="Itminan Smart Tasbih"
            width={800}
            height={800}
            className={styles.mainImage}
            priority
          />
        </motion.div>

        {/* Product Details */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className={styles.details}
        >
          <div className={styles.header}>
            <span className={styles.badge}>Rhinestone Collection</span>
            <h1 className={styles.title}>Itminan Smart Tasbih</h1>
            <span className={styles.price}>$149.00 USD</span>
            <p className={styles.description}>
              Crafted with precision and heavily embellished with sparkling crystals. 
              The new Itminan is a premium smart tasbih counter designed to bring 
              elegant tranquility to your daily remembrance.
            </p>
          </div>

          <div className={styles.options}>
            <div className={styles.optionGroup}>
              <span className={styles.optionLabel}>Finish: {selectedFinish}</span>
              <div className={styles.buttonGrid}>
                {FINISHES.map(finish => (
                  <button
                    key={finish}
                    onClick={() => setSelectedFinish(finish)}
                    className={selectedFinish === finish ? styles.optionBtnActive : styles.optionBtn}
                  >
                    {finish}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.optionGroup}>
              <span className={styles.optionLabel}>Ring Size: {selectedSize}</span>
              <div className={styles.buttonGrid}>
                {SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={selectedSize === size ? styles.optionBtnActive : styles.optionBtn}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button onClick={handleAddToCart} className={styles.addBtn}>
              Add to Cart
            </button>
          </div>

          <div className={styles.benefits}>
            <div className={styles.benefitItem}>
              <Truck size={18} className={styles.benefitIcon} />
              <span>Complimentary worldwide shipping</span>
            </div>
            <div className={styles.benefitItem}>
              <ShieldCheck size={18} className={styles.benefitIcon} />
              <span>2-Year comprehensive warranty</span>
            </div>
            <div className={styles.benefitItem}>
              <RefreshCcw size={18} className={styles.benefitIcon} />
              <span>30-Day hassle-free returns</span>
            </div>
          </div>

          <div className={styles.accordion}>
            {[
              { 
                title: "Materials & Care", 
                content: "Crafted from aerospace-grade zinc alloy, encrusted with brilliant, hand-set premium crystals. Wipe clean with a soft, dry microfiber cloth. Avoid prolonged exposure to harsh chemicals or extreme temperatures to maintain the brilliant finish."
              },
              { 
                title: "Shipping & Returns", 
                content: "We offer complimentary express shipping worldwide. Orders are typically processed within 24 hours. If you are not completely satisfied, you may return the device within 30 days of receipt in its original, unopened packaging for a full refund."
              },
              { 
                title: "Dimensions", 
                content: "Weighing precisely 7.8 grams, the Itminan ring is engineered for a lightweight, balanced profile that is virtually unnoticeable during daily wear. The OLED screen measures 0.42 inches diagonally."
              }
            ].map((item, i) => (
              <div key={i} className={styles.accordionItem}>
                <button 
                  className={styles.accordionHeader}
                  onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
                >
                  {item.title}
                  {openAccordion === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <AnimatePresence>
                  {openAccordion === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className={styles.accordionContent}>
                        {item.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </motion.div>
      </div>

      <div className={styles.extendedContent}>
        {/* Unboxing Section */}
        <div className={styles.unboxing}>
          <h2 className={styles.unboxingTitle}>The complete experience.</h2>
          <div className={styles.unboxingGrid}>
            <div className={styles.unboxingItem}>
              <Fingerprint className={styles.unboxingIcon} strokeWidth={1} />
              <span className={styles.unboxingLabel}>The Ring</span>
              <p className={styles.unboxingDesc}>The smart tasbih, carefully resting in its presentation slot.</p>
            </div>
            <div className={styles.unboxingItem}>
              <Package className={styles.unboxingIcon} strokeWidth={1} />
              <span className={styles.unboxingLabel}>Leather Vault</span>
              <p className={styles.unboxingDesc}>A premium magnetic charging case covered in soft-touch leather.</p>
            </div>
            <div className={styles.unboxingItem}>
              <BatteryCharging className={styles.unboxingIcon} strokeWidth={1} />
              <span className={styles.unboxingLabel}>Braided Cable</span>
              <p className={styles.unboxingDesc}>A durable USB-C charging cable designed to last.</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className={styles.reviews}>
          <h2 className={styles.reviewsTitle}>Voices of tranquility.</h2>
          <div className={styles.reviewGrid}>
            {[
              {
                text: "An incredibly elegant device. The haptic feedback allows me to completely focus without ever needing to look down.",
                author: "Sarah A."
              },
              {
                text: "The crystal finish is absolutely stunning. It looks like a piece of high-end jewelry, but functions flawlessly as a smart tasbih.",
                author: "Omar K."
              },
              {
                text: "I love the leather charging vault. It feels incredibly premium and makes traveling with the ring so much easier.",
                author: "Fatima R."
              }
            ].map((review, i) => (
              <div key={i} className={styles.reviewCard}>
                <div className={styles.stars}>
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <p className={styles.reviewText}>"{review.text}"</p>
                <span className={styles.reviewAuthor}>{review.author}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded Specs Section */}
      <Specs />
    </section>
  );
}
