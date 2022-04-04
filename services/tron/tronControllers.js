import { validateOneTransaction } from "./tronServices.js";
import Transactions from "../../models/transactions.js";
export const nativeCoin = async (req, res) => {
  try {
    const { walletAddress } = req.query;

    const transactionDocument = await Transactions.find({
      from: walletAddress,
    });
    const validateDocument = await validateOneTransaction(transactionDocument);

    return res.json(validateDocument);
  } catch (e) {
    res.json({ message: "error", errorMessage: e.toString() });
  }
};
export const trc20 = (req, res) => {
  return res.json({ message: "success" });
};
