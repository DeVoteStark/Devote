export interface User {
  walletId: string;
  name: string;
  email: string;
  hashIne: string;
  kycStatus: "pending" | "inProcess" | "rejected" | "accepted";
  kycId: string;
  secretKey: string;
}
