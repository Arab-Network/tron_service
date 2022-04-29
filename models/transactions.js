import mongoose from "mongoose";
const { Schema } = mongoose;

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
      default: 0,
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
      enum: ["New", "Pending", "Failed", "Success"],
      default: "New",
    },
    rejected_reasons: [String],
  },
  { timestamps: true }
);

export default mongoose.model("transactions", transaction);
