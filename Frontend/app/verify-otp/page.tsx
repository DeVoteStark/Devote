"use client";

import { SumsubVerificationStatus } from "@/components/SumsubVerificationStatus";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex flex-col bg-black text-gray-100">
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-[#f7cf1d]">
            Verify
          </h1>

          <div>
            <Label className="text-gray-400" htmlFor="email">
              User Email
            </Label>
            <Input
              id="email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </main>
      </div>
    </Suspense>
  );
}
