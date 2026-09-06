"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Shop() {
  const { data: session } = useSession(); 
  const router = useRouter(); 

  // 🌟 অ্যাডমিন ইমেইল
  const adminEmail = "meteorite.official1@gmail.com";

  // 🌟 স্টেটগুলো 🌟
  const [productsList, setProductsList] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [trxId, setTrxId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(""); 
  
  // 🌟 পেমেন্ট মেথড স্টেট (ডিফল্ট বিকাশ) 🌟
  const [paymentMethod, setPaymentMethod] = useState("bkash");

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.products) setProductsList(data.products);
    } catch (error) {
      console.log("Error loading products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return alert("Please select a product image!");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "meteorite_shop"); 

      const cloudRes = await fetch(
        "https://api.cloudinary.com/v1_1/rgnyt2gl/image/upload", 
        { method: "POST", body: formData }
      );
      const cloudData = await cloudRes.json();
      const imageUrl = cloudData.secure_url;

      if (imageUrl) {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: newProductName, 
            price: newProductPrice, 
            image: imageUrl 
          }),
        });

        if (res.ok) {
          setNewProductName(""); setNewProductPrice(""); setImageFile(null);
          setIsAddModalOpen(false);
          fetchProducts(); 
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);

    if (!session) {
      router.push("/login");
      return;
    }

    // TrxID এর সাথে মেথড যুক্ত করে দেওয়া হলো যাতে অ্যাডমিন বুঝতে পারে
    const finalTrxId = `${paymentMethod.toUpperCase()} - ${trxId}`;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userEmail: session?.user?.email || "Unknown User",
          name: session?.user?.name || "Explorer",
          phone, address, 
          trxId: finalTrxId,
          productName: selectedProduct,
          price: selectedPrice 
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        setPhone(""); setAddress(""); setTrxId(""); setPaymentMethod("bkash");
        setTimeout(() => { setIsModalOpen(false); setIsSubmitted(false); }, 3000);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center pt-32 px-4 text-center min-h-screen">
         <div className="backdrop-blur-md bg-white/5 p-6 md:p-10 rounded-3xl border border-white/10 max-w-5xl w-full shadow-2xl mt-10 mb-20 relative">
             
             <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
               <div className="text-left">
                 <h2 className="text-3xl md:text-4xl font-bold mb-2 text-purple-400">Meteorite Shop</h2>
                 <p className="text-sm md:text-base text-gray-300">Grab your exclusive space merch and astronomy gear.</p>
               </div>
               
               {session?.user?.email === adminEmail && (
                 <button 
                   onClick={() => setIsAddModalOpen(true)}
                   className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                 >
                   + Add Product
                 </button>
               )}
             </div>
             
             <div className="flex flex-wrap justify-center gap-6">
               {productsList.length === 0 && <p className="text-gray-400">No products available yet. Add some!</p>}
               
               {productsList.map((product: any) => (
                 <div key={product._id} className="bg-white/10 p-4 md:p-5 rounded-xl border border-white/10 w-64 transition-transform hover:scale-105 duration-300 flex flex-col text-left">
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
                      className="mt-auto pt-5 w-full bg-purple-500 hover:bg-purple-600 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg text-center"
                    >
                      Buy Now
                    </button>
                 </div>
               ))}
             </div>
         </div>

         {isAddModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
               <div className="bg-[#050810]/90 border border-cyan-500/30 p-6 md:p-8 rounded-2xl w-full max-w-md shadow-[0_0_40px_rgba(34,211,238,0.2)] relative text-left">
                  <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white rounded-full w-8 h-8 flex items-center justify-center">✕</button>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-6">Add New Product</h3>
                  
                  <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
                     <input required type="text" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} placeholder="Product Name" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none" />
                     <input required type="number" value={newProductPrice} onChange={(e) => setNewProductPrice(e.target.value)} placeholder="Price" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 focus:outline-none" />
                     
                     <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                       <p className="text-xs text-gray-400 mb-2">Upload Product Image:</p>
                       <input required type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/20 file:text-cyan-400 hover:file:bg-cyan-500/30 cursor-pointer" />
                     </div>

                     <button type="submit" disabled={isUploading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-3 rounded-lg font-bold text-white mt-4">
                        {isUploading ? "Uploading..." : "Publish Product"}
                     </button>
                  </form>
               </div>
            </div>
         )}

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
                        <p className="text-xs text-gray-400 mt-2">
                          Note: Please check your Spam/Promotions folder if you don't see the confirmation email in your Inbox.
                        </p>
                     </div>
                  ) : (
                     <form onSubmit={handleOrderSubmit} className="flex flex-col gap-4">
                        <input type="text" value={session?.user?.name || ""} disabled className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-gray-400 cursor-not-allowed" />
                        <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none" placeholder="Phone Number" />
                        <textarea required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white h-20 resize-none focus:border-purple-500 focus:outline-none" placeholder="Delivery Address"></textarea>
                        
                        <div className="bg-[#0a0f1a] p-4 rounded-lg border border-gray-800">
                           <p className="text-xs text-gray-400 mb-3 text-center">Select Payment Method</p>
                           
                           {/* 🌟 বিকাশ ও রকেট বাটন 🌟 */}
                           <div className="flex gap-3 mb-4">
                              <button 
                                type="button" 
                                onClick={() => setPaymentMethod('bkash')} 
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all border ${paymentMethod === 'bkash' ? 'bg-[#E2136E]/20 text-[#E2136E] border-[#E2136E]' : 'bg-transparent text-gray-500 border-gray-700 hover:border-gray-500'}`}
                              >
                                bKash
                              </button>
                              <button 
                                type="button" 
                                onClick={() => setPaymentMethod('rocket')} 
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all border ${paymentMethod === 'rocket' ? 'bg-[#8C3494]/20 text-[#8C3494] border-[#8C3494]' : 'bg-transparent text-gray-500 border-gray-700 hover:border-gray-500'}`}
                              >
                                Rocket
                              </button>
                           </div>
                           
                           <p className="text-sm text-center mb-4">
                             Send Money to: <strong className={paymentMethod === 'bkash' ? "text-[#E2136E]" : "text-[#8C3494]"}>
                               {paymentMethod === 'bkash' ? '01780692994' : '017190223709'}
                             </strong>
                           </p>
                           
                           <input required type="text" value={trxId} onChange={(e) => setTrxId(e.target.value)} className="w-full bg-black/50 border border-cyan-500/30 rounded-lg px-4 py-2.5 text-white focus:border-cyan-400 focus:outline-none text-center" placeholder="Enter Transaction ID" />
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