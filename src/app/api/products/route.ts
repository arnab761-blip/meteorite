import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectMongoDB();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, price, image, affiliateLink, currency, buttonColor } = await req.json(); 
    await connectMongoDB();
    await Product.create({ name, price, image, affiliateLink, currency, buttonColor });
    return NextResponse.json({ message: "Product Created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}