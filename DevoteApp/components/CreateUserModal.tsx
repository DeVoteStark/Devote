"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"


interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const [email, setEmail] = useState("")
  const [userId, setUserId] = useState("")
  const [userName, setUserName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState("")
  const { toast } = useToast()

  // Función que se ejecuta al presionar el botón "Search" para buscar el citizen
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

  // Función que se ejecuta al presionar "Create User"
  const handleCreateUser = async () => {
    setIsCreating(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Enviamos "ine" usando el valor de userId (que es el INE del citizen)
        body: JSON.stringify({ email, ine: userId })
      })
      if (!res.ok) {
        const errorData = await res.json()
        toast({
          title: "Error",
          description: errorData.message || "Failed to create user",
          variant: "destructive",
        })
        setIsCreating(false)
        return
      }
      const data = await res.json()
      toast({
        title: "User Created",
        description: `New user account created for ${data.user.name}`,
        duration: 3000,
        variant: "success",
      })
      setEmail("")
      setUserId("")
      setUserName("")
      onClose()
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
          <div className="flex items-end space-x-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="userId">User ID (INE)</Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
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
            />
          </div>
          <Button
            onClick={handleCreateUser}
            disabled={!userName || isCreating}
            className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
          >
            {isCreating ? "Creating..." : "Create User"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}