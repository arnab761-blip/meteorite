import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Gallery from "@/models/Gallery";

export async function GET() {
  try {
    await connectMongoDB();
    const photos = await Gallery.find().sort({ createdAt: -1 });
    return NextResponse.json({ photos }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userName, userEmail, userImage, title, description, image } = await req.json();
    await connectMongoDB();
    
    // ১. ডাটাবেসে ছবি সেভ করা
    await Gallery.create({ userName, userEmail, userImage, title, description, image });

    // ২. নোটিফিকেশন পাঠানো (API Key এখন .env থেকে আসবে)
    try {
      await fetch("https://onesignal.com/api/v1/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 🌟 .env ফাইল থেকে সিক্রেট কি আনা হচ্ছে 🌟
          "Authorization": `Basic ${process.env.ONESIGNAL_REST_API_KEY}` 
        },
        body: JSON.stringify({
          app_id: "153391b2-a4c5-4141-818f-15e313e2224f", // App ID সরাসরি থাকলে সমস্যা নেই
          included_segments: ["Subscribed Users"],
          headings: { en: "🚀 New Cosmic Masterpiece!" },
          contents: { en: `${userName} just uploaded a stunning new astrophoto. Tap to view!` },
          url: "https://your-website.vercel.app/gallery" 
        })
      });
    } catch (pushError) {
      console.log("Push notification failed", pushError);
    }

    return NextResponse.json({ message: "Photo uploaded and notification sent" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id } = await req.json();
    await connectMongoDB();
    await Gallery.findByIdAndUpdate(id, { $inc: { views: 1 } });
    return NextResponse.json({ message: "View counted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}