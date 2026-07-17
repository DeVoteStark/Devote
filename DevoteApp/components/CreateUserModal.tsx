"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Mail, Clock, AlertTriangle } from "lucide-react"

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
}

type ModalStep = 'create' | 'verification' | 'success'

export default function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const [email, setEmail] = useState("")
  const [userId, setUserId] = useState("")
  const [userName, setUserName] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  
  const [currentStep, setCurrentStep] = useState<ModalStep>('create')
  const [isCreating, setIsCreating] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  
  const [createdUser, setCreatedUser] = useState<any>(null)
  const [verificationExpiry, setVerificationExpiry] = useState<Date | null>(null)
  const [attemptsLeft, setAttemptsLeft] = useState(5)
  
  const { toast } = useToast()

  // Reset all states when modal closes
  const handleClose = () => {
    setEmail("")
    setUserId("")
    setUserName("")
    setVerificationCode("")
    setCurrentStep('create')
    setCreatedUser(null)
    setVerificationExpiry(null)
    setAttemptsLeft(5)
    setSearchError("")
    onClose()
  }

  // Search citizen function (unchanged)
  const handleSearchCitizen = async () => {
    if (!userId) {
      setSearchError("Please enter a User ID.")
      return
    }
    setSearchLoading(true)
    setSearchError("")
    try {
      const res = await fetch(`/api/citizens?ine=${encodeURIComponent(userId)}`)
      if (!res.ok) {
        setUserName("")
        setSearchError("Citizen not found.")
        return
      }
      const data = await res.json()
      // Se asume que la respuesta tiene los campos firstName y lastName
      if (data && data.firstName && data.lastName) {
        const fullName = `${data.firstName} ${data.lastName}`
        setUserName(fullName)
      } else {
        setUserName("")
        setSearchError("Citizen not found or invalid data.")
      }
    } catch (error) {
      console.error("Error searching citizen:", error)
      setUserName("")
      setSearchError("Error searching citizen.")
    } finally {
      setSearchLoading(false)
    }
  }

  // Create user function (updated for verification flow)
  const handleCreateUser = async () => {
    setIsCreating(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ine: userId })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        toast({
          title: "Error",
          description: data.message || "Failed to create user",
          variant: "destructive",
        })
        setIsCreating(false)
        return
      }

      setCreatedUser(data.user)
      setVerificationExpiry(new Date(data.expiresAt))
      setCurrentStep('verification')
      
      toast({
        title: "User Created",
        description: `Account created for ${data.user.name}. Verification email sent!`,
        duration: 5000,
        variant: "success",
      })
      
    } catch (error) {
      console.error("Error creating user:", error)
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  // Verify email code
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
          // Reset to allow resending
          setVerificationCode("")
        }
        
        setIsVerifying(false)
        return
      }

      setCurrentStep('success')
      
      toast({
        title: "Email Verified!",
        description: "User account is now fully activated",
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

  // Resend verification email
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

      setVerificationExpiry(new Date(data.expiresAt))
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

  // Format time remaining
  const getTimeRemaining = () => {
    if (!verificationExpiry) return ""
    
    const now = new Date()
    const timeLeft = verificationExpiry.getTime() - now.getTime()
    
    if (timeLeft <= 0) return "Expired"
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`
    }
    return `${minutes}m remaining`
  }

  const renderCreateStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-[#f7cf1d]">Create New User</DialogTitle>
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
            placeholder="user@example.com"
          />
        </div>
        <div className="flex items-end space-x-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="userId">User ID (INE)</Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Enter INE number"
            />
          </div>
          <Button
            onClick={handleSearchCitizen}
            disabled={searchLoading || !userId}
            className="mb-2 bg-blue-500 text-white hover:bg-blue-600"
          >
            {searchLoading ? "Searching..." : "Search"}
          </Button>
        </div>
        {searchError && <p className="text-red-500 text-sm">{searchError}</p>}
        <div className="space-y-2">
          <Label htmlFor="userName">User Name</Label>
          <Input
            id="userName"
            value={userName}
            readOnly
            className="bg-gray-800 border-gray-700 text-white opacity-50"
            placeholder="Name will appear after search"
          />
        </div>
        <Button
          onClick={handleCreateUser}
          disabled={!userName || !email || isCreating}
          className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
        >
          {isCreating ? "Creating User..." : "Create User & Send Verification"}
        </Button>
      </div>
    </>
  )

  const renderVerificationStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-[#f7cf1d] flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Email Verification
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm text-blue-100">
                We've sent a 6-digit verification code to:
              </p>
              <p className="font-medium text-white">{email}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="verificationCode">Verification Code</Label>
          <Input
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="bg-gray-800 border-gray-700 text-white text-center text-2xl font-mono tracking-widest"
            placeholder="000000"
            maxLength={6}
          />
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="w-4 h-4" />
              {getTimeRemaining()}
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
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            {isResending ? "Sending..." : "Resend"}
          </Button>
        </div>

        <div className="text-center">
          <Button
            onClick={() => setCurrentStep('create')}
            variant="link"
            className="text-gray-400 hover:text-white"
          >
            ← Back to user creation
          </Button>
        </div>
      </div>
    </>
  )

  const renderSuccessStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-[#f7cf1d] flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Account Verified!
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Welcome, {createdUser?.name}!
          </h3>
          <p className="text-green-100 text-sm mb-4">
            Your email has been successfully verified and your account is now active.
          </p>
          <div className="space-y-2 text-sm text-gray-300">
            <p><strong>Email:</strong> {createdUser?.email}</p>
            <p><strong>Wallet ID:</strong> {createdUser?.walletId?.slice(0, 20)}...</p>
          </div>
        </div>

        <Button
          onClick={handleClose}
          className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
        >
          Complete Setup
        </Button>
      </div>
    </>
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 text-white max-w-md">
        {currentStep === 'create' && renderCreateStep()}
        {currentStep === 'verification' && renderVerificationStep()}
        {currentStep === 'success' && renderSuccessStep()}
      </DialogContent>
    </Dialog>
  )
}