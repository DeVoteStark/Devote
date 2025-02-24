"use client";

import { useWallet } from "@/hooks/use-wallet";
import Header from "../components/Header";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { SumsubVerificationStatus } from "../components/SumsubVerificationStatus";

export default function VerifyPage() {
  const { address } = useWallet();

  const handleVerify = async () => {
    console.log("Verifying KYC...");
    try {
      const response = await axios.post("/api/create-kyc-user", {
        userId: address,
        userEmail: "pjmq2@hotmail.com",
      });
      console.log("response", response);
    } catch (error: any) {
      console.error("Error verifying KYC:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#f7cf1d]">
          Verify
        </h1>
        {!address ? (
          <Button
            variant="default"
            className="w-full mb-4"
            onClick={handleVerify}
          >
            verify KYC
          </Button>
        ) : (
          <SumsubVerificationStatus userId={address} />
        )}
      </main>
    </div>
  );
}
