"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion"; // 🌟 Variants ইমপোর্ট করা হলো

export default function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 🌟 TypeScript এরর ফিক্স করার জন্য Variants টাইপ অ্যাড করা হলো 🌟
  const menuVariants: Variants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.3, 
        ease: "easeOut",
        staggerChildren: 0.1
      } 
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.95, 
      transition: { duration: 0.2, ease: "easeIn" } 
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <nav className="fixed top-0 w-full z-50 p-3 md:p-4">
      <div className="max-w-6xl mx-auto relative backdrop-blur-xl bg-black/60 border border-white/20 rounded-2xl p-4 shadow-lg">
        
        <div className="flex justify-between items-center w-full">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 group">
            <img src="/meteoritelogo.jpg" alt="Meteorite Logo" className="w-9 h-9 rounded-full border-[1.5px] border-cyan-500/50 shadow-[0_0_12px_rgba(34,211,238,0.4)] object-cover group-hover:scale-105 transition-transform" />
            <span className="text-xl md:text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              METEORITE
            </span>
          </Link>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white text-xl w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 cursor-pointer active:bg-white/10 select-none transition-colors"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.span 
                  key="close" 
                  initial={{ rotate: -90, opacity: 0 }} 
                  animate={{ rotate: 0, opacity: 1 }} 
                  exit={{ rotate: 90, opacity: 0 }} 
                  transition={{ duration: 0.2 }}
                >
                  ✕
                </motion.span>
              ) : (
                <motion.span 
                  key="menu" 
                  initial={{ rotate: 90, opacity: 0 }} 
                  animate={{ rotate: 0, opacity: 1 }} 
                  exit={{ rotate: -90, opacity: 0 }} 
                  transition={{ duration: 0.2 }}
                >
                  ☰
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <div className="hidden md:flex gap-5 items-center text-sm font-medium text-gray-200">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <Link href="/qa" className="hover:text-cyan-400 transition-colors">Q&A Community</Link>
            <Link href="/shop" className="hover:text-cyan-400 transition-colors">Meteorite Shop</Link>
            <Link href="/gallery" className="hover:text-cyan-400 transition-colors">Cosmic Gallery</Link>
            
            {session?.user?.email === "geminiaipro42@gmail.com" && (
              <Link href="/admin" className="text-purple-400 font-bold hover:text-purple-300 transition-colors tracking-wide">
                Admin Panel
              </Link>
            )}
            
            {session ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/profile" className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-full font-semibold transition-colors">
                  Profile
                </Link>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/login" className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-full font-semibold transition-colors">
                  Sign In
                </Link>
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="md:hidden absolute top-[115%] left-0 w-full flex flex-col gap-2 p-5 bg-[#050810]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-center text-sm font-medium text-gray-200 origin-top"
              >
                <motion.div variants={itemVariants}>
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-cyan-400 bg-white/5 rounded-lg transition-colors">Home</Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link href="/qa" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-cyan-400 bg-white/5 rounded-lg transition-colors">Q&A Community</Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-cyan-400 bg-white/5 rounded-lg transition-colors">Meteorite Shop</Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link href="/gallery" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-cyan-400 bg-white/5 rounded-lg transition-colors">Cosmic Gallery</Link>
                </motion.div>
                
                {session?.user?.email === "geminiaipro42@gmail.com" && (
                  <motion.div variants={itemVariants}>
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-purple-400 font-bold bg-purple-500/10 border border-purple-500/20 rounded-lg transition-colors">
                      Admin Panel
                    </Link>
                  </motion.div>
                )}

                <motion.div variants={itemVariants}>
                  {session ? (
                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block bg-purple-500 text-white py-3 rounded-xl font-bold mt-2 shadow-lg hover:bg-purple-600 transition-colors">
                      Profile
                    </Link>
                  ) : (
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block bg-cyan-500 text-white py-3 rounded-xl font-bold mt-2 shadow-lg hover:bg-cyan-600 transition-colors">
                      Sign In
                    </Link>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </nav>
  );
}