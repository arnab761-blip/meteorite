"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Gallery() {
  const { data: session } = useSession();
  const router = useRouter();

  const [photos, setPhotos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null); // ফুল স্ক্রিন ছবির জন্য

  const fetchPhotos = async () => {
    const res = await fetch('/api/gallery');
    const data = await res.json();
    if (data.photos) setPhotos(data.photos);
  };

  useEffect(() => { fetchPhotos(); }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return router.push("/login");
    setIsUploading(true);

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: session.user?.name,
          userEmail: session.user?.email,
          userImage: session.user?.image || "",
          title, description, image
        }),
      });
      if (res.ok) {
        setTitle(""); setDescription(""); setImage(""); setShowForm(false);
        fetchPhotos();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  // 🌟 ছবিতে ক্লিক করলে ভিউ কাউন্ট হবে 🌟
  const handleViewPhoto = async (photo: any) => {
    setSelectedPhoto(photo);
    try {
      await fetch('/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: photo._id }),
      });
      fetchPhotos(); // ভিউ আপডেট করার জন্য ডাটা রিফ্রেশ
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex flex-col items-center pt-32 px-4 min-h-screen">
      <div className="backdrop-blur-md bg-[#050810]/80 p-6 md:p-10 rounded-3xl border border-white/10 w-full max-w-7xl shadow-2xl mt-10 mb-20 relative">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 text-center md:text-left">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Astrophotography</h2>
            <p className="text-gray-400 text-sm mt-1">Share your cosmic captures with the universe.</p>
          </div>
          <button 
            onClick={() => session ? setShowForm(!showForm) : router.push("/login")}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)]"
          >
            {showForm ? "Cancel Upload" : "Upload Photo 🚀"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleUpload} className="bg-black/50 p-6 rounded-2xl border border-cyan-500/30 mb-10 max-w-2xl mx-auto shadow-lg flex flex-col gap-4 animate-fade-in">
            <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Photo Title (e.g. Orion Nebula)" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none" />
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Camera details, location, or description..." className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none h-24 resize-none"></textarea>
            <input required type="file" accept="image/*" onChange={handleImageChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/20 file:text-cyan-400 hover:file:bg-cyan-500/30 cursor-pointer" />
            {image && <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-lg border border-white/10" />}
            <button type="submit" disabled={isUploading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-3 rounded-lg font-bold text-white mt-2 transition-all">
              {isUploading ? "Uploading to Space..." : "Publish to Gallery"}
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo: any) => (
            <div 
              key={photo._id} 
              onClick={() => handleViewPhoto(photo)}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 aspect-[4/5] shadow-lg flex flex-col cursor-pointer transition-transform hover:-translate-y-2"
            >
              <img src={photo.image} alt={photo.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
              
              {/* 🌟 ছবির ওপরে ভিউ কাউন্টার 🌟 */}
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-cyan-400 flex items-center gap-1 border border-cyan-500/30">
                👁️ {photo.views || 0}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
                <h4 className="text-cyan-300 font-bold text-lg truncate">{photo.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-5 h-5 rounded-full bg-gray-700 overflow-hidden border border-white/20">
                    {photo.userImage ? <img src={photo.userImage} alt="User" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">{photo.userName.charAt(0)}</div>}
                  </div>
                  <p className="text-xs text-gray-300 truncate">{photo.userName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 🌟 ফুল স্ক্রিন পপআপ 🌟 */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fade-in">
            <div className="relative max-w-4xl w-full bg-[#050810] border border-cyan-500/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.2)] flex flex-col md:flex-row max-h-[90vh]">
              <button onClick={() => setSelectedPhoto(null)} className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors">✕</button>
              
              <div className="w-full md:w-2/3 bg-black flex items-center justify-center">
                <img src={selectedPhoto.image} alt={selectedPhoto.title} className="max-w-full max-h-[60vh] md:max-h-[90vh] object-contain" />
              </div>
              
              <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col justify-center overflow-y-auto bg-gradient-to-b from-[#050810] to-black">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                  <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden border-2 border-cyan-500/50">
                    {selectedPhoto.userImage ? <img src={selectedPhoto.userImage} alt="User" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-lg font-bold">{selectedPhoto.userName.charAt(0)}</div>}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{selectedPhoto.userName}</h3>
                    <p className="text-xs text-cyan-400 font-medium">Astrophotographer</p>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-cyan-300 mb-3">{selectedPhoto.title}</h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">{selectedPhoto.description}</p>
                
                <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/10">
                   <div className="flex items-center gap-2 text-cyan-400 font-bold bg-cyan-500/10 px-4 py-2 rounded-xl border border-cyan-500/20">
                     👁️ {selectedPhoto.views || 0} Views
                   </div>
                   <p className="text-xs text-gray-500">{new Date(selectedPhoto.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}