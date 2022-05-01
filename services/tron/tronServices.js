import apiCall from "./apiCall.js";
import Transactions from "../../models/transactions.js";
import bs58 from "bs58";

export const decodeBase58ToHexAndSlice8 = (base58String) => {
  return Buffer.from(bs58.decode(base58String)).toString("hex").slice(0, -8);
};

export const validateOneTransaction = async (transaction) => {
  try {
    let res = await apiCall(
      `accounts/${transaction.from}/transactions?only_confirmed=true&only_from=true`
    );

    let myTransaction = res.data.data.filter((oneTransaction) => {
      return oneTransaction.txID === transaction.hash;
    })[0];

    let valueParameter = myTransaction?.raw_data?.contract[0].parameter.value;

    if (!valueParameter?.amount | !valueParameter?.to_address) {
      res = await apiCall(
        `accounts/${transaction.from}/transactions/trc20?only_confirmed=true&only_from=true`
      );
      myTransaction = res.data.data.filter((oneTransaction) => {
        return oneTransaction.transaction_id === transaction.hash;
      })[0];

      valueParameter = {
        owner_address: myTransaction?.from,
        to_address: myTransaction?.to,
        amount: myTransaction?.value,
      };
    }

    if (!res.data) {
      return {
        check_count: transaction.check_count + 1,
        status: transaction.check_count + 1 >= 5 ? "Failed" : "Pending",
        rejected_reasons: [
          ...transaction.rejected_reasons,
          "Request failed (response doesn't include data).",
        ],
      };
    }

    if (!myTransaction) {
      // checks if undefined
      return {
        check_count: transaction.check_count + 1,
        status: "Failed",
        rejected_reasons: [
          ...transaction.rejected_reasons,
          "Couldn't find a matching hash.",
        ],
      };
    }

    if (
      myTransaction.ret ? myTransaction.ret[0].contractRet !== "SUCCESS" : false
    )
      return {
        check_count: transaction.check_count + 1,
        status: "Failed",
        rejected_reasons: [
          ...transaction.rejected_reasons,
          "Contract return is not success.",
        ],
      };

    const assertAmount =
      parseInt(transaction.amount_network) * Math.pow(10, 6) <=
      valueParameter.amount;

    const assertAddresses =
      ((valueParameter.owner_address ===
        decodeBase58ToHexAndSlice8(transaction.from)) |
        (valueParameter.owner_address === transaction.from)) &
      ((valueParameter.to_address ===
        decodeBase58ToHexAndSlice8(transaction.to)) |
        (valueParameter.to_address === transaction.to));

    if (assertAmount && assertAddresses) {
      return {
        status: "Success",
      };
    }

    return {
      check_count: transaction.check_count + 1,
      status: transaction.check_count + 1 >= 5 ? "Failed" : "Pending",
      rejected_reasons: [
        ...transaction.rejected_reasons,
        `Couldn't complete the validation.`,
      ],
    };
  } catch (e) {
    return {
      check_count: transaction.check_count + 1,
      status: transaction.check_count + 1 >= 5 ? "Failed" : "Pending",
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
    }).limit(5);

    if (invalidatedTransactions.length === 0) {
      return console.log("No invalidated TRX transactions were found.");
    }

    console.log(
      `Validating ${invalidatedTransactions.length} TRX transactions...`
    );

    invalidatedTransactions.forEach(async (invalidatedTransaction) => {
      console.log("Validating: (hash)", invalidatedTransaction.hash);
      const validateDocument = await validateOneTransaction(
        invalidatedTransaction
      );

      const updatedDocument = await Transactions.findByIdAndUpdate(
        invalidatedTransaction._id,
        validateDocument,
        { new: true }
      );
    });
  } catch (e) {
    return console.error(`[checkPoolAndValidate] Error - ${e.message}`);
  }
};
