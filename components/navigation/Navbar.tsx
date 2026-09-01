"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./Navbar.module.css";

const navItems = [
  { label: "Overview",  href: "/#hero" },
  { label: "The Bag",   href: "/product" },
  { label: "Why Us",    href: "/#why-us" },
  { label: "FAQ",       href: "/#faq" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { toggleCart, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (pathname === "/") {
        const sections = [
          { id: "hero", el: document.getElementById("hero") },
          { id: "why-us", el: document.getElementById("why-us") },
          { id: "faq", el: document.getElementById("faq") },
        ];

        const scrollPos = window.scrollY + 180;
        let current = "hero";

        for (const section of sections) {
          if (section.el) {
            const top = section.el.offsetTop;
            if (scrollPos >= top) {
              current = section.id;
            }
          }
        }
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const totalItems = mounted ? getTotalItems() : 0;

  const isActive = (href: string) => {
    if (pathname === "/product") {
      return href === "/product";
    }
    if (pathname === "/") {
      if (href === "/#hero") return activeSection === "hero";
      if (href === "/#why-us") return activeSection === "why-us";
      if (href === "/#faq") return activeSection === "faq";
    }
    return false;
  };

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
      >
        <div className={styles.inner}>

          {/* Left — Brand Logo SVG */}
          <div className={styles.brandLogo}>
            <Link href="/" aria-label="ITMINAAN Home">
              <Image
                src="/ITMINAAN.svg"
                alt="ITMINAAN Logo"
                width={140}
                height={24}
                className={styles.logoSvg}
                priority
              />
            </Link>
          </div>

          {/* Center — All Nav Items */}
          <nav className={styles.nav} aria-label="Site navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ""}`}
              >
                {item.label}
                {isActive(item.href) && (
                  <motion.span
                    layoutId="nav-dot"
                    className={styles.navDot}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right — Cart Button */}
          <div className={styles.actions}>
            <motion.button
              onClick={toggleCart}
              className={styles.cartBtn}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Open cart"
            >
              <ShoppingBag size={16} strokeWidth={1.5} />
              <span className={styles.cartLabel}>Cart</span>
              {totalItems > 0 && (
                <span className={styles.badge}>{totalItems}</span>
              )}
            </motion.button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={styles.menuBtn}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={styles.drawer}
          >
            {navItems.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={styles.drawerLink}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.25 }}
              >
                {item.label}
              </motion.a>
            ))}
            <button onClick={() => { toggleCart(); setIsOpen(false); }} className={styles.drawerCart}>
              <ShoppingBag size={16} strokeWidth={1.5} />
              Cart
              {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
