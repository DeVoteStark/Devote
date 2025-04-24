import { Abi, useContract, useSendTransaction } from "@starknet-react/core";
import { cairo, Contract, RpcProvider } from "starknet";
import { useWallet } from "./use-wallet";
const ethAddress =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

const abi: Abi = [
  {
    type: "function",
    name: "transfer",
    state_mutability: "external",
    inputs: [
      {
        name: "recipient",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "amount",
        type: "core::integer::u256",
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "balance_of",
    inputs: [
      {
        name: "account",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
    outputs: [
      {
        type: "core::integer::u256",
      },
    ],
    state_mutability: "view",
  },
];

export function useEth() {
  const { account } = useWallet();

  const provider = new RpcProvider({
    nodeUrl:
      "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/IQNV8HbIxfgGVkxJZyazEK38KIgLQCIn",
  });

  const createContract = () => {
    const contract = new Contract(abi, ethAddress, provider);
    return contract;
  };

  const sendEth = async (receiveWallet: string) => {
    if (!account) {
      throw new Error("Account not connected");
    }
    const contract = createContract();
    contract.connect(account);
    const sendETHCall = contract.populate("transfer", {
      recipient: receiveWallet,
      amount: cairo.uint256(35000000000000),
    });
    const res = await contract.transfer(sendETHCall.calldata);
    console.log("res", res);
    console.log("Transaction hash", res.transaction_hash);
    const result = await provider.waitForTransaction(res.transaction_hash);
    return result;
  };

  const getEthBalance = async () => {
    if (!account) {
      throw new Error("Account not connected");
    }
    const contract = createContract();
    contract.connect(account);
    console.log("Account", account.address);
    const balance = await contract.balance_of(account.address);
    return balance;
  };

  return { sendEth, getEthBalance };
}
