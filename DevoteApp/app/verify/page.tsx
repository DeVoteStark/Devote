"use client";

import { SumsubVerificationStatus } from "@/components/SumsubVerificationStatus";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function VerifyPage() {
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
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex flex-col bg-black text-gray-100">
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-[#f7cf1d]">
            Verify
          </h1>
          {userId && userEmail && (
            <SumsubVerificationStatus userId={userId} userEmail={userEmail} />
          )}
        </main>
      </div>
    </Suspense>
  );
}
