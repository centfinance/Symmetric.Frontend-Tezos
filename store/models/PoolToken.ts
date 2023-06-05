import { Model } from "pinia-orm";

export class PoolToken extends Model {
  static entity = "pool_tokens";

  static fields() {
    return {
      id: this.attr(null),
      address: this.string(""),
      balance: this.number(0),
      index: this.number(null),
      name: this.string(""),
      symbol: this.string(""),
      decimals: this.attr(null),
      token_id: this.attr(0),
      weight: this.number(0),
      pool_id: this.string(""),
      pool_token_id: this.number(0),
    };
  }

  declare id: string;
  declare address: string;
  declare balance: number;
  declare index: number;
  declare name: string;
  declare symbol: string;
  declare decimals: number;
  declare token_id: string;
  declare pool_id: string;
  declare pool_token_id: number;
}
