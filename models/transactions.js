import mongoose, { Schema } from "mongoose";

const transaction = Schema(
  {
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    network: {
      type: String,
    },
    check_count: {
      type: Number,
    },
    amount_network: {
      type: String,
    },
    amount_arb: {
      type: Number,
    },
    hash: {
      type: String,
    },
    status: {
      type: String,
      enum: ["new", "pending", "fail", "success"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("transactions", transaction);
