import { PersonProposalStruct, PersonPublic } from "@/interfaces/Person";
import { ProposalPublic, ProposalVoteTypeStruct } from "@/interfaces/Proposal";
import { Abi, useAccount, useContract } from "@starknet-react/core";
import { shortString } from "starknet";
const contractAddress =
  "0x048ff663cf2a45045d0898a2a56fd5a9c9c8e051e62e0c55821512cb30a26260";

const abi: Abi = [
  {
    type: "impl",
    name: "DeVoteImpl",
    interface_name: "DeVote::DeVote::IDeVote",
  },
  {
    type: "struct",
    name: "DeVote::DeVote::PersonProposalStruct",
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
    name: "DeVote::DeVote::PersonPublic",
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
        type: "core::array::Array::<DeVote::DeVote::PersonProposalStruct>",
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
    name: "DeVote::DeVote::ProposalVoteTypeStruct",
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
    name: "DeVote::DeVote::ProposalVoterStruct",
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
    name: "DeVote::DeVote::ProposalPublic",
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
        type: "core::array::Array::<DeVote::DeVote::ProposalVoteTypeStruct>",
      },
      {
        name: "voter",
        type: "DeVote::DeVote::ProposalVoterStruct",
      },
    ],
  },
  {
    type: "struct",
    name: "DeVote::DeVote::PersonIdStruct",
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
    name: "DeVote::DeVote::IDeVote",
    items: [
      {
        type: "function",
        name: "create_new_person",
        inputs: [
          {
            name: "person_id",
            type: "core::felt252",
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
            type: "DeVote::DeVote::PersonPublic",
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
            type: "core::array::Array::<DeVote::DeVote::PersonProposalStruct>",
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
            type: "DeVote::DeVote::ProposalPublic",
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
            type: "core::array::Array::<DeVote::DeVote::ProposalVoteTypeStruct>",
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
            type: "core::array::Array::<DeVote::DeVote::ProposalVoteTypeStruct>",
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
            type: "core::array::Array::<DeVote::DeVote::PersonIdStruct>",
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
            type: "core::array::Array::<DeVote::DeVote::PersonIdStruct>",
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
    name: "DeVote::DeVote::DeVote::PersonAdded",
    kind: "struct",
    members: [
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
    name: "DeVote::DeVote::DeVote::PersonUpdated",
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
    name: "DeVote::DeVote::DeVote::AddVoter",
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
    name: "DeVote::DeVote::DeVote::UnauthorizeEvent",
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
    name: "DeVote::DeVote::DeVote::GeneralEvent",
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
    name: "DeVote::DeVote::DeVote::Event",
    kind: "enum",
    variants: [
      {
        name: "PersonAdded",
        type: "DeVote::DeVote::DeVote::PersonAdded",
        kind: "nested",
      },
      {
        name: "PersonUpdated",
        type: "DeVote::DeVote::DeVote::PersonUpdated",
        kind: "nested",
      },
      {
        name: "AddVoter",
        type: "DeVote::DeVote::DeVote::AddVoter",
        kind: "nested",
      },
      {
        name: "UnauthorizeEvent",
        type: "DeVote::DeVote::DeVote::UnauthorizeEvent",
        kind: "nested",
      },
      {
        name: "GeneralEvent",
        type: "DeVote::DeVote::DeVote::GeneralEvent",
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
  const { account } = useAccount();

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
    return result;
  };

  const vote = async (proposal_id: string, vote_type: string) => {
    if (!account) {
      throw new Error("Account not connected");
    }
    contract?.connect(account);
    const result = await contract?.vote(proposal_id, vote_type);
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
  };
}
