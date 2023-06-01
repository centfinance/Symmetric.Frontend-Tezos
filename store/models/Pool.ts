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
}
