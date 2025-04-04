export interface PersonProposalStruct {
  proposal_id: string;
  role: number; //0 no tiene permisos, 1 solo puede ver, 2 puede votar, 3 puede editar
}

export enum PersolRol {
  noUser = 'noUser',
  user = 'user',
  admin = 'admin',
}

export interface Person {
  wallet_id: string;
  id_number: string;
  role: PersolRol;
  proposals: PersonProposalStruct[];
}

export interface PersonPublic {
  wallet_id: string;
  id_number: number;
  role: string;
  proposals: PersonProposalStruct[];
}

export interface PersonIdStruct {
  wallet_id: string;
  id_number: string;
}
