"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Truck, ShieldCheck, Palette, Sparkles, Gem, Ruler } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import type { StoreProduct } from "@/lib/shopify-admin";
import { trackMetaEvent } from "@/lib/pixel";
import styles from "./ProductIntro.module.css";

const fallbackImages = [
  { src: "/images/bag-front.jpg",      alt: "Handcrafted Handbag — Front View" },
  { src: "/images/bag-top.jpg",        alt: "Handcrafted Handbag — Top View" },
  { src: "/images/bag-collection.jpg", alt: "Handcrafted Handbag — Full Collection" },
  { src: "/images/handbag-detail.jpg", alt: "Handcrafted Handbag — Detail" },
];

interface ProductIntroProps {
  initialProduct?: StoreProduct;
}

export function ProductIntro({ initialProduct }: ProductIntroProps) {
  const router = useRouter();
  const [product, setProduct] = useState<StoreProduct | undefined>(initialProduct);
  const [selected, setSelected] = useState(0);
  const [qty, setQty] = useState(1);
  const { addItem, openCart, closeCart } = useCartStore();

  React.useEffect(() => {
    if (!initialProduct) {
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          if (data.product) setProduct(data.product);
        })
        .catch(() => {});
    }
  }, [initialProduct]);

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
  const description = product?.description || "A beautifully handcrafted handbag featuring traditional block printing, intricate mirror work and tassel detailing. Designed to be easy to carry and add a distinctive touch to your look.";
  const price = activeVariant.price;
  const compareAtPrice = activeVariant.compareAtPrice || (price > 1000 ? Math.round(price * 1.45) : 1884);
  const discountPercent = compareAtPrice > price
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const images = (product?.images && product.images.length > 0)
    ? product.images.map((img) => ({ src: img.url, alt: img.altText || title }))
    : fallbackImages;

  const currentImage = images[selected] || images[0];
  const productId = activeVariant.id;
  const variantTitle = activeVariant.title;

  // Track ViewContent when product data is ready
  React.useEffect(() => {
    if (product) {
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
    }
  }, [product, title, price, productId]);

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
    closeCart();
    addItem(
      {
        id: productId,
        name: title,
        variantTitle: variantTitle,
        price: price,
        quantity: qty,
        image: activeVariant.image || currentImage.src,
      },
      false
    );

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
    <section id="product" className={styles.section}>
      <div className={styles.inner}>

        {/* Left — Product Gallery */}
        <div className={styles.gallery}>
          <motion.div
            key={selected}
            className={styles.mainImageWrap}
            initial={{ opacity: 0.8, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              width={600}
              height={600}
              className={styles.mainImage}
              priority
              unoptimized={currentImage.src.startsWith('http')}
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
                  unoptimized={img.src.startsWith('http')}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right — Product Details */}
        <motion.div
          className={styles.details}
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.topMeta}>
            <span className={styles.tag}>ITMINAAN Collection</span>

          </div>

          <h2 className={styles.productName}>{title}</h2>

          <p className={styles.description}>
            {description}
          </p>

          <div className={styles.priceRow}>
            <div className={styles.priceGroup}>
              <span className={styles.price}>Rs. {price.toLocaleString()}</span>
              {compareAtPrice > price && (
                <span className={styles.originalPrice}>Rs. {compareAtPrice.toLocaleString()}</span>
              )}
              {discountPercent > 0 && (
                <span className={styles.discountBadge}>SAVE {discountPercent}%</span>
              )}
            </div>
            <div className={styles.stockBadge}>
              <span className={styles.stockDot} />
              In Stock — COD Available
            </div>
          </div>

          {/* Craftsmanship & Specification Highlights */}
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <Palette size={16} className={styles.featureIcon} />
              <div className={styles.featureText}>
                <strong>Chain Attached</strong>
                <span>Golden Chain Attached for easy carry</span>
              </div>
            </div>
            <div className={styles.featureCard}>
              <Sparkles size={16} className={styles.featureIcon} />
              <div className={styles.featureText}>
                <strong>Mirror &amp; Shisha Work</strong>
                <span>Real hand-embroidered mirror embellishments</span>
              </div>
            </div>
            <div className={styles.featureCard}>
              <Gem size={16} className={styles.featureIcon} />
              <div className={styles.featureText}>
                <strong>Gold Tassel Detailing</strong>
                <span>Opulent hand-tied zari latkan drawstrings</span>
              </div>
            </div>
            <div className={styles.featureCard}>
              <Ruler size={16} className={styles.featureIcon} />
              <div className={styles.featureText}>
                <strong>Festive Size (~10&quot; × 10&quot;)</strong>
                <span>Spacious interior for phone, makeup &amp; essentials</span>
              </div>
            </div>
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

          {/* Quantity & CTA Buttons */}
          <div className={styles.purchaseRow}>
            <div className={styles.qtyPicker}>
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className={styles.qtyBtn}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className={styles.qtyValue}>{qty}</span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className={styles.qtyBtn}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <div className={styles.actions}>
              <motion.button
                onClick={handleAddToCart}
                className={styles.btnCart}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                ADD TO CART
              </motion.button>
              <motion.button
                type="button"
                onClick={handleBuyNow}
                className={styles.btnBuy}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                BUY NOW (COD)
              </motion.button>
            </div>
          </div>

          {/* Reassurance Banner */}
          <div className={styles.assuranceBanner}>
            <div className={styles.assuranceItem}>
              <Truck size={16} className={styles.assuranceIcon} />
              <span>Delivery Charges: Rs. 199 (Nationwide 3–5 Days)</span>
            </div>
            <div className={styles.assuranceDivider} />
            <div className={styles.assuranceItem}>
              <ShieldCheck size={16} className={styles.assuranceIcon} />
              <span>Cash on Delivery &amp; 100% Quality Assured</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
