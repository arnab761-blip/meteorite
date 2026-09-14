import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Script from "next/script";

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
      <head>
        {/* 🌟 ডাইরেক্ট OneSignal অফিশিয়াল কোড 🌟 */}
        <Script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" strategy="beforeInteractive" />
        <Script id="onesignal-init" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: "153391b2-a4c5-4141-818f-15e313e2224f",
                notifyButton: {
                  enable: true,
                },
              });
              OneSignal.Slidedown.promptPush();
            });
          `
        }} />
      </head>
      
      <body className="bg-[#050810] text-white relative flex flex-col min-h-screen">
        
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
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-6">
              
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                  <img src="/meteoritelogo.jpg" alt="Logo" className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-purple-500/50 object-cover shadow-[0_0_10px_rgba(168,85,247,0.3)]" />
                  <h2 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">METEORITE</h2>
                </div>
                <p className="text-gray-400 text-sm mt-2">Explore the cosmos with us.</p>
              </div>
              
              {/* 🌟 আপডেট করা সোশ্যাল আইকন সেকশন (লোগো এবং নাম সহ) 🌟 */}
              <div className="flex gap-6 md:gap-8 text-gray-300">
                <a href="https://www.facebook.com/share/1FBWuxCosM/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 hover:text-cyan-400 transition-all hover:scale-110">
                  <img src="/Logo_de_Facebook.png" alt="Facebook" className="w-6 h-6 object-contain" />
                  <span className="text-[11px] font-medium tracking-wide">Facebook</span>
                </a>
                
                <a href="https://t.me/meteorite_bd" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 hover:text-cyan-400 transition-all hover:scale-110">
                  <img src="/telegram.png" alt="Telegram" className="w-6 h-6 object-contain" />
                  <span className="text-[11px] font-medium tracking-wide">Telegram</span>
                </a>
                
                <a href="https://www.instagram.com/meteorite_bd?stkn=ZjJ0cWNrajF3eW8x" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 hover:text-cyan-400 transition-all hover:scale-110">
                  <img src="/Instagram_icon.png.webp" alt="Instagram" className="w-6 h-6 object-contain" />
                  <span className="text-[11px] font-medium tracking-wide">Instagram</span>
                </a>
                
                <a href="https://www.youtube.com/channel/UC0sTKaKHBzk9Q9bePDJKl_Q" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 hover:text-cyan-400 transition-all hover:scale-110">
                  <img src="/Youtube_logo.png" alt="YouTube" className="w-6 h-6 object-contain" />
                  <span className="text-[11px] font-medium tracking-wide">YouTube</span>
                </a>
              </div>
              
              <div className="text-center md:text-right text-sm text-gray-400">
                {/* 🌟 তোর নামের ওপর ক্লিক করলে LinkedIn ওপেন হবে 🌟 */}
                <p>Developed by <a href="https://www.linkedin.com/in/md-tahmidul-islam-arnab-580587320?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="text-cyan-400 font-semibold hover:underline">MD Tahmidul Islam Arnab</a></p> 
                <p className="mt-1">© 2026 Meteorite. All rights reserved.</p>
              </div>
              
            </div>
          </footer>
          
        </AuthProvider>

      </body>
    </html>
  );
}