"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  // 🌟 ডাটাবেস থেকে অর্ডারগুলো ফেচ করা 🌟
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email === "geminiaipro42@gmail.com") {
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
          if (data.orders) setOrders(data.orders);
        });
    }
  }, [status, session]);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-purple-400 font-bold text-xl">Verifying Security Clearance... 🚀</div>;
  }

  // 🌟 তুই ছাড়া অন্য কেউ ঢুকলে তাকে বের করে দেবে 🌟
  if (!session || session.user?.email !== "geminiaipro42@gmail.com") {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 text-center">
        <div className="bg-red-500/10 border border-red-500/50 p-8 md:p-12 rounded-3xl max-w-md w-full shadow-[0_0_40px_rgba(239,68,68,0.2)]">
          <div className="text-6xl mb-4 animate-bounce">⛔</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Access Denied!</h2>
          <p className="text-gray-300 text-sm mb-8">Only the Supreme Commander can access this sector.</p>
          <button onClick={() => router.push('/')} className="bg-red-500 hover:bg-red-600 text-white px-8 py-2.5 rounded-full font-bold transition-all shadow-lg">
            Return to Base
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center pt-32 px-4 min-h-screen">
      <div className="backdrop-blur-md bg-[#050810]/80 p-6 md:p-10 rounded-3xl border border-purple-500/30 w-full max-w-7xl shadow-[0_0_30px_rgba(168,85,247,0.15)] mt-10 mb-20">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-white/10 pb-6 gap-4 text-center md:text-left">
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Admin Control Center
            </h2>
            <p className="text-gray-400 text-sm mt-1">Welcome back, Commander Arnab.</p>
          </div>
          <div className="bg-purple-500/20 border border-purple-500/50 px-6 py-2.5 rounded-xl text-purple-300 font-bold shadow-lg">
            Total Orders: {orders.length}
          </div>
        </div>

        {/* 🌟 অর্ডারের টেবিল 🌟 */}
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-white/5 text-cyan-400 text-sm uppercase tracking-wider">
              <tr>
                <th className="p-4 font-semibold">Customer Info</th>
                <th className="p-4 font-semibold">Product & Price</th>
                <th className="p-4 font-semibold">Delivery Address</th>
                <th className="p-4 font-semibold">Payment (TrxID)</th>
                <th className="p-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-300 divide-y divide-white/5">
              {orders.map((order: any) => (
                <tr key={order._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-white text-base">{order.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{order.userEmail}</p>
                    <p className="text-xs text-purple-400 font-medium mt-0.5">{order.phone}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-cyan-300 bg-cyan-400/10 inline-block px-2 py-1 rounded text-xs mb-1">{order.productName}</p>
                    <p className="text-green-400 font-bold">৳ {order.price}</p>
                  </td>
                  <td className="p-4 max-w-[250px]">
                    <p className="line-clamp-2 text-xs leading-relaxed">{order.address}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-mono text-purple-300 bg-purple-500/10 inline-block px-2 py-1 rounded text-xs border border-purple-500/20">
                      {order.trxId}
                    </p>
                  </td>
                  <td className="p-4 text-xs text-gray-400 font-medium">
                    {new Date(order.createdAt).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="text-center py-16 text-gray-500 font-medium">
              No orders received yet. Stay tuned! 🛰️
            </div>
          )}
        </div>

      </div>
    </main>
  );
}