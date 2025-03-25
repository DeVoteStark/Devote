"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { useContractCustom } from "@/hooks/use-contract";

enum RoleToRoleNumber {
  voter = 2,
  admin = 3
}

export default function EditProposalPage({ params }: { params: { id: string } }) {
  const [proposalId, setProposalId] = useState(params.id);
  const { addVoter, modifyVoters } = useContractCustom();
  const [selectedVoter, setSelectedVoter] = useState("");
  const [voterRole, setVoterRole] = useState("voter");
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [votingOptions, setVotingOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) {
          console.error("Failed to fetch users");
          return;
        }
        const data = await res.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddVoter = async () => {
    try {
      if (!proposalId || !selectedVoter) {
        toast({
          title: "Error",
          description: "Proposal ID and voter wallet must be provided.",
          variant: "destructive",
        });
        return;
      }

      const result = await addVoter(proposalId, selectedVoter);
      console.log("Voter added result:", result);
      toast({
        title: "Voter Added",
        description: "The voter has been successfully added to the proposal.",
        duration: 3000,
      });
      setSelectedVoter("");
    } catch (error) {
      console.error("Error adding voter:", error);
      toast({
        title: "Error",
        description: "Failed to add voter to the proposal.",
        variant: "destructive",
      });
    }
  };

  const handleModifyVoter = async () => {
    try {
      if (!proposalId || !selectedVoter || !voterRole) {
        toast({
          title: "Error",
          description: "Proposal ID, voter wallet and voter role must be provided.",
          variant: "destructive",
        });
        return;
      }

      const roleNumber = voterRole === "admin" ? RoleToRoleNumber.admin : RoleToRoleNumber.voter;
      const result = await modifyVoters(proposalId, selectedVoter, roleNumber);
      console.log("Voter modified result: ", result);
      toast({
        title: "Role Changed Successfully",
        description: `Voter's role has been updated to ${voterRole}.`,
        duration: 3000,
      });
      setShowRoleSelection(false);
    } catch (error) {
      console.error("Error modifying voter: ", error);
      toast({
        title: "Error",
        description: "Failed to modify voter in the proposal.",
        variant: "destructive"
      })
    }
  };

  const handleDeleteVoter = () => {
    console.log("Deleting voter:", { proposalId, selectedVoter });
    setSelectedVoter("");
    toast({
      title: "Voter Deleted",
      description: "The voter has been successfully removed from the proposal.",
      duration: 3000,
    });
  };

  const handleStartVoting = () => {
    console.log("Starting voting for proposal:", proposalId);
    toast({
      title: "Voting Started",
      description: "Voting has been successfully started for this proposal.",
      duration: 3000,
    });
  };

  const handleEndVoting = () => {
    console.log("Ending voting for proposal:", proposalId);
    toast({
      title: "Voting Ended",
      description: "Voting has been successfully ended for this proposal.",
      duration: 3000,
    });
  };

  const handleAddOption = () => {
    if (newOption.trim() !== "") {
      setVotingOptions([...votingOptions, newOption.trim()]);
      setNewOption("");
    }
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = votingOptions.filter((_, i) => i !== index);
    setVotingOptions(newOptions);
  };

  const handleBackToDashboard = () => {
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#f7cf1d]">Edit Proposal</h1>
          <Button onClick={handleBackToDashboard} className="h-10 px-4 py-2 bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gray-900 border-[#f7cf1d]">
            <CardHeader>
              <CardTitle className="text-[#f7cf1d]">Manage Voters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-white space-y-2">
                <Label htmlFor="voterSelect">Select Voter</Label>
                <Select onValueChange={setSelectedVoter} value={selectedVoter}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select a voter" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user._id} value={user.walletId}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={handleAddVoter}
                  className="w-full h-10 px-4 py-2 bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
                >
                  Add Voter
                </Button>
                <div className="space-y-2">
                  <Button
                    onClick={() => setShowRoleSelection(true)}
                    className="w-full h-10 px-4 py-2 bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
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
                      <Button
                        onClick={handleModifyVoter}
                        className="w-full h-10 px-4 py-2 bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
                      >
                        Confirm Role Change
                      </Button>
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleDeleteVoter}
                  className="w-full h-10 px-4 py-2 bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
                >
                  Delete Voter
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-[#f7cf1d]">
            <CardHeader>
              <CardTitle className="text-[#f7cf1d]">Manage Voting Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-white space-y-2">
                <Label htmlFor="newOption">Add New Option</Label>
                <div className="flex space-x-2">
                  <Input
                    id="newOption"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white flex-grow"
                  />
                  <Button
                    onClick={handleAddOption}
                    className="h-10 px-4 py-2 bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
                  >
                    Add
                  </Button>
                </div>
              </div>
              <div className="text-white space-y-2">
                <Label>Current Options</Label>
                {votingOptions.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="flex-grow">{option}</span>
                    <Button
                      onClick={() => handleRemoveOption(index)}
                      className="bg-red-900 hover:bg-red-800 text-white"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-[#f7cf1d] md:col-span-2">
            <CardHeader>
              <CardTitle className="text-[#f7cf1d]">Manage Voting Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-white space-y-2">
                <Label htmlFor="managementProposalId">Proposal ID</Label>
                <Input
                  id="managementProposalId"
                  value={proposalId}
                  onChange={(e) => setProposalId(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  disabled
                />
              </div>
              <div className="flex justify-between space-x-4">
                <Button
                  onClick={handleStartVoting}
                  className="flex-1 h-10 px-4 py-2 bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
                >
                  Start Voting
                </Button>
                <Button
                  onClick={handleEndVoting}
                  className="flex-1 h-10 px-4 py-2 bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
                >
                  End Voting
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
