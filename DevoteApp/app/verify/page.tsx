"use client";

import { SumsubVerificationStatus } from "@/components/SumsubVerificationStatus";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function Verify() {
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    console.log("searchParams", searchParams);
    if (searchParams.get("kycId")) {
      setUserId(searchParams.get("kycId") ?? "");
    }
    if (searchParams.get("email")) {
      console.log("email", searchParams.get("email"));
      console.log(
        "decoded userEmail",
        decodeURIComponent(searchParams.get("email") ?? "")
      );
      setUserEmail(decodeURIComponent(searchParams.get("email") ?? ""));
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <main className="grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#f7cf1d]">
          Verify
        </h1>
        {userId && userEmail && (
          <SumsubVerificationStatus userId={userId} userEmail={userEmail} />
        )}
      </main>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Verify />
    </Suspense>
  );
}
