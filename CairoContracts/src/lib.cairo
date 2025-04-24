mod person_orig;
mod proposal_orig;
mod devote;
mod person;
mod proposal;
mod testContract;

use person_orig::{create_person, PersonTrait, PersonProposalRolState};
use proposal_orig::{Proposal, create_proposal, ProposalTrait};

fn main() {}

fn test() {
    println!("###############################");
    println!("######## Testing Person #######");
    println!("###############################");
    let mut person = create_person('0x1234', '0x5678');
    person.add_proposal('0x987652', PersonProposalRolState::view);
    person.add_proposal('0x5432', PersonProposalRolState::vote);
    person.add_proposal('0x109', PersonProposalRolState::edit);

    let proposals = person.get_all_proposals();
    let mut idx = 0;
    while idx < proposals.len() {
        let proposal = *proposals[idx];
        println!("1. Proposal id: {:x}", proposal.proposal_id);
        idx += 1;
    };

    println!("**** Removing proposal with id 0x5432 ****");
    person.remove_proposal('0x5432');
    let proposals = person.get_all_proposals();
    let mut idx = 0;
    while idx < proposals.len() {
        let proposal = *proposals[idx];
        println!("2. Proposal id: {:x}", proposal.proposal_id);
        idx += 1;
    };

    println!("person: \nwallet_id: {:x}\nid: {:x}\nrol: {}", person.wallet_id, person.id_number, person.rol);
    print!("***** Change rol for person *****");
    person.change_rol('1');
    println!("person: \nwallet_id: {:x}\nid: {:x}\nrol: {}", person.wallet_id, person.id_number, person.rol);

    println!("###############################");
    println!("####### Testing Proposal ######");
    println!("###############################");

    let mut proposal = create_proposal('0x1234', '0x5678');
    proposal.add_vote_type('Si se presta');
    proposal.add_vote_type('No se presta');
    proposal.add_vote_type('Me da igual');
    print_vote_types(ref proposal);

    println!("**** Removing vote type 'Me da igual' ****");
    proposal.remove_vote_type('Me da igual');
    print_vote_types(ref proposal);

    println!("**** Adding voter with wallet_id 0x1234 and rol 1 ****");
    proposal.add_voter('0x1234', PersonProposalRolState::view);
    let voter = proposal.get_voter('0x1234');
    match voter {
        Option::Some(voter) => {
            println!("Voter wallet_id: 0x1234 - has voted: {} - rol: {}", voter.has_voted, voter.rol);
        },
        Option::None => {
            println!("Voter not found");
        }
    }

    println!("**** Modifying voter with wallet_id 0x1234 and rol vote ****");
    proposal.modify_voter('0x1234', PersonProposalRolState::vote);
    let voter = proposal.get_voter('0x1234');
    match voter {
        Option::Some(voter) => {
            println!("Voter wallet_id: 0x1234 - has voted: {} - rol: {}", voter.has_voted, voter.rol);
        },
        Option::None => {
            println!("Voter not found");
        }
    }

    println!("**** Removing voter with wallet_id 0x1234 ****");
    proposal.remove_voter('0x1234');
    let voter = proposal.get_voter('0x1234');
    match voter {
        Option::Some(voter) => {
            println!("Voter wallet_id: 0x1234 - has voted: {} - rol: {}", voter.has_voted, voter.rol);
        },
        Option::None => {
            println!("Voter not found");
        }
    }

    println!("Testing search not existing voter");
    let voter = proposal.get_voter('0x1688');
    match voter {
        Option::Some(voter) => {
            println!("Voter wallet_id: 0x1688 - has voted: {} - rol: {}", voter.has_voted, voter.rol);
        },
        Option::None => {
            println!("Voter not found");
        }
    }

    println!("**** Adding more voters ****");
    proposal.add_voter('0x1234', PersonProposalRolState::none);
    proposal.add_voter('0x5678', PersonProposalRolState::edit);
    proposal.add_voter('0x109', PersonProposalRolState::view);
    proposal.add_voter('0x5432', PersonProposalRolState::vote);
    proposal.add_voter('0x9876', PersonProposalRolState::vote);
    proposal.add_voter('0x5438', PersonProposalRolState::vote);
    proposal.add_voter('0x9877', PersonProposalRolState::vote);
    proposal.add_voter('0x9878', PersonProposalRolState::vote);

    println!("###############################");
    println!("########## Start Vote #########");

    proposal.start_votation();

    println!("Testing adding vote_type after starting votation");
    
    
    print_vote_types(ref proposal);

    println!("**** Adding vote_type 'No se que votar' ****");
    proposal.add_vote_type('No se que votar');

    print_vote_types(ref proposal);

    println!("###################################");
    println!("########## Start Votation #########");
    println!("###################################");
    println!("");

    println!("Testing votation with voter 0x1234, role none and vote_type 'Si se presta'");
    proposal.vote('0x1234', 'Si se presta');
    print_vote_types(ref proposal);

    println!("Testing votation with voter 0x5678, role edit and vote_type 'Si se presta'");
    proposal.vote('0x5678', 'Si se presta');
    print_vote_types(ref proposal);

    println!("Testing votation with voter 0x5678, role edit and vote_type 'Si se presta'");
    proposal.vote('0x5678', 'Si se presta');
    print_vote_types(ref proposal);

    println!("Testing votation with voter 0x109, role view and vote_type 'Si se presta'");
    proposal.vote('0x109', 'Si se presta');
    print_vote_types(ref proposal);

    println!("Testing votation with voter 0x5432, role vote and vote_type 'Si se presta'");
    proposal.vote('0x5432', 'Si se presta');
    print_vote_types(ref proposal);

    println!("Testing votation with voter 0x9876, role vote and vote_type 'No se presta'");
    proposal.vote('0x9876', 'No se presta');
    print_vote_types(ref proposal);

    println!("Testing votation with voter 0x5438, role vote and vote_type 'No se presta'");
    proposal.vote('0x5438', 'No se presta');
    print_vote_types(ref proposal);

    println!("Testing votation with voter 0x9877, role vote and vote_type 'Me da igual'");
    proposal.vote('0x9877', 'Me da igual');
    print_vote_types(ref proposal);

    println!("######################################");
    println!("########## Finalize Votation #########");
    println!("######################################");
    println!("");

    proposal.finalize_votation();

    println!("Testing adding vote_type after finalizing votation");
    proposal.add_vote_type('No se que votar');
    print_vote_types(ref proposal);

    println!("Testing votation with voter 0x9878, role vote and vote_type 'Si se presta'");
    proposal.vote('0x9878', 'Si se presta');
    print_vote_types(ref proposal);
}

fn print_vote_types(ref proposal: Proposal) {
    println!("");
    let vote_types = proposal.get_all_vote_types();
    let mut idx = 0;
    while idx < vote_types.len() {
        let vote_type = *vote_types[idx];
        println!("Vote type: {} - votes: {}", vote_type.vote_type, vote_type.count);
        idx += 1;
    };
    println!("");
}

#[cfg(test)]
mod tests {

    #[test]
    fn it_works() {
        assert(987 == 987, 'it works!');
    }
}
