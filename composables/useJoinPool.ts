import { TezosToolkit } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";
import { tas } from "~/utils/types/type-aliases";
import { VaultContractType } from "~/utils/types/vault.types";
import { Storage } from "~/utils/types/weighted-pool.types";
import { Pool } from "~/store/models/Pool";
import { PoolToken } from "~/store/models/PoolToken";
import { PoolRepository } from "~/store/repositories/PoolRepository";

export const createJoinRequest = async (
  tezos: TezosToolkit,
  poolAddress: string,
  amountsIn: [number, BigNumber][],
  slippage: number = 0.5,
  init: boolean = false,
  receiver?: string
) => {
  // Grt pool ID
  const poolContract = await tezos.contract.at(poolAddress);
  const storage = (await poolContract.storage()) as Storage;
  const pool_id = storage.poolId?.Some[1] as BigNumber;
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

    const vault = await tezos.contract.at<VaultContractType>(
      "KT1N5qYdthynXLfGbteRVHgKy4m6q2NGjt57"
    );

    const request = vault.methodsObject.joinPool({
      poolId: {
        0: tas.address(poolAddress),
        1: tas.nat(pool_id),
      },
      recipient,
      sender,
      request: {
        assets,
        limits,
        userData: {
          amountsIn: amounts,
          kind,
          minSPTAmountOut,
        },
      },
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
