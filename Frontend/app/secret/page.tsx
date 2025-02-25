"use client";

import { Button } from "@/components/ui/button";
import { useContractCustom } from "@/hooks/use-contract";
import { generateAndDeployNewWalletFromPrivateKey } from "@/lib/starknet/createWallet";
import { UserCog, UserPlus } from "lucide-react";

export default function SecretPage() {
  const { createAdminOnChain } = useContractCustom();

  const handleCreateUser = async () => {
    const result = await createAdminOnChain("1161616161");
    console.log("Result create user", result);
  };

  const handleDeployWallet = async () => {
    const cachedKey = localStorage.getItem("encryptedPrivateKey");
    const cachedAccountAddress = localStorage.getItem("publicKey");
    if (!cachedKey || !cachedAccountAddress) {
      console.error("No cached key or account address found");
      return;
    }
    generateAndDeployNewWalletFromPrivateKey(cachedKey, "secret");
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#f7cf1d]">
          Secret
        </h1>
        <div className="space-y-2 md:space-y-0 md:space-x-4 flex flex-col md:flex-row">
          <Button
            className="bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
            onClick={handleDeployWallet}
          >
            <UserPlus className="mr-2 h-4 w-4" /> Deploy Wallet
          </Button>
          <Button
            className="bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
            onClick={handleCreateUser}
          >
            <UserPlus className="mr-2 h-4 w-4" /> Create New User
          </Button>
        </div>
      </main>
    </div>
  );
}
