import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    // ফর্ম থেকে আসা ডেটাগুলো রিসিভ করা
    const { name, phone, address, trxId } = await req.json();
    
    // ডাটাবেসের সাথে কানেক্ট করা
    await connectMongoDB();
    
    // ডাটাবেসে ডেটা সেভ করা
    await Order.create({ name, phone, address, trxId });
    
    return NextResponse.json({ message: "Order saved to database!" }, { status: 201 });
  } catch (error) {
    console.log("Error saving order:", error);
    return NextResponse.json({ message: "An error occurred." }, { status: 500 });
  }
}