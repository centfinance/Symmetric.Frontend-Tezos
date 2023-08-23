import { OpKind, TezosToolkit, WalletParamsWithKind } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";
import config from "~/config/config";
import { tas } from "~/utils/types/type-aliases";
import { VaultWalletType } from "~/utils/types/vault.types";

export const createJoinRequest = async (
  tezos: TezosToolkit,
  pool: { address: string; id: any },
  tokens: {
    address: string;
    id: number | null;
    decimals: number;
    index: number;
  }[],
  amountsIn: { index: number; value: BigNumber }[],
  slippage: number = 0.005,
  init: boolean = false,
  receiver?: string
) => {
  console.log(tokens);
  // Get tokens and order by index
  const user = await tezos.wallet.pkh();

  if (pool) {
    const sender = tas.address(user);
    const recipient = receiver ? tas.address(receiver) : tas.address(user);
    const assets = tas.map(
      tokens.map((token) => {
        return {
          key: tas.nat(token.index),
          value: {
            0: tas.address(token.address),
            1: token.id !== null ? tas.nat(token.id) : undefined,
          },
        };
      })
    );
    console.log(assets);
    const amounts = tas.map(
      amountsIn.map((amount) => {
        return {
          key: tas.nat(amount.index),
          value: tas.nat(amount.value.toString()),
        };
      })
    );

    const limits = tas.map(
      amountsIn.map((amount) => {
        return {
          key: tas.nat(amount.index),
          value: tas.nat(
            amount.value.plus(amount.value.multipliedBy(slippage))
          ),
        };
      })
    );

    const kind = init ? tas.nat(0) : tas.nat(1);

    const minSPTAmountOut = tas.nat(0);

    const vault = await tezos.wallet.at<VaultWalletType>(
      config.contracts.vault
    );

    const request = vault.methodsObject.joinPool({
      poolId: {
        0: tas.address(pool.address),
        1: tas.nat(pool.id),
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
  pool: { address: string; id: any },
  amountsIn: [number, BigNumber][],
  tokens: {
    address: string;
    id: number | null;
    decimals: number;
    index: number;
  }[],
  slippage: number = 0.5,
  init: boolean = false,
  receiver?: string
) => {
  const tezos = await dappClient().tezos();

  const amounts = amountsIn.map((a, i) => {
    const amount = {
      index: a[0],
      value: BigNumber(a[1].toFixed(18)).multipliedBy(10 ** tokens[i].decimals),
    };
    return amount;
  });

  const request = await createJoinRequest(
    tezos,
    pool,
    tokens,
    amounts,
    slippage,
    init,
    receiver
  );
  console.log(pool, tokens, amounts, slippage, init, receiver);
  const params = request?.toTransferParams();

  const wallet = await tezos.wallet.pkh();

  const operatorCalls = await fa2UpdateOperators(
    tezos,
    wallet,
    tokens[0].address,
    tokens.map((t) => (t.id ? t.id : 0)),
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
