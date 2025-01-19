"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { useContractCustom } from "@/hooks/use-contract";
import { ProposalPublic } from "@/interfaces/Proposal";
import { useAccount } from "@starknet-react/core";

const participationStats = {
  totalVoters: 50000,
  activeVoters: 35000,
  averageTurnout: "70%",
};

export default function PastResultsPage() {
  const { getMyProposals } = useContractCustom();
  const [pastVotings, setPastVoting] = useState<ProposalPublic[]>([]);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    const fetchData = async () => {
      if (!!address && isConnected) {
        const proposals = await getMyProposals(2, address);
        setPastVoting(proposals);
      }
    };
    fetchData();
  }, [address, isConnected]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#f7cf1d]">
          Past Voting Results
        </h1>
        <div className="grid gap-6 md:grid-cols-2">
          {pastVotings.map((voting) => (
            <Card key={voting.id} className="bg-gray-900 border-[#f7cf1d]">
              <CardHeader>
                <CardTitle className="text-[#f7cf1d]">{voting.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-white">
                  Total Votes: {voting.total_voters}
                </p>
                {voting.type_votes.map((option) => (
                  <div key={option.vote_type} className="mb-4">
                    <div className="flex justify-between mb-1 text-white">
                      <span>{option.vote_type}</span>
                      <span>{(option.count / voting.total_voters) * 100}%</span>
                    </div>
                    <div className="w-full rounded-full h-2.5 mb-4 bg-gray-700">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          backgroundColor: "#f7cf1d",
                          width: `${
                            (option.count / voting.total_voters) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
