import { Model } from "pinia-orm";
import numbro from "numbro";
import { BigNumber } from "bignumber.js";

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
      FA2: this.boolean(false),
      userBalance: this.string("0"),
      icon: this.string(null),
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
  declare FA2: boolean;
  declare userBalance: string;
  declare icon: string;

  normalizedBalance(): string {
    return BigNumber(this.userBalance)
      .dividedBy(10 ** this.decimals)
      .toString();
  }

  formatBalance(): string {
    return numbro(this.normalizedBalance()).format({
      average: true,
      totalLength: 6,
    });
  }
}
