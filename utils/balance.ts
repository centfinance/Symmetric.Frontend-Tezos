import axios from "axios";
import { BigNumber } from "bignumber.js";
import { getRpcNode, publicTzktNode } from "./walletconnect";

export interface IBalanceResponse {
  success: boolean;
  balance: BigNumber;
  identifier: string;
  error?: any;
}

export const getTzktTokenData = async (
  filters: string | undefined
): Promise<any> => {
  try {
    const tokenResponse = await axios.get(
      `${publicTzktNode}v1/tokens${filters ? filters : ""}`
    );
    return tokenResponse;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Returns the balance of the token held by the user in their wallet using tzkt api.
 * This function can be used for tokens that are present in config (mapId known),
 * as well as those not present and searched from chain.
 * @param tokenContract - Contract address of the token
 * @param tokenId - Token id of the token (undefined for FA1.2 tokens)
 * @param tokenStandard - Standard of token whether FA1.2 or FA2
 * @param userTezosAddress - Tezos wallet address of the user
 * @param tokenSymbol - Symbol of the token (optional)
 */
export const getBalanceFromTzkt = async (
  tokens: any[],
  userTezosAddress: string
): Promise<any> => {
  try {
    // if (
    //   !tokenContract ||
    //   tokenContract === "" ||
    //   !FA2 ||
    //   !userTezosAddress ||
    //   userTezosAddress === ""
    // ) {
    //   throw new Error("Invalid or empty parameters");
    // }

    const balanceResponse = await getTzktTokenData(
      `/balances?account=${userTezosAddress}&token.contract.in=${tokens
        .map((t) => t.contract)
        .toString()}&token.tokenId.in=${tokens
        .map((t) => t.tokemId)
        .toString()}`
    );

    const balanceData = balanceResponse.data;
    if (balanceData.length <= 0) {
      return {
        success: true,
        balances: [0],
      };
    }

    const balances: any = {};
    balanceData.forEach(
      (b: any) =>
        (balances[`${b.token.contract.address}${b.token.tokenId}`] = BigNumber(
          b.balance
        ))
    );

    return {
      success: true,
      balances: balances,
    };
    // const tokenDataFromConfig = getTokenDataByAddress(tokenContract, tokenId);

    // // First check if token metadata exists for the token in the response.
    // if (
    //   balanceData[0].token.metadata &&
    //   balanceData[0].token.metadata.decimals
    // ) {
    //   symbol = tokenSymbol || balanceData[0].token.metadata.symbol;
    //   const tokenDecimals = new BigNumber(
    //     balanceData[0].token.metadata.decimals
    //   );
    //   const decimalMultiplier = new BigNumber(10).pow(tokenDecimals);
    //   userBalance = new BigNumber(balanceData[0].balance || 0).dividedBy(
    //     decimalMultiplier
    //   );
    // } else {
    //   // Check if token data exists in local config if not found in tzkt response.
    //   if (tokenDataFromConfig) {
    //     symbol = tokenSymbol || tokenDataFromConfig.symbol;
    //     const tokenDecimals = new BigNumber(tokenDataFromConfig.decimals);
    //     const decimalMultiplier = new BigNumber(10).pow(tokenDecimals);
    //     userBalance = new BigNumber(balanceData[0].balance || 0).dividedBy(
    //       decimalMultiplier
    //     );
    //   } else {
    //     throw new Error("Decimals not found for the selected token.");
    //   }
    // }

    // return {
    //   success: true,
    //   identifier: symbol,
    //   balance: userBalance,
    // };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      balances: [new BigNumber(0)],
      error: error.message,
    };
  }
};
