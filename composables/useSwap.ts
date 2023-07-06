import { TezosToolkit } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";
import { Pool } from "~/store/models/Pool";
import { tas } from "~/utils/types/type-aliases";
import { VaultContractType } from "~/utils/types/vault.types";
import { Storage } from "~/utils/types/weighted-pool.types";

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}

export const createSwapRequest = async (
  tezos: TezosToolkit,
  pool: Pool,
  tokenIn: { address: string; id: number },
  tokenOut: { address: string; id: number },
  amount: BigNumber,
  user: string,
  slippage: string = "0.5",
  receiver?: string
) => {
  // const poolContract = await tezos.contract.at(pool.address);
  // const storage = (await poolContract.storage()) as Storage;
  // const pool_id = storage.poolId?.Some[1] as BigNumber;

  // const user = await tezos.wallet.pkh();

  const sender = tas.address(user);

  const singleSwap = {
    amount: tas.nat(amount),
    assetIn: {
      0: tas.address(tokenIn.address),
      1: tas.nat(tokenIn.id),
    },
    assetOut: {
      0: tas.address(tokenOut.address),
      1: tas.nat(tokenOut.id),
    },
    kind: "GIVEN_IN",
    poolId: {
      0: tas.address(pool.address),
      1: tas.nat(pool.poolId),
    },
  };

  const vault = await tezos.contract.at("KT1N5qYdthynXLfGbteRVHgKy4m6q2NGjt57");
  console.log(vault);
  const swapRequest = vault.methods.swap(
    tas.timestamp(addMinutes(new Date(), 30).toISOString()),
    tas.address(sender),
    tas.address(receiver ? receiver : sender),
    //TODO: Add Slippage
    tas.nat(0),
    singleSwap.amount,
    singleSwap.assetIn[0],
    singleSwap.assetIn[1],
    singleSwap.assetOut[0],
    singleSwap.assetOut[1],
    singleSwap.kind,
    singleSwap.poolId[0],
    singleSwap.poolId[1]
  );

  return swapRequest;
};
