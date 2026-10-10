"use client"; 
import Link from "next/link";
import FeaturedPhoto from "@/components/FeaturedPhoto"; 
import { motion, Variants } from "framer-motion"; 
import { useEffect, useState } from "react";

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);

  useEffect(() => {
    async function getSpaceNews() {
      try {
        const randomOffset = Math.floor(Math.random() * 100);
        const res = await fetch(`https://api.spaceflightnewsapi.net/v4/articles/?limit=6&offset=${randomOffset}`, { 
          cache: 'no-store' 
        });
        if (!res.ok) return [];
        const data = await res.json();
        setNews(data.results);
      } catch (error) {
        console.log("Error fetching news:", error);
      } finally {
        setIsLoadingNews(false);
      }
    }
    getSpaceNews();
  }, []);

  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring", bounce: 0.4 } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 } 
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center relative overflow-hidden">
      
      {/* 🌟 ফিক্স: transform-gpu will-change-transform */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        className="mt-32 md:mt-40 max-w-4xl w-full z-10 backdrop-blur-xl bg-black/50 border border-white/10 rounded-3xl p-8 md:p-14 shadow-2xl transform-gpu will-change-transform"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-semibold mb-6 shadow-[0_0_15px_rgba(34,211,238,0.2)] transform-gpu"
        >
          🚀 Welcome to the Ultimate Space Community
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] tracking-tight transform-gpu"
        >
          Explore the Cosmos
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md transform-gpu"
        >
          Join astronomy lovers worldwide. Ask cosmic questions, share your astrophotography, and grab exclusive space merchandise.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-center gap-5 transform-gpu"
        >
          <Link href="/qa">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-3.5 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] transform-gpu">
              Join Discussions
            </motion.div>
          </Link>
          <Link href="/gallery">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white/5 hover:bg-white/10 border border-white/20 text-white px-8 py-3.5 rounded-full font-bold text-lg backdrop-blur-md transition-all shadow-lg transform-gpu">
              Explore Gallery
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>

      {/* 🌟 ফিক্স: margin: "50px" */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "50px" }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl transform-gpu will-change-transform"
      >
        <FeaturedPhoto />
      </motion.div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "50px" }}
        className="flex flex-col gap-6 max-w-6xl w-full mt-24 mb-16 z-10 transform-gpu"
      >
        <motion.div variants={fadeUpVariant} className="bg-gradient-to-b from-blue-900/20 to-black/40 backdrop-blur-md border border-blue-500/40 p-10 md:p-14 rounded-3xl hover:bg-black/60 transition-all hover:border-blue-400 group shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col items-center text-center transform-gpu will-change-transform">
          <motion.div whileHover={{ rotate: 10, scale: 1.2 }} className="text-5xl md:text-6xl mb-4 origin-center">👕</motion.div>
          <h3 className="text-3xl md:text-4xl font-extrabold text-blue-300 mb-2">Space Merch</h3>
          <p className="text-blue-400 font-bold text-lg md:text-xl mb-6 tracking-widest uppercase bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">
            "Wear the universe"
          </p>
          <p className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl leading-relaxed">
            Grab our premium, exclusive space-themed T-shirts, hoodies, and astronomy gear. Elevate your style with the cosmos.
          </p>
          <Link href="/shop">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center gap-2 group-hover:gap-3 transform-gpu">
              Visit Shop <span>→</span>
            </motion.div>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <motion.div variants={fadeUpVariant} className="bg-black/40 backdrop-blur-md border border-cyan-500/20 p-8 rounded-3xl hover:bg-black/60 transition-all hover:border-cyan-500/50 group shadow-lg text-left transform-gpu will-change-transform">
            <motion.div whileHover={{ scale: 1.2, rotate: -10 }} className="text-4xl mb-4 origin-left">❓</motion.div>
            <h3 className="text-2xl font-bold text-cyan-300 mb-3">Q&A Community</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Have questions about black holes or the multiverse? Ask experts and share your knowledge.</p>
            <Link href="/qa" className="text-cyan-400 font-semibold hover:text-cyan-300 flex items-center gap-2 group-hover:gap-3 transition-all">Ask a Question <span>→</span></Link>
          </motion.div>
          
          <motion.div variants={fadeUpVariant} className="bg-black/40 backdrop-blur-md border border-purple-500/20 p-8 rounded-3xl hover:bg-black/60 transition-all hover:border-purple-500/50 group shadow-lg text-left transform-gpu will-change-transform">
            <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="text-4xl mb-4 origin-left">📸</motion.div>
            <h3 className="text-2xl font-bold text-purple-300 mb-3">Astrophotography</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Upload your stunning night sky captures and view shots taken by astronomers globally.</p>
            <Link href="/gallery" className="text-purple-400 font-semibold hover:text-purple-300 flex items-center gap-2 group-hover:gap-3 transition-all">View Gallery <span>→</span></Link>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "50px" }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl w-full mb-32 z-10 text-left transform-gpu will-change-transform"
      >
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <span className="text-3xl animate-pulse">📡</span>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Live Cosmic News
          </h2>
        </div>
        
        {isLoadingNews ? (
          <div className="flex flex-col items-center justify-center py-10 w-full transform-gpu">
             <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="text-4xl mb-4">📡</motion.div>
             <p className="text-cyan-400 font-bold animate-pulse text-sm tracking-widest mb-8">Receiving signals from deep space...</p>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full opacity-40">
                {[1, 2, 3].map(n => (
                  <div key={n} className="bg-white/5 h-64 rounded-2xl border border-white/5 animate-pulse"></div>
                ))}
             </div>
          </div>
        ) : news.length > 0 ? (
          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transform-gpu"
          >
            {news.map((article: any) => (
              <motion.a 
                key={article.id} 
                variants={fadeUpVariant}
                whileHover={{ scale: 1.02, y: -5 }}
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all group flex flex-col shadow-lg transform-gpu will-change-transform"
              >
                <div className="h-48 w-full overflow-hidden relative bg-black/40">
                  {/* 🌟 ফিক্স: loading="lazy" decoding="async" */}
                  <img src={article.image_url} alt={article.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                  <div className="absolute top-3 left-3 bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    {article.news_site}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">{article.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-3 mb-4">{article.summary}</p>
                  <p className="text-[10px] text-purple-400 mt-auto font-medium">
                    {new Date(article.published_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        ) : (
          <p className="text-gray-400 text-center py-10 bg-black/30 rounded-2xl border border-white/10">Could not retrieve signals from deep space. 🛰️</p>
        )}
      </motion.div>
    </main>
  );
}