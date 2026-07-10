"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Menu, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import styles from "./Navbar.module.css";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { toggleCart, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ["hero", "philosophy", "features", "specs", "purchase"];
      let current = "hero";

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "hero", label: "Overview" },
    { id: "philosophy", label: "Philosophy" },
    { id: "features", label: "Craftsmanship" },
    { id: "specs", label: "Specs" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}
      >
        <div className={styles.inner}>
          {/* Logo */}
          <a
            href="#hero"
            className={styles.logo}
          >
            <Sparkles className={styles.logoIcon} />
            <span className={styles.logoText}>
              ITMINAN
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className={styles.nav}>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={styles.navLink}
                style={{
                  color: activeSection === item.id ? "var(--gold-accent)" : "var(--text-muted)",
                }}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className={styles.indicator}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Action Trigger */}
          <div className={styles.ctaContainer}>
            <button 
              onClick={toggleCart} 
              className={styles.cartBtn}
              aria-label="Open Cart"
            >
              <ShoppingBag className={styles.cartIcon} strokeWidth={1.5} />
              {mounted && getTotalItems() > 0 && (
                <span className={styles.cartBadge}>{getTotalItems()}</span>
              )}
            </button>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href="/product"
              className={styles.cta}
            >
              Acquire
            </motion.a>
          </div>

          {/* Mobile Toggle */}
          <div className={styles.mobileToggleContainer}>
            <button 
              onClick={toggleCart} 
              className={styles.cartBtnMobile}
              aria-label="Open Cart"
            >
              <ShoppingBag className={styles.cartIcon} strokeWidth={1.5} />
              {mounted && getTotalItems() > 0 && (
                <span className={styles.cartBadge}>{getTotalItems()}</span>
              )}
            </button>
            <motion.a
              whileTap={{ scale: 0.95 }}
              href="/product"
              className={styles.ctaMobile}
            >
              Acquire
            </motion.a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={styles.mobileToggleBtn}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className={styles.mobileToggleIcon} /> : <Menu className={styles.mobileToggleIcon} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={styles.drawer}
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setIsOpen(false)}
                className={styles.drawerLink}
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
