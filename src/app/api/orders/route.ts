import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import nodemailer from "nodemailer";

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

// 🌟 নতুন অর্ডার প্লেস এবং ইমেইল পাঠানোর জন্য (POST) 🌟
export async function POST(req: Request) {
  try {
    const { userEmail, name, phone, address, trxId, productName, price } = await req.json();
    
    // ডাটাবেসে সেভ করা
    await connectMongoDB();
    await Order.create({ userEmail, name, phone, address, trxId, productName, price });

    // Nodemailer ট্রান্সপোর্টার সেটআপ
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // কাস্টমারকে পাঠানোর মেইল টেমপ্লেট (HTML)
    const mailOptions = {
      from: `"Meteorite Official" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "🚀 Order Confirmed - Meteorite Shop",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #050810; color: #ffffff; border-radius: 12px; border: 1px solid #222;">
          <h2 style="text-align: center; color: #00e5ff; margin-bottom: 5px;">Thank You for Your Order, Explorer! 🌌</h2>
          <p style="text-align: center; color: #a855f7; margin-top: 0;">Your space gear is preparing for launch.</p>
          
          <p style="color: #cccccc; font-size: 16px; margin-top: 25px;">Hi <strong>${name}</strong>,</p>
          <p style="color: #cccccc; font-size: 16px;">We have successfully received your order. Here are the details:</p>
          
          <div style="background-color: #111; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #333;">
            <p style="margin: 8px 0; color: #ddd;"><strong>🛍️ Item:</strong> <span style="color: #fff;">${productName}</span></p>
            <p style="margin: 8px 0; color: #ddd;"><strong>💰 Total Price:</strong> <span style="color: #00e5ff;">৳${price}</span></p>
            <p style="margin: 8px 0; color: #ddd;"><strong>🆔 TrxID:</strong> <span style="color: #fff;">${trxId}</span></p>
            <p style="margin: 8px 0; color: #ddd;"><strong>📍 Delivery Address:</strong> <span style="color: #fff;">${address}</span></p>
            <p style="margin: 8px 0; color: #ddd;"><strong>📞 Phone:</strong> <span style="color: #fff;">${phone}</span></p>
          </div>
          
          <p style="color: #cccccc; font-size: 16px;">We will send another update once your package reaches your orbit.</p>
          
          <div style="margin-top: 40px; border-top: 1px solid #333; padding-top: 20px;">
            <p style="color: #888; font-size: 14px;">Keep exploring,<br><strong style="color: #a855f7;">Meteorite Team</strong></p>
          </div>
        </div>
      `,
    };

    // ইমেইল সেন্ড করা
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Order Placed & Email Sent Successfully" }, { status: 201 });
  } catch (error) {
    console.log("Error creating order or sending email:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}