"use client";
import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const productsList = [
  { id: 1, name: "Nebula Polo Shirt", price: "850", image: "/poloshirt.png" },
  { id: 2, name: "Cosmic T-Shirt", price: "600", image: "/tshirt.png" },
  { id: 3, name: "Astronaut Polo", price: "800", image: "/polo.png" },
  { id: 4, name: "Eclipse Premium Polo", price: "900", image: "/polo2.png" },
  { id: 5, name: "Galaxy Hoodie", price: "1200", image: "/hoodie.png" },
];

export default function Shop() {
  const { data: session } = useSession(); 
  const router = useRouter(); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [trxId, setTrxId] = useState("");
  
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(""); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);

    if (!session) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userEmail: session?.user?.email || "Unknown User",
          name: session?.user?.name || "Explorer",
          phone, 
          address, 
          trxId,
          productName: selectedProduct,
          price: selectedPrice 
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        setPhone(""); setAddress(""); setTrxId("");
        setTimeout(() => { setIsModalOpen(false); setIsSubmitted(false); }, 3000);
      } else {
        alert("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center pt-32 px-4 text-center min-h-screen">
         <div className="backdrop-blur-md bg-white/5 p-6 md:p-10 rounded-3xl border border-white/10 max-w-5xl w-full shadow-2xl mt-10 mb-20">
             <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-400">Meteorite Shop</h2>
             <p className="text-sm md:text-base text-gray-300 mb-10">Grab your exclusive space merch and astronomy gear.</p>
             
             <div className="flex flex-wrap justify-center gap-6">
               {productsList.map((product) => (
                 <div key={product.id} className="bg-white/10 p-4 md:p-5 rounded-xl border border-white/10 w-64 transition-transform hover:scale-105 duration-300">
                    <div className="w-full h-48 bg-black/40 rounded-lg mb-4 overflow-hidden relative group">
                       <img 
                         src={product.image} 
                         alt={product.name}
                         className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                         onError={(e) => { e.currentTarget.style.display = 'none'; }}
                       />
                       <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-cyan-500/10 -z-10"></div>
                    </div>
                    <h4 className="font-semibold text-lg">{product.name}</h4>
                    <p className="text-cyan-400 mt-1 font-bold text-lg">৳ {product.price}</p>
                    
                    <button 
                      onClick={() => {
                        if (!session) {
                          router.push("/login"); 
                          return;
                        }
                        setSelectedProduct(product.name);
                        setSelectedPrice(product.price); 
                        setIsModalOpen(true);
                      }}
                      className="mt-5 w-full bg-purple-500 hover:bg-purple-600 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg"
                    >
                      Buy Now
                    </button>
                 </div>
               ))}
             </div>
         </div>

         {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
               <div className="bg-[#050810]/90 border border-purple-500/30 p-6 md:p-8 rounded-2xl w-full max-w-md shadow-[0_0_40px_rgba(168,85,247,0.2)] relative text-left">
                  <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white rounded-full w-8 h-8 flex items-center justify-center">✕</button>
                  <h3 className="text-2xl font-bold text-purple-400 mb-1">Checkout</h3>
                  <p className="text-gray-300 text-sm mb-6 flex items-center gap-2">
                    Ordering: <span className="text-cyan-400 font-semibold bg-cyan-400/10 px-2 py-1 rounded">{selectedProduct}</span>
                    <span className="text-purple-400 ml-2">(৳ {selectedPrice})</span>
                  </p>
                  
                  {isSubmitted ? (
                     <div className="text-center py-8">
                        <div className="text-6xl mb-4 animate-bounce">🚀</div>
                        <h4 className="text-xl font-bold text-green-400 mb-2">Order Placed!</h4>
                     </div>
                  ) : (
                     <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input type="text" value={session?.user?.name || ""} disabled className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-gray-400 cursor-not-allowed" />
                        <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none" placeholder="Phone Number" />
                        <textarea required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white h-20 resize-none focus:border-purple-500 focus:outline-none" placeholder="Delivery Address"></textarea>
                        
                        <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 p-4 rounded-lg border border-cyan-500/30">
                           <p className="text-xs text-cyan-300 mb-3">Please Send Money to bKash/Nagad: <strong className="text-white">01XXXXXXXXX</strong></p>
                           <input required type="text" value={trxId} onChange={(e) => setTrxId(e.target.value)} className="w-full bg-black/50 border border-cyan-500/50 rounded-lg px-4 py-2.5 text-white focus:border-cyan-400 focus:outline-none" placeholder="Transaction ID (TrxID)" />
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 py-3 rounded-lg font-bold text-white mt-2">
                           {isLoading ? "Processing..." : "Confirm Order"}
                        </button>
                     </form>
                  )}
               </div>
            </div>
         )}
    </main>
  );
}