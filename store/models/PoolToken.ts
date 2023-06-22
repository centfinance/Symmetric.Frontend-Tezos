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

  static piniaOptions = {
    persist: persistedState.localStorage,
  };

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

  static formatPrice(price: string): string {
    return numbro(price).formatCurrency({ mantissa: 2 });
  }

  isStable(): boolean {
    //TODO: Put in config
    const stables = [
      { address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3".toUpperCase(), id: 7 },
      { address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3".toUpperCase(), id: 5 },
    ];
    return stables.some((s) => {
      return (
        JSON.stringify({
          address: this.address.toUpperCase(),
          id: this.pool_token_id,
        }) === JSON.stringify(s)
      );
    });
  }
}
