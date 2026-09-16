"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, ChevronDown, Palette, Sparkles, Gem, Ruler, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import type { StoreProduct } from "@/lib/shopify-admin";
import { trackMetaEvent } from "@/lib/pixel";
import styles from "./ProductClient.module.css";

const fallbackImages = [
  { src: "/images/bag-front.jpg",      alt: "Handcrafted Handbag — Front View" },
  { src: "/images/bag-top.jpg",        alt: "Handcrafted Handbag — Top View" },
  { src: "/images/bag-collection.jpg", alt: "Handcrafted Handbag — Collection" },
  { src: "/images/handbag-detail.jpg", alt: "Handcrafted Handbag — Detail" },
];

const productFeatures = [
  { 
    id: "craft",
    icon: Palette,
    title: "Chain Attached", 
    desc: "Golden Chain Attached for easy carry." 
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

interface ProductClientProps {
  product?: StoreProduct;
}

export function ProductClient({ product }: ProductClientProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default
  const { addItem, openCart } = useCartStore();

  const fallbackVariants: NonNullable<StoreProduct['variants']> = [
    { id: "gid://shopify/ProductVariant/49071507669224", title: "1 Bag", price: 1299, compareAtPrice: 1884, availableForSale: true, image: "/images/bag-front.jpg" },
    { id: "gid://shopify/ProductVariant/49071507701992", title: "2 Bags", price: 1999, compareAtPrice: 2999, availableForSale: true, image: "/images/bag-front.jpg" },
    { id: "gid://shopify/ProductVariant/49071507734760", title: "3 Bags", price: 2499, compareAtPrice: 4199, availableForSale: true, image: "/images/bag-front.jpg" },
    { id: "gid://shopify/ProductVariant/49071507767528", title: "5 Bags", price: 3399, compareAtPrice: 5999, availableForSale: true, image: "/images/bag-front.jpg" },
  ];

  const variants = (product?.variants && product.variants.length > 0)
    ? product.variants
    : fallbackVariants;

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const activeVariant = variants[selectedVariantIndex] || variants[0];

  const title = product?.title || "Handcrafted Handbag";
  const description = product?.description || "A celebration of traditional Pakistani artistry. Crafted with authentic block printing, intricate mirror work, and opulent gold tassel detailing — designed to elevate every occasion.";
  const price = activeVariant.price;
  const compareAtPrice = activeVariant.compareAtPrice || (price > 1000 ? Math.round(price * 1.45) : 1884);
  const discountPercent = compareAtPrice > price
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;
  
  const productImages = (product?.images && product.images.length > 0)
    ? product.images.map((img) => ({ src: img.url, alt: img.altText || title }))
    : fallbackImages;

  const currentImage = productImages[selectedImage] || productImages[0];
  const productId = activeVariant.id;
  const variantTitle = activeVariant.title;

  // Track ViewContent on mount
  useEffect(() => {
    trackMetaEvent("ViewContent", {
      content_name: title,
      content_type: "product",
      content_ids: [productId],
      value: price,
      currency: "PKR",
      contents: [{
        id: productId,
        quantity: 1,
        item_price: price,
        title: title,
      }],
    });
  }, [title, price, productId]);

  const handleAddToCart = () => {
    addItem({
      id: productId,
      name: title,
      variantTitle: variantTitle,
      price: price,
      quantity: qty,
      image: activeVariant.image || currentImage.src,
    });

    trackMetaEvent("AddToCart", {
      content_name: `${title} (${variantTitle})`,
      content_type: "product",
      content_ids: [productId],
      value: price * qty,
      currency: "PKR",
      contents: [{
        id: productId,
        quantity: qty,
        item_price: price,
        title: `${title} (${variantTitle})`,
      }],
      num_items: qty,
    });

    openCart();
  };

  const handleBuyNow = () => {
    addItem({
      id: productId,
      name: title,
      variantTitle: variantTitle,
      price: price,
      quantity: qty,
      image: activeVariant.image || currentImage.src,
    });

    trackMetaEvent("AddToCart", {
      content_name: `${title} (${variantTitle})`,
      content_type: "product",
      content_ids: [productId],
      value: price * qty,
      currency: "PKR",
      contents: [{
        id: productId,
        quantity: qty,
        item_price: price,
        title: `${title} (${variantTitle})`,
      }],
      num_items: qty,
    });

    trackMetaEvent("InitiateCheckout", {
      content_name: `${title} (${variantTitle})`,
      content_type: "product",
      content_ids: [productId],
      value: price * qty,
      currency: "PKR",
      contents: [{
        id: productId,
        quantity: qty,
        item_price: price,
        title: `${title} (${variantTitle})`,
      }],
      num_items: qty,
    });

    router.push("/checkout");
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
              src={currentImage.src}
              alt={currentImage.alt}
              width={700}
              height={700}
              className={styles.mainImage}
              priority
              unoptimized={currentImage.src.startsWith('http')}
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
                <Image 
                  src={img.src} 
                  alt={img.alt} 
                  width={100} 
                  height={100} 
                  className={styles.thumbImg} 
                  unoptimized={img.src.startsWith('http')}
                />
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

          <h1 className={styles.title}>{title}</h1>
          <p className={styles.desc}>
            {description}
          </p>

          {/* Price */}
          <div className={styles.priceRow}>
            <div className={styles.priceWrapper}>
              <span className={styles.price}>Rs. {price.toLocaleString()}</span>
              {compareAtPrice > price && (
                <span className={styles.originalPrice}>Rs. {compareAtPrice.toLocaleString()}</span>
              )}
              {discountPercent > 0 && (
                <span className={styles.discountBadge}>SAVE {discountPercent}%</span>
              )}
            </div>
            <span className={styles.codBadge}>✓ Cash on Delivery Available</span>
          </div>

          {/* Bundle & Save Offers Selector */}
          <div className={styles.bundleSection}>
            <div className={styles.bundleHeader}>
              <span className={styles.bundleLabel}>Choose Bundle &amp; Save:</span>
              <span className={styles.bundleSub}>Special Bundle Offer</span>
            </div>

            <div className={styles.bundleGrid}>
              {variants.map((v, idx) => {
                const isSelected = selectedVariantIndex === idx;
                const vCompare = v.compareAtPrice;
                const vDiscount = vCompare && vCompare > v.price
                  ? Math.round(((vCompare - v.price) / vCompare) * 100)
                  : null;

                let tag = null;
                if (v.title.includes("2")) tag = "MOST EFFICIENT";
                else if (v.title.includes("3")) tag = "BEST VALUE";
                else if (v.title.includes("5")) tag = "MEGA SAVER";

                return (
                  <button
                    key={v.id || idx}
                    type="button"
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`${styles.bundleCard} ${isSelected ? styles.bundleCardActive : ""}`}
                  >
                    {tag && <span className={styles.bundleTag}>{tag}</span>}
                    <div className={styles.bundleRadio}>
                      <div className={`${styles.radioCircle} ${isSelected ? styles.radioCircleActive : ""}`} />
                      <div className={styles.bundleTitleWrap}>
                        <span className={styles.bundleTitle}>{v.title}</span>
                        {vDiscount && (
                          <span className={styles.bundleDiscountPill}>{vDiscount}% OFF</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.bundlePriceWrap}>
                      <span className={styles.bundlePrice}>Rs. {v.price.toLocaleString()}</span>
                      {vCompare && vCompare > v.price && (
                        <span className={styles.bundleCompare}>Rs. {vCompare.toLocaleString()}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
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
            <motion.button onClick={handleBuyNow} className={styles.btnBuy} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              ORDER NOW (COD)
            </motion.button>
          </div>

          {/* Trust Highlights */}
          <div className={styles.benefits}>
            <div className={styles.benefitItem}>
              <Truck size={16} className={styles.benefitIcon} />
              <span>Delivery Charges: Rs. 199 (Nationwide 3–5 Working Days)</span>
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
