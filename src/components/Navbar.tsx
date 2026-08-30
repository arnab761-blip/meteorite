"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 w-full z-50 p-3 md:p-4">
      <div className="max-w-6xl mx-auto relative backdrop-blur-xl bg-black/60 border border-white/20 rounded-2xl p-4 shadow-lg">
        
        <div className="flex justify-between items-center w-full">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/meteoritelogo.jpg" alt="Meteorite Logo" className="w-9 h-9 rounded-full border-[1.5px] border-cyan-500/50 shadow-[0_0_12px_rgba(34,211,238,0.4)] object-cover group-hover:scale-105 transition-transform" />
            <span className="text-xl md:text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              METEORITE
            </span>
          </Link>
          
          <input type="checkbox" id="mobile-menu" className="peer hidden" />
          <label htmlFor="mobile-menu" className="md:hidden text-white text-2xl w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 cursor-pointer active:bg-white/10 select-none">
            ☰
          </label>

          {/* 🌟 ডেস্কটপ মেনু 🌟 */}
          <div className="hidden md:flex gap-5 items-center text-sm font-medium text-gray-200">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <Link href="/qa" className="hover:text-cyan-400 transition-colors">Q&A Community</Link>
            <Link href="/shop" className="hover:text-cyan-400 transition-colors">Meteorite Shop</Link>
            <Link href="/gallery" className="hover:text-cyan-400 transition-colors">Cosmic Gallery</Link>
            
            {/* 🌟 শুধুমাত্র অ্যাডমিনের জন্য ম্যাজিক বাটন 🌟 */}
            {session?.user?.email === "geminiaipro42@gmail.com" && (
              <Link href="/admin" className="text-purple-400 font-bold hover:text-purple-300 transition-colors tracking-wide">
                Admin Panel
              </Link>
            )}
            
            {session ? (
              <Link href="/profile" className="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-full font-semibold transition-colors">
                Profile
              </Link>
            ) : (
              <Link href="/login" className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-full font-semibold transition-colors">
                Sign In
              </Link>
            )}
          </div>

          {/* 🌟 মোবাইল মেনু 🌟 */}
          <div className="hidden peer-checked:flex md:hidden absolute top-[115%] left-0 w-full flex-col gap-2 p-5 bg-[#050810]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-center text-sm font-medium text-gray-200">
            <Link href="/" className="py-2 hover:text-cyan-400 bg-white/5 rounded-lg">Home</Link>
            <Link href="/qa" className="py-2 hover:text-cyan-400 bg-white/5 rounded-lg">Q&A Community</Link>
            <Link href="/shop" className="py-2 hover:text-cyan-400 bg-white/5 rounded-lg">Meteorite Shop</Link>
            <Link href="/gallery" className="py-2 hover:text-cyan-400 bg-white/5 rounded-lg">Cosmic Gallery</Link>
            
            {/* 🌟 মোবাইলেও অ্যাডমিনের জন্য বাটন 🌟 */}
            {session?.user?.email === "geminiaipro42@gmail.com" && (
              <Link href="/admin" className="py-2 text-purple-400 font-bold bg-purple-500/10 border border-purple-500/20 rounded-lg">
                Admin Panel
              </Link>
            )}

            {session ? (
              <Link href="/profile" className="bg-purple-500 text-white py-3 rounded-xl font-bold mt-2 shadow-lg">
                Profile
              </Link>
            ) : (
              <Link href="/login" className="bg-cyan-500 text-white py-3 rounded-xl font-bold mt-2 shadow-lg">
                Sign In
              </Link>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
}