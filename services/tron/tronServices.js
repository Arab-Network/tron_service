import apiCall from "./apiCall.js";
import Transactions from "../../models/transactions.js";
import bs58 from "bs58";

export const decodeBase58ToHexAndSlice8 = (base58String) => {
  return Buffer.from(bs58.decode(base58String)).toString("hex").slice(0, -8);
};

export const validateOneTransaction = async (transaction) => {
  try {
    const res = await apiCall(`accounts/${transaction.from}/transactions`);
    const { data } = res;

    if (!res.data) {
      return {
        check_count: transaction.check_count + 1,
        status: "Pending",
        rejected_reasons: [...transaction.rejected_reasons, "Request failed "],
      };
    }

    const myTransaction = data.data.filter((oneTransaction) => {
      return oneTransaction.txID === transaction.hash;
    })[0];

    if (!myTransaction) {
      // checks if undefined
      return {
        check_count: transaction.check_count + 1,
        status: "Fail",
        rejected_reasons: [...transaction.rejected_reasons, "No hashes match"],
      };
    }

    if (myTransaction.ret[0].contractRet !== "SUCCESS")
      return {
        check_count: transaction.check_count + 1,
        status: "Fail",
        rejected_reasons: [
          ...transaction.rejected_reasons,
          "Contract return is not success",
        ],
      };

    console.log(myTransaction.raw_data.contract[0].parameter);

    const valueParameter = myTransaction.raw_data.contract[0].parameter.value;

    const assertAmount =
      parseInt(transaction.amount_network) <= valueParameter.amount;

    const assertAddresses =
      valueParameter.owner_address ===
        decodeBase58ToHexAndSlice8(transaction.from) &&
      valueParameter.to_address === decodeBase58ToHexAndSlice8(transaction.to);

    if (assertAmount && assertAddresses) {
      return {
        status: "Success",
      };
    }

    return {
      check_count: transaction.check_count + 1,
      status: "Pending",
      rejected_reasons: [
        ...transaction.rejected_reasons,
        "Couldn't complete the validation",
      ],
    };
  } catch (e) {
    console.log(e);
    return {
      check_count: transaction.check_count + 1,
      status: "Pending",
      rejected_reasons: [
        ...transaction.rejected_reasons,
        `[validateOneTransaction] Error - ${e.message}`,
      ],
    };
  }
};

export const checkPoolAndValidate = async () => {
  try {
    const invalidatedTransactions = await Transactions.find({
      network: "TRX",
      $or: [
        {
          status: "New",
        },
        {
          status: "Pending",
        },
      ],
    });

    if (invalidatedTransactions.length === 0) {
      return console.log("No invalidated TRX transactions were found.");
    }

    console.log(
      `Found ${invalidatedTransactions.length} invalidated TRX transactions, checking each...`
    );
    invalidatedTransactions.forEach(async (invalidatedTransaction) => {
      console.log("Validating:", invalidatedTransaction);
      const validateDocument = await validateOneTransaction(
        invalidatedTransaction
      );

      const updatedDocument = await Transactions.findByIdAndUpdate(
        invalidatedTransaction._id,
        validateDocument,
        { new: true }
      );
      console.log("Validated:", updatedDocument);
    });
  } catch (e) {
    return console.error(`[checkPoolAndValidate] Error - ${e.message}`);
  }
};
