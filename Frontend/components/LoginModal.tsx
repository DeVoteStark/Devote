"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import { loginStatus } from "@/interfaces/Login";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { toast } = useToast();
  const { connectWallet, connectionStatus } = useWallet();
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const res = await fetch(`/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to log in",
          variant: "destructive",
        });
        setIsLoggingIn(false);
        return;
      }

      const user = await res.json();
      toast({
        title: "Login Successful",
        description: `Welcome back!`,
        duration: 3000,
      });
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

      setEmail("");
      setPassword("");
      onClose();
    } catch (error) {
      console.error("Error logging in:", error);
      toast({
        title: "Error",
        description: "Failed to log in",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    if (connectionStatus === loginStatus.CONNECTED) {
      router.push("/dashboard");
    }
  }, [connectionStatus]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-[#f7cf1d]">Log In</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <Button
            onClick={handleLogin}
            disabled={!email || !password || isLoggingIn}
            className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
          >
            {isLoggingIn ? "Logging In..." : "Log In"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
