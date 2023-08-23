import { TezosToolkit } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";
import config from "~/config/config";
import { tas } from "~/utils/types/type-aliases";
import { VaultWalletType } from "~/utils/types/vault.types";
import { Storage } from "~/utils/types/weighted-pool.types";
import { Pool } from "~/store/models/Pool";
import { PoolToken } from "~/store/models/PoolToken";

export const createExitRequest = async (
  tezos: TezosToolkit,
  pool: Pool,
  sptAmount: BigNumber,
  amountsOut: { index: number; amount: BigNumber }[],
  slippage: string = "0.5",
  receiver?: string
) => {
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
          value: tas.nat(
            amount.amount
              .minus(amount.amount.multipliedBy(Number(slippage) / 100))
              .toFixed(0)
          ),
        };
      })
    );

    const kind = tas.nat(5);

    const vault = await tezos.wallet.at<VaultWalletType>(
      config.contracts.vault
    );

    const request = vault.methodsObject.exitPool({
      poolId: {
        0: tas.address(pool.address),
        1: tas.nat(pool.poolId),
      },
      recipient,
      sender,
      request: {
        assets,
        limits,
        userData: {
          amountsOut: undefined,
          maxSPTAmountIn: undefined,
          sptAmountIn: tas.nat(sptAmount),
          tokenIndex: undefined,
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
