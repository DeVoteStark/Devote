"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function VerifySignupContent() {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid verification link. Please contact support.");
    }
  }, [token]);

  const handleResendOtp = async () => {
    if (!token) return;
    
    setIsResendingOtp(true);
    setError("");
    
    try {
      const response = await fetch("/api/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("A new OTP has been sent to your email address.");
      } else {
        setError(data.message || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      setError("Failed to resend OTP. Please check your internet connection.");
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !otp || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          otp,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Email verified successfully! Your wallet has been created. Redirecting to login...");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError(data.message || "Verification failed. Please try again.");
      }
    } catch (error) {
      setError("Verification failed. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <Card className="w-full max-w-md bg-gray-900 border-[#f7cf1d]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#f7cf1d]">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter the verification code sent to your email and create your password
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert className="border-red-500 bg-red-500/10">
                <AlertDescription className="text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="border-green-500 bg-green-500/10">
                <AlertDescription className="text-green-400">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="otp" className="text-white">
                Verification Code
              </Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  disabled={isLoading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="border-gray-600 bg-gray-800 text-white" />
                    <InputOTPSlot index={1} className="border-gray-600 bg-gray-800 text-white" />
                    <InputOTPSlot index={2} className="border-gray-600 bg-gray-800 text-white" />
                    <InputOTPSlot index={3} className="border-gray-600 bg-gray-800 text-white" />
                    <InputOTPSlot index={4} className="border-gray-600 bg-gray-800 text-white" />
                    <InputOTPSlot index={5} className="border-gray-600 bg-gray-800 text-white" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendOtp}
                  disabled={isResendingOtp || isLoading}
                  className="text-[#f7cf1d] hover:text-[#e6bc18] p-0 h-auto"
                >
                  {isResendingOtp ? "Sending..." : "Resend Code"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Create Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="border-gray-600 bg-gray-800 text-white placeholder-gray-400"
                disabled={isLoading}
                minLength={8}
                required
              />
              <p className="text-xs text-gray-400">
                Password must be at least 8 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="border-gray-600 bg-gray-800 text-white placeholder-gray-400"
                disabled={isLoading}
                minLength={8}
                required
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-[#f7cf1d] text-black hover:bg-[#e6bc18]"
              disabled={isLoading || !token || !otp || !password || !confirmPassword}
            >
              {isLoading ? "Verifying..." : "Verify Email & Create Account"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}