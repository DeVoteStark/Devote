"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { braavos, useAccount, useConnect } from "@starknet-react/core";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();

  const { address, isDisconnected, isConnected } = useAccount();
  const { connect } = useConnect();

  const handleConnectWallet = () => {
    connect({ connector: braavos() });
    console.log("conecting wallet");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md bg-gray-900 border-[#f7cf1d]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-[#f7cf1d]">
              Welcome to DeVote
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Connect your wallet to access the voting platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isDisconnected ? (
              <Button
                onClick={handleConnectWallet}
                className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
              >
                Connect Braavos
              </Button>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-400">Connected Wallet:</p>
                <p className="text-[#f7cf1d] font-mono">{address}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <p className="text-sm text-gray-400 text-center">
              By connecting, you agree to our{" "}
              <Link href="/terms" className="text-[#f7cf1d] hover:underline">
                Terms of Service
              </Link>
            </p>
          </CardFooter>
        </Card>
        <div className="mt-8">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/devote%20logo-BS33Hv8xS0OR5PqONeZaMOF2cqnKd6.png"
            alt="DeVote Logo"
            width={100}
            height={100}
            priority
          />
        </div>
      </main>
    </div>
  );
}
