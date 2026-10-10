"use client";
import React, { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    if (session?.user?.email) {
      fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email })
      })
      .then(res => res.json())
      .then(data => {
        if (data.orders) setOrders(data.orders);
        if (data.photos) setPhotos(data.photos);
      });
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-cyan-400 font-bold text-xl transform-gpu">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="mr-3 text-3xl">
          🚀
        </motion.div>
        Loading Space Pod...
      </div>
    );
  }
  
  if (!session) { 
    router.push("/login"); 
    return null; 
  }

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } }
  };

  return (
    <main className="flex flex-col items-center pt-32 px-4 min-h-screen">
      {/* 🌟 ফিক্স: transform-gpu will-change-transform */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="backdrop-blur-md bg-[#050810]/80 p-6 md:p-10 rounded-3xl border border-white/10 max-w-5xl w-full shadow-2xl mt-10 mb-20 transform-gpu will-change-transform"
      >
        
        <div className="flex flex-col items-center gap-4 mb-10 border-b border-white/10 pb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-24 h-24 rounded-full bg-gray-700 overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.3)] transform-gpu"
          >
            {session.user?.image ? (
              <img src={session.user.image} alt="Profile" loading="lazy" decoding="async" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold">{session.user?.name?.charAt(0)}</div>
            )}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center transform-gpu"
          >
            <h3 className="text-2xl font-bold text-white">{session.user?.name}</h3>
            <p className="text-sm text-cyan-400 mt-1">{session.user?.email}</p>
          </motion.div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => signOut({ callbackUrl: '/' })} 
            className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/50 px-6 py-2 rounded-full text-sm font-bold mt-2 transform-gpu"
          >
            Sign Out
          </motion.button>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("orders")} 
            className={`px-6 py-2 rounded-full font-bold transition-all transform-gpu ${activeTab === "orders" ? "bg-cyan-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]" : "bg-white/5 text-gray-400 hover:text-white"}`}
          >
            My Orders
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("photos")} 
            className={`px-6 py-2 rounded-full font-bold transition-all transform-gpu ${activeTab === "photos" ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]" : "bg-white/5 text-gray-400 hover:text-white"}`}
          >
            My Uploads
          </motion.button>
        </div>

        <div className="min-h-[300px] transform-gpu">
          <AnimatePresence mode="wait">
            {activeTab === "orders" && (
              <motion.div 
                key="orders-tab"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4 transform-gpu will-change-transform"
              >
                {orders.length === 0 ? (
                  <p className="text-center text-gray-500 py-10">You haven't ordered anything yet.</p>
                ) : (
                  orders.map((order: any, index: number) => (
                    <motion.div 
                      key={order._id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-black/40 p-5 rounded-xl border border-cyan-500/20 flex flex-col md:flex-row justify-between gap-4 transform-gpu"
                    >
                      <div>
                        <h4 className="font-bold text-cyan-300">{order.productName}</h4>
                        <p className="text-xs text-gray-400 mt-1">TrxID: <span className="text-white">{order.trxId}</span></p>
                        <p className="text-xs text-gray-400 mt-1">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="font-bold text-green-400 bg-green-400/10 inline-block px-3 py-1 rounded-lg">Paid: ৳ {order.price}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === "photos" && (
              <motion.div 
                key="photos-tab"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 transform-gpu will-change-transform"
              >
                {photos.length === 0 ? (
                  <p className="text-center text-gray-500 py-10 col-span-full">You haven't uploaded any photos yet.</p>
                ) : (
                  photos.map((photo: any, index: number) => (
                    <motion.div 
                      key={photo._id} 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.03 }}
                      className="bg-black/40 rounded-xl overflow-hidden border border-purple-500/20 transition-transform transform-gpu"
                    >
                      <img src={photo.image} alt={photo.title} loading="lazy" decoding="async" className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <h4 className="font-bold text-purple-400">{photo.title}</h4>
                        <p className="text-xs text-gray-400 mt-2 line-clamp-2">{photo.description}</p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-md border border-cyan-500/20">
                            👁️ {photo.views || 0} Views
                          </span>
                          <p className="text-[10px] text-gray-500">{new Date(photo.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
    </main>
  );
}