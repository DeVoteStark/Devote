"use client"

import { useState } from "react"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function EditProposalPage({ params }: { params: { id: string } }) {
  const [proposalId, setProposalId] = useState(params.id)
  const [selectedVoter, setSelectedVoter] = useState("")
  const [voterRole, setVoterRole] = useState("voter")
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const { toast } = useToast()

  const loggedInUsers = [
    { id: "1", name: "Alice (0x1234...5678)" },
    { id: "2", name: "Bob (0x5678...9ABC)" },
    { id: "3", name: "Charlie (0x9ABC...DEF0)" },
  ]

  const handleAddVoter = () => {
    console.log("Adding voter:", { proposalId, selectedVoter })
    setSelectedVoter("")
  }

  const handleModifyVoter = () => {
    console.log("Modifying voter:", { proposalId, selectedVoter, voterRole })
    setSelectedVoter("")
    setVoterRole("voter")
    setShowRoleSelection(false)
    toast({
      title: "Role Changed Successfully",
      description: `Voter's role has been updated to ${voterRole}.`,
      duration: 3000,
    })
  }

  const handleDeleteVoter = () => {
    console.log("Deleting voter:", { proposalId, selectedVoter })
    setSelectedVoter("")
  }

  const handleStartVoting = () => {
    console.log("Starting voting for proposal:", proposalId)
  }

  const handleEndVoting = () => {
    console.log("Ending voting for proposal:", proposalId)
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#f7cf1d]">Edit Proposal</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gray-900 border-[#f7cf1d]">
            <CardHeader>
              <CardTitle className="text-[#f7cf1d]">Manage Voters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="voterSelect">Select Voter</Label>
                <Select onValueChange={setSelectedVoter} value={selectedVoter}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select a voter" />
                  </SelectTrigger>
                  <SelectContent>
                    {loggedInUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Button onClick={handleAddVoter} className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]">
                  Add Voter
                </Button>
                <div className="space-y-2">
                  <Button
                    onClick={() => setShowRoleSelection(true)}
                    className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
                  >
                    Modify Voter
                  </Button>
                  {showRoleSelection && (
                    <div className="space-y-2">
                      <Label htmlFor="voterRole">Voter's Role</Label>
                      <Select onValueChange={setVoterRole} value={voterRole}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="voter">Voter</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={handleModifyVoter} className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]">
                        Confirm Role Change
                      </Button>
                    </div>
                  )}
                </div>
                <Button onClick={handleDeleteVoter} className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]">
                  Delete Voter
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-[#f7cf1d]">
            <CardHeader>
              <CardTitle className="text-[#f7cf1d]">Manage Voting Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="managementProposalId">Proposal ID</Label>
                <Input
                  id="managementProposalId"
                  value={proposalId}
                  onChange={(e) => setProposalId(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Button onClick={handleStartVoting} className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]">
                  Start Voting
                </Button>
                <Button onClick={handleEndVoting} className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]">
                  End Voting
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

