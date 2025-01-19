export interface ProposalVoterStruct {
  has_voted: boolean;
  role: number; //0 no tiene permisos, 1 solo puede ver, 2 puede votar, 3 puede editar
}

export interface ProposalVoteTypeStruct {
  vote_type: string;
  count: number;
  is_active: boolean;
}

export interface Proposal {
  id: string;
  name: string;
  state: number; //0 draft, 1 in_votation, 2 finalized
  total_voters: number;
  has_voted: number;
  type_votes: ProposalVoteTypeStruct[];
  voters: Map<string, ProposalVoterStruct>;
}

export interface ProposalPublic {
  id: string;
  name: string;
  state: number; //0 draft, 1 in_votation, 2 finalized
  total_voters: number;
  has_voted: number;
  type_votes: ProposalVoteTypeStruct[];
  voter: ProposalVoterStruct;
}
