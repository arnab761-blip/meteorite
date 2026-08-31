import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb"; // তোর MongoDB কানেকশনের পাথ যদি অন্য কিছু হয়, সেটা দিবি
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    const { name, price, image } = await req.json();
    await connectMongoDB();
    await Product.create({ name, price, image });
    return NextResponse.json({ message: "Product Created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectMongoDB();
    const products = await Product.find().sort({ createdAt: -1 }); // নতুন প্রোডাক্ট আগে দেখাবে
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
  }
}