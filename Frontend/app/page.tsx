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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { loginStatus } from "@/interfaces/Login";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { connectWallet, connectionStatus } = useWallet();

  const handleLogin = () => {
    // Todo: Implement login logic from DB
    console.log("conecting wallet");
    connectWallet(
      "294af90c34c0c2198534e93539c6494e8c7124c027df69be5cc9cf2522fb665ac1629955fd09ae0d2b99a2fc6e0ffc78b1c5d8a74a098fcf1bb2f85990010551b515fa4d1ca47311f70207b5bad380a672c554feec1573c130627a30975a0522327ed238cec77d433406eda7fd94ff0eaf01aedb271df244e796dd19bd180caeb6c771ebd482d2ef3d48b82acd1c2cc4f8d8063efb2e1ca00e60c5355cda3d5b07e0067729eed677337e0b3404cd13e7",
      "1234",
      "0x6e00557e1d7bef4c2411a73db351f12cc19e388d17d022a97e5430b029ecd13"
    );
  };

  useEffect(() => {
    if (connectionStatus === loginStatus.CONNECTED) {
      router.push("/dashboard");
    }
  }, [connectionStatus]);

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
            {/*isDisconnected ? (
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
            )*/}
            {
              <div className="space-y-2">
                <Label className="text-gray-400" htmlFor="email">
                  User Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Label className="text-gray-400" htmlFor="email">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            }
            <Button
              className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
              onClick={handleLogin}
            >
              Login
            </Button>
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
