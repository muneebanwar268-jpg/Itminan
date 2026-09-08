"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Banknote, 
  Lock, 
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { trackMetaEvent, generateEventId, getCookie } from "@/lib/pixel";
import styles from "./Checkout.module.css";

function formatPakistaniPhone(input: string): string {
  let cleaned = input.trim().replace(/[^\d+]/g, '');
  if (!cleaned) return '';
  if (cleaned.startsWith('+92')) {
    return cleaned;
  }
  if (cleaned.startsWith('0092')) {
    return `+92${cleaned.slice(4)}`;
  }
  if (cleaned.startsWith('92') && cleaned.length >= 11) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith('0')) {
    return `+92${cleaned.slice(1)}`;
  }
  if (cleaned.startsWith('3') && cleaned.length === 10) {
    return `+92${cleaned}`;
  }
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  return `+92${cleaned}`;
}

export function CheckoutClient() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<any | null>(null);

  // Form states
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "+92 ",
    address: "",
    apartment: "",
    city: "Karachi",
    province: "Sindh",
    postalCode: "",
    note: "",
  });

  useEffect(() => {
    setMounted(true);

    if (items.length > 0) {
      trackMetaEvent("InitiateCheckout", {
        content_type: "product",
        content_ids: items.map((i) => i.id),
        contents: items.map((i) => ({
          id: i.id,
          quantity: i.quantity,
          item_price: i.price,
          title: i.name,
        })),
        value: getTotalPrice(),
        currency: "PKR",
        num_items: items.reduce((acc, item) => acc + item.quantity, 0),
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setForm((prev) => ({
        ...prev,
        phone: value,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePhoneBlur = () => {
    if (form.phone.trim()) {
      setForm((prev) => ({
        ...prev,
        phone: formatPakistaniPhone(prev.phone),
      }));
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!form.firstName.trim() || !form.phone.trim() || !form.address.trim()) {
      setErrorMessage("Please fill in your name, phone number, and complete delivery address.");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Your cart is empty. Please select products to purchase.");
      return;
    }

    setSubmitting(true);

    // Generate shared event ID for 100% CAPI & Pixel deduplication
    const purchaseEventId = generateEventId("purchase");
    const fbp = getCookie("_fbp");
    const fbc = getCookie("_fbc");
    const currentUrl = typeof window !== "undefined" ? window.location.href : "https://itminaan.pk/checkout";

    try {
      const response = await fetch("/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            firstName: form.firstName,
            lastName: form.lastName || form.firstName,
            email: form.email,
            phone: form.phone,
          },
          shippingAddress: {
            address1: form.address,
            address2: form.apartment,
            city: form.city,
            province: form.province,
            zip: form.postalCode || "00000",
            country: "Pakistan",
            phone: form.phone,
          },
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            variantId: item.id,
          })),
          note: form.note,
          paymentMethod: "Cash On Delivery (COD)",
          eventId: purchaseEventId,
          fbp,
          fbc,
          eventSourceUrl: currentUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to place order on Shopify");
      }

      // Track browser Purchase event with identical event ID for perfect deduplication
      trackMetaEvent(
        "Purchase",
        {
          content_type: "product",
          content_ids: items.map((i) => i.id),
          contents: items.map((i) => ({
            id: i.id,
            quantity: i.quantity,
            item_price: i.price,
            title: i.name,
          })),
          value: data.order?.totalPrice ? Number(data.order.totalPrice) : getTotalPrice(),
          currency: "PKR",
          num_items: items.reduce((acc, item) => acc + item.quantity, 0),
          order_id: data.order?.orderNumber || data.order?.orderId,
        },
        {
          email: form.email,
          phone: form.phone,
          firstName: form.firstName,
          lastName: form.lastName || form.firstName,
          city: form.city,
          province: form.province,
          zip: form.postalCode,
          country: "PK",
        },
        purchaseEventId
      );

      // Order placed successfully
      setOrderResult(data.order);
      clearCart();
    } catch (err: any) {
      console.error("Order creation error:", err);
      setErrorMessage(err.message || "Failed to place order. Please check your details and retry.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  // ── Success Confirmation Screen ──
  if (orderResult) {
    return (
      <div className={styles.checkoutPage}>
        <div className={styles.container}>
          <motion.div 
            className={styles.successCard}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.successIconCircle}>
              <CheckCircle2 size={36} strokeWidth={2} />
            </div>

            <h1 className={styles.successTitle}>Order Confirmed</h1>
            <p className={styles.successSub}>
              Thank you, {orderResult.customerName || form.firstName}. Your order has been placed directly with Itminaan.
            </p>

            <div className={styles.orderDetailsBox}>
              <div className={styles.orderNumberRow}>
                <span className={styles.orderNumberLabel}>Order Reference</span>
                <span className={styles.orderNumberValue}>{orderResult.orderNumber}</span>
              </div>

              <div className={styles.costRow} style={{ marginBottom: "10px" }}>
                <span>Payment Method</span>
                <span style={{ color: "var(--ink, #20201D)", fontWeight: 600 }}>Cash on Delivery (COD)</span>
              </div>

              <div className={styles.costRow} style={{ marginBottom: "10px" }}>
                <span>Delivery Address</span>
                <span style={{ color: "var(--ink, #20201D)", maxWidth: "60%", textAlign: "right" }}>
                  {form.address}, {form.city}
                </span>
              </div>

              <div className={styles.costRow} style={{ marginBottom: "10px" }}>
                <span>Estimated Delivery</span>
                <span style={{ color: "#15803d", fontWeight: 700 }}>3–5 Working Days</span>
              </div>

              <div className={styles.costRow} style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(32,32,29,0.08)" }}>
                <span style={{ fontSize: "1rem", fontWeight: 600, color: "var(--ink, #20201D)" }}>Total Due on Delivery</span>
                <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--ink, #20201D)" }}>
                  Rs. {Number(orderResult.totalPrice).toLocaleString()}
                </span>
              </div>
            </div>

            <Link href="/" className={styles.confirmationBtn}>
              Return to Store <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Checkout Form & Summary ──
  return (
    <div className={styles.checkoutPage}>
      <div className={styles.container}>
        
        {/* Top Bar */}
        <div className={styles.topBar}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} /> Return to Store
          </Link>
          <div className={styles.brandLogo}>ITMINAAN</div>
          <div className={styles.secureBadge}>
            <Lock size={12} /> Secure Checkout
          </div>
        </div>

        {errorMessage && (
          <div className={styles.errorBanner}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className={styles.grid}>
          
          {/* Left: Customer Information & Delivery Address */}
          <div className={styles.formSection}>
            
            <h2 className={styles.sectionTitle}>1. Contact Information</h2>
            <div className={styles.formGroup}>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="e.g. Fatima"
                    value={form.firstName}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="e.g. Khan"
                    value={form.lastName}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Phone Number (For Delivery) *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+92 300 1234567"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handlePhoneBlur}
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email Address (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="fatima@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            <h2 className={styles.sectionTitle} style={{ marginTop: "36px" }}>2. Delivery Address</h2>
            <div className={styles.formGroup}>
              <div className={styles.field}>
                <label className={styles.label}>Street Address &amp; House/Building *</label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="House #, Street name, Area"
                  value={form.address}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Apartment, Suite, Unit (Optional)</label>
                <input
                  type="text"
                  name="apartment"
                  placeholder="Apartment or Floor #"
                  value={form.apartment}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>City *</label>
                  <select
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="Karachi">Karachi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Quetta">Quetta</option>
                    <option value="Sialkot">Sialkot</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Gujranwala">Gujranwala</option>
                    <option value="Other">Other City</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Province</label>
                  <select
                    name="province"
                    value={form.province}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="Sindh">Sindh</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Islamabad Capital Territory">Islamabad Capital Territory</option>
                    <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                    <option value="Balochistan">Balochistan</option>
                    <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                    <option value="Azad Kashmir">Azad Kashmir</option>
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Special Delivery Instructions (Optional)</label>
                <textarea
                  name="note"
                  placeholder="Nearby landmark, gate code, or delivery instructions..."
                  value={form.note}
                  onChange={handleChange}
                  className={styles.textarea}
                />
              </div>
            </div>

            <h2 className={styles.sectionTitle} style={{ marginTop: "36px" }}>3. Payment Method</h2>
            <div className={styles.paymentCard}>
              <div className={styles.paymentInfo}>
                <div className={styles.radioSelected} />
                <div>
                  <div className={styles.paymentTitle}>Cash on Delivery (COD)</div>
                  <div className={styles.paymentSubtitle}>Pay in cash when your parcel is delivered to your doorstep.</div>
                </div>
              </div>
              <span className={styles.tagPill}>Verified</span>
            </div>

          </div>

          {/* Right: Order Summary */}
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            {items.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 0", color: "#a3a29e" }}>
                <ShoppingBag size={40} style={{ opacity: 0.5, marginBottom: "12px" }} />
                <p>Your cart is empty.</p>
                <Link href="/product" style={{ color: "#c5a880", marginTop: "8px", display: "inline-block" }}>
                  Browse Handcrafted Collection
                </Link>
              </div>
            ) : (
              <>
                <div className={styles.itemsList}>
                  {items.map((item) => (
                    <div key={item.id} className={styles.itemRow}>
                      <div className={styles.itemImageWrapper}>
                        <img src={item.image} alt={item.name} className={styles.itemImage} />
                        <span className={styles.itemBadge}>{item.quantity}</span>
                      </div>
                      <div className={styles.itemDetails}>
                        <div className={styles.itemName}>{item.name}</div>
                        <div className={styles.itemSub}>Handcrafted Heritage Edition</div>
                      </div>
                      <div className={styles.itemPrice}>
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.costBreakdown}>
                  <div className={styles.costRow}>
                    <span>Subtotal</span>
                    <span>Rs. {getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className={styles.costRow}>
                    <span>Delivery Charges</span>
                    <span className={styles.freeShipping}>FREE (Nationwide)</span>
                  </div>
                </div>

                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Total Due</span>
                  <span className={styles.totalAmount}>Rs. {getTotalPrice().toLocaleString()}</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting || items.length === 0}
                  className={styles.submitBtn}
                >
                  {submitting ? "Placing Order..." : "Confirm & Place Order (COD)"}
                </button>

                <div className={styles.guaranteeRow}>
                  <Truck size={14} /> Free 3–5 Day Insured Delivery across Pakistan
                </div>
                <div className={styles.guaranteeRow}>
                  <ShieldCheck size={14} /> 100% Quality Inspected before dispatch
                </div>
              </>
            )}

          </div>

        </form>
      </div>
    </div>
  );
}
