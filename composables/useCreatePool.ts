import { OpKind, TezosToolkit, WalletParamsWithKind } from "@taquito/taquito";
import { char2Bytes } from "@taquito/utils";
import { BigNumber } from "bignumber.js";
import { error } from "console";
import { tas } from "~/utils/types/type-aliases";
import { WeightedPoolFactoryWalletType } from "~/utils/types/weighted-pool-factory.types";

export const createPoolRequest = async (
  tezos: TezosToolkit,
  tokens: {
    address: string;
    id: number | null;
    decimals: number;
    weight: BigNumber;
  }[],
  swapFee: BigNumber
) => {
  const factory = await tezos.wallet.at<WeightedPoolFactoryWalletType>(
    "KT1EkhhxLLiufUCytCUSrAuSA8fiPu4EX59t"
  );
  const request = factory.methodsObject.create({
    metadata: tas.bytes(char2Bytes("")),
    normalizedWeights: tas.map(
      tokens.map((t, i) => {
        return { key: tas.nat(i), value: tas.nat(t.weight) };
      })
    ),
    swapFeePercentage: tas.nat(swapFee),
    tokenDecimals: tas.map(
      tokens.map((t, i) => {
        return {
          key: tas.nat(i),
          value: tas.nat(t.decimals),
        };
      })
    ),
    token_metadata: tas.map({
      name: tas.bytes(char2Bytes("SYMM Liquidity Pool")),
      symbol: tas.bytes(char2Bytes("SLP")),
      decimals: tas.bytes(char2Bytes("18")),
      thumbnailUri: tas.bytes(
        char2Bytes(
          "https://assets.coingecko.com/coins/images/18525/small/SYMM-Coin-2.png?1632276841"
        )
      ),
    }),
    tokens: tas.map(
      tokens.map((t, i) => {
        return {
          key: tas.nat(i),
          value: {
            0: tas.address(t.address),
            1: t.id !== null ? tas.nat(t.id) : undefined,
          },
        };
      })
    ),
  });

  return request;
};

export const createInitPoolRequest = async (tezos: TezosToolkit) => {
  const factory = await tezos.wallet.at<WeightedPoolFactoryWalletType>(
    "KT1EkhhxLLiufUCytCUSrAuSA8fiPu4EX59t"
  );
  const request = factory.methodsObject.initialize();
  return request;
};

export const useCreatePool = async (
  tokens: {
    address: string;
    id: number | null;
    decimals: number;
  }[],
  weights: string[],
  swapFee: BigNumber
) => {
  try {
    const tezos = await dappClient().tezos();
    const t = tokens.map((t: any, i: number) => {
      return {
        address: t.address,
        id: t.id,
        decimals: t.decimals,
        weight: BigNumber(BigNumber(weights[i]).toFixed(18)).multipliedBy(
          10 ** 16
        ),
      };
    });
    const sf = BigNumber(BigNumber(swapFee).toFixed(18)).multipliedBy(10 ** 16);
    const createRequest = await createPoolRequest(tezos, t, sf);
    const initRequest = await createInitPoolRequest(tezos);

    const requests: WalletParamsWithKind[] = [
      {
        kind: OpKind.TRANSACTION,
        ...createRequest.toTransferParams(),
      },
      {
        kind: OpKind.TRANSACTION,
        ...initRequest.toTransferParams(),
      },
    ];

    const batch = tezos.wallet.batch(requests);
    return await batch.send();
  } catch (e: any) {
    console.error(error);
  }
};
