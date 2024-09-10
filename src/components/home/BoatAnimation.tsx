"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function BoatAnimation() {
  return (
    <div
   
      className=" rounded-2xl flex items-center justify-center "
    >
      <div className="overflow-hidden ">
        <motion.div
          whileInView={{ opacity: 1, y: 0, scale: 1.1 }}
          initial={{ opacity: 0, y: 200, scale: 0.8 }}
          transition={{ duration: 1 }}
        >
          <Image
            src={"/assets/minar.png"}
            alt="minar"
            width={500}
            height={500}
            className="min-w-[500px] max-sm:min-w-[300px] mt-10"
          />
          
        </motion.div>
      </div>
    </div>
  );
}
