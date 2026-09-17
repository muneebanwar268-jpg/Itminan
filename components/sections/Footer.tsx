"use client";

import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  );
}

const WHATSAPP_URL =
  "https://wa.me/923374292166?text=" +
  encodeURIComponent("Hello ITMINAAN! I'm interested in your handcrafted handbags and would like to know more.");

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        {/* Left — Brand */}
        <div className={styles.brand}>
          <span className={styles.logo}>ITMINAAN</span>
          <p className={styles.tagline}>
            Made to add a little more beauty to every moment.
          </p>
          <div className={styles.socials}>
            <a href="https://www.instagram.com/itminaanonline" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="https://www.facebook.com/people/Itminaanonline/61593809892499/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="WhatsApp">
              <WhatsAppIcon />
            </a>
          </div>
        </div>

        {/* Right — Contact */}
        <div className={styles.contact}>
          <h3 className={styles.contactTitle}>Contact</h3>
          <div className={styles.contactLinks}>
            <a href="mailto:itminaanonline@gmail.com" className={styles.contactLink}>
              itminaanonline@gmail.com
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
              WhatsApp
            </a>
            <a href="https://www.instagram.com/itminaanonline" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
              Instagram
            </a>
            <a href="https://www.facebook.com/people/Itminaanonline/61593809892499" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
              Facebook
            </a>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <span className={styles.copy}>
            © {new Date().getFullYear()} ITMINAAN. All rights reserved.
          </span>
          <div className={styles.legal}>
            <Link href="/privacy-policy" className={styles.legalLink}>Privacy Policy</Link>
            <Link href="/refund-policy" className={styles.legalLink}>Return &amp; Refund Policy</Link>
            <a href="#" className={styles.legalLink}>Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
