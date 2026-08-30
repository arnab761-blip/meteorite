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
    await Gallery.create({ userName, userEmail, userImage, title, description, image });
    return NextResponse.json({ message: "Photo uploaded" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

// 🌟 ভিউ বাড়ানোর জন্য নতুন API 🌟
export async function PUT(req: Request) {
  try {
    const { id } = await req.json();
    await connectMongoDB();
    await Gallery.findByIdAndUpdate(id, { $inc: { views: 1 } }); // ভিউ ১ করে বাড়বে
    return NextResponse.json({ message: "View counted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}