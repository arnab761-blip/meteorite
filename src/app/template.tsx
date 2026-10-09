"use client";
import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // পেজ আসার আগে একটু নিচে এবং অদৃশ্য থাকবে
      animate={{ opacity: 1, y: 0 }}  // স্মুথলি উপরে উঠে আসবে এবং দৃশ্যমান হবে
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20, 
        duration: 0.5 
      }} // 60fps স্প্রিং ট্রানজিশন
    >
      {children}
    </motion.div>
  );
}