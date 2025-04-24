"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useContractCustom } from "@/hooks/use-contract";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import {
  generateAndDeployNewWalletFromPrivateKey,
} from "@/lib/starknet/createWallet"

export default function CreatePasswordPage() {
  const [password, setPassword] = useState("")
  const { createAdminOnChain } = useContractCustom();
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [userId, setUserId] = useState<string | undefined>(undefined)
  const [walletId, setWalletId] = useState("")
  const [secretKey, setSecretKey] = useState("")
  
  const router = useRouter()
  const searchParams = useSearchParams()

  // Extraer el ID del usuario desde la URL
  useEffect(() => {
    const idParam = searchParams.get("id")
    if (idParam) {
      setUserId(idParam)
      fetch(`/api/users/${idParam}`)
        .then((res) => res.json())
        .then((data) => {
        console.log("User data: ", data.user)
          if (data && data.user) {
            console.log("User data: ", data.user)
            setWalletId(data.user.walletId)
            setSecretKey(data.user.secretKey)
          }
        })
        .catch((error) => console.error("Error fetching user data:", error))
    }
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.")
      return
    }
    // Abrir el modal de confirmación
    setIsModalOpen(true)
  }

  const handleConfirm = async () => {
    try {
      // Llamar a la función para desplegar la wallet usando el secretKey obtenido del usuario
      console.log("Deploying wallet with secretKey: ", secretKey)
      await generateAndDeployNewWalletFromPrivateKey(secretKey, "1234")
      
      // Luego, crear el admin en cadena utilizando el userId
      if (userId) {
        const result = await createAdminOnChain(userId)
        console.log("Admin creation result:", result)
      }
      // Redirigir al usuario a la página principal
      router.push("/")
    } catch (error) {
      console.error("Error deploying wallet and creating admin:", error)
    }
  }



  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-gray-100 p-4">
      <Card className="w-full max-w-md bg-gray-900 border-[#f7cf1d]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#f7cf1d]">
            Create Your Password
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            Congratulations! Your account has been created. Now set a password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 text-white">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div className="bg-black text-red-500 border border-red-700 p-4 rounded-lg text-center max-w-md mx-auto font-semibold">
              Your password cannot be recovered. <br/> DeVote does not store or have access to your password, so please remember it.
            </div>
            <Button type="submit" className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]">
              Confirm Password
            </Button>
          </form>
        </CardContent>
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle className="text-[#f7cf1d]">Confirm Your Password</DialogTitle>
            <DialogDescription className="text-gray-400">
              Please verify that you have remembered your password and understand that it cannot be recovered.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={isChecked}
              onCheckedChange={() => setIsChecked(!isChecked)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none"
            >
              I understand that my password cannot be recovered if lost.
            </label>
          </div>
          <DialogFooter>
            <Button
              onClick={handleConfirm}
              disabled={!isChecked}
              className="bg-[#f7cf1d] text-black hover:bg-[#e5bd0e] disabled:opacity-50"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
