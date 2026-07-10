"use client";

import React from "react";
import styles from "./page.module.css";
import { Hero } from "@/components/sections/Hero";
import { Philosophy } from "@/components/sections/Philosophy";
import { Features } from "@/components/sections/Features";
import { Specs } from "@/components/sections/Specs";
import { Purchase } from "@/components/sections/Purchase";

export default function Home() {
  return (
    <main className={styles.main}>
      <Hero />
      <Philosophy />
      <Features />
      <Specs />
      <Purchase />
    </main>
  );
}
