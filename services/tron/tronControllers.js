import { validateOneTransaction } from "./tronServices.js";
import Transactions from "../../models/transactions.js";
export const nativeCoin = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const transactionDoc = await Transactions.findOne({
      from: walletAddress,
    });
    const validateDoc = await validateOneTransaction(transactionDoc);
    const saveDoc = await Transactions.findByIdAndUpdate(
      transactionDoc._id,
      validateDoc,
      { new: true }
    );

    return res.json(saveDoc);
  } catch (e) {
    res.json({ message: "error", errorMessage: e.message });
  }
};
export const trc20 = (req, res) => {
  return res.json({ message: "success" });
};
