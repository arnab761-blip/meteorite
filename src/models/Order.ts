import mongoose, { Schema, models } from "mongoose";

const orderSchema = new Schema(
  {
    userEmail: { type: String }, // ইউজারের জিমেইল
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    trxId: { type: String, required: true },
    productName: { type: String }, // প্রোডাক্টের নাম
    price: { type: String } // দাম
  },
  { timestamps: true }
);

const Order = models.Order || mongoose.model("Order", orderSchema);
export default Order;