"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useContractCustom } from "@/hooks/use-contract"
import { useWallet } from "@/hooks/use-wallet"
import { loginStatus } from "@/interfaces/Login"
import { shortString } from "starknet"

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
  const [email, setEmail] = useState("")
  const [userId, setUserId] = useState("")
  const [userName, setUserName] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const { toast } = useToast()
  const { createPersonOnChain, createAdminOnChain } = useContractCustom()
  const { connectionStatus, address } = useWallet()

  const isConnected = connectionStatus === loginStatus.CONNECTED

  // Function to search for citizen information
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

  // Function to create user on blockchain
  const handleCreateUser = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a user on the blockchain",
        variant: "destructive",
      })
      return
    }

    if (!userId || !walletAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      // Convert userId to felt252 format
      const userIdFelt = shortString.encodeShortString(userId)

      // Create user on blockchain
      let result
      if (isAdmin) {
        result = await createAdminOnChain(userIdFelt)
      } else {
        result = await createPersonOnChain(userIdFelt, walletAddress)
      }

      if (result) {
        // Also create user in the database
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            ine: userId,
            walletAddress,
            isAdmin
          })
        })

        if (res.ok) {
          const data = await res.json()
          toast({
            title: "Success!",
            description: `User created successfully on blockchain and database. Transaction hash: ${result.transaction_hash}`,
            variant: "default",
          })
        } else {
          toast({
            title: "Partial Success",
            description: `User created on blockchain but database creation failed. Transaction hash: ${result.transaction_hash}`,
            variant: "default",
          })
        }

        // Reset form
        setEmail("")
        setUserId("")
        setUserName("")
        setWalletAddress("")
        setIsAdmin(false)
        onClose()
      }
    } catch (error) {
      console.error("Error creating user on blockchain:", error)
      toast({
        title: "Error",
        description: `Failed to create user on blockchain: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#f7cf1d]">Create New User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Wallet Connection Status */}
          <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm">
                {isConnected ? `Wallet Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Wallet Not Connected'}
              </span>
            </div>
          </div>

          {/* Email Field */}
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

          {/* User ID Field with Search */}
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

          {/* Search Error */}
          {searchError && <p className="text-red-500 text-sm">{searchError}</p>}

          {/* User Name Field */}
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

          {/* Wallet Address Field */}
          <div className="space-y-2">
            <Label htmlFor="walletAddress">Wallet Address</Label>
            <Input
              id="walletAddress"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="0x..."
            />
          </div>

          {/* Admin Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isAdmin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-[#f7cf1d]"
            />
            <Label htmlFor="isAdmin" className="cursor-pointer">
              Create as Admin
            </Label>
          </div>

          {/* Create User Button */}
          <Button
            onClick={handleCreateUser}
            disabled={!isConnected || !userId || !walletAddress || isCreating}
            className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e] disabled:opacity-50"
          >
            {isCreating ? "Creating User..." : `Create ${isAdmin ? 'Admin' : 'User'} on Blockchain`}
          </Button>

          {/* Help Text */}
          <div className="text-sm text-gray-400 space-y-1">
            <p>• This will create a user directly on the Starknet blockchain</p>
            <p>• Make sure your wallet is connected and has sufficient funds</p>
            <p>• The transaction will be recorded permanently on the blockchain</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}