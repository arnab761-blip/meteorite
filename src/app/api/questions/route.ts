import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Question from "@/models/Question";

// ১. ডাটাবেস থেকে সব প্রশ্ন আর উত্তর ফ্রন্টএন্ডে পাঠানোর জন্য (GET)
export async function GET() {
  try {
    await connectMongoDB();
    // sort({ createdAt: -1 }) দেওয়া হয়েছে যাতে নতুন প্রশ্নগুলো সবার ওপরে দেখায়
    const questions = await Question.find().sort({ createdAt: -1 });
    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.log("Error fetching questions:", error);
    return NextResponse.json({ message: "Error fetching questions" }, { status: 500 });
  }
}

// ২. নতুন প্রশ্ন ডাটাবেসে সেভ করার জন্য (POST)
export async function POST(req: Request) {
  try {
    const { userName, userEmail, userImage, questionText } = await req.json();
    await connectMongoDB();
    
    await Question.create({ 
      userName, 
      userEmail, 
      userImage, 
      questionText 
    });

    return NextResponse.json({ message: "Question Posted Successfully" }, { status: 201 });
  } catch (error) {
    console.log("Error creating question:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

// ৩. কোনো প্রশ্নের নিচে অন্য ইউজারের উত্তর (Reply) সেভ করার জন্য (PUT)
export async function PUT(req: Request) {
  try {
    const { questionId, userName, userImage, answerText } = await req.json();
    await connectMongoDB();
    
    // নির্দিষ্ট ID ধরে সেই প্রশ্নের 'answers' লিস্টের ভেতরে নতুন উত্তরটা ঢুকিয়ে দেওয়া হচ্ছে
    await Question.findByIdAndUpdate(
      questionId,
      {
        $push: {
          answers: { userName, userImage, answerText }
        }
      }
    );

    return NextResponse.json({ message: "Answer Added Successfully" }, { status: 200 });
  } catch (error) {
    console.log("Error adding answer:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}