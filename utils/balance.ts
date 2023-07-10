import axios from "axios";
import { TezosToolkit } from "@taquito/taquito";
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
        .map((t) => t.address)
        .toString()}&token.tokenId.in=${tokens
        .map((t) => t.token_id)
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
          t.address == b.token.contract.address &&
          t.token_id === Number(b.token.tokenId)
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

export const getLPBalance = async (
  pool: string,
  user: string
): Promise<{ success: boolean; balance: BigNumber }> => {
  try {
    const Tezos = new TezosToolkit(getRpcNode());

    const contract = await Tezos.contract.at(pool);

    const result = await contract.contractViews
      .getBalance(user)
      .executeView({ viewCaller: user });

    return {
      success: true,
      balance: result,
    };
  } catch (error: any) {
    console.log(`Error: ${JSON.stringify(error, null, 2)}`);
    return {
      success: false,
      balance: BigNumber(0),
    };
  }
};

export const getPoolShares = async (pool: string) => {
  try {
    const Tezos = new TezosToolkit(getRpcNode());

    const contract = await Tezos.contract.at(pool);

    const result = await contract.contractViews
      .getTotalSupply()
      .executeView({ viewCaller: "KT1N5qYdthynXLfGbteRVHgKy4m6q2NGjt57" });

    return {
      success: true,
      shares: result,
    };
  } catch (error: any) {
    console.log(`Error: ${JSON.stringify(error, null, 2)}`);
    return {
      success: false,
      shares: BigNumber(0),
    };
  }
};

export const computeProportionalAmountsIn = (
  amountIn: BigNumber,
  amountIndex: number,
  balances: { balance: BigNumber; index: number }[]
) => {
  const totalBalance = balances.find((b) => b.index == amountIndex)!.balance;
  const tokenRatio = amountIn
    .multipliedBy(10 ** 18)
    .plus(totalBalance)
    .minus(1)
    .dividedBy(totalBalance);

  const amountsIn = balances.map((b) => {
    return {
      amount: b.balance
        .multipliedBy(tokenRatio)
        .minus(1)
        .dividedBy(10 ** 18)
        .plus(1),
      index: b.index,
    };
  });

  return amountsIn;
};

export const computeProportionalAmountsOut = (
  sptAmountIn: BigNumber,
  sptTotalSupply: BigNumber,
  balances: { balance: BigNumber; index: number }[]
) => {
  const sptRatio = sptAmountIn.multipliedBy(10 ** 18).dividedBy(sptTotalSupply);

  const amountsOut = balances.map((b) => {
    return {
      amount: b.balance.multipliedBy(sptRatio).dividedBy(10 ** 18),
      index: b.index,
    };
  });

  return amountsOut;
};
