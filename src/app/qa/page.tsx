"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react"; 
import { useRouter } from "next/navigation"; 
import { motion, AnimatePresence } from "framer-motion";

export default function QA() {
  const { data: session } = useSession(); 
  const router = useRouter(); 

  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const fetchQuestions = async () => {
    setIsLoadingData(true); 
    try {
      const res = await fetch('/api/questions');
      const data = await res.json();
      if (data.questions) setQuestions(data.questions);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingData(false); 
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userName: session?.user?.name || "Explorer",
          userEmail: session?.user?.email || "Unknown User",
          userImage: session?.user?.image || "", 
          questionText: questionText 
        }),
      });
      if (res.ok) {
        setQuestionText("");
        fetchQuestions();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent, questionId: string) => {
    e.preventDefault();
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch('/api/questions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          questionId, 
          userName: session?.user?.name || "Explorer", 
          userImage: session?.user?.image || "", 
          answerText: replyText 
        }),
      });
      if (res.ok) {
        setReplyText("");
        setReplyingTo(null); 
        fetchQuestions(); 
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex flex-col items-center pt-32 px-4 text-center min-h-screen">
      {/* 🌟 ফিক্স: transform-gpu যুক্ত করা হয়েছে 🌟 */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="backdrop-blur-md bg-white/5 p-6 md:p-10 rounded-3xl border border-white/10 max-w-lg md:max-w-4xl w-full shadow-2xl mt-10 mb-20 transform-gpu"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-cyan-300">Q&A Community</h2>
        <p className="text-sm md:text-base text-gray-300 mb-8">Ask your deep space questions or share your cosmic knowledge.</p>

        <form onSubmit={handleSubmit} className="mb-10 text-left bg-black/40 p-6 rounded-2xl border border-cyan-500/30 shadow-lg transform-gpu">
          <h4 className="text-lg font-semibold text-cyan-400 mb-4">Ask a Question</h4>
          <input type="text" value={session?.user?.name || "Sign in to post"} disabled className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-gray-400 mb-4 cursor-not-allowed" />
          <textarea required value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="What do you want to know?" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 h-24 resize-none transition-colors mb-4 focus:outline-none"></textarea>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={isLoading} 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2.5 rounded-lg font-bold text-white transition-all disabled:opacity-50 transform-gpu" 
            onClick={(e) => {
              if (!session) {
                e.preventDefault();
                router.push("/login");
              }
            }}
          >
            {isLoading ? "Posting..." : "Post Question"}
          </motion.button>
        </form>

        <div className="text-left space-y-6">
          <h4 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2">Community Discussions</h4>
          
          {isLoadingData ? (
             <div className="flex flex-col items-center justify-center py-10 w-full transform-gpu">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="text-4xl mb-4">📡</motion.div>
                <p className="text-cyan-400 font-bold animate-pulse text-sm tracking-widest mb-8">Receiving signals from community...</p>
                <div className="w-full space-y-6 opacity-40">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="bg-white/5 p-5 rounded-xl border border-white/5 animate-pulse flex gap-3 transform-gpu">
                       <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0"></div>
                       <div className="flex-1 space-y-3 py-1">
                          <div className="h-4 bg-white/10 rounded w-3/4"></div>
                          <div className="h-3 bg-white/10 rounded w-1/4"></div>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
          ) : questions.length === 0 ? (
             <p className="text-gray-400 py-6 text-center">No discussions yet. Be the first to ask!</p>
          ) : (
            questions.map((q: any, index: number) => (
              // 🌟 ফিক্স: transform-gpu will-change-transform অ্যাড করা হয়েছে, viewport margin দেওয়া হয়েছে 🌟
              <motion.div 
                key={q._id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "50px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white/10 p-5 rounded-xl border border-white/10 shadow-md transform-gpu will-change-transform"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden border border-cyan-500/50">
                    {q.userImage ? (
                      <img src={q.userImage} alt="User" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold">
                        {q.userName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-white">{q.questionText}</h4>
                    <p className="text-xs text-gray-400">Asked by <span className="text-cyan-300 font-medium">{q.userName}</span></p>
                  </div>
                </div>

                {q.answers && q.answers.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-3 pl-4 md:pl-8 border-l-2 border-l-cyan-500/30">
                    {q.answers.map((ans: any, i: number) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "20px" }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="bg-black/30 p-3 rounded-lg border border-white/5 transform-gpu will-change-transform"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-gray-600 flex-shrink-0 overflow-hidden">
                            {ans.userImage ? (
                              <img src={ans.userImage} alt="Reply" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px] font-bold">
                                {ans.userName?.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-purple-400 font-medium">{ans.userName}</p>
                        </div>
                        <p className="text-sm text-gray-200 ml-8">{ans.answerText}</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {replyingTo === q._id ? (
                    <motion.form 
                      key="reply-form"
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: "auto", scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      onSubmit={(e) => handleReplySubmit(e, q._id)} 
                      className="mt-4 bg-black/50 p-4 rounded-xl border border-white/10 flex flex-col gap-3 overflow-hidden transform-gpu will-change-transform"
                    >
                      <input type="text" value={session?.user?.name || "Sign in to reply"} disabled className="bg-transparent border-b border-white/20 pb-2 text-sm text-gray-400 cursor-not-allowed" />
                      <textarea required value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write your answer..." className="bg-transparent border border-white/20 p-3 rounded-lg text-sm text-white h-20 resize-none focus:outline-none focus:border-cyan-500"></textarea>
                      <div className="flex gap-3 mt-1">
                        <motion.button whileTap={{ scale: 0.95 }} type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-black px-4 py-1.5 rounded-lg text-sm font-bold transition-colors transform-gpu">Submit Answer</motion.button>
                        <button type="button" onClick={() => setReplyingTo(null)} className="text-gray-400 text-sm hover:text-white transition-colors">Cancel</button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.button 
                      key="reply-button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => {
                        if (!session) {
                          router.push("/login");
                          return;
                        }
                        setReplyingTo(q._id);
                      }} 
                      className="text-sm text-cyan-400 mt-4 ml-12 hover:text-cyan-300 transition-colors font-medium flex items-center gap-1 transform-gpu"
                    >
                      ✎ Write an Answer
                    </motion.button>
                  )}
                </AnimatePresence>

              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </main>
  );
}