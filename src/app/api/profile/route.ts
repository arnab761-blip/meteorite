import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Gallery from "@/models/Gallery";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await connectMongoDB();
    // শুধুমাত্র এই ইউজারের অর্ডার এবং ছবি খুঁজবে
    const orders = await Order.find({ userEmail: email }).sort({ createdAt: -1 });
    const photos = await Gallery.find({ userEmail: email }).sort({ createdAt: -1 });
    return NextResponse.json({ orders, photos }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}