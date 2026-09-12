"use client";
import { useEffect, useRef } from "react";
import OneSignal from "react-onesignal";

export default function OneSignalInit() {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const runOneSignal = async () => {
      try {
        // 🌟 'as any' দিয়ে TypeScript-কে পুরোপুরি সাইলেন্ট করে দেওয়া হলো 🌟
        await OneSignal.init({
          appId: "153391b2-a4c5-4141-818f-15e313e2224f",
          allowLocalhostAsSecureOrigin: true,
          notifyButton: {
            enable: true, // বেল আইকন অন
          },
        } as any);
        
        await OneSignal.Slidedown.promptPush();
      } catch (error) {
        console.error("OneSignal Init Error:", error);
      }
    };
    
    runOneSignal();
  }, []);

  return null;
}