import { TezosToolkit } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";
import { tas } from "~/utils/types/type-aliases";
import { VaultContractType } from "~/utils/types/vault.types";
import { Storage } from "~/utils/types/weighted-pool.types";
import { Pool } from "~/store/models/Pool";
import { PoolToken } from "~/store/models/PoolToken";

export const createExitRequest = async (
  tezos: TezosToolkit,
  pool: Pool,
  sptAmount: BigNumber,
  amountsOut: { index: number; amount: BigNumber }[],
  slippage: number = 0.5,
  receiver?: string
) => {
  // Grt pool ID
  const poolContract = await tezos.contract.at(pool.address);
  const storage = (await poolContract.storage()) as Storage;
  const pool_id = storage.poolId?.Some[1] as BigNumber;
  // Get tokens and order by index

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

    const limits = tas.map(
      amountsOut.map((amount) => {
        return {
          key: tas.nat(amount.index),
          // TODO: Change to minus slippage when contract is fixed
          value: tas.nat(
            amount.amount.plus(amount.amount.multipliedBy(slippage))
          ),
        };
      })
    );

    const kind = "EXACT_TOKENS_IN_FOR_SPT_OUT";

    const vault = await tezos.contract.at<VaultContractType>(
      "KT1N5qYdthynXLfGbteRVHgKy4m6q2NGjt57"
    );

    const request = vault.methodsObject.exitPool({
      poolId: {
        0: tas.address(pool.address),
        1: tas.nat(pool_id),
      },
      recipient,
      sender,
      request: {
        assets,
        limits,
        userData: {
          sptAmountIn: tas.nat(sptAmount),
          kind,
          recoveryModeExit: false,
        },
      },
    });
    return request;
  }
};

export const useExitPool = async (
  tezos: TezosToolkit,
  poolAddress: string,
  amountsIn: [number, bigint][],
  slippage: number = 0.5,
  receiver?: string
) => {};
