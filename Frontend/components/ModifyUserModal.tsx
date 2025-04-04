"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"


interface ModifyUserModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ModifyUserModal({ isOpen, onClose }: ModifyUserModalProps) {
  const [email, setEmail] = useState("")
  const [userFound, setUserFound] = useState(false)
  const [role, setRole] = useState("")
  const { toast } = useToast()

  const handleEmailSubmit = () => {
    // Simulating user verification
    // In a real application, this would be an API call to your backend
    setTimeout(() => {
      setUserFound(true)
      setRole("voter") // Assuming default role is voter
      toast({
        title: "User Found",
        description: "User account has been verified.",
        duration: 3000,
      })
    }, 1000)
  }

  const handleRoleChange = (newRole: string) => {
    setRole(newRole)
  }

  const handleModifyUser = () => {
    console.log("Modifying user:", { email, role })
    toast({
      title: "User Modified",
      description: `User role has been updated to ${role}`,
      duration: 3000,
      variant: "success",
    })
    setEmail("")
    setUserFound(false)
    setRole("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-[#f7cf1d]">Modify User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">User Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          {!userFound && (
            <Button onClick={handleEmailSubmit} className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]">
              Verify User
            </Button>
          )}
          {userFound && (
            <>
              <div className="space-y-2">
                <Label htmlFor="role">User Role</Label>
                <Select onValueChange={handleRoleChange} value={role}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="voter">Voter</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleModifyUser} className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]">
                Update User Role
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

