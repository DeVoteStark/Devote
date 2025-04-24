
use starknet::storage::{ Vec, Map };
use core::starknet::{ ContractAddress };


#[derive(Drop, PartialEq, Clone, Serde, Destruct, Copy, starknet::Store)]
pub struct ProposalVoterStruct {
    pub has_voted: bool,
    pub rol: u8 //0 no tiene permisos AKA no existe, 1 solo puede ver, 2 puede votar, 3 puede editar
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct ProposalVoteTypeStruct {
    pub vote_type: felt252,
    pub count: u256,
    pub is_active: bool
}

#[starknet::storage_node]
pub struct Proposal {
    pub id: felt252,
    pub name: felt252,
    pub state: u8, //0 draft, 1 in_votation, 2 finalized
    pub type_votes: Vec<ProposalVoteTypeStruct>,
    pub voters: Map<ContractAddress, ProposalVoterStruct>
}
