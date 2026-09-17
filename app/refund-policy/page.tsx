import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Truck,
  CreditCard,
  Mail,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { Footer } from "@/components/sections/Footer";
import styles from "./refund.module.css";

export const metadata: Metadata = {
  title: "Return & Refund Policy | ITMINAAN Handcrafted Handbags",
  description:
    "Learn about ITMINAAN's Return and Refund Policy. Quality guaranteed on all handcrafted bags, with transparent return, exchange, and refund guidelines.",
  openGraph: {
    title: "Return & Refund Policy | ITMINAAN",
    description:
      "Information on returns, exchanges, refunds, and return shipping for ITMINAAN products.",
    type: "website",
  },
};

const WHATSAPP_URL =
  "https://wa.me/923374292166?text=" +
  encodeURIComponent("Hello ITMINAAN! I have a question regarding a return or refund.");

export default function RefundPolicyPage() {
  const eligibilityCriteria = [
    "Product arrives damaged",
    "Defective or faulty item",
    "Wrong product delivered due to an error on our part",
    "Product must be unused and in original condition",
  ];

  const paymentMethods = [
    "JazzCash",
    "Easypaisa",
    "Mutually Agreed Method",
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
                Customer Care &amp; Assurance
              </span>
              <span className={styles.datePill}>Last Updated: September 2026</span>
            </div>
            <h1 className={styles.title}>Return &amp; Refund Policy</h1>
            <p className={styles.intro}>
              At ITMINAAN, we take immense pride in the craftsmanship of our handcrafted handbags.
              We thoroughly inspect each piece before it leaves our workshop to ensure you receive
              flawless quality.
            </p>
          </header>

          {/* Policy Sections */}
          <div className={styles.sectionsList}>
            {/* 1. Returns */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrap}>
                  <PackageCheck size={20} strokeWidth={1.75} />
                </div>
                <h2 className={styles.sectionTitle}>Returns</h2>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.paragraph}>
                  At ITMINAAN, we carefully check our products before dispatch. Returns are accepted
                  in cases where the product arrives damaged, defective, or the wrong product is
                  delivered due to an error on our part.
                </p>
                <p className={styles.paragraph}>
                  To be eligible for a return, the product must be unused and in the same condition
                  in which it was received.
                </p>
                <div className={styles.eligibilityGrid}>
                  {eligibilityCriteria.map((item) => (
                    <div key={item} className={styles.eligibilityItem}>
                      <CheckCircle2 size={16} strokeWidth={2} className={styles.eligibilityCheck} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 2. Return Process */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrap}>
                  <RotateCcw size={20} strokeWidth={1.75} />
                </div>
                <h2 className={styles.sectionTitle}>Return Process</h2>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.paragraph}>
                  To request a return, please contact us at:{" "}
                  <strong>itminaanonline@gmail.com</strong>
                </p>
                <p className={styles.paragraph}>
                  Once we receive your request, our team will review the issue and, depending on the
                  circumstances, guide you through the appropriate return, exchange, or refund
                  process.
                </p>

                <div className={styles.stepsContainer}>
                  <div className={styles.stepRow}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                      <div className={styles.stepTitle}>Contact Customer Support</div>
                      <div>
                        Email us at{" "}
                        <a
                          href="mailto:itminaanonline@gmail.com"
                          style={{ color: "var(--ink)", fontWeight: 600, textDecoration: "underline" }}
                        >
                          itminaanonline@gmail.com
                        </a>{" "}
                        with your order number, a brief explanation, and clear photos of the issue.
                      </div>
                    </div>
                  </div>

                  <div className={styles.stepRow}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                      <div className={styles.stepTitle}>Team Assessment</div>
                      <div>
                        Our team will swiftly inspect your request to evaluate the circumstance and
                        confirm return eligibility.
                      </div>
                    </div>
                  </div>

                  <div className={styles.stepRow}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                      <div className={styles.stepTitle}>Resolution (Exchange or Refund)</div>
                      <div>
                        We will guide you step-by-step through parcel collection/return, followed by
                        your replacement or direct refund.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Return Shipping */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrap}>
                  <Truck size={20} strokeWidth={1.75} />
                </div>
                <h2 className={styles.sectionTitle}>Return Shipping</h2>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.shippingSplit}>
                  <div className={styles.shippingCardSuccess}>
                    <span className={styles.shippingTag} style={{ color: "#166534" }}>
                      Covered by ITMINAAN
                    </span>
                    <p className={styles.shippingText}>
                      If the issue occurred due to an error on our part (damaged item, manufacturing defect, or incorrect parcel), <strong>ITMINAAN will bear the full return shipping cost</strong>.
                    </p>
                  </div>

                  <div className={styles.shippingCardNotice}>
                    <span className={styles.shippingTag} style={{ color: "#854D0E" }}>
                      Customer Responsibility
                    </span>
                    <p className={styles.shippingText}>
                      If the issue is not due to an error on our part, the return may not be accepted, and any applicable return shipping cost will be the customer&apos;s responsibility.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Refunds & Exchanges */}
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrap}>
                  <CreditCard size={20} strokeWidth={1.75} />
                </div>
                <h2 className={styles.sectionTitle}>Refunds &amp; Exchanges</h2>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.paragraph}>
                  Depending on the approved request, customers may choose between a refund or
                  exchange, subject to availability and approval.
                </p>
                <p className={styles.paragraph}>
                  Refunds can be processed through a suitable payment method requested by the
                  customer, such as JazzCash, Easypaisa, or another mutually agreed method.
                </p>

                <div className={styles.paymentTags}>
                  {paymentMethods.map((method) => (
                    <div key={method} className={styles.paymentTag}>
                      <span className={styles.paymentDot} />
                      <span>{method}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 5. Contact Us */}
            <section className={styles.contactCard}>
              <div className={styles.contactHeader}>
                <div className={styles.contactIconWrap}>
                  <Mail size={22} strokeWidth={1.75} />
                </div>
                <h2 className={styles.contactTitle}>Return &amp; Refund Inquiries</h2>
              </div>
              <p className={styles.contactDesc}>
                For any return, refund, or exchange inquiries, our support team is here to assist you promptly:
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
