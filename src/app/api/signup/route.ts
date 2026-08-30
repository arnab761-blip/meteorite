import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs"; // পাসওয়ার্ড এনক্রিপ্ট করার জন্য

export async function POST(req: Request) {
  try {
    const { name, password } = await req.json();
    await connectMongoDB();
    
    // চেক করা যে এই নামে আগে থেকেই কেউ অ্যাকাউন্ট খুলেছে কি না
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists!" }, { status: 400 });
    }

    // পাসওয়ার্ড হ্যাস (Hash) বা এনক্রিপ্ট করা
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // ডাটাবেসে নতুন ইউজার সেভ করা
    await User.create({ name, password: hashedPassword });
    
    return NextResponse.json({ message: "User registered successfully." }, { status: 201 });
  } catch (error) {
    console.log("Error during signup:", error);
    return NextResponse.json({ message: "An error occurred." }, { status: 500 });
  }
}