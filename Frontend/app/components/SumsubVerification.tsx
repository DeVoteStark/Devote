// components/SumsubVerification.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import SumsubWebSdk from "@sumsub/websdk-react";
import { useRouter } from "next/router";

interface SumsubVerificationProps {
  userId: string;
}

export const SumsubVerification = ({ userId }: SumsubVerificationProps) => {
  const [email, setEmail] = useState("");
  const [levelName, setLevelName] = useState("basic-kyc-level");
  const [ttlInSecs, setTtlInSecs] = useState(1800); // Default TTL is 30 minutes
  const [externalUserId, setExternalUserId] = useState(userId);
  const [locale, setLocale] = useState("en");
  const [verificationLink, setVerificationLink] = useState("");
  const [error, setError] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    setExternalUserId(userId);
  }, [userId]);

  const handleGenerateLink = async () => {
    try {
      console.log("api data", {
        email,
        levelName,
        ttlInSecs,
        userId: externalUserId,
        locale,
      });

      const response = await axios.post("/api/get-kyc-access-token", {
        userId: externalUserId,
      });

      const { url } = response.data;
      console.log("response", response);
      setAccessToken(response.data.token);

      setVerificationLink(url);
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
            email: "robertdev2010@gmail.com",
            phone: "50685215747",
          }}
          options={{ addViewportTag: false, adaptIframeHeight: true }}
          onMessage={(message: any) => {
            console.log("message", message);
            if (message == "idCheck.onApplicantSubmitted") {
              router.push("/verificationSubmitted");
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
