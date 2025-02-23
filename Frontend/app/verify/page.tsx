"use client";

import { useWallet } from "@/hooks/use-wallet";
import { SumsubVerificationStatus } from "../components/SumsubVerificationStatus";
import Header from "../components/Header";

export default function VerifyPage() {
  const { address, isConnected } = useWallet();

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#f7cf1d]">
          Verify
        </h1>
        <SumsubVerificationStatus userId={address ?? ""} />
      </main>
    </div>
  );
}
