use crate::person_orig::{PersonProposalRolState};

use core::dict::Felt252Dict;
use core::nullable::{NullableTrait, match_nullable, FromNullableResult};
use core::fmt::{Display, Formatter, Error};


#[derive(PartialEq, Clone, Serde, Destruct, Copy)]
enum ProposalState {
    draft, 
    in_votation, 
    finalized
}

impl ProposalStateDisplay of Display<ProposalState> {
    fn fmt(self: @ProposalState, ref f: Formatter) -> Result<(), Error> {
        let result = match *self {
            ProposalState::draft => write!(f, "draft"),
            ProposalState::in_votation => write!(f, "in_votation"),
            ProposalState::finalized => write!(f, "finalized"),
        };
        result
    }
}

#[derive(Drop, PartialEq, Clone, Serde, Destruct, Copy)]
struct ProposalVoterStruct {
    pub has_voted: bool,
    pub rol: PersonProposalRolState
}

#[derive(Copy, Drop)]
struct ProposalVoteTypeStruct {
    pub vote_type: felt252,
    pub count: u256
}

#[derive(Destruct)]
pub struct Proposal {
    pub id: felt252,
    pub name: felt252,
    pub state: ProposalState,
    type_votes: Array<ProposalVoteTypeStruct>,
    voters: Felt252Dict<Nullable<ProposalVoterStruct>>
}

#[generate_trait]
pub impl ProposalImpl of ProposalTrait {
    fn add_vote_type(ref self: Proposal, vote_type: felt252) {
        if self.state != ProposalState::draft {
            return;
        };
        let temp = ProposalVoteTypeStruct {
            vote_type: vote_type,
            count: 0
        };
        self.type_votes.append(temp);
    }

    fn get_all_vote_types(ref self: Proposal) -> Array<ProposalVoteTypeStruct> {
        let mut vote_types = ArrayTrait::<ProposalVoteTypeStruct>::new();
        let mut idx = 0;
        while idx < self.type_votes.len() {
            vote_types.append(*self.type_votes[idx]);
            idx += 1;
        };
        return vote_types;
    }

    fn remove_vote_type(ref self: Proposal, vote_type: felt252) {
        if self.state != ProposalState::draft {
            return;
        };
        let mut vote_types = ArrayTrait::<ProposalVoteTypeStruct>::new();
        let mut idx = 0;
        while idx < self.type_votes.len() {
            let temp = *self.type_votes[idx];
            if temp.vote_type != vote_type {
                vote_types.append(temp);
            };
            idx += 1;
        };
        self.type_votes = vote_types;
    }

    fn add_voter(ref self: Proposal, wallet_id: felt252, rol: PersonProposalRolState) {
        if self.state != ProposalState::draft {
            return;
        };
        let new_voter = ProposalVoterStruct {
            has_voted: false,
            rol: rol,
        };
        self.voters.insert(wallet_id, NullableTrait::new(new_voter));
    }

    fn modify_voter(ref self: Proposal, wallet_id: felt252, rol: PersonProposalRolState) {
        if self.state != ProposalState::draft {
            return;
        };
        let new_voter = ProposalVoterStruct {
            has_voted: false,
            rol: rol,
        };
        self.voters.insert(wallet_id, NullableTrait::new(new_voter));
    }

    fn get_voter(ref self: Proposal, wallet_id: felt252) -> Option<ProposalVoterStruct> {
        let voterElement = self.voters.get(wallet_id);
        let result =  match match_nullable(voterElement) {
            FromNullableResult::Null => Option::None,
            FromNullableResult::NotNull(val) => {
                let voter = val.deref();
                if voter.rol == PersonProposalRolState::none {
                    return Option::None;
                } else {
                    return Option::Some(voter);
                }
            },
        };
        return result;
    }

    fn remove_voter(ref self: Proposal, wallet_id: felt252) {
        if self.state != ProposalState::draft {
            return;
        };
        let new_voter = ProposalVoterStruct {
            has_voted: false,
            rol: PersonProposalRolState::none,
        };
        self.voters.insert(wallet_id, NullableTrait::new(new_voter));
    }

    fn start_votation(ref self: Proposal) {
        if self.state != ProposalState::draft {
            return;
        };
        self.state = ProposalState::in_votation;
    }

    fn vote(ref self: Proposal, wallet_id: felt252, vote_type: felt252) {
        if self.state != ProposalState::in_votation {
            return;
        };
        let voterElement = self.voters.get(wallet_id);
        let voter =  match match_nullable(voterElement) {
            FromNullableResult::Null => Option::None,
            FromNullableResult::NotNull(val) => Option::Some(val.deref())
        };
        match voter {
            Option::Some(voter) => {
                if voter.has_voted {
                    return;
                } else if voter.rol == PersonProposalRolState::none {
                    return;
                } else if voter.rol == PersonProposalRolState::view {
                    return;
                } else {
                    let mut new_vote_type_list = ArrayTrait::<ProposalVoteTypeStruct>::new();
                    let mut idx = 0;
                    while idx < self.type_votes.len() {
                        let mut temp = *self.type_votes[idx];
                        if temp.vote_type == vote_type {
                            let new_vote = ProposalVoteTypeStruct {
                                vote_type: temp.vote_type,
                                count: temp.count + 1
                            };
                            new_vote_type_list.append(new_vote);
                        } else {
                            new_vote_type_list.append(temp);
                        };
                        idx += 1;
                    };
                    let new_voter = ProposalVoterStruct {
                        has_voted: true,
                        rol: voter.rol,
                    };
                    self.voters.insert(wallet_id, NullableTrait::new(new_voter));
                    self.type_votes = new_vote_type_list;
                }
            },
            Option::None => {
                return;
            }
        };
    }

    fn finalize_votation(ref self: Proposal) {
        if self.state != ProposalState::in_votation {
            return;
        };
        self.state = ProposalState::finalized;
    }
}

pub fn create_proposal(id: felt252, name: felt252) -> Proposal {
    Proposal {
        id: id,
        name: name,
        state: ProposalState::draft,
        type_votes: Default::default(),
        voters: Default::default()
    }
}