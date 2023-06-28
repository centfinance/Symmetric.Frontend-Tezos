import { Model } from "pinia-orm";

import { PoolToken } from "./PoolToken";
import numbro from "numbro";
import { BigNumber } from "bignumber.js";
import { TezosToolkit } from "@taquito/taquito";

export class Pool extends Model {
  static entity = "pools";

  static fields() {
    return {
      id: this.attr(null),
      swaps_count: this.number(0),
      address: this.string(""),
      factory: this.string(""),
      poolId: this.number(null),
      owner: this.string(""),
      create_time: this.attr(null),
      name: this.string(""),
      symbol: this.string(""),
      pool_type: this.string(""),
      pool_shares: this.string("0"),
      swap_fee: this.number(0),
      total_swap_volume: this.number(0),
      total_swap_fee: this.number(0),
      total_liquidity: this.number(0),
      pool_tokens: this.hasMany(PoolToken, "pool_id"),
      userLPBalance: this.string(null),
    };
  }

  static piniaOptions = {
    persist: persistedState.localStorage,
  };

  declare pool_tokens: PoolToken[];
  declare address: string;
  declare poolId: number;

  async getPoolId(tezos: TezosToolkit) {
    const poolContract = await tezos.contract.at(this.address);
    const storage = (await poolContract.storage()) as Storage;
    const pool_id = storage.poolId?.Some[1] as BigNumber;
    console.log(pool_id);
    useRepo(Pool).save({ id: this.id, poolId: pool_id.toNumber() });
  }

  async getUserBalances(user: string) {
    const tokens = this.pool_tokens.map((t) => {
      return {
        contract: t.address,
        tokenId: t.pool_token_id,
        id: t.id,
      };
    });

    const balances = await getBalanceFromTzkt(tokens, user);

    if (balances.success) {
      return balances.balances;
    }

    return null;
  }

  async getUserLPBalance(user: string) {
    const result = await getLPBalance(this.address, user);
    if (result.success) {
      return result.balance.toString();
    }
    return null;
  }

  async getPoolShares() {
    const result = await getPoolShares(this.address);
    if (result.success) {
      return result.shares.toString();
    }
    return null;
  }

  normalizedLPBalance(): string {
    return BigNumber(this.userLPBalance || 0)
      .dividedBy(10 ** 18)
      .toString();
  }

  formatLPBalance() {
    return numbro(this.normalizedLPBalance()).format({
      average: true,
      totalLength: 6,
    });
  }
}
