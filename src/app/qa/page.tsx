"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react"; 
import { useRouter } from "next/navigation"; 

export default function QA() {
  const { data: session } = useSession(); 
  const router = useRouter(); 

  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/questions');
      const data = await res.json();
      if (data.questions) setQuestions(data.questions);
    } catch (error) {
      console.log(error);
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
      <div className="backdrop-blur-md bg-white/5 p-6 md:p-10 rounded-3xl border border-white/10 max-w-lg md:max-w-4xl w-full shadow-2xl mt-10 mb-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-cyan-300">Q&A Community</h2>
        <p className="text-sm md:text-base text-gray-300 mb-8">Ask your deep space questions or share your cosmic knowledge.</p>

        <form onSubmit={handleSubmit} className="mb-10 text-left bg-black/40 p-6 rounded-2xl border border-cyan-500/30 shadow-lg">
          <h4 className="text-lg font-semibold text-cyan-400 mb-4">Ask a Question</h4>
          <input type="text" value={session?.user?.name || "Sign in to post"} disabled className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-gray-400 mb-4 cursor-not-allowed" />
          <textarea required value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="What do you want to know?" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 h-24 resize-none transition-colors mb-4 focus:outline-none"></textarea>
          <button type="submit" disabled={isLoading} className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2.5 rounded-lg font-bold text-white transition-all disabled:opacity-50" onClick={(e) => {
            if (!session) {
              e.preventDefault();
              router.push("/login");
            }
          }}>
            {isLoading ? "Posting..." : "Post Question"}
          </button>
        </form>

        <div className="text-left space-y-6">
          <h4 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2">Community Discussions</h4>
          
          {questions.map((q: any) => (
            <div key={q._id} className="bg-white/10 p-5 rounded-xl border border-white/10 shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden border border-cyan-500/50">
                  {q.userImage ? (
                    <img src={q.userImage} alt="User" className="w-full h-full object-cover" />
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
                    <div key={i} className="bg-black/30 p-3 rounded-lg border border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-gray-600 flex-shrink-0 overflow-hidden">
                          {ans.userImage ? (
                            <img src={ans.userImage} alt="Reply" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px] font-bold">
                              {ans.userName?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-purple-400 font-medium">{ans.userName}</p>
                      </div>
                      <p className="text-sm text-gray-200 ml-8">{ans.answerText}</p>
                    </div>
                  ))}
                </div>
              )}

              {replyingTo === q._id ? (
                <form onSubmit={(e) => handleReplySubmit(e, q._id)} className="mt-4 bg-black/50 p-4 rounded-xl border border-white/10 flex flex-col gap-3">
                  <input type="text" value={session?.user?.name || "Sign in to reply"} disabled className="bg-transparent border-b border-white/20 pb-2 text-sm text-gray-400 cursor-not-allowed" />
                  <textarea required value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write your answer..." className="bg-transparent border border-white/20 p-3 rounded-lg text-sm text-white h-20 resize-none focus:outline-none focus:border-cyan-500"></textarea>
                  <div className="flex gap-3 mt-1">
                    <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-black px-4 py-1.5 rounded-lg text-sm font-bold transition-colors">Submit Answer</button>
                    <button type="button" onClick={() => setReplyingTo(null)} className="text-gray-400 text-sm hover:text-white transition-colors">Cancel</button>
                  </div>
                </form>
              ) : (
                <button onClick={() => {
                  if (!session) {
                    router.push("/login");
                    return;
                  }
                  setReplyingTo(q._id);
                }} className="text-sm text-cyan-400 mt-4 ml-12 hover:text-cyan-300 transition-colors font-medium flex items-center gap-1">
                  ✎ Write an Answer
                </button>
              )}

            </div>
          ))}
        </div>
      </div>
    </main>
  );
}