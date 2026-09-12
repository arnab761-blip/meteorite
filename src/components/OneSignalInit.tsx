"use client";
import { useEffect } from "react";
import OneSignal from "react-onesignal";

export default function OneSignalInit() {
  useEffect(() => {
    const runOneSignal = async () => {
      await OneSignal.init({
        appId: "153391b2-a4c5-4141-818f-15e313e2224f",
        allowLocalhostAsSecureOrigin: true,
      });
      OneSignal.Slidedown.promptPush();
    };
    runOneSignal();
  }, []);
  return null;
}