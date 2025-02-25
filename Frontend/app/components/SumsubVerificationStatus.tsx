"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import SumsubWebSdk from "@sumsub/websdk-react";
import { useRouter } from "next/navigation";

interface SUserVerificationProps {
  userId: string;
  userEmail: string;
}

export const SumsubVerificationStatus = ({
  userId,
  userEmail,
}: SUserVerificationProps) => {
  const router = useRouter();
  const [externalUserId, setExternalUserId] = useState(userId);
  const [error, setError] = useState("");
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    setExternalUserId(userId);
  }, [userId]);

  const handleGenerateLink = async () => {
    try {
      const response = await axios.post("/api/get-kyc-access-token", {
        userId: externalUserId,
        userEmail: userEmail,
      });

      const { url } = response.data;
      console.log("response", response);
      setAccessToken(response.data.token);
      setError("");
    } catch (error: any) {
      setError("Error generating verification link. Please try again later.");
      console.error("Error generating verification link:", error.message);
    }
  };

  useEffect(() => {
    handleGenerateLink();
  }, [externalUserId]);

  return (
    <div className="my-4">
      {accessToken && (
        <SumsubWebSdk
          accessToken={accessToken ?? ""}
          expirationHandler={() =>
            Promise.resolve(process.env.NEXT_PUBLIC_SUMSUB_ACCESS_TOKEN ?? "")
          }
          config={{
            lang: "en",
            email: userEmail,
            phone: externalUserId,
          }}
          options={{ addViewportTag: false, adaptIframeHeight: true }}
          onMessage={(message: any) => {
            console.log("message", message);
            if (message == "idCheck.onApplicantSubmitted") {
              router.push("/verification-submitted?id=" + externalUserId);
            }
          }}
          onError={() => {
            console.log("error");
          }}
        />
      )}
    </div>
  );
};
