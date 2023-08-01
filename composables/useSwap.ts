import { OpKind, TezosToolkit, WalletParamsWithKind } from "@taquito/taquito";
import { formatFixed, parseFixed } from "@ethersproject/bignumber";
import { BigNumber } from "bignumber.js";
import config from "~/config/config";
import { Pool } from "~/store/models/Pool";
import { tas } from "~/utils/types/type-aliases";
import { VaultContractType } from "~/utils/types/vault.types";
import { Storage } from "~/utils/types/weighted-pool.types";
import { Token } from "~/store/models/Token";
import { Wallet } from "~/store/models/Wallet";

function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * 60000);
}

export const calcSwapAmountOut = (
  amount: number,
  balance_in: number,
  balance_out: number,
  tokenIn: { decimals: number; weight: number },
  tokenOut: { decimals: number; weight: number },
  swapFee: number
): BigNumber => {
  const ONE = 1 * 10 ** 18;

  const Bi = parseFloat(
    formatFixed(
      BigNumber(balance_in).multipliedBy(ONE).toString(),
      tokenIn.decimals
    )
  );
  const Bo = parseFloat(
    formatFixed(
      BigNumber(balance_out).multipliedBy(ONE).toString(),
      tokenOut.decimals
    )
  );

  const wi = parseFloat(tokenIn.weight.toString());
  const wo = parseFloat(tokenOut.weight.toString());
  const Ai = Number(amount);
  const f = parseFloat(
    formatFixed(BigNumber(swapFee).multipliedBy(ONE).toString(), 18)
  );
  return bnum(Bo * (1 - (Bi / (Bi + Ai * (1 - f))) ** (wi / wo)));
  // return Bo.times(
  //     bnum(1).minus(
  //         bnum(
  //             Bi.div(
  //                 Bi.plus(Ai.times(bnum(1).minus(f)))
  //             ).toNumber() ** wi.div(wo).toNumber()
  //         )
  //     )
  // )
};

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

  const vault = await tezos.contract.at(config.contracts.vault);
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

export const useSwap = async (
  pool: Pool,
  tokenIn: { address: string; id: number; decimals: number },
  tokenOut: { address: string; id: number; decimals: number },
  amountIn: string
) => {
  const tezos = await dappClient().tezos();
  const wallet = useRepo(Wallet).all()[0];
  const request = await createSwapRequest(
    tezos,
    pool,
    tokenIn,
    tokenOut,
    BigNumber(BigNumber(amountIn).toFixed(18)).multipliedBy(10 ** 18),
    wallet!.id,
    wallet!.slippage
  );
  const params = request.toTransferParams();

  const operatorCalls = await fa2UpdateOperators(
    tezos,
    wallet!.id,
    pool.pool_tokens[0].address,
    [tokenIn.id],
    config.contracts.vault
  );

  const contractCall: WalletParamsWithKind = {
    kind: OpKind.TRANSACTION,
    ...params!,
  };
  const transactions = [];

  transactions.push(...operatorCalls.approveRequests);
  transactions.push(contractCall);
  transactions.push(...operatorCalls.revokeRequests);

  const batch = tezos.wallet.batch(transactions);
  const tx = await batch.send();
  return tx;
};
