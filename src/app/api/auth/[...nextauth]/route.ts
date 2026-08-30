import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "../../../../lib/mongodb";
import User from "../../../../models/User";

export const authOptions = {
  providers: [
    // ১. নাম আর পাসওয়ার্ড দিয়ে লগইনের সিস্টেম
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials: any) {
        const { name, password } = credentials;
        try {
          await connectMongoDB();
          const user = await User.findOne({ name });

          if (!user) {
            return null; 
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            return null; 
          }

          return user; 
        } catch (error) {
          console.log("Error: ", error);
          return null;
        }
      }
    }),
    
    // ২. Google দিয়ে লগইনের সিস্টেম
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    })
  ],

  // 🌟 নতুন যোগ করা অংশ: Google এর ডেটা MongoDB তে সেভ করার লজিক 🌟
  callbacks: {
    async signIn({ user, account }: any) {
      if (account.provider === "google") {
        try {
          const { name, email, image } = user;
          await connectMongoDB();
          
          // চেক করে দেখবে এই ইমেইলে আগে থেকে অ্যাকাউন্ট আছে কি না
          const userExists = await User.findOne({ email });

          if (!userExists) {
            // যদি না থাকে, তাহলে নতুন করে ডাটাবেসে গুগলের নাম, ইমেইল আর ছবি সেভ করবে
            await User.create({
              name: name,
              email: email,
              image: image,
            });
          }
        } catch (error) {
          console.log(error);
          return false;
        }
      }
      return true; // সব ঠিক থাকলে লগইন কন্টিনিউ করবে
    }
  },

  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", 
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };