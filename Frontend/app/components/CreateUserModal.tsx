"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const [email, setEmail] = useState("")
  const [userId, setUserId] = useState("")
  const [userName, setUserName] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    // Simulating database lookup based on user ID
    // In a real application, this would be an API call to your backend
    const fetchUserName = async () => {
      if (userId) {
        // Simulated delay to mimic API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        // Dummy logic to generate a name based on ID
        const generatedName = `User ${userId}`
        setUserName(generatedName)
      } else {
        setUserName("")
      }
    }

    fetchUserName()
  }, [userId])

  const handleCreateUser = () => {
    console.log("Creating user:", { email, userId, userName })
    toast({
      title: "User Created",
      description: `New user account created for ${userName}`,
      duration: 3000,
    })
    setEmail("")
    setUserId("")
    setUserName("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white">
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userName">User Name</Label>
            <Input
              id="userName"
              value={userName}
              readOnly
              className="bg-gray-800 border-gray-700 text-white opacity-50"
            />
          </div>
          <Button onClick={handleCreateUser} className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]">
            Create User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

