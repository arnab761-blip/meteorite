import mongoose, { Schema, models } from "mongoose";

const questionSchema = new Schema(
  {
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userImage: { type: String }, // গুগল থেকে পাওয়া ছবি দেখানোর জন্য
    questionText: { type: String, required: true },
    answers: [
      {
        userName: String,
        userImage: String,
        answerText: String,
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

const Question = models.Question || mongoose.model("Question", questionSchema);
export default Question;