import { Model } from "pinia-orm";

export class Wallet extends Model {
  static entity = "wallets";

  static fields() {
    return {
      id: this.attr(null),
      walletKey: this.string(null),
      lastConnected: this.number(0),
      slippage: this.attr("0.5"),
    };
  }

  declare id: string;
  declare walletKey?: string;
  declare lastConnected: number;
  declare slippage: string;
}
