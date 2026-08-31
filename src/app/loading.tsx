export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#050810]/90 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        {/* বাইরের স্পিনার (পার্পল) */}
        <div className="w-20 h-20 border-4 border-white/5 border-t-purple-500 rounded-full animate-spin"></div>
        
        {/* ভেতরের স্পিনার (সায়ান - উল্টো ঘুরবে) */}
        <div className="absolute w-12 h-12 border-4 border-white/5 border-b-cyan-400 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
        
        {/* মাঝখানের রকেট আইকন */}
        <div className="absolute text-2xl animate-pulse">🚀</div>
      </div>
      
      <h3 className="mt-6 font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 animate-pulse uppercase text-sm">
        Entering Orbit...
      </h3>
    </div>
  );
}