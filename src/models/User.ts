import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true // এক নামে শুধু একজনই অ্যাকাউন্ট খুলতে পারবে
    },
    password: { 
      type: String 
      // এটা অপশনাল রাখলাম, কারণ যারা Google দিয়ে লগইন করবে তাদের কোনো পাসওয়ার্ড থাকবে না
    },
    email: { 
      type: String 
      // এটাও অপশনাল, Google দিয়ে লগইন করলে জিমেইলটা এখানে সেভ হবে
    },
    image: {
      type: String
      // Google-এর প্রোফাইল পিকচার সেভ করার জন্য
    }
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);
export default User;