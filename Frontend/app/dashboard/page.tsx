"use client";

import Footer from "../components/Footer";
import AIAgent from "../components/AIAgent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useContractCustom } from "@/hooks/use-contract";
import { ProposalPublic } from "@/interfaces/Proposal";
import { useAccount } from "@starknet-react/core";
import Header from "../components/Header";
import { useWallet } from "@/hooks/use-wallet";
import { loginStatus } from "@/interfaces/Login";

export default function DashboardPage() {
  const [activeVotings, setActiveVotings] = useState<ProposalPublic[]>([]);
  const { getMyProposals } = useContractCustom();
  const { connectionStatus, address } = useWallet();

  useEffect(() => {
    const fetchData = async () => {
      if (!!address && connectionStatus === loginStatus.CONNECTED) {
        const proposals = await getMyProposals(1, address);
        setActiveVotings(proposals);
      }
    };
    fetchData();
  }, [address, connectionStatus]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#f7cf1d]">
          Active Votings
        </h1>

        <div className="grid gap-6 lg:grid-cols-1">
          <div className="lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-3">
              {activeVotings.map((voting) => (
                <Card
                  key={voting.id}
                  className="bg-gray-900 border-[#f7cf1d] flex flex-col"
                >
                  <CardHeader>
                    <CardTitle className="text-[#f7cf1d]">
                      {voting.name}
                    </CardTitle>
                  </CardHeader>
                  {/*<CardContent className="flex-grow">
                    <p className="text-gray-300 mb-4">{voting.description}</p>
                  </CardContent>*/}
                  <CardContent>
                    <Button
                      asChild
                      className="w-full bg-[#f7cf1d] text-black hover:bg-[#e5bd0e]"
                    >
                      <Link href={`/voting/${voting.id}`}>Vote Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
