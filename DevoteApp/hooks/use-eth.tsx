import { Abi } from "@starknet-react/core";
import { cairo, Contract, RpcProvider } from "starknet";
import { useWallet } from "./use-wallet";
import { createContract, provider } from "@/lib/starknet/ETH";


export function useEth() {
  const { account } = useWallet();

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
