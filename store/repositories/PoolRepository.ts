import { Repository } from "pinia-orm";
import { graphql } from "~/gql";
import config from "~/config/config";
import { Pool } from "../models/Pool";
import { PoolToken } from "../models/PoolToken";
import { GetPoolQuery } from "~/gql/graphql";
import { Wallet } from "../models/Wallet";
import { TokenRepository } from "./TokenRepository";

export class PoolRepository extends Repository {
  use = Pool;

  store(queryResult: GetPoolQuery) {
    const poolTokens: unknown[] = [];
    const pools = queryResult.indexer_pool.map((pool) => {
      console.log(pool);
      const p = {
        id: pool.id,
        swaps_count: pool.swaps_count,
        address: pool.address,
        poolId: pool.index,
        factory: pool.factory,
        owner: pool.owner,
        create_time: pool.create_time,
        name: pool.name,
        symbol: pool.symbol,
        pool_type: pool.pool_type,
        swap_fee: pool.swap_fee,
        tokens_list: pool.tokens_list,
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
          icon: `./icons/${token.symbol?.toUpperCase()}.png`,
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
      .has("pool_tokens", 2)
      .with("pool_tokens")
      .where("factory", config.contracts.factory)
      .get();

    return pools.map((pool) => {
      return {
        composition: pool.pool_tokens.map((token: PoolToken) => {
          return {
            symbol: token.symbol,
            weight: `${token.weight / (10 * 10 ** 15)}%`,
          };
        }),
        swap_fee: pool.swap_fee * 100,
        total_liquidity: pool.totalLiquidity(),
        total_swap_volume: pool.total_swap_volume,
        address: pool.address,
        icons: pool.pool_tokens.map((t) => t.icon),
      };
    });
  }

  tvl() {
    let USDollar = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    const pools = this.repo(Pool)
      .has("pool_tokens", 2)
      .where("factory", config.contracts.factory)
      .with("pool_tokens")
      .get();

    const tvl = pools.reduce(
      (accumulator, pool) => accumulator + pool.totalLiquidity(),
      0
    );

    return USDollar.format(tvl);
  }

  async fetchPoolData() {
    const poolsListQuery = graphql(`
      query GetPool {
        indexer_pool(order_by: { total_liquidity: desc }) {
          holders_count
          swaps_count
          swap_enabled
          address
          index
          factory
          id
          owner
          create_time
          swap_fee
          total_liquidity
          total_shares
          total_swap_fee
          total_swap_volume
          name
          pool_type
          symbol
          tokens_list
          pool_tokens {
            address
            balance
            index
            decimals
            name
            symbol
            token_id
            weight
            id
            pool_id
            pool_token_id
            token {
              fa2
            }
          }
        }
      }
    `);

    const { pending, data, error } = await useAsyncQuery(poolsListQuery);

    if (data.value && data.value.indexer_pool) {
      this.store(data.value);
    }

    const wallet = this.repo(Wallet).where("active", true).first();
    if (wallet) {
      await this.repo(TokenRepository).fetchUserBalances(wallet.id);
    }
  }

  async updateUserBalances(pool: Pool, user: string) {
    const balances = await pool.getUserBalances(user);
    this.repo(PoolToken).save(balances);
  }

  async updateUserLPBalance(pool: Pool, user: string) {
    const balance = await pool.getUserLPBalance(user);
    this.save({
      id: pool.id,
      userLPBalance: balance,
    });
  }

  async updatePoolShares(pool: Pool) {
    const shares = await pool.getPoolShares();
    this.save({
      id: pool.id,
      pool_shares: shares,
    });
  }
}
