export interface PersonProposalStruct {
  proposal_id: string;
  role: number; //0 no tiene permisos, 1 solo puede ver, 2 puede votar, 3 puede editar
}

export interface Person {
  wallet_id: string;
  id_number: string;
  role: string;
  proposals: PersonProposalStruct[];
}

export interface PersonPublic {
  wallet_id: string;
  id_number: string;
  role: string;
  proposals: PersonProposalStruct[];
}

export interface PersonIdStruct {
  wallet_id: string;
  id_number: string;
}
