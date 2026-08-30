import mongoose, { Schema, models } from "mongoose";

const gallerySchema = new Schema(
  {
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userImage: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    views: { type: Number, default: 0 }, // 🌟 ভিউ কাউন্ট করার ফিল্ড
  },
  { timestamps: true }
);

const Gallery = models.Gallery || mongoose.model("Gallery", gallerySchema);
export default Gallery;