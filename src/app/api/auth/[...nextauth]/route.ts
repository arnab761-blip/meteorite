import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials: any) {
        const { email, password } = credentials; // এখন নাম নয়, ইমেইল দিয়ে খুঁজবে
        try {
          await connectMongoDB();
          const user = await User.findOne({ email });

          if (!user) return null; 

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) return null; 

          return user; 
        } catch (error) {
          console.log("Error: ", error);
          return null;
        }
      }
    }),
    
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    })
  ],

  callbacks: {
    async signIn({ user, account }: any) {
      if (account.provider === "google") {
        try {
          const { name, email, image } = user;
          await connectMongoDB();
          
          const userExists = await User.findOne({ email });

          if (!userExists) {
            await User.create({ name, email, image });
          }
        } catch (error) {
          console.log(error);
          return false;
        }
      }
      return true; 
    }
  },

  session: { strategy: "jwt" as const },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };