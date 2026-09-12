import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import OneSignalInit from "@/components/OneSignalInit"; // 🌟 নতুন ইমপোর্ট

export const metadata: Metadata = {
  title: "Meteorite | Space Community",
  description: "Explore the cosmos with Meteorite.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#050810] text-white relative flex flex-col min-h-screen">
        
        {/* 🌟 নোটিফিকেশন পারমিশনের পপআপ 🌟 */}
        <OneSignalInit />
        
        {/* 🌟 AuthProvider এখন পুরো ওয়েবসাইটকে র‍্যাপ করে আছে 🌟 */}
        <AuthProvider>
          
          {/* ডাইনামিক ব্যাকগ্রাউন্ড */}
          <div className="absolute top-0 left-0 w-full h-full z-[-1] overflow-hidden">
             <div className="h-screen w-full bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/bg-1.jpg')" }}><div className="w-full h-full bg-black/40"></div></div>
             <div className="h-screen w-full bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/bg-image.jpg')" }}><div className="w-full h-full bg-black/50"></div></div>
             <div className="h-screen w-full bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/bg-2.jpg')" }}><div className="w-full h-full bg-black/50"></div></div>
             <div className="h-screen w-full bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/bg-3.jpg')" }}><div className="w-full h-full bg-black/50"></div></div>
             <div className="h-screen w-full bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/bg-4.jpg')" }}><div className="w-full h-full bg-black/50"></div></div>
             <div className="h-[200vh] w-full bg-fixed bg-cover bg-center" style={{ backgroundImage: "url('/bg-1.jpg')" }}><div className="w-full h-full bg-black/60"></div></div>
          </div>

          <Navbar />

          {/* মেইন কন্টেন্ট */}
          <div className="flex-1 flex flex-col relative z-10">
            {children}
          </div>

          {/* ফুটার */}
          <footer className="w-full backdrop-blur-xl bg-black/60 border-t border-white/20 py-10 mt-auto relative z-10">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                  <img src="/meteoritelogo.jpg" alt="Logo" className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-purple-500/50 object-cover shadow-[0_0_10px_rgba(168,85,247,0.3)]" />
                  <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">METEORITE</h2>
                </div>
                <p className="text-gray-400 text-sm mt-2">Explore the cosmos with us.</p>
              </div>
              <div className="flex gap-6 text-gray-300">
                <a href="#" className="hover:text-cyan-400 transition-colors">Facebook</a>
                <a href="#" className="hover:text-cyan-400 transition-colors">Telegram</a>
                <a href="#" className="hover:text-cyan-400 transition-colors">YouTube</a>
              </div>
              <div className="text-center md:text-right text-sm text-gray-400">
                <p>Developed by <span className="text-cyan-400 font-semibold">MD Tahmidul Islam Arnab</span></p> 
                <p className="mt-1">© 2026 Meteorite. All rights reserved.</p>
              </div>
            </div>
          </footer>
          
        </AuthProvider>

      </body>
    </html>
  );
}