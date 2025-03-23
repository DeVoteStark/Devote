"use client";

import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  generateAndDeployNewWalletFromPrivateKey,
  generatePrivateKeyEncrypted,
  getFutureWalletAdressFromPrivateKey,
} from "@/lib/starknet/createWallet";
import { PlusCircle, UserPlus } from "lucide-react";
import { useState } from "react";
export default function TestingLoginPage() {
  const [privateKey, setPrivateKey] = useState<string | undefined>(undefined);
  const [walletAddress, setWalletAddress] = useState<string | undefined>(
    undefined
  );

  const handleGeneratePrivateKey = () => {
    const privateKey = generatePrivateKeyEncrypted("1234");
    setPrivateKey(privateKey);
  }

  const handleGenerateWallet = () => {
    if (!privateKey) {
      console.error("No private key found");
      return;
    }
    const walletAddress = getFutureWalletAdressFromPrivateKey(
      privateKey,
      "1234"
    );
    setWalletAddress(walletAddress);
  };

  const handleDeployWallet = async () => {
    if (!privateKey) {
      console.error("No private key found");
      return;
    }
    await generateAndDeployNewWalletFromPrivateKey(privateKey, "1234");
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#f7cf1d] mb-4 md:mb-0">
            Admin Dashboard
          </h1>
          <div className="space-y-2 md:space-y-0 md:space-x-4 flex flex-col md:flex-row">
            <Button
              className="bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
              onClick={handleGeneratePrivateKey}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Generate private key
            </Button>

            {privateKey && (
              <Button
                className="bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
                onClick={handleGenerateWallet}
              >
                <UserPlus className="mr-2 h-4 w-4" /> Generate wallet Address
              </Button>
            )}
            {privateKey && (
              <Button
                className="bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
                onClick={handleDeployWallet}
              >
                <UserPlus className="mr-2 h-4 w-4" /> Deploy Address
              </Button>
            )}
          </div>
          {privateKey && <div>private key: {privateKey}</div>}
          {walletAddress && <div>Wallet address: {walletAddress}</div>}
        </div>
      </main>
      <Footer />
    </div>
  );
}
