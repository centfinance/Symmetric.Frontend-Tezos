import { TezosToolkit } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";
import { tas } from "~/utils/types/type-aliases";
import { VaultContractType, VaultWalletType } from "~/utils/types/vault.types";
import { Storage } from "~/utils/types/weighted-pool.types";
import { Pool } from "~/store/models/Pool";
import { PoolToken } from "~/store/models/PoolToken";

export const createJoinRequest = async (
  tezos: TezosToolkit,
  poolAddress: string,
  amountsIn: [number, BigNumber][],
  slippage: number = 0.5,
  init: boolean = false,
  receiver?: string
) => {
  // Get tokens and order by index
  const pool = useRepo(Pool).with("pool_tokens").find(poolAddress);

  const user = await tezos.wallet.pkh();

  if (pool) {
    const sender = tas.address(user);
    const recipient = receiver ? tas.address(receiver) : tas.address(user);

    const assets = tas.map(
      pool.pool_tokens.map((token: PoolToken) => {
        return {
          key: tas.nat(token.index),
          value: {
            0: tas.address(token.address),
            1: tas.nat(token.pool_token_id),
          },
        };
      })
    );

    const amounts = tas.map(
      amountsIn.map((amount) => {
        return {
          key: tas.nat(amount[0]),
          value: tas.nat(amount[1].toString()),
        };
      })
    );

    const limits = tas.map(
      amountsIn.map((amount) => {
        return {
          key: tas.nat(amount[0]),
          value: tas.nat(amount[1].plus(amount[1].multipliedBy(slippage))),
        };
      })
    );

    const kind = init ? "INIT" : "EXACT_TOKENS_IN_FOR_SPT_OUT";

    const minSPTAmountOut = tas.nat(0);

    const vault = await tezos.wallet.at<VaultWalletType>(
      "KT1MokJei8PpsdFCgvTPnC8zDWkpiryYNvsK"
    );

    const request = vault.methodsObject.joinPool({
      poolId: {
        0: tas.address(poolAddress),
        1: tas.nat(pool.poolId),
      },
      recipient,
      request: {
        assets,
        limits,
        userData: {
          allT: undefined,
          amountsIn: amounts,
          kind,
          minSPTAmountOut,
          sptAmountOut: undefined,
          tokenIndex: undefined,
        },
      },
      sender,
    });
    return request;
  }
};

export const useJoinPool = async (
  tezos: TezosToolkit,
  poolAddress: string,
  amountsIn: [number, bigint][],
  slippage: number = 0.5,
  receiver?: string
) => {};
