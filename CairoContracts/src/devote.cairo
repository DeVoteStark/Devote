use core::starknet::{ContractAddress};
use starknet::storage::{Vec, Map};
#[derive(Drop, Copy, Serde, starknet::Store)]
pub struct PersonProposalStruct {
    pub proposal_id: felt252,
    pub role: u8 //0 no tiene permisos, 1 solo puede ver, 2 puede votar, 3 puede editar
}
#[derive(Drop)]
#[starknet::storage_node]
pub struct Person {
    pub wallet_id: ContractAddress,
    pub id_number: felt252,
    pub role: felt252,
    pub proposals: Vec<PersonProposalStruct>,
}
#[derive(Drop, Serde)]
pub struct PersonPublic {
    pub wallet_id: ContractAddress,
    pub id_number: felt252,
    pub role: felt252,
    pub proposals: Array<PersonProposalStruct>,
}
#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct PersonIdStruct {
    pub wallet_id: ContractAddress,
    pub id_number: felt252,
}
#[derive(Drop, PartialEq, Clone, Serde, Destruct, Copy, starknet::Store)]
pub struct ProposalVoterStruct {
    pub has_voted: bool,
    pub role: u8 //0 no tiene permisos, 1 solo puede ver, 2 puede votar, 3 puede editar
}
#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct ProposalVoteTypeStruct {
    pub vote_type: felt252,
    pub count: u256,
    pub is_active: bool,
}
#[starknet::storage_node]
pub struct Proposal {
    pub id: felt252,
    pub name: felt252,
    pub state: u8, //0 draft, 1 in_votation, 2 finalized
    pub total_voters: u256,
    pub has_voted: u256,
    pub type_votes: Vec<ProposalVoteTypeStruct>,
    pub voters: Map<felt252, ProposalVoterStruct>,
}
#[derive(Drop, Serde)]
pub struct ProposalPublic {
    id: felt252,
    pub name: felt252,
    pub state: u8, //0 draft, 1 in_votation, 2 finalized
    pub total_voters: u256,
    pub has_voted: u256,
    pub type_votes: Array<ProposalVoteTypeStruct>,
    pub voter: ProposalVoterStruct,
}
#[starknet::interface]
trait IDeVote<ContractState> {
    fn create_new_person(ref self: ContractState, person_id: felt252);
    fn change_person_rol(ref self: ContractState, new_rol: felt252);
    fn get_person(self: @ContractState, connected_walled_id: ContractAddress) -> PersonPublic;
    fn get_person_rol(self: @ContractState, connected_walled_id: ContractAddress) -> felt252;
    fn get_person_proposals(
        self: @ContractState, connected_walled_id: ContractAddress,
    ) -> Array<PersonProposalStruct>;
    fn create_proposal(ref self: ContractState, proposal_id: felt252, name: felt252);
    fn get_proposal(
        self: @ContractState, proposal_id: felt252, connected_walled_id: ContractAddress,
    ) -> ProposalPublic;
    fn add_voter(ref self: ContractState, proposal_id: felt252, voter_wallet: ContractAddress);
    fn modify_voters(ref self: ContractState, proposal_id: felt252, voter_id: felt252, role: u8);
    fn remove_voters(ref self: ContractState, proposal_id: felt252, voter_id: felt252);
    fn add_vote_type(ref self: ContractState, proposal_id: felt252, vote_type: felt252);
    fn remove_vote_type(ref self: ContractState, proposal_id: felt252, vote_type: felt252);
    fn get_vote_types(
        self: @ContractState, proposal_id: felt252, connected_walled_id: ContractAddress,
    ) -> Array<ProposalVoteTypeStruct>;
    fn start_votation(ref self: ContractState, proposal_id: felt252);
    fn vote(ref self: ContractState, proposal_id: felt252, vote_type: felt252);
    fn end_votation(ref self: ContractState, proposal_id: felt252);
    fn view_votation(
        self: @ContractState, proposal_id: felt252, connected_walled_id: ContractAddress,
    ) -> Array<ProposalVoteTypeStruct>;
    fn view_person_list(
        self: @ContractState, connected_walled_id: ContractAddress,
    ) -> Array<PersonIdStruct>;
    fn get_all_person_ids(
        self: @ContractState, connected_walled_id: ContractAddress,
    ) -> Array<PersonIdStruct>;
}
#[starknet::contract]
mod DeVote {
    use super::IDeVote;
    use super::PersonProposalStruct;
    use super::PersonPublic;
    use super::Person;
    use super::ProposalVoterStruct;
    use super::ProposalVoteTypeStruct;
    use super::Proposal;
    use super::ProposalPublic;
    use super::PersonIdStruct;
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, MutableVecTrait, Map, StoragePathEntry,
        VecTrait, Vec,
    };
    use core::starknet::{ContractAddress, get_caller_address};
    #[storage]
    struct Storage {
        persons_ids: Vec<PersonIdStruct>,
        persons: Map<ContractAddress, Person>,
        proposals: Map<felt252, Proposal>,
    }
    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        PersonAdded: PersonAdded,
        PersonUpdated: PersonUpdated,
        AddVoter: AddVoter,
        UnauthorizeEvent: UnauthorizeEvent,
        GeneralEvent: GeneralEvent,
    }
    #[derive(Drop, starknet::Event)]
    pub struct PersonAdded {
        pub wallet_id: ContractAddress,
        #[key]
        pub id_number: felt252,
        pub role: felt252,
    }
    #[derive(Drop, starknet::Event)]
    pub struct PersonUpdated {
        #[key]
        pub wallet_id_signer: ContractAddress,
        pub wallet_id: ContractAddress,
        pub role: felt252,
    }
    #[derive(Drop, starknet::Event)]
    pub struct AddVoter {
        #[key]
        pub wallet_id_signer: ContractAddress,
        pub proposal_id: felt252,
        pub voter_id: felt252,
    }

    #[derive(Drop, starknet::Event)]
    pub struct UnauthorizeEvent {
        pub function_name: felt252,
        pub type_error: felt252,
        pub wallet_id: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    pub struct GeneralEvent {
        pub function_name: felt252,
        pub type_message: felt252,
        pub wallet_id: ContractAddress,
        pub data: felt252,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {}
    #[abi(embed_v0)]
    impl DeVoteImpl of IDeVote<ContractState> {
        fn create_new_person(ref self: ContractState, person_id: felt252) {
            let wallet_id = get_caller_address();
            let mut person = self.persons.entry(wallet_id);
            person.id_number.write(person_id);
            person.wallet_id.write(wallet_id);
            person.role.write(0);
            self
                .emit(
                    PersonAdded {
                        wallet_id: person.wallet_id.read(),
                        id_number: person.id_number.read(),
                        role: person.role.read(),
                    },
                );
        }

        fn change_person_rol(ref self: ContractState, new_rol: felt252) {
            let person = self.persons.entry(get_caller_address());
            person.role.write(new_rol);
            self
                .emit(
                    PersonUpdated {
                        wallet_id_signer: get_caller_address(),
                        wallet_id: person.wallet_id.read(),
                        role: person.role.read(),
                    },
                );
        }

        fn get_person(self: @ContractState, connected_walled_id: ContractAddress) -> PersonPublic {
            let person = self.persons.entry(connected_walled_id);

            let mut proposals = ArrayTrait::<PersonProposalStruct>::new();
            let mut idx = 0;
            while idx < person.proposals.len() {
                proposals.append(person.proposals.at(idx).read());
                idx += 1;
            };
            return PersonPublic {
                wallet_id: person.wallet_id.read(),
                id_number: person.id_number.read(),
                role: person.role.read(),
                proposals: proposals,
            };
        }

        fn get_person_rol(self: @ContractState, connected_walled_id: ContractAddress) -> felt252 {
            let person = self.persons.entry(connected_walled_id);
            return person.role.read();
        }
        fn get_person_proposals(
            self: @ContractState, connected_walled_id: ContractAddress,
        ) -> Array<PersonProposalStruct> {
            let person = self.persons.entry(connected_walled_id);
            let mut proposals = ArrayTrait::<PersonProposalStruct>::new();
            let mut idx = 0;
            while idx < person.proposals.len() {
                proposals.append(person.proposals.at(idx).read());
                idx += 1;
            };
            return proposals;
        }
        fn create_proposal(ref self: ContractState, proposal_id: felt252, name: felt252) {
            let person = self.persons.entry(get_caller_address());
            if person.role.read() == 0 {
                self
                    .emit(
                        UnauthorizeEvent {
                            function_name: 'create_proposal',
                            type_error: 'person.role.read() == 0',
                            wallet_id: get_caller_address(),
                        },
                    );
                return;
            }
            let mut proposal = self.proposals.entry(proposal_id);
            proposal.id.write(proposal_id);
            proposal.name.write(name);
            proposal.state.write(0);
            proposal.total_voters.write(1);
            proposal.has_voted.write(0);

            let temporal_voter = ProposalVoterStruct { has_voted: false, role: 3 };
            proposal.voters.entry(person.id_number.read()).write(temporal_voter);

            let mut proposal_creator = self.persons.entry(get_caller_address());
            let temp = PersonProposalStruct { proposal_id: proposal_id, role: 3 };
            proposal_creator.proposals.append().write(temp);

            self
                .emit(
                    GeneralEvent {
                        function_name: 'create_proposal',
                        type_message: 'create proposal',
                        wallet_id: get_caller_address(),
                        data: proposal_id,
                    },
                );
        }
        fn get_proposal(
            self: @ContractState, proposal_id: felt252, connected_walled_id: ContractAddress,
        ) -> ProposalPublic {
            let proposal = self.proposals.entry(proposal_id);
            let mut votation = ArrayTrait::<ProposalVoteTypeStruct>::new();
            let mut idx = 0;
            while idx < proposal.type_votes.len() {
                let vote = proposal.type_votes.at(idx).read();
                if vote.is_active {
                    votation.append(vote);
                }
                idx += 1;
            };

            let person = self.persons.entry(connected_walled_id);
            return ProposalPublic {
                id: proposal.id.read(),
                name: proposal.name.read(),
                state: proposal.state.read(),
                total_voters: proposal.total_voters.read(),
                has_voted: proposal.has_voted.read(),
                type_votes: votation,
                voter: proposal.voters.entry(person.id_number.read()).read(),
            };
        }
        fn add_voter(ref self: ContractState, proposal_id: felt252, voter_wallet: ContractAddress) {
            if can_modify_proposal(@self, proposal_id, 0) {
                let mut proposal = self.proposals.entry(proposal_id);
                let mut person = self.persons.entry(voter_wallet);
                let temp = ProposalVoterStruct { has_voted: false, role: 3 };
                let voter_id = person.id_number.read();
                proposal.voters.entry(voter_id).write(temp);
                proposal.total_voters.write(proposal.total_voters.read() + 1);
                person
                    .proposals
                    .append()
                    .write(PersonProposalStruct { proposal_id: proposal_id, role: 3 });

                self
                    .emit(
                        AddVoter {
                            proposal_id: proposal_id,
                            voter_id: voter_id,
                            wallet_id_signer: get_caller_address(),
                        },
                    );
            } else {
                self
                    .emit(
                        UnauthorizeEvent {
                            function_name: 'add_voter',
                            type_error: 'unauthorize',
                            wallet_id: get_caller_address(),
                        },
                    );
            }
        }
        fn modify_voters(
            ref self: ContractState, proposal_id: felt252, voter_id: felt252, role: u8,
        ) {
            if (role == 0) {
                self
                    .emit(
                        UnauthorizeEvent {
                            function_name: 'modify_voters',
                            type_error: 'rol = 0',
                            wallet_id: get_caller_address(),
                        },
                    );
                return;
            }
            if can_modify_proposal(@self, proposal_id, 0) {
                let mut proposal = self.proposals.entry(proposal_id);
                let mut voter = proposal.voters.entry(voter_id);
                voter.role.write(role);
            } else {
                self
                    .emit(
                        UnauthorizeEvent {
                            function_name: 'modify_voters',
                            type_error: 'unauthorize',
                            wallet_id: get_caller_address(),
                        },
                    );
            }
        }
        fn remove_voters(ref self: ContractState, proposal_id: felt252, voter_id: felt252) {
            if can_modify_proposal(@self, proposal_id, 0) {
                let mut proposal = self.proposals.entry(proposal_id);
                let mut voter = proposal.voters.entry(voter_id);
                voter.role.write(0);
                proposal.total_voters.write(proposal.total_voters.read() - 1);
            } else {
                self
                    .emit(
                        UnauthorizeEvent {
                            function_name: 'remove_voters',
                            type_error: 'unauthorize',
                            wallet_id: get_caller_address(),
                        },
                    );
            }
        }
        fn add_vote_type(ref self: ContractState, proposal_id: felt252, vote_type: felt252) {
            if can_modify_proposal(@self, proposal_id, 0) {
                let mut proposal = self.proposals.entry(proposal_id);
                let temp = ProposalVoteTypeStruct {
                    vote_type: vote_type, count: 0, is_active: true,
                };
                proposal.type_votes.append().write(temp);
            } else {
                self
                    .emit(
                        UnauthorizeEvent {
                            function_name: 'add_vote_type',
                            type_error: 'unauthorize',
                            wallet_id: get_caller_address(),
                        },
                    );
            }
        }
        fn remove_vote_type(ref self: ContractState, proposal_id: felt252, vote_type: felt252) {
            if can_modify_proposal(@self, proposal_id, 0) {
                let mut proposal = self.proposals.entry(proposal_id);
                if proposal.state.read() != 0 {
                    return;
                }
                let mut idx = 0;
                while idx < proposal.type_votes.len() {
                    let vote = proposal.type_votes.at(idx).read();
                    if vote.vote_type == vote_type {
                        proposal.type_votes.at(idx).is_active.write(false);
                        break;
                    }
                    idx += 1;
                }
            } else {
                self
                    .emit(
                        UnauthorizeEvent {
                            function_name: 'remove_vote_type',
                            type_error: 'unauthorize',
                            wallet_id: get_caller_address(),
                        },
                    );
            }
        }
        fn get_vote_types(
            self: @ContractState, proposal_id: felt252, connected_walled_id: ContractAddress,
        ) -> Array<ProposalVoteTypeStruct> {
            let mut proposals = ArrayTrait::<ProposalVoteTypeStruct>::new();
            let proposal = self.proposals.entry(proposal_id);
            let mut idx = 0;
            while idx < proposal.type_votes.len() {
                proposals.append(proposal.type_votes.at(idx).read());
                idx += 1;
            };
            return proposals;
        }
        fn start_votation(ref self: ContractState, proposal_id: felt252) {
            let mut proposal = self.proposals.entry(proposal_id);
            if can_modify_proposal(@self, proposal_id, 0) {
                proposal.state.write(1);
            } else {
                self
                    .emit(
                        UnauthorizeEvent {
                            function_name: 'start_votation',
                            type_error: 'unauthorize',
                            wallet_id: get_caller_address(),
                        },
                    );
            }
        }
        fn vote(ref self: ContractState, proposal_id: felt252, vote_type: felt252) {
            let person = self.persons.entry(get_caller_address());
            let mut proposal = self.proposals.entry(proposal_id);
            if proposal.state.read() != 1 {
                self
                    .emit(
                        UnauthorizeEvent {
                            function_name: 'vote',
                            type_error: 'proposal state != 1',
                            wallet_id: get_caller_address(),
                        },
                    );
                return;
            }
            let voter = proposal.voters.entry(person.id_number.read());
            if voter.role.read() == 0 {
                self
                    .emit(
                        UnauthorizeEvent {
                            function_name: 'vote',
                            type_error: 'voter role = 0',
                            wallet_id: get_caller_address(),
                        },
                    );
                return;
            } else if voter.role.read() == 1 {
                self
                    .emit(
                        UnauthorizeEvent {
                            function_name: 'vote',
                            type_error: 'voter role = 1',
                            wallet_id: get_caller_address(),
                        },
                    );
                return;
            } else if voter.has_voted.read() {
                self
                    .emit(
                        UnauthorizeEvent {
                            function_name: 'vote',
                            type_error: 'voter has voted before',
                            wallet_id: get_caller_address(),
                        },
                    );
                return;
            } else {
                let mut idx = 0;
                proposal.has_voted.write(proposal.has_voted.read() + 1);
                while idx < proposal.type_votes.len() {
                    let vote = proposal.type_votes.at(idx).read();
                    if vote.vote_type == vote_type {
                        proposal.type_votes.at(idx).count.write(vote.count + 1);
                        voter.has_voted.write(true);
                        break;
                    }
                    idx += 1;
                }
            }
        }
        fn end_votation(ref self: ContractState, proposal_id: felt252) {
            if can_modify_proposal(@self, proposal_id, 1) {
                let mut proposal = self.proposals.entry(proposal_id);
                proposal.state.write(2);
            } else {
                self
                    .emit(
                        UnauthorizeEvent {
                            function_name: 'end_votation',
                            type_error: 'unauthorize',
                            wallet_id: get_caller_address(),
                        },
                    );
            }
        }
        fn view_votation(
            self: @ContractState, proposal_id: felt252, connected_walled_id: ContractAddress,
        ) -> Array<ProposalVoteTypeStruct> {
            let mut votation = ArrayTrait::<ProposalVoteTypeStruct>::new();
            let proposal = self.proposals.entry(proposal_id);
            let mut idx = 0;
            while idx < proposal.type_votes.len() {
                let vote = proposal.type_votes.at(idx).read();
                if vote.is_active {
                    votation.append(vote);
                }
                idx += 1;
            };
            return votation;
        }

        fn get_all_person_ids(
            self: @ContractState, connected_walled_id: ContractAddress,
        ) -> Array<PersonIdStruct> {
            let mut person_ids = ArrayTrait::<PersonIdStruct>::new();
            for i in 0..self.persons_ids.len() {
                person_ids.append(self.persons_ids.at(i).read());
            };
            person_ids
        }

        fn view_person_list(
            self: @ContractState, connected_walled_id: ContractAddress,
        ) -> Array<PersonIdStruct> {
            let mut person_list = ArrayTrait::<PersonIdStruct>::new();
            let mut idx = 0;
            while idx < self.persons_ids.len() {
                if let Option::Some(person) = self.persons_ids.get(idx) {
                    person_list
                        .append(
                            PersonIdStruct {
                                wallet_id: person.wallet_id.read(),
                                id_number: person.id_number.read(),
                            },
                        );
                };
                idx += 1;
            };
            return person_list;
        }
    }

    fn can_modify_proposal(
        self: @ContractState, proposal_id: felt252, proposal_status: u8,
    ) -> bool {
        let proposal = self.proposals.entry(proposal_id);
        let person = self.persons.entry(get_caller_address());
        if proposal.state.read() != proposal_status {
            return false;
        } else {
            let voter = proposal.voters.entry(person.id_number.read());
            if voter.role.read() == 3 {
                return true;
            }
        }
        return false;
    }
}
