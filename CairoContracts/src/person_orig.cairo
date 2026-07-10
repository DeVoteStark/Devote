use core::fmt::{Display, Formatter, Error};

#[derive(Drop, PartialEq, Serde, Copy)]
pub enum PersonProposalRolState {
    none,
    view, 
    vote, 
    edit
}

impl PersonProposalRolStateDisplay of Display<PersonProposalRolState> {
    fn fmt(self: @PersonProposalRolState, ref f: Formatter) -> Result<(), Error> {
        let result = match *self {
            PersonProposalRolState::none => write!(f, "none"),
            PersonProposalRolState::view => write!(f, "view"),
            PersonProposalRolState::vote => write!(f, "vote"),
            PersonProposalRolState::edit => write!(f, "edit"),
        };
        result
    }
}

#[derive(Drop, Copy)]
pub struct PersonProposalStruct {
    pub proposal_id: felt252,
    pub rol: PersonProposalRolState,
}

#[derive(Drop)]
pub struct Person {
    pub wallet_id: felt252,
    pub id_number: felt252,
    pub rol: felt252,
    proposals: Array<PersonProposalStruct>
}

#[generate_trait]
pub impl PersonImpl of PersonTrait {    
    fn add_proposal(ref self: Person, proposal_id: felt252, rol: PersonProposalRolState) {
        let new_proposal = PersonProposalStruct {
            proposal_id: proposal_id,
            rol: rol,
        };
        self.proposals.append(new_proposal);
    }

    fn get_all_proposals(ref self: Person) -> Array<PersonProposalStruct> {
        let mut proposals = ArrayTrait::<PersonProposalStruct>::new();
        let mut idx = 0;
        while idx < self.proposals.len() {
            proposals.append(*self.proposals[idx]);
            idx += 1;
        };
        return proposals;
    }

    fn remove_proposal(ref self: Person, proposal_id: felt252) {
        let mut proposals = ArrayTrait::<PersonProposalStruct>::new();
        let mut idx = 0;
        while idx < self.proposals.len() {
            let temporal_proposal = *self.proposals[idx];
            if temporal_proposal.proposal_id != proposal_id {
                proposals.append(temporal_proposal);
            };
            idx += 1;
        };
        self.proposals = proposals;
    }

    fn change_rol(ref self: Person, new_rol: felt252) {
        self.rol = new_rol;
    }

}

pub fn create_person(wallet_id: felt252, id_number: felt252) -> Person {
    Person {
        wallet_id: wallet_id,
        id_number: id_number,
        rol: 0,
        proposals: ArrayTrait::<PersonProposalStruct>::new()
    }
}