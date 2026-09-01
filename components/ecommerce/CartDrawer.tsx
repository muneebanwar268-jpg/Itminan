"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import styles from "./CartDrawer.module.css";

import { useRouter } from "next/navigation";

export function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  // Prevent hydration mismatch for zustand persist
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className={styles.backdrop}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={styles.drawer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>Your Cart</h2>
              <button 
                type="button" 
                onClick={(e) => {
                  e.stopPropagation();
                  closeCart();
                }} 
                className={styles.closeBtn}
                aria-label="Close cart"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className={styles.emptyState}>
                <ShoppingBag size={48} strokeWidth={1} />
                <p>Your cart is currently empty.</p>
              </div>
            ) : (
              <div className={styles.itemList}>
                {items.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                    
                    <div className={styles.itemDetails}>
                      <div className={styles.itemHeader}>
                        <div>
                          <h3 className={styles.itemName}>{item.name}</h3>
                          <p className={styles.itemVariant}>
                            Handcrafted Handbag
                          </p>
                        </div>
                        <span className={styles.itemPrice}>Rs. {item.price.toLocaleString()}</span>
                      </div>

                      <div className={styles.itemActions}>
                        <div className={styles.quantityControls}>
                          <button 
                            type="button"
                            className={styles.qtyBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item.id, item.quantity - 1);
                            }}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className={styles.qtyValue}>{item.quantity}</span>
                          <button 
                            type="button"
                            className={styles.qtyBtn}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item.id, item.quantity + 1);
                            }}
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button 
                          type="button"
                          className={styles.removeBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeItem(item.id);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {items.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.subtotalRow}>
                  <span className={styles.subtotalLabel}>Subtotal</span>
                  <span className={styles.subtotalValue}>Rs. {getTotalPrice().toLocaleString()}</span>
                </div>
                <button 
                  className={styles.checkoutBtn}
                  onClick={handleCheckout}
                >
                  Proceed to Checkout (COD) <ArrowRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
