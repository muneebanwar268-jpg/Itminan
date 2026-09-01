import type { Metadata } from "next";
import { CheckoutClient } from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout | ITMINAAN Heritage Handcrafted Handbags",
  description: "Complete your order with secure Cash on Delivery and complimentary delivery across Pakistan.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
