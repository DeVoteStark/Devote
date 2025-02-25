import {
  PersolRol,
  PersonProposalStruct,
  PersonPublic,
} from "@/interfaces/Person";
import { ProposalPublic, ProposalVoteTypeStruct } from "@/interfaces/Proposal";
import { Abi, useContract, nethermindProvider } from "@starknet-react/core";
import { Contract, RpcProvider, shortString } from "starknet";
import { useWallet } from "./use-wallet";
const contractAddress =
  "0x0378717a35a6d53da40a071d2854d33353b27a91cd54db87997dd660dc40a2bb";

const abi: Abi = [
  {
    type: "impl",
    name: "DeVoteImpl",
    interface_name: "devote::IDeVote",
  },
  {
    type: "struct",
    name: "devote::PersonProposalStruct",
    members: [
      {
        name: "proposal_id",
        type: "core::felt252",
      },
      {
        name: "role",
        type: "core::integer::u8",
      },
    ],
  },
  {
    type: "struct",
    name: "devote::PersonPublic",
    members: [
      {
        name: "wallet_id",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "id_number",
        type: "core::felt252",
      },
      {
        name: "role",
        type: "core::felt252",
      },
      {
        name: "proposals",
        type: "core::array::Array::<devote::PersonProposalStruct>",
      },
    ],
  },
  {
    type: "struct",
    name: "core::integer::u256",
    members: [
      {
        name: "low",
        type: "core::integer::u128",
      },
      {
        name: "high",
        type: "core::integer::u128",
      },
    ],
  },
  {
    type: "enum",
    name: "core::bool",
    variants: [
      {
        name: "False",
        type: "()",
      },
      {
        name: "True",
        type: "()",
      },
    ],
  },
  {
    type: "struct",
    name: "devote::ProposalVoteTypeStruct",
    members: [
      {
        name: "vote_type",
        type: "core::felt252",
      },
      {
        name: "count",
        type: "core::integer::u256",
      },
      {
        name: "is_active",
        type: "core::bool",
      },
    ],
  },
  {
    type: "struct",
    name: "devote::ProposalVoterStruct",
    members: [
      {
        name: "has_voted",
        type: "core::bool",
      },
      {
        name: "role",
        type: "core::integer::u8",
      },
    ],
  },
  {
    type: "struct",
    name: "devote::ProposalPublic",
    members: [
      {
        name: "id",
        type: "core::felt252",
      },
      {
        name: "name",
        type: "core::felt252",
      },
      {
        name: "state",
        type: "core::integer::u8",
      },
      {
        name: "total_voters",
        type: "core::integer::u256",
      },
      {
        name: "has_voted",
        type: "core::integer::u256",
      },
      {
        name: "type_votes",
        type: "core::array::Array::<devote::ProposalVoteTypeStruct>",
      },
      {
        name: "voter",
        type: "devote::ProposalVoterStruct",
      },
    ],
  },
  {
    type: "struct",
    name: "devote::PersonIdStruct",
    members: [
      {
        name: "wallet_id",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "id_number",
        type: "core::felt252",
      },
    ],
  },
  {
    type: "interface",
    name: "devote::IDeVote",
    items: [
      {
        type: "function",
        name: "create_admin",
        inputs: [
          {
            name: "person_id",
            type: "core::felt252",
          },
          {
            name: "voter_wallet",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "create_new_person",
        inputs: [
          {
            name: "person_id",
            type: "core::felt252",
          },
          {
            name: "voter_wallet",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "change_person_rol",
        inputs: [
          {
            name: "voter_wallet",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "new_rol",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_person",
        inputs: [
          {
            name: "connected_walled_id",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "devote::PersonPublic",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_person_rol",
        inputs: [
          {
            name: "connected_walled_id",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::felt252",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_person_proposals",
        inputs: [
          {
            name: "connected_walled_id",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::array::Array::<devote::PersonProposalStruct>",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "create_proposal",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "name",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_proposal",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "connected_walled_id",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "devote::ProposalPublic",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "add_voter",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "voter_wallet",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "modify_voters",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "voter_id",
            type: "core::felt252",
          },
          {
            name: "role",
            type: "core::integer::u8",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "remove_voters",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "voter_id",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "add_vote_type",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "vote_type",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "remove_vote_type",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "vote_type",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_vote_types",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "connected_walled_id",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::array::Array::<devote::ProposalVoteTypeStruct>",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "start_votation",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "vote",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "vote_type",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "end_votation",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "view_votation",
        inputs: [
          {
            name: "proposal_id",
            type: "core::felt252",
          },
          {
            name: "connected_walled_id",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::array::Array::<devote::ProposalVoteTypeStruct>",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "view_person_list",
        inputs: [
          {
            name: "connected_walled_id",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::array::Array::<devote::PersonIdStruct>",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_all_person_ids",
        inputs: [
          {
            name: "connected_walled_id",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [
          {
            type: "core::array::Array::<devote::PersonIdStruct>",
          },
        ],
        state_mutability: "view",
      },
    ],
  },
  {
    type: "constructor",
    name: "constructor",
    inputs: [],
  },
  {
    type: "event",
    name: "devote::DeVote::PersonAdded",
    kind: "struct",
    members: [
      {
        name: "wallet_id_signer",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "wallet_id",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "id_number",
        type: "core::felt252",
        kind: "key",
      },
      {
        name: "role",
        type: "core::felt252",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "devote::DeVote::PersonUpdated",
    kind: "struct",
    members: [
      {
        name: "wallet_id_signer",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "wallet_id",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "role",
        type: "core::felt252",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "devote::DeVote::AddVoter",
    kind: "struct",
    members: [
      {
        name: "wallet_id_signer",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "proposal_id",
        type: "core::felt252",
        kind: "data",
      },
      {
        name: "voter_id",
        type: "core::felt252",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "devote::DeVote::UnauthorizeEvent",
    kind: "struct",
    members: [
      {
        name: "function_name",
        type: "core::felt252",
        kind: "data",
      },
      {
        name: "type_error",
        type: "core::felt252",
        kind: "data",
      },
      {
        name: "wallet_id",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "devote::DeVote::GeneralEvent",
    kind: "struct",
    members: [
      {
        name: "function_name",
        type: "core::felt252",
        kind: "data",
      },
      {
        name: "type_message",
        type: "core::felt252",
        kind: "data",
      },
      {
        name: "wallet_id",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "data",
        type: "core::felt252",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "devote::DeVote::Event",
    kind: "enum",
    variants: [
      {
        name: "PersonAdded",
        type: "devote::DeVote::PersonAdded",
        kind: "nested",
      },
      {
        name: "PersonUpdated",
        type: "devote::DeVote::PersonUpdated",
        kind: "nested",
      },
      {
        name: "AddVoter",
        type: "devote::DeVote::AddVoter",
        kind: "nested",
      },
      {
        name: "UnauthorizeEvent",
        type: "devote::DeVote::UnauthorizeEvent",
        kind: "nested",
      },
      {
        name: "GeneralEvent",
        type: "devote::DeVote::GeneralEvent",
        kind: "nested",
      },
    ],
  },
];

export function useContractCustom() {
  const { contract } = useContract({
    abi: abi,
    address: contractAddress,
  });
  const { account } = useWallet();

  const provider = new RpcProvider({
    nodeUrl:
      "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/IQNV8HbIxfgGVkxJZyazEK38KIgLQCIn",
  });

  const createContract = () => {
    const contract = new Contract(abi, contractAddress, provider);
    return contract;
  };

  interface FetchFunction {
    (...args: any[]): Promise<any>;
  }

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;

  async function fetchWithRetry(
    fetchFunction: FetchFunction,
    ...args: any[]
  ): Promise<any> {
    let attempts = 0;
    while (attempts < MAX_RETRIES) {
      try {
        return await fetchFunction(...args);
      } catch (error: any) {
        if (error.response && error.response.status === 429) {
          attempts++;
          if (attempts < MAX_RETRIES) {
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          } else {
            throw new Error("Max retries reached");
          }
        } else {
          throw error;
        }
      }
    }
  }

  const getMyProposals = async (
    status: number = 0,
    wallet_address: string
  ): Promise<ProposalPublic[]> => {
    const proposalIds: PersonProposalStruct[] =
      await contract?.get_person_proposals(wallet_address);
    const proposals: ProposalPublic[] = [];
    for (const proposalItem of proposalIds) {
      const proposal: ProposalPublic = await contract?.get_proposal(
        proposalItem.proposal_id,
        wallet_address
      );
      proposal.name = shortString.decodeShortString(proposal.name);
      proposal.state = Number(proposal.state);
      proposal.total_voters = Number(proposal.total_voters);
      proposal.has_voted = Number(proposal.has_voted);
      proposal.type_votes = proposal.type_votes
        .map((type) => {
          type.vote_type = shortString.decodeShortString(type.vote_type);
          type.count = Number(type.count);
          return type;
        })
        .filter((type) => type.is_active);
      proposals.push(proposal);
    }
    return proposals.filter((p) => p.state === status);
  };

  const getProposal = async (
    proposal_id: string,
    wallet_address: string
  ): Promise<ProposalPublic> => {
    const proposal: ProposalPublic = await contract?.get_proposal(
      proposal_id,
      wallet_address
    );
    proposal.id = shortString.decodeShortString(proposal.id);
    proposal.name = shortString.decodeShortString(proposal.name);
    proposal.state = Number(proposal.state);
    proposal.total_voters = Number(proposal.total_voters);
    proposal.has_voted = Number(proposal.has_voted);
    proposal.type_votes = proposal.type_votes
      .map((type) => {
        type.vote_type = shortString.decodeShortString(type.vote_type);
        type.count = Number(type.count);
        return type;
      })
      .filter((type) => type.is_active);
    console.log("fixed proposal", proposal);
    return proposal;
  };

  const getPerson = async (wallet_address: string): Promise<PersonPublic> => {
    const result: PersonPublic = await contract?.get_person(wallet_address);
    result.wallet_id = shortString.decodeShortString(result.wallet_id);
    result.id_number = Number(result.id_number);
    result.role = shortString.decodeShortString(result.role);
    result.proposals = result.proposals.map((proposal) => {
      proposal.proposal_id = shortString.decodeShortString(
        proposal.proposal_id
      );
      proposal.role = Number(proposal.role);
      return proposal;
    });
    return result;
  };

  const getPersonRol = async (wallet_address: string): Promise<PersolRol> => {
    const rawRol = await fetchWithRetry(
      contract?.get_person_rol,
      wallet_address
    );
    const decodedRol = shortString.decodeShortString(rawRol);
    console.log("DecodedRol", decodedRol);
    let rol = PersolRol.noUser;
    if (Object.values(PersolRol).includes(decodedRol as PersolRol)) {
      rol = decodedRol as PersolRol;
    }
    console.log("Rol", rol);
    return rol;
  };

  const vote = async (proposal_id: string, vote_type: string) => {
    if (!account) {
      throw new Error("Account not connected");
    }
    contract?.connect(account);
    const result = await contract?.vote(proposal_id, vote_type);
    return result;
  };

  const createPersonOnChain = async (person_id: string) => {
    if (!account) {
      throw new Error("Account not connected");
    }
    const newContract: Contract = createContract();
    newContract.connect(account);
    const createUserCall = newContract.populate("create_new_person", [
      person_id,
      account.address,
    ]);
    const res = await newContract.create_new_person(createUserCall.calldata);
    const result = await provider.waitForTransaction(res.transaction_hash);
    return result;
  };

  const createAdminOnChain = async (person_id: string) => {
    if (!account) {
      throw new Error("Account not connected");
    }
    const newContract: Contract = createContract();
    newContract.connect(account);
    const createUserCall = newContract.populate("create_admin", [
      person_id,
      account.address,
    ]);
    const res = await newContract.create_admin(createUserCall.calldata);
    const result = await provider.waitForTransaction(res.transaction_hash);
    return result;
  };

  const changePersonRol = async (walletAddress: string, new_rol: string) => {
    if (!account) {
      throw new Error("Account not connected");
    }
    const newContract: Contract = createContract();
    newContract.connect(account);
    const changeRolCall = newContract.populate("change_person_rol", [
      walletAddress,
      new_rol,
    ]);
    const res = await newContract.change_person_rol(changeRolCall.calldata);
    const result = await provider.waitForTransaction(res.transaction_hash);
    return result;
  };

  const createProposal = async (proposal_id: string, name: string) => {
    if (!account) {
      throw new Error("Account not connected");
    }
    const newContract: Contract = createContract();
    newContract.connect(account);
    const createProposalCall = newContract.populate("create_proposal", [
      proposal_id,
      name,
    ]);
    const res = await newContract.create_proposal(createProposalCall.calldata);
    const result = await provider.waitForTransaction(res.transaction_hash);
    return result;
  };

  const addVoter = async (proposal_id: string, voter_wallet: string) => {
    if (!account) {
      throw new Error("Account not connected");
    }
    const newContract: Contract = createContract();
    newContract.connect(account);
    const addVoterCall = newContract.populate("add_voter", [
      proposal_id,
      voter_wallet,
    ]);
    const res = await newContract.add_voter(addVoterCall.calldata);
    const result = await provider.waitForTransaction(res.transaction_hash);
    return result;
  };

  const modifyVoters = async (
    proposal_id: string,
    voter_id: string,
    role: number
  ) => {
    if (!account) {
      throw new Error("Account not connected");
    }
    const newContract: Contract = createContract();
    newContract.connect(account);
    const modifyVotersCall = newContract.populate("modify_voters", [
      proposal_id,
      voter_id,
      role,
    ]);
    const res = await newContract.modify_voters(modifyVotersCall.calldata);
    const result = await provider.waitForTransaction(res.transaction_hash);
    return result;
  };

  const removeVoters = async (proposal_id: string, voter_id: string) => {
    if (!account) {
      throw new Error("Account not connected");
    }
    const newContract: Contract = createContract();
    newContract.connect(account);
    const removeVotersCall = newContract.populate("remove_voters", [
      proposal_id,
      voter_id,
    ]);
    const res = await newContract.remove_voters(removeVotersCall.calldata);
    const result = await provider.waitForTransaction(res.transaction_hash);
    return result;
  };

  const addVoteType = async (proposal_id: string, vote_type: string) => {
    if (!account) {
      throw new Error("Account not connected");
    }
    const newContract: Contract = createContract();
    newContract.connect(account);
    const addVoteTypeCall = newContract.populate("add_vote_type", [
      proposal_id,
      vote_type,
    ]);
    const res = await newContract.add_vote_type(addVoteTypeCall.calldata);
    const result = await provider.waitForTransaction(res.transaction_hash);
    return result;
  };

  const removeVoteType = async (proposal_id: string, vote_type: string) => {
    if (!account) {
      throw new Error("Account not connected");
    }
    const newContract: Contract = createContract();
    newContract.connect(account);
    const removeVoteTypeCall = newContract.populate("remove_vote_type", [
      proposal_id,
      vote_type,
    ]);
    const res = await newContract.remove_vote_type(removeVoteTypeCall.calldata);
    const result = await provider.waitForTransaction(res.transaction_hash);
    return result;
  };

  const startVotation = async (proposal_id: string) => {
    if (!account) {
      throw new Error("Account not connected");
    }
    const newContract: Contract = createContract();
    newContract.connect(account);
    const startVotationCall = newContract.populate("start_votation", [
      proposal_id,
    ]);
    const res = await newContract.start_votation(startVotationCall.calldata);
    const result = await provider.waitForTransaction(res.transaction_hash);
    return result;
  };

  const endVotation = async (proposal_id: string) => {
    if (!account) {
      throw new Error("Account not connected");
    }
    const newContract: Contract = createContract();
    newContract.connect(account);
    const endVotationCall = newContract.populate("end_votation", [proposal_id]);
    const res = await newContract.end_votation(endVotationCall.calldata);
    const result = await provider.waitForTransaction(res.transaction_hash);
    return result;
  };

  const viewVotation = async (
    proposal_id: string,
    wallet_address: string
  ): Promise<ProposalVoteTypeStruct[]> => {
    const result: ProposalVoteTypeStruct[] = await contract?.view_votation(
      proposal_id,
      wallet_address
    );
    return result;
  };

  return {
    contract,
    getPerson,
    vote,
    viewVotation,
    getMyProposals,
    getProposal,
    getPersonRol,
    createPersonOnChain,
    createAdminOnChain,
    changePersonRol,
    createProposal,
    addVoter,
    modifyVoters,
    removeVoters,
    addVoteType,
    removeVoteType,
    startVotation,
    endVotation,
  };
}
