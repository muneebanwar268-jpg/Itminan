"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./Philosophy.module.css";

const quote = "In the remembrance of God do hearts find rest.";

const Word = ({ children, progress, range }: { children: React.ReactNode; progress: any; range: [number, number] }) => {
  const opacity = useTransform(progress, range, [0.1, 1]);
  return (
    <motion.span style={{ opacity }} className={styles.word}>
      {children}
    </motion.span>
  );
};

export function Philosophy() {
  const containerRef = useRef<HTMLElement>(null);
  const words = quote.split(" ");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  return (
    <section
      id="philosophy"
      ref={containerRef}
      className={styles.section}
    >
      <div className={styles.stickyContainer}>
        <div className={styles.inner}>
          
          <motion.div
            style={{ 
              opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]),
              y: useTransform(scrollYProgress, [0, 0.1], [20, 0])
            }}
          >
            <span className={styles.badge}>
              The Philosophy
            </span>
          </motion.div>

          <div className={styles.quoteContainer}>
            {words.map((word, i) => {
              const start = 0.1 + (i * 0.05);
              const end = start + 0.1;
              const safeEnd = Math.min(end, 0.9);
              return (
                <Word key={i} progress={scrollYProgress} range={[start, safeEnd]}>
                  {word}
                </Word>
              );
            })}
          </div>

          <motion.div
            style={{ 
              opacity: useTransform(scrollYProgress, [0.7, 0.9], [0, 1]),
              y: useTransform(scrollYProgress, [0.7, 0.9], [20, 0])
            }}
            className={styles.bodyContainer}
          >
            Itminan stands for absolute tranquility. In a fast-paced world, our smart ring 
            acts as a physical anchor for your mind. A simple, elegant touch interface 
            designed to register every remembrance with silent haptic feedback, keeping you fully present.
          </motion.div>

        </div>
      </div>
    </section>
  );
}
