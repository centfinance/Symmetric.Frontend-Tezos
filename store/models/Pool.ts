import { Model } from "pinia-orm";

import { PoolToken } from "./PoolToken";

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
      swap_fee: this.number(0),
      total_swap_volume: this.number(0),
      total_swap_fee: this.number(0),
      total_liquidity: this.number(0),
      pool_tokens: this.hasMany(PoolToken, "pool_id"),
    };
  }
  declare pool_tokens: PoolToken[];

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
}
