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
import { User } from "@/interfaces/User";
import { useToast } from "@/components/ui/use-toast";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { connectWallet, connectionStatus } = useWallet();
  const { toast } = useToast();

  const handleLogin = async () => {
    try {
      const encodedEmail = encodeURIComponent(email);
      const res = await fetch(`/api/login/${encodedEmail}`);
      const user: User = await res.json();
      console.log("User data:", user);
      if (user?.secretKey && user?.walletId) {
        console.log("conecting wallet");
        connectWallet(user.secretKey, password, user.walletId);
      } else {
        toast({
          title: "Error",
          description: "Error logging in",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast({
        title: "Error",
        description: "Error logging in",
        variant: "destructive",
      });
    }
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
              disabled={!email || !password}
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
