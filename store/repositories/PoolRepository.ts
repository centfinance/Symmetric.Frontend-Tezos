import { Repository } from "pinia-orm";
import { Pool } from "../models/Pool";
import { PoolToken } from "../models/PoolToken";
import { GetPoolQuery } from "~/gql/graphql";

export class PoolRepository extends Repository {
  use = Pool;

  store(queryResult: GetPoolQuery) {
    const poolTokens: unknown[] = [];
    const pools = queryResult.indexer_pool.map((pool) => {
      const p = {
        id: pool.id,
        swaps_count: pool.swaps_count,
        address: pool.address,
        factory: pool.factory,
        owner: pool.owner,
        create_time: pool.create_time,
        name: pool.name,
        symbol: pool.symbol,
        pool_type: pool.pool_type,
        swapFee: pool.swap_fee,
        total_swap_volume: pool.total_swap_volume,
        total_swap_fee: pool.total_swap_fee,
        total_liquidity: pool.total_liquidity,
      };
      const tokens = pool.pool_tokens.map((token) => {
        return {
          id: token.id,
          address: token.address,
          balance: token.balance,
          index: token.index,
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals,
          token_id: token.token_id,
          weight: token.weight,
          pool_id: token.pool_id,
          pool_token_id: token.pool_token_id,
          FA2: token.token ? token.token.fa2 : false,
        };
      });
      poolTokens.push(...tokens);
      return p;
    });

    this.save(pools);
    this.repo(PoolToken).save(poolTokens);
  }

  getPoolList() {
    const pools = this.repo(Pool)
      .has("pool_tokens", 1)
      .with("pool_tokens")
      .get();

    return pools.map((pool) => {
      return {
        composition: pool.pool_tokens.map((token: PoolToken) => {
          return {
            symbol: token.symbol,
            weight: `${token.weight / (10 * 10 ** 15)}%`,
          };
        }),
        total_liquidity: pool.total_liquidity,
        total_swap_volume: pool.total_swap_volume,
        address: pool.address,
      };
    });
  }

  async updateUserBalances(pool: Pool, user: string) {
    const balances = await pool.getUserBalances(user);
    console.log(balances);
    this.repo(PoolToken).save(balances);
  }
}
