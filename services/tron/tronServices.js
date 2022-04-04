import apiCall from "./apiCall.js";
import Transactions from "../../models/transactions.js";

export const decodeBase58ToHexAndSlice8 = (base58String) => {
  return Buffer.from(bs58.decode(base58String)).toString("hex").slice(0, -8);
};

export const validateOneTransaction = async (transaction) => {
  try {
    const res = apiCall(`accounts/${transaction.from}/transactions`);
    const { data } = res;

    if (!data) {
      const updatedDocument =
        await transaction.addCheckCountAndSetStatusAsPending("Request failed");
      return updatedDocument;
    }

    const myTransaction = data.data.filter((oneTransaction) => {
      return oneTransaction.txID === transaction.hash;
    });

    const { value: valueParameter } =
      myTransaction.raw_data.contract[0].parameter;

    const assertAmount =
      parseInt(transaction.amount_network) <= valueParameter.amount;

    const assertAddresses =
      decodeBase58ToHexAndSlice8(valueParameter.owner_address) ===
        transaction.from &&
      decodeBase58ToHexAndSlice8(valueParameter.to_address) === transaction.to;

    if (assertAmount && assertAddresses) {
      const updatedDocument = await transaction.setStatusAs("Success");
      return updatedDocument;
    }

    return transaction
      .addCheckCountAndSetStatusAsPending("couldn't complete the validation")
      .then(console.error("couldn't complete the validation"));
  } catch (e) {
    const updatedDocument =
      await transaction.addCheckCountAndSetStatusAsPending(
        `[validateOneTransaction] Error - ${e}`
      );
    return updatedDocument;
  }
};

export const checkPoolAndValidate = async () => {
  try {
    const invalidatedTransactions =
      await Transactions.getInvalidatedTransactionsByNetwork("TRX");

    invalidatedTransactions.forEach(async (invalidatedTransaction) => {
      const validateDocument = await validateOneTransaction(
        invalidatedTransaction
      );
      console.log(validateDocument.status);
    });
  } catch (e) {
    return console.error(`[checkPoolAndValidate] Error - ${e}`);
  }
};
