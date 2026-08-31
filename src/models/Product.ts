import mongoose, { Schema, models } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true }, // Cloudinary এর লিংক এখানে সেভ হবে
  },
  { timestamps: true }
);

const Product = models.Product || mongoose.model("Product", productSchema);
export default Product;