use core::starknet::{ContractAddress};
use starknet::storage::{ Vec };

#[derive(Drop, Copy, starknet::Store)]
pub struct PersonProposalStruct {
    pub proposal_id: felt252,
    pub rol: u8, //0 no tiene permisos, 1 solo puede ver, 2 puede votar, 3 puede editar
}

#[derive(Drop)]
#[starknet::storage_node]
pub struct Person {
    pub wallet_id: ContractAddress,
    pub id_number: felt252,
    pub rol: felt252,
    pub proposals: Vec<PersonProposalStruct>
}
