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
      max: [5, "Cannot handle more than 5 checks"],
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
      enum: ["New", "Pending", "Fail", "Success"],
      default: "New",
    },
    rejected_reasons: [String],
  },
  { timestamps: true }
);

transaction.methods.addCheckCountAndSetStatusAsPending = (reason, cb) => {
  return this.model("transactions").findByIdAndUpdate(
    this._id,
    {
      check_count: this.check_count++,
      status: "Pending",
      reason,
    },
    {
      returnOriginal: false,
    },
    cb
  );
};

transaction.methods.setStatusAs = (status, cb) => {
  return this.model("transactions").findByIdAndUpdate(
    this._id,
    {
      status,
    },
    {
      returnOriginal: false,
    },
    cb
  );
};

transaction.methods.getInvalidatedTransactionsByNetwork = (network, cb) => {
  return this.model("transactions").find(
    {
      network,
      $or: [
        {
          status: "New",
        },
        {
          status: "Pending",
        },
      ],
    },
    cb
  );
};

export default mongoose.model("transactions", transaction);
