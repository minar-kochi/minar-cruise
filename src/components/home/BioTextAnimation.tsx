"use client";

import React from "react";
import { motion } from "framer-motion";

export default function BioTextAnimation() {
  return (
    <div className="border-l-4 border-l-red-500 pl-2">
      <motion.h1
        whileInView={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.2, delay: 0.2 }}
        className="text-xl font-semibold"
      >
        Best Cruise in the
      </motion.h1>
      <motion.p
        whileInView={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.2, delay: 0.2 }}
        className="text-6xl font-bold text-[#A3BCFF] max-xl:text-5xl max-sm:text-4xl"
      >
        <span className="bg-gradient-to-r from-[#fa8686] to-[#B60808] bg-clip-text  text-transparent">
          ARABIAN
        </span>{" "}
        SEA
      </motion.p>
    </div>
  );
}
