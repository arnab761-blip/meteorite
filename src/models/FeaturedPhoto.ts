import mongoose, { Schema, models } from "mongoose";

const featuredPhotoSchema = new Schema(
  {
    image: { type: String, required: true },
    photographerName: { type: String, required: true },
    photographerImage: { type: String, required: true },
  },
  { timestamps: true }
);

const FeaturedPhoto = models.FeaturedPhoto || mongoose.model("FeaturedPhoto", featuredPhotoSchema);
export default FeaturedPhoto;