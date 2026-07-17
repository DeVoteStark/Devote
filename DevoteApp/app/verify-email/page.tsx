"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Mail, Clock, AlertTriangle, ArrowLeft } from "lucide-react"

export default function EmailVerificationPage() {
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [attemptsLeft, setAttemptsLeft] = useState(5)
  const [timeRemaining, setTimeRemaining] = useState("")
  const [userInfo, setUserInfo] = useState<any>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const email = searchParams.get('email')

  useEffect(() => {
    if (!email) {
      router.push('/')
      return
    }

    // Check verification status on load
    checkVerificationStatus()
  }, [email])

  useEffect(() => {
    // Update time remaining every minute
    const interval = setInterval(() => {
      updateTimeRemaining()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const checkVerificationStatus = async () => {
    try {
      const res = await fetch(`/api/auth/check-verification-status?email=${encodeURIComponent(email!)}`)
      const data = await res.json()

      if (res.ok) {
        if (data.isEmailVerified) {
          setIsVerified(true)
          return
        }
        
        setAttemptsLeft(5 - data.attemptsUsed)
        updateTimeRemaining()
      }
    } catch (error) {
      console.error("Error checking verification status:", error)
    }
  }

  const updateTimeRemaining = () => {
    // This would need to be implemented based on the backend response
    // For now, i am using a placeholder
    setTimeRemaining("4h 32m remaining")
  }

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit verification code",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        if (data.attemptsLeft !== undefined) {
          setAttemptsLeft(data.attemptsLeft)
        }
        
        toast({
          title: "Verification Failed",
          description: data.message,
          variant: "destructive",
        })
        
        if (data.requireNewCode) {
          setVerificationCode("")
        }
        
        setIsVerifying(false)
        return
      }

      setIsVerified(true)
      setUserInfo(data.user)
      
      toast({
        title: "Email Verified!",
        description: "Your account is now fully activated",
        duration: 5000,
        variant: "success",
      })
      
    } catch (error) {
      console.error("Error verifying code:", error)
      toast({
        title: "Error",
        description: "Failed to verify code",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    try {
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        })
        setIsResending(false)
        return
      }

      setVerificationCode("")
      setAttemptsLeft(5)
      
      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email",
        duration: 3000,
        variant: "success",
      })
      
    } catch (error) {
      console.error("Error resending code:", error)
      toast({
        title: "Error",
        description: "Failed to resend verification code",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p>Invalid verification link</p>
          <Button
            onClick={() => router.push('/')}
            className="mt-4 bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
          >
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
            <h1 className="text-2xl font-bold text-[#f7cf1d]">
              Email Verified!
            </h1>
            <p className="text-green-100">
              Welcome, {userInfo?.name || 'User'}! Your email has been successfully verified and your account is now active.
            </p>
            
            {userInfo && (
              <div className="bg-gray-900 rounded-lg p-4 space-y-2 text-sm text-gray-300">
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>Account ID:</strong> {userInfo.id}</p>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => router.push('/dashboard')}
                className="flex-1 bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
              >
                Go to Dashboard
              </Button>
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-6">
        <div className="space-y-6">
          <div className="text-center">
            <Mail className="w-12 h-12 text-[#f7cf1d] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#f7cf1d] mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-300 text-sm">
              We've sent a 6-digit verification code to:
            </p>
            <p className="font-medium text-white mt-1">{email}</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verificationCode" className="text-white">
                Verification Code
              </Label>
              <Input
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="bg-gray-700 border-gray-600 text-white text-center text-2xl font-mono tracking-widest"
                placeholder="000000"
                maxLength={6}
                autoFocus
              />
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-gray-400">
                  <Clock className="w-4 h-4" />
                  {timeRemaining}
                </div>
                <div className="text-gray-400">
                  {attemptsLeft} attempts left
                </div>
              </div>
            </div>

            {attemptsLeft <= 2 && attemptsLeft > 0 && (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <p className="text-sm text-yellow-100">
                    Only {attemptsLeft} attempts remaining. Double-check your code.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleVerifyCode}
                disabled={verificationCode.length !== 6 || isVerifying}
                className="flex-1 bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
              >
                {isVerifying ? "Verifying..." : "Verify Code"}
              </Button>
              <Button
                onClick={handleResendCode}
                disabled={isResending}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                {isResending ? "Sending..." : "Resend"}
              </Button>
            </div>

            <div className="text-center pt-4">
              <Button
                onClick={() => router.push('/')}
                variant="link"
                className="text-gray-400 hover:text-white inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}