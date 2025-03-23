"use client";

import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useContractCustom } from "@/hooks/use-contract";
import { useEffect, useState } from "react";
import { ProposalPublic } from "@/interfaces/Proposal";
import Header from "@/components/Header";
import { useWallet } from "@/hooks/use-wallet";
import { loginStatus } from "@/interfaces/Login";

export default function ResultsPage() {
  const { getMyProposals } = useContractCustom();
  const [activeVotingResults, setActiveVotingResults] = useState<
    ProposalPublic[]
  >([]);
  const { connectionStatus, address } = useWallet();

  useEffect(() => {
    const fetchData = async () => {
      if (!!address && connectionStatus === loginStatus.CONNECTED) {
        const proposals = await getMyProposals(1, address);
        setActiveVotingResults(proposals);
      }
    };
    fetchData();
  }, [address, connectionStatus]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 relative">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#f7cf1d]">
          Current Voting Results
        </h1>
        <div className="grid gap-6 md:grid-cols-2">
          {activeVotingResults.map((voting) => (
            <Card key={voting.id} className="bg-gray-900 border-[#f7cf1d]">
              <CardHeader>
                <CardTitle className="text-[#f7cf1d]">{voting.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {voting.type_votes.map((option, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between mb-1 text-white">
                      <span>{option.vote_type}</span>
                      <span>{option.count} votes</span>
                    </div>
                    <div className="w-full rounded-full h-2.5 mb-4 bg-gray-700">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          backgroundColor: "#f7cf1d",
                          width: `${(option.count / voting.total_voters) * 100
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
        <div className="absolute bottom-4 right-8">
          <Button
            asChild
            className="bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
          >
            <Link href="/past-results">View Past Results</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
