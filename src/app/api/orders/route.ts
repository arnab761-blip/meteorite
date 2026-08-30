import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/Order";

// 🌟 অ্যাডমিন ড্যাশবোর্ডে সব অর্ডার দেখানোর জন্য (GET) 🌟
export async function GET() {
  try {
    await connectMongoDB();
    const orders = await Order.find().sort({ createdAt: -1 }); // নতুন অর্ডার ওপরে থাকবে
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.log("Error fetching orders:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

// 🌟 নতুন অর্ডার প্লেস করার জন্য (আগের POST API টাই) 🌟
export async function POST(req: Request) {
  try {
    const { userEmail, name, phone, address, trxId, productName, price } = await req.json();
    await connectMongoDB();
    await Order.create({ userEmail, name, phone, address, trxId, productName, price });
    return NextResponse.json({ message: "Order Placed Successfully" }, { status: 201 });
  } catch (error) {
    console.log("Error creating order:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}