"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

export default function FeaturedPhoto() {
  const { data: session } = useSession();
  const adminEmail = "geminiaipro42@gmail.com";

  const [featuredData, setFeaturedData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [photographerName, setPhotographerName] = useState("");
  const [photographerImage, setPhotographerImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchFeaturedPhoto = async () => {
    try {
      const res = await fetch('/api/featured');
      const data = await res.json();
      if (data.photo) setFeaturedData(data.photo);
    } catch (error) {
      console.log("Error fetching photo", error);
    }
  };

  useEffect(() => {
    fetchFeaturedPhoto();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return alert("Please select a featured image!");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "meteorite_shop"); 

      const cloudRes = await fetch("https://api.cloudinary.com/v1_1/rgnyt2gl/image/upload", { 
        method: "POST", body: formData 
      });
      const cloudData = await cloudRes.json();
      const imageUrl = cloudData.secure_url;

      if (imageUrl) {
        const res = await fetch('/api/featured', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            image: imageUrl,
            photographerName,
            photographerImage: photographerImage || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png" 
          }),
        });

        if (res.ok) {
          setIsModalOpen(false);
          setImageFile(null);
          setPhotographerName("");
          setPhotographerImage("");
          fetchFeaturedPhoto(); 
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!featuredData && session?.user?.email !== adminEmail) return null;

  return (
    <>
      <section className="w-full max-w-6xl mx-auto mt-24 px-4 animate-fade-in relative z-20">
        {session?.user?.email === adminEmail && (
          <div className="absolute -top-12 right-4 z-50">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all flex items-center gap-2"
            >
              ✏️ {featuredData ? "Update Featured Photo" : "Add Featured Photo"}
            </button>
          </div>
        )}

        {featuredData && (
          <div className="relative rounded-3xl overflow-hidden backdrop-blur-xl bg-[#0a0f1a]/60 border border-white/10 p-6 md:p-10 shadow-[0_0_40px_rgba(34,211,238,0.05)]">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-cyan-600/20 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                <div className="w-full md:w-1/2 relative group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl transform rotate-2 group-hover:rotate-3 transition-transform duration-500 opacity-40 blur-lg"></div>
                  <img 
                    src={featuredData.image} 
                    alt="Featured Astrophotography" 
                    className="relative z-10 w-full h-[300px] md:h-[400px] object-cover rounded-2xl border border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,1)]"></span>
                    <span className="text-xs font-bold text-cyan-300 tracking-wider uppercase">Photo of the Week</span>
                  </div>
                </div>

                <div className="w-full md:w-1/2 text-left">
                  <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mb-4">
                    Cosmic Masterpiece
                  </h2>
                  <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
                    Explore the depths of the universe through the lens of our community. This week's featured capture reveals the stunning details of deep space, bringing the cosmos directly to your screen.
                  </p>
                  
                  <div className="flex items-center gap-4 mb-8 bg-white/5 w-max pr-6 p-2 rounded-full border border-white/5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 p-0.5 shadow-lg">
                        <img 
                          src={featuredData.photographerImage} 
                          alt="Photographer" 
                          className="w-full h-full rounded-full object-cover bg-black" 
                        />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">Captured by</p>
                      <p className="text-base font-bold text-white">{featuredData.photographerName}</p>
                    </div>
                  </div>

                  <a 
                    href="/gallery"
                    className="inline-block px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 border border-white/10 text-white font-semibold transition-all duration-300 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] hover:border-white/20"
                  >
                    Explore Cosmic Gallery 🚀
                  </a>
                </div>
            </div>
          </div>
        )}
      </section>

      {/* Admin Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-[#050810]/90 border border-purple-500/30 p-6 md:p-8 rounded-2xl w-full max-w-md shadow-[0_0_40px_rgba(168,85,247,0.2)] relative text-left">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white rounded-full w-8 h-8 flex items-center justify-center">✕</button>
              <h3 className="text-2xl font-bold text-purple-400 mb-6">Update Featured Photo</h3>
              
              <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-2">Upload Cosmic Photo:</p>
                    <input required type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-500/20 file:text-purple-400 cursor-pointer" />
                  </div>
                  
                  <input required type="text" value={photographerName} onChange={(e) => setPhotographerName(e.target.value)} placeholder="Photographer Name (e.g. @Tahmidul_Arnab)" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none" />
                  <input type="url" value={photographerImage} onChange={(e) => setPhotographerImage(e.target.value)} placeholder="Photographer Profile Image URL (Optional)" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none" />

                  <button type="submit" disabled={isUploading} className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 py-3 rounded-lg font-bold text-white mt-4 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                    {isUploading ? "Uploading..." : "Save Featured Photo"}
                  </button>
              </form>
            </div>
        </div>
      )}
    </>
  );
}