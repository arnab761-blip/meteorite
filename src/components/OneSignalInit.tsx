"use client";
import { useEffect, useRef } from "react";
import OneSignal from "react-onesignal";

export default function OneSignalInit() {
  const isInitialized = useRef(false);

  useEffect(() => {
    // Next.js এর ডাবল রেন্ডারিং আটকানোর জন্য useRef ব্যবহার করা হলো
    if (isInitialized.current) return;
    isInitialized.current = true;

    const runOneSignal = async () => {
      try {
        await OneSignal.init({
          appId: "153391b2-a4c5-4141-818f-15e313e2224f",
          allowLocalhostAsSecureOrigin: true,
        });
        OneSignal.Slidedown.promptPush();
      } catch (error) {
        console.error("OneSignal Init Error:", error);
      }
    };
    
    runOneSignal();
  }, []);

  return null;
}