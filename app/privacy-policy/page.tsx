import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  FileSpreadsheet,
  CheckCircle2,
  Share2,
  Activity,
  Lock,
  Mail,
  MessageCircle,
} from "lucide-react";
import { Footer } from "@/components/sections/Footer";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | ITMINAAN Handcrafted Handbags",
  description:
    "Read ITMINAAN's Privacy Policy to learn how we collect, use, share, and protect your personal data when ordering handcrafted bags.",
  openGraph: {
    title: "Privacy Policy | ITMINAAN",
    description:
      "Information on how ITMINAAN collects, uses, and protects your personal information.",
    type: "website",
  },
};

const WHATSAPP_URL =
  "https://wa.me/923374292166?text=" +
  encodeURIComponent("Hello ITMINAAN! I have a question regarding your privacy policy.");

export default function PrivacyPolicyPage() {
  const collectedDataItems = [
    "Name",
    "Phone number",
    "Email address",
    "Delivery address",
    "Order and transaction details",
  ];

  const usageItems = [
    "Processing and fulfilling orders",
    "Arranging delivery",
    "Customer support and communication",
    "Other necessary professional business tasks",
    "Website analytics and performance",
    "Marketing and promotional activities, where applicable",
  ];

  return (
    <>
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Breadcrumb Navigation */}
          <div className={styles.topNav}>
            <Link href="/" className={styles.backLink}>
              <ArrowLeft size={14} strokeWidth={2} />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Page Header */}
          <header className={styles.header}>
            <div className={styles.badgeWrap}>
              <span className={styles.categoryPill}>
                <ShieldCheck size={13} strokeWidth={2} />
                Trust &amp; Transparency
              </span>
              <span className={styles.datePill}>Last Updated: September 2026</span>
            </div>
            <h1 className={styles.title}>Privacy Policy</h1>
            <p className={styles.intro}>
              At ITMINAAN, we are committed to respecting your privacy and protecting any personal
              information you share with us. This policy clearly outlines the data we collect, why we
              collect it, and how it is responsibly handled.
            </p>
          </header>

          {/* Policy Sections */}
          <div className={styles.sectionsList}>
            {/* 1. Information We Collect */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrap}>
                  <FileSpreadsheet size={20} strokeWidth={1.75} />
                </div>
                <h2 className={styles.sectionTitle}>Information We Collect</h2>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.leadText}>
                  When you place an order or interact with our website, we may collect information
                  such as:
                </p>
                <div className={styles.infoGrid}>
                  {collectedDataItems.map((item) => (
                    <div key={item} className={styles.infoItem}>
                      <span className={styles.infoDot} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 2. How We Use Your Information */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrap}>
                  <CheckCircle2 size={20} strokeWidth={1.75} />
                </div>
                <h2 className={styles.sectionTitle}>How We Use Your Information</h2>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.leadText}>We may use your information for:</p>
                <ul className={styles.bulletList}>
                  {usageItems.map((item) => (
                    <li key={item} className={styles.bulletItem}>
                      <CheckCircle2 size={16} strokeWidth={2} className={styles.bulletIcon} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 3. Sharing Your Information */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrap}>
                  <Share2 size={20} strokeWidth={1.75} />
                </div>
                <h2 className={styles.sectionTitle}>Sharing Your Information</h2>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.leadText}>
                  We may share necessary information with trusted third parties when required for
                  professional business work, such as courier companies, payment/service providers,
                  analytics tools, or marketing service providers.
                </p>
                <div className={styles.highlightBox}>
                  Any personal information shared with trusted third parties will be handled
                  responsibly and used only for professional business purposes.
                </div>
              </div>
            </section>

            {/* 4. Analytics & Tracking */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrap}>
                  <Activity size={20} strokeWidth={1.75} />
                </div>
                <h2 className={styles.sectionTitle}>Analytics &amp; Tracking</h2>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.leadText}>
                  Our website may use tools such as Meta Pixel and other analytics technologies to
                  understand website activity, improve our services, measure advertising performance,
                  and support marketing activities.
                </p>
              </div>
            </section>

            {/* 5. Data Protection */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrap}>
                  <Lock size={20} strokeWidth={1.75} />
                </div>
                <h2 className={styles.sectionTitle}>Data Protection</h2>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.leadText}>
                  We take reasonable measures to protect your personal information from unauthorized
                  access, misuse, or disclosure.
                </p>
              </div>
            </section>

            {/* 6. Contact Us */}
            <section className={styles.contactCard}>
              <div className={styles.contactHeader}>
                <div className={styles.contactIconWrap}>
                  <Mail size={22} strokeWidth={1.75} />
                </div>
                <h2 className={styles.contactTitle}>Contact Us</h2>
              </div>
              <p className={styles.contactDesc}>
                For any privacy-related questions or concerns, please reach out to us directly:
              </p>
              <div className={styles.contactActions}>
                <a
                  href="mailto:itminaanonline@gmail.com"
                  className={styles.emailButton}
                >
                  <Mail size={16} strokeWidth={2} />
                  <span>itminaanonline@gmail.com</span>
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappButton}
                >
                  <MessageCircle size={16} strokeWidth={2} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
