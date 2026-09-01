import Link from "next/link";
export const dynamic = "force-dynamic";

// 🌟 রিয়েল-টাইম স্পেস নিউজ আনার ফাংশন (প্রতি রিফ্রেশে র‍্যান্ডম নিউজ আসবে) 🌟
async function getSpaceNews() {
  try {
    const randomOffset = Math.floor(Math.random() * 100);
    
    const res = await fetch(`https://api.spaceflightnewsapi.net/v4/articles/?limit=6&offset=${randomOffset}`, { 
      cache: 'no-store' 
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.log("Error fetching news:", error);
    return [];
  }
}

export default async function Home() {
  const news = await getSpaceNews();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      
      {/* 🌟 Hero Section (ফ্লোটিং ব্যাকগ্রাউন্ড সহ) 🌟 */}
      <div className="mt-32 md:mt-40 max-w-4xl w-full z-10 backdrop-blur-xl bg-black/50 border border-white/10 rounded-3xl p-8 md:p-14 shadow-2xl">
        <div className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-semibold mb-6 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          🚀 Welcome to the Ultimate Space Community
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] tracking-tight">
          Explore the Cosmos
        </h1>
        
        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          Join astronomy lovers worldwide. Ask cosmic questions, share your astrophotography, and grab exclusive space merchandise.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-5">
          <Link href="/qa" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-3.5 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] hover:-translate-y-1">
            Join Discussions
          </Link>
          <Link href="/gallery" className="bg-white/5 hover:bg-white/10 border border-white/20 text-white px-8 py-3.5 rounded-full font-bold text-lg backdrop-blur-md transition-all hover:-translate-y-1 shadow-lg">
            Explore Gallery
          </Link>
        </div>
      </div>

      {/* 🌟 Features Section 🌟 */}
      <div className="flex flex-col gap-6 max-w-6xl w-full mt-24 mb-16 z-10">
        
        {/* Main Business: Shop Card (বড় করে সবার ওপরে) */}
        <div className="bg-gradient-to-b from-blue-900/20 to-black/40 backdrop-blur-md border border-blue-500/40 p-10 md:p-14 rounded-3xl hover:bg-black/60 transition-all hover:-translate-y-2 hover:border-blue-400 group shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col items-center text-center">
          <div className="text-5xl md:text-6xl mb-4 group-hover:scale-110 transition-transform">👕</div>
          <h3 className="text-3xl md:text-4xl font-extrabold text-blue-300 mb-2">Space Merch</h3>
          <p className="text-blue-400 font-bold text-lg md:text-xl mb-6 tracking-widest uppercase bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">
            "Wear the universe"
          </p>
          <p className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl leading-relaxed">
            Grab our premium, exclusive space-themed T-shirts, hoodies, and astronomy gear. Elevate your style with the cosmos.
          </p>
          <Link href="/shop" className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] flex items-center gap-2 group-hover:gap-3">
            Visit Shop <span>→</span>
          </Link>
        </div>

        {/* Secondary Features: Q&A and Gallery (নিচে পাশাপাশি) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="bg-black/40 backdrop-blur-md border border-cyan-500/20 p-8 rounded-3xl hover:bg-black/60 transition-all hover:-translate-y-2 hover:border-cyan-500/50 group shadow-lg text-left">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">❓</div>
            <h3 className="text-2xl font-bold text-cyan-300 mb-3">Q&A Community</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Have questions about black holes or the multiverse? Ask experts and share your knowledge.</p>
            <Link href="/qa" className="text-cyan-400 font-semibold hover:text-cyan-300 flex items-center gap-2 group-hover:gap-3 transition-all">Ask a Question <span>→</span></Link>
          </div>
          
          <div className="bg-black/40 backdrop-blur-md border border-purple-500/20 p-8 rounded-3xl hover:bg-black/60 transition-all hover:-translate-y-2 hover:border-purple-500/50 group shadow-lg text-left">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">📸</div>
            <h3 className="text-2xl font-bold text-purple-300 mb-3">Astrophotography</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Upload your stunning night sky captures and view shots taken by astronomers globally.</p>
            <Link href="/gallery" className="text-purple-400 font-semibold hover:text-purple-300 flex items-center gap-2 group-hover:gap-3 transition-all">View Gallery <span>→</span></Link>
          </div>
        </div>
      </div>

      {/* 🌟 Live Space News Feed 🌟 */}
      <div className="max-w-6xl w-full mb-32 z-10 text-left">
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <span className="text-3xl animate-pulse">📡</span>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Live Cosmic News
          </h2>
        </div>
        
        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article: any) => (
              <a 
                key={article.id} 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:-translate-y-2 transition-all group flex flex-col shadow-lg"
              >
                <div className="h-48 w-full overflow-hidden relative">
                  <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
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
              </a>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-10 bg-black/30 rounded-2xl border border-white/10">Loading signals from deep space... 🛰️</p>
        )}
      </div>

    </main>
  );
}