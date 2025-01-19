"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useContractCustom } from "@/hooks/use-contract";
import { ProposalPublic, ProposalVoteTypeStruct } from "@/interfaces/Proposal";
import { useParams } from "next/navigation";
import { useAccount } from "@starknet-react/core";

/*const votingOptions = [
  { id: 1, name: "Option A", description: "First proposed solution" },
  { id: 2, name: "Option B", description: "Second proposed solution" },
  { id: 3, name: "Option C", description: "Third proposed solution" },
];*/

export default function VotingStationPage() {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [proposal, setProposal] = useState<ProposalPublic>();
  const { getProposal, vote } = useContractCustom();
  const [votingOptions, setVotingOptions] = useState<ProposalVoteTypeStruct[]>(
    []
  );
  const params = useParams<{ id: string }>();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const fetchData = async () => {
      console.log("Proposal", isConnected, address);
      if (!!address && isConnected) {
        const proposal = await getProposal(params.id, address);
        setVotingOptions(proposal.type_votes);
        console.log("Proposal", proposal);
        setProposal(proposal);
      }
    };
    fetchData();
  }, [params.id, address, isConnected]);

  const handleVote = async () => {
    if (selectedOption) {
      // Here you would typically send the vote to your backend
      console.log(`Voted for option: ${selectedOption}`);
      const result = await vote(params.id, selectedOption);
      console.log("Result votation", result);
      if (!!proposal)
        setProposal({
          ...proposal,
          voter: { has_voted: true, role: proposal?.voter.role ?? 0 },
        });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#f7cf1d]">
          {proposal?.name}
        </h1>

        <Card className="bg-gray-900 border-[#f7cf1d] max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-[#f7cf1d]">Cast Your Vote</CardTitle>
            <CardDescription className="text-gray-400">
              Choose your preferred option for {proposal?.name} project
            </CardDescription>
          </CardHeader>
          <CardContent>
            {proposal?.voter?.has_voted ? (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-[#f7cf1d] mb-4">
                  Thank you for voting!
                </h2>
                <p className="text-gray-300">
                  Your vote has been recorded successfully.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <RadioGroup
                  value={selectedOption}
                  onValueChange={setSelectedOption}
                >
                  {votingOptions.map((option) => (
                    <div
                      key={option.vote_type}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={option.vote_type.toString()}
                        id={option.vote_type.toString()}
                        className="border-[#f7cf1d] text-[#f7cf1d]"
                      />
                      <Label
                        htmlFor={option.vote_type.toString()}
                        className="text-gray-200 cursor-pointer"
                      >
                        {option.vote_type}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <Button
                  onClick={handleVote}
                  disabled={!selectedOption}
                  className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e] disabled:opacity-50"
                >
                  Submit Vote
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
