import { Model } from "pinia-orm";

export class Token extends Model {
  static entity = "tokens";

  static fields() {
    return {
      id: this.attr(null),
      total_swap_count: this.number(0),
      fa2: this.boolean(true),
      address: this.string(""),
      name: this.string(""),
      symbol: this.string(""),
      decimals: this.number(18),
      token_id: this.number(0),
      total_balance_notional: this.number(0),
      total_balance_usd: this.number(0),
      total_volume_notional: this.number(0),
      total_volume_usd: this.number(0),
      userBalance: this.string("0"),
      icon: this.string(null),
    };
  }

  static piniaOptions = {
    persist: persistedState.localStorage,
  };
}
