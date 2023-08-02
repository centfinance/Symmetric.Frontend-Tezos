import { Repository } from "pinia-orm";
import { Token } from "../models/Token";
import { graphql } from "~/gql";

export class TokenRepository extends Repository {
  use = Token;

  async fetch() {
    const tokensQuery = graphql(`
      query GetToken {
        indexer_token {
          total_swap_count
          fa2
          address
          id
          latest_price_id
          name
          pool_id
          symbol
          decimals
          latest_usd_price
          latest_usd_price_timestamp
          token_id
          total_balance_notional
          total_balance_usd
          total_volume_notional
          total_volume_usd
        }
      }
    `);
    const { pending, data, error } = await useAsyncQuery(tokensQuery);

    if (data.value && data.value.indexer_token) {
      const tokens = data.value.indexer_token.map((t) => {
        return {
          id: t.id,
          total_swap_count: t.total_swap_count,
          fa2: t.fa2,
          address: t.address,
          name: t.name,
          symbol: t.symbol,
          decimals: t.decimals,
          token_id: t.token_id,
          total_balance_notional: t.total_balance_notional,
          total_balance_usd: t.total_balance_usd,
          total_volume_notional: t.total_volume_notional,
          total_volume_usd: t.total_volume_usd,
          icon: `./icons/${t.symbol?.toUpperCase()}.png`,
        };
      });
      this.save(tokens);
    }
    console.log(data.value);
  }

  async fetchUserBalances(user: string) {
    const tokens = this.where("token_id", (id: any) => {
      return !isNaN(Number(id));
    }).get();

    const data = await getBalanceFromTzkt(tokens, user);
    this.save(data.balances);
  }
}
