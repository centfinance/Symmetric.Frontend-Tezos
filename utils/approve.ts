import { checkAddress } from "./tz.js";
import { TezosOperationType } from "@airgap/beacon-sdk";
import { OpKind, WalletParamsWithKind } from "@taquito/taquito";

const approveEntrypoint = "approve";
const updateOperatorsEntrypoint = "update_operators";

import { TezosToolkit } from "@taquito/taquito";
import { tas } from "./types/type-aliases.js";

// async function checkAllowanceOrOperator(
//   tezos: TezosToolkit,
//   contractAddress: string,
//   ownerAddress: string,
//   spenderAddress: string,
//   tokenId?: number,
//   tokenType?: "FA1.2" | "FA2"
// ): Promise<string> {
//   try {
//     const contract = await tezos.contract.at(contractAddress);
//     const token = contract.views;

//     if (tokenType === "FA1.2") {
//       const allowance = await token.allowances.get({
//         owner: ownerAddress,
//         spender: spenderAddress,
//       });
//       return allowance.toString();
//     } else if (tokenType === "FA2") {
//       if (tokenId === undefined) {
//         return "tokenId is required for FA2 tokens.";
//       }

//       const isOperator = await token.isOperator({
//         owner: ownerAddress,
//         operator: spenderAddress,
//         token_id: tokenId,
//       });
//       return isOperator
//         ? "The address is an operator."
//         : "The address is not an operator.";
//     } else {
//       return "Unsupported token standard.";
//     }
//   } catch (error) {
//     console.error("An error occurred:", error);
//     return "An error occurred.";
//   }
// }

export function approveData(tokenApprovals: any[], spender: string) {
  if (!checkAddress(spender)) {
    throw new Error(`invalid spender address: ${spender}`);
  }

  let result = {
    fa1: {
      approves: [] as any[],
      revokes: [] as any[],
    },
    fa2: {
      approves: [] as any[],
      revokes: [] as any[],
    },
  };
  tokenApprovals.forEach((item: any) => {
    if (!checkAddress(item.value.tokenContract)) {
      throw new Error(
        `invalid token contract address: ${item.value.tokenContract}`
      );
    }

    if (item.type == 1) {
      let body = processFa1(item.value, spender);
      result.fa1.approves.push(body[0]);
      result.fa1.revokes.push(body[1]);
    } else if (item.type == 2) {
      let body = processFa2(item.value, spender);
      result.fa2.approves.push(body[0]);
      result.fa2.revokes.push(body[1]);
    }
  });

  return result;
}

function processFa1(
  item: { allowance: any; tokenContract: any },
  spender: any
) {
  if (!item.allowance && typeof item.allowance !== "number") {
    throw new Error(`invalid allowance value: ${item.allowance}`);
  }

  return [
    {
      kind: TezosOperationType.TRANSACTION,
      destination: item.tokenContract,
      amount: "0",
      parameters: {
        entrypoint: approveEntrypoint,
        value: JSON.parse(
          `{"prim":"Pair","args":[{"string":"${spender}"},{"int":"${item.allowance}"}]}`
        ),
      },
    },
    {
      kind: TezosOperationType.TRANSACTION,
      to: item.tokenContract,
      amount: "0",
      parameters: {
        entrypoint: approveEntrypoint,
        value: JSON.parse(
          `{"prim":"Pair","args":[{"string":"${spender}"},{"int":"0"}]}`
        ),
      },
    },
  ];
}

function processFa2(
  item: { tokenId: any; tokenContract: any; owner: any },
  spender: any
) {
  if (!item.tokenId && typeof item.tokenId !== "number") {
    throw new Error(`invalid tokenId value: ${item.tokenId}`);
  }
  console.log(item, spender);

  return [
    {
      kind: OpKind.TRANSACTION,
      to: item.tokenContract,
      amount: "0",
      parameters: {
        entrypoint: updateOperatorsEntrypoint,
        value: JSON.parse(
          `[{"prim":"Left","args":[{"prim":"Pair","args":[{"string":"${item.owner}"},{"prim":"Pair","args":[{"string":"${spender}"},{"int":"${item.tokenId}"}]}]}]}]`
        ),
      },
    },
    {
      kind: OpKind.TRANSACTION,
      to: item.tokenContract,
      amount: "0",
      parameters: {
        entrypoint: updateOperatorsEntrypoint,
        value: JSON.parse(
          `[{"prim":"Right","args":[{"prim":"Pair","args":[{"string":"${item.owner}"},{"prim":"Pair","args":[{"string":"${spender}"},{"int":"${item.tokenId}"}]}]}]}]`
        ),
      },
    },
  ];
}

export async function fa2UpdateOperators(
  tezos: TezosToolkit,
  owner: string,
  tokenContract: string,
  tokenIds: number[],
  spender: string
) {
  const contract = await tezos.wallet.at(tokenContract);
  console.log(tokenIds);
  const approveRequests = tokenIds.map((id) => {
    return {
      kind: OpKind.TRANSACTION,
      ...contract.methods
        .update_operators([
          {
            add_operator: {
              owner: tas.address(owner),
              operator: tas.address(spender),
              token_id: tas.nat(id),
            },
          },
        ])
        .toTransferParams(),
    } as WalletParamsWithKind;
  });

  const revokeRequests = tokenIds.map((id) => {
    return {
      kind: OpKind.TRANSACTION,
      ...contract.methods
        .update_operators([
          {
            remove_operator: {
              owner: tas.address(owner),
              operator: tas.address(spender),
              token_id: tas.nat(id),
            },
          },
        ])
        .toTransferParams(),
    } as WalletParamsWithKind;
  });

  return {
    approveRequests,
    revokeRequests,
  };
}
