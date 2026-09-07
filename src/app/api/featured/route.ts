import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import FeaturedPhoto from "@/models/FeaturedPhoto";

export async function GET() {
  try {
    await connectMongoDB();
    const photo = await FeaturedPhoto.findOne().sort({ createdAt: -1 });
    return NextResponse.json({ photo }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { image, photographerName, photographerImage } = await req.json();
    await connectMongoDB();
    // আগের সব ডিলিট করে শুধু লেটেস্টটা রাখবে
    await FeaturedPhoto.deleteMany({});
    await FeaturedPhoto.create({ image, photographerName, photographerImage });
    return NextResponse.json({ message: "Featured Photo Updated" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}