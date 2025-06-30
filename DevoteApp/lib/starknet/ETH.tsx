import { Abi } from "@starknet-react/core";
import { Contract, RpcProvider } from "starknet";

export const ethAddress =
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

export const abi: Abi = [
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

export const provider = new RpcProvider({
    nodeUrl:
        "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/IQNV8HbIxfgGVkxJZyazEK38KIgLQCIn",
});

export const createContract = () => {
    const contract = new Contract(abi, ethAddress, provider);
    return contract;
};

export const getEthBalance = async (contract: Contract) => {
    const balance = await contract.balance_of(ethAddress);
    return balance;
};

