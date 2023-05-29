import { Model } from "pinia-orm";

export class Pool extends Model {
  static entity = "pools";

  static fields() {
    return {
      id: this.attr(null),
      name: this.string(""),
      symbol: this.string(""),
      poolType: this.string(""),
      swapFee: this.number(0),
      tokensList: this.attr(null),
      totalSwapVolume: this.number(0),
      totalSwapFee: this.number(0),
      totalLiquidity: this.number(0),
    };
  }
}
