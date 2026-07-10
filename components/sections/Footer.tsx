"use client";

import React from "react";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.brandName}>
            ITMINAN
          </span>
          <span className={styles.copy}>
            © {new Date().getFullYear()} Itminan. All rights reserved.
          </span>
        </div>

        <div className={styles.links}>
          <a href="#" className={styles.link}>Privacy Policy</a>
          <a href="#" className={styles.link}>Terms of Service</a>
          <a href="#" className={styles.link}>Support</a>
        </div>
      </div>
    </footer>
  );
}
