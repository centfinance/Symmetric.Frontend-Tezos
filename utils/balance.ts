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
    const balanceResponse = await getTzktTokenData(
      `/balances?account=${userTezosAddress}&token.contract.in=${tokens
        .map((t) => t.contract)
        .toString()}&token.tokenId.in=${tokens
        .map((t) => t.tokenId)
        .toString()}`
    );

    const balanceData = balanceResponse.data;
    if (balanceData.length <= 0) {
      return {
        success: false,
        balances: [0],
      };
    }

    const balances = balanceData.map((b: any) => {
      const id = tokens.find(
        (t) =>
          t.contract == b.token.contract.address &&
          t.tokenId === Number(b.token.tokenId)
      ).id;

      if (id) {
        return {
          id: id as string,
          icon: (b.token.metadata.thumbnailUri as string) || null,
          userBalance: b.balance as string,
        };
      }
    });

    return {
      success: true,
      balances: balances,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      balances: [new BigNumber(0)],
      error: error.message,
    };
  }
};
