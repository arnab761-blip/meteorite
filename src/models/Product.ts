import mongoose, { Schema, models } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true },
    affiliateLink: { type: String, required: false },
    currency: { type: String, required: false, default: "৳" }, // 🌟 নতুন
    buttonColor: { type: String, required: false, default: "bg-purple-500 hover:bg-purple-600 text-white" } // 🌟 নতুন
  },
  { timestamps: true }
);

const Product = models.Product || mongoose.model("Product", productSchema);
export default Product;