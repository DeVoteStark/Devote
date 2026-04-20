"use client";

import { Suspense } from "react";
import VerifySignupContent from "./verify-content";

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#f7cf1d] mx-auto mb-4"></div>
        <p>Loading verification page...</p>
      </div>
    </div>
  );
}

export default function VerifySignupPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifySignupContent />
    </Suspense>
  );
}