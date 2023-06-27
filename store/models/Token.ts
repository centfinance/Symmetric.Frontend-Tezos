import { Model } from "pinia-orm";

export class PoolToken extends Model {
  static fields() {
    return {
      id: this.attr(null),
      address: this.string(""),
      balance: this.number(0),
      name: this.string(""),
      symbol: this.string(""),
      decimals: this.attr(null),
      token_id: this.attr(0),
      FA2: this.boolean(false),
      userBalance: this.string("0"),
      icon: this.string(null),
    };
  }
}
